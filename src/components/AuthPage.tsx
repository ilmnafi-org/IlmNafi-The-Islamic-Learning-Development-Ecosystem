/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, Mail, Key, ShieldCheck, Sparkles, BookOpen, GraduationCap, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  lang: 'en' | 'ar';
  onSuccess: (username: string, email: string) => void;
  onCancel: () => void;
}

export default function AuthPage({ lang, onSuccess, onCancel }: AuthPageProps) {
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
      onSuccess(
        name || email.split('@')[0] || (lang === 'en' ? "Scholar Student" : "طالب العلم"),
        email || "student@ilm-naafi.edu"
      );
    }, 1200);
  };

  const labels = {
    en: {
      signTitle: "Sign In to Your Academy Board",
      regTitle: "Register Your Student ID",
      signSubtitle: "Enter your academic credentials to unlock recitation score tracking and scholarship bookmarks.",
      regSubtitle: "Create a lifetime student profile. Gain instant access to peer discussion rooms and our AI mentor.",
      nameLabel: "Your Full Name",
      emailLabel: "Academy Email Address",
      passLabel: "Access PIN / Password",
      btnSign: "Key Authorization",
      btnReg: "Provision Student ID Card",
      forgotPin: "Forgot PIN?",
      backHome: "Back to Home",
      toggleSign: "Sign In",
      toggleReg: "Register ID",
      loadingText: "Authenticating spiritual credentials..."
    },
    ar: {
      signTitle: "تسجيل الدخول إلى لوحة الأكاديمية",
      regTitle: "تسجيل بطاقة هوية طالب العلم",
      signSubtitle: "أدخل بياناتك الأكاديمية لمتابعة نتائج تصحيح التلاوة وحفظ المنح الدراسية.",
      regSubtitle: "أنشئ ملف متعلم مدى الحياة. احصل على ميزات تصحيح فوري والاتصال بمنتدى طلاب العلم.",
      nameLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني للأكاديمية",
      passLabel: "رمز المرور (PIN)",
      btnSign: "تصريح الدخول المعتمد",
      btnReg: "إصدار بطاقة الهوية الجامعية",
      forgotPin: "هل نسيت الرمز؟",
      backHome: "العودة للرئيسية",
      toggleSign: "تسجيل الدخول",
      toggleReg: "تسجيل جديد",
      loadingText: "يجري التحقق من هويتك الدراسية المعتمدة..."
    }
  }[lang];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50" id="auth-full-screen">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-205 shadow-xl rounded-2xl overflow-hidden" id="auth-card-full">
        
        {/* Banner with Majestic Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-8 text-center relative space-y-2">
          <button
            onClick={onCancel}
            className="absolute left-4 top-4 p-1.5 rounded-lg bg-emerald-900/30 text-emerald-200 hover:text-white transition-colors"
            title={labels.backHome}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-700/20 flex items-center justify-center text-emerald-200 border border-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl font-bold tracking-tight">
            {isLogin ? labels.signTitle : labels.regTitle}
          </h2>
          <p className="text-emerald-100/80 text-xs leading-relaxed max-w-sm mx-auto">
            {isLogin ? labels.signSubtitle : labels.regSubtitle}
          </p>
        </div>

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          
          {/* Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-500 h-10 border border-slate-200/50">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-lg text-center py-1.5 transition-all outline-none ${
                isLogin ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-800'
              }`}
            >
              {labels.toggleSign}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-lg text-center py-1.5 transition-all outline-none ${
                !isLogin ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-800'
              }`}
            >
              {labels.toggleReg}
            </button>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                {labels.nameLabel}
              </label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  placeholder={lang === 'en' ? "e.g. Salim Al-Hassan" : "مثال: سالم بن عبد الله"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-850 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all pl-9"
                  id="auth-input-name"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {labels.emailLabel}
            </label>
            <div className="relative">
              <input 
                type="email"
                required
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 text-slate-850 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all pl-9"
                id="auth-input-email"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
              {labels.passLabel}
            </label>
            <div className="relative">
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 text-slate-850 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all pl-9"
                id="auth-input-password"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-[11px] text-emerald-700 hover:underline font-semibold">{labels.forgotPin}</a>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-950 text-white py-3 px-4 rounded-xl text-xs font-bold transition flex-items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              id="auth-btn-submit"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{labels.loadingText}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLogin ? labels.btnSign : labels.btnReg}</span>
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-slate-500 hover:text-slate-800 text-center py-2 text-xs font-bold transition"
            >
              {labels.backHome}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
