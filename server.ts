/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import http from "http";
import https from "https";
import { WebSocketServer, WebSocket } from "ws";
import { analyzeTajweedText } from "./server/tajweedEngine.js";
import { dbStore, ServerUser, ServerThread, ServerReply, ServerIssue } from "./server/db.js";

dotenv.config();

// Mute debug logging in production, but preserve errors and warnings for proper diagnostics
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

// Resilient helper to fetch external audio assets without SSL/TLS chain rejections (critical for everyayah.com)
function fetchWithNoTLS(urlStr: string, timeoutMs: number = 12000): Promise<{ buffer: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    const handleRequest = (currentUrlStr: string) => {
      const isHttps = currentUrlStr.startsWith("https://");
      const client = isHttps ? https : http;
      
      const options: any = {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      };

      if (isHttps) {
        options.agent = new https.Agent({ rejectUnauthorized: false });
      }
      
      const req = client.get(currentUrlStr, options, (response) => {
        const { statusCode } = response;
        
        // Handle redirect
        if (statusCode && statusCode >= 300 && statusCode < 400 && response.headers.location) {
          let redirectUrl = response.headers.location;
          if (!redirectUrl.startsWith("http")) {
            try {
              const parsedCurrent = new URL(currentUrlStr);
              redirectUrl = new URL(redirectUrl, parsedCurrent.origin).toString();
            } catch (err) {
              reject(new Error("Failed to parse relative redirect URL: " + redirectUrl));
              return;
            }
          }
          handleRequest(redirectUrl);
          return;
        }
        
        if (statusCode !== 200) {
          reject(new Error(`Server responded with status code ${statusCode}`));
          return;
        }
        
        const chunks: any[] = [];
        response.on("data", (chunk) => {
          chunks.push(chunk);
        });
        
        response.on("end", () => {
          resolve({
            buffer: Buffer.concat(chunks),
            contentType: response.headers["content-type"] || "audio/mpeg"
          });
        });
      });
      
      req.on("error", (err) => {
        reject(err);
      });
      
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        reject(new Error(`Request timed out fetching audio after ${timeoutMs}ms`));
      });
    };
    
    handleRequest(urlStr);
  });
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const wsClients = new Map<string, WebSocket>();

// Real-Time notification dispatcher
function sendLiveNotification(targetEmail: string, notification: { title: string; body: string; type: string; referenceId?: string }) {
  const normEmail = targetEmail.toLowerCase();
  const user = dbStore.findUserByEmail(normEmail);
  if (!user) return;

  const notifId = "notif_" + Math.random().toString(36).substr(2, 9);
  const serverNotif = {
    id: notifId,
    title: notification.title,
    body: notification.body,
    type: notification.type as any,
    referenceId: notification.referenceId,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  if (!user.notifications) {
    user.notifications = [];
  }
  user.notifications.unshift(serverNotif);
  dbStore.updateUserProfile(user.id, { notifications: user.notifications });

  // Publish to connected WebSocket client
  const ws = wsClients.get(normEmail);
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify({
        type: "notification",
        notification: serverNotif
      }));
    } catch (e) {
      console.error("Failed to push websocket notification:", e);
    }
  }
}

// Set up WebSocket handlers
wss.on("connection", (ws: WebSocket) => {
  let userEmail: string | null = null;
  
  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "register" && data.email) {
        userEmail = data.email.toLowerCase();
        wsClients.set(userEmail, ws);
        
        ws.send(JSON.stringify({
          type: "registered",
          email: userEmail,
          message: "Real-time sync established with Ilm Naafi Academy server."
        }));
      }
      if (data.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
      }
    } catch (e) {
      console.error("WS error handling:", e);
    }
  });

  ws.on("close", () => {
    if (userEmail) {
      wsClients.delete(userEmail);
    }
  });
});

// Secret key for signing secure academic tokens
const JWT_SECRET = process.env.JWT_SECRET || "ilm-sacred-academic-secret-key-2026";
const COOKIE_SECRET = "ilm_sacred_secret_academic_cookie_passphrase_2026";

// Set up server-side body parsers with sufficient limit for brief audio uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser(COOKIE_SECRET));

// In-Memory production rate limiter for sensitive endpoints
const rateLimitRegistry = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(limit: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anonymous_client";
    const now = Date.now();
    const record = rateLimitRegistry.get(clientIp);

    if (!record || now > record.resetAt) {
      rateLimitRegistry.set(clientIp, {
        count: 1,
        resetAt: now + windowMs
      });
      return next();
    }

    if (record.count >= limit) {
      return res.status(429).json({
        error: "Too many actions requested. Please pacify your requests and try again shortly."
      });
    }

    record.count += 1;
    next();
  };
}

// In-Memory production operations duplicate/idempotency guard
const processedIdempotencyKeys = new Set<string>();

function checkIdempotency(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = (req.headers["x-idempotency-key"] || req.headers["idempotency-key"]) as string;
  if (!key) {
    return next();
  }

  if (processedIdempotencyKeys.has(key)) {
    return res.status(409).json({
      error: "Duplicate request filtered. This action has already been successfully submitted and logged on the server."
    });
  }

  processedIdempotencyKeys.add(key);
  setTimeout(() => {
    processedIdempotencyKeys.delete(key);
  }, 10 * 60 * 1000); // 10 minutes cache duration

  next();
}

// Ensure all API responses bypass client/proxy caching so data remains perfectly live
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  next();
});

// Protect all APIs with a rate limit of 180 requests per minute per IP
app.use("/api", rateLimiter(180, 60000));

// Enforce idempotency on mutate operations (POST, PUT, DELETE)
app.use("/api", (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
    return checkIdempotency(req, res, next);
  }
  next();
});

// Standard secure HttpOnly cookie settings (keeping session token hidden from client script scope)
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // Lax works wonderfully for container nested iframe/browser contexts
  maxAge: 1 * 24 * 3600 * 1000, // 1 day key validity (24 hours automatic logout requirement)
  path: "/"
};

// Cryptographic password hashing helper using native Node core modules
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Custom request interface extension for typescript safety
interface AuthenticatedRequest extends express.Request {
  user?: ServerUser;
}

