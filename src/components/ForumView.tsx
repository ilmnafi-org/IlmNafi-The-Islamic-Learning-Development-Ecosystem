/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ThumbsUp, Search, PlusCircle, ArrowLeft, Send, Sparkles, 
  AlertCircle, BookOpen, User, ChevronRight, Filter, Check, Share2, Trash2, 
  Lock, AlertTriangle, GraduationCap, Calendar, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AuthModal from './AuthModal';
import { dbService, LocalThread } from '../lib/supabase';
import { ScholarNetworkQA } from './ScholarNetworkQA';
import { ScholarWebinars } from './ScholarWebinars';
import { ScholarCommunities } from './ScholarCommunities';

interface ForumViewProps {
  lang: 'en' | 'ar';
  currentUser: { username: string; email: string; id?: string } | null;
  onAuthSuccess: (username: string, email: string) => void;
}

interface ForumThread {
  id: string;
  title: string;
  author: string;
  authorEmail?: string;
  avatar: string;
  role: string;
  date: string;
  category: 'jurisprudence' | 'history' | 'recitation' | 'scholarships' | 'general';
  body: string;
  thumbsUp: number;
  replies: {
    id: string;
    author: string;
    avatar: string;
    role: string;
    date: string;
    body: string;
  }[];
  isLikedByUser?: boolean;
}

