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

interface DBStructure {
  users: ServerUser[];
  threads: ServerThread[];
  issues?: ServerIssue[];
}

class ServerDB {
  private data: DBStructure = { users: [], threads: [], issues: [] };
  private isSupabaseSyncing = false;

  constructor() {
    // Non-blocking asynchronous cloud database synchronize on boot
    this.syncWithSupabase().catch(err => {
      console.error("[Supabase startup sync failed]", err);
    });
  }

  public async syncWithSupabase(): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.log("[Supabase] Skipping sync: SUPABASE_URL or keys not configured yet.");
      return;
    }

    if (this.isSupabaseSyncing) return;
    this.isSupabaseSyncing = true;

    try {
      console.log("[Supabase] Fetching latest records from dynamic cloud ledger...");

      // Wrap fetches dynamically to prevent compilation errors and catch failures
      const fetchTable = async (table: string): Promise<{ data: any[] | null; error: any }> => {
        try {
          const res = await (supabase as any).from(table).select('*');
          return { data: res.data, error: res.error };
        } catch (err: any) {
          return { data: null, error: err };
        }
      };

      const [usersRes, threadsRes, issuesRes] = await Promise.all([
        fetchTable('ilm_users'),
        fetchTable('ilm_threads'),
        fetchTable('ilm_issues')
      ]);

      const usersError = usersRes.error;
      const threadsError = threadsRes.error;

      if (usersRes.data && !usersError && threadsRes.data && !threadsError) {
        console.log(`[Supabase] Restoring state from relational tables. Users: ${usersRes.data.length}, Threads: ${threadsRes.data.length}`);
        
        const mappedUsers: ServerUser[] = usersRes.data.map((u: any) => ({
          id: u.id,
          username: u.username || '',
          email: u.email || '',
          passwordHash: u.password_hash || u.passwordHash || '',
          role: u.role || 'student',
          weeklyMinutes: u.weekly_minutes ?? u.weeklyMinutes ?? 0,
          lessonsCompleted: u.lessons_completed || u.lessonsCompleted || [],
          savedScholarships: u.saved_scholarships || u.savedScholarships || [],
          recentRecitations: u.recent_recitations || u.recentRecitations || [],
          certificates: u.certificates || [],
          joinedForums: u.joined_forums || u.joinedForums || [],
          notifications: u.notifications || []
        }));

        const mappedThreads: ServerThread[] = threadsRes.data.map((t: any) => ({
          id: t.id,
          title: t.title || '',
          body: t.body || '',
          category: t.category || 'general',
          author_id: t.author_id || t.authorId || '',
          author_name: t.author_name || t.author || '',
          author_role: t.author_role || t.role || '',
          author_avatar: t.author_avatar || t.avatar || '',
          thumbs_up: t.thumbs_up ?? t.thumbsUp ?? 0,
          liked_by: t.liked_by || t.likedBy || [],
          created_at: t.created_at || t.date || new Date().toISOString(),
          replies: t.replies || []
        }));

        const mappedIssues: ServerIssue[] = (issuesRes.data || []).map((i: any) => ({
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
        }));

        this.data = {
          users: mappedUsers,
          threads: mappedThreads,
          issues: mappedIssues
        };
        
      } else {
        console.warn("[Supabase] Relational schema and single-table fallbacks empty or unpopulated. Initializing empty database.");
      }
    } catch (e: any) {
      console.error("[Supabase] State loading process failed:", e.message);
    } finally {
      this.isSupabaseSyncing = false;
    }
  }

  // --- IMMEDIATE SUPABASE INTERACTION WRAPPERS ---
  private async saveUserToSupabase(u: ServerUser): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;
    try {
      const payload = {
        id: u.id,
        username: u.username,
        email: u.email,
        password_hash: u.passwordHash,
        role: u.role,
        weekly_minutes: u.weeklyMinutes,
        lessons_completed: u.lessonsCompleted,
        saved_scholarships: u.savedScholarships,
        recent_recitations: u.recentRecitations,
        certificates: u.certificates,
        joined_forums: u.joinedForums || [],
        notifications: u.notifications || []
      };
      const res = await (supabase as any).from('ilm_users').upsert(payload);
      if (res.error) {
        console.error("[Supabase] Error saving user:", res.error.message);
      } else {
        console.log(`[Supabase] Live updated user ${u.email}`);
      }
    } catch (e: any) {
      console.error("[Supabase User Upsert Exception]", e.message);
    }
  }

  private async saveThreadToSupabase(t: ServerThread): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;
    try {
      const payload = {
        id: t.id,
        title: t.title,
        body: t.body,
        category: t.category,
        author_id: t.author_id,
        author_name: t.author_name,
        author_role: t.author_role,
        author_avatar: t.author_avatar,
        thumbs_up: t.thumbs_up,
        liked_by: t.liked_by,
        replies: t.replies,
        created_at: t.created_at
      };
      const res = await (supabase as any).from('ilm_threads').upsert(payload);
      if (res.error) {
        console.error("[Supabase] Error saving thread:", res.error.message);
      } else {
        console.log(`[Supabase] Live updated thread ${t.id}`);
      }
    } catch (e: any) {
      console.error("[Supabase Thread Upsert Exception]", e.message);
    }
  }

  private async deleteThreadFromSupabase(id: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;
    try {
      const res = await (supabase as any).from('ilm_threads').delete().eq('id', id);
      if (res.error) {
        console.error("[Supabase] Error deleting thread:", res.error.message);
      } else {
        console.log(`[Supabase] Live deleted thread ${id}`);
      }
    } catch (e: any) {
      console.error("[Supabase Thread Delete Exception]", e.message);
    }
  }

  private async saveIssueToSupabase(i: ServerIssue): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;
    try {
      const payload = {
        id: i.id,
        name: i.name,
        email: i.email,
        issue_type: i.issueType,
        description: i.description,
        screenshot: i.screenshot || null,
        status: i.status,
        admin_memo: i.adminMemo || null,
        created_at: i.created_at,
        updated_at: i.updated_at
      };
      const res = await (supabase as any).from('ilm_issues').upsert(payload);
      if (res.error) {
        console.error("[Supabase] Error saving support issue:", res.error.message);
      } else {
        console.log(`[Supabase] Live updated support issue ${i.id}`);
      }
    } catch (e: any) {
      console.error("[Supabase Issue Upsert Exception]", e.message);
    }
  }

  private async deleteIssueFromSupabase(id: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;
    try {
      const res = await (supabase as any).from('ilm_issues').delete().eq('id', id);
      if (res.error) {
        console.error("[Supabase] Error deleting support issue:", res.error.message);
      } else {
        console.log(`[Supabase] Live deleted support issue ${id}`);
      }
    } catch (e: any) {
      console.error("[Supabase Issue Delete Exception]", e.message);
    }
  }

  // --- USER CONTROLLERS ---
  public getUsers(): ServerUser[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): ServerUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): ServerUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: ServerUser): void {
    this.data.users.push(user);
    this.saveUserToSupabase(user);
  }

  public updateUserProfile(id: string, updates: Partial<ServerUser>): boolean {
    const user = this.findUserById(id);
    if (!user) return false;

    Object.assign(user, updates);
    this.saveUserToSupabase(user);
    return true;
  }

  // --- FORUM CONTROLLERS ---
  public getThreads(): ServerThread[] {
    // Sort newly created threads first
    return [...this.data.threads].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public findThreadById(id: string): ServerThread | undefined {
    return this.data.threads.find(t => t.id === id);
  }

  public addThread(thread: ServerThread): void {
    this.data.threads.push(thread);
    this.saveThreadToSupabase(thread);
  }

  public deleteThread(id: string): boolean {
    const lengthBefore = this.data.threads.length;
    this.data.threads = this.data.threads.filter(t => t.id !== id);
    if (this.data.threads.length !== lengthBefore) {
      this.deleteThreadFromSupabase(id);
      return true;
    }
    return false;
  }

  public updateThread(id: string, updates: Partial<ServerThread>): boolean {
    const thread = this.findThreadById(id);
    if (!thread) return false;

    Object.assign(thread, updates);
    this.saveThreadToSupabase(thread);
    return true;
  }

  // --- ISSUE CONTROLLERS ---
  public getIssues(): ServerIssue[] {
    return this.data.issues || [];
  }

  public findIssueById(id: string): ServerIssue | undefined {
    return (this.data.issues || []).find(i => i.id === id);
  }

  public addIssue(issue: ServerIssue): void {
    if (!this.data.issues) {
      this.data.issues = [];
    }
    this.data.issues.push(issue);
    this.saveIssueToSupabase(issue);
  }

  public deleteIssue(id: string): boolean {
    if (!this.data.issues) return false;
    const lengthBefore = this.data.issues.length;
    this.data.issues = this.data.issues.filter(i => i.id !== id);
    if (this.data.issues.length !== lengthBefore) {
      this.deleteIssueFromSupabase(id);
      return true;
    }
    return false;
  }

  public updateIssue(id: string, updates: Partial<ServerIssue>): boolean {
    const issue = this.findIssueById(id);
    if (!issue) return false;

    Object.assign(issue, updates);
    this.saveIssueToSupabase(issue);
    return true;
  }
}

export const dbStore = new ServerDB();
