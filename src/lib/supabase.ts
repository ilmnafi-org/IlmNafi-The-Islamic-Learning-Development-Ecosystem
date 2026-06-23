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
  joinedForums?: string[];
  notifications?: any[];
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

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  const token = localStorage.getItem('ilm_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const dbService = {
  // --- AUTH SERVICES ---
  async getDatabaseStatus(): Promise<{ configured: boolean; mode: string }> {
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Could not fetch database status from server", e);
    }
    return { configured: false, mode: "Sandbox Local Fallback" };
  },

  async signUp(email: string, password: string, name: string, role: 'student' | 'researcher' | 'teacher'): Promise<UserSession> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const finalName = name.trim() || email.split('@')[0];

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword, name: finalName, role })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Signup failed with status code ${response.status}`);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('ilm_token', data.token);
      localStorage.setItem('ilm_token_time', Date.now().toString());
    }
    if (data.user) {
      localStorage.setItem('ilm_user', JSON.stringify(data.user));
    }
    clientInMemorySession = data.user;
    return data.user;
  },

  async login(email: string, password: string): Promise<UserSession> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Login failed with status code ${response.status}`);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('ilm_token', data.token);
      localStorage.setItem('ilm_token_time', Date.now().toString());
    }
    if (data.user) {
      localStorage.setItem('ilm_user', JSON.stringify(data.user));
    }
    clientInMemorySession = data.user;
    return data.user;
  },

  async logout(): Promise<void> {
    const headers = getAuthHeaders();
    clientInMemorySession = null;
    localStorage.removeItem('ilm_token');
    localStorage.removeItem('ilm_token_time');
    localStorage.removeItem('ilm_user');
    await fetch('/api/auth/logout', { 
      method: 'POST',
      headers
    }).catch(() => {});
  },

  async signOut(): Promise<void> {
    await this.logout();
  },

  async requestPasswordReset(email: string): Promise<string> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() })
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to process request.");
    }
    const data = await response.json();
    return data.message;
  },

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: newPassword.trim() })
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to reset password.");
    }
    const data = await response.json();
    return data.message;
  },

  async getCurrentSession(): Promise<UserSession | null> {
    // Check if the user session has been active for more than 24 hours to automatically logout
    const loginTime = localStorage.getItem('ilm_token_time');
    if (loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed > 24 * 3600 * 1000) {
        console.warn("[Session] Session exceeded 24 hours. Performing automatic logout.");
        await this.logout();
        return null;
      }
    }

    if (clientInMemorySession) {
      return clientInMemorySession;
    }

    // Attempt to query session from active HttpOnly cookies on the back-end
    try {
      const response = await fetch('/api/auth/session', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('ilm_token', data.token);
        }
        if (data.user) {
          clientInMemorySession = data.user;
          localStorage.setItem('ilm_user', JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      // Silent pass for silent page load restores
    }

    // Self-healing session restoration if container rebooted or database is reset
    const savedUserStr = localStorage.getItem('ilm_user');
    const savedToken = localStorage.getItem('ilm_token');
    if (savedUserStr && savedToken) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        const response = await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${savedToken}`
          },
          body: JSON.stringify({ user: savedUser })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            clientInMemorySession = data.user;
            localStorage.setItem('ilm_user', JSON.stringify(data.user));
            return data.user;
          }
        }
      } catch (err) {
        console.warn("[SessionRecovery] Self-healing session restoration failed:", err);
      }
    }

    return null;
  },

  async updateSession(updated: UserSession): Promise<void> {
    clientInMemorySession = updated;
    localStorage.setItem('ilm_user', JSON.stringify(updated));
    await fetch('/api/auth/update-session', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ progress: updated })
    }).catch(() => {});
  },

  // --- DISCUSSION BOARD FORUM SERVICES ---
  async fetchThreads(): Promise<LocalThread[]> {
    try {
      const response = await fetch('/api/forum/threads', {
        headers: getAuthHeaders()
      });
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Cannot remove this thread.");
    }

    return true;
  },

  async toggleLike(threadId: string): Promise<LocalThread> {
    const response = await fetch(`/api/forum/threads/${threadId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
