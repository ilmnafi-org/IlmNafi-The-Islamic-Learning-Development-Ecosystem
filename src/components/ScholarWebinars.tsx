/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Video, Play, FileText, Download, Check, Sparkles, 
  ArrowLeft, Users, MessageSquare, Send, Bell, ChevronLeft, ChevronRight, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VERIFIED_SCHOLARS, Webinar } from '../data/scholarData';

interface ScholarWebinarsProps {
  lang: 'en' | 'ar';
  currentUser: { username: string; email: string } | null;
  onShowToast: (msg: string) => void;
  ensureAuth: (purpose: string) => boolean;
}

interface LiveQuestion {
  id: string;
  author: string;
  question: string;
  status: 'pending' | 'approved' | 'answering' | 'answered';
}

export const ScholarWebinars: React.FC<ScholarWebinarsProps> = ({ 
  lang, currentUser, onShowToast, ensureAuth 
}) => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [activeWebinarId, setActiveWebinarId] = useState<string | null>(null);

  // Virtual Live Classroom States
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveQuestions, setLiveQuestions] = useState<LiveQuestion[]>([
    { id: "lq_1", author: "Sister Zainab", question: "Can we use Warsh rules if we are leading Hafs-listening congregations?", status: 'answered' },
    { id: "lq_2", author: "Farhan Al-Mutiri", question: "How does the sound rate differ on Madd Muttasil compared to Madd Muttasil in Ash-Shatibiyyah?", status: 'answering' },
    { id: "lq_3", author: "Aisha Salem", question: "Do you advise starting Tajweed via Jazariyyah or Tuhfat al-Atfal?", status: 'approved' }
  ]);
  const [myQuestion, setMyQuestion] = useState('');

  useEffect(() => {
    // Live Supabase Sync for Webinars
    fetch('/api/scholar/webinars')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setWebinars(data);
        } else {
          setWebinars([]);
        }
      })
      .catch((err) => {
        console.error("Live sync failed", err);
        setWebinars([]);
      });
  }, []);

  const saveWebinars = (updated: Webinar[]) => {
    setWebinars(updated);
    // Sync array to backend
    fetch('/api/scholar/webinars/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  };

  const handleRegister = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ensureAuth(lang === 'en' ? 'register for academic lectures' : 'التسجيل لحضور الندوة العلمية المباشرة')) return;

    const updated = webinars.map(w => {
      if (w.id === id) {
        return { ...w, isRegistered: !w.isRegistered };
      }
      return w;
    });

    const currentW = webinars.find(w => w.id === id);
    const becameRegistered = currentW ? !currentW.isRegistered : false;

    saveWebinars(updated);

    if (becameRegistered) {
      onShowToast(lang === 'en' ? "Successfully registered! Reminders set for email." : "تم التسجيل بنجاح! سيتم إخطار بريدك قبل الانطلاق.");
    } else {
      onShowToast(lang === 'en' ? "Registration cancelled." : "تم إلغاء التسجيل.");
    }
  };

  const handleSendLiveQuestion = () => {
    if (!myQuestion.trim()) return;
    if (!ensureAuth(lang === 'en' ? 'ask a moderated live question' : 'طرح تساؤل تفاعلي على المعلم')) return;

    const newQ: LiveQuestion = {
      id: "lq_" + Date.now(),
      author: currentUser?.username || "Guest Student",
      question: myQuestion.trim(),
      status: 'pending'
    };

    setLiveQuestions([...liveQuestions, newQ]);
    
    // Simulate Moderator Approval in 5 seconds
    const qId = newQ.id;
    setTimeout(() => {
      setLiveQuestions(old => old.map(q => {
        if (q.id === qId) {
          onShowToast(lang === 'en' ? "Your question has been APPROVED by the moderator!" : "تمت موافقة مشرف الجلسة على سؤالك العلمي لعرضه لايف!");
          return { ...q, status: 'approved' };
        }
        return q;
      }));
    }, 4500);

    // Simulate Scholar answering in 15 seconds
    setTimeout(() => {
      setLiveQuestions(old => old.map(q => {
        if (q.id === qId) {
          return { ...q, status: 'answering' };
        }
        return q;
      }));
    }, 12000);

    setMyQuestion('');
    onShowToast(lang === 'en' ? "Question submitted to student moderator desk!" : "تم إرسال تساؤلك لقسم فلترة وتنظيم الجلسة!");
  };

  const handleDownloadHandout = (name: string) => {
    onShowToast(lang === 'en' ? `Downloading academic source: ${name}` : `جاري تحميل المذكرة المرجعية: ${name}`);
  };

  const slides = [
    {
      titleEn: "Slide 1: Vocal Elongation Frameworks",
      titleAr: "الشريحة ١: مصفوفة مراتب المد الأصلي والفرعي في الأداء",
      pointsEn: [
        "Classification of Elongation rules (Madd Tabii, Madd Muttasil, Madd Munfasil)",
        "Quantitative measurements of Harakat in classical prose",
        "The impact of speed rates (Tahqeeq, Tadweer, Hadr) on vocal length accuracy"
      ],
      pointsAr: [
        "تصنيف أنواع المدود تبعا للأصالة والفرعية (المد الطبيعي، المتصل والمنفصل)",
        "معايير الحساب الزمني للحركات في ضوء المنظومات الكلاسيكية",
        "تأثير تباين مراتب السرعة التجويدية على تناسب ومطابقة وموازنة المدود"
      ]
    },
    {
      titleEn: "Slide 2: Hafs vs. Warsh Comparative Matrix",
      titleAr: "الشريحة ٢: مقارنة دقيقة بين ركائز المد عند حفص وورش والوجوه الجائزة",
      pointsEn: [
        "Hafs path: Madd Muttasil elongated to 4 or 5 counts of Harakah",
        "Warsh path (via الأزرق): Muttasil & Munfasil strictly elongated to 6 counts",
        "Exceptions on specific Quranic words and stopping boundaries (Waqf)"
      ],
      pointsAr: [
        "طريق حفص: مد واجب متصل يُقرأ بالتوسط (٤ حركات) أو فويق التوسط (٥ حركات)",
        "طريق ورش بمضمن الشاطبية: الإشباع اللازم بمقدار ٦ حركات قولا واحداً",
        "مواطن الخلاف اللفظي وحالات الوقف والابتداء الاستثنائية الحاكمة للمسألة"
      ]
    },
    {
      titleEn: "Slide 3: Real-time Pitch & Waveform Mapping",
      titleAr: "الشريحة ٣: الهندسة الصوتية واللسان المعملي لصحوة المدود",
      pointsEn: [
        "Phonetic frequency consistency for vowel sustainment",
        "Visualizing breath control to support 6 full counts comfortably",
        "Common errors: Tremolo (R'ashah) and clipping vowels early"
      ],
      pointsAr: [
        "استقرار التردد الصوتي ووزنه لإتمام زمني صحيح للمقطع الصوتي الصائت",
        "هندسة التنفس ودور الحجاب الحاجز لإنتاج حركات الإشباع الست بارتياح تام",
        "الأخطاء الشائعة: الرعشة الصوتية المتقطعة، واقتطاع أزمنة المدود قبل استيفائها"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {activeWebinarId === null ? (
        <div className="space-y-6">
          
          <div className="border-b pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#201002] flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-800" />
              <span>{lang === 'en' ? "Scholarly Webinars & Live Classroom" : "قاعة المحاضرات والندوات التدريبية المباشرة"}</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {lang === 'en' 
                ? "Register for scheduled masterclasses, join live streaming streams led by senior scholars, and download study binders." 
                : "سجل في دورات التميز الأكاديمي، وتابع البث المباشر للشرح لضبط التلاوة مع كبار مشايخ العالم الإسلامي."}
            </p>
          </div>

          {/* Webinars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map((w) => {
              const scholar = VERIFIED_SCHOLARS.find(s => s.id === w.scholarId);
              const isLive = w.status === 'live';
              const isUpcoming = w.status === 'upcoming';
              const isRecorded = w.status === 'recorded';

              return (
                <div 
                  key={w.id}
                  className={`bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                    isLive 
                      ? 'border-red-650 ring-2 ring-red-500/10 shadow-lg' 
                      : 'border-slate-150 hover:border-amber-700 hover:shadow-md'
                  }`}
                >
                  {/* Status ribbon block */}
                  <div className={`p-4 text-xs font-black uppercase tracking-widest flex items-center justify-between ${
                    isLive ? 'bg-red-50 text-red-700 border-b border-red-100' :
                    isUpcoming ? 'bg-amber-50 text-amber-800 border-b border-amber-100' :
                    'bg-slate-50 text-slate-650 border-b'
                  }`}>
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-red-600 animate-ping' : isUpcoming ? 'bg-amber-700 animate-pulse' : 'bg-slate-400'}`} />
                      <span>{isLive ? (lang === 'en' ? "LIVE CLASSROOM ACTIVE" : "محاضرة مباشرة الآن") :
                            isUpcoming ? (lang === 'en' ? "UPCOMING INTERMEDIATE" : "موعد مقرر قريباً") :
                            (lang === 'en' ? "RECORDED ARCHIVE" : "ندوة مسجلة من الأرشيف")}</span>
                    </span>
                    <span className="font-mono text-[9px]">{w.timeEn}</span>
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex-1 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-sans">
                      {lang === 'en' ? w.topicEn : w.topicAr}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">
                      {lang === 'en' ? w.titleEn : w.titleAr}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                      {lang === 'en' ? w.descriptionEn : w.descriptionAr}
                    </p>

                    {/* Presenting scholar link details */}
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
                      <img src={scholar?.avatar} alt="presenter" className="w-8 h-8 rounded-full shadow object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">{lang === 'en' ? scholar?.nameEn : scholar?.nameAr}</p>
                        <p className="text-[9px] text-slate-400 font-sans mt-1 leading-none truncate">{lang === 'en' ? scholar?.badgeEn : scholar?.badgeAr}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action row footer */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
                    <button
                      onClick={(e) => handleRegister(w.id, e)}
                      className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition cursor-pointer flex-1 shrink-0 ${
                        w.isRegistered 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-205'
                      }`}
                    >
                      {w.isRegistered ? (
                        <span className="flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{lang === 'en' ? "Registered" : "تم الحجز بنجاح"}</span>
                        </span>
                      ) : (
                        <span>{lang === 'en' ? "Reserve Seat" : "حجز مقعد بالصف"}</span>
                      )}
                    </button>

                    {isLive ? (
                      <button
                        onClick={() => setActiveWebinarId(w.id)}
                        className="px-5 py-2.5 rounded-xl bg-red-650 hover:bg-black text-white text-xs font-black transition flex items-center gap-1 cursor-pointer animate-pulse"
                      >
                        <Video className="w-4 h-4 text-red-250 animate-bounce" />
                        <span>{lang === 'en' ? "Join Classroom" : "دخول المحاضرة لايف"}</span>
                      </button>
                    ) : isRecorded ? (
                      <button
                        onClick={() => {
                          onShowToast(lang === 'en' ? "Launching Video Playback..." : "تحميل التسجيل وإعداد ورقة المذاكرة...");
                          setActiveWebinarId(w.id);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-[#201002] text-white text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-4 h-4 text-amber-250" />
                        <span>{lang === 'en' ? "Watch Recording" : "مشاهدة التسجيل"}</span>
                      </button>
                    ) : (
                      <div className="px-4 py-2.5 text-center text-slate-400 font-bold text-[10px] uppercase font-sans border-2 border-transparent">
                        {lang === 'en' ? "Starting soon" : "مغلق حالياً"}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Immersive Virtual Classroom space (The heart of full-stack lectures support) */
        <div className="space-y-6">
          <button
            onClick={() => {
              setActiveWebinarId(null);
              setActiveSlide(0);
            }}
            className="flex items-center gap-2 text-xs text-slate-550 hover:text-amber-805 transition bg-white font-black py-2.5 px-4 border border-slate-200 shadow-sm rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'en' ? "Exit Learning Room" : "الخروج من فضاء المحاضرة"}</span>
          </button>

          {(() => {
            const current = webinars.find(w => w.id === activeWebinarId);
            if (!current) return null;
            const scholar = VERIFIED_SCHOLARS.find(s => s.id === current.scholarId);
            const isLiveNow = current.status === 'live';

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Visualizer & Slides board */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Visualizer screen representative of live streams */}
                  <div className="bg-slate-950 text-white rounded-3xl overflow-hidden aspect-video relative shadow-2xl flex flex-col justify-between p-6">
                    {/* Live indicator overlay */}
                    <div className="flex items-center justify-between w-full shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isLiveNow ? 'bg-red-600 text-white animate-pulse':'bg-slate-600 text-slate-100'}`}>
                        {isLiveNow ? "● LIVE CLASSROOM STREAM" : "● PLAYING RECORDED INTERACTIVE SESSION"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 inline text-slate-500" />
                        <span>{isLiveNow ? "245 Students Online" : "1,420 Cumulative views"}</span>
                      </span>
                    </div>

                    {/* Preaching scholar info overlay center */}
                    <div className="text-center space-y-3 py-6 self-center">
                      <div className="relative inline-block">
                        <img src={scholar?.avatar} alt="presenting" className="w-20 h-20 rounded-full border-4 border-amber-800 shadow mx-auto object-cover" />
                        <span className="absolute bottom-0 right-1 bg-amber-700 p-1.5 rounded-full border border-slate-950 text-white leading-none">
                          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-amber-100">{lang === 'en' ? scholar?.nameEn : scholar?.nameAr}</h4>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">{lang === 'en' ? scholar?.institutionEn : scholar?.institutionAr}</p>
                      </div>

                      {/* Animated voice frequency waves */}
                      <div className="flex items-center justify-center gap-1.5 pt-2">
                        <span className="w-1 h-6 bg-amber-700 rounded-full animate-[bounce_1s_infinite]" />
                        <span className="w-1 h-3 bg-amber-500 rounded-full animate-[bounce_1.4s_infinite]" />
                        <span className="w-1 h-8 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite]" />
                        <span className="w-1 h-4 bg-amber-600 rounded-full animate-[bounce_1.1s_infinite]" />
                        <span className="w-1 h-5 bg-amber-800 rounded-full animate-[bounce_1.6s_infinite]" />
                      </div>
                    </div>

                    {/* Stream bottom control layout */}
                    <div className="flex items-center justify-between w-full bg-slate-900/60 p-3 rounded-2xl border border-white/5 backdrop-blur-xs shrink-0 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <button className="text-white hover:text-amber-400 leading-none">🔈 Audio: Unmuted</button>
                        <span>•</span>
                        <span>Bitrate: 1080p WebStream</span>
                      </div>
                      <span className="font-mono text-xs text-amber-500">{isLiveNow ? "Elapsed time: 42m 15s" : "Duration: 1h 45m"}</span>
                    </div>

                  </div>

                  {/* PDF Slide Presentation deck controls (High premium interactivity) */}
                  <div className="bg-white rounded-3xl border border-slate-150/40 p-6 shadow-[0_12px_45px_rgba(0,0,0,0.04)] space-y-4 font-sans">
                    <div className="border-b pb-3.5 flex items-center justify-between">
                      <span className="text-xs font-black text-[#503020] uppercase tracking-widest flex items-center gap-1.5">
                        <FileText className="w-5 h-5 text-amber-800 shrink-0" />
                        {lang === 'en' ? "SCHOLAR LECTURE PRESENTATION DECK" : "استعراض الشرائح والعروض التدريبية المصاحبة"}
                      </span>
                      <span className="text-xs font-bold text-slate-450">
                        {lang === 'en' ? `Slide ${activeSlide + 1} of ${slides.length}` : `شريحة ${activeSlide + 1} من أصل ${slides.length}`}
                      </span>
                    </div>

                    {/* Present active slide view */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-50 rounded-2xl p-5 border shadow-inner space-y-4"
                      >
                        <h4 className="text-xs font-black text-amber-950 uppercase tracking-widest border-b pb-2">
                          {lang === 'en' ? slides[activeSlide].titleEn : slides[activeSlide].titleAr}
                        </h4>
                        <ul className="space-y-3 pl-1 pr-1 font-sans">
                          {(lang === 'en' ? slides[activeSlide].pointsEn : slides[activeSlide].pointsAr).map((p, idx) => (
                            <li key={idx} className="flex gap-2 text-xs md:text-sm text-slate-700 leading-relaxed text-left">
                              <span className="text-amber-800 shrink-0 mt-1 font-bold">✓</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation controllers */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveSlide(old => Math.max(0, old - 1))}
                        disabled={activeSlide === 0}
                        className="p-2 border rounded-xl hover:bg-slate-50 transition font-bold text-xs disabled:opacity-45 flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous slide</span>
                      </button>

                      <div className="flex gap-1.5">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === activeSlide ? 'bg-amber-800 w-5' : 'bg-slate-300'}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveSlide(old => Math.min(slides.length - 1, old + 1))}
                        disabled={activeSlide === slides.length - 1}
                        className="p-2 border rounded-xl hover:bg-slate-50 transition font-bold text-xs disabled:opacity-45 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next slide</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>

                {/* Handouts panel & live Q&A space */}
                <div className="space-y-6">
                  
                  {/* Notes & Reading materials Shelf */}
                  <div className="bg-white rounded-3xl border border-slate-150/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
                    <span className="text-xs font-black text-[#503020] uppercase tracking-widest block font-sans">
                      {lang === 'en' ? "Lecture Handbook Shelf" : "حقيبة المذكرات العلمية والمصادر"}
                    </span>
                    <div className="space-y-3.5">
                      {current.handouts.map((h, idx) => (
                        <div key={idx} className="bg-slate-50 hover:bg-amber-50/20 border border-slate-150 p-3 rounded-2xl flex items-center justify-between gap-3 transition">
                          <div className="min-w-0 flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-805 text-xs font-black shrink-0">
                               {h.type.toUpperCase()}
                            </span>
                            <div className="min-w-0 leading-tight">
                              <p className="text-xs font-bold text-slate-800 truncate">{lang === 'en' ? h.nameEn : h.nameAr}</p>
                              <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">{h.size}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadHandout(lang === 'en' ? h.nameEn : h.nameAr)}
                            className="p-2 bg-white hover:bg-slate-50 text-slate-700 border rounded-xl transition cursor-pointer shrink-0"
                            title="Download material"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live moderated Q&A streams (Heart of collaborative student webinars) */}
                  <div className="bg-white rounded-3xl border border-slate-150/40 p-6 shadow-[0_12px_45px_rgba(0,0,0,0.04)] space-y-4 flex flex-col justify-between min-h-[420px]">
                    <div className="space-y-4">
                      <div className="border-b pb-2 flex items-center justify-between">
                        <span className="text-xs font-black text-[#503020] uppercase tracking-widest block font-sans">
                          {lang === 'en' ? "Moderated Classroom Q&A" : "جلسة الأسئلة المباشرة المفلترة"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[8px] font-black uppercase tracking-wider animate-pulse">
                          Live Queue
                        </span>
                      </div>

                      {/* Display questions stream */}
                      <div className="space-y-3.5 overflow-y-auto max-h-[250px] pr-1.5 font-sans">
                        {liveQuestions.map((q) => {
                          const isNew = q.id.startsWith('lq_17') || q.id.startsWith('lq_15') === false; // User's self-sent questions
                          return (
                            <div key={q.id} className="text-xs p-3.5 bg-slate-50 border rounded-2xl space-y-2">
                              <div className="flex items-center justify-between border-b pb-1">
                                <span className="font-extrabold text-slate-800 text-[10px]">{q.author}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide border font-sans ${
                                  q.status === 'answered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  q.status === 'answering' ? 'bg-amber-150 text-amber-900 border-amber-300 animate-pulse font-black' :
                                  q.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-150' :
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                  {q.status === 'answered' ? (lang === 'en' ? "Preached / Answered" : "تم الشرح لايف") :
                                   q.status === 'answering' ? (lang === 'en' ? "PREACHER SPEAK ACTION" : "يجيب المعلم لايف الآن") :
                                   q.status === 'approved' ? (lang === 'en' ? "Approved for Speaker" : "معتمد على المنصة") :
                                   (lang === 'en' ? "Pending Review" : "بانتظار المراجعة")}
                                </span>
                              </div>
                              <p className="text-slate-655 font-bold leading-relaxed">{q.question}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Send question form bottom */}
                    <div className="space-y-2 pt-2 border-t">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block pl-0.5">
                        Submit a question to present to the speaker
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={lang === 'en' ? "Ask about slide content..." : "اطرح تساؤلاً يتبع محتوى الشريحة..."}
                          className="flex-1 text-xs p-3.5 border bg-slate-50 rounded-xl outline-none focus:ring-1 focus:ring-amber-800"
                          value={myQuestion}
                          onChange={(e) => setMyQuestion(e.target.value)}
                        />
                        <button
                          onClick={handleSendLiveQuestion}
                          disabled={!myQuestion.trim()}
                          className="p-3.5 bg-amber-800 hover:bg-black text-white rounded-xl transition disabled:opacity-50 cursor-pointer flex items-center"
                        >
                          <Send className="w-4 h-4 text-amber-250" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
};
