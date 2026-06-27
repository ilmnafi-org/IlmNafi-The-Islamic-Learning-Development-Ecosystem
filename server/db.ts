/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseAdmin } from './supabase.js';
import fs from 'fs';
import path from 'path';

export interface ServerNotification {
  id: string;
  title: string;
  body: string;
  type: 'forum_msg' | 'forum_reply' | 'scholarly_alert' | 'system';
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ServerUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // Basic hashed storage
  role: 'student' | 'researcher' | 'teacher';
  weeklyMinutes: number;
  lessonsCompleted: string[];
  savedScholarships: string[];
  recentRecitations: { date: string; verse: string; score: number }[];
  certificates: { title: string; date: string; grade: string; key: string }[];
  joinedForums?: string[]; // categories student has joined
  notifications?: ServerNotification[]; // notification history
}

export interface ServerReply {
  id: string;
  body: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  created_at: string;
}

export interface ServerThread {
  id: string;
  title: string;
  body: string;
  category: 'jurisprudence' | 'history' | 'recitation' | 'scholarships' | 'general';
  author_id: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  thumbs_up: number;
  liked_by: string[]; // Email addresses who liked this thread
  created_at: string;
  replies: ServerReply[];
}

export interface ServerIssue {
  id: string;
  name: string;
  email: string;
  issueType: 'Bug' | 'Feature Request' | 'Content Error' | 'Scholar Verification Issue' | 'Quran/Tajweed Error' | 'Other';
  description: string;
  screenshot?: string;
  status: 'Pending' | 'Reviewing' | 'Fixed';
  adminMemo?: string;
  created_at: string;
  updated_at: string;
}

// --- DB Helper Utilities ---
// --- DB Helper & Fallback Engine ---
const DB_FILE_PATH = path.join(process.cwd(), 'server', 'filesystem_db.json');

let fallbackData: {
  users: ServerUser[];
  threads: ServerThread[];
  issues: ServerIssue[];
} | null = null;

