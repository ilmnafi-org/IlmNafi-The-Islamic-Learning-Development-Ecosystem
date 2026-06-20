/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  MapPin, 
  Calendar, 
  Bookmark, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  LogOut, 
  FileText, 
  TrendingUp, 
  Activity, 
  ArrowUpRight,
  Share2,
  CheckCircle,
  Tv,
  ListFilter
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserSession, dbService } from '../lib/supabase';

interface StudentDashboardViewProps {
  lang: 'en' | 'ar';
  user: UserSession;
  onLogout: () => void;
  onNavigateTab: (tabId: string) => void;
}

export default function StudentDashboardView({ lang, user, onLogout, onNavigateTab }: StudentDashboardViewProps) {
  const [successCopy, setSuccessCopy] = useState(false);

  // Stats summary counts
  const totalCompletedLessons = user.lessonsCompleted?.length || 0;
  const totalSavedScholarships = user.savedScholarships?.length || 0;
  const totalRecitationsCount = user.recentRecitations?.length || 0;

  // Compute average Tajweed accuracy score
  const avgAccuracy = totalRecitationsCount > 0
    ? Math.round(user.recentRecitations.reduce((acc, curr) => acc + curr.score, 0) / totalRecitationsCount)
    : 85; // default starting average

  const handleShareID = () => {
    const shareText = `Student Profile of ${user.username} (ID: NAFI-${user.email.split('@')[0].toUpperCase()}) at Nafi Science & Recitation Academy!`;
    navigator.clipboard.writeText(shareText);
    setSuccessCopy(true);
    setTimeout(() => setSuccessCopy(false), 2000);
  };

  const labels = {
    en: {
      title: "Scholar Portal & Dashboard",
      subtitle: "Review your verified student credentials, academic certificates, recitation telemetry, and program applications.",
      idCardTitle: "Nafi Academy Verified ID",
      tier: "Academic Direction",
      idKey: "Cryptographic ID Hash",
      activeVerified: "ACTIVE ACADEMIC RECORD",
      shareId: "Share Student ID",
      copied: "Copied!",
      signOut: "De-authorize Terminal session",
      metrics: "Core Evaluation Metrics",
      accuracyLabel: "Avg Tajweed Pronunciation",
      lessonsLabel: "Finished Lessons",
      savedLabel: "Scholarships Tracked",
      minutesLabel: "Weekly Active Study",
      historyTitle: "Speech & Audio Recitation History",
      histSubtitle: "Recent live coach voice evaluation logs.",
      lessonsDoneTitle: "Academic Curriculum Roadmap",
      lessonsDoneSubtitle: "Lessons successfully finalized and saved.",
      certificateWallet: "Sacred Credentials & Certificates",
      certSubtitle: "Digital verified honors issued to your ledger.",
      trackNo: "Tracking Code",
      noRecs: "No live recitation recordings in current terminal. Open the Quran Coach screen to begin reciting.",
      noCerts: "You haven't earned any academic certificates yet. Finish lessons with quizzes to unlock honors.",
      secularSpiritualTitle: "Holistic Student Stats",
      secularSpiritualDesc: "Harmonizing empirical science tracking with high-accuracy spiritual discipline.",
      activeStatus: "ACTIVE",
      certGrade: "Grade Grade",
      verifiedLedger: "Immutable Blockchain Ledger Verification Pin"
    },
    ar: {
      title: "بوابة ديوان طالب العلم والمنصة",
      subtitle: "راجع وثائق هويتك الأكاديمية والشهادات الفقهية الجارية، تقارير مخارج المحكم ومعاينة المنح المضافة.",
      idCardTitle: "بطاقة الهوية الأكاديمية لمعاينة العلم",
      tier: "الاتجاه الدراسي الأكاديمي",
      idKey: "الرمز التعريفي المشفر",
      activeVerified: "سجل أكاديمي نشط ومعتمد",
      shareId: "مشاركة وثيقة المرجع والتجويد",
      copied: "تم نسخ كود المطابقة!",
      signOut: "إلغاء تخويل الجلسة الحالية",
      metrics: "مؤشرات التقييم الشاملة",
      accuracyLabel: "معدل دقة التجويد الصوتي",
      lessonsLabel: "الدروس المنجزة الكلية",
      savedLabel: "المنح البحثية الجاري تتبعها",
      minutesLabel: "دقائق الدراسة الأسبوعية",
      historyTitle: "سجل وتقييم التلاوة الصوتية",
      histSubtitle: "آخر تلاواتك المسجلة مع تحليل الذكاء الاصطناعي للمخارج والنطق.",
      lessonsDoneTitle: "خارطة المنهج والمباحث",
      lessonsDoneSubtitle: "المواد والدروس العلمية التي أكملت اختباراتها بنجاح.",
      certificateWallet: "محفظة الإجازات والشهادات العلمية",
      certSubtitle: "الشهادات الأكاديمية الممنوحة بناءً على تظافر المنهج.",
      trackNo: "كود الموازنة والتصديق",
      noRecs: "لم تقم بتسجيل أي تلاوة بعد. اذهب لقسم مصحح التلاوة وجرب القراءة بصوتك والتحليل الصوتي الفوري.",
      noCerts: "لم تُمنح أي شهادة حتى الآن. أجب عن أسئلة الاختبارات الدورية داخل المواد التعليمية بنجاح لإصدار رتبتك العلمية.",
      secularSpiritualTitle: "إحصائيات طالب العلم الشاملة",
      secularSpiritualDesc: "التوفيق بين تتبع علوم التاريخ والفيزياء وبين الانضباط القرآني الصوتي والروحي اليومي.",
      activeStatus: "نشط ومعتمد",
      certGrade: "درجة المطابقة",
      verifiedLedger: "بوابة المطابقة والتوثيق الأكاديمي المؤمن"
    }
  }[lang];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10" id="student-dashboard" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-8 mb-10 gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/55 mb-2 inline-block">
            {lang === 'en' ? "Secure Scholar Workspace" : "غرفة التحكم المؤمنة لطالب العلم"}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {labels.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {labels.subtitle}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2.5 rounded-xl border border-red-200 text-red-650 hover:bg-red-50 hover:text-red-800 font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer self-start"
          id="btn-dashboard-sign-out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{labels.signOut}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ID CARD & CORE METRICS BOARD */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* VERIFIED DIGITAL ID CARD */}
          <div className="bg-gradient-to-br from-[#0c1a17] via-[#050f0c] to-slate-950 text-white rounded-[2rem] p-6 shadow-2xl relative overflow-hidden border-2 border-emerald-950/40">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header of ID Card */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/35 px-2.5 py-1 rounded-full inline-block">
                  {labels.activeVerified}
                </span>
                <p className="text-[10px] text-slate-400 mt-1.5">{lang === 'en' ? "Nafi Global Ledger Authority" : "ديوان التصديق لمنارة العلم"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* Student info */}
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  {lang === 'en' ? "Authorized Graduate Name" : "الاسم الثنائي والأكاديمي"}
                </p>
                <h4 className="text-xl font-bold tracking-tight text-[#f9f9f6] leading-tight font-serif mt-1">
                  {user.username}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-[8px] font-mono uppercase tracking-wider text-slate-500">{labels.tier}</p>
                  <p className="text-xs font-bold text-amber-300 mt-1 capitalize leading-tight">
                    {user.role === 'teacher' && (lang === 'en' ? "Certified Tajweed Teacher" : "شريف رواية ومحفظ تلاوة")}
                    {user.role === 'researcher' && (lang === 'en' ? "Historical Researcher" : "باحث علوم وتاريخ إسلامي")}
                    {user.role === 'student' && (lang === 'en' ? "Knowledge Scholar student" : "طالب علم وبحوث")}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-mono uppercase tracking-wider text-slate-500">{labels.idKey}</p>
                  <p className="text-xs font-mono text-emerald-400 mt-1 font-bold leading-tight uppercase">
                    NAFI-{user.email.split('@')[0].toUpperCase().substring(0, 8)}
                  </p>
                </div>
              </div>
            </div>

            {/* ID Footer */}
            <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-[9px] font-mono text-slate-500">
                BLOCK-TICKET: {user.id?.toUpperCase().substring(0, 12) || "SESS-849202"}
              </span>
              
              <button
                onClick={handleShareID}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-[10px] font-bold text-white transition cursor-pointer border border-emerald-500/20"
              >
                <Share2 className="w-3 h-3 text-emerald-300" />
                <span>{successCopy ? labels.copied : labels.shareId}</span>
              </button>
            </div>
          </div>

          {/* DENSE METRICS STATS */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>{labels.metrics}</span>
              <Activity className="w-4 h-4 text-emerald-850" />
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Avg Accuracy */}
              <div className="border border-slate-100 p-3.5 rounded-2xl bg-slate-50/50">
                <span className="text-[10px] font-semibold text-slate-500 block mb-1">{labels.accuracyLabel}</span>
                <div className="flex items-baseline gap-1" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <span className="text-2xl font-black text-slate-900">{avgAccuracy}%</span>
                  <span className="text-[10px] text-emerald-700 font-bold font-mono">↑ 4.2%</span>
                </div>
              </div>

              {/* Finished Lessons */}
              <div className="border border-slate-100 p-3.5 rounded-2xl bg-slate-50/50">
                <span className="text-[10px] font-semibold text-slate-500 block mb-1">{labels.lessonsLabel}</span>
                <div className="flex items-baseline gap-1" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <span className="text-2xl font-black text-slate-900">{totalCompletedLessons}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">/ 14</span>
                </div>
              </div>

              {/* Saved scholarships */}
              <div className="border border-slate-100 p-3.5 rounded-2xl bg-slate-50/50">
                <span className="text-[10px] font-semibold text-slate-500 block mb-1">{labels.savedLabel}</span>
                <div className="flex items-baseline gap-1" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <span className="text-2xl font-black text-slate-900">{totalSavedScholarships}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{lang === 'en' ? "grants" : "منحة"}</span>
                </div>
              </div>

              {/* Weekly study minutes */}
              <div className="border border-slate-100 p-3.5 rounded-2xl bg-slate-50/50">
                <span className="text-[10px] font-semibold text-slate-500 block mb-1">{labels.minutesLabel}</span>
                <div className="flex items-baseline gap-1" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <span className="text-2xl font-black text-emerald-950">{user.weeklyMinutes}</span>
                  <span className="text-[10px] text-slate-450 font-bold">{lang === 'en' ? "min" : "دقيقة"}</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons row */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onNavigateTab('curriculum')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-150 hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-all cursor-pointer"
                style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
              >
                <span className="flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <BookOpen className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>{lang === 'en' ? "Go to Study Curriculum" : "مواصلة منهاج الدروس والفقه"}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              
              <button
                onClick={() => onNavigateTab('forum')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-150 hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-all cursor-pointer"
                style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
              >
                <span className="flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <TrendingUp className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>{lang === 'en' ? "Browse Active Discussion Forum" : "تصفح منتدى الحوار المفتوح"}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RECITATION HISTORY & CERTIFICATE WALLET */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* TWEET-LEVEL SECULAR & SPIRITUAL HOLISTIC PANEL */}
          <div className="bg-gradient-to-tr from-amber-50/40 via-white to-emerald-50/20 border-2 border-slate-205 rounded-3xl p-6 md:p-8 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>{labels.secularSpiritualTitle}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {labels.secularSpiritualDesc}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-white rounded-2xl border border-slate-150 shadow-inner">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  {lang === 'en' ? "Tajweed Score Badge" : "وسام التلاوة المحكمة"}
                </span>
                <div className="flex items-center gap-3" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-950 font-black text-sm border border-emerald-200">
                    {avgAccuracy}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{lang === 'en' ? "Honours Candidate" : "رتبة الإتقان الأكاديمي"}</h5>
                    <p className="text-[10px] text-emerald-700 font-semibold">{lang === 'en' ? "Highly Eloquent Recitation Level" : "اللفظ القرآني الفصيح المعتمد"}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-150 shadow-inner">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  {lang === 'en' ? "Weekly Goal Target" : "معدل الإنجاز اليومي"}
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span>{user.weeklyMinutes} min / 45 min</span>
                    <span>{Math.min(100, Math.round((user.weeklyMinutes / 45) * 100))}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-800 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, (user.weeklyMinutes / 45) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TAJWEED EVALUATION LOG */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-none">
                {labels.historyTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {labels.histSubtitle}
              </p>
            </div>

            {totalRecitationsCount === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-450 text-xs">
                {labels.noRecs}
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {user.recentRecitations.map((rec, i) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4"
                    style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                  >
                    <div className="space-y-1 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        {rec.verse}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold font-sans flex items-center gap-1.5" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <Clock className="w-3 h-3" />
                        <span>{rec.date}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-950 block">{rec.score}% Accuracy</span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        rec.score >= 90 ? 'bg-emerald-100 text-emerald-850' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {rec.score >= 90 ? (lang === 'en' ? "Jayyid Jiddan" : "جيد جداً") : (lang === 'en' ? "Jayyid" : "جيد")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SACRED DIGITAL CERTIFICATES WALLET */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-none flex items-center gap-1.5" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                <Award className="w-5 h-5 text-amber-850" />
                <span>{labels.certificateWallet}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {labels.certSubtitle}
              </p>
            </div>

            {(!user.certificates || user.certificates.length === 0) ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-450 text-xs">
                {labels.noCerts}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.certificates.map((cert, index) => (
                  <div key={index} className="border border-amber-200 bg-amber-50/10 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between h-[155px] shadow-sm">
                    {/* Tiny arch decoration */}
                    <div className="absolute right-0 bottom-0 opacity-10 font-bold text-6xl text-amber-700 pointer-events-none translate-y-4 translate-x-4">
                      
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono tracking-wider bg-amber-100 border border-amber-300 text-amber-950 px-2 py-0.5 rounded-full inline-block">
                        {labels.certGrade}: {cert.grade}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug pt-1" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        {cert.title}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[9px] font-sans text-slate-500 flex justify-between items-center mt-2">
                      <span>{cert.date}</span>
                      <span className="font-mono text-[8px] text-emerald-800 font-extrabold">KEY: {cert.key}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Verification block */}
            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between text-[10px] text-slate-450" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
              <span className="font-sans leading-tight block">{labels.verifiedLedger}</span>
              <span className="font-mono font-bold text-slate-650 shrink-0">SHA-256://NAFI-SYSTEM</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
