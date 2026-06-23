/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, Award, ShieldCheck, BookOpen, Clock, Heart, Download, 
  ChevronRight, ArrowLeft, Bell, BookCheck, ClipboardList, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VERIFIED_SCHOLARS, Scholar, ScholarAnnouncement } from '../data/scholarData';

interface ScholarCommunitiesProps {
  lang: 'en' | 'ar';
  currentUser: { username: string; email: string } | null;
  onShowToast: (msg: string) => void;
  ensureAuth: (purpose: string) => boolean;
}

export const ScholarCommunities: React.FC<ScholarCommunitiesProps> = ({ 
  lang, currentUser, onShowToast, ensureAuth 
}) => {
  const [activeScholarId, setActiveScholarId] = useState<string | null>(null);
  const [nestedTab, setNestedTab] = useState<'announcements' | 'lectures' | 'faq' | 'books'>('announcements');
  const [announcements, setAnnouncements] = useState<ScholarAnnouncement[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [webinars, setWebinars] = useState<any[]>([]);
  const [followedScholars, setFollowedScholars] = useState<string[]>([]);

  useEffect(() => {
    // Live Supabase Sync for Announcements
    fetch('/api/scholar/announcements')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setAnnouncements(data);
        } else {
          setAnnouncements([]);
        }
      })
      .catch((err) => {
        console.error("Live sync failed", err);
        setAnnouncements([]);
      });

    // Live Supabase Sync for Questions
    fetch('/api/scholar/questions')
      .then(res => res.json())
      .then(data => {
        if (data) setQuestions(data);
      })
      .catch((err) => console.error("Questions live sync failed", err));

    // Live Supabase Sync for Webinars
    fetch('/api/scholar/webinars')
      .then(res => res.json())
      .then(data => {
        if (data) setWebinars(data);
      })
      .catch((err) => console.error("Webinars live sync failed", err));

    // Load following status
    const savedFollowing = localStorage.getItem('ilm_followed_scholars');
    if (savedFollowing) {
      try {
        setFollowedScholars(JSON.parse(savedFollowing));
      } catch (e) {}
    }
  }, []);

  const handleFollowToggle = (id: string) => {
    if (!ensureAuth(lang === 'en' ? 'follow verified scholar spaces' : 'متابعة حساب ومجلس الشيخ')) return;

    let updated: string[];
    const isFollowing = followedScholars.includes(id);

    if (isFollowing) {
      updated = followedScholars.filter(x => x !== id);
      onShowToast(lang === 'en' ? "You stopped following this scholar." : "تم إلغاء المتابعة.");
    } else {
      updated = [...followedScholars, id];
      onShowToast(lang === 'en' ? "You are now following this scholar for real-time announcements!" : "قمت بمتابعة الشيخ بنجاح! ستتلقى التحديثات والبحوث أولًا بأول.");
    }

    setFollowedScholars(updated);
    localStorage.setItem('ilm_followed_scholars', JSON.stringify(updated));
  };

  const handleLikeAnnouncement = (annId: string) => {
    const updated = announcements.map(a => {
      if (a.id === annId) {
        return { ...a, likes: a.likes + 1 };
      }
      return a;
    });
    setAnnouncements(updated);
    
    // Sync to backend
    fetch('/api/scholar/announcements/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    
    onShowToast(lang === 'en' ? "Supported announcement!" : "تم تسجيل إسناد ودعم هذا التحديث الإعلاني!");
  };

  const handleDownloadBook = (name: string) => {
    onShowToast(lang === 'en' ? `Downloading book manuscript: ${name}` : `تحميل الملف العلمي الموثق: ${name}`);
  };

  return (
    <div className="space-y-6">
      
      {activeScholarId === null ? (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#201002] flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-805" />
              <span>{lang === 'en' ? "Scholar Communities & Faculties" : "مجتمعات العلماء ومجالس العلوم"}</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {lang === 'en' 
                ? "Browse verified profiles, read individual credentials or authentic Ijazah lines, follow scholars, and explore their private announcements." 
                : "تصفح السير الذاتية المعتمدة لكبار مشايخنا، واطلع على أسانيد إجازاتهم، وتابع منصاتهم لتلقي مذكراتهم وأبحاثهم."}
            </p>
          </div>

          {/* Scholars card collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            {VERIFIED_SCHOLARS.map((s) => {
              const isFollowing = followedScholars.includes(s.id);
              return (
                <div 
                  key={s.id}
                  onClick={() => {
                    setActiveScholarId(s.id);
                    setNestedTab('announcements');
                  }}
                  className="bg-white rounded-3xl border border-slate-100 hover:border-amber-700/40 p-5 md:p-6 transition-all duration-300 hover:shadow-2xl shadow-[0_10px_35px_rgba(0,0,0,0.04)] cursor-pointer flex flex-col justify-between gap-5 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header credentials */}
                    <div className="flex items-start gap-4">
                      <img src={s.avatar} alt="avatar" className="w-14 h-14 rounded-full border border-amber-800 shadow object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="bg-amber-100 text-amber-950 font-black text-[9px] px-2.5 py-0.5 rounded-inner shadow-sm uppercase inline-block border border-amber-300/30">
                          {lang === 'en' ? s.badgeEn : s.badgeAr}
                        </span>
                        <h3 className="text-base font-black text-slate-900 leading-tight mt-1">
                          {lang === 'en' ? s.nameEn : s.nameAr}
                        </h3>
                        <p className="text-xs text-slate-500 font-sans truncate mt-0.5">
                          {lang === 'en' ? s.institutionEn : s.institutionAr}
                        </p>
                      </div>
                    </div>

                    {/* Qualifications preview short */}
                    <div className="space-y-2 border-t border-slate-50 pt-3 text-xs leading-relaxed text-slate-600">
                      <p className="font-bold text-slate-800">
                        {lang === 'en' ? "Core Tenure Qualifications:" : "موجز الأهلية والمؤهلات الأكاديمية:"}
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-550 font-sans">
                        {(lang === 'en' ? s.qualificationsEn : s.qualificationsAr).slice(0, 2).map((q, idx) => (
                          <li key={idx} className="truncate">{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">
                      {isFollowing 
                        ? (lang === 'en' ? "✓ Following Scholar Space" : "✓ متابع لمنبر الشيخ")
                        : (lang === 'en' ? `${s.followersCount + (isFollowing ? 1:0)} followers` : `${s.followersCount + (isFollowing ? 1:0)} متابع نشط`)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowToggle(s.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black transition cursor-pointer ${
                          isFollowing 
                            ? 'bg-amber-100 border-amber-250 text-[#503020] font-black shadow-sm' 
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isFollowing ? (lang === 'en' ? "Following" : "متابَع") : (lang === 'en' ? "Follow" : "متابعة")}
                      </button>
                      <button className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition cursor-pointer">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Detailed Scholar Community Mini-Portal space */
        <div className="space-y-6">
          <button
            onClick={() => setActiveScholarId(null)}
            className="flex items-center gap-2 text-xs text-slate-550 hover:text-amber-805 transition bg-white font-black py-2.1 px-4 border border-slate-205 shadow-sm rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'en' ? "Back to Scholars Board" : "العودة لقائمة المشايخ"}</span>
          </button>

          {(() => {
            const current = VERIFIED_SCHOLARS.find(s => s.id === activeScholarId);
            if (!current) return null;
            const isFollowing = followedScholars.includes(current.id);

            // Fetch filtered contents referencing this scholar
            const scholarAnnouncements = announcements.filter(a => a.scholarId === current.id);
            const scholarWebinars = webinars.filter(w => w.scholarId === current.id);
            const scholarFaqs = questions.filter(q => q.scholarAnswers && q.scholarAnswers.some((ans: any) => ans.scholarId === current.id));

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Visual profile details column */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Scholar Premium Credentials display Card */}
                  <div className="bg-gradient-to-br from-white to-amber-50/15 border border-slate-100 rounded-3xl p-6 space-y-5 shadow-[0_12px_45px_rgba(0,0,0,0.04)]">
                    <div className="text-center space-y-3 pb-4 border-b">
                      <img src={current.avatar} alt="avatar" className="w-20 h-20 rounded-full border-2 border-amber-800 shadow mx-auto object-cover" />
                      <div>
                        <span className="bg-amber-100 text-amber-950 font-black text-[9px] px-3 py-0.5 rounded-full border shadow-xs inline-block">
                          {lang === 'en' ? current.badgeEn : current.badgeAr}
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-1">{lang === 'en' ? current.nameEn : current.nameAr}</h3>
                        <p className="text-xs text-slate-400 font-sans mt-0.5 leading-tight">{lang === 'en' ? current.institutionEn : current.institutionAr}</p>
                      </div>

                      <button
                        onClick={() => handleFollowToggle(current.id)}
                        className={`w-full py-2.5 rounded-xl border-2 text-xs font-black transition cursor-pointer ${
                          isFollowing 
                            ? 'bg-amber-900 border-amber-900 text-amber-100 font-extrabold shadow-md' 
                            : 'bg-white text-slate-700 border-slate-205 hover:bg-slate-50'
                        }`}
                      >
                        {isFollowing 
                          ? (lang === 'en' ? "✓ FOLLOWING SCHOLAR SPACE" : "✓ متابع لمنشورات الشيخ") 
                          : (lang === 'en' ? "Follow Scholar Community" : "متابعة منبر الشيخ")}
                      </button>
                    </div>

                    {/* Detailed Academic Qualifications list */}
                    <div className="space-y-3 text-xs leading-relaxed">
                      <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                        Academic Qualifications
                      </span>
                      <ul className="space-y-2 list-none pl-0 font-sans text-slate-655">
                        {(lang === 'en' ? current.qualificationsEn : current.qualificationsAr).map((q, idx) => (
                          <li key={idx} className="flex gap-2 text-left">
                            <span className="text-amber-805 font-bold shrink-0 mt-0.5">🎖️</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Highly authentic Ijazah chain of narrations */}
                    <div className="space-y-3 text-xs leading-relaxed pt-3 border-t">
                      <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                        Verified Chains & Ijazat (الأسانيد والإجازات)
                      </span>
                      <ul className="space-y-2 list-none pl-0 font-sans text-slate-655">
                        {(lang === 'en' ? current.ijazahEn : current.ijazahAr).map((ij, idx) => (
                          <li key={idx} className="flex gap-2 text-left bg-white p-2.5 border rounded-xl leading-relaxed shadow-xs" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                            <span className="text-emerald-700 font-bold shrink-0">📜</span>
                            <span className="text-slate-750 font-bold leading-relaxed">{ij}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

                {/* Nested Scholar space Feed column */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Nested navigation sub-tabs */}
                  <div className="bg-white p-2.5 border rounded-2xl shadow-sm flex flex-wrap gap-1 font-sans">
                    {[
                      { value: 'announcements', en: "Announcements & Feed", ar: "البيانات والمنشورات", count: scholarAnnouncements.length },
                      { value: 'lectures', en: "Lectures & Webinars", ar: "الندوات المسجلة والمباشرة", count: scholarWebinars.length },
                      { value: 'faq', en: "Fatwa & Answers", ar: "الأجوبة والفتاوى الموثقة", count: scholarFaqs.length },
                      { value: 'books', en: "Notes & Manuscripts Library", ar: "خزانة الملفات والمخطوطات", count: current.id === 'scholar_yusuf' ? 2 : 1 }
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setNestedTab(tab.value as any)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 flex-1 justify-center leading-none ${
                          nestedTab === tab.value 
                            ? 'bg-[#503020] text-amber-100 font-black shadow-sm'
                            : 'bg-transparent text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lang === 'en' ? tab.en : tab.ar}</span>
                        <span className="px-1.5 py-0.5 bg-black/15 text-[10px] rounded-md font-mono font-bold">{tab.count}</span>
                      </button>
                    ))}
                  </div>

                  {/* Sub-tab viewport container */}
                  <div className="space-y-4">
                    
                    {nestedTab === 'announcements' && (
                      <div className="space-y-4">
                        {scholarAnnouncements.length === 0 ? (
                          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl text-xs font-sans">
                            {lang === 'en' ? "No recent announcements from this scholar." : "لا توجد منشورات أو بيانات جديدة حالياً للشيخ."}
                          </div>
                        ) : (
                          scholarAnnouncements.map((ann) => (
                            <div key={ann.id} className="bg-white border rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden font-sans">
                              <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-[10px] font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border flex items-center gap-1">
                                  <Bell className="w-3.5 h-3.5 inline animate-bounce text-amber-800" />
                                  <span>{lang === 'en' ? "OFFICIAL BULLETIN" : "بيان وتوجيه رسمي"}</span>
                                </span>
                                <span className="text-xs text-slate-400 font-bold font-mono">{ann.date}</span>
                              </div>
                              <h4 className="text-sm font-black text-slate-900">
                                {lang === 'en' ? ann.titleEn : ann.titleAr}
                              </h4>
                              <p className="text-xs md:text-sm text-slate-700 leading-relaxed text-left font-sans" style={{ textAlign: 'justify' }}>
                                {lang === 'en' ? ann.bodyEn : ann.bodyAr}
                              </p>
                              <div className="border-t pt-3 flex items-center justify-between mt-2">
                                <span className="text-[10px] text-slate-400 font-bold">
                                  Verified by Ilm Nafi Board
                                </span>
                                <button
                                  onClick={() => handleLikeAnnouncement(ann.id)}
                                  className="px-3.5 py-1.5 rounded-xl border bg-slate-50 hover:bg-red-50 hover:text-red-700 text-slate-600 transition text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Heart className="w-3.5 h-3.5" />
                                  <span>{ann.likes}</span>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {nestedTab === 'lectures' && (
                      <div className="space-y-4">
                        {scholarWebinars.length === 0 ? (
                          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl text-xs font-sans">
                            {lang === 'en' ? "No masterclasses scheduled for this scholar currently." : "لا تتوفر ندوات علمية مسجلة للشيخ حالياً."}
                          </div>
                        ) : (
                          scholarWebinars.map((w) => (
                            <div key={w.id} className="p-5 bg-white border rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm font-sans">
                              <div>
                                <span className="px-2.5 py-0.5 bg-slate-100 text-[9px] font-black rounded text-slate-500 uppercase">{w.topicEn}</span>
                                <h4 className="text-xs md:text-sm font-black text-slate-900 mt-1 leading-tight">
                                  {lang === 'en' ? w.titleEn : w.titleAr}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase font-sans mt-0.5">{w.dateEn} • {w.timeEn}</p>
                              </div>
                              <button
                                onClick={() => setActiveScholarId(null)}
                                className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-black text-white font-extrabold text-xs tracking-wide cursor-pointer text-center whitespace-nowrap"
                              >
                                {lang === 'en' ? "Go to Live Hall" : "صفحة البث"}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {nestedTab === 'faq' && (
                      <div className="space-y-4">
                        {scholarFaqs.length === 0 ? (
                          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl text-xs font-sans">
                            {lang === 'en' ? "No Q&A archives compiled for this scholar currently." : "لم يتم أرشفة فتاوى سابقة للشيخ في هذا القسم."}
                          </div>
                        ) : (
                          scholarFaqs.map((q) => (
                            <div key={q.id} className="bg-white border rounded-2xl p-5 space-y-3 shadow-sm font-sans">
                              <span className="px-2.5 py-0.5 bg-amber-50 rounded text-[9px] text-amber-950 font-black border uppercase">Q&A Verified</span>
                              <h4 className="text-xs md:text-sm font-black text-[#201002]">
                                {lang === 'en' ? q.titleEn : q.titleAr}
                              </h4>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                                {lang === 'en' ? q.bodyEn : q.bodyAr}
                              </p>
                              <div className="flex justify-between items-center border-t pt-2.5">
                                <span className="text-[9px] text-[#503020] font-bold font-sans">
                                  {q.scholarAnswers.length} Verified Solutions
                                </span>
                                <button
                                  onClick={() => setActiveScholarId(null)}
                                  className="text-xs font-black text-amber-805 hover:text-black hover:underline cursor-pointer flex items-center leading-none"
                                >
                                  <span>{lang === 'en' ? "Read answers" : "قراءة تفصيل الاستدلال"}</span>
                                  <ChevronRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {nestedTab === 'books' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Shariah Standards and classical PDFs Bookshelf */}
                        <div className="bg-white border hover:border-amber-700/40 p-5 rounded-2xl space-y-3 shadow-sm font-sans transition">
                          <span className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-[10px] font-black tracking-wide text-amber-850">PDF</span>
                          <div>
                            <h4 className="text-xs md:text-sm font-black text-slate-900 leading-tight">
                              {lang === 'en' ? "AAOIFI Shariah Standard No. 19 (Qard)" : "البيان الشرعي لمعيار القرض رقم ١٩ - أيوفي"}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase font-sans mt-0.5">Size: 2.1 MB / Pages: 14</p>
                          </div>
                          <button
                            onClick={() => handleDownloadBook("AAOIFI_Standard_19.pdf")}
                            className="w-full py-2 bg-slate-50 hover:bg-[#503020] hover:text-white transition rounded-xl text-xs font-extrabold border flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF copy</span>
                          </button>
                        </div>

                        {current.id === 'scholar_yusuf' && (
                          <div className="bg-white border hover:border-amber-700/40 p-5 rounded-2xl space-y-3 shadow-sm font-sans transition">
                            <span className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-[10px] font-black tracking-wide text-amber-850">PDF</span>
                            <div>
                              <h4 className="text-xs md:text-sm font-black text-slate-900 leading-tight">
                                {lang === 'en' ? "Draft Textbook: Contemporary Micro-Finance Structures" : "مذكرة الفقه المعاصر للمصارف والتمويل المصغر"}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase font-sans mt-0.5">Size: 5.4 MB / Pages: 88</p>
                            </div>
                            <button
                              onClick={() => handleDownloadBook("Comparative_Fiqh_Syllabus.pdf")}
                              className="w-full py-2 bg-slate-50 hover:bg-[#503020] hover:text-white transition rounded-xl text-xs font-extrabold border flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF copy</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

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