function getFallbackDb(): { users: ServerUser[]; threads: ServerThread[]; issues: ServerIssue[] } {
  if (fallbackData) return fallbackData;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      fallbackData = JSON.parse(fileContent);
    }
  } catch (e) {
    console.error("Failed to read fallback DB file:", e);
  }

  if (!fallbackData) {
    fallbackData = {
      users: [
        {
          id: "usr_qari",
          username: "Sheikh Yusuf",
          email: "yusuf@ilmnaafi.org",
          passwordHash: "8d969eee76ec243b87db6d761d453c0b118b4971c2610b6562ad31a28a2a89df", // password: 123456
          role: "teacher",
          weeklyMinutes: 120,
          lessonsCompleted: ["les-taj-1", "les-taj-2"],
          savedScholarships: [],
          recentRecitations: [],
          certificates: [],
          joinedForums: ["recitation"],
          notifications: []
        },
        {
          id: "usr_scholar",
          username: "Dr. Fatimah",
          email: "fatimah@ilmnaafi.org",
          passwordHash: "8d969eee76ec243b87db6d761d453c0b118b4971c2610b6562ad31a28a2a89df", // password: 123456
          role: "researcher",
          weeklyMinutes: 180,
          lessonsCompleted: ["les-his-1"],
          savedScholarships: ["sch-isdb"],
          recentRecitations: [],
          certificates: [],
          joinedForums: ["jurisprudence"],
          notifications: []
        },
        {
          id: "usr_student",
          username: "Suleiman",
          email: "student@ilmnaafi.org",
          passwordHash: "8d969eee76ec243b87db6d761d453c0b118b4971c2610b6562ad31a28a2a89df", // password: 123456
          role: "student",
          weeklyMinutes: 45,
          lessonsCompleted: ["les-taj-1"],
          savedScholarships: ["sch-isdb"],
          recentRecitations: [],
          certificates: [],
          joinedForums: ["recitation", "jurisprudence"],
          notifications: []
        }
      ],
      threads: [
        {
          id: "thread_1",
          title: "Correct pronunciation of the letter 'Dad' (ض)",
          body: "Assalamu alaykum scholars. I am struggling with the articulation (makhraj) of the letter 'Dad' (ض). I often confuse it with 'Dhal' (ظ) or standard 'D' sound. Any practical advice or telemetry exercises to improve?",
          category: "recitation",
          author_id: "usr_student",
          author_name: "Suleiman",
          author_role: "Student Scholar",
          author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
          thumbs_up: 5,
          liked_by: ["fatimah@ilmnaafi.org", "yusuf@ilmnaafi.org"],
          created_at: "2026-06-20T10:00:00.000Z",
          replies: [
            {
              id: "rep_1",
              body: "Wa alaykum assalam brother. The key is in the sides of the tongue (Hafatul-Lisan) contacting the upper molars, rather than placing the tip of the tongue on the teeth. Practice pressing the left side of the tongue against the left molars. Our AI Coach can visualize this wave-pattern for you.",
              author_name: "Sheikh Yusuf",
              author_role: "Faculty Qari",
              author_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
              created_at: "2026-06-20T11:30:00.000Z"
            }
          ]
        },
        {
          id: "thread_2",
          title: "Sujud as-Sahw (Prosternation of Forgetfulness) requirements",
          body: "When a worshipper forgets a mandatory pillar (Rukn) vs a regular obligation (Wajib) in Salah, how does the application of Sujud as-Sahw differ? Does the prosternation happen before or after the Taslim?",
          category: "jurisprudence",
          author_id: "usr_student",
          author_name: "Suleiman",
          author_role: "Student Scholar",
          author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
          thumbs_up: 4,
          liked_by: ["fatimah@ilmnaafi.org"],
          created_at: "2026-06-21T09:00:00.000Z",
          replies: [
            {
              id: "rep_2",
              body: "Excellent academic inquiry. If a Pillar (Rukn) is missed, Sujud as-Sahw alone CANNOT compensate for it; you MUST perform that unit (Rak'ah) again. For Obligations (Wajib), Sujud as-Sahw compensates fully. Generally, if it was due to omission, perform it before Taslim; if due to addition, perform after.",
              author_name: "Dr. Fatimah",
              author_role: "Academic Researcher",
              author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
              created_at: "2026-06-21T10:15:00.000Z"
            }
          ]
        }
      ],
      issues: [
        {
          id: "iss_1",
          name: "Muhammad Ali",
          email: "muhammad.ali@example.com",
          issueType: "Quran/Tajweed Error",
          description: "Surah Al-Alaq Verse 1 translation typo in English under the home wisdom quote section.",
          screenshot: "",
          status: "Fixed",
          adminMemo: "Typo reviewed and corrected to matching pristine translations.",
          created_at: "2026-06-19T08:00:00.000Z",
          updated_at: "2026-06-19T12:00:00.000Z"
        }
      ]
    };
    saveFallbackDb();
  }

  return fallbackData;
}

function saveFallbackDb() {
  if (!fallbackData) return;
  try {
    const parentDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(fallbackData, null, 2), 'utf-8');
  } catch (e) {
    console.error("Failed to write fallback DB file:", e);
  }
}

function isSupabaseConfigured(): boolean {
  return getSupabaseAdmin() !== null;
}

function handleSupabaseError(error: any, context: string) {
  if (error) {
    console.error(`[Supabase Error during ${context}]:`, error);
    let extraTip = "";
    if (error.code === '42P01') {
      extraTip = " Hint: The database table does not exist. Did you execute the SQL script in your Supabase SQL Editor?";
    } else if (error.message && error.message.includes("API key")) {
      extraTip = " Hint: The provided service role API key appears to be invalid or deactivated.";
    }
    throw new Error(`Supabase Query Failed (${context}): ${error.message}.${extraTip}`);
  }
}

function mapDBUserToUser(row: any): ServerUser {
  return {
    id: row.id,
    username: row.username || '',
    email: row.email || '',
    passwordHash: row.password_hash || row.passwordHash || '',
    role: row.role || 'student',
    weeklyMinutes: row.weekly_minutes ?? row.weeklyMinutes ?? 0,
    lessonsCompleted: row.lessons_completed || row.lessonsCompleted || [],
    savedScholarships: row.saved_scholarships || row.savedScholarships || [],
    recentRecitations: row.recent_recitations || row.recentRecitations || [],
    certificates: row.certificates || [],
    joinedForums: row.joined_forums || row.joinedForums || [],
    notifications: row.notifications || []
  };
}

