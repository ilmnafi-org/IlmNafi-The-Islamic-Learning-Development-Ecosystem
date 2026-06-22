/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserCheck, Key, ShieldCheck, Mail, Sparkles, GraduationCap, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dbService } from '../lib/supabase';

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
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; mode: string }>({ configured: false, mode: 'Checking...' });

  useEffect(() => {
    dbService.getDatabaseStatus().then(status => {
      setDbStatus(status);
    });
  }, []);
  
  // Modals inside AuthModal to align with user's demand
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [successUsername, setSuccessUsername] = useState('');
  const [successEmail, setSuccessEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const minWait = new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (isLogin) {
        const session = await dbService.login(email.trim(), password.trim());
        await minWait;
        setLoading(false);
        setSuccessUsername(session.username);
        setSuccessEmail(session.email);
        setIsSuccessModalOpen(true);
      } else {
        const finalName = name.trim() || email.split('@')[0];
        const session = await dbService.signUp(email.trim(), password.trim(), finalName, 'student');
        await minWait;
        setLoading(false);
        setSuccessUsername(session.username);
        setSuccessEmail(session.email);
        setIsSuccessModalOpen(true);
      }
    } catch (err: any) {
      await minWait;
      setLoading(false);
      const cleanMsg = err?.message || "An authentication query error occurred. Please check your entry and try again.";
      
      setErrorMessage(cleanMsg);
      setIsFailureModalOpen(true);
    }
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
            <p className="text-emerald-100/80 text-[11px] max-w-xs mx-auto mb-2">Unlock direct recitation records, progress logs, and translation suites</p>
            
            <div className={`mx-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
              dbStatus.configured 
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-950/50 border-amber-500/30 text-amber-305'
            }`}>
              <span className={`w-1 h-1 rounded-full ${dbStatus.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Engine: {dbStatus.mode}</span>
            </div>
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

      {/* FULL-SCREEN OVERLAY DIALOGS TRIGGERED FROM MODAL SUBMISSION */}
      <AnimatePresence>
        
        {/* 1. LOADING OVERLAY */}
        {loading && (
          <motion.div
            key="auth-modal-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6"
            id="auth-modal-loading"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 border border-slate-200 shadow-2xl">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-500/25">
                <GraduationCap className="w-7 h-7 text-amber-700 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Authenticating Credentials
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Verifying immutable scholar keys on the global ledger...
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-3 h-3 bg-emerald-700 rounded-full animate-pulse duration-750" />
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse duration-750 [animation-delay:150ms]" />
                <div className="w-3 h-3 bg-emerald-800 rounded-full animate-pulse duration-750 [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. SUCCESS OVERLAY */}
        {isSuccessModalOpen && (
          <motion.div
            key="auth-modal-success-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6"
            id="auth-modal-success"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
              <div className="w-14 h-14 bg-emerald-500/15 text-emerald-850 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-7 h-7 text-emerald-750" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-950">
                  Academic Identity Secured
                </h4>
                <p className="text-xs text-slate-600">
                  Welcome to the Ilm Naafi sanctuaries, Scholar {successUsername}!
                </p>
                <div className="text-[10px] text-slate-400 font-mono py-1 px-3 bg-slate-50 border border-slate-100 rounded-lg inline-block">
                  {successEmail}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    onSuccess(successUsername, successEmail);
                    onClose();
                  }}
                  className="w-full bg-emerald-800 text-white font-black py-3 rounded-xl text-xs transition cursor-pointer shadow-md hover:bg-emerald-900"
                >
                  Enter Study Workspace
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. FAILURE OVERLAY */}
        {isFailureModalOpen && (
          <motion.div
            key="auth-modal-failure-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6"
            id="auth-modal-failure"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 border border-red-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
              <div className="w-14 h-14 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <AlertCircle className="w-7 h-7 text-red-650" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-950">
                  Authorization Interrupted
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed text-center break-words">
                  {errorMessage}
                </p>
                {errorMessage.includes("Supabase") && (
                  <div className="mt-3 p-3 bg-amber-50 text-amber-900 border border-amber-200/50 rounded-xl text-[10px] text-left leading-normal font-sans space-y-1">
                    <strong className="font-bold block text-slate-900">💡 Supabase Troubleshooting Tip:</strong>
                    <span>If you configured your keys in AI Studio, ensure that you also executed the schema SQL script (found in <code className="font-mono bg-slate-100 p-0.5 px-1 rounded">supabase_schema.sql</code>) inside your Supabase SQL Editor to provision the tables!</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFailureModalOpen(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Revise Inputs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFailureModalOpen(false);
                    onClose();
                  }}
                  className="w-full border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-2 rounded-xl text-[11px] transition cursor-pointer"
                >
                  Return as Guest
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
