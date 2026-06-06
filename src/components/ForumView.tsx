/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  PlusCircle, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  AlertCircle, 
  BookOpen, 
  User,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ForumViewProps {
  lang: 'en' | 'ar';
}

interface ThreadReply {
  id: string;
  author: string;
  avatar: string;
  role: string;
  date: string;
  body: string;
}

interface ForumThread {
  id: string;
  title: string;
  author: string;
  avatar: string;
  role: string;
  date: string;
  category: 'jurisprudence' | 'history' | 'recitation' | 'scholarships' | 'general';
  body: string;
  thumbsUp: number;
  replies: ThreadReply[];
  isLikedByUser?: boolean;
}

export const ForumView: React.FC<ForumViewProps> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // New Thread form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'jurisprudence' | 'history' | 'recitation' | 'scholarships' | 'general'>('general');
  const [newBody, setNewBody] = useState('');

  // New comment state
  const [newCommentBody, setNewCommentBody] = useState('');

  const [threads, setThreads] = useState<ForumThread[]>([]);

  // Sample seed data translated dynamically
  useEffect(() => {
    const defaultThreads: ForumThread[] = [
      {
        id: "thread-1",
        title: "Mastering the Ghunnah timings - Any pronunciation practice recommendations?",
        author: "Zayd Al-Masaeri",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
        role: "Advanced Student",
        date: "2 days ago",
        category: "recitation",
        body: "Assalamu alaykum everyone. I am practicing Surah Al-Ikhlas and Al-Asr but I struggle with giving the Ghunnah sound exactly 2 beats when encountering the Nun Sakinah. Is there a counting trick with fingers, or a specific breathing rhythm you recommend?",
        thumbsUp: 24,
        replies: [
          {
            id: "rep-1",
            author: "Sister Layla",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
            role: "Tajweed Instructor",
            date: "1 day ago",
            body: "Wa alaykum assalam! A handy classical trick is to fold or unfold one finger at a moderate, paced speed to count the 2 beats. Also, think of reciting at a steady 'Tahqeeq' (slow) pace, rather than rushing through the articulation. Try the AI reciter evaluation coach on our curriculum page, it will give you specific word feedback!"
          }
        ]
      },
      {
        id: "thread-2",
        title: "Ibn Al-Haytham and the foundation of empirical optics",
        author: "Prof. Dr. Tariq Mansour",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
        role: "Visiting Scholar",
        date: "3 days ago",
        category: "history",
        body: "Did you know that Ibn Al-Haytham (Alhazen) pioneered the scientific method purely out of spiritual curiosity to view the absolute truth in God's physical laws? He conducted his famous darkroom experiment (Camera Obscura) in Cairo, showing that light travels in straight mathematical lines. This broke a thousand years of Greek philosophical consensus.",
        thumbsUp: 38,
        replies: [
          {
            id: "rep-2",
            author: "Amina Al-Fatah",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
            role: "K-12 Student",
            date: "2 days ago",
            body: "That is amazing. In medieval Europe they just accepted opinions, whereas he proved everything through experimental proof. It really shows how Islamic studies have always walked hand-in-hand with mathematics and precise technology."
          }
        ]
      },
      {
        id: "thread-3",
        title: "Applying to Islamic Development Bank (IsDB) Postgraduate scholarship",
        author: "Karim Basha",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        role: "Graduate Scholar",
        date: "Yesterday",
        category: "scholarships",
        body: "For anyone preparing their statement of purpose for the IsDB fully funded program, make sure you highlight your concrete plan for community development in your home country. They are looking for students committed to sustainable local action (healthcare, water studies, or basic K-12 education support) rather than just personal career advancement.",
        thumbsUp: 15,
        replies: []
      }
    ];

    try {
      const stored = localStorage.getItem('ilm_forum_threads');
      if (stored) {
        setThreads(JSON.parse(stored));
      } else {
        setThreads(defaultThreads);
        localStorage.setItem('ilm_forum_threads', JSON.stringify(defaultThreads));
      }
    } catch (e) {
      setThreads(defaultThreads);
    }
  }, []);

  const handleCreateThread = () => {
    if (!newTitle.trim() || !newBody.trim()) return;

    const fresh: ForumThread = {
      id: "thread-" + Date.now(),
      title: newTitle,
      author: lang === 'en' ? "Guest Scholar" : "طالب علم ضيف",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      role: "Student",
      date: "Just now",
      category: newCategory,
      body: newBody,
      thumbsUp: 1,
      replies: []
    };

    const updated = [fresh, ...threads];
    setThreads(updated);
    try {
      localStorage.setItem('ilm_forum_threads', JSON.stringify(updated));
    } catch (e) {}

    // Reset fields
    setNewTitle('');
    setNewBody('');
    setShowCreateModal(false);
    setActiveThreadId(fresh.id);
  };

  const handleAddComment = () => {
    if (!newCommentBody.trim() || !activeThreadId) return;

    const updated = threads.map(t => {
      if (t.id === activeThreadId) {
        const freshReply: ThreadReply = {
          id: "rep-" + Date.now(),
          author: lang === 'en' ? "Peer Student" : "متعلم زميل",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
          role: "Member",
          date: "Just now",
          body: newCommentBody
        };
        return {
          ...t,
          replies: [...t.replies, freshReply]
        };
      }
      return t;
    });

    setThreads(updated);
    try {
      localStorage.setItem('ilm_forum_threads', JSON.stringify(updated));
    } catch (e) {}

    setNewCommentBody('');
  };

  const likeThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = threads.map(t => {
      if (t.id === threadId) {
        const isLiked = t.isLikedByUser;
        return {
          ...t,
          thumbsUp: isLiked ? t.thumbsUp - 1 : t.thumbsUp + 1,
          isLikedByUser: !isLiked
        };
      }
      return t;
    });
    setThreads(updated);
    try {
      localStorage.setItem('ilm_forum_threads', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredThreads = threads.filter(t => {
    const categoryMatches = selectedCategory === 'all' || t.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const queryMatches = t.title.toLowerCase().includes(query) || t.body.toLowerCase().includes(query) || t.author.toLowerCase().includes(query);
    return categoryMatches && queryMatches;
  });

  const categories = [
    { value: "all", en: "All Channels", ar: "كل القنوات" },
    { value: "recitation", en: "Tajweed & Pronunciation", ar: "التجويد والنطق" },
    { value: "history", en: "Islamic Golden Age & Science", ar: "التاريخ والعلوم" },
    { value: "jurisprudence", en: "Jurisprudence", ar: "الفقه وأصوله" },
    { value: "scholarships", en: "Global Scholarship Seekers", ar: "المنح الدراسية" },
    { value: "general", en: "General Discussions", ar: "النقاشات العامة" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="view-forum">
      
      <AnimatePresence mode="wait">
        {activeThreadId === null ? (
          <motion.div 
            key="forum-lobby"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8" 
            id="forum-lobby"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {lang === 'en' ? "Open Knowledge Forum" : "منتدى تبادل المعرفة والعلوم"}
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1.5 font-sans">
                  {lang === 'en' ? "Collaborate with classmates. Discuss academic content, recitation coaching, and search opportunities." : "تعاون مع بقية الطلاب والمعلمين. شارك معرفتك في النطق، التفاسير، والتخطيط للمنح."}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-3.5 rounded-xl bg-amber-800 hover:bg-[#201002] text-white font-extrabold text-xs tracking-wide transition shadow-md flex items-center gap-2 self-start cursor-pointer"
                id="btn-open-create-thread"
              >
                <PlusCircle className="w-4 h-4 text-amber-250 animate-pulse" />
                <span>{lang === 'en' ? "New Study Topic" : "إنشاء موضوع استقصائي"}</span>
              </button>
            </div>

            {/* Search bar & Category filters */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === 'en' ? "Search for threads, authors, or topics..." : "ابحث عن المواضيع، المشاركين، القنوات..."}
                  className="w-full pl-11 pr-4 py-3.5 text-xs bg-slate-50 border border-slate-205 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none rounded-xl text-slate-900 shadow-sm transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="forum-search-box"
                />
              </div>

              {/* Channels lists horizontal */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block pl-0.5 mb-1.5 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-amber-700" /> Filter channels
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedCategory(c.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedCategory === c.value
                          ? 'bg-amber-50 text-amber-900 border-amber-600 shadow-sm'
                          : 'bg-white text-slate-500 hover:text-slate-905 border-slate-205'
                      }`}
                    >
                      {lang === 'en' ? c.en : c.ar}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Create thread modal sheet wrapper */}
            {showCreateModal && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-8 bg-amber-50/20 border border-amber-900/10 rounded-3xl space-y-5 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-amber-900/5 pb-3">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                    {lang === 'en' ? "Initiate Study Discussion Block" : "إضافة تساؤل علمي جديد"}
                  </span>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-xs font-bold text-slate-550 hover:text-slate-900 cursor-pointer"
                  >
                    {lang === 'en' ? "Cancel" : "إلغاء"}
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={lang === 'en' ? "Title: e.g., Question on Al-Bukhari compilation chains" : "العنوان الأساسي لموضوعك الدراسي..."}
                    className="w-full p-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-slate-900 shadow-sm"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    id="forum-new-title"
                  />

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-600">
                      {lang === 'en' ? "Select Channel Topic:" : "حقل القناة:"}
                    </label>
                    <select
                      className="p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-slate-900 outline-none shadow-sm font-bold"
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      id="forum-new-category"
                    >
                      <option value="recitation">✓ Tajweed & Recitation</option>
                      <option value="history">✓ Golden Age History</option>
                      <option value="jurisprudence">✓ Jurisprudence</option>
                      <option value="scholarships">✓ Scholarships</option>
                      <option value="general">✓ General Discuss</option>
                    </select>
                  </div>

                  <textarea
                    placeholder={lang === 'en' ? "Write your topic context, references, question, or review in detail..." : "اكتب تفاصيل التساؤل أو الطرح العلمي هنا، مع إدراج المراجع إن وجدت..."}
                    className="w-full min-h-[120px] p-4 text-xs bg-white border border-slate-202 rounded-2xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-slate-950 resize-none font-sans"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    id="forum-new-body"
                  />

                  <div className="flex justify-end border-t border-slate-100 pt-4">
                    <button
                      onClick={handleCreateThread}
                      disabled={!newTitle.trim() || !newBody.trim()}
                      className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-[#201002] transition-colors text-white font-extrabold text-xs tracking-wide disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      id="btn-submit-forum-thread"
                    >
                      <span>{lang === 'en' ? "Publish Study Topic" : "نشر المسألة"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Threads list */}
            <div className="space-y-4">
              {filteredThreads.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl text-sm font-medium">
                  {lang === 'en' ? "No verified results match your channel query." : "لا توجد نتائج مطابقة لبحثك في القنوات."}
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const currentCat = categories.find(c => c.value === thread.category);
                  return (
                    <motion.div
                      layoutId={`thread-card-${thread.id}`}
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className="p-6 md:p-8 bg-white border border-slate-200 rounded-3xl hover:border-amber-600 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-extrabold text-amber-900 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-205/35">
                            {lang === 'en' ? currentCat?.en : currentCat?.ar}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold font-sans">
                            • {thread.date}
                          </span>
                        </div>
                        
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                          {thread.title}
                        </h3>
                        
                        <p className="text-xs md:text-sm text-slate-655 line-clamp-3 leading-relaxed">
                          {thread.body}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-150 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden shrink-0 shadow-sm">
                            {thread.avatar ? <img src={thread.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col text-[11px]">
                            <span className="font-bold text-slate-800">{thread.author}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{thread.role}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <button
                            onClick={(e) => likeThread(thread.id, e)}
                            className={`flex items-center gap-1.5 hover:text-amber-700 transition cursor-pointer ${
                              thread.isLikedByUser ? 'text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100' : 'text-slate-400'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{thread.thumbsUp}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                            <span>{thread.replies.length}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          /* Detailed Thread View */
          <motion.div 
            key="forum-thread-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6" 
            id="forum-thread-detail"
          >
            {/* Back button */}
            <button
              onClick={() => {
                setActiveThreadId(null);
              }}
              className="flex items-center gap-2 text-xs text-slate-550 hover:text-amber-805 transition bg-white font-extrabold py-3 px-5 border border-slate-200 shadow shadow-slate-100 rounded-xl cursor-pointer"
              id="btn-back-to-forum-lobby"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{lang === 'en' ? "Back to lobby" : "العودة للرئيسية"}</span>
            </button>

            {(() => {
              const current = threads.find(t => t.id === activeThreadId);
              if (!current) return null;
              const currentCat = categories.find(c => c.value === current.category);
              return (
                <div className="space-y-8">
                  
                  {/* Core original post card */}
                  <div className="bg-[#faf8f3] rounded-3xl border-2 border-amber-900/10 p-6 md:p-10 space-y-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest bg-amber-100/50 px-3 py-1 rounded-xl border border-amber-205/20">
                        {lang === 'en' ? currentCat?.en : currentCat?.ar}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold font-sans">{current.date}</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
                      {current.title}
                    </h2>

                    <p className="text-sm md:text-base text-slate-800 leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                      {current.body}
                    </p>

                    <div className="flex items-center justify-between border-t border-amber-900/10 pt-6 mt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-150 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shrink-0 shadow">
                          {current.avatar ? <img src={current.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-xs text-slate-800">{current.author}</span>
                          <span className="text-[10px] text-slate-400 font-semibold font-sans">{current.role}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => likeThread(current.id, e)}
                        className={`flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-800 transition cursor-pointer ${
                          current.isLikedByUser ? 'text-amber-900 bg-amber-100/60 px-4 py-2 rounded-xl border border-amber-205/20 shadow-inner' : ''
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{current.thumbsUp} {lang === 'en' ? "Support Marks" : "إعجاب"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Replies header */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-3">
                      {lang === 'en' ? "Student & Faculty Commentaries" : "الشروحات والتعليقات المرفقة"} ({current.replies.length})
                    </h3>

                    {current.replies.length === 0 ? (
                      <div className="p-10 border border-dashed border-slate-200 rounded-3xl text-center text-slate-450 text-xs">
                        {lang === 'en' ? "No academic commentary posted yet. Share your thoughts below." : "لا توجد مشاركات أو شروحات مضافة حالياً لعنوان هذه المسألة."}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {current.replies.map((rep) => (
                          <div key={rep.id} className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-md">
                            <p className="text-xs md:text-sm text-slate-800 font-sans leading-relaxed" style={{ textAlign: 'justify' }}>
                              {rep.body}
                            </p>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] sm:text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-slate-100 shadow-sm border border-slate-200">
                                  <img src={rep.avatar} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-slate-700">{rep.author}</span>
                                <span className="text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">{rep.role}</span>
                              </div>
                              <span className="text-slate-400 font-sans font-semibold">{rep.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-xl">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-widest block pl-0.5">
                      {lang === 'en' ? "Contribute helpful knowledge" : "أضف مساهمة علمية أو شرحاً مفيداً"}
                    </span>
                    <div className="flex gap-3">
                      <textarea
                        placeholder={lang === 'en' ? "Reference scholars, clarify pronunciation, or assist classmate..." : "اكتب ردك أو مراجعك لمساعدة زملائك..."}
                        className="flex-1 p-4 text-xs text-slate-900 bg-slate-50 outline-none focus:ring-1 focus:ring-amber-600 border border-slate-200 hover:border-slate-300 rounded-2xl resize-none min-h-[80px] leading-relaxed transition"
                        value={newCommentBody}
                        onChange={(e) => setNewCommentBody(e.target.value)}
                        id="forum-comment-input"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newCommentBody.trim()}
                        className="px-6 bg-amber-850 hover:bg-black transition text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 self-end py-4 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        id="btn-post-forum-comment"
                      >
                        <Send className="w-4 h-4 text-amber-250 shrink-0" />
                        <span>{lang === 'en' ? "Share" : "نشر"}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
