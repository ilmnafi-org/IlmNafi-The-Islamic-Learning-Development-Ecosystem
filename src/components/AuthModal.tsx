/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, Key, ShieldCheck, Mail, Sparkles, GraduationCap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4" id="auth-modal-screen">
      <div className="bg-white border text-slate-800 border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-fadeIn relative" id="auth-modal">
        
        {/* Dismiss Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-1 rounded-full bg-black/15 text-white hover:bg-black/25 transition-colors z-20"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header decoration banner with majestic pattern */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 text-white p-7 text-center space-y-2 relative">
          <div className="mx-auto w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 border border-white/10">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg tracking-tight">Nafi Scholar Authorization</h3>
            <p className="text-emerald-100/80 text-[11px] max-w-xs mx-auto">Unlock direct recitation records, progress logs, and translation suites</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-500 mb-2 h-11 border border-slate-200/40 relative">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-lg text-center py-1.5 transition-all outline-none ${
                isLogin ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              Sign In Portal
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-lg text-center py-1.5 transition-all outline-none ${
                !isLogin ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              Register Account
            </button>
          </div>

          <AnimatePresence initial={false} mode="popLayout">
            {!isLogin && (
              <motion.div
                key="modal-name-field"
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden space-y-1"
              >
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Your Full Name</label>
                <div className="relative">
                  <input 
                    type="text"
                    required={!isLogin}
                    placeholder="e.g. Salim Al-Hassan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-850"
                    id="auth-input-name"
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Academy Email Address</label>
            <div className="relative">
              <input 
                type="email"
                required
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-850"
                id="auth-input-email"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Access PIN / Password</label>
            <div className="relative">
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-850"
                id="auth-input-password"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-[11px] text-amber-800 hover:underline font-bold">Forgot PIN?</a>
            </div>
          )}

          <div className="pt-3 flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 px-4 rounded-xl text-xs font-bold transition-colors flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-800 hover:bg-emerald-950 text-white py-3 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 flex-1 flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              id="auth-btn-submit"
            >
              {loading ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>{isLogin ? "Key Sign In" : "Register Card"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