// Authentication Middleware checking the HttpOnly cookie's validity or Authorization headers
function authenticateJWT(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  let token = req.cookies?.ilm_session;
  
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }
  
  if (!token) {
    return res.status(401).json({ error: "Access denied. Active session required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = dbStore.findUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: "Access denied. Matching scholar profile not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired or corrupted. Please authorize credentials again." });
  }
}

// --- SECURE AUTHENTICATION ENDPOINTS (HttpOnly Cookie & Bearer driven) ---

// 1. Get current active session
app.get("/api/auth/session", (req: AuthenticatedRequest, res) => {
  let token = req.cookies?.ilm_session;
  
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = dbStore.findUserById(decoded.id);
    
    if (!user) {
      return res.json({ user: null });
    }

    // Return safe presentation
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        weeklyMinutes: user.weeklyMinutes,
        lessonsCompleted: user.lessonsCompleted,
        savedScholarships: user.savedScholarships,
        recentRecitations: user.recentRecitations,
        certificates: user.certificates,
        joinedForums: user.joinedForums || [],
        notifications: user.notifications || []
      }
    });
  } catch (err) {
    res.json({ user: null });
  }
});

// 2. Registrate student/teacher account
app.post("/api/auth/signup", rateLimiter(15, 15 * 60 * 1000), (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All account parameters (email, password, name) are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Strict email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: "The provided academic email address format is invalid." });
  }

  // Name validation
  if (name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter your full academic name (minimum 2 characters)." });
  }

  // Password length validation
  if (password.trim().length < 6) {
    return res.status(400).json({ error: "Your access password PIN should be at least 6 characters in length to safeguard your study history." });
  }

  const existingUser = dbStore.findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: "This academic email is already registered on our global ledger." });
  }

  const userId = "usr_" + Math.random().toString(36).substr(2, 9);
  const passwordHash = hashPassword(password);

  const newUser: ServerUser = {
    id: userId,
    username: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: role || "student",
    weeklyMinutes: 0,
    lessonsCompleted: [],
    savedScholarships: [],
    recentRecitations: [],
    certificates: []
  };

  dbStore.createUser(newUser);

  // Sign credential
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1d" });
  res.cookie("ilm_session", token, COOKIE_OPTIONS);

  res.json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      role: newUser.role,
      weeklyMinutes: newUser.weeklyMinutes,
      lessonsCompleted: newUser.lessonsCompleted,
      savedScholarships: newUser.savedScholarships,
      recentRecitations: newUser.recentRecitations,
      certificates: newUser.certificates,
      joinedForums: newUser.joinedForums || [],
      notifications: newUser.notifications || []
    }
  });
});

// 3. Authenticate / Login portal
app.post("/api/auth/login", rateLimiter(30, 15 * 60 * 1000), (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Both email and login pin credentials are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = dbStore.findUserByEmail(normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: "Account credentials matching this email do not exist." });
  }

  const checkHash = hashPassword(password);
  if (user.passwordHash !== checkHash) {
    return res.status(401).json({ error: "Incorrect Access PIN or password." });
  }

  // Sign credential
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
  res.cookie("ilm_session", token, COOKIE_OPTIONS);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      weeklyMinutes: user.weeklyMinutes,
      lessonsCompleted: user.lessonsCompleted,
      savedScholarships: user.savedScholarships,
      recentRecitations: user.recentRecitations,
      certificates: user.certificates,
      joinedForums: user.joinedForums || [],
      notifications: user.notifications || []
    }
  });
});

// 4. Terminate session / SignOut clear cookie
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("ilm_session", { path: "/" });
  res.json({ success: true });
});

// 5. Update user academic progress
app.post("/api/auth/update-session", authenticateJWT, (req: AuthenticatedRequest, res) => {
  const { progress } = req.body;
  const user = req.user;

  if (!user || !progress) {
    return res.status(400).json({ error: "Malformed update body criteria." });
  }

  // Persist progression metrics safely
  dbStore.updateUserProfile(user.id, {
    weeklyMinutes: progress.weeklyMinutes ?? user.weeklyMinutes,
    lessonsCompleted: progress.lessonsCompleted ?? user.lessonsCompleted,
    savedScholarships: progress.savedScholarships ?? user.savedScholarships,
    recentRecitations: progress.recentRecitations ?? user.recentRecitations,
    certificates: progress.certificates ?? user.certificates,
    joinedForums: progress.joinedForums ?? user.joinedForums,
    notifications: progress.notifications ?? user.notifications
  });

  res.json({ success: true });
});

// 6. Cryptographic self-healing session synchronization on container reboot/deploy
app.post("/api/auth/sync-session", (req, res) => {
  let token = req.cookies?.ilm_session;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Missing session token for sync." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const { user } = req.body;

    if (!user || user.id !== decoded.id || user.email.toLowerCase() !== decoded.email.toLowerCase()) {
      return res.status(400).json({ error: "Cryptographic session payload signature mismatch." });
    }

    const existingUser = dbStore.findUserById(user.id);
    if (!existingUser) {
      const newUser: ServerUser = {
        id: user.id,
        username: user.username,
        email: user.email.toLowerCase(),
        passwordHash: user.passwordHash || hashPassword(crypto.randomBytes(16).toString("hex")),
        role: user.role || "student",
        weeklyMinutes: user.weeklyMinutes || 0,
        lessonsCompleted: user.lessonsCompleted || [],
        savedScholarships: user.savedScholarships || [],
        recentRecitations: user.recentRecitations || [],
        certificates: user.certificates || [],
        joinedForums: user.joinedForums || [],
        notifications: user.notifications || []
      };
      dbStore.createUser(newUser);
      console.warn(`[Database] Cryptographically restored user from self-healing token: ${newUser.email}`);
    } else {
      dbStore.updateUserProfile(user.id, {
        weeklyMinutes: Math.max(existingUser.weeklyMinutes, user.weeklyMinutes || 0),
        lessonsCompleted: Array.from(new Set([...(existingUser.lessonsCompleted || []), ...(user.lessonsCompleted || [])])),
        savedScholarships: Array.from(new Set([...(existingUser.savedScholarships || []), ...(user.savedScholarships || [])])),
        recentRecitations: [...(existingUser.recentRecitations || []), ...(user.recentRecitations || [])].slice(-20),
        certificates: [...(existingUser.certificates || []), ...(user.certificates || [])]
      });
    }

    const updatedUser = dbStore.findUserById(user.id);
    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    res.status(401).json({ error: "Session verification expired or failed: " + err.message });
  }
});


// --- DISCUSSION FORUM STUDY BOARD API ENDPOINTS ---

// 1. Fetch available threads in the school directory
app.get("/api/forum/threads", (req, res) => {
  res.json({ threads: dbStore.getThreads() });
});

