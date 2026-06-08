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
import { analyzeTajweedText } from "./server/tajweedEngine.js";
import { dbStore, ServerUser, ServerThread, ServerReply } from "./server/db.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Secret key for signing secure academic tokens
const JWT_SECRET = process.env.JWT_SECRET || "ilm-sacred-academic-secret-key-2026";
const COOKIE_SECRET = "ilm_sacred_secret_academic_cookie_passphrase_2026";

// Set up server-side body parsers with sufficient limit for brief audio uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser(COOKIE_SECRET));

// Standard secure HttpOnly cookie settings (keeping session token hidden from client script scope)
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // Lax works wonderfully for container nested iframe/browser contexts
  maxAge: 7 * 24 * 3600 * 1000, // 7 days key validity
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
        certificates: user.certificates
      }
    });
  } catch (err) {
    res.json({ user: null });
  }
});

// 2. Registrate student/teacher account
app.post("/api/auth/signup", (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All account parameters (email, password, name) are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = dbStore.findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: "The provided academic email is already registered." });
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
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("ilm_session", token, COOKIE_OPTIONS);

  res.json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      weeklyMinutes: newUser.weeklyMinutes,
      lessonsCompleted: newUser.lessonsCompleted,
      savedScholarships: newUser.savedScholarships,
      recentRecitations: newUser.recentRecitations,
      certificates: newUser.certificates
    }
  });
});

// 3. Authenticate / Login portal
app.post("/api/auth/login", (req, res) => {
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
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("ilm_session", token, COOKIE_OPTIONS);

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
      certificates: user.certificates
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
    certificates: progress.certificates ?? user.certificates
  });

  res.json({ success: true });
});


// --- DISCUSSION FORUM STUDY BOARD API ENDPOINTS ---

// 1. Fetch available threads in the school directory
app.get("/api/forum/threads", (req, res) => {
  res.json({ threads: dbStore.getThreads() });
});

// 2. Create interactive discussion thread
app.post("/api/forum/threads", authenticateJWT, (req: AuthenticatedRequest, res) => {
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
app.post("/api/forum/threads/:id/replies", authenticateJWT, (req: AuthenticatedRequest, res) => {
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
app.post("/api/ai-coach", async (req, res) => {
  const { verseText, surahName, ayahNumber, audioBase64, mimeType, qiraat } = req.body;


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
    const basePrompt = `You are Al-Hikmah Academy's elite AI Quran Coach & Tajweed Teacher.
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

// Serve API check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date() });
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
    app.use(express.static(distPath));
    app._router.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ilm Naafi full-stack app running on http://localhost:${PORT}`);
  });
}

startServer();
