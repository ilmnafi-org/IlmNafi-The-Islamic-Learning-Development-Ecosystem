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
  Clock, 
  BarChart, 
  ArrowRight,
  Calendar,
  Sparkles,
  BookOpen,
  Check,
  ChevronRight,
  Hash,
  Volume2,
  Bell,
  MessageSquare,
  Lock,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../types';

interface StudentDashboardProps {
  lang: 'en' | 'ar';
  progress: UserProgress;
  onNavigateToTab: (tab: any) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateProgress?: (newProgress: any) => void;
}

export default function StudentDashboard({ 
  lang, 
  progress, 
  onNavigateToTab, 
  onRemoveBookmark,
  onUpdateProgress
}: StudentDashboardProps) {
  // Tab controller for the inner pages: 'overview' | 'academics' | 'devotion' | 'forums'
  const [innerTab, setInnerTab] = useState<'overview' | 'academics' | 'devotion' | 'forums'>('overview');

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

  const [submittingJoin, setSubmittingJoin] = useState<string | null>(null);

  // AI Devotional Plan states
  const [aiTopic, setAiTopic] = useState<'studies' | 'focus' | 'tahajjud' | 'patience' | 'memorization' | 'custom'>('studies');
  const [aiCustomInput, setAiCustomInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState<{
    topic: string;
    arabicText: string;
    transliteration: string;
    translation: string;
    context: string;
  } | null>(null);
  const [showAiConfig, setShowAiConfig] = useState(true);

  const handleJoinLeaveForum = async (category: string, isCurrentlyJoined: boolean) => {
    if (!progress.email) {
      alert(lang === 'en' 
        ? "Please sign in or create an account to subscribe to study boards and receive live notifications." 
        : "برجاء تسجيل الدخول أو إنشاء حساب أولاً للانضمام للرابط وحلقات المذاكرة ومزامنة التنبيهات.");
      onNavigateToTab('auth');
      return;
    }

    setSubmittingJoin(category);
    try {
      const endpoint = isCurrentlyJoined ? '/api/forum/leave' : '/api/forum/join';
      const token = localStorage.getItem('ilm_token');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ category })
      });
      if (response.ok) {
        const result = await response.json();
        if (onUpdateProgress && result.joinedForums) {
          onUpdateProgress({
            ...progress,
            joinedForums: result.joinedForums
          });
        }
      }
    } catch (e) {
      console.error("Failed to alter forum membership:", e);
    } finally {
      setSubmittingJoin(null);
    }
  };

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

  const scholarLookup: { [key: string]: { title: string; country: string; coverage: string } } = {
    'sch-isdb': { title: "Islamic Development Bank (IsDB) Scholarship", country: "Saudi Arabia / France", coverage: "Fully Funded" },
    'sch-kuwait': { title: "Kuwait University Arabic Language Scholarship Program", country: "Kuwait", coverage: "Full Tuition + Stipend" },
    'sch-brunei': { title: "Brunei Darussalam Government Scholarship", country: "Brunei", coverage: "Fully Funded" },
    'sch-qatar': { title: "Qatar University Postgraduate Research Fellowship", country: "Qatar", coverage: "Partially Funded" },
    'sch-turkiye': { title: "Türkiye Bursları Scholarship Program", country: "Turkey", coverage: "Fully Funded" }
  };

  // Pre-seed some default certificates if none exists in progress
  const defaultCertificates = [
    { title: lang === 'en' ? "Foundational Tajweed Hafs Decibel License" : "إجازة مخارج الحروف وأحكام التلاوة", grade: "94%", date: "2026-06-01", key: "CERT-HAFS-A9" },
    { title: lang === 'en' ? "Golden Era Islamic Science Certificate" : "شهادة مباحث العقيدة والفقه المنهجي", grade: "89%", date: "2026-06-18", key: "CERT-ERAS-E1" }
  ];

  const certificatesList = progress.certificates || defaultCertificates;

  // Pre-seed some mocked completed lessons for the curriculum roadmap view
  const defaultLessonsMap = [
    { id: "les-aqeedah-1", title: lang === 'en' ? "Unification of Divinity (Tawhid)" : "شهادة أن لا إله إلا الله ومقتضاها", cat: "Aqeedah" },
    { id: "les-fiqh-1", title: lang === 'en' ? "Purification (Taharah) Essentials" : "كتاب الطهارة وشروط الصلاة المعتبرة", cat: "Fiqh" },
    { id: "les-seerah-1", title: lang === 'en' ? "The Meccan Period Chronology" : "خلاصة العهد المكي والبعثة النبوية", cat: "Seerah" }
  ];

  const activeLessons = progress.lessonsCompleted && progress.lessonsCompleted.length > 0
    ? progress.lessonsCompleted.map(id => ({ id, title: id.toUpperCase().replace("-", " "), cat: "Sciences" }))
    : defaultLessonsMap;

  const labels = {
    en: {
      membership: "Secured Academic Member",
      title: "Student Workspace Portal",
      subtitle: "Review your secure academic ledger, recitation analytics, and spiritual study objectives.",
      idCardTitle: "Nafi Academy Board ID",
      cardActive: "ACTIVE & ACCREDITED",
      weeklyFocus: "Weekly Statistics",
      studyMin: "Study Minutes",
      articlesRead: "Treatises Mastered",
      savedGrants: "Saved Grants",
      avgAccuracy: "Tajweed Accuracy",
      recentEvaluations: "Recitation Evaluations",
      noRecitations: "No voice coach evaluations completed yet.",
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
      adhkarCheck: "Morning & Evening Adhkar",
      // Inner tabs
      tabOverview: "Overview",
      tabAcademics: "Academic Wallet",
      tabDevotion: "Devotional Plan",
      tabForums: "Forums & Channels",
      idKey: "Verification Hash",
      roleLabel: "Registry Tier"
    },
    ar: {
      membership: "طالب علم مسجل في ديوان الأكاديمية",
      title: "معمل دراسة طالب العلم",
      subtitle: "راجع بوابتك الأكاديمية المعتمدة، وسجلات تطور قراءتك، والخطط الروحية والدنيوية المجدولة.",
      idCardTitle: "بطاقة الهوية الأكاديمية الموحدة",
      cardActive: "عضوية معتمدة ونشطة",
      weeklyFocus: "إحصائيات تقدمك الأسبوعي",
      studyMin: "دقائق التحصيل",
      articlesRead: "المباحث والدروس منجزة",
      savedGrants: "منح محفوظ لتنسيقها",
      avgAccuracy: "متوسط دقة مخارج الصوت",
      recentEvaluations: "سجل تصحيح التلاوات بالذكاء الاصطناعي",
      noRecitations: "لا توجد قراءات معالجة بالصوت حالياً.",
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
      adhkarCheck: "أوراد الصباح والمساء والاستغفار",
      // Inner tabs
      tabOverview: "لوحة الملخص",
      tabAcademics: "الشهادات والمقررات",
      tabDevotion: "الخطة الروحيّة",
      tabForums: "قنوات المذاكرة والربط",
      idKey: "مفتاح المطابقة المشفر",
      roleLabel: "المسار الأكاديمي"
    }
  }[lang];

  const forumBoards = [
    { 
      id: 'recitation', 
      title: lang === 'en' ? "Tajweed & Accentuation Study Panel" : "حلقة التجويد وتحقيق المخارج",
      desc: lang === 'en' ? "Clarifications regarding throat letters, Ghunnah rules, and classical vocal feedback loops." : "مخارج الحروف، جهارة الأصوات، والمدود والتدقيقات الصوتية لورش وحفص.",
      tag: lang === 'en' ? "Tajweed" : "التجويد"
    },
    { 
      id: 'history', 
      title: lang === 'en' ? "Historic Manuscripts & Civilizations" : "حلقة العلوم الشرعية وتراجم المخطوطات",
      desc: lang === 'en' ? "Discussions tracking ancient Andalusian texts, translation epochs, and scholars of Maghreb." : "المباحث التاريخية، المراجع النادرة، وتاريخ تدوين المخطوطات والعلوم.",
      tag: lang === 'en' ? "History" : "التاريخ"
    },
    { 
      id: 'jurisprudence', 
      title: lang === 'en' ? "Comparative Legal Fiqh Consensus" : "حلقة دراسات الفقه العقدي المقارن",
      desc: lang === 'en' ? "Classical legal analysis of acts, text verification, and contemporary jurisprudence models." : "المدارس الفقهية الأربع، تحقيق المسائل، ومداولات الاجتهاد والنوازل المعاصرة.",
      tag: lang === 'en' ? "Jurisprudence" : "الفقه والمقاصد"
    },
    { 
      id: 'scholarships', 
      title: lang === 'en' ? "Global Grants Placement Office" : "حلقة المنح والإيفاد الأكاديمي المباشر",
      desc: lang === 'en' ? "Peer matching and notifications for specialized Islamic University statements." : "مشاركة ملفات التقديم، ورش كتابة المقترحات البحثية، والقبول الجامعي.",
      tag: lang === 'en' ? "Scholarships" : "المنح والدراسات"
    }
  ];

  // Average accuracy calculation from recitations
  const averageAccuracy = progress.recentRecitations.length > 0
    ? Math.round(progress.recentRecitations.reduce((acc, curr) => acc + curr.score, 0) / progress.recentRecitations.length)
    : 85;

  const tabsInfo = [
    { id: 'overview' as const, label: labels.tabOverview, icon: BarChart },
    { id: 'academics' as const, label: labels.tabAcademics, icon: GraduationCap },
    { id: 'devotion' as const, label: labels.tabDevotion, icon: Sparkles },
    { id: 'forums' as const, label: labels.tabForums, icon: MessageSquare }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-6 space-y-6 select-none" id="student-workspace-dashboard">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/40 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            {labels.membership}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight font-sans">
            {labels.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            {labels.subtitle}
          </p>
        </div>
        <div className="text-slate-400 text-xs font-mono bg-white border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-2 self-start md:self-auto shadow-sm">
          <Calendar className="w-4 h-4 text-emerald-800" />
          <span>UTC: {new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RESPONSIVE NAVIGATION: SIDEBAR FOR LARGER SCREENS */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 bg-[#FAF8F5] border border-slate-200 rounded-3xl p-5 shadow-sm sticky top-6">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block px-1 border-b border-slate-200/50 pb-2 mb-2">
            {lang === 'en' ? "Workspace Control" : "لوحة التحكم الأكاديمية"}
          </span>
          <nav className="flex flex-col gap-1.5">
            {tabsInfo.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = innerTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setInnerTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-900 text-white border-emerald-950 shadow-md font-black translate-x-1' 
                      : 'bg-white text-slate-700 hover:text-emerald-900 border-slate-150 hover:bg-slate-50'
                  }`}
                  style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                >
                  <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* DIGITAL ACCREDITED COINED ID BADGE MINIMIZED IN SIDEBAR */}
          <div className="bg-gradient-to-br from-slate-900 via-[#071310] to-slate-950 text-white rounded-2xl p-4 border border-slate-800 mt-2">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-[8px] font-bold text-amber-300 tracking-wider">● {labels.cardActive}</span>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-4 space-y-3 font-sans">
              <div>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">{lang === 'en' ? "STUDENT HOLDER" : "الاسم الثنائي الكامل"}</span>
                <span className="text-xs font-bold text-[#faf9f6] block truncate mt-0.5">{progress.username || "Scholar Seeker"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-[7.5px] text-slate-500 block uppercase font-bold">{labels.roleLabel}</span>
                  <span className="text-[10px] text-amber-250 font-bold block leading-tight truncate mt-0.5">
                    {lang === 'en' ? "Quranic Sciences" : "علوم الشرع"}
                  </span>
                </div>
                <div>
                  <span className="text-[7.5px] text-slate-500 block uppercase font-bold">{labels.idKey}</span>
                  <span className="text-[9.5px] text-emerald-400 font-mono font-bold block mt-0.5">
                    NAFI-{progress.email ? progress.email.split('@')[0].toUpperCase().substring(0, 5) : "MEM"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="grid grid-cols-1 col-span-1 lg:col-span-9 gap-6 pb-20 lg:pb-0">
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {innerTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* ID badge only displayed at top on mobile */}
                <div className="block lg:hidden relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a1a16] to-slate-950 text-white rounded-3xl p-5 border border-slate-800 shadow-xl" id="student-id-display-box-mobile">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/35 px-2.5 py-0.5 rounded-full inline-block tracking-wider uppercase font-mono">
                        ● {labels.cardActive}
                      </span>
                      <p className="text-[9px] text-emerald-250 font-semibold tracking-wide font-mono mt-1">{labels.idCardTitle}</p>
                    </div>
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="mt-6 space-y-3 font-sans">
                    <div>
                      <span className="text-[8px] text-emerald-100/50 uppercase tracking-widest font-black block">{lang === 'en' ? "ACADEMIC HOLDER" : "الاسم الأكاديمي الكامل"}</span>
                      <span className="text-sm font-bold text-white tracking-tight block truncate mt-0.5">{progress.username || "Scholar Seeker"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[8px] text-emerald-100/50 uppercase tracking-widest font-black block">{labels.roleLabel}</span>
                        <span className="text-xs font-bold text-amber-250">{lang === 'en' ? "Quranic Sciences Spec." : "قراءات وتجويد معاصر"}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-emerald-100/50 uppercase tracking-widest font-black block">{labels.idKey}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">NAFI-{progress.email ? progress.email.split('@')[0].toUpperCase().substring(0, 6) : "STUDENT"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATS SUMMARY GRID */}
                <div className="bg-white rounded-3xl border border-slate-200/85 p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-widest pb-2 border-b border-slate-100">
                    {labels.weeklyFocus}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{labels.studyMin}</span>
                      <div className="mt-1 text-lg font-black text-slate-900">{progress.weeklyMinutes}</div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{labels.articlesRead}</span>
                      <div className="mt-1 text-lg font-black text-slate-900">{activeLessons.length}</div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{labels.savedGrants}</span>
                      <div className="mt-1 text-lg font-black text-slate-900">{progress.savedScholarships.length}</div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{labels.avgAccuracy}</span>
                      <div className="mt-1 text-lg font-black text-emerald-800">{averageAccuracy}%</div>
                    </div>
                  </div>
                </div>

                {/* RECENT RECITATIONS AND SCHOLARSHIPS COMBINED GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* RECENT RECITATIONS */}
                  <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Volume2 className="w-4 h-4 text-emerald-800 shrink-0" />
                       {labels.recentEvaluations}
                    </h3>

                    {progress.recentRecitations.length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs italic">
                        {labels.noRecitations}
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[200px] overflow-y-auto">
                        {progress.recentRecitations.map((rec, index) => (
                          <div key={index} className="p-3 rounded-xl border border-slate-100 bg-[#FAF8F5] flex items-center justify-between text-xs" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                            <div className="text-left" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                              <p className="font-extrabold text-slate-800 truncate">{rec.verse}</p>
                              <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{rec.date}</span>
                            </div>
                            <span className="font-black bg-emerald-50 text-emerald-950 px-2 py-1 rounded-lg border border-emerald-250/20 font-mono shrink-0">{rec.score}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SCHOLARSHIP BOOKMARKS IN OVERVIEW */}
                  <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-905 uppercase tracking-widest flex items-center gap-2">
                       <Bookmark className="w-4 h-4 text-emerald-800 shrink-0" />
                       {labels.bookmarksBlock}
                    </h3>
                    
                    {progress.savedScholarships.length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-450 text-xs italic">
                        {labels.noBookmarks}
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[200px] overflow-y-auto">
                        {progress.savedScholarships.map(id => {
                          const ref = scholarLookup[id] || { title: id, country: "Global Opportunities", coverage: "Funded" };
                          return (
                            <div key={id} className="p-3 rounded-xl border border-slate-100 bg-[#FAF8F5] flex items-center justify-between text-xs">
                              <div className="truncate pr-2">
                                <h4 className="font-bold text-slate-800 truncate leading-snug">{ref.title}</h4>
                                <span className="text-[9px] text-slate-400 block tracking-tight font-medium mt-0.5">{ref.country}</span>
                              </div>
                              <button onClick={() => onRemoveBookmark(id)} className="text-[9px] text-red-500 hover:underline shrink-0 bg-transparent cursor-pointer font-bold">Remove</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* QUICK NAV LINKS */}
                <div className="bg-white rounded-3xl border border-slate-200/85 p-5 shadow-sm flex flex-col sm:flex-row gap-3">
                  <button onClick={() => { onNavigateToTab('coach'); }} className="flex-1 flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/50 border border-emerald-100 font-extrabold text-xs text-emerald-950 cursor-pointer">
                    <span>{labels.goToRecitation}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { onNavigateToTab('curriculum'); }} className="flex-1 flex items-center justify-between p-3.5 rounded-xl bg-orange-50 hover:bg-orange-100/50 border border-orange-100 font-extrabold text-xs text-orange-955 cursor-pointer">
                    <span>{labels.goToCurriculum}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            )}

            {/* ACADEMICS WALLET TAB */}
            {innerTab === 'academics' && (
              <motion.div
                key="academics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                {/* SACRED DIGITAL CERTIFICATES WALLET */}
                <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      <Award className="w-5 h-5 text-amber-800 shrink-0" />
                      <span>{lang === 'en' ? "Credentials & Certificates Wallet" : "محفظة الإجازات والشهادات الشرعية المعتمدة"}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'en' ? "Digital verified honors issued directly to your secure student ledger." : "سجلات إلكترونية موثقة تصدر تلقائياً بناءً على إنجاز الاختبارات والتقييم الصوتي."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificatesList.map((cert, index) => (
                      <div key={index} className="border border-amber-250 bg-amber-50/10 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-[155px] shadow-sm">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono tracking-wider bg-amber-100 border border-amber-300 text-amber-955 px-2.5 py-0.5 rounded-full inline-block">
                            {lang === 'en' ? `Grade: ${cert.grade}` : `درجة المطابقة: ${cert.grade}`}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug pt-1" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            {cert.title}
                          </h4>
                        </div>
                        <div className="pt-3 border-t border-slate-100 text-[9px] font-sans text-slate-400 flex justify-between items-center mt-2">
                          <span>{cert.date}</span>
                          <span className="font-mono text-[8px] text-emerald-800 font-bold">KEY: {cert.key}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex items-center justify-between text-[9px] text-slate-400/90 font-mono uppercase" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <span>{lang === 'en' ? "Immutable Cryptographic Ledger Hash" : "محفظة تصديق أكاديمية مؤمنة كلياً"}</span>
                    <span>SHA-256://NAFI-VERIFIED</span>
                  </div>
                </div>

                {/* COMPLETED ROADMAP */}
                <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {lang === 'en' ? "Academic Curriculum Roadmap" : "سجل المواد والكتب المنجزة"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'en' ? "Verified study lessons finalized within the Academy portal." : "خارطة المقررات المكتملة وشواهد اجتهادك العلمي."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeLessons.map((les) => (
                      <div key={les.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <div className="space-y-0.5" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                          <span className="text-[8px] font-extrabold text-emerald-800 uppercase tracking-widest block">{les.cat}</span>
                          <h4 className="text-xs font-bold text-slate-800">{les.title}</h4>
                        </div>
                        <span className="text-[10px] font-black text-emerald-850 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">100% PASS</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* DEVOTION TRACKER TAB */}
            {innerTab === 'devotion' && (
              <motion.div
                key="devotion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                {/* AI DEVOTIONAL ARCHITECT CARD */}
                <div className="bg-gradient-to-br from-amber-900 to-emerald-950 rounded-3xl p-6 md:p-8 text-white space-y-4 shadow-xl border border-amber-500/30">
                  <div className="flex items-start justify-between gap-4" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      <span className="bg-amber-400/20 text-amber-300 font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-400/30">
                        {lang === 'en' ? "AI Propelled Planner" : "مخطط الأوراد الذكي بالذكاء الاصطناعي"}
                      </span>
                      <h3 className="text-lg md:text-xl font-black mt-2 text-amber-100 font-sans">
                        {lang === 'en' ? "Let AI Set Your Devotional Worship & Supplication Plan" : "دع الذكاء الاصطناعي يوجه خطتك التعبدية الذاتية"}
                      </h3>
                      <p className="text-[11px] text-slate-300 font-light mt-1 animate-fadeIn">
                        {lang === 'en'
                          ? "Select a core intention focus and let our Gemini-guided architect generate a customized, comprehensive devotional plan + authentic supplicant prayer map."
                          : "اختر مبحث نيتك وسيقوم خبير المنارة باستخلاص ورد يومي وتوجيه معنوي مخصص لظروفك الدراسية والروحية."}
                      </p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                      <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                    </div>
                  </div>

                  {showAiConfig ? (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                          <label className="text-[10px] font-black tracking-wider text-amber-200 uppercase">{lang === 'en' ? "Intent Focus" : "تركيز نية الورد الحالية"}</label>
                          <select
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value as any)}
                            className="w-full bg-slate-900/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold transition-colors"
                            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                          >
                            <option value="studies" className="text-slate-900 font-bold">{lang === 'en' ? "Academic & Quran Memorization Balance" : "موازنة التحصيل العلمي وحفظ القرآن"}</option>
                            <option value="focus" className="text-slate-900 font-bold">{lang === 'en' ? "Deep Scholarly Focus & Concentration" : "التركيز والعمق الفكري واستحضار الذهن"}</option>
                            <option value="tahajjud" className="text-slate-900 font-bold">{lang === 'en' ? "Establishing Tahajjud (Night Prayers) Habit" : "تثبيت قيام الليل والتهجد"}</option>
                            <option value="patience" className="text-slate-900 font-bold">{lang === 'en' ? "Patience, Resilience & Consistency" : "الصبر، الثبات، والاستمرارية"}</option>
                            <option value="custom" className="text-slate-900 font-bold">{lang === 'en' ? "Custom spiritual Intention Focus..." : "نية تعبدية مخصصة..."}</option>
                          </select>
                        </div>

                        {aiTopic === 'custom' && (
                          <div className="space-y-1.5 text-left animate-fadeIn" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <label className="text-[10px] font-black tracking-wider text-amber-200 uppercase">{lang === 'en' ? "Specify Intention" : "اكتب نيتك المخصصة بالتفصيل"}</label>
                            <input
                              type="text"
                              value={aiCustomInput}
                              onChange={(e) => setAiCustomInput(e.target.value)}
                              placeholder={lang === 'en' ? "e.g., Guidance to learn standard Arabic..." : "مثال: الاستخارة لغرض السفر للتحصيل التخصصي..."}
                              className="w-full bg-slate-900/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                              dir={lang === 'ar' ? 'rtl' : 'ltr'}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          disabled={aiLoading}
                          onClick={async () => {
                            setAiLoading(true);
                            try {
                              const topicText = aiTopic === 'custom' ? aiCustomInput : aiTopic;
                              const res = await fetch('/api/dua-planner', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ topic: topicText || 'studies' })
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setAiPlanResult(data);
                                setShowAiConfig(false);
                              }
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setAiLoading(false);
                            }
                          }}
                          className="bg-amber-400 hover:bg-amber-500 text-[#002b21] px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-tight transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {aiLoading ? (
                            <>
                              <span className="w-3 h-3 border-2 border-[#002b21] border-t-transparent rounded-full animate-spin"></span>
                              <span>{lang === 'en' ? "Architecting..." : "جاري صياغة الورد..."}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>{lang === 'en' ? "Architect Personal Worship Plan" : "صياغة ورد النية المخصص"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    aiPlanResult && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4 animate-fadeIn"
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <span className="text-[10px] font-black text-amber-300 tracking-wide font-mono uppercase">
                            ✦ {aiPlanResult.topic}
                          </span>
                          <button
                            onClick={() => setShowAiConfig(true)}
                            className="bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] px-3 py-1.5 rounded-lg font-bold cursor-pointer transition select-none"
                          >
                            {lang === 'en' ? "Plan Options" : "مخطط جديد"}
                          </button>
                        </div>

                        <div className="space-y-2.5 text-center">
                          <p className="text-xl md:text-2xl font-black text-amber-100 font-serif leading-relaxed px-2 select-all" dir="rtl">
                            {aiPlanResult.arabicText}
                          </p>
                          <p className="text-[10px] text-slate-300 italic font-mono px-4 select-all leading-normal">
                            "{aiPlanResult.transliteration}"
                          </p>
                          <p className="text-xs text-amber-100 px-4 font-sans select-all leading-relaxed pt-1 max-w-2xl mx-auto border-t border-white/5">
                            {aiPlanResult.translation}
                          </p>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-300/15 rounded-xl p-3.5 mt-2 text-left" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                          <p className="text-[10.5px] text-amber-100 font-extrabold flex items-center gap-1 mb-1.5" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                            <BookOpen className="w-3.5 h-3.5 text-amber-405 shrink-0" />
                            <span>{lang === 'en' ? "Spiritual Counsel & Routine Integration" : "التوجيه الروحي والورد التكميلي"}</span>
                          </p>
                          <p className="text-[10px] text-slate-200 font-light leading-relaxed select-all">
                            {aiPlanResult.context}
                          </p>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>

                {/* SPIRITUAL & ACADEMIC PLANNER DAILY HABITS */}
                <div className="bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-800 shrink-0" />
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

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-600 to-emerald-700 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${dailyProgressPercent}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Salah section */}
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

                    {/* General tasks section */}
                    <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-slate-150 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-amber-900/10 mb-1">
                          {labels.generalTasks}
                        </h4>
                        <div className="space-y-2">
                          {[
                            { key: 'recitation', label: labels.reciteCheck },
                            { key: 'lessons', label: labels.readCheck },
                            { key: 'adhkar', label: labels.adhkarCheck }
                          ].map((task) => {
                            const isChecked = dailyChecklist[task.key as keyof typeof dailyChecklist];
                            return (
                              <button
                                key={task.key}
                                onClick={() => toggleCheck(task.key as any)}
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
                                  <span className="leading-tight block">{task.label}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
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

              </motion.div>
            )}

            {/* FORUMS & CHANNELS TAB */}
            {innerTab === 'forums' && (
              <motion.div
                key="forums"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      <MessageSquare className="w-5 h-5 text-amber-800 shrink-0" />
                      <span>{lang === 'en' ? "Student Study Clusters & Subscription Channels" : "حلقات ديوان المذاكرة والربط العلمي المباشر"}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      {lang === 'en' 
                        ? "Subscribe or unsubscribe to specific study assemblies to sync live real-time notifications for incoming scholarly updates, peer answers, or class materials."
                        : "اشترك بحلقات المذاكرة والديوان لتتلقى إشعارات التحديث الفورية عند قيام شيوخ الأكاديمية أو الطلاب بنشر مباحث جديدة."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {forumBoards.map((item) => {
                      const isJoined = progress.joinedForums?.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                            isJoined 
                              ? 'bg-emerald-500/5 border-emerald-650/30' 
                              : 'bg-[#FAF8F5] border-slate-200 hover:border-slate-350'
                          }`}
                        >
                          <div className="space-y-1.5 text-left" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div className="flex items-center justify-between" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                              <span className="text-[9px] font-black tracking-wider uppercase text-slate-400 font-mono">
                                {item.tag}
                              </span>
                              {isJoined ? (
                                <span className="text-[8px] font-black text-emerald-850 bg-emerald-100/55 border border-emerald-250 px-2 rounded">
                                  ✓ {lang === 'en' ? "SUBSCRIBED" : "مشترك"}
                                </span>
                              ) : (
                                <span className="text-[8px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 rounded">
                                  {lang === 'en' ? "SILENT" : "صامت"}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-black text-slate-900 leading-tight">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                            <button
                              disabled={submittingJoin === item.id}
                              onClick={() => handleJoinLeaveForum(item.id, isJoined)}
                              className={`text-[9.5px] font-black px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer outline-none ${
                                isJoined 
                                  ? 'bg-transparent border-red-200 text-red-650 hover:bg-red-50' 
                                  : 'bg-emerald-800 border-emerald-800 text-white hover:bg-emerald-900'
                              }`}
                            >
                              {submittingJoin === item.id ? "..." : isJoined 
                                ? (lang === 'en' ? "Leave Board" : "مغادرة الحلقة") 
                                : (lang === 'en' ? "Join Board" : "انضمام ومتابعة")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </main>

      </div>

      {/* MOBILE BOTTOM NAVIGATION PANEL */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-slate-250/50 rounded-2xl py-2 px-3 shadow-2xl flex justify-around items-center z-[110] gap-1 shrink-0">
        {tabsInfo.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = innerTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInnerTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all outline-none flex-1 max-w-[85px] cursor-pointer ${
                isActive ? 'text-emerald-950 font-black' : 'text-slate-500 hover:text-emerald-900'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-transform ${isActive ? 'bg-emerald-100 text-emerald-950 scale-110' : 'bg-transparent text-slate-400'}`}>
                <TabIcon className="w-4 h-4 shrink-0" />
              </div>
              <span className="text-[9.5px] font-bold tracking-tight block truncate max-w-full leading-none">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
