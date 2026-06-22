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

  // Dedicated modal sequence states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [successUsername, setSuccessUsername] = useState('');
  const [successEmail, setSuccessEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSimulatedLogin = async () => {
    setLoading(true);
    setAuthError(null);
    const minWait = new Promise(resolve => setTimeout(resolve, 800));
    
    const simulatedUser = {
      id: "sim-user-1122",
      username: "Sulayman Apatira",
      email: "apatirasulayman@gmail.com",
      role: 'student' as const,
      weeklyMinutes: 120,
      lessonsCompleted: ['les-aqeedah-1', 'les-fiqh-1', 'les-seerah-1'],
      savedScholarships: ['sch-isdb', 'sch-kuwait'],
      recentRecitations: [
        { date: "2026-06-20", verse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", score: 96 },
        { date: "2026-06-21", verse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", score: 92 },
        { date: "2026-06-21", verse: "الرَّحْمَٰنِ الرَّحِيمِ", score: 88 }
      ],
      certificates: [
        { title: lang === 'en' ? "Foundational Tajweed Hafs Decibel License" : "إجازة مخارج الحروف وأحكام التلاوة", grade: "94%", date: "2026-06-01", key: "CERT-HAFS-A9" },
        { title: lang === 'en' ? "Golden Era Islamic Science Certificate" : "شهادة مباحث العقيدة والفقه المنهجي", grade: "89%", date: "2026-06-18", key: "CERT-ERAS-E1" }
      ],
      joinedForums: ['recitation', 'scholarships']
    };

    localStorage.setItem('ilm_user', JSON.stringify(simulatedUser));
    localStorage.setItem('ilm_token', 'simulated-token-xyz');
    localStorage.setItem('ilm_token_time', Date.now().toString());

    try {
      await fetch('/api/auth/sync-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer simulated-token-xyz'
        },
        body: JSON.stringify({ user: simulatedUser })
      });
    } catch (e) {
      console.warn("Failed to sync simulated session", e);
    }

    await minWait;
    setLoading(false);
    setSuccessUsername("Sulayman Apatira");
    setSuccessEmail("apatirasulayman@gmail.com");
    setIsSuccessModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    // Give a small delay so they can appreciate the clean, reduced 3-dot loading indicator
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
        const session = await dbService.signUp(email.trim(), password.trim(), finalName, role);
        await minWait;
        setLoading(false);
        setSuccessUsername(session.username);
        setSuccessEmail(session.email);
        setIsSuccessModalOpen(true);
      }
    } catch (err: any) {
      await minWait;
      setLoading(false);
      const cleanMsg = err?.message || (lang === 'en'
        ? "An authorization error occurred. Please try again."
        : "حدث خطأ في الاعتماد الأكاديمي. يرجى المحاولة مجدداً.");
      
      setErrorMessage(cleanMsg);
      setIsFailureModalOpen(true);
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
    <div className="min-h-[90vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/70 relative overflow-hidden animate-fade-in" id="auth-full-screen">
      {/* Decorative background grids */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-amber-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      {/* Main Container: Heavy Box Shadow, Extreme Border Radius, Removed Border Colors */}
      <div className="max-w-5xl w-full bg-white shadow-[0_30px_90px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-12" id="auth-card-master">
        
        {/* LEFT COLUMN: THE GORGEOUS PREVIEW CARD DISPLAY & ONBOARDING */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0c241c] via-[#081813] to-[#040807] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Islamic archway inspired geometric backdrop overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/10 text-emerald-100 hover:text-white hover:bg-white/15 transition-colors text-xs font-bold"
                title={labels.backHome}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{labels.backHome}</span>
              </button>
              
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center border border-transparent text-amber-400">
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
              className="bg-gradient-to-tr from-amber-950/30 via-slate-900/30 to-emerald-950/30 border border-white/5 rounded-[2rem] p-5 relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md"
              id="live-id-card-preview"
            >
              {/* Halos */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl" />

              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full inline-block">
                    {labels.activeVerified}
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
                  <div className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider font-mono">
                    {lang === 'en' ? "Full Name Name" : "الاسم الثنائي والأكاديمي"}
                  </div>
                  <div className="text-base font-bold text-[#fbfbf9] truncate leading-tight mt-0.5">
                    {name || (lang === 'en' ? "Sulayman Apatira" : "سليمان أباتيرا")}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider font-mono">{labels.idLevel}</div>
                    <div className="text-xs font-semibold text-amber-250 mt-0.5">
                      {role === 'student' && labels.roleStudent}
                      {role === 'researcher' && labels.roleResearcher}
                      {role === 'teacher' && labels.roleTeacher}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider font-mono">
                      {lang === 'en' ? "Cryptographic Credential" : "الرمز التعريفي الفريد"}
                    </div>
                    <div className="text-xs font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-emerald-500" />
                      <span>NAFI-{email ? email.split('@')[0].toUpperCase().substring(0, 8) : "APATIRA"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer design details */}
              <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] text-slate-450 font-mono">
                <span>VERIFICATION KEY : 688F-7B21-DD12</span>
                <span>STATUS: DEMO READY</span>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-950 mt-8 space-y-3">
            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200/90 font-medium">
                {lang === 'en' 
                  ? "Track your individual Tajweed correction percentages." 
                  : "سجل مستويات النطق الخاص بك والتقدم التاريخي للتجويد."}
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200/90 font-medium">
                {lang === 'en' 
                  ? "Save authenticated scholarships, grant postings, and webinars." 
                  : "احفظ مراجعات الأكاديمية والمنح الجامعية المدعومة."}
              </p>
            </div>
            <p className="text-[10px] text-emerald-400/50 font-sans pt-2 leading-relaxed">
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
                <span className="p-1 px-1.5 rounded-xl bg-amber-500/10 text-amber-800">
                  <Lock className="w-4 py-0.5 h-4 text-amber-700" />
                </span>
                {isLogin ? labels.signTitle : labels.regTitle}
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                {isLogin ? labels.signSubtitle : labels.regSubtitle}
              </p>
            </motion.div>

            {/* Mode Slide Toggle: Rounded and Border-free */}
            <div className="bg-slate-150/40 p-1 rounded-[1.25rem] text-xs font-bold text-slate-500 h-12 relative flex">
              <button
                type="button"
                onClick={() => toggleAuthMode(true)}
                className={`flex-1 rounded-[1rem] text-center py-2 transition-all outline-none z-10 cursor-pointer ${
                  isLogin ? 'bg-white text-emerald-950 shadow-md font-extrabold scale-[1.02]' : 'hover:text-slate-900'
                }`}
              >
                {labels.toggleSign}
              </button>
              <button
                type="button"
                onClick={() => toggleAuthMode(false)}
                className={`flex-1 rounded-[1rem] text-center py-2 transition-all outline-none z-10 cursor-pointer ${
                  !isLogin ? 'bg-white text-emerald-950 shadow-md font-extrabold scale-[1.02]' : 'hover:text-slate-900'
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
                  className="bg-red-50 rounded-2xl p-4 text-xs text-red-850 font-bold flex items-start gap-2.5 shadow-md"
                >
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-red-950 font-medium">{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* INSTANT DEMO LOGIN ACCESS TRIGGER: HIGHLIGHTED ACCENT FOR TESTING */}
              <div className="p-4 bg-amber-500/5 hover:bg-amber-500/10 rounded-[1.5rem] shadow-[0_12px_40px_rgba(245,158,11,0.08)] transition-all cursor-pointer text-center space-y-2 border border-dashed border-amber-300" onClick={handleSimulatedLogin}>
                <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#744210]">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin [animation-duration:4s]" />
                  <span>{lang === 'en' ? "Instant Dev Authorization (Demo)" : "دخول مباشر لهوية طالب العلم التفاعلية"}</span>
                </div>
                <p className="text-[11px] text-[#975a16] font-medium leading-normal max-w-xs mx-auto">
                  {lang === 'en' 
                    ? "Log in immediately with preloaded certificates, study minutes, custom academic logs, and active recitation telemetry." 
                    : "محاكاة فورية للاسم الأكاديمي، سجل الصلوات، دراسة التجويد والمنح المفتوحة."}
                </p>
              </div>

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
                        className="w-full bg-slate-50 text-slate-800 rounded-2xl p-3.5 text-xs outline-none focus:bg-white transition-all pl-10 focus:ring-2 focus:ring-emerald-800/10"
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
                    className="w-full bg-slate-50 text-slate-800 rounded-2xl p-3.5 text-xs outline-none focus:bg-white transition-all pl-10 focus:ring-2 focus:ring-emerald-800/10"
                    id="auth-input-email"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

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
                    className="w-full bg-slate-50 text-slate-800 rounded-2xl p-3.5 text-xs outline-none focus:bg-white transition-all pl-10 focus:ring-2 focus:ring-emerald-800/10"
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
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white py-3.5 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.15)] active:scale-98 disabled:opacity-50 cursor-pointer"
                  id="auth-btn-submit"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>{isLogin ? labels.btnSign : labels.btnReg}</span>
                </button>
                
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full hover:bg-slate-50 text-slate-650 text-center py-2.5 rounded-xl text-xs font-bold transition-all transition-colors"
                >
                  {labels.backHome}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* FULL-SCREEN OVERLAY DIALOGS SEQUENCE BASED ON STATE */}
      <AnimatePresence>
        
        {/* 1. LOADING MODAL (PULSING THREE DOTS) */}
        {loading && (
          <motion.div
            key="auth-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6"
            id="auth-loading-modal"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 border border-slate-200 shadow-2xl">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-500/25">
                <GraduationCap className="w-7 h-7 text-amber-700 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900">
                  {lang === 'en' ? "Authenticating Credentials" : "جاري فحص رخصة الطلب"}
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  {lang === 'en' 
                    ? "Verifying immutable scholar keys on the global ledger..." 
                    : "يجري تدقيق المفاتيح الأكاديمية ومطابقة ديوان الطلاب..."}
                </p>
              </div>
              
              {/* Premium Horizontal Pulsing Three-Dots Loader */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-3 h-3 bg-emerald-700 rounded-full animate-pulse duration-750" />
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse duration-750 [animation-delay:150ms]" />
                <div className="w-3 h-3 bg-emerald-800 rounded-full animate-pulse duration-750 [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. SUCCESS MODAL */}
        {isSuccessModalOpen && (
          <motion.div
            key="auth-success-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6"
            id="auth-success-modal"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
              <div className="w-14 h-14 bg-emerald-500/15 text-emerald-850 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-7 h-7 text-emerald-750" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-950">
                  {lang === 'en' ? "Academic Identity Secured" : "تم توثيق الهوية بنجاح"}
                </h4>
                <p className="text-xs text-slate-600">
                  {lang === 'en'
                    ? `Welcome to the Ilm Naafi sanctuaries, Scholar ${successUsername}!`
                    : `أهلاً بك مجدداً في أروقة منهل العلم النافع، الشيخ/ة ${successUsername}!`}
                </p>
                <div className="text-[10px] text-slate-400 font-mono py-1 px-3 bg-slate-50 border border-slate-100 rounded-lg inline-block">
                  {successEmail}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    onSuccess(successUsername, successEmail);
                  }}
                  className="w-full bg-emerald-800 text-white font-black py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
                >
                  {lang === 'en' ? "Enter Study Workspace" : "الدخول إلى المحصل العلمي"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. FAILURE MODAL */}
        {isFailureModalOpen && (
          <motion.div
            key="auth-failure-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6"
            id="auth-failure-modal"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 border border-red-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
              <div className="w-14 h-14 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <AlertCircle className="w-7 h-7 text-red-650" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-950">
                  {lang === 'en' ? "Authorization Interrupted" : "عائق في ترخيص الدخول"}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsFailureModalOpen(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  {lang === 'en' ? "Revise Inputs" : "مراجعة المدخلات"}
                </button>
                <button
                  onClick={() => {
                    setIsFailureModalOpen(false);
                    onCancel();
                  }}
                  className="w-full border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-2 rounded-xl text-[11px] transition cursor-pointer"
                >
                  {lang === 'en' ? "Return as Guest" : "مواصلة بصفة زائر"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
