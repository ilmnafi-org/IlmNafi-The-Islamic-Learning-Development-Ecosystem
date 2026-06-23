/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ThumbsUp, HelpCircle, ShieldCheck, Award, 
  BookOpen, PlusCircle, Search, ArrowLeft, Send, Sparkles, 
  ExternalLink, User, Check, Library, Star, Filter, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VERIFIED_SCHOLARS, ScholarQuestion, ScholarAnswer } from '../data/scholarData';

interface ScholarNetworkQAProps {
  lang: 'en' | 'ar';
  currentUser: { username: string; email: string } | null;
  onShowToast: (msg: string) => void;
  ensureAuth: (purpose: string) => boolean;
}

export const ScholarNetworkQA: React.FC<ScholarNetworkQAProps> = ({ 
  lang, currentUser, onShowToast, ensureAuth 
}) => {
  const [questions, setQuestions] = useState<ScholarQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  
  // Scholar Simulation Mode Toggle
  const [isScholarSimMode, setIsScholarSimMode] = useState(false);
  const [simulatedScholarId, setSimulatedScholarId] = useState('scholar_yusuf');

  // New Question Form
  const [showAskModal, setShowAskModal] = useState(false);
  const [askTitle, setAskTitle] = useState('');
  const [askCategory, setAskCategory] = useState<any>('fiqh');
  const [askBody, setAskBody] = useState('');

  // Scholar Answering Form
  const [ansBodyEn, setAnsBodyEn] = useState('');
  const [ansBodyAr, setAnsBodyAr] = useState('');
  const [quranSurahEn, setQuranSurahEn] = useState('');
  const [quranSurahAr, setQuranSurahAr] = useState('');
  const [quranVerse, setQuranVerse] = useState('');
  const [quranTextEn, setQuranTextEn] = useState('');
  const [quranTextAr, setQuranTextAr] = useState('');
  const [hadithSourceEn, setHadithSourceEn] = useState('');
  const [hadithSourceAr, setHadithSourceAr] = useState('');
  const [hadithNumber, setHadithNumber] = useState('');
  const [hadithTextEn, setHadithTextEn] = useState('');
  const [hadithTextAr, setHadithTextAr] = useState('');
  const [scholarlyCitationEn, setScholarlyCitationEn] = useState('');
  const [scholarlyCitationAr, setScholarlyCitationAr] = useState('');

  // Comment Form
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Live Supabase Sync for Questions
    fetch('/api/scholar/questions')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions([]);
        }
      })
      .catch((err) => {
        console.error("Live sync failed", err);
        setQuestions([]);
      });
  }, []);

  const saveQuestions = (updated: ScholarQuestion[]) => {
    setQuestions(updated);
    // Sync array to backend
    fetch('/api/scholar/questions/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  };

  const handleAskQuestion = () => {
    if (!ensureAuth(lang === 'en' ? 'submit a scholarly question' : 'طرح تساؤل على هيئة الإشراف العلمية')) return;
    if (!askTitle.trim() || !askBody.trim()) return;

    const newQ: ScholarQuestion = {
      id: "sq_" + Date.now(),
      titleEn: askTitle.trim(),
      titleAr: lang === 'ar' ? askTitle.trim() : `Translation: ${askTitle.trim()}`,
      bodyEn: askBody.trim(),
      bodyAr: lang === 'ar' ? askBody.trim() : `التساؤل: ${askBody.trim()}`,
      category: askCategory,
      studentNameEn: currentUser?.username || "Student Gen",
      studentNameAr: currentUser?.username || "طالب علم مجهول",
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      date: new Date().toISOString().split('T')[0],
      likesCount: 0,
      scholarAnswers: [],
      communityComments: []
    };

    const updated = [newQ, ...questions];
    saveQuestions(updated);
    
    setAskTitle('');
    setAskBody('');
    setShowAskModal(false);
    onShowToast(lang === 'en' ? "Question submitted to reviews board!" : "تم إرسال تساؤلك لهيئة الإشراف العلمية بنجاح!");
  };

  const handleAddScholarAnswer = () => {
    if (!activeQuestionId) return;

    const currentScholar = VERIFIED_SCHOLARS.find(s => s.id === simulatedScholarId);
    if (!currentScholar) return;

    const newAnswer: ScholarAnswer = {
      id: "sa_" + Date.now(),
      scholarId: currentScholar.id,
      bodyEn: ansBodyEn.trim() || "Explanation written in Arabic below.",
      bodyAr: ansBodyAr.trim() || "الشرح والتفصيل باللغة الإنجليزية أعلاه.",
      quranReferences: (quranSurahEn || quranTextAr) ? [{
        surahEn: quranSurahEn || "Quran",
        surahAr: quranSurahAr || "القرآن الكربم",
        verse: quranVerse || "1",
        textEn: quranTextEn || "",
        textAr: quranTextAr || ""
      }] : [],
      hadithReferences: (hadithSourceEn || hadithTextAr) ? [{
        sourceEn: hadithSourceEn || "Hadith source",
        sourceAr: hadithSourceAr || "المصدر الحديثي",
        number: hadithNumber || "",
        textEn: hadithTextEn || "",
        textAr: hadithTextAr || ""
      }] : [],
      scholarlyWorksEn: scholarlyCitationEn ? [scholarlyCitationEn] : [],
      scholarlyWorksAr: scholarlyCitationAr ? [scholarlyCitationAr] : [],
      date: new Date().toISOString().split('T')[0],
      supportCount: 1
    };

    const updated = questions.map(q => {
      if (q.id === activeQuestionId) {
        return {
          ...q,
          scholarAnswers: [...q.scholarAnswers, newAnswer]
        };
      }
      return q;
    });

    saveQuestions(updated);
    
    // Clear Form
    setAnsBodyEn('');
    setAnsBodyAr('');
    setQuranSurahEn('');
    setQuranSurahAr('');
    setQuranVerse('');
    setQuranTextEn('');
    setQuranTextAr('');
    setHadithSourceEn('');
    setHadithSourceAr('');
    setHadithNumber('');
    setHadithTextEn('');
    setHadithTextAr('');
    setScholarlyCitationEn('');
    setScholarlyCitationAr('');

    onShowToast(lang === 'en' ? "Scholar Answer published with full references!" : "تم نشر الفتوى العلمية الموثقة باسم الشيخ بنجاح!");
  };

  const handleAddComment = () => {
    if (!activeQuestionId) return;
    if (!ensureAuth(lang === 'en' ? 'comment on this Q&A' : 'إضافة تعقيب أو مناقشة تحت الفتوى')) return;
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: "comm_" + Date.now(),
      author: currentUser?.username || "Anonymous",
      role: currentUser?.username ? "Student Scholar" : "Guest",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      date: new Date().toISOString().split('T')[0],
      bodyEn: newComment.trim(),
      bodyAr: newComment.trim()
    };

    const updated = questions.map(q => {
      if (q.id === activeQuestionId) {
        return {
          ...q,
          communityComments: [...q.communityComments, newCommentObj]
        };
      }
      return q;
    });

    saveQuestions(updated);
    setNewComment('');
    onShowToast(lang === 'en' ? "Comment added to community space." : "تم تسجيل مشاركتك في ساحة النقاش الطلابية.");
  };

  const handleLikeQuestion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ensureAuth(lang === 'en' ? 'support this question' : 'أهمية هذا السؤال')) return;

    const updated = questions.map(q => {
      if (q.id === id) {
        return { ...q, likesCount: q.likesCount + 1 };
      }
      return q;
    });
    saveQuestions(updated);
    onShowToast(lang === 'en' ? "Supported this query!" : "تم تأييد هذا الاستفسار العلمي!");
  };

  const handleSupportAnswer = (qId: string, ansId: string) => {
    const updated = questions.map(q => {
      if (q.id === qId) {
        const updatedAns = q.scholarAnswers.map(ans => {
          if (ans.id === ansId) {
            return { ...ans, supportCount: ans.supportCount + 1 };
          }
          return ans;
        });
        return { ...q, scholarAnswers: updatedAns };
      }
      return q;
    });
    saveQuestions(updated);
    onShowToast(lang === 'en' ? "Additional scholarly support logged!" : "تم تسجيل تأييد فقهي إضافي لهذه الفتوى!");
  };

  const categories = [
    { value: "all", en: "All Categories", ar: "جميع التصنيفات" },
    { value: "aqeedah", en: "Aqeedah (Theology)", ar: "العقيدة والتوحيد" },
    { value: "fiqh", en: "Fiqh (Jurisprudence)", ar: "الفقه وأصوله" },
    { value: "hadith", en: "Hadith Sciences", ar: "علوم الحديث وأثره" },
    { value: "quran_tajweed", en: "Quran & Tajweed", ar: "القرآن ومخارج الحروف" },
    { value: "family", en: "Family & Social", ar: "شؤون الأسرة والمجتمع" },
    { value: "finance", en: "Islamic Finance", ar: "المعاملات المالية المعاصرة" },
    { value: "contemporary", en: "Contemporary Issues", ar: "النوازل والقضايا الحديثة" }
  ];

  const filtered = questions.filter(q => {
    const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
    const bodyText = (q.titleEn + q.titleAr + q.bodyEn + q.bodyAr).toLowerCase();
    const matchSearch = bodyText.includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Simulation Banner Removed as requested to restrict sandbox simulation and keep purely genuine student operations */}

      {activeQuestionId === null ? (
        <div className="space-y-6">
          {/* Header & Categories */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-amber-800 animate-pulse" />
                <span>{lang === 'en' ? "Scholar Knowledge Network (Q&A)" : "مجلس الإفتاء والأسئلة التخصصية"}</span>
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {lang === 'en' 
                  ? "Direct, robust Islamic queries. Submitted by students of knowledge, verified strictly by senior scholars with authentic citations." 
                  : "أسئلة طلاب العلم الشرعي واستفساراتهم العامة، يجيب عليها كبار العلماء مشفوعة بالآيات والأحاديث الصحيحة."}
              </p>
            </div>
            <button
              onClick={() => setShowAskModal(true)}
              className="px-5 py-3 rounded-xl bg-amber-800 hover:bg-[#201002] transition-all text-white font-extrabold text-xs tracking-wide shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-amber-250 shrink-0" />
              <span>{lang === 'en' ? "Ask Verified Scholar" : "طرح سؤال فقهي تخصصي"}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl border border-slate-150 p-4 md:p-5 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'en' ? "Search scholar queries and canonical solutions..." : "ابحث عن الفتاوى الشرعية والمسائل السابقة..."}
                className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-slate-900 font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-amber-900 border-amber-900 text-amber-50 shadow-sm'
                      : 'bg-white border-slate-205 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'en' ? cat.en : cat.ar}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Grid */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl text-xs font-sans shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                {lang === 'en' ? "No verified results found for this category query." : "لا توجد أسئلة أو تساؤلات تخصصية مطابقة للبحث حالياً."}
              </div>
            ) : (
              filtered.map((q) => {
                const isAnswered = q.scholarAnswers.length > 0;
                const catObj = categories.find(c => c.value === q.category);
                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    className="p-5 md:p-6 bg-white border border-slate-150/40 rounded-2xl hover:border-amber-700 hover:shadow-2xl shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition-all cursor-pointer flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-205/30 text-[9px] font-black uppercase text-[#503020]">
                          {lang === 'en' ? catObj?.en : catObj?.ar}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold font-sans">
                          • {q.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight">
                        {lang === 'en' ? q.titleEn : q.titleAr}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                        {lang === 'en' ? q.bodyEn : q.bodyAr}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black overflow-hidden shadow-sm">
                          {q.studentAvatar ? <img src={q.studentAvatar} alt="student" className="w-full h-full object-cover" /> : <User className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex flex-col text-[10px] leading-tight">
                          <span className="font-bold text-slate-700">{lang === 'en' ? q.studentNameEn : q.studentNameAr}</span>
                          <span className="text-[8px] text-slate-400 uppercase font-black">{lang === 'en' ? "Student" : "طالب علم"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={(e) => handleLikeQuestion(q.id, e)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border text-slate-500 hover:text-red-700 transition cursor-pointer font-bold font-mono text-[10px]"
                        >
                          <ThumbsUp className="w-3 h-3 text-slate-400" />
                          <span>{q.likesCount}</span>
                        </button>

                        <div className="flex items-center gap-1 bg-amber-50 text-[#503020] px-2.5 py-1 rounded-xl border border-amber-800/20 text-[10px]" id="badge-verification-status">
                          {isAnswered ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 animate-pulse shrink-0" />
                              <span className="font-black text-[9px] uppercase tracking-wide">
                                {lang === 'en' ? `${q.scholarAnswers.length} Verified Answer` : `إجابة معتمدة (${q.scholarAnswers.length})`}
                              </span>
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span className="font-black text-[9px] uppercase tracking-wide">
                                {lang === 'en' ? "Pending Scholar Review" : "قيد المراجعة الشرعية"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Question Details & Answers Sheet */
        <div className="space-y-6">
          <button
            onClick={() => setActiveQuestionId(null)}
            className="flex items-center gap-2 text-xs text-slate-550 hover:text-amber-805 transition bg-white font-black py-2 px-4 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{lang === 'en' ? "Back to Q&A List" : "العودة لقائمة المسائل"}</span>
          </button>

          {(() => {
            const current = questions.find(q => q.id === activeQuestionId);
            if (!current) return null;
            const catObj = categories.find(c => c.value === current.category);
            return (
              <div className="space-y-8">
                
                {/* Master Student Query Card */}
                <div className="bg-white rounded-3xl border border-slate-150/30 p-6 md:p-8 space-y-4 shadow-[0_12px_45px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 border text-[10px] font-black uppercase tracking-wider text-slate-700">
                      {lang === 'en' ? catObj?.en : catObj?.ar}
                    </span>
                    <span className="text-xs text-slate-400 font-bold font-sans">{current.date}</span>
                  </div>

                  <h2 className="text-lg md:text-xl font-extrabold text-[#201002]">
                    {lang === 'en' ? current.titleEn : current.titleAr}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                    {lang === 'en' ? current.bodyEn : current.bodyAr}
                  </p>

                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-4">
                    <img src={current.studentAvatar} alt="student" className="w-8 h-8 rounded-full border shadow-sm object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{lang === 'en' ? current.studentNameEn : current.studentNameAr}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wide">{lang === 'en' ? "Student Submited Question" : "السؤال مقدم من طالب علم"}</p>
                    </div>
                  </div>
                </div>

                {/* Verified Scholars Answers block */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-950 border-l-4 border-amber-800 pl-3">
                    {lang === 'en' ? "Official Scholar Verdict & Answers" : "الأجوبة الشرعية المعتمدة علمياً"} ({current.scholarAnswers.length})
                  </h3>

                  {current.scholarAnswers.length === 0 ? (
                    <div className="p-12 text-center text-slate-450 text-xs bg-amber-50/20 border-2 border-dashed border-amber-900/10 rounded-2xl font-sans">
                      {lang === 'en' 
                        ? "This question is currently queued for evaluation. Scholars will verify references shortly." 
                        : "لم تصدر فتوى رسمية لهذه المسألة حتى الآن. جاري مراجعة المخطوطات والقرائن من قبل العلماء."}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {current.scholarAnswers.map((ans) => {
                        const scholar = VERIFIED_SCHOLARS.find(s => s.id === ans.scholarId);
                        return (
                          <div key={ans.id} className="bg-gradient-to-br from-white to-amber-50/10 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_12px_45px_rgba(0,0,0,0.04)] relative overflow-hidden">
                            {/* Accent badge watermark */}
                            <div className="absolute top-0 right-0 p-4 shrink-0">
                              <div className="bg-amber-100 border border-amber-300 text-amber-950 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-[10px]">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                                <span className="font-extrabold tracking-wide uppercase">{lang === 'en' ? scholar?.badgeEn : scholar?.badgeAr}</span>
                              </div>
                            </div>

                            {/* Scholar header credentials */}
                            <div className="flex items-start gap-4">
                              <img src={scholar?.avatar} alt="scholar" className="w-12 h-12 rounded-full border-2 border-amber-800 shadow object-cover shrink-0" />
                              <div className="min-w-0 pr-24">
                                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1">
                                  <span>{lang === 'en' ? scholar?.nameEn : scholar?.nameAr}</span>
                                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                </h4>
                                <p className="text-xs text-slate-500 font-sans mt-0.5 truncate">{lang === 'en' ? scholar?.institutionEn : scholar?.institutionAr}</p>
                              </div>
                            </div>

                            {/* Verdict body */}
                            <div className="space-y-5 text-xs md:text-sm text-slate-800 leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                              <p className="bg-amber-50/35 border-l-2 border-amber-800 p-4 rounded-r-xl italic shrink-0" id="scholar-fatwa-body">
                                {lang === 'en' ? ans.bodyEn : ans.bodyAr}
                              </p>

                              {/* Quranic References Panel */}
                              {ans.quranReferences.length > 0 && (
                                <div className="border border-amber-900/10 bg-white rounded-2xl p-4 md:p-5 space-y-3 shadow-inner">
                                  <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-1.5 border-b pb-1.5">
                                    <BookOpen className="w-4 h-4 text-amber-800 shrink-0" />
                                    {lang === 'en' ? "Quranic Authority Reference" : "الاستدلال والقرينة من الذكر الحكيم"}
                                  </span>
                                  {ans.quranReferences.map((ref, idx) => (
                                    <div key={idx} className="space-y-2 text-center md:text-right">
                                      <p className="text-base font-black text-[#503020] font-serif leading-loose" dir="rtl">
                                        {ref.textAr}
                                      </p>
                                      <p className="text-xs text-slate-600 text-left leading-relaxed mt-1 italic">
                                        &ldquo;{ref.textEn}&rdquo;
                                      </p>
                                      <div className="text-[10px] font-black uppercase text-amber-900 text-left mt-1.5 flex items-center gap-1">
                                        <span>— Surah {ref.surahEn} (Ayah {ref.verse})</span>
                                        <span>/</span>
                                        <span dir="rtl" className="font-serif">سورة {ref.surahAr} (آية {ref.verse})</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Hadith citation panel */}
                              {ans.hadithReferences.length > 0 && (
                                <div className="border border-emerald-900/10 bg-emerald-50/10 rounded-2xl p-4 md:p-5 space-y-3">
                                  <span className="text-[10px] font-black text-emerald-950 uppercase tracking-widest flex items-center gap-1.5 border-b border-emerald-900/10 pb-1.5">
                                    <Library className="w-4 h-4 text-emerald-800 shrink-0" />
                                    {lang === 'en' ? "Hadith Prophetic Citation" : "سند الاستدلال من السنة النبوية المطهرة"}
                                  </span>
                                  {ans.hadithReferences.map((ref, idx) => (
                                    <div key={idx} className="space-y-2" dir="rtl">
                                      <p className="text-xs md:text-sm text-emerald-900 font-bold leading-relaxed text-right font-sans">
                                        {ref.textAr}
                                      </p>
                                      <p className="text-xs text-slate-600 text-left leading-relaxed mt-1 italic" dir="ltr">
                                        &ldquo;{ref.textEn}&rdquo;
                                      </p>
                                      <div className="text-[10px] font-black uppercase text-emerald-800 text-left mt-1.5 flex items-center gap-1" dir="ltr">
                                        <span>— Compiled of {ref.sourceEn} (Hadith No. {ref.number})</span>
                                        <span>/</span>
                                        <span dir="rtl" className="font-sans">رواه الإمام {ref.sourceAr} (رقم الحديث {ref.number})</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Classic scholarly work citations */}
                              {(ans.scholarlyWorksEn.length > 0 || ans.scholarlyWorksAr.length > 0) && (
                                <div className="space-y-1.5 pt-1.5">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Library className="w-3.5 h-3.5" /> {lang === 'en' ? "Scholarly Treatises Referenced" : "المراجع والمصنفات الفقهية المحتكم إليها:"}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {(lang === 'en' ? ans.scholarlyWorksEn : ans.scholarlyWorksAr).map((w, idx) => (
                                      <span key={idx} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg text-[10px] font-bold border">
                                        📖 {w}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Additional controls */}
                            <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold font-sans">
                                {lang === 'en' ? `Verdict Date: ${ans.date}` : `تاريخ إصدار الفتوى المعتمدة: ${ans.date}`}
                              </span>
                              <button
                                onClick={() => handleSupportAnswer(current.id, ans.id)}
                                className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#503020] border border-amber-205 transition text-xs font-black flex items-center gap-1.5 cursor-pointer"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{ans.supportCount} {lang === 'en' ? "Corroborate (Isnad)" : "إسناد وتأييد فقهي"}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Simulated Scholar Response Box (Strict Validation) */}
                {isScholarSimMode && (
                  <div className="bg-[#faf8f3] rounded-3xl border-2 border-amber-800/15 p-6 space-y-5 shadow-sm font-sans" id="scholar-simulation-answer-form">
                    <div className="border-b pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-800 animate-spin" />
                        <div>
                          <span className="text-xs font-black text-amber-950 uppercase tracking-widest block">
                            {lang === 'en' ? "SIMULATOR: WRITE SCHOLAR ANSWER VERDICT" : "بوابة المحاكاة: إصدار وتوثيق فتوى علمية"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {lang === 'en' 
                              ? `You are answering on behalf of: ${VERIFIED_SCHOLARS.find(s=>s.id===simulatedScholarId)?.nameEn}` 
                              : `تصدر الفتوى حالياً باسم فضيلة الشيخ: ${VERIFIED_SCHOLARS.find(s=>s.id===simulatedScholarId)?.nameAr}`}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-amber-800 text-amber-100 text-[10px] font-black rounded-lg shrink-0">
                        {lang === 'en' ? "ONLY SCHOLARS VIEW" : "هيئة مراجعة الإفتاء"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Body English / Arabic */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">{lang === 'en' ? "Verdict / Analytical Text Explanation (English)" : "نص الجواب والشرح التفصيلي (إنجليزي)"}</label>
                          <textarea
                            placeholder="Provide the primary logical deduction under scholarly parameters..."
                            className="w-full text-xs p-3 border bg-white rounded-xl focus:border-amber-805 focus:ring-1 focus:ring-amber-805 outline-none min-h-[100px]"
                            value={ansBodyEn}
                            onChange={(e) => setAnsBodyEn(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">{lang === 'en' ? "Verdict / Analytical Text Explanation (Arabic)" : "نص الجواب والشرح التفصيلي (عربي)"}</label>
                          <textarea
                            placeholder="اكتب خلاصة الحكم الفقهي مع معايير التدقيق والتعليل اللغوي والشرعي..."
                            className="w-full text-xs p-3 border bg-white rounded-xl focus:border-amber-850 focus:ring-1 focus:ring-amber-850 outline-none text-right min-h-[100px]"
                            value={ansBodyAr}
                            onChange={(e) => setAnsBodyAr(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Quranic References Box */}
                      <div className="bg-white border rounded-2xl p-4 space-y-3">
                        <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest block border-b pb-1.5">
                          📖 Add Quranic Ayah Reference (Optional)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input type="text" placeholder="Surah Name (English)" className="text-xs p-2.5 border rounded-lg" value={quranSurahEn} onChange={(e) => setQuranSurahEn(e.target.value)} />
                          <input type="text" placeholder="اسم السورة (عربي)" className="text-xs p-2.5 border rounded-lg text-right" value={quranSurahAr} onChange={(e) => setQuranSurahAr(e.target.value)} />
                          <input type="text" placeholder="Verse / Ayah No." className="text-xs p-2.5 border rounded-lg" value={quranVerse} onChange={(e) => setQuranVerse(e.target.value)} />
                        </div>
                        <textarea placeholder="Ayah Text Arabic (e.g., وأحل الله البيع وحرم الربا)" className="w-full text-xs p-2.5 border rounded-lg text-right" value={quranTextAr} onChange={(e) => setQuranTextAr(e.target.value)} />
                        <textarea placeholder="Ayah Translation (English)" className="w-full text-xs p-2.5 border rounded-lg" value={quranTextEn} onChange={(e) => setQuranTextEn(e.target.value)} />
                      </div>

                      {/* Hadith Citation Box */}
                      <div className="bg-white border rounded-2xl p-4 space-y-3">
                        <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest block border-b pb-1.5">
                          📜 Add Hadith Prophetic Narration (Optional)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input type="text" placeholder="Source Compiler (e.g. Sahih Al-Bukhari)" className="text-xs p-2.5 border rounded-lg" value={hadithSourceEn} onChange={(e) => setHadithSourceEn(e.target.value)} />
                          <input type="text" placeholder="المصنف الحديثي (مثال الصحيحين)" className="text-xs p-2.5 border rounded-lg text-right" value={hadithSourceAr} onChange={(e) => setHadithSourceAr(e.target.value)} />
                          <input type="text" placeholder="Hadith Number" className="text-xs p-2.5 border rounded-lg" value={hadithNumber} onChange={(e) => setHadithNumber(e.target.value)} />
                        </div>
                        <textarea placeholder="Hadith Text Arabic (e.g., كل قرض جر منفعة فهو ربا)" className="w-full text-xs p-2.5 border rounded-lg text-right" value={hadithTextAr} onChange={(e) => setHadithTextAr(e.target.value)} />
                        <textarea placeholder="Hadith Translation (English)" className="w-full text-xs p-2.5 border rounded-lg" value={hadithTextEn} onChange={(e) => setHadithTextEn(e.target.value)} />
                      </div>

                      {/* Scholarly citation works */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">Treatise Reference (English)</label>
                          <input type="text" placeholder="e.g. AAOIFI Shariah Standard No. 19" className="w-full text-xs p-2.5 border bg-white rounded-lg" value={scholarlyCitationEn} onChange={(e) => setScholarlyCitationEn(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">اسم المرجع الفقهي (عربي)</label>
                          <input type="text" placeholder="مثال معيار المعاملات المالية المعتمد..." className="w-full text-xs p-2.5 border bg-white rounded-lg text-right" value={scholarlyCitationAr} onChange={(e) => setScholarlyCitationAr(e.target.value)} />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          onClick={handleAddScholarAnswer}
                          className="px-6 py-3.5 bg-amber-800 hover:bg-black text-white text-xs font-black rounded-lg transition shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>{lang === 'en' ? "Publish Official Scholar Answer" : "اعتماد ونشر الجواب بمصادره العلمية"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Community Comments Thread (Second Layer Discussions) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-3">
                    {lang === 'en' ? "Student Circles Comments & Threads" : "تعقيبات ومناقشات طلبة العلم"} ({current.communityComments.length})
                  </h3>

                  {current.communityComments.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs font-sans">
                      {lang === 'en' ? "No academic feedback commented yet. Open to student circles." : "لا توجد تعقيبات مضافة تتبع المسألة. شارك مساهمتك بالأسفل."}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {current.communityComments.map((cc) => (
                        <div key={cc.id} className="p-4 md:p-5 bg-white border border-slate-150 rounded-2xl space-y-2 shadow-sm">
                          <p className="text-xs text-slate-750 font-sans leading-relaxed" style={{ textAlign: 'justify' }}>
                            {lang === 'en' ? cc.bodyEn : cc.bodyAr}
                          </p>
                          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px]">
                            <div className="flex items-center gap-2">
                              <img src={cc.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover shadow-sm border" />
                              <span className="font-extrabold text-slate-800">{cc.author}</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 border text-[8px] uppercase tracking-wider font-extrabold">{cc.role}</span>
                            </div>
                            <span className="text-slate-400 font-sans font-bold">{cc.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add discussion comment */}
                  <div className="bg-white rounded-2xl border p-4 shadow-sm flex gap-3">
                    <textarea
                      placeholder={lang === 'en' ? "Discuss, add margin notes, or ask for terminology clarification..." : "اكتب تعليقك الحواري أو استفسارك الفرعي بساحة المسألة..."}
                      className="flex-1 text-xs p-3 bg-slate-50 border rounded-xl outline-none focus:ring-1 focus:ring-amber-800 transition min-h-[50px] resize-none font-sans"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-amber-805 hover:bg-black text-white px-5 rounded-xl text-xs font-black transition disabled:opacity-50 cursor-pointer flex items-center gap-1 shrink-0 py-3 self-end shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-350" />
                      <span>{lang === 'en' ? "Answer" : "تعقيب"}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* Ask Question Modal Block */}
      {showAskModal && (
        <div className="fixed inset-0 bg-[#201002]/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative font-sans"
          >
            <button onClick={() => setShowAskModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer">
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="border-b pb-3.5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-5 h-5 text-amber-800 animate-pulse" />
                <span>{lang === 'en' ? "Ask Question to the Scholar Council" : "رفع سؤال إلى مجلس الإشراف والبحوث العلمية"}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' ? "Select correct category block. Formulate query clearly with classical terms." : "يرجى تحديد التصنيف الفقهي الصحيح وصياغة التساؤل والمسألة بدقة عالية."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 block">{lang === 'en' ? "Shorthand Title" : "عنوان المسألة المباشر"}</label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? "e.g. Vocal elongation on Warsh recitation style" : "مثال السند المتصل في رواية حفص من طريق المصباح..."}
                  className="w-full text-xs p-3.5 border rounded-xl"
                  value={askTitle}
                  onChange={(e) => setAskTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 block">{lang === 'en' ? "Islamic Category Group" : "التصنيف والباب الفقهي"}</label>
                <select
                  className="w-full text-xs p-3.5 border border-slate-200 premium-dropdown font-bold bg-white focus:ring-1 focus:ring-amber-800 outline-none cursor-pointer shadow-md"
                  value={askCategory}
                  onChange={(e) => setAskCategory(e.target.value as any)}
                >
                  {categories.filter(c => c.value !== 'all').map(c => (
                    <option key={c.value} value={c.value}>{lang === 'en' ? c.en : c.ar}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 block">{lang === 'en' ? "Full Context & Reference Query details" : "تفصيل وقرين تساؤلك العلمي مع ذكر الشبهة أو موطن الاستدال"}</label>
                <textarea
                  placeholder={lang === 'en' ? "Detail your academic query here..." : "اكتب تساؤلك الفقهي أو إشكالك اللغوي هنا بكل تفصيل..."}
                  className="w-full text-xs p-4 border rounded-2xl min-h-[120px] resize-none"
                  value={askBody}
                  onChange={(e) => setAskBody(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-550 border hover:bg-slate-50 transition text-xs font-black cursor-pointer"
                >
                  {lang === 'en' ? "Cancel" : "إلغاء"}
                </button>
                <button
                  type="button"
                  onClick={handleAskQuestion}
                  disabled={!askTitle.trim() || !askBody.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-black text-white transition text-xs font-black cursor-pointer disabled:opacity-50"
                >
                  {lang === 'en' ? "Submit Question" : "إرسال المقترح"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
