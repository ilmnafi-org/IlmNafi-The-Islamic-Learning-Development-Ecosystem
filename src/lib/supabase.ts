/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'researcher' | 'teacher';
  weeklyMinutes: number;
  lessonsCompleted: string[];
  savedScholarships: string[];
  recentRecitations: { date: string; verse: string; score: number }[];
  certificates: { title: string; date: string; grade: string; key: string }[];
}

export interface LocalThread {
  id: string;
  title: string;
  body: string;
  category: 'jurisprudence' | 'history' | 'recitation' | 'scholarships' | 'general';
  author_id: string;
  author: string;
  role: string;
  avatar: string;
  thumbsUp: number;
  likedBy: string[]; // List of user emails who liked it
  date: string;
  replies: {
    id: string;
    body: string;
    author: string;
    role: string;
    avatar: string;
    date: string;
  }[];
}

// In-Memory cache of current session strictly while the app is actively running
let clientInMemorySession: UserSession | null = null;

export const dbService = {
  // --- AUTH SERVICES ---
  async signUp(email: string, password: string, name: string, role: 'student' | 'researcher' | 'teacher'): Promise<UserSession> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Signup failed with status code ${response.status}`);
    }

    const data = await response.json();
    clientInMemorySession = data.user;
    return data.user;
  },

  async login(email: string, password: string): Promise<UserSession> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Login failed with status code ${response.status}`);
    }

    const data = await response.json();
    clientInMemorySession = data.user;
    return data.user;
  },

  async logout(): Promise<void> {
    clientInMemorySession = null;
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  },

  async signOut(): Promise<void> {
    await this.logout();
  },

  async getCurrentSession(): Promise<UserSession | null> {
    if (clientInMemorySession) {
      return clientInMemorySession;
    }

    // Attempt to query session from active HttpOnly cookies on the back-end
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          clientInMemorySession = data.user;
          return data.user;
        }
      }
    } catch (e) {
      // Silent pass for silent page load restores
    }

    return null;
  },

  async updateSession(updated: UserSession): Promise<void> {
    clientInMemorySession = updated;
    await fetch('/api/auth/update-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: updated })
    }).catch(() => {});
  },

  // --- DISCUSSION BOARD FORUM SERVICES ---
  async fetchThreads(): Promise<LocalThread[]> {
    try {
      const response = await fetch('/api/forum/threads');
      if (response.ok) {
        const data = await response.json();
        return data.threads || [];
      }
    } catch (e) {
      console.error("Unable to load threads from Express forum endpoint", e);
    }
    return [];
  },

  async createNewThread(title: string, category: any, body: string): Promise<LocalThread> {
    const response = await fetch('/api/forum/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, body })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Must be logged in to start a topic.");
    }

    const data = await response.json();
    return data.thread;
  },

  async destroyThread(threadId: string): Promise<boolean> {
    const response = await fetch(`/api/forum/threads/${threadId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Cannot remove this thread.");
    }

    return true;
  },

  async toggleLike(threadId: string): Promise<LocalThread> {
    const response = await fetch(`/api/forum/threads/${threadId}/like`, {
      method: 'POST'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Login required to support discussion topics.");
    }

    const data = await response.json();
    return data.thread;
  },

  async addReply(threadId: string, bodyText: string): Promise<LocalThread> {
    const response = await fetch(`/api/forum/threads/${threadId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: bodyText })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Login required to reply.");
    }

    const data = await response.json();
    return data.thread;
  }
};
