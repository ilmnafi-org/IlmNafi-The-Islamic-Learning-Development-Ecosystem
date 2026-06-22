/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseAdmin } from './supabase.js';

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
function getSupabaseOrThrow() {
  const s = getSupabaseAdmin();
  if (!s) {
    throw new Error(
      "Supabase Connection Missing: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are not configured in AI Studio. " +
      "Please configure your Supabase variables in the AI Studio settings panel."
    );
  }
  return s;
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
    const supabase = getSupabaseOrThrow();
    const { data, error } = await supabase.from('ilm_users').select('*');
    handleSupabaseError(error, 'getUsers');
    return (data || []).map(mapDBUserToUser);
  }

  public async findUserByEmail(email: string): Promise<ServerUser | undefined> {
    const supabase = getSupabaseOrThrow();
    const normEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('ilm_users')
      .select('*')
      .eq('email', normEmail)
      .maybeSingle();
    handleSupabaseError(error, 'findUserByEmail');
    return data ? mapDBUserToUser(data) : undefined;
  }

  public async findUserById(id: string): Promise<ServerUser | undefined> {
    const supabase = getSupabaseOrThrow();
    const { data, error } = await supabase
      .from('ilm_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    handleSupabaseError(error, 'findUserById');
    return data ? mapDBUserToUser(data) : undefined;
  }

  public async createUser(user: ServerUser): Promise<void> {
    const supabase = getSupabaseOrThrow();
    const payload = mapUserToDBUser(user);
    const { error } = await (supabase.from('ilm_users') as any).insert(payload);
    handleSupabaseError(error, 'createUser');
  }

  public async updateUserProfile(id: string, updates: Partial<ServerUser>): Promise<boolean> {
    const supabase = getSupabaseOrThrow();
    const payload = mapUserToDBUser(updates);
    const { error } = await (supabase.from('ilm_users') as any)
      .update(payload)
      .eq('id', id);
    handleSupabaseError(error, 'updateUserProfile');
    return true;
  }

  // --- FORUM CONTROLLERS ---
  public async getThreads(): Promise<ServerThread[]> {
    const supabase = getSupabaseOrThrow();
    const { data, error } = await supabase.from('ilm_threads').select('*');
    handleSupabaseError(error, 'getThreads');
    return (data || [])
      .map(mapDBThreadToThread)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async findThreadById(id: string): Promise<ServerThread | undefined> {
    const supabase = getSupabaseOrThrow();
    const { data, error } = await supabase
      .from('ilm_threads')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    handleSupabaseError(error, 'findThreadById');
    return data ? mapDBThreadToThread(data) : undefined;
  }

  public async addThread(thread: ServerThread): Promise<void> {
    const supabase = getSupabaseOrThrow();
    const payload = mapThreadToDBThread(thread);
    const { error } = await (supabase.from('ilm_threads') as any).insert(payload);
    handleSupabaseError(error, 'addThread');
  }

  public async deleteThread(id: string): Promise<boolean> {
    const supabase = getSupabaseOrThrow();
    const { error } = await (supabase.from('ilm_threads') as any).delete().eq('id', id);
    handleSupabaseError(error, 'deleteThread');
    return true;
  }

  public async updateThread(id: string, updates: Partial<ServerThread>): Promise<boolean> {
    const supabase = getSupabaseOrThrow();
    const payload = mapThreadToDBThread(updates);
    const { error } = await (supabase.from('ilm_threads') as any).update(payload).eq('id', id);
    handleSupabaseError(error, 'updateThread');
    return true;
  }

  // --- ISSUE CONTROLLERS ---
  public async getIssues(): Promise<ServerIssue[]> {
    const supabase = getSupabaseOrThrow();
    const { data, error } = await supabase.from('ilm_issues').select('*');
    handleSupabaseError(error, 'getIssues');
    return (data || [])
      .map(mapDBIssueToIssue)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async findIssueById(id: string): Promise<ServerIssue | undefined> {
    const supabase = getSupabaseOrThrow();
    const { data, error } = await supabase
      .from('ilm_issues')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    handleSupabaseError(error, 'findIssueById');
    return data ? mapDBIssueToIssue(data) : undefined;
  }

  public async addIssue(issue: ServerIssue): Promise<void> {
    const supabase = getSupabaseOrThrow();
    const payload = mapIssueToDBIssue(issue);
    const { error } = await (supabase.from('ilm_issues') as any).insert(payload);
    handleSupabaseError(error, 'addIssue');
  }

  public async deleteIssue(id: string): Promise<boolean> {
    const supabase = getSupabaseOrThrow();
    const { error } = await (supabase.from('ilm_issues') as any).delete().eq('id', id);
    handleSupabaseError(error, 'deleteIssue');
    return true;
  }

  public async updateIssue(id: string, updates: Partial<ServerIssue>): Promise<boolean> {
    const supabase = getSupabaseOrThrow();
    const payload = mapIssueToDBIssue(updates);
    const { error } = await (supabase.from('ilm_issues') as any).update(payload).eq('id', id);
    handleSupabaseError(error, 'updateIssue');
    return true;
  }
}

export const dbStore = new ServerDB();