// 2. Create interactive discussion thread
app.post("/api/forum/threads", authenticateJWT, checkIdempotency, (req: AuthenticatedRequest, res) => {
  const { title, category, body } = req.body;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Unauthorized access" });
  if (!title || !body || !category) {
    return res.status(400).json({ error: "Required thread properties (title, category, body) missing." });
  }

  const currentRole = user.role === "teacher" ? "Faculty Qari" : user.role === "researcher" ? "Academic Researcher" : "Student Scholar";
  const currentAvatar = user.role === "teacher" 
    ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" 
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";

  const threadId = "thread_" + Math.random().toString(36).substr(2, 9);
  const newThread: ServerThread = {
    id: threadId,
    title,
    body,
    category,
    author_id: user.id,
    author_name: user.username,
    author_role: currentRole,
    author_avatar: currentAvatar,
    thumbs_up: 0,
    liked_by: [],
    created_at: new Date().toISOString(),
    replies: []
  };

  dbStore.addThread(newThread);

  // Send real-time notifications to users who have joined this category forum
  const allUsersList = dbStore.getUsers();
  for (const recipient of allUsersList) {
    if (recipient.id !== user.id && recipient.joinedForums?.includes(category)) {
      sendLiveNotification(recipient.email, {
        title: `New topic in ${category === 'recitation' ? 'Tajweed' : category === 'history' ? 'History' : category === 'jurisprudence' ? 'Jurisprudence' : category === 'scholarships' ? 'Scholarships' : 'General'}`,
        body: `${user.username} posted: "${title.substring(0, 45)}${title.length > 45 ? '...' : ''}"`,
        type: 'forum_msg',
        referenceId: threadId
      });
    }
  }

  res.json({ thread: newThread });
});

// 3. Destroy a forum thread (restricted to creators or faculty/teachers)
app.delete("/api/forum/threads/:id", authenticateJWT, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const thread = dbStore.findThreadById(id);

  if (!thread) {
    return res.status(404).json({ error: "Discussion thread not found." });
  }

  if (thread.author_id === user.id || user.role === "teacher") {
    dbStore.deleteThread(id);
    return res.json({ success: true });
  }

  res.status(403).json({ error: "Access denied. Only the discussion creator or faculty can remove topics." });
});

// 4. Emulate or register interactive thumbs up / support
app.post("/api/forum/threads/:id/like", authenticateJWT, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Authentication status required." });
  const thread = dbStore.findThreadById(id);

  if (!thread) {
    return res.status(404).json({ error: "Discussion topic not found." });
  }

  const email = user.email.toLowerCase();
  let updatedLikedBy = [...thread.liked_by];
  const index = updatedLikedBy.indexOf(email);

  if (index > -1) {
    updatedLikedBy.splice(index, 1);
  } else {
    updatedLikedBy.push(email);
  }

  dbStore.updateThread(id, {
    liked_by: updatedLikedBy,
    thumbs_up: updatedLikedBy.length
  });

  const updatedThread = dbStore.findThreadById(id)!;
  res.json({
    thread: {
      id: updatedThread.id,
      title: updatedThread.title,
      body: updatedThread.body,
      category: updatedThread.category,
      author_id: updatedThread.author_id,
      author: updatedThread.author_name,
      role: updatedThread.author_role,
      avatar: updatedThread.author_avatar,
      thumbsUp: updatedThread.thumbs_up,
      likedBy: updatedThread.liked_by,
      date: new Date(updatedThread.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      replies: updatedThread.replies.map(r => ({
        id: r.id,
        body: r.body,
        author: r.author_name,
        role: r.author_role,
        avatar: r.author_avatar,
        date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      }))
    }
  });
});

// 5. Append replies to a topic
app.post("/api/forum/threads/:id/replies", authenticateJWT, checkIdempotency, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { body } = req.body;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Access denied." });
  if (!body || !body.trim()) {
    return res.status(400).json({ error: "Reply body cannot be left blank." });
  }

  const thread = dbStore.findThreadById(id);
  if (!thread) {
    return res.status(404).json({ error: "Discussion topic not found." });
  }

  const currentRole = user.role === "teacher" ? "Faculty Qari" : user.role === "researcher" ? "Academic Researcher" : "Student Scholar";
  const currentAvatar = user.role === "teacher" 
    ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" 
    : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150";

  const replyId = "rep_" + Math.random().toString(36).substr(2, 9);
  const newReply: ServerReply = {
    id: replyId,
    body: body.trim(),
    author_name: user.username,
    author_role: currentRole,
    author_avatar: currentAvatar,
    created_at: new Date().toISOString()
  };

  const updatedReplies = [...thread.replies, newReply];
  dbStore.updateThread(id, { replies: updatedReplies });

  // Send real-time notifications to the thread author and any subscribed category peers
  const threadAuthor = dbStore.findUserById(thread.author_id);
  if (threadAuthor && threadAuthor.id !== user.id) {
    sendLiveNotification(threadAuthor.email, {
      title: "New reply on your thread",
      body: `${user.username} replied: "${body.substring(0, 40)}${body.length > 40 ? '...' : ''}"`,
      type: 'forum_reply',
      referenceId: thread.id
    });
  }

  // Notify other members of joined category forum who are NOT the replier or the author
  const activeCategory = thread.category;
  const allUsersList = dbStore.getUsers();
  for (const recipient of allUsersList) {
    if (recipient.id !== user.id && recipient.id !== thread.author_id && recipient.joinedForums?.includes(activeCategory)) {
      sendLiveNotification(recipient.email, {
        title: `Comment thread update`,
        body: `${user.username} answered in joined ${activeCategory === 'recitation' ? 'Tajweed' : activeCategory === 'history' ? 'History' : activeCategory === 'jurisprudence' ? 'Jurisprudence' : activeCategory === 'scholarships' ? 'Scholarships' : 'General'} forum.`,
        type: 'forum_reply',
        referenceId: thread.id
      });
    }
  }

  const updatedThread = dbStore.findThreadById(id)!;
  res.json({
    thread: {
      id: updatedThread.id,
      title: updatedThread.title,
      body: updatedThread.body,
      category: updatedThread.category,
      author_id: updatedThread.author_id,
      author: updatedThread.author_name,
      role: updatedThread.author_role,
      avatar: updatedThread.author_avatar,
      thumbsUp: updatedThread.thumbs_up,
      likedBy: updatedThread.liked_by,
      date: new Date(updatedThread.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      replies: updatedThread.replies.map(r => ({
        id: r.id,
        body: r.body,
        author: r.author_name,
        role: r.author_role,
        avatar: r.author_avatar,
        date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      }))
    }
  });
});