function mapUserToDBUser(u: Partial<ServerUser>): any {
  const payload: any = {};
  if (u.id !== undefined) payload.id = u.id;
  if (u.username !== undefined) payload.username = u.username;
  if (u.email !== undefined) payload.email = u.email;
  if (u.passwordHash !== undefined) payload.password_hash = u.passwordHash;
  if (u.role !== undefined) payload.role = u.role;
  if (u.weeklyMinutes !== undefined) payload.weekly_minutes = u.weeklyMinutes;
  if (u.lessonsCompleted !== undefined) payload.lessons_completed = u.lessonsCompleted;
  if (u.savedScholarships !== undefined) payload.saved_scholarships = u.savedScholarships;
  if (u.recentRecitations !== undefined) payload.recent_recitations = u.recentRecitations;
  if (u.certificates !== undefined) payload.certificates = u.certificates;
  if (u.joinedForums !== undefined) payload.joined_forums = u.joinedForums;
  if (u.notifications !== undefined) payload.notifications = u.notifications;
  return payload;
}

function mapDBThreadToThread(row: any): ServerThread {
  return {
    id: row.id,
    title: row.title || '',
    body: row.body || '',
    category: row.category || 'general',
    author_id: row.author_id || row.authorId || '',
    author_name: row.author_name || row.author || '',
    author_role: row.author_role || row.role || '',
    author_avatar: row.author_avatar || row.avatar || '',
    thumbs_up: row.thumbs_up ?? row.thumbsUp ?? 0,
    liked_by: row.liked_by || row.likedBy || [],
    created_at: row.created_at || row.date || new Date().toISOString(),
    replies: row.replies || []
  };
}

function mapThreadToDBThread(t: Partial<ServerThread>): any {
  const payload: any = {};
  if (t.id !== undefined) payload.id = t.id;
  if (t.title !== undefined) payload.title = t.title;
  if (t.body !== undefined) payload.body = t.body;
  if (t.category !== undefined) payload.category = t.category;
  if (t.author_id !== undefined) payload.author_id = t.author_id;
  if (t.author_name !== undefined) payload.author_name = t.author_name;
  if (t.author_role !== undefined) payload.author_role = t.author_role;
  if (t.author_avatar !== undefined) payload.author_avatar = t.author_avatar;
  if (t.thumbs_up !== undefined) payload.thumbs_up = t.thumbs_up;
  if (t.liked_by !== undefined) payload.liked_by = t.liked_by;
  if (t.replies !== undefined) payload.replies = t.replies;
  if (t.created_at !== undefined) payload.created_at = t.created_at;
  return payload;
}

function mapDBIssueToIssue(i: any): ServerIssue {
  return {
    id: i.id,
    name: i.name || '',
    email: i.email || '',
    issueType: i.issue_type || i.issueType || 'Other',
    description: i.description || '',
    screenshot: i.screenshot || '',
    status: i.status || 'Pending',
    adminMemo: i.admin_memo || i.adminMemo || '',
    created_at: i.created_at || new Date().toISOString(),
    updated_at: i.updated_at || new Date().toISOString()
  };
}

function mapIssueToDBIssue(i: Partial<ServerIssue>): any {
  const payload: any = {};
  if (i.id !== undefined) payload.id = i.id;
  if (i.name !== undefined) payload.name = i.name;
  if (i.email !== undefined) payload.email = i.email;
  if (i.issueType !== undefined) payload.issue_type = i.issueType;
  if (i.description !== undefined) payload.description = i.description;
  if (i.screenshot !== undefined) payload.screenshot = i.screenshot;
  if (i.status !== undefined) payload.status = i.status;
  if (i.adminMemo !== undefined) payload.admin_memo = i.adminMemo;
  if (i.created_at !== undefined) payload.created_at = i.created_at;
  if (i.updated_at !== undefined) payload.updated_at = i.updated_at;
  return payload;
}

class ServerDB {
  // --- USER CONTROLLERS ---
  public async getUsers(): Promise<ServerUser[]> {
    if (!isSupabaseConfigured()) {
      return getFallbackDb().users;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase.from('ilm_users').select('*');
      handleSupabaseError(error, 'getUsers');
      return (data || []).map(mapDBUserToUser);
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: getUsers failed, reverting to Local Sandbox:", err.message);
      return getFallbackDb().users;
    }
  }

  public async findUserByEmail(email: string): Promise<ServerUser | undefined> {
    const normEmail = email.trim().toLowerCase();
    if (!isSupabaseConfigured()) {
      return getFallbackDb().users.find(u => u.email.toLowerCase() === normEmail);
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase
        .from('ilm_users')
        .select('*')
        .eq('email', normEmail)
        .maybeSingle();
      handleSupabaseError(error, 'findUserByEmail');
      return data ? mapDBUserToUser(data) : undefined;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: findUserByEmail failed, reverting to Local Sandbox:", err.message);
      return getFallbackDb().users.find(u => u.email.toLowerCase() === normEmail);
    }
  }