export const ForumView: React.FC<ForumViewProps> = ({ lang, currentUser, onAuthSuccess }) => {
  // Navigation active scholarly sub-tab: 'qa' | 'webinars' | 'communities' | 'discuss'
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'webinars' | 'communities' | 'discuss'>('qa');

  // Open Circles Student Discussion Forum States
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // New Thread form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'jurisprudence' | 'history' | 'recitation' | 'scholarships' | 'general'>('general');
  const [newCategoryDropdownOpen, setNewCategoryDropdownOpen] = useState(false);
  const [newBody, setNewBody] = useState('');

  // New comment state
  const [newCommentBody, setNewCommentBody] = useState('');

  // Authentication & custom interactions
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPurpose, setAuthPurpose] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const ensureAuth = (purpose: string): boolean => {
    if (!currentUser) {
      setAuthPurpose(purpose);
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const loadThreads = async () => {
    try {
      const list = await dbService.fetchThreads();
      const mapped: ForumThread[] = list.map(t => {
        const isOwner = currentUser && (t.author === currentUser.username || t.author_id === currentUser.id);
        return {
          id: t.id,
          title: t.title,
          author: t.author,
          authorEmail: isOwner ? currentUser.email : t.likedBy?.[0] || '',
          avatar: t.avatar,
          role: t.role,
          date: t.date,
          category: t.category,
          body: t.body,
          thumbsUp: t.thumbsUp,
          replies: t.replies.map(r => ({
            id: r.id,
            author: r.author,
            avatar: r.avatar,
            role: r.role,
            date: r.date,
            body: r.body
          })),
          isLikedByUser: currentUser ? t.likedBy?.includes(currentUser.email) : false
        };
      });
      setThreads(mapped);
    } catch (err) {
      console.error("Failed loading threads", err);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'discuss') {
      loadThreads();
    }
  }, [currentUser, activeSubTab]);

  const handleCreateThread = async () => {
    if (!ensureAuth(lang === 'en' ? 'create a discussion topic' : 'إنشاء موضوع طرح جديد')) return;
    if (!newTitle.trim() || !newBody.trim()) return;

    try {
      await dbService.createNewThread(newTitle.trim(), newCategory, newBody.trim());
      await loadThreads();

      setNewTitle('');
      setNewBody('');
      setShowCreateModal(false);
      showToastMsg(lang === 'en' ? "Topic successfully added to study list!" : "تمت إضافة طرحك العلمي لمجلس الطلاب العام بنجاح!");
    } catch (err: any) {
      showToastMsg(err?.message || "Could not publish thread");
    }
  };

  const handleAddComment = async () => {
    if (!ensureAuth(lang === 'en' ? 'add a comment under this discussion' : 'إضافة مشاركة تحت هذا النقاش')) return;
    if (!newCommentBody.trim() || !activeThreadId) return;

    try {
      await dbService.addReply(activeThreadId, newCommentBody.trim());
      await loadThreads();

      setNewCommentBody('');
      showToastMsg(lang === 'en' ? "Comment published successfully." : "تم نشر تعليقك الحواري بنجاح.");
    } catch (err: any) {
      showToastMsg(err?.message || "Could not add comment");
    }
  };

  const likeThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ensureAuth(lang === 'en' ? 'like this discussion' : 'تأييد هذا الطرح الحواري')) return;

    try {
      await dbService.toggleLike(threadId);
      await loadThreads();
    } catch (err: any) {
      showToastMsg(err?.message || "Like operation failed");
    }
  };

  const shareThread = (thread: ForumThread, e: React.MouseEvent) => {
    e.stopPropagation();
    const mockUrl = `${window.location.origin}/forum/#thread-${thread.id}`;
    try {
      navigator.clipboard.writeText(mockUrl);
    } catch (err) {}
    showToastMsg(lang === 'en' ? "Discussion share link copied to clipboard!" : "تم نسخ رابط المشاركة إلى الحافظة!");
  };

  const handleDeleteThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;

    try {
      await dbService.destroyThread(threadId);
      await loadThreads();
      setActiveThreadId(null);
      showToastMsg(lang === 'en' ? "Discussion topic successfully archived." : "تم حذف المقترح الحواري بنجاح.");
    } catch (err: any) {
      showToastMsg(err?.message || "Failed to delete post");
    }
  };

  const filteredThreads = threads.filter(t => {
    const categoryMatches = selectedCategory === 'all' || t.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const queryMatches = t.title.toLowerCase().includes(query) || t.body.toLowerCase().includes(query) || t.author.toLowerCase().includes(query);
    return categoryMatches && queryMatches;
  });

  const studentCategories = [
    { value: "all", en: "All Channels", ar: "كل القنوات" },
    { value: "recitation", en: "Tajweed & Pronunciation", ar: "التجويد والنطق" },
    { value: "history", en: "Islamic Golden Age & Science", ar: "التاريخ والعلوم" },
    { value: "jurisprudence", en: "Jurisprudence", ar: "الفقه وأصوله" },
    { value: "scholarships", en: "Global Scholarship Seekers", ar: "المنح الدراسية" },
    { value: "general", en: "General Discussions", ar: "النقاشات العامة" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10" id="view-forum">
      
      {/* Premium Hub Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3 font-sans">
        <span className="bg-amber-100 text-amber-950 font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-amber-300/30">
          {lang === 'en' ? "Verified Scholar Circle" : "المجلس العلمي والتعليمي للعلماء"}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
          {lang === 'en' ? "Ilm Nafi Scholar Network" : "مجمع علم نافع للعلماء والبحوث"}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto">
          {lang === 'en' 
            ? "A global digital sanctuary preserving authentic Islamic sciences. Direct scholar inquiries, supervised interactions, live masterclass webinars, and certified faculties spaces."
            : "صرح تفاعلي علمي متكامل لحفظ الشريعة واللغة. أسئلة تخصصية يجيب عليها العلماء، دورات لايف تفاعلية، ومساحات ومجالس للعلماء المعتمدين."}
        </p>
      </div>

      {/* Main Orchestrating Tabs Header */}
      <div className="bg-white p-2 border rounded-3xl shadow-md mb-8 flex flex-col sm:flex-row gap-1.5 font-sans relative z-10">
        {[
          { id: 'qa', labelEn: "Scholar Q&A Network", labelAr: "المجلس الفقهي للعلماء", icon: BookOpen },
          { id: 'webinars', labelEn: "Sessions & Webinars", labelAr: "المحاضرات والندوات لايف", icon: Calendar },
          { id: 'communities', labelEn: "Scholar Communities", labelAr: "مجالس العلماء ومنابرهم", icon: Users },
          { id: 'discuss', labelEn: "Student Circle Lounge", labelAr: "مساحة النقاش لطلبة العلم", icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setActiveThreadId(null);
                setSelectedCategory('all');
              }}
              className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 flex-1 ${
                isActive 
                  ? 'bg-amber-800 text-white font-extrabold shadow-sm scale-[1.01]' 
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-250 animate-pulse' : 'text-slate-400'}`} />
              <span>{lang === 'en' ? tab.labelEn : tab.labelAr}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab viewports */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeSubTab === 'qa' && (
            <motion.div key="qa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ScholarNetworkQA lang={lang} currentUser={currentUser} onShowToast={showToastMsg} ensureAuth={ensureAuth} />
            </motion.div>
          )}

          {activeSubTab === 'webinars' && (
            <motion.div key="webinars" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ScholarWebinars lang={lang} currentUser={currentUser} onShowToast={showToastMsg} ensureAuth={ensureAuth} />
            </motion.div>
          )}

          {activeSubTab === 'communities' && (
            <motion.div key="communities" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ScholarCommunities lang={lang} currentUser={currentUser} onShowToast={showToastMsg} ensureAuth={ensureAuth} />
            </motion.div>
          )}

          {activeSubTab === 'discuss' && (
            <motion.div key="discuss" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              
              {/* Previous Open student discussion forums */}
              {activeThreadId === null ? (
                <div className="space-y-8">
                  {/* Lobby header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-[#201002] flex items-center gap-1.5">
                        <MessageSquare className="w-6 h-6 text-amber-805" />
                        <span>{lang === 'en' ? "Student Open Circle Lounge" : "منتدى الطلاب وتبادل المذاكرة"}</span>
                      </h2>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">
                        {lang === 'en' ? "Open discussion boards. Collaborate on exams, compare tajweed scores, and share Golden Age histories." : "مساحتكم الحرة كطلاب علم. تشاركوا التحضير للاختبارات، وقارنوا نقاط نطق التجويد للتنافس الشريف."}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-5 py-3.5 rounded-xl bg-amber-805 hover:bg-black text-white font-extrabold text-xs tracking-wide transition shadow flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-250 animate-pulse" />
                      <span>{lang === 'en' ? "New Study Topic" : "إنشاء موضوع استقصائي"}</span>
                    </button>
                  </div>

                  {/* Search and channels filters */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder={lang === 'en' ? "Search student channels, questions, or threads..." : "ابحث في نقاشات ومجموعات الطلاب..."}
                        className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-205 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none rounded-xl text-slate-900 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Channel lists horizontal */}
                    <div className="space-y-2 font-sans text-left">
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block pl-0.5 mb-1 flex items-center gap-1">
                        <Filter className="w-3 h-3 text-amber-800" /> Filter student circles
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {studentCategories.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => setSelectedCategory(c.value)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition border cursor-pointer ${
                              selectedCategory === c.value
                                ? 'bg-[#503020] border-[#503020] text-amber-50 shadow-sm'
                                : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200'
                            }`}
                          >
                            {lang === 'en' ? c.en : c.ar}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Create modal block sheet */}
                  {showCreateModal && (
                    <div className="p-6 md:p-8 bg-amber-50/20 border border-amber-900/10 rounded-2xl space-y-5 shadow-inner">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">
                          {lang === 'en' ? "Initiate Student Discussion Circle" : "إضافة تساؤل دراسي بين الزملاء"}
                        </span>
                        <button onClick={() => setShowCreateModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-900 cursor-pointer">
                          {lang === 'en' ? "Cancel" : "إلغاء"}
                        </button>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder={lang === 'en' ? "Topic Title (e.g. Seeking recommendations on Al-Ghazali books)" : "العنوان الأساسي لموضوعك الدراسي..."}
                          className="w-full p-3.5 text-xs bg-white border rounded-xl"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <div className="flex items-center gap-3 relative font-sans">
                          <label className="text-xs font-bold text-slate-600 block shrink-0">{lang === 'en' ? "Select Channel Topic:" : "حقل القناة:"}</label>
                          <select
                            className="text-xs p-2 bg-white border rounded-lg focus:border-amber-600 outline-none"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as any)}
                          >
                            <option value="recitation">{lang === 'en' ? "Tajweed & Pronunciation" : "التجويد والنطق"}</option>
                            <option value="history">{lang === 'en' ? "Islamic Golden Age & Science" : "التاريخ والعلوم"}</option>
                            <option value="jurisprudence">{lang === 'en' ? "Jurisprudence" : "الفقه وأصوله"}</option>
                            <option value="scholarships">{lang === 'en' ? "Global Scholarship Seekers" : "المنح الدراسية"}</option>
                            <option value="general">{lang === 'en' ? "General Discussions" : "النقاشات العامة"}</option>
                          </select>
                        </div>
                        <textarea
                          placeholder={lang === 'en' ? "Discuss details, share scores, references, or review in detail..." : "اكتب تفاصيل التساؤل أو الطرح العلمي هنا لمناقشته مع زملائك..."}
                          className="w-full min-h-[100px] p-4 text-xs bg-white border rounded-2xl resize-none font-sans"
                          value={newBody}
                          onChange={(e) => setNewBody(e.target.value)}
                        />
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleCreateThread}
                            disabled={!newTitle.trim() || !newBody.trim()}
                            className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-black text-white text-xs font-black cursor-pointer disabled:opacity-50"
                          >
                            {lang === 'en' ? "Publish Open Topic" : "نشر المسألة للطلاب"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Threads lists */}
                  <div className="space-y-4">
                    {filteredThreads.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl text-xs font-sans">
                        {lang === 'en' ? "No students threads match your query." : "لا تتوفر مواضيع مطروحة للنقاش تتبع هذه القناة."}
                      </div>
                    ) : (
                      filteredThreads.map((thread) => {
                        const curCat = studentCategories.find(c => c.value === thread.category);
                        return (
                          <div
                            key={thread.id}
                            onClick={() => setActiveThreadId(thread.id)}
                            className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-amber-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-5"
                          >
                            <div className="space-y-2">
                              <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded border block w-max">
                                {lang === 'en' ? curCat?.en : curCat?.ar}
                              </span>
                              <h3 className="text-sm font-black text-slate-900 leading-tight">
                                {thread.title}
                              </h3>
                              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                                {thread.body}
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-1">
                              <div className="flex items-center gap-2">
                                <img src={thread.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} alt="avatar" className="w-8 h-8 rounded-full border shadow-sm object-cover" />
                                <div>
                                  <p className="text-[10px] font-bold text-slate-800 leading-none">{thread.author}</p>
                                  <p className="text-[8px] text-slate-400 uppercase font-black font-sans leading-none mt-1">{thread.role}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-400 font-bold font-mono text-[10px]">
                                <button
                                  onClick={(e) => likeThread(thread.id, e)}
                                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${thread.isLikedByUser ? 'text-amber-900 bg-amber-50 border border-amber-200' : 'hover:bg-slate-50 border'}`}
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>{thread.thumbsUp}</span>
                                </button>
                                <div className="flex items-center gap-1 border px-2 py-1 rounded-lg">
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{thread.replies.length}</span>
                                </div>
                                <button onClick={(e) => shareThread(thread, e)} className="p-1 border rounded-lg hover:text-emerald-700">
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                                {currentUser && thread.authorEmail === currentUser.email && (
                                  <button onClick={(e) => handleDeleteThread(thread.id, e)} className="p-1 border rounded-lg hover:text-red-700 text-slate-400">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              ) : (
                /* Thread detailed presentation Circle */
                <div className="space-y-6">
                  <button
                    onClick={() => setActiveThreadId(null)}
                    className="flex items-center gap-2 text-xs text-slate-550 hover:text-amber-805 transition bg-white font-black py-2.5 px-4 border border-slate-205 shadow-sm rounded-xl cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span>{lang === 'en' ? "Back to Student Circles" : "العودة لحاشية النقاشات"}</span>
                  </button>

                  {(() => {
                    const current = threads.find(t => t.id === activeThreadId);
                    if (!current) return null;
                    const curCat = studentCategories.find(c => c.value === current.category);
                    return (
                      <div className="space-y-8">
                        <div className="bg-slate-50 border border-slate-250/80 rounded-3xl p-6 space-y-4 shadow-inner text-left">
                          <span className="px-2.5 py-0.5 bg-slate-200 text-[9px] font-black rounded uppercase border border-slate-300 w-max block">
                            {lang === 'en' ? curCat?.en : curCat?.ar}
                          </span>
                          <h3 className="text-sm font-black text-[#503020] leading-tight mt-2">{current.title}</h3>
                          <p className="text-xs md:text-sm text-slate-755 leading-relaxed font-sans">{current.body}</p>
                          <div className="flex items-center gap-3 border-t pt-4 mt-2">
                            <img src={current.avatar} alt="avatar" className="w-8 h-8 rounded-full border shadow-sm object-cover" />
                            <div>
                              <p className="text-xs font-bold text-slate-800 leading-none">{current.author}</p>
                              <span className="text-[8px] text-slate-400 uppercase font-black mt-1 leading-none inline-block">{current.role}</span>
                            </div>
                          </div>
                        </div>

                        {/* Replies list */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#503020] border-l-4 border-amber-805 pl-3">
                            {lang === 'en' ? "Discussion Commentaries" : "تعليقات ومناظرات الزملاء"} ({current.replies.length})
                          </h4>
                          {current.replies.length === 0 ? (
                            <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs font-sans">
                              {lang === 'en' ? "No commentaries posted. Be the first to assist." : "لا تتوفر تعقيبات مضافة على هذه المسألة للمذاكرة المسجلة."}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {current.replies.map(rep => (
                                <div key={rep.id} className="p-4 bg-white border rounded-2xl space-y-3 shadow-sm">
                                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{rep.body}</p>
                                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-[10px]">
                                    <div className="flex items-center gap-2">
                                      <img src={rep.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} alt="avatar" className="w-5 h-5 rounded-full object-cover shadow-sm border" />
                                      <span className="font-extrabold text-slate-800">{rep.author}</span>
                                      <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[8px] font-black uppercase text-slate-400">{rep.role}</span>
                                    </div>
                                    <span className="text-slate-400 font-bold font-sans">{rep.date}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Reply Form */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-md">
                          <span className="text-xs font-bold text-slate-805 uppercase tracking-widest block font-sans">
                            {lang === 'en' ? "Write discussion commentary" : "أضف مساهمة حوارية أو ملحوظة نقدية"}
                          </span>
                          <div className="flex gap-3">
                            <textarea
                              placeholder={lang === 'en' ? "Add your perspective or share correct answers scores..." : "اكتب ردك وملاحظاتك لمساعدة زملائك..."}
                              className="flex-1 p-3 text-xs bg-slate-50 rounded-2xl border outline-none min-h-[60px] resize-none focus:ring-1 focus:ring-amber-800"
                              value={newCommentBody}
                              onChange={(e) => setNewCommentBody(e.target.value)}
                            />
                            <button
                              onClick={handleAddComment}
                              disabled={!newCommentBody.trim()}
                              className="px-5 bg-amber-800 hover:bg-black text-white text-xs font-black rounded-xl duration-150 flex items-center shrink-0 self-end py-3 cursor-pointer disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5 text-amber-250 mr-1 shrink-0" />
                              <span>{lang === 'en' ? "Send" : "نشر"}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth modal overlay support */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(username, email) => {
            onAuthSuccess(username, email);
            setShowAuthModal(false);
          }}
        />
      )}

      {/* Floating high-end visual toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#201002] text-amber-100 border border-amber-900/30 px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black tracking-tight text-center"
            id="forum-action-toast"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