// Join a specific forum category to receive live pushes and alerts
app.post("/api/forum/join", authenticateJWT, (req: AuthenticatedRequest, res) => {
  const { category } = req.body;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Unauthorized access" });
  if (!category) return res.status(400).json({ error: "Missing category reference." });

  const currentJoined = user.joinedForums || [];
  if (!currentJoined.includes(category)) {
    const updated = [...currentJoined, category];
    dbStore.updateUserProfile(user.id, { joinedForums: updated });
    return res.json({ success: true, joinedForums: updated });
  }

  res.json({ success: true, joinedForums: currentJoined });
});

// Leave a specific forum category
app.post("/api/forum/leave", authenticateJWT, (req: AuthenticatedRequest, res) => {
  const { category } = req.body;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Unauthorized access" });
  if (!category) return res.status(400).json({ error: "Missing category reference." });

  const currentJoined = user.joinedForums || [];
  const updated = currentJoined.filter(c => c !== category);
  dbStore.updateUserProfile(user.id, { joinedForums: updated });
  res.json({ success: true, joinedForums: updated });
});

// Mark notification as read (either single or 'all')
app.post("/api/notifications/read", authenticateJWT, (req: AuthenticatedRequest, res) => {
  const { notificationId } = req.body;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Unauthorized access" });

  const notifications = user.notifications || [];
  if (notificationId === 'all') {
    notifications.forEach(n => { n.isRead = true; });
  } else {
    const target = notifications.find(n => n.id === notificationId);
    if (target) {
      target.isRead = true;
    }
  }

  dbStore.updateUserProfile(user.id, { notifications });
  res.json({ success: true, notifications });
});

// Clear all notifications archive
app.post("/api/notifications/clear", authenticateJWT, (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  dbStore.updateUserProfile(user.id, { notifications: [] });
  res.json({ success: true, notifications: [] });
});

// Simulator to broadcast peer questions or replies to showcase immediate WebSockets sync
app.post("/api/forum/simulate-activity", (req, res) => {
  const { category, type } = req.body;
  const normalizedCat = category || 'general';
  const displayCategoryName = normalizedCat === 'recitation' ? 'Tajweed' : normalizedCat === 'history' ? 'History' : normalizedCat === 'jurisprudence' ? 'Jurisprudence' : normalizedCat === 'scholarships' ? 'Scholarships' : 'General';

  const mockUsers = [
    { name: "Sheikh Abdulrahman Al-Arifi", email: "abdulrahman@ilmnaafi.edu", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { name: "Dr. Maryam Cordobese", email: "maryam@ilmnaafi.edu", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
    { name: "Brother Zayd Al-Faruqi", email: "zayd@ilmnaafi.edu", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" }
  ];

  const selectedMock = mockUsers[Math.floor(Math.random() * mockUsers.length)];

  let title = "";
  let body = "";

  if (type === 'topic') {
    title = `Urgent Inquiry regarding classic rules of script readings in ${displayCategoryName}`;
    body = `I have completed translating the secondary manuscript commentary from Al-Mustansiriya collections. Let's start a study circle session!`;
  } else {
    title = `New Response in ${displayCategoryName} Study Thread`;
    body = `Excellent answer! We should organize a weekly micro-seminar this Saturday at 14:00 UTC to consolidate these legal opinions.`;
  }

  // Send to all users connected/subscribed to normalizedCat
  const allUsersList = dbStore.getUsers();
  let countDispatched = 0;

  for (const recipient of allUsersList) {
    if (recipient.joinedForums?.includes(normalizedCat)) {
      sendLiveNotification(recipient.email, {
        title: title,
        body: `${selectedMock.name} posted: "${body}"`,
        type: type === 'topic' ? 'forum_msg' : 'forum_reply',
        referenceId: 'thread_1'
      });
      countDispatched++;
    }
  }

  res.json({ success: true, countDispatched, message: "Live activity socket stream successfully broadcasted." });
});


// Lazy initializer for Google GenAI client to handle missing key gracefully on dev launch
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST Endpoint: Get Recitation Feedback (Actual Audio or Simulated Recitation)
app.post("/api/ai-coach", rateLimiter(50, 15 * 60 * 1000), async (req, res) => {
  const { verseText, surahName, ayahNumber, audioBase64, mimeType, qiraat, isMurajah } = req.body;


  if (!verseText || !surahName) {
    return res.status(400).json({ error: "Required parameters (verseText, surahName) are missing." });
  }

  // 1. Run standard deterministic rules engine as absolute validation ground truth
  const deterministicAnalysis = analyzeTajweedText(verseText, qiraat || "hafs");
  const parsedRulesText = JSON.stringify(deterministicAnalysis.words.map(w => ({
    word: w.wordText,
    rules: w.occurrences.map(o => ({
      name: o.ruleName,
      cat: o.category,
      desc: o.description,
      makhraj: o.makhrajInteractiveDetails.title,
      beats: o.durationBeats
    }))
  })), null, 2);

  try {
    const ai = getAI();
    let contents: any[] = [];

    // Instruction prompt grounded with Phase 1 engine guidelines
    let basePrompt = `You are Ilm Naafi Academy's elite AI Quran Coach & Tajweed Teacher.
Analyze a student reciting:
Surah: ${surahName}
Ayah / Verse: ${ayahNumber || 1}
Correct Text: "${verseText}"
Qiraat Mode: ${(qiraat || "hafs").toUpperCase()}

Our deterministic Tajweed Rules Engine has analyzed this verse and identified the following rules as ground-truth checkpoints:
${parsedRulesText}

Validate student recitation. Evaluate pronunciation, clarity of throat/consonant letters, and duration accuracy of vowel elongation (Madd counts) or nasalization (Ghunnah beats).
Provide:
1. Overall score (0 to 100)
2. Fluency score (0 to 100)
3. Pronunciation accuracy score (0 to 100)
4. A reassuring, encouraging, yet highly technical feedback paragraph
5. An array of specific corrective notes pointing to words in the verse if possible. Mark each note with a level: 'success' (for excellent Tajweed mastery), 'warning' (for mistakes or parts needing correction), or 'info' (for general training tips). Make sure you highlight specific words from the ground-truth rules!

Provide your response in raw JSON format matching this schema strictly. Don't add backticks or markdown wrapper.`;

    if (isMurajah) {
      basePrompt = `You are Ilm Naafi Academy's elite AI Quran Murajah (Memorization) Auditor.
Analyze a student revising/reciting a verse from memory where the Quran text is completely hidden from them:
Surah: ${surahName}
Ayah / Verse: ${ayahNumber || 1}
Ground-Truth Correct Text: "${verseText}"
Qiraat Mode: ${(qiraat || "hafs").toUpperCase()}

Our deterministic Tajweed Rules Engine has mapped the core rules for references:
${parsedRulesText}

Compare the user's spoken audio directly with the Ground-Truth Correct Text.
Meticulously identify:
- Any omitted words (words they forgot and skipped entirely)
- Any substituted words (words where they said a wrong or alternative term)
- Any pronunciation issues, word stutters, layout mistakes, or active tajweed omissions

Return a report containing:
1. Overall memory accuracy score (0 to 100) - evaluate how completely they remembered the verse.
2. Fluency score (0 to 100)
3. Pronunciation accuracy score (0 to 100)
4. A supportive yet technically exact "feedbackText" feedback paragraph. Clearly list any omitted words or replacements by quoting them (e.g. "You omitted '[word]'...").
5. An array of specific notes pointing to words in the ground-truth verse. For example, if a word was skipped/omitted, provide a note targeting that specific Arabic word stating 'Skipped / Omitted from memory' with type: 'warning'. If a word was pronounced perfectly, add a success note!

Provide your response in raw JSON format matching this schema strictly. Don't add backticks or markdown wrapper.`;
    }

    if (audioBase64 && mimeType) {
      // Multimodal audio evaluation (Phase 3)
      contents = [
        {
          inlineData: {
            mimeType,
            data: audioBase64,
          },
        },
        {
          text: `${basePrompt}\n\nPlease evaluate the attached audio recording of the user reciting this verse. Verify it meticulously against the ground-truth rules list above. If the audio is empty, silent, or unrelated, still return a meaningful report with low scores (<50) and a supportive explanation.`,
        },
      ];
    } else {
      // Text guided simulated evaluation / Tutorial mode
      contents = [
        {
          text: `${basePrompt}\n\nSince no microphone capture was provided, formulate a theoretical coaching feedback report as if the student recited it with standard beginner-level errors (e.g. omitting the Ghunnah/nasalization, or under-prolonging the Madd vowel sounds, or mispronouncing throat letters). Ground this realistic feedback strictly in the rules listed above, detailing how the user can improve.`,
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            fluencyScore: { type: Type.INTEGER },
            pronunciationScore: { type: Type.INTEGER },
            feedbackText: { type: Type.STRING },
            notes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "Detailed educational feedback or correction note" },
                  type: { type: Type.STRING, description: "Must be 'success', 'warning', or 'info'" },
                  word: { type: Type.STRING, description: "The specific Arabic word or word phrase in the verse this refers to" },
                },
                required: ["text", "type"],
              },
            },
          },
          required: ["overallScore", "fluencyScore", "pronunciationScore", "feedbackText", "notes"],
        },
      },
    });

    const textOutput = response.text || "{}";
    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error: any) {
    console.error("AI Coach Request Failed:", error);
    res.status(500).json({
      error: "Recitation analysis failed. Make sure your Gemini API key is configured correctly in Secrets.",
      details: error.message,
    });
  }
});