  public async findUserById(id: string): Promise<ServerUser | undefined> {
    if (!isSupabaseConfigured()) {
      return getFallbackDb().users.find(u => u.id === id);
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase
        .from('ilm_users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      handleSupabaseError(error, 'findUserById');
      return data ? mapDBUserToUser(data) : undefined;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: findUserById failed, reverting to Local Sandbox:", err.message);
      return getFallbackDb().users.find(u => u.id === id);
    }
  }

  public async createUser(user: ServerUser): Promise<void> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      db.users.push(user);
      saveFallbackDb();
      return;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const payload = mapUserToDBUser(user);
      const { error } = await (supabase.from('ilm_users') as any).insert(payload);
      handleSupabaseError(error, 'createUser');
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: createUser failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      const existingIdx = db.users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (existingIdx > -1) {
        db.users[existingIdx] = user;
      } else {
        db.users.push(user);
      }
      saveFallbackDb();
    }
  }

  public async updateUserProfile(id: string, updates: Partial<ServerUser>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      const idx = db.users.findIndex(u => u.id === id);
      if (idx > -1) {
        db.users[idx] = { ...db.users[idx], ...updates };
        saveFallbackDb();
        return true;
      }
      return false;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const payload = mapUserToDBUser(updates);
      const { error } = await (supabase.from('ilm_users') as any)
        .update(payload)
        .eq('id', id);
      handleSupabaseError(error, 'updateUserProfile');
      return true;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: updateUserProfile failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      const idx = db.users.findIndex(u => u.id === id);
      if (idx > -1) {
        db.users[idx] = { ...db.users[idx], ...updates };
        saveFallbackDb();
        return true;
      }
      return false;
    }
  }

  // --- FORUM CONTROLLERS ---
  public async getThreads(): Promise<ServerThread[]> {
    if (!isSupabaseConfigured()) {
      return [...getFallbackDb().threads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase.from('ilm_threads').select('*');
      handleSupabaseError(error, 'getThreads');
      return (data || [])
        .map(mapDBThreadToThread)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: getThreads failed, reverting to Local Sandbox:", err.message);
      return [...getFallbackDb().threads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

  public async findThreadById(id: string): Promise<ServerThread | undefined> {
    if (!isSupabaseConfigured()) {
      return getFallbackDb().threads.find(t => t.id === id);
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase
        .from('ilm_threads')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      handleSupabaseError(error, 'findThreadById');
      return data ? mapDBThreadToThread(data) : undefined;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: findThreadById failed, reverting to Local Sandbox:", err.message);
      return getFallbackDb().threads.find(t => t.id === id);
    }
  }

  public async addThread(thread: ServerThread): Promise<void> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      db.threads.push(thread);
      saveFallbackDb();
      return;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const payload = mapThreadToDBThread(thread);
      const { error } = await (supabase.from('ilm_threads') as any).insert(payload);
      handleSupabaseError(error, 'addThread');
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: addThread failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      db.threads.push(thread);
      saveFallbackDb();
    }
  }

  public async deleteThread(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      const lengthBefore = db.threads.length;
      db.threads = db.threads.filter(t => t.id !== id);
      saveFallbackDb();
      return db.threads.length < lengthBefore;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { error } = await (supabase.from('ilm_threads') as any).delete().eq('id', id);
      handleSupabaseError(error, 'deleteThread');
      return true;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: deleteThread failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      const lengthBefore = db.threads.length;
      db.threads = db.threads.filter(t => t.id !== id);
      saveFallbackDb();
      return db.threads.length < lengthBefore;
    }
  }

  public async updateThread(id: string, updates: Partial<ServerThread>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      const idx = db.threads.findIndex(t => t.id === id);
      if (idx > -1) {
        db.threads[idx] = { ...db.threads[idx], ...updates };
        saveFallbackDb();
        return true;
      }
      return false;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const payload = mapThreadToDBThread(updates);
      const { error } = await (supabase.from('ilm_threads') as any).update(payload).eq('id', id);
      handleSupabaseError(error, 'updateThread');
      return true;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: updateThread failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      const idx = db.threads.findIndex(t => t.id === id);
      if (idx > -1) {
        db.threads[idx] = { ...db.threads[idx], ...updates };
        saveFallbackDb();
        return true;
      }
      return false;
    }
  }

  // --- ISSUE CONTROLLERS ---
  public async getIssues(): Promise<ServerIssue[]> {
    if (!isSupabaseConfigured()) {
      return [...getFallbackDb().issues].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase.from('ilm_issues').select('*');
      handleSupabaseError(error, 'getIssues');
      return (data || [])
        .map(mapDBIssueToIssue)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: getIssues failed, reverting to Local Sandbox:", err.message);
      return [...getFallbackDb().issues].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

  public async findIssueById(id: string): Promise<ServerIssue | undefined> {
    if (!isSupabaseConfigured()) {
      return getFallbackDb().issues.find(i => i.id === id);
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase
        .from('ilm_issues')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      handleSupabaseError(error, 'findIssueById');
      return data ? mapDBIssueToIssue(data) : undefined;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: findIssueById failed, reverting to Local Sandbox:", err.message);
      return getFallbackDb().issues.find(i => i.id === id);
    }
  }

  public async addIssue(issue: ServerIssue): Promise<void> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      db.issues.push(issue);
      saveFallbackDb();
      return;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const payload = mapIssueToDBIssue(issue);
      const { error } = await (supabase.from('ilm_issues') as any).insert(payload);
      handleSupabaseError(error, 'addIssue');
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: addIssue failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      db.issues.push(issue);
      saveFallbackDb();
    }
  }

  public async deleteIssue(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      const lengthBefore = db.issues.length;
      db.issues = db.issues.filter(i => i.id !== id);
      saveFallbackDb();
      return db.issues.length < lengthBefore;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { error } = await (supabase.from('ilm_issues') as any).delete().eq('id', id);
      handleSupabaseError(error, 'deleteIssue');
      return true;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: deleteIssue failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      const lengthBefore = db.issues.length;
      db.issues = db.issues.filter(i => i.id !== id);
      saveFallbackDb();
      return db.issues.length < lengthBefore;
    }
  }

  public async updateIssue(id: string, updates: Partial<ServerIssue>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      const idx = db.issues.findIndex(i => i.id === id);
      if (idx > -1) {
        db.issues[idx] = { ...db.issues[idx], ...updates };
        saveFallbackDb();
        return true;
      }
      return false;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const payload = mapIssueToDBIssue(updates);
      const { error } = await (supabase.from('ilm_issues') as any).update(payload).eq('id', id);
      handleSupabaseError(error, 'updateIssue');
      return true;
    } catch (err: any) {
      console.warn("[Database Fallback Engine]: updateIssue failed, reverting to Local Sandbox:", err.message);
      const db = getFallbackDb();
      const idx = db.issues.findIndex(i => i.id === id);
      if (idx > -1) {
        db.issues[idx] = { ...db.issues[idx], ...updates };
        saveFallbackDb();
        return true;
      }
      return false;
    }
  }

  public async getDevotionalPlan(userId: string): Promise<any | null> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      const user = db.users.find(u => u.id === userId);
      return user ? (user as any).devotionalPlan || null : null;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await (supabase.from('ilm_naafi_store') as any)
        .select('value')
        .eq('key', `devotional_plan_${userId}`)
        .maybeSingle();
      if (error) {
        console.warn("Failed to getDevotionalPlan from Supabase:", error);
        return null;
      }
      return data ? data.value : null;
    } catch (e: any) {
      console.warn("Error in getDevotionalPlan:", e);
      return null;
    }
  }

  public async saveDevotionalPlan(userId: string, plan: any): Promise<void> {
    if (!isSupabaseConfigured()) {
      const db = getFallbackDb();
      const idx = db.users.findIndex(u => u.id === userId);
      if (idx > -1) {
        (db.users[idx] as any).devotionalPlan = plan;
        saveFallbackDb();
      }
      return;
    }
    try {
      const supabase = getSupabaseAdmin()!;
      const { error } = await (supabase.from('ilm_naafi_store') as any)
        .upsert({
          key: `devotional_plan_${userId}`,
          value: plan,
          updated_at: new Date().toISOString()
        });
      if (error) {
        console.warn("Failed to saveDevotionalPlan to Supabase:", error);
      }
    } catch (e: any) {
      console.warn("Error in saveDevotionalPlan:", e);
    }
  }
}

export const dbStore = new ServerDB();
