/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Award, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  BarChart, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Calendar,
  Sparkles,
  BookOpen,
  Check,
  ChevronRight,
  Hash,
  Heart,
  CalendarRange,
  Volume2
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProgress } from '../types';

interface StudentDashboardProps {
  lang: 'en' | 'ar';
  progress: UserProgress;
  onNavigateToTab: (tab: any) => void;
  onRemoveBookmark: (id: string) => void;
}

export default function StudentDashboard({ lang, progress, onNavigateToTab, onRemoveBookmark }: StudentDashboardProps) {
  const [dailyChecklist, setDailyChecklist] = useState<{
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    recitation: boolean;
    lessons: boolean;
    adhkar: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('dailyChecklist_v1');
      const savedDate = localStorage.getItem('dailyChecklistDate_v1');
      const today = new Date().toDateString();
      if (saved && savedDate === today) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      recitation: false,
      lessons: false,
      adhkar: false
    };
  });

  const toggleCheck = (item: keyof typeof dailyChecklist) => {
    setDailyChecklist(prev => {
      const next = { ...prev, [item]: !prev[item] };
      try {
        localStorage.setItem('dailyChecklist_v1', JSON.stringify(next));
        localStorage.setItem('dailyChecklistDate_v1', new Date().toDateString());
      } catch (e) {}
      return next;
    });
  };

  const completedCount = Object.values(dailyChecklist).filter(Boolean).length;
  const totalTasks = Object.keys(dailyChecklist).length;
  const dailyProgressPercent = Math.round((completedCount / totalTasks) * 100);

  // Sample scholarships database lookup to show names
  const scholarLookup: { [key: string]: { title: string; country: string; coverage: string } } = {
    'sch-isdb': { title: "Islamic Development Bank (IsDB) Scholarship", country: "Saudi Arabia / France", coverage: "Fully Funded" },
    'sch-kuwait': { title: "Kuwait University Arabic Language Scholarship Program", country: "Kuwait", coverage: "Full Tuition + Stipend" },
    'sch-brunei': { title: "Brunei Darussalam Government Scholarship", country: "Brunei", coverage: "Fully Funded" },
    'sch-qatar': { title: "Qatar University Postgraduate Research Fellowship", country: "Qatar", coverage: "Partially Funded" },
    'sch-turkiye': { title: "Türkiye Bursları Scholarship Program", country: "Turkey", coverage: "Fully Funded" }
  };

  const labels = {
    en: {
      title: "Student Workspace Portal",
      subtitle: "Review your secure academic ledger, recitation analytics, and spiritual study objectives.",
      membership: "Secured Academic Member",
      idCardTitle: "Nafi Academy Board ID",
      cardActive: "ACTIVE & ACCREDITED",
      weeklyFocus: "Weekly Statistics",
      studyMin: "Study Minutes",
      articlesRead: "Treatises Mastered",
      savedGrants: "Saved Grants",
      avgAccuracy: "Tajweed Accuracy",
      recentEvaluations: "Recitation Evaluations",
      noRecitations: "No voice coach evaluations completed yet.",
      evaluationTitle: "Acoustic Recital Timeline",
      spiritualPlanner: "Daily Devotional Goal Tracker",
      prayerTracker: "Salah Attendance Monitor",
      generalTasks: "Academic & Personal Adhkar",
      progressRate: "Plan Completion Rate",
      congratulations: "Excellent dedication! Seek help from your Lord.",
      bookmarksBlock: "My Scholarship Applications Console",
      noBookmarks: "No global scholarship opportunities bookmarked yet.",
      quickActions: "Workspace Navigation Triggers",
      goToRecitation: "Launch AI Coach",
      goToCurriculum: "Open Global Curriculum",
      fajr: "Fajr Prayer",
      dhuhr: "Dhuhr Prayer",
      asr: "Asr Prayer",
      maghrib: "Maghrib Prayer",
      isha: "Isha Prayer",
      reciteCheck: "Tajweed AI Practice (15m)",
      readCheck: "Study Golden Age Lessons",
      adhkarCheck: "Morning & Evening Adhkar"
    },
    ar: {
      title: "معمل دراسة طالب العلم",
      subtitle: "راجع بوابتك الأكاديمية المعتمدة، وسجلات تطور قراءتك، والخطط الروحية والدنيوية المجدولة.",
      membership: "طالب علم مسجل في ديوان الأكاديمية",
      idCardTitle: "بطاقة الهوية الأكاديمية الموحدة",
      cardActive: "عضوية معتمدة ونشطة",
      weeklyFocus: "إحصائيات تقدمك الأسبوعي",
      studyMin: "دقائق التحصيل",
      articlesRead: "المباحث والدروس منجزة",
      savedGrants: "منح محفوظ لتنسيقها",
      avgAccuracy: "متوسط دقة مخارج الصوت",
      recentEvaluations: "سجل تصحيح التلاوات بالذكاء الاصطناعي",
      noRecitations: "لا توجد قراءات معالجة بالصوت حالياً.",
      evaluationTitle: "خط السمع والنطق الصوتي المطور",
      spiritualPlanner: "منظم العبادات والأوراد اليومي",
      prayerTracker: "سجل الصلوات الخمس والرباط",
      generalTasks: "الأوراد وأنشطة الدرس والطلب",
      progressRate: "معدل الإنجاز لليوم الحالي",
      congratulations: "مستوى رائع ومبارك! استعن بالله ولا تعجز.",
      bookmarksBlock: "منصة المنح ومساعد البحث المحفوظ",
      noBookmarks: "لم تقم بحفظ أي منح دراسية أو بعثات علمية في الحساب حتى الآن.",
      quickActions: "لوحة التحكم والانتقال السريع",
      goToRecitation: "تطبيق التجويد والمخارج",
      goToCurriculum: "ديوان المقررات المفتوحة",
      fajr: "صلاة الفجر",
      dhuhr: "صلاة الظهر",
      asr: "صلاة العصر",
      maghrib: "صلاة المغرب",
      isha: "صلاة العشاء",
      reciteCheck: "تمرين تلاوة ببروتوكول الذكاء الاصطناعي",
      readCheck: "قراءة مقال أو تلخيص تاريخي",
      adhkarCheck: "أوراد الصباح والمساء والاستغفار"
    }
  }[lang];

  // Average accuracy calculation from recitations
  const averageAccuracy = progress.recentRecitations.length > 0
    ? Math.round(progress.recentRecitations.reduce((acc, curr) => acc + curr.score, 0) / progress.recentRecitations.length)
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 space-y-10" id="student-workspace-dashboard">
      
      {/* Header segment with premium greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-250/20 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            {labels.membership}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">
            {labels.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-sans">
            {labels.subtitle}
          </p>
        </div>
        <div className="text-slate-400 text-xs font-mono bg-white border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-2 self-start md:self-auto shadow-sm">
          <Calendar className="w-4 h-4 text-emerald-800" />
          <span>UTC: {new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT CARD COLUMN: ID BADGE & METRIC CIRCLES */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* DIGITAL ACCREDITED COINED ID BADGE */}
          <div 
            className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-[#071d18] to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-950/60"
            id="student-id-display-box"
          >
            {/* Islamic geometric pattern outline overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />

            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/35 px-2.5 py-0.5 rounded-full inline-block tracking-wider uppercase font-mono">
                  ● {labels.cardActive}
                </span>
                <p className="text-[10px] text-emerald-250 font-semibold tracking-wide font-mono mt-1.5">{labels.idCardTitle}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            {/* Account Information details */}
            <div className="mt-8 space-y-4">
              <div>
                <span className="text-[9px] text-emerald-100/50 uppercase tracking-widest font-bold block">{lang === 'en' ? "ACADEMIC HOLDER" : "الاسم الأكاديمي الكامل"}</span>
                <span className="text-lg font-bold text-white tracking-tight leading-none mt-1 block truncate">
                  {progress.username || "Scholar Seeker"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[9px] text-emerald-100/50 uppercase tracking-widest font-bold block">{lang === 'en' ? "REGISTRY TIERS" : "المستوى الدراسي"}</span>
                  <span className="text-xs font-bold text-amber-250 mt-1 block">
                    {lang === 'en' ? "Quranic Sciences Spec." : "قراءات وتجويد معاصر"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-100/50 uppercase tracking-widest font-bold block">{lang === 'en' ? "VERIFICATION CODE" : "معرف التوثيق الفريد"}</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold mt-1 block flex items-center gap-1">
                    <Hash className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>NAFI-{progress.email ? progress.email.split('@')[0].toUpperCase().substring(0, 7) : "STUDENT"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* QR/Barcode style simulation element */}
            <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex gap-0.5">
                {[1, 4, 2, 6, 1, 3, 5, 2, 7, 1, 3, 4, 1, 5, 2, 2].map((w, idx) => (
                  <span key={idx} className="bg-white/40 inline-block h-4" style={{ width: `${w}px` }}></span>
                ))}
              </div>
              <span className="text-[9px] text-emerald-100/35 font-mono">MD-688F-7B21-DD12</span>
            </div>

          </div>

          {/* STUDY STATS BLOCKS (4 GRID PIECES) */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1 pb-2 border-b border-slate-100">
              {labels.weeklyFocus}
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{labels.studyMin}</span>
                  <Clock className="w-3.5 h-3.5 text-amber-800" />
                </div>
                <div className="mt-2 text-xl font-extrabold text-slate-900">{progress.weeklyMinutes}</div>
                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">This cycle</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{labels.articlesRead}</span>
                  <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                </div>
                <div className="mt-2 text-xl font-extrabold text-slate-900">{progress.lessonsCompleted.length}</div>
                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Approved items</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{labels.savedGrants}</span>
                  <Bookmark className="w-3.5 h-3.5 text-amber-800" />
                </div>
                <div className="mt-2 text-xl font-extrabold text-slate-900">{progress.savedScholarships.length}</div>
                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Bookmarked</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{labels.avgAccuracy}</span>
                  <Award className="w-3.5 h-3.5 text-amber-800" />
                </div>
                <div className="mt-2 text-xl font-extrabold text-emerald-800">{averageAccuracy > 0 ? `${averageAccuracy}%` : 'N/A'}</div>
                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Avg voice score</span>
              </div>

            </div>

          </div>

          {/* QUICK LINKS AREA */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-5 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{labels.quickActions}</h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateToTab('coach')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 text-left border border-slate-150 text-xs font-bold text-slate-800 transition cursor-pointer"
                style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
              >
                <div className="flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <Volume2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>{labels.goToRecitation}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => onNavigateToTab('curriculum')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 text-left border border-slate-150 text-xs font-bold text-slate-800 transition cursor-pointer"
                style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
              >
                <div className="flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <BookOpen className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>{labels.goToCurriculum}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT AREA COLUMN: HABITS & SCHOLARSHIPS & VOICE LOGS */}
        <div className="lg:col-span-8 space-y-6">

          {/* SPIRITUAL & ACADEMIC PLANNER DAILY HABITS ACCORDION */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-amber-800 shrink-0" />
                  {labels.spiritualPlanner}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Mark your daily milestones to verify steady comprehensive progress.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-black text-emerald-950 font-mono bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl">
                  {completedCount}/{totalTasks} ({dailyProgressPercent}%)
                </span>
              </div>
            </div>

            {/* PROGRESS BAR DIAL */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-600 to-emerald-700 h-full rounded-full transition-all duration-500" 
                style={{ width: `${dailyProgressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Daily Salah checkoff list */}
              <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-slate-150">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-amber-900/10 mb-1">
                  {labels.prayerTracker}
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'fajr', label: labels.fajr, time: "04:12" },
                    { key: 'dhuhr', label: labels.dhuhr, time: "12:35" },
                    { key: 'asr', label: labels.asr, time: "16:15" },
                    { key: 'maghrib', label: labels.maghrib, time: "19:42" },
                    { key: 'isha', label: labels.isha, time: "21:18" }
                  ].map((salah) => {
                    const isChecked = dailyChecklist[salah.key as keyof typeof dailyChecklist];
                    return (
                      <button
                        key={salah.key}
                        onClick={() => toggleCheck(salah.key as any)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-900 font-extrabold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                      >
                        <span className="flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span>{salah.label}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{salah.time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Devotional study checklist */}
              <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-slate-150">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-amber-900/10 mb-1">
                  {labels.generalTasks}
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'recitation', label: labels.reciteCheck, desc: "Acoustics loop" },
                    { key: 'lessons', label: labels.readCheck, desc: "Kitab treatises" },
                    { key: 'adhkar', label: labels.adhkarCheck, desc: "Reminders recitation" }
                  ].map((task) => {
                    const isChecked = dailyChecklist[task.key as keyof typeof dailyChecklist];
                    return (
                      <button
                        key={task.key}
                        onClick={() => toggleCheck(task.key as any)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-900 font-extrabold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                      >
                        <span className="flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span className="leading-tight block">{task.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {dailyProgressPercent === 100 && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-[10px] font-bold text-amber-900 flex items-center justify-center gap-1.5 animate-bounce mt-4"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{labels.congratulations}</span>
                  </motion.div>
                )}

              </div>

            </div>

          </div>

          {/* SCHOLARSHIP BOOKMARKS TRACKING WORKSPACE */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-800 shrink-0" />
              {labels.bookmarksBlock}
            </h3>

            {progress.savedScholarships.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
                {labels.noBookmarks}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progress.savedScholarships.map(id => {
                  const ref = scholarLookup[id] || { title: id, country: "Global Opportunity", coverage: "Funded Scholarship" };
                  return (
                    <div key={id} className="p-4 rounded-2xl border border-slate-200 bg-[#FAF8F5] relative flex flex-col justify-between hover:border-amber-600 transition space-y-3">
                      <div>
                        <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-lg inline-block uppercase tracking-wider mb-2">
                          ★ {ref.coverage}
                        </span>
                        <h4 className="text-xs font-bold text-slate-905 line-clamp-2 leading-snug">{ref.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{ref.country}</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1.5">
                        <button
                          onClick={() => onNavigateToTab('scholarships')}
                          className="text-[10px] font-extrabold text-[#704214] hover:underline flex items-center gap-1 bg-transparent cursor-pointer"
                        >
                          <span>{lang === 'en' ? "Open Details" : "عرض التفاصيل"}</span>
                          <ArrowRight className="w-3 h-3 text-amber-600" />
                        </button>

                        <button
                          onClick={() => onRemoveBookmark(id)}
                          className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-transparent cursor-pointer hover:underline"
                        >
                          {lang === 'en' ? "Remove Bookmark" : "إزالة الحفظ"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RECENT RECITATION AUDIO COACH EVALUATIONS */}
          <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-800 shrink-0" />
              {labels.recentEvaluations}
            </h3>

            {progress.recentRecitations.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
                {labels.noRecitations}
              </div>
            ) : (
              <div className="space-y-3">
                {progress.recentRecitations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-2xl border border-slate-150 bg-white hover:border-slate-300 transition flex items-center justify-between gap-4"
                    style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                  >
                    <div className="space-y-1 text-left" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      <p className="text-xs font-black text-slate-900 leading-tight block">{rec.verse}</p>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block">{rec.date}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      <span className="text-[11px] text-slate-500 font-semibold">{lang === 'en' ? "Accoustic Score:" : "دقة المخارج والغنّة:"}</span>
                      <span className={`text-sm md:text-base font-black px-3 py-1 rounded-xl border font-mono ${
                        rec.score >= 90 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : rec.score >= 80 
                          ? 'bg-blue-50 border-blue-200 text-blue-800' 
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        {rec.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
