/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserCheck, 
  Mail, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  ArrowLeft,
  BookMarked,
  CheckCircle2,
  Lock,
  Globe,
  Award,
  IdCard,
  Hash,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dbService } from '../lib/supabase';

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
  const [role, setRole] = useState<'student' | 'researcher' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isLogin) {
        const session = await dbService.login(email.trim(), password.trim());
        setLoading(false);
        onSuccess(session.username, session.email);
      } else {
        const finalName = name.trim() || email.split('@')[0];
        const session = await dbService.signUp(email.trim(), password.trim(), finalName, role);
        setLoading(false);
        onSuccess(session.username, session.email);
      }
    } catch (err: any) {
      setLoading(false);
      setAuthError(err?.message || (lang === 'en' ? "Authentication failed" : "فشل التحقق من الهوية"));
    }
  };

  const toggleAuthMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setAuthError(null);
    setName('');
    setPassword('');
  };

  const labels = {
    en: {
      signTitle: "Authorized Academic Login",
      regTitle: "Registry: Generate Student ID",
      signSubtitle: "Enter your academic credentials to unlock recitation score histories, saved scholarships, and secure scholar reviews.",
      regSubtitle: "Configure an immutable student identity. Gain instant access to discussion rooms, makhrij audio telemetry, and AI mentors.",
      nameLabel: "Your Full Academic Name",
      emailLabel: "Secured Academic Email",
      passLabel: "Access PIN / Password",
      btnSign: "Authorize Credentials",
      btnReg: "Register Secular & Spiritual ID",
      forgotPin: "Forgot PIN?",
      backHome: "Back to Sanctuary",
      toggleSign: "Sign In Portal",
      toggleReg: "Register New Account",
      loadingText: "Authenticating spiritual credentials...",
      academicRole: "Academic Direction",
      roleStudent: "Student of Quranic Science",
      roleResearcher: "Academic Researcher",
      roleTeacher: "Certified Qari / Teacher",
      previewTitle: "Nafi Academy Board ID Card Preview",
      activeVerified: "ACTIVE & VERIFIED",
      registeredIn: "Nafi Global Ledger",
      idLevel: "Academic Tier",
      securePhrase: "End-to-end encrypted under scholar-reviewed consensus protocols."
    },
    ar: {
      signTitle: "تسجيل الدخول الأكاديمي المعتمد",
      regTitle: "بوابة التسجيل وإصدار الهوية",
      signSubtitle: "أدخل بياناتك الأكاديمية لمتابعة نتائج تصحيح التلاوة، مراجعة الأوراد، والمنح الدراسية المحفوظة.",
      regSubtitle: "أنشئ حساباً أكاديمياً متكاملاً. احصل فوراً على أدوات قياس الصوت ونقد التلاوة بالذكاء الاصطناعي.",
      nameLabel: "الاسم الأكاديمي الكامل واللقب",
      emailLabel: "البريد الإلكتروني المعتمد",
      passLabel: "رمز المرور السري (PIN)",
      btnSign: "اعتماد وثيقة الدخول",
      btnReg: "إصدار بطاقة الهوية وحفظ السجل الدراسي",
      forgotPin: "هل نسيت رمز الدخول السري؟",
      backHome: "العودة للرئيسية الميسرة",
      toggleSign: "بوابة الدخول المعرفية",
      toggleReg: "تسجيل حساب جديد",
      loadingText: "يجري التحقق من هويتك وصحة التراخيص الفقهية الجارية...",
      academicRole: "المسار الأكاديمي",
      roleStudent: "طالب علم القراءات والتجويد",
      roleResearcher: "باحث علوم اللغة والتاريخ البشري",
      roleTeacher: "شريف رواية / مجاز ومحفّظ تلاوة",
      previewTitle: "معاينة بطاقة هوية طالب العلم",
      activeVerified: "معتمد ومسجل بالكامل",
      registeredIn: "ديوان العلم النافع",
      idLevel: "المستوى الدراسي",
      securePhrase: "الحساب مؤمن بالكامل بموجب معايير الإشراف الأكاديمي المعتمدة."
    }
  }[lang];

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/70 relative overflow-hidden" id="auth-full-screen">
      {/* Decorative background grids */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-amber-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      <div className="max-w-5xl w-full bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12" id="auth-card-master">
        
        {/* LEFT COLUMN: THE GORGEOUS PREVIEW CARD DISPLAY & ONBOARDING */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-905">
          {/* Islamic archway inspired geometric backdrop overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 text-emerald-100 hover:text-white hover:bg-white/15 transition-colors text-xs font-bold"
                title={labels.backHome}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{labels.backHome}</span>
              </button>
              
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30 text-amber-400">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-extrabold flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                {lang === 'en' ? "Pristine Sacred Learning" : "تأصيل المعرفة ونقاء المخارج"}
              </span>
              <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">
                {labels.previewTitle}
              </h3>
            </div>

            {/* LIVE PREVIEW SCHOLAR ID CARD */}
            <motion.div 
              layout
              className="bg-gradient-to-tr from-amber-950/40 via-slate-900/40 to-emerald-950/40 border border-white/15 rounded-2xl p-5 relative shadow-xl backdrop-blur-md"
              id="live-id-card-preview"
            >
              {/* Halos */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl" />

              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block">
                    ★ {labels.activeVerified}
                  </span>
                  <div className="text-xs font-mono text-slate-400 mt-1">{labels.registeredIn}</div>
                </div>
                <div className="text-right">
                  <Award className="w-8 h-8 text-amber-500 opacity-90" />
                </div>
              </div>

              {/* Card holder content */}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-[9px] font-extrabold uppercase text-slate-450 tracking-wider font-mono">
                    {lang === 'en' ? "Full Name Name" : "الاسم الثنائي والأكاديمي"}
                  </div>
                  <div className="text-base font-bold text-[#fbfbf9] truncate leading-tight font-serif mt-0.5">
                    {name || (lang === 'en' ? "Unregistered Candidate" : "طالب علم مستمر")}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] font-extrabold uppercase text-slate-450 tracking-wider font-mono">{labels.idLevel}</div>
                    <div className="text-xs font-semibold text-amber-250 mt-0.5">
                      {role === 'student' && labels.roleStudent}
                      {role === 'researcher' && labels.roleResearcher}
                      {role === 'teacher' && labels.roleTeacher}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-extrabold uppercase text-slate-450 tracking-wider font-mono">
                      {lang === 'en' ? "Cryptographic Credential" : "الرمز التعريفي الفريد"}
                    </div>
                    <div className="text-xs font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-emerald-500" />
                      <span>NAFI-{email ? email.split('@')[0].toUpperCase().substring(0, 8) : "GUEST-99"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer design details */}
              <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>VERIFICATION KEY : 688F-7B21-DD12</span>
                <span>STATUS: ISSUING...</span>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-900 mt-8 space-y-3">
            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-250 font-medium">
                {lang === 'en' 
                  ? "Track your individual Tajweed correction percentages." 
                  : "سجل مستويات النطق الخاص بك والتقدم التاريخي للتجويد."}
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-250 font-medium">
                {lang === 'en' 
                  ? "Save authenticated scholarships, grant postings, and webinars." 
                  : "احفظ مراجعات الأكاديمية والمنح الجامعية المدعومة."}
              </p>
            </div>
            <p className="text-[10px] text-emerald-300/65 font-sans pt-2 leading-relaxed">
              {labels.securePhrase}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: THE ELEGANT REGISTRY FORM PANEL */}
        <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header segment */}
            <motion.div 
              key={isLogin ? 'login-header' : 'register-header'}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-2">
                <span className="p-1 px-1.5 rounded-lg bg-amber-500/10 text-amber-800">
                  <Lock className="w-4 py-0.5 h-4 text-amber-700" />
                </span>
                {isLogin ? labels.signTitle : labels.regTitle}
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                {isLogin ? labels.signSubtitle : labels.regSubtitle}
              </p>
            </motion.div>

            {/* Mode Slide Toggle */}
            <div className="bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-500 h-12 border border-slate-200/60 relative flex">
              <button
                type="button"
                onClick={() => toggleAuthMode(true)}
                className={`flex-1 rounded-xl text-center py-2 transition-all outline-none z-10 cursor-pointer ${
                  isLogin ? 'bg-white text-emerald-900 shadow-md font-extrabold' : 'hover:text-slate-900'
                }`}
              >
                {labels.toggleSign}
              </button>
              <button
                type="button"
                onClick={() => toggleAuthMode(false)}
                className={`flex-1 rounded-xl text-center py-2 transition-all outline-none z-10 cursor-pointer ${
                  !isLogin ? 'bg-white text-emerald-900 shadow-md font-extrabold' : 'hover:text-slate-900'
                }`}
              >
                {labels.toggleReg}
              </button>
            </div>

            {/* Error Indicators */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-red-50 border border-red-200/80 rounded-2xl p-4 text-xs text-red-850 font-bold flex items-start gap-2.5 shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-red-950 font-medium">{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <AnimatePresence initial={false} mode="popLayout">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, scale: 0.96 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden space-y-1.5"
                  >
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {labels.nameLabel}
                    </label>
                    <div className="relative w-full">
                      <input 
                        type="text"
                        required={!isLogin}
                        placeholder={lang === 'en' ? "e.g. Salim Al-Hassan" : "مثال: سالم بن عبد الله"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50/60 text-slate-800 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-xs outline-none focus:bg-white transition-all pl-10"
                        id="auth-input-name"
                      />
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {labels.emailLabel}
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    required
                    placeholder="student@ilm-naafi.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/60 text-slate-800 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-xs outline-none focus:bg-white transition-all pl-10"
                    id="auth-input-email"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <AnimatePresence initial={false} mode="popLayout">
                {!isLogin && (
                  <motion.div
                    key="role-field"
                    initial={{ opacity: 0, height: 0, scale: 0.96 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden space-y-1.5"
                  >
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {labels.academicRole}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          role === 'student' 
                            ? 'border-amber-500 bg-amber-505 bg-amber-500/5 text-amber-900 font-extrabold' 
                            : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        {labels.roleStudent}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('researcher')}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          role === 'researcher' 
                            ? 'border-amber-500 bg-amber-505 bg-amber-500/5 text-amber-900 font-extrabold' 
                            : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        {labels.roleResearcher}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          role === 'teacher' 
                            ? 'border-amber-500 bg-amber-505 bg-amber-500/5 text-amber-900 font-extrabold' 
                            : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        {labels.roleTeacher}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {labels.passLabel}
                </label>
                <div className="relative">
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50/60 text-slate-800 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-xs outline-none focus:bg-white transition-all pl-10"
                    id="auth-input-password"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-[11px] text-amber-800 hover:underline font-bold">{labels.forgotPin}</a>
                </div>
              )}

              <div className="pt-4 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-800 hover:bg-emerald-950 text-white py-3.5 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                  id="auth-btn-submit"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>{labels.loadingText}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>{isLogin ? labels.btnSign : labels.btnReg}</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-center py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  {labels.backHome}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
