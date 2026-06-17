/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

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

interface DBStructure {
  users: ServerUser[];
  threads: ServerThread[];
}

const DEFAULT_DB_FILE = path.join(process.cwd(), 'server', 'db.json');
let DB_FILE = DEFAULT_DB_FILE;

// Under Cloud Run or read-only container platforms, local filesystems are read-only except /tmp
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  DB_FILE = path.join(os.tmpdir(), 'db.json');
  try {
    if (!fs.existsSync(DB_FILE) && fs.existsSync(DEFAULT_DB_FILE)) {
      // Seed /tmp/db.json with pre-seeded data if it doesn't already exist
      fs.copyFileSync(DEFAULT_DB_FILE, DB_FILE);
      console.log(`[Database] Seeded database successfully in temp path: ${DB_FILE}`);
    }
  } catch (err: any) {
    console.warn(`[Database] Failed to copy pre-seeded database to ${DB_FILE}:`, err.message);
  }
}

// Default initial forum threads to seed the Discussion Board with premium scholarly discussions
const DEFAULT_THREADS: ServerThread[] = [
  {
    id: 'thread_1',
    title: 'Verification of Al-Jazariyyah vocal elongation boundaries in Hafs recitation',
    body: 'Assalamu Alaikum scholars, as we study classical tajweed rules from Imam Al-Jazari’s prose, there are occasional debates on whether pre-measured elongation units (4 versus 5 harakat) on Madd Jaiz Munfasil are strictly required for validation or considered of optional beauty. What is the consensus among active Qaris today?',
    category: 'recitation',
    author_id: 'scholar_fajr',
    author_name: 'Dr. Tariq Al-Mansoor',
    author_role: 'Academic Researcher',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    thumbs_up: 8,
    liked_by: [],
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
    replies: [
      {
        id: 'reply_1_1',
        body: 'Imam Shatibi and Al-Jazari both agree that uniformity within your recital is key. If you begin with 4 counts, maintain 4 counts consistently throughout the stance to avoid phonetic dilution.',
        author_name: 'Sheikh Yusuf Al-Asim',
        author_role: 'Faculty Qari',
        author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        created_at: new Date(Date.now() - 2.5 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'reply_1_2',
        body: 'Jazakumullah Khairan for this clarification! This makes pedagogical design for our AI coach much more objective.',
        author_name: 'Dr. Tariq Al-Mansoor',
        author_role: 'Academic Researcher',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'thread_2',
    title: 'Historical analysis of study manuscripts in medieval Baghdad and Cordoba',
    body: 'I am researching the daily timetable and core syllabus books of K-12 students studying in the Al-Mustansiriya Madrasah of Baghdad (circa 1230 CE). Does anyone have primary source document links or translations of Imam Al-Ghazali’s treatises concerning child education timelines?',
    category: 'history',
    author_id: 'scholar_salah',
    author_name: 'Sister Maryam Al-Sabah',
    author_role: 'Student Scholar',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    thumbs_up: 5,
    liked_by: [],
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'reply_2_1',
        body: 'Look at G. Makdisi’s classic "The Rise of Colleges: Institutions of Learning in Islam". He devotes two whole chapters to academic schedules in Baghdad and Baghdad-associated endowment charters.',
        author_name: 'Dr. Tariq Al-Mansoor',
        author_role: 'Academic Researcher',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'thread_3',
    title: 'IsDB Graduate Scholarship Program - 2026 application cycle guidelines',
    body: 'The Islamic Development Bank has announced the opening details for fully-funded fellowships covering Sustainable Science and Classical Islamic Economics. Ensure you submit your academic proposal along with a letter of commendation from your local religious faculty.',
    category: 'scholarships',
    author_id: 'scholar_yusuf',
    author_name: 'Sheikh Yusuf Al-Asim',
    author_role: 'Faculty Qari',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    thumbs_up: 12,
    liked_by: [],
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    replies: []
  }
];

class ServerDB {
  private data: DBStructure = { users: [], threads: DEFAULT_THREADS };

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          users: parsed.users || [],
          threads: parsed.threads || DEFAULT_THREADS
        };
      } else {
        this.save();
      }
    } catch (e) {
      console.warn("Unable to load JSON database, using in-memory fallback:", e);
    }
  }

  private save(): void {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');

      // Also persist to default workspace path if writable to survive container restarts/redeployments in workspace
      try {
        if (DB_FILE !== DEFAULT_DB_FILE) {
          const defaultDir = path.dirname(DEFAULT_DB_FILE);
          if (!fs.existsSync(defaultDir)) {
            fs.mkdirSync(defaultDir, { recursive: true });
          }
          fs.writeFileSync(DEFAULT_DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
        }
      } catch (wsErr: any) {
        // Safely catch read-only filesystem exceptions in true production cloud runs
      }
    } catch (e: any) {
      console.error(`[Database] Failed to write to primary path ${DB_FILE}:`, e.message);
      // Fallback on-the-fly to temp directory to avoid application crash/unusable state
      const fallbackPath = path.join(os.tmpdir(), 'db.json');
      if (DB_FILE !== fallbackPath) {
        console.warn(`[Database] Attempting write fallback to temp directory: ${fallbackPath}`);
        try {
          if (!fs.existsSync(fallbackPath) && fs.existsSync(DEFAULT_DB_FILE)) {
            try {
              fs.copyFileSync(DEFAULT_DB_FILE, fallbackPath);
            } catch (copyErr) {}
          }
          DB_FILE = fallbackPath;
          fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
          console.log(`[Database] Successfully wrote database to fallback path: ${DB_FILE}`);
        } catch (fbErr: any) {
          console.error(`[Database] Fallback write failed:`, fbErr.message);
        }
      }
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
    this.save();
  }

  public updateUserProfile(id: string, updates: Partial<ServerUser>): boolean {
    const user = this.findUserById(id);
    if (!user) return false;

    Object.assign(user, updates);
    this.save();
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
    this.save();
  }

  public deleteThread(id: string): boolean {
    const lengthBefore = this.data.threads.length;
    this.data.threads = this.data.threads.filter(t => t.id !== id);
    if (this.data.threads.length !== lengthBefore) {
      this.save();
      return true;
    }
    return false;
  }

  public updateThread(id: string, updates: Partial<ServerThread>): boolean {
    const thread = this.findThreadById(id);
    if (!thread) return false;

    Object.assign(thread, updates);
    this.save();
    return true;
  }
}

export const dbStore = new ServerDB();
