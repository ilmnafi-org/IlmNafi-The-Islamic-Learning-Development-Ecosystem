/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, Key, ShieldCheck, Mail, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (username: string, email: string) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onSuccess(name || email.split('@')[0] || "Scholar Student", email || "guest@al-hikmah.edu");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="auth-modal-screen">
      <div className="bg-white border text-slate-800 border-slate-200 rounded-xl max-w-sm w-full shadow-2xl overflow-hidden animate-fadeIn" id="auth-modal">
        {/* Header decoration banner */}
        <div className="bg-emerald-800 text-white p-6 text-center space-y-1 relative">
          <div className="absolute right-3 top-3">
            <Sparkles className="w-5 h-5 text-emerald-300 opacity-60 animate-bounce" />
          </div>
          <h3 className="font-extrabold text-xl tracking-tight">Al-Hikmah Student ID</h3>
          <p className="text-emerald-100 text-xs">Unlock progress archiving & scholar awards</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-500 mb-4 h-9">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-md text-center py-1 transition-all ${
                isLogin ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-md text-center py-1 transition-all ${
                !isLogin ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-800'
              }`}
            >
              Register ID
            </button>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Full Name</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  placeholder="e.g. Salim Al-Hassan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 pl-9 text-xs outline-none focus:border-emerald-600 focus:bg-white"
                  id="auth-input-name"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Academy Email Address</label>
            <div className="relative">
              <input 
                type="email"
                required
                placeholder="you@al-hikmah.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 pl-9 text-xs outline-none focus:border-emerald-600 focus:bg-white"
                id="auth-input-email"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Access Pin / Password</label>
            <div className="relative">
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 pl-9 text-xs outline-none focus:border-emerald-600 focus:bg-white"
                id="auth-input-password"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-[11px] text-emerald-700 hover:underline font-semibold">Forgot PIN?</a>
            </div>
          )}

          <div className="pt-2 flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 px-4 rounded text-xs font-semibold transition flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-800 hover:bg-emerald-950 text-white py-2 px-4 rounded text-xs font-bold transition flex-1 flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              id="auth-btn-submit"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLogin ? "Key Authorization" : "Provision Card"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