// REST Endpoint: Parse any Quranic verse using the pure deterministic Rules Engine
app.post("/api/tajweed-parse", (req, res) => {
  const { text, qiraat } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Required parameter 'text' is missing." });
  }
  try {
    const analysis = analyzeTajweedText(text, qiraat || "hafs");
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to parse text containing rules.", details: err.message });
  }
});

// REST Endpoint: Ask the Mufti (Academic & Scholarly Q&A)
app.post("/api/scholarly", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question was provided." });
  }

  // Pre-configured elegant fallback for offline/development mode
  const offlineFallbacks: { [key: string]: any } = {
    "prayer": {
      answer: "Prayer (Salah) is the second pillar of Islam and serves as the daily spiritual connection between a servant and the Creator. It teaches discipline, mindfulness (Khushu), and constant remembrance of the Divine, purifying the soul five times daily.",
      scholars: "Hanafi, Shafi'i, Maliki, and Hanbali schools all agree on the absolute obligation of the five daily prayers, differing mainly in minor physical postures and supplementary supplications. Classic jurists like Imam Al-Ghazali stress that the absolute soul of Salah is mindfulness (Khushu).",
      verses: [
        { text: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ", translation: "And establish prayer and give Zakah and bow with those who bow [in worship]." }
      ],
      actionItems: ["Focus on breathing slowly before entering Takbir", "Review the literal meaning of Tashahhud to heighten focus", "Pace your recitation of verses during individual cycles"]
    },
    "default": {
      answer: "Searching for beneficial and authentic knowledge (Ilm Naafi) is designated as a spiritual duty for every single student. Understanding history, foundational classical jurisprudences, and beautiful character values empowers a balanced life.",
      scholars: "Classic scholars like Imam Al-Shafi'i emphasized that knowledge is not merely what is memorized, but that which benefits. Scholars throughout Damascus, Baghdad, and Cordoba built massive review chains to verify the authenticity of all teachings.",
      verses: [
        { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", translation: "And say: 'O my Lord! Increase me in knowledge.'" }
      ],
      actionItems: ["Set aside consistent study windows daily", "Verify citations back to pristine primary sources", "Teach what you have mastered to family and peers"]
    }
  };

  try {
    const ai = getAI();
    const prompt = `You are a distinguished classical Islamic academic scholar and mufti.
Answer this student's theological, philosophical, linguistic or historical inquiry in a highly intellectual, comprehensive, and reassuring scholastic tone:
Student Inquiry: "${question}"

Formulate a response structuring:
1. "answer": A detailed explanation of the question's answers, addressing historical or contextual relevance.
2. "scholars": Highlights or synthesis of perspectives from major classical scholarly authorities (e.g. Al-Ghazali, Ibn Sina, or the dynamic classic schools of thought Hanafi, Maliki, Shafi'i, Hanbali).
3. "verses": An array containing a relevant Quranic verse or Hadith citation with its Arabic text and English translation.
4. "actionItems": An array of 3 practical, actionable tips for the student to integrate into their daily habit or learning journey.

Provide your response in raw JSON format matching this schema strictly. Don't add backticks or markdown wrapper.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            scholars: { type: Type.STRING },
            verses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  translation: { type: Type.STRING }
                },
                required: ["text", "translation"]
              }
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["answer", "scholars", "verses", "actionItems"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.warn("Using offline scholastic fallback:", error.message);
    const trigger = question.toLowerCase();
    let selected = offlineFallbacks.default;
    if (trigger.includes("prayer") || trigger.includes("salah") || trigger.includes("namaz")) {
      selected = offlineFallbacks.prayer;
    }
    res.json(selected);
  }
});

// REST Endpoint: Dynamic custom Supplication (Dua) creator
app.post("/api/dua-planner", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Please submit a topic for your Dua planner." });
  }

  // Purely dynamic simulated response fallback
  const fallbackDuas: { [key: string]: any } = {
    "studies": {
      topic: "Academic Concentration & beneficial studies",
      arabicText: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا",
      transliteration: "Allahumma-nfa'ni bima 'allamtani wal-'allimni ma yanfa'uni wa zidni 'ilman",
      translation: "O Allah, benefit me with that which You have taught me, and teach me that which will benefit me, and increase me in robust knowledge.",
      context: "This prayer is sourced from the certified traditions of Prophet Muhammad (peace be upon him). It teaches students to prioritize knowledge that converts into beneficial, practical works (Ilm Naafi) rather than merely prideful or idle theories."
    },
    "default": {
      topic: topic,
      arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
      translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
      context: "Known as the most comprehensive supplication from Surah Al-Baqarah (verse 201), seeking balanced spiritual nourishment, academic excellence, fine character, and eternal safety."
    }
  };

  try {
    const ai = getAI();
    const prompt = `Compose an authentic custom Quranic/prophetic style Supplication (Dua) for a student seeking divine guidance regarding this specific intention: "${topic}".
Create:
1. "topic": A title of this intention
2. "arabicText": The beautiful Arabic script of the supplication WITH complete vowels (tashkeel/harakat)
3. "transliteration": Pronunciation transcriptor in English
4. "translation": Precise translation in English
5. "context": The spiritual significance and advice on when this supplication is best made.

Provide your response in raw JSON format matching this schema strictly. Don't add backticks or markdown wrapper.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            arabicText: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            translation: { type: Type.STRING },
            context: { type: Type.STRING }
          },
          required: ["topic", "arabicText", "transliteration", "translation", "context"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (err: any) {
    console.warn("Using offline Dua fallback:", err.message);
    const trigger = topic.toLowerCase();
    let selected = fallbackDuas.default;
    if (trigger.includes("study") || trigger.includes("exam") || trigger.includes("knowledge") || trigger.includes("class")) {
      selected = fallbackDuas.studies;
    }
    res.json(selected);
  }
});

// Serve authentic daily reminders collection
app.get("/api/adhkar", (req, res) => {
  const category = (req.query.category as string || "anxiety").toLowerCase();
  const items = [
    {
      id: "tr_01",
      category: "travel",
      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ",
      transliteration: "Subhanal-ladhee sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina lamunqaliboon.",
      translationEn: "Glory to Him Who has subjected this to us, and we could never have it by our effort. And indeed, to our Lord we will return.",
      source: "Surah Az-Zukhruf 13-14",
      grade: "Sahih"
    },
    {
      id: "tr_02",
      category: "travel",
      arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى",
      transliteration: "Allahumma inna nas'aluka fee safarina hadhal-birra wat-taqwa, wa minal-'amali ma tardha.",
      translationEn: "O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You.",
      source: "Sahih Muslim 1342",
      grade: "Sahih"
    },
    {
      id: "ax_01",
      category: "anxiety",
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
      transliteration: "La ilaha illallahul-'Adheemul-Haleem, la ilaha illallahu Rabbul-'Arshil-'Adheem...",
      translationEn: "There is no deity except Allah, the All-Great, the Forbearing; there is no deity except Allah, Lord of the Magnificent Throne...",
      source: "Bukhari 6346 / Muslim 2730",
      grade: "Sahih"
    },
    {
      id: "ax_02",
      category: "anxiety",
      arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
      transliteration: "Ya Hayyu ya Qayyoomu bi-rahmatika astagheeth, aslih lee sha'nee kullahu wa la takilnee ila nafsee tarfata 'ayn.",
      translationEn: "O Ever-Living, O Sustainer, in Your mercy I seek relief. Amend all of my affairs and do not leave me to myself even for a blink of an eye.",
      source: "Al-Hakim / Sahih Al-Jami 3388",
      grade: "Sahih"
    },
    {
      id: "fd_01",
      category: "food",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      transliteration: "Al-hamdu lillahil-ladhee at'amanee hadha wa razaqaneehi min ghayri hawlin minnee wa la quwwah.",
      translationEn: "Praise is to Allah Who has fed me this and provided it for me without any strength or power on my part.",
      source: "At-Tirmidhi 3458",
      grade: "Hasan"
    }
  ];
  const filtered = items.filter(x => x.category === category);
  res.json(filtered.length > 0 ? filtered : items);
});

// Serve API check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date() });
});

// GET: Retrieve all reported issues (latest first)
app.get("/api/issues", (req, res) => {
  const issues = dbStore.getIssues();
  const sorted = [...issues].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  res.json(sorted);
});

// POST: Submit a new issue or feedback
app.post("/api/issues", express.json({ limit: '10mb' }), (req, res) => {
  const { name, email, issueType, description, screenshot } = req.body;

  if (!name || !email || !issueType || !description) {
    return res.status(400).json({ error: "Missing required fields (name, email, issueType, description)." });
  }

  const newIssue: ServerIssue = {
    id: "issue_" + Math.random().toString(36).substring(2, 9),
    name,
    email,
    issueType,
    description,
    screenshot,
    status: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dbStore.addIssue(newIssue);

  // Trigger simulated e-mail logs
  console.info(`\n📧 [EMAIL DISPATCHER] -> Sent to: devspak-s8@ilmnaafi.org\nSubject: New [${issueType}] reported by ${name}\nIssue ID: ${newIssue.id}\nDetail: ${description}\n`);

  res.status(201).json({ 
    success: true, 
    message: "Alhamdulillah! Your issue has been stored and escalated.",
    issue: newIssue
  });
});

// POST: Resolve / Update an existing issue
app.post("/api/issues/:id/resolve", express.json(), (req, res) => {
  const { id } = req.params;
  const { adminMemo, status } = req.body;

  const issue = dbStore.findIssueById(id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found." });
  }

  const targetStatus = status || 'Fixed';
  const updates: Partial<ServerIssue> = {
    status: targetStatus,
    adminMemo: adminMemo || "Marked as fixed by review board.",
    updated_at: new Date().toISOString()
  };

  dbStore.updateIssue(id, updates);

  // Trigger automatic email to reporter
  console.info(`\n📧 [EMAIL DISPATCHER] -> Sent to reporter: ${issue.email}\nSubject: [RESOLVED] Issue #${issue.id} status updated to ${targetStatus}\nMemo: ${updates.adminMemo}\n`);

  res.json({
    success: true,
    message: `Issue status updated to ${targetStatus}.`,
    issue: { ...issue, ...updates }
  });
});

// DELETE: Deletes an issue
app.delete("/api/issues/:id", (req, res) => {
  const { id } = req.params;
  const success = dbStore.deleteIssue(id);
  if (success) {
    res.json({ success: true, message: "Issue deleted successfully." });
  } else {
    res.status(404).json({ error: "Issue not found." });
  }
});

// Secure, CORS-enabled Audio Streaming Proxy to resolve browser Mixed Content (HTTP/HTTPS) and CORS blocks
app.get("/api/audio-proxy", async (req, res) => {
  const audioUrl = req.query.url as string;
  if (!audioUrl) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Restrict proxy to trusted hostnames to prevent open proxy vulnerability
  const isTrusted = 
    audioUrl.includes("everyayah.com") || 
    audioUrl.includes("alquran.cloud") || 
    audioUrl.includes("quranicaudio.com") || 
    audioUrl.includes("qurancentral.com") ||
    audioUrl.includes("mp3quran.net") ||
    audioUrl.includes("archive.org") ||
    audioUrl.includes("islamic.network");

  if (!isTrusted) {
    return res.status(403).json({ error: "Access to target domain not allowed. Trusted domain only." });
  }

  try {
    const candidates: string[] = [];

    // 1) Translate everyayah.com to high-availability cdn.alquran.cloud proactively
    if (audioUrl.includes("everyayah.com")) {
      try {
        const parts = audioUrl.split("/");
        const fileName = parts[parts.length - 1]; // e.g. "001001.mp3"
        const folderName = parts[parts.length - 2]; // e.g. "Ghamadi_40kbps"
        
        if (fileName && fileName.endsWith(".mp3") && folderName) {
          const digitsMatch = fileName.match(/(\d{6})/);
          if (digitsMatch) {
            const rawDigits = digitsMatch[1];
            const surah = parseInt(rawDigits.substring(0, 3), 10);
            const ayah = parseInt(rawDigits.substring(3, 6), 10);
            
            if (!isNaN(surah) && !isNaN(ayah)) {
              let edition = "ar.husary";
              if (folderName.includes("Ghamadi") || folderName.includes("ghamadi")) edition = "ar.alghamadi";
              else if (folderName.includes("Sudais") || folderName.includes("sudais")) edition = "ar.abdurrahmaansudais";
              else if (folderName.includes("Shuraym") || folderName.includes("shuraym") || folderName.includes("Saood")) edition = "ar.saoodshuraym";
              else if (folderName.includes("Muaiqly") || folderName.includes("muaiqly")) edition = "ar.mahermuaiqly";
              else if (folderName.includes("Matroud") || folderName.includes("matroud") || folderName.includes("matrood")) edition = "ar.abdullahmatroud";
              else if (folderName.includes("Tonaeijy") || folderName.includes("tunaiji")) edition = "ar.khalifatuntunaiji";
              else if (folderName.includes("Basit") || folderName.includes("basit")) {
                edition = folderName.includes("Mujawwad") || folderName.includes("mujawwad") ? "ar.abdulbasitmujawwad" : "ar.abdulbasitmurattal";
              } else if (folderName.includes("Ayyub") || folderName.includes("ayyub")) edition = "ar.muhammadayyoub";
              else if (folderName.includes("Minshawy") || folderName.includes("minshawi") || folderName.includes("Minshawi") || folderName.includes("minshawy")) {
                edition = folderName.includes("Mujawwad") || folderName.includes("mujawwad") ? "ar.minshawimujawwad" : "ar.minshawi";
              } else if (folderName.includes("Alafasy") || folderName.includes("afasy")) edition = "ar.alafasy";
              else if (folderName.includes("Warsh") || folderName.includes("warsh")) edition = "ar.hudhaify.warsh";

              candidates.push(`https://cdn.alquran.cloud/media/audio/ayah/${edition}/${surah}:${ayah}`);
            }
          }
        }
      } catch (e: any) {
        console.warn("[AudioProxy] proactive everyayah translation failed:", e.message);
      }
    }

    // 2) Translate quranicaudio.com to high-availability mp3quran.net or backup CDNs proactively
    if (audioUrl.includes("quranicaudio.com")) {
      try {
        const parts = audioUrl.split("/");
        const fileName = parts[parts.length - 1]; // e.g. "001.mp3"
        
        if (fileName && fileName.endsWith(".mp3")) {
          if (audioUrl.includes("mahmood_khaleel_al-husaree")) {
            candidates.push(`https://server13.mp3quran.net/husr/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/husr/${fileName}`);
          } else if (audioUrl.includes("sa3d_al_ghaamidi")) {
            candidates.push(`https://server7.mp3quran.net/s_gmd/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/s_gmd/${fileName}`);
          } else if (audioUrl.includes("shuraim") || audioUrl.includes("shuraym") || audioUrl.includes("saud_ash-shuraim") || audioUrl.includes("saud_ash-shuraym")) {
            candidates.push(`https://server7.mp3quran.net/shrm/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/shrm/${fileName}`);
          } else if (audioUrl.includes("abdurrahmaan_as-sudais")) {
            candidates.push(`https://server11.mp3quran.net/sds/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/sds/${fileName}`);
          } else if (audioUrl.includes("maher_al_muaiqly")) {
            candidates.push(`https://server12.mp3quran.net/maher/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/maher/${fileName}`);
          } else if (audioUrl.includes("abdullaah_al-matrood")) {
            candidates.push(`https://server8.mp3quran.net/mtrod/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/mtrod/${fileName}`);
          } else if (audioUrl.includes("abdul_basit_mujawwad")) {
            candidates.push(`https://server11.mp3quran.net/basit/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/basit/${fileName}`);
          } else if (audioUrl.includes("muhammad_ayyoob")) {
            candidates.push(`https://server8.mp3quran.net/ayoub/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/ayoub/${fileName}`);
          } else if (audioUrl.includes("muhammad_siddeeq_al-minshawee_mujawwad")) {
            candidates.push(`https://server11.mp3quran.net/minsh/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/minsh/${fileName}`);
          } else if (audioUrl.includes("mishari_rashid_al_afasy")) {
            candidates.push(`https://server8.mp3quran.net/afs/${fileName}`);
            candidates.push(`https://download.mp3quran.net/download/afs/${fileName}`);
          }
        }
      } catch (e: any) {
        console.warn("[AudioProxy] proactive quranicaudio translation failed:", e.message);
      }
    }

    // 3) Handle mp3quran.net folder alternates proactively
    if (audioUrl.includes("mp3quran.net")) {
      try {
        const parts = audioUrl.split("/");
        const fileName = parts[parts.length - 1]; // e.g. "001.mp3"
        const folderName = parts[parts.length - 2]; // e.g. "mtrod"
        if (fileName && fileName.endsWith(".mp3") && folderName) {
          if (folderName === "mtrod") {
            if (audioUrl.includes("download.mp3quran.net")) {
              candidates.push(`https://server8.mp3quran.net/mtrod/${fileName}`);
            } else {
              candidates.push(`https://download.mp3quran.net/download/mtrod/${fileName}`);
            }
          } else if (folderName === "qra") {
            candidates.push(`https://download.mp3quran.net/download/qra/${fileName}`);
          } else if (folderName === "shrm") {
            candidates.push(`https://download.quranicaudio.com/quran/saud_ash-shuraim/${fileName}`);
          } else if (folderName === "sds") {
            candidates.push(`https://download.quranicaudio.com/quran/abdurrahmaan_as-sudais/${fileName}`);
          } else if (folderName === "husr") {
            candidates.push(`https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree/${fileName}`);
          } else if (folderName === "s_gmd") {
            candidates.push(`https://download.quranicaudio.com/quran/sa3d_al_ghaamidi/complete/${fileName}`);
          } else if (folderName === "maher") {
            candidates.push(`https://download.quranicaudio.com/quran/maher_al_muaiqly/${fileName}`);
            candidates.push(`https://download.quranicaudio.com/quran/maher_al_muaiqly/complete/${fileName}`);
          } else if (folderName === "basit") {
            candidates.push(`https://download.quranicaudio.com/quran/abdul_basit_mujawwad/${fileName}`);
          } else if (folderName === "ayoub") {
            candidates.push(`https://download.quranicaudio.com/quran/muhammad_ayyoob/${fileName}`);
          } else if (folderName === "minsh") {
            candidates.push(`https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshawee_mujawwad/${fileName}`);
          } else if (folderName === "afs") {
            candidates.push(`https://download.quranicaudio.com/quran/mishari_rashid_al_afasy/${fileName}`);
          }
        }
      } catch (e: any) {
        console.warn("[AudioProxy] proactive mp3quran translation failed:", e.message);
      }
    }

    // 4) Handle archive.org alternates proactively
    if (audioUrl.includes("archive.org")) {
      try {
        const parts = audioUrl.split("/");
        const fileName = parts[parts.length - 1]; // e.g. "005.mp3"
        const digitsMatch = fileName.match(/(\d+)/);
        if (digitsMatch) {
          const surahNum = parseInt(digitsMatch[1], 10);
          if (!isNaN(surahNum) && surahNum >= 1 && surahNum <= 114) {
            const paddedSurah = String(surahNum).padStart(3, "0");
            if (audioUrl.includes("Okasha_Kameny_Full_Quran") || audioUrl.includes("KamenyOkasha-FullQuran")) {
              candidates.push(`https://archive.org/download/KamenyOkasha-FullQuran/${paddedSurah}.mp3`);
              candidates.push(`https://ia800100.us.archive.org/13/items/Okasha_Kameny_Full_Quran/${paddedSurah}.mp3`);
              candidates.push(`https://ia600100.us.archive.org/13/items/Okasha_Kameny_Full_Quran/${paddedSurah}.mp3`);
            }
            candidates.push(`https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree/${paddedSurah}.mp3`);
            candidates.push(`https://server13.mp3quran.net/husr/${paddedSurah}.mp3`);
            candidates.push(`https://server12.mp3quran.net/maher/${paddedSurah}.mp3`);
          }
        }
      } catch (e: any) {
        console.warn("[AudioProxy] proactive archive.org translation failed:", e.message);
      }
    }

    // Add original URL as fallback candidate
    candidates.push(audioUrl);

    // Deduplicate preserving insertion order
    const uniqueCandidates = Array.from(new Set(candidates));

    let successBuffer: Buffer | null = null;
    let successContentType = "audio/mpeg";
    let lastErrorMsg = "No candidates succeeded";

    for (const candidate of uniqueCandidates) {
      try {
        console.log(`[AudioProxy] Cascade fetch trying: ${candidate}`);
        const { buffer, contentType } = await fetchWithNoTLS(candidate, 3500); // 3.5s timeout fast fallback
        successBuffer = buffer;
        successContentType = contentType;
        console.log(`[AudioProxy] Cascade fetch SUCCEEDED for candidate: ${candidate}`);
        break;
      } catch (err: any) {
        console.warn(`[AudioProxy] Candidate failed: ${candidate}. Error: ${err.message}`);
        lastErrorMsg = err.message;
      }
    }

    if (successBuffer) {
      res.setHeader("Content-Type", successContentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for a year
      return res.status(200).send(successBuffer);
    } else {
      console.error(`[AudioProxy] Cascade failure for url: ${audioUrl}. Redirecting. Error: ${lastErrorMsg}`);
      return res.redirect(audioUrl);
    }
  } catch (err: any) {
    console.error(`[AudioProxy] Fatal error in audio-proxy cascade:`, err.message);
    return res.redirect(audioUrl);
  }
});

// Configure Vite integration
async function startServer() {
  // Synchronize generated PWA icon to the public folder if it doesn't already exist
  try {
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const sourceIcon = path.join(process.cwd(), "src", "assets", "images", "pwa_app_icon_1780897130746.png");
    if (fs.existsSync(sourceIcon)) {
      fs.copyFileSync(sourceIcon, path.join(publicDir, "icon-512.png"));
      fs.copyFileSync(sourceIcon, path.join(publicDir, "icon-192.png"));
      console.log("Successfully synchronized PWA launcher icons.");
    }
  } catch (err) {
    console.warn("Could not copy PWA launcher icons, using soft fallback: ", err);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "365d",
      etag: true,
      cacheControl: true
    }));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Ilm Naafi full-stack app running on http://localhost:${PORT}`);
  });
}

startServer();

export { app, server };
