/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, 
  GraduationCap, 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  UserCheck, 
  MessageSquare, 
  AlertCircle,
  FileText,
  Award,
  ChevronRight,
  Video,
  Users,
  Clock,
  Plus,
  Send,
  ThumbsUp,
  Play,
  RotateCcw,
  Volume2,
  Bookmark,
  Hash,
  Activity,
  CheckCircle2,
  Terminal,
  Compass,
  Mic,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScholarlyViewProps {
  lang: 'en' | 'ar';
}

interface ScholarlyResult {
  answer: string;
  scholars: string;
  verses: {
    text: string;
    translation: string;
  }[];
  actionItems: string[];
}

interface Webinar {
  id: string;
  title: string;
  titleAr: string;
  speaker: string;
  speakerAr: string;
  date: string;
  time: string;
  desc: string;
  descAr: string;
  attendees: number;
  category: string;
  categoryAr: string;
}

interface DiscussionThread {
  id: string;
  title: string;
  titleAr: string;
  author: string;
  category: string;
  categoryAr: string;
  replies: number;
  likes: number;
  content: string;
  contentAr: string;
  comments: { author: string; text: string; time: string }[];
}

interface StudyCircle {
  id: string;
  name: string;
  nameAr: string;
  topic: string;
  topicAr: string;
  time: string;
  maxSeats: number;
  joined: number;
  host: string;
}

interface LoungePost {
  id: string;
  author: string;
  text: string;
  time: string;
  likes: number;
  reactions: { [key: string]: number };
}

export const ScholarlyView: React.FC<ScholarlyViewProps> = ({ lang }) => {
  // Navigation Tabs state
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'webinars' | 'communities' | 'lounge'>('qa');

  // --- TAB 1: Scholar Q&A State ---
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScholarlyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      en: "How can I improve my mindfulness (Khushu) and focus in daily prayers?",
      ar: "كيف يمكنني تحسين الخشوع والتركيز في الصلوات اليومية؟",
      tag: lang === 'en' ? "Spiritual Growth" : "النمو الروحي"
    },
    {
      en: "What are the stages of compiling and verifying the text of the Holy Quran?",
      ar: "ما هي مراحل جمع وتوثيق نص القرآن الكريم؟",
      tag: lang === 'en' ? "History" : "التاريخ"
    },
    {
      en: "Explain the theological and scientific definition of 'Beneficial Knowledge' in Islam.",
      ar: "اشرح التعريف العقدي والعلمي لـ 'العلم النافع' في الإسلام.",
      tag: lang === 'en' ? "Theology" : "العقيدة"
    }
  ];

  // --- TAB 2: Sessions & Webinars State ---
  const [webinars, setWebinars] = useState<Webinar[]>([
    {
      id: 'web-1',
      title: "The Methodology of Hadith Criticism in Islamic Scholarship",
      titleAr: "مناهج نقد الرواية وتخريج الأحاديث في العلوم الشريفة",
      speaker: "Dr. Sulaiman Al-Ghamdi",
      speakerAr: "د. سليمان الغامدي",
      date: "2026-06-21",
      time: "18:00 UTC",
      desc: "An in-depth review of historical sciences, tracing chains of narrators and evaluating authenticity using rigorous scholarly metrics.",
      descAr: "دراسة نقدية في علوم الحديث الشريف، تتبع الأسانيد وتقييم الجرح والتعديل بالاعتماد على مناهج المحدثين.",
      attendees: 142,
      category: "Hadith Sciences",
      categoryAr: "علوم الحديث"
    },
    {
      id: 'web-2',
      title: "Algebra & Optics: Scientific Excellence of the Al-Nafi Scholars",
      titleAr: "الجبر والبصريات: التجربة العلمية وعصر الترجمة الذهبي",
      speaker: "Prof. Maryam Al-Farabi",
      speakerAr: "أ.د. مريم الفارابي",
      date: "2026-06-25",
      time: "15:00 UTC",
      desc: "Exploring how theological motivations for prayer timings and navigation spurred breakthroughs in mathematical astronomy and physics.",
      descAr: "كيف ساهمت الدوافع الشرعية لتوريت المواقيت والقبلة في طفرات علم الفلك والرياضيات في بيت الحكمة.",
      attendees: 98,
      category: "Islamic Golden Age",
      categoryAr: "تاريخ العلوم"
    },
    {
      id: 'web-3',
      title: "Principles of Jurisprudence (Usul) for Modern Biomedicine",
      titleAr: "أصول الفقه وتطبيقاته المعاصرة في النوازل الطبية",
      speaker: "Sheikh Yusuf bin Ahmad",
      speakerAr: "الشيخ يوسف بن أحمد",
      date: "2026-06-30",
      time: "19:30 UTC",
      desc: "Deploying Maqasid (Objectives of Shari'ah) to formulate answers for contemporary medical ethics and emerging technologies.",
      descAr: "توظيف مقاصد الشريعة الإسلامية الخمسة لمعالجة مسائل الأخلاقيات الطبية المعاصرة والتكنولوجيا الحيوية.",
      attendees: 210,
      category: "Jurisprudence",
      categoryAr: "أصول الفقه"
    }
  ]);

  const [rsvpSuccess, setRsvpSuccess] = useState<string | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [activeRsvpWebinar, setActiveRsvpWebinar] = useState<Webinar | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newWebTitle, setNewWebTitle] = useState('');
  const [newWebSpeaker, setNewWebSpeaker] = useState('');
  const [newWebDate, setNewWebDate] = useState('');
  const [newWebTime, setNewWebTime] = useState('');
  const [newWebDesc, setNewWebDesc] = useState('');
  const [activeLiveSession, setActiveLiveSession] = useState<Webinar | null>(null);
  const [liveChatText, setLiveChatText] = useState('');
  const [liveChats, setLiveChats] = useState<{ author: string; text: string; time: string }[]>([
    { author: "Zaid Omar", text: "Assalamu alaykum, is this lecture recorded?", time: "18:02" },
    { author: "Dr. Sulaiman Al-Ghamdi (Host)", text: "Wa alaykum assalam, yes! Slides and audio will be uploaded to resources.", time: "18:03" },
    { author: "Fatima Al-Zahra", text: "This is a breathtaking overview of chains of transmission.", time: "18:05" }
  ]);

  // --- TAB 3: Scholar Communities State ---
  const [activeCommunity, setActiveCommunity] = useState<string>('all');
  const [communities, setCommunities] = useState([
    { id: 'all', label: 'All Fields', labelAr: 'كل العلوم', icon: Compass },
    { id: 'fiqh', label: 'Jurisprudence & Law', labelAr: 'الفقه والأصول', icon: Book },
    { id: 'hadith', label: 'Hadith Criticism', labelAr: 'علوم الحديث الشريف', icon: Award },
    { id: 'aqeedah', label: 'Theology & Foundations', labelAr: 'العقيدة والتوحيد', icon: Sparkles },
    { id: 'language', label: 'Arabic Rhetoric', labelAr: 'اللغة والأدب والبيان', icon: FileText }
  ]);

  const [threads, setThreads] = useState<DiscussionThread[]>([
    {
      id: 'th-1',
      title: "The role of Istihsan (Scholarly Preference) in Maliki Law",
      titleAr: "دور الاستحسان والمصالح المرسلة في المذهب المالكي",
      author: "Yahya Al-Maghribi",
      category: "fiqh",
      categoryAr: "الفقه والأصول",
      replies: 12,
      likes: 34,
      content: "Does the Maliki application of Istihsan provide a faster mechanism to adapt to contemporary civic contracts compared to pure analogical definition?",
      contentAr: "هل يوفر تطبيق الاستحسان عند المالكية وسيلة أسرع للتكيف مع العقود المدنية المعاصرة مقارنة بالقياس الأصولي الصارم؟",
      comments: [
        { author: "Abu Bakr", text: "Indeed, Imam Malik relied heavily on Medinan custom as well, facilitating high practicality.", time: "2 hrs ago" },
        { author: "Ahmad Al-Hanbali", text: "A beautiful enquiry. Every student of comparative law should dissect this.", time: "1 hr ago" }
      ]
    },
    {
      id: 'th-2',
      title: "Criteria of Sound Hadith Transmission by Al-Bukhari",
      titleAr: "شروط اللقاء المعاصر والاتصال عند الإمام البخاري",
      author: "Hassan Ibn Thabit",
      category: "hadith",
      categoryAr: "علوم الحديث الشريف",
      replies: 8,
      likes: 27,
      content: "Analyzing Al-Bukhari's absolute requirement of verified meeting ('Liqa') as opposed to Muslim's standard of general contemporaneity ('Mu'asarah').",
      contentAr: "تحليل شرط اللقاء الفعلي المباشر عند البخاري مقابل الاكتفاء بالمعاصرة مع إمكانية اللقاء عند الإمام مسلم في الروايات.",
      comments: [
        { author: "Sarah Al-Madani", text: "The Bukhari standard provides ultimate systemic protection for transmission lines.", time: "1 day ago" }
      ]
    },
    {
      id: 'th-3',
      title: "The logical definitions of Attributes in classical Ash'ari theology",
      titleAr: "التعريفات المنطقية للصفات عند متكلمي الأشاعرة والماتريدية",
      author: "Umar Al-Baghdadi",
      category: "aqeedah",
      categoryAr: "العقيدة والتوحيد",
      replies: 19,
      likes: 41,
      content: "Let us review how Imam Al-Ghazali integrated Arstotelian syllogisms into the defence of the core theological tenets in his Tahafut.",
      contentAr: "دعونا نراجع كيف وظف الإمام الغزالي القياس المنطقي الأرسطي في كتابه تهافت الفلاسفة لعضد أصول المعتقد.",
      comments: []
    }
  ]);

  const [showThreadModal, setShowThreadModal] = useState<DiscussionThread | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('fiqh');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [showCreateThreadForm, setShowCreateThreadForm] = useState(false);

  // --- TAB 4: Student Circle Lounge State ---
  const [loungePosts, setLoungePosts] = useState<LoungePost[]>([
    {
      id: 'p-1',
      author: "Yousef_K",
      text: "Just completed the Tajweed rules on elongation (Madd). The automatic audio feedback in the Reciter is insanely helpful!",
      time: "12 mins ago",
      likes: 12,
      reactions: { '👍': 8, '💡': 4, '☕': 2 }
    },
    {
      id: 'p-2',
      author: "Iman_Sch",
      text: "Anyone preparing for the Usul exam? Let's make a dedicated study group to recite and peer review the Al-Waraqat primer tomorrow morning.",
      time: "45 mins ago",
      likes: 19,
      reactions: { '💡': 9, '📝': 6, '👍': 4 }
    }
  ]);

  const [newLoungeText, setNewLoungeText] = useState('');
  const [loungeNickname, setLoungeNickname] = useState('Anonymous Disciple');
  const [studyCircles, setStudyCircles] = useState<StudyCircle[]>([
    { id: 'sc-1', name: "Hifdh Quran Revision", nameAr: "مراجعة المتون والحفظ القرآني", topic: "Surah Al-Mulk Focus", topicAr: "تسميع ومراجعة سورة الملك", time: "Everyday after Fajr", maxSeats: 12, joined: 8, host: "Ibrahim" },
    { id: 'sc-2', name: "Al-Waraqat Reading", nameAr: "قراءة وشرح متن الورقات للأصول", topic: "Definition of Fard & Mandub", topicAr: "أقسام الأحكام والواجبات", time: "Tonight at 20:00 UTC", maxSeats: 6, joined: 5, host: "Aminah" }
  ]);

  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleTopic, setNewCircleTopic] = useState('');
  const [newCircleTime, setNewCircleTime] = useState('');
  const [newCircleSeats, setNewCircleSeats] = useState(5);
  const [showCircleForm, setShowCircleForm] = useState(false);

  // Focus Timer Sub-module
  const [timerTimeLeft, setTimerTimeLeft] = useState(1500); // 25 mins
  const [timerActive, setTimerActive] = useState(false);
  const [timerSelectedPreset, setTimerSelectedPreset] = useState<'pomodoro' | 'deep' | 'fajr'>('pomodoro');
  const [timerSound, setTimerSound] = useState<'page' | 'bell' | 'silent'>('page');
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    if (timerSelectedPreset === 'pomodoro') setTimerTimeLeft(1500);
    else if (timerSelectedPreset === 'deep') setTimerTimeLeft(3000);
    else if (timerSelectedPreset === 'fajr') setTimerTimeLeft(900); // 15 mins
  };

  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            // Play a soft sound if supported
            if (timerSound !== 'silent') {
              try {
                const horn = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
                horn.volume = 0.3;
                horn.play();
              } catch(e) {}
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerSound]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimerPreset = (preset: 'pomodoro' | 'deep' | 'fajr') => {
    setTimerSelectedPreset(preset);
    setTimerActive(false);
    if (preset === 'pomodoro') setTimerTimeLeft(1500);
    else if (preset === 'deep') setTimerTimeLeft(3000);
    else if (preset === 'fajr') setTimerTimeLeft(900);
  };


  // --- TRIGGER ASKING MUFTI (Gemini AI proxy) ---
  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scholarly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: queryText }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error rating. Please verify connectivity.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(lang === 'en' ? 'Failed to consult scholars database. Please try again.' : 'فشل الاتصال بقاعدة بيانات العلماء. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // RSVP Trigger
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !activeRsvpWebinar) return;

    // Simulate RSVP update
    setWebinars(prev => prev.map(w => {
      if (w.id === activeRsvpWebinar.id) {
        return { ...w, attendees: w.attendees + 1 };
      }
      return w;
    }));

    setRsvpSuccess(`Successfully reserved a seat! Ticket Ref: NFI-${Math.floor(Math.random() * 90000) + 10000}`);
    setRsvpName('');
    setTimeout(() => {
      setRsvpSuccess(null);
      setActiveRsvpWebinar(null);
    }, 4500);
  };

  // Schedule Webinar Submit
  const handleScheduleWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebTitle.trim() || !newWebSpeaker.trim() || !newWebDate || !newWebTime) return;

    const newWeb: Webinar = {
      id: `web-${Date.now()}`,
      title: newWebTitle,
      titleAr: newWebTitle,
      speaker: newWebSpeaker,
      speakerAr: newWebSpeaker,
      date: newWebDate,
      time: newWebTime,
      desc: newWebDesc || 'Open academic research seminar focusing on sacred texts.',
      descAr: newWebDesc || 'حلقة نقاشية مفتوحة لاستعادة رونق العلوم الشريفة والبحث الأكاديمي.',
      attendees: 0,
      category: 'Student Research',
      categoryAr: 'بحوث طلابية'
    };

    setWebinars(prev => [newWeb, ...prev]);
    setNewWebTitle('');
    setNewWebSpeaker('');
    setNewWebDate('');
    setNewWebTime('');
    setNewWebDesc('');
    setShowScheduleForm(false);
  };

  // Add Comment on Thread
  const handleAddComment = () => {
    if (!newCommentText.trim() || !showThreadModal) return;

    const comment = {
      author: loungeNickname || "Dedicated Scholar",
      text: newCommentText,
      time: "Just now"
    };

    const updatedThreads = threads.map(t => {
      if (t.id === showThreadModal.id) {
        const withComment = { ...t, comments: [...t.comments, comment], replies: t.replies + 1 };
        // Sync active modal
        setShowThreadModal(withComment);
        return withComment;
      }
      return t;
    });

    setThreads(updatedThreads);
    setNewCommentText('');
  };

  // Add New Thread
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const newTh: DiscussionThread = {
      id: `th-${Date.now()}`,
      title: newThreadTitle,
      titleAr: newThreadTitle,
      author: loungeNickname || "Active Disciple",
      category: newThreadCategory,
      categoryAr: communities.find(c => c.id === newThreadCategory)?.label || "العلم العام",
      replies: 0,
      likes: 1,
      content: newThreadContent,
      contentAr: newThreadContent,
      comments: []
    };

    setThreads(prev => [newTh, ...prev]);
    setNewThreadTitle('');
    setNewThreadContent('');
    setShowCreateThreadForm(false);
  };

  // Add Live Chat Message
  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatText.trim()) return;

    const chat = {
      author: loungeNickname || "Student",
      text: liveChatText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLiveChats(prev => [...prev, chat]);
    setLiveChatText('');
  };

  // Add Lounge Post
  const handlePostToLounge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoungeText.trim()) return;

    const post: LoungePost = {
      id: `p-${Date.now()}`,
      author: loungeNickname || "Muta'allim",
      text: newLoungeText,
      time: "Just now",
      likes: 1,
      reactions: { '👍': 1 }
    };

    setLoungePosts(prev => [post, ...prev]);
    setNewLoungeText('');
  };

  // React to post
  const handleLoungeReaction = (postId: string, emoji: string) => {
    setLoungePosts(prev => prev.map(p => {
      if (p.id === postId) {
        const reactions = { ...p.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...p, reactions, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  // Create Study Circle
  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim() || !newCircleTopic.trim() || !newCircleTime) return;

    const circle: StudyCircle = {
      id: `sc-${Date.now()}`,
      name: newCircleName,
      nameAr: newCircleName,
      topic: newCircleTopic,
      topicAr: newCircleTopic,
      time: newCircleTime,
      maxSeats: newCircleSeats,
      joined: 1,
      host: loungeNickname || "Group Host"
    };

    setStudyCircles(prev => [...prev, circle]);
    setNewCircleName('');
    setNewCircleTopic('');
    setNewCircleTime('');
    setNewCircleSeats(5);
    setShowCircleForm(false);
  };

  // Join Study Circle
  const handleJoinCircle = (circleId: string) => {
    setStudyCircles(prev => prev.map(c => {
      if (c.id === circleId && c.joined < c.maxSeats) {
        return { ...c, joined: c.joined + 1 };
      }
      return c;
    }));
  };

  // Global labels and copies mapping
  const labelsTrans = {
    en: {
      networkTitle: "Ilm Nafi Scholar Network",
      networkSubtitle: "Venture into elite study loops, join live panels, consult authenticated classical councils & connect peer academies.",
      qaTab: "Scholar Q&A Network",
      webinarsTab: "Sessions & Webinars",
      communitiesTab: "Scholar Communities",
      loungeTab: "Student Circle Lounge",
      consultTitle: "Theological & Historical Advisor",
      consultSub: "Leverage classical references, authentic chains, and school classifications to resolve academic questions.",
      nickname: "Your Student Nickname",
      joinBtn: "Join",
      activeLabel: "Platform Active Feed"
    },
    ar: {
      networkTitle: "شبكة علماء نافع الأكاديمية",
      networkSubtitle: "انطلق في حلقات علمية رفيعة، شارك في ندوات بث حي، استشر المجامع الفقهية المعاصرة وتواصل مع طلاب العلوم الشريفة.",
      qaTab: "منبر السائل والمجيب الشرعي",
      webinarsTab: "الحلقات والندوات العلمية والسمينرات",
      communitiesTab: "مجتمعات طلاب المعرفة التخصصية",
      loungeTab: "ردهة ومجلس طلاب الاستزادة",
      consultTitle: "المستشار العلمي والمسائل المنهجية",
      consultSub: "استثمر المراجع الفقهية الموثقة والتبيين المنهجي بضرب الأدلة لاستيضاح مسائل العقيدة والأصول.",
      nickname: "اسم الشهرة أو اللقب الأكاديمي",
      joinBtn: "انضمام",
      activeLabel: "لوحة المتابعة الطلابية الحية"
    }
  }[lang];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10" id="ilm-nafi-scholar-network-hub">
      {/* Visual Elegant Header Canvas */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-black bg-amber-500/10 text-amber-900 border border-amber-302 border-amber-900/10 mb-4 tracking-widest uppercase animate-none">
          <GraduationCap className="w-4 h-4 text-amber-850" />
          {lang === 'en' ? "ISLAMIC HIGHER END ENDOWMENT" : "وقف التعليم الأكاديمي التخصصي المفتوح"}
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#2a1b14] font-sans mb-3 block">
          {labelsTrans.networkTitle}
        </h1>
        <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {labelsTrans.networkSubtitle}
        </p>
      </div>

      {/* Persistent Student Nickname Selector in Header */}
      <div className="max-w-md mx-auto mb-10 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
          👤 {labelsTrans.nickname}:
        </label>
        <input 
          type="text" 
          value={loungeNickname}
          onChange={(e) => setLoungeNickname(e.target.value)}
          className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-amber-600"
          placeholder="e.g. Abdullah_ibn_Ahmad"
          id="student-nickname-input"
        />
      </div>

      {/* MODERN SUB-TABS NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-center p-1.5 bg-slate-100 rounded-3xl max-w-4xl mx-auto mb-12 gap-1 border border-slate-200">
        {[
          { id: 'qa', label: labelsTrans.qaTab, icon: HelpCircle, color: 'text-amber-800' },
          { id: 'webinars', label: labelsTrans.webinarsTab, icon: Video, color: 'text-emerald-800' },
          { id: 'communities', label: labelsTrans.communitiesTab, icon: Users, color: 'text-indigo-800' },
          { id: 'lounge', label: labelsTrans.loungeTab, icon: MessageSquare, color: 'text-rose-800' }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id as any)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-300 w-full cursor-pointer ${
                isActive 
                  ? 'bg-white text-slate-900 border border-slate-200/60 shadow-md scale-[1.02]' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
              id={`subtab-trigger-${item.id}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT CANVASES */}
      <AnimatePresence mode="wait">
        
        {/* SUBTAB 1: SCHOLAR Q&A NETWORK */}
        {activeSubTab === 'qa' && (
          <motion.div
            key="qa-network"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="text-center max-w-xl mx-auto mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-1">{labelsTrans.consultTitle}</h2>
              <p className="text-xs text-slate-500">{labelsTrans.consultSub}</p>
            </div>

            {/* Q&A Frame */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
                  {lang === 'en' ? "Your Theological or Historical Question" : "مسألتك العلمية والتاريخية أو الأدبية"}
                </label>
                <div className="relative">
                  <textarea
                    className="w-full min-h-[120px] p-4 text-sm bg-slate-50/70 text-slate-900 border border-slate-205 rounded-2xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all resize-none leading-relaxed shadow-inner font-sans"
                    placeholder={lang === 'en' ? "Explain the classical schools of thought, or ask about Hadith validation..." : "اسأل عن الصلاة، الصوم، شروط الحديث الموثق، أو بيت الحكمة ببغداد..."}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    disabled={loading}
                    id="qa-query-text"
                  />
                </div>
                
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => handleAsk(question)}
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 rounded-xl bg-[#2a1b14] hover:bg-[#1a100a] text-amber-200 font-extrabold text-xs tracking-wide transition shadow disabled:opacity-50 cursor-pointer flex items-center gap-2 border border-amber-900/20"
                    id="btn-subtab-ask"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin"></span>
                        <span>{lang === 'en' ? "Consulting classic libraries..." : "يجري البحث في المراجع الشريفة..."}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>{lang === 'en' ? "Consult Scholars" : "استشارة العلماء"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestion presets */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  {lang === 'en' ? "Suggested Inquiries" : "أسئلة استرشادية مقترحة"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {presets.map((p, i) => {
                    const text = lang === 'en' ? p.en : p.ar;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setQuestion(text);
                          handleAsk(text);
                        }}
                        disabled={loading}
                        className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/10 text-left transition text-xs text-slate-800 bg-white hover:shadow-sm cursor-pointer flex flex-col justify-between h-36"
                        style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                      >
                        <span className="text-[9px] text-[#503020] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-amber-50 self-start mb-2">
                          {p.tag}
                        </span>
                        <span className="line-clamp-3 leading-relaxed text-slate-900 font-sans flex-grow" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                          {text}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-2 font-bold tracking-wide flex items-center gap-1 hover:text-amber-805 self-end">
                          Ask <ChevronRight className="w-3 h-3" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Error messaging */}
            {error && (
              <div className="p-5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-3.5 max-w-xl mx-auto text-xs shadow-sm" id="error-qa-mufti">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">Academic Notice</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Live Loading state */}
            {loading && !result && (
              <div className="bg-white/80 backdrop-blur-xs rounded-3xl border border-slate-200 shadow-sm p-8 text-center space-y-4 max-w-2xl mx-auto py-12">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-800 animate-spin border border-amber-100">
                  <HelpCircle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{lang === 'en' ? "Assembling classical citations & consensus..." : "يجري جرد المصنفات والآراء الفقهية الكبرى..."}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{lang === 'en' ? "Consulting Hanafi, Maliki, Shafi'i, and Hanbali text corpora." : "البحث يسري في مجلدات الفقه الأكبر وأصول السنة..."}</p>
                </div>
              </div>
            )}

            {/* Verification certificate display */}
            {result && (
              <div className="bg-[#faf8f3] border border-amber-900/10 rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto" id="qa-certificate-response">
                <div className="bg-gradient-to-r from-[#2a1b14] to-[#120a06] p-6 text-white flex items-center justify-between border-b border-amber-900/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Book className="w-4 h-4 text-amber-300" />
                      {lang === 'en' ? "Verified Academy Advisory" : "مستند موثق ومخّرج علمياً"}
                    </span>
                    <h2 className="text-lg font-black font-sans leading-tight">
                      {lang === 'en' ? "Academic Advisory Statement" : "بيان الاستشارة العلمية للطلب"}
                    </h2>
                  </div>
                  <span className="text-[10px] text-amber-200 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200/25 italic font-mono uppercase">
                    Ref-A59
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Answer Body */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-2">
                      {lang === 'en' ? "Scholarly Discussion & Commentary" : "الشرح الفقهي والتعليق العلمي والأسانيد"}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      {result.answer}
                    </p>
                  </div>

                  {/* Verses & Hadith references */}
                  {result.verses && result.verses.length > 0 && (
                    <div className="p-5 md:p-6 rounded-2xl bg-white border border-amber-900/5 space-y-4 shadow-inner">
                      <span className="text-[9px] font-extrabold text-[#503020] uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        {lang === 'en' ? "Foundational Verses & Traditions" : "الآثار والنصوص المقاصدية الشاهدة"}
                      </span>
                      {result.verses.map((v, index) => (
                        <div key={index} className="space-y-2 pt-3 border-t border-amber-100 first:border-t-0 first:pt-0">
                          <p className="text-lg md:text-xl text-emerald-950 text-center font-serif leading-loose font-extrabold" dir="rtl">
                            {v.text}
                          </p>
                          <p className="text-[11px] text-slate-500 italic leading-relaxed text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            "{v.translation}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Jurisprudence Consensus */}
                  <div className="space-y-2 pt-4 border-t border-amber-900/10">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-2">
                      {lang === 'en' ? "Classical Scholarly Consensus" : "إجماع المدارس الكلاسيكية الفقهية"}
                    </h3>
                    <p className="text-xs text-slate-700 bg-amber-500/5 p-4 border border-amber-300/30 rounded-xl leading-relaxed italic" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      {result.scholars}
                    </p>
                  </div>

                  {/* Action items for students */}
                  {result.actionItems && result.actionItems.length > 0 && (
                    <div className="pt-4 border-t border-amber-900/10 space-y-3">
                      <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-2">
                        {lang === 'en' ? "Action Plan for Students" : "تصميم خطوات عملية للتطبيق"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {result.actionItems.map((action, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded bg-amber-50 flex items-center justify-center text-xs font-bold text-[#503020] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-[11px] text-slate-700 leading-relaxed font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                              {action}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* SUBTAB 2: SESSIONS & WEBINARS */}
        {activeSubTab === 'webinars' && (
          <motion.div
            key="sessions-webinars"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-700" />
                  {lang === 'en' ? "Virtual Halaqas & Lectures" : "حلقات البث التفاعلية والندوات العلمية"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'en' ? "Join leading professors, log attendances, and coordinate student symposiums." : "شاهد بث الدروس مباشرة، أرسل أسئلتك للمحاضر، وأسس سمينار أبحاثك الخاص."}
                </p>
              </div>
              
              <button
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                id="btn-show-schedule-webinar"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'en' ? "Schedule Student Seminar" : "جدولة حلقة علمية جديدة"}</span>
              </button>
            </div>

            {/* Schedule Webinar Form */}
            {showScheduleForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleScheduleWebinar}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto"
                id="form-schedule-webinar"
              >
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2">
                  {lang === 'en' ? "Propose and Schedule a Live Session" : "خطط واطرح حلقة أبحاث أكاديمية جديدة"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Seminar Title" : "عنوان الدرس/الندوة"}</label>
                    <input 
                      type="text" 
                      required 
                      value={newWebTitle}
                      onChange={(e) => setNewWebTitle(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800"
                      placeholder="e.g., Arabic Rhetoric basics"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Lead Speaker / Presenter" : "الباحث المناقش أو صاحب الورقة"}</label>
                    <input 
                      type="text" 
                      required 
                      value={newWebSpeaker}
                      onChange={(e) => setNewWebSpeaker(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800"
                      placeholder="e.g., Student Ahmad Al-Farsi"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Date" : "التاريخ"}</label>
                    <input 
                      type="date" 
                      required 
                      value={newWebDate}
                      onChange={(e) => setNewWebDate(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Time Slot (UTC)" : "الوقت المحدد والتوقيت العالمي"}</label>
                    <input 
                      type="text" 
                      required 
                      value={newWebTime}
                      onChange={(e) => setNewWebTime(e.target.value)}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800"
                      placeholder="e.g., 14:00 UTC"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Summary / Abstract of Study" : "ملخص البحث أو المحاور العلمية"}</label>
                  <textarea 
                    value={newWebDesc}
                    onChange={(e) => setNewWebDesc(e.target.value)}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800 h-20 resize-none"
                    placeholder="Briefly detail what resources will be used..."
                  />
                </div>

                <div className="flex justify-end gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setShowScheduleForm(false)} 
                    className="px-4 py-2 border rounded-xl text-xs text-slate-600"
                  >
                    {lang === 'en' ? "Cancel" : "إلغاء"}
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                  >
                    {lang === 'en' ? "Broadcast & Save" : "حفظ وبث الدعوات"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Dynamic RSVP modal ticket rendering */}
            {activeRsvpWebinar && (
              <div className="fixed inset-0 bg-[#120a06]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" id="rsvp-ticket-modal">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white border rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                  <div className="bg-[#2a1b14] p-5 text-white flex justify-between items-center border-b border-amber-900/10">
                    <span className="text-xs font-black tracking-widest uppercase flex items-center gap-1.5 text-amber-300">
                      <Award className="w-4 h-4 text-amber-300" />
                      {lang === 'en' ? "SEMINAR ADMISSION PASS" : "بطاقة حضور ندوة معتمدة"}
                    </span>
                    <button 
                      onClick={() => setActiveRsvpWebinar(null)}
                      className="text-white/70 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="p-4 bg-slate-50 border rounded-xl space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang === 'en' ? "Academy Session Detail" : "تفصيل المحاضرة"}</p>
                      <h4 className="text-sm font-bold text-slate-850">
                        {lang === 'en' ? activeRsvpWebinar.title : activeRsvpWebinar.titleAr}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">By: {lang === 'en' ? activeRsvpWebinar.speaker : activeRsvpWebinar.speakerAr}</p>
                    </div>

                    {rsvpSuccess ? (
                      <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl text-xs font-bold text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                        <p>{rsvpSuccess}</p>
                        <p className="text-[10px] font-normal text-emerald-700">{lang === 'en' ? "Please screenshot this badge and present it at ingress." : "يرجى الاحتفاظ برمز البطاقة للمطالبة بدرجات الحضور للأبحاث."}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleRsvpSubmit} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Verify Student Name for Certificate" : "أكد اسمك الثلاثي لطباعة الشهادة ومتابعة التلقي"}</label>
                          <input 
                            type="text" 
                            required
                            value={rsvpName}
                            onChange={(e) => setRsvpName(e.target.value)}
                            placeholder="e.g. Abdullah Ahmad Al-Sabah"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow"
                        >
                          {lang === 'en' ? "Secure Seat & Issue Pass" : "تأكيد المقعد وإصدار التذكرة المعرفية"}
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Mock live streaming layout */}
            {activeLiveSession && (
              <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6" id="webinar-live-stream-box">
                {/* Visual Video Stream Placeholder */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex flex-col justify-between items-center p-4 border border-slate-800">
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      LIVE
                    </span>
                    
                    <span className="absolute top-4 right-4 bg-slate-850/80 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {lang === 'en' ? activeLiveSession.category : activeLiveSession.categoryAr}
                    </span>

                    {/* Stream Center graphics */}
                    <div className="flex flex-col items-center justify-center space-y-3 my-auto">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-lg animate-pulse">
                        <Video className="w-8 h-8 text-amber-400" />
                      </div>
                      <p className="text-xs font-bold text-white/90 text-center px-6">
                        {lang === 'en' ? "Streaming live from Scholar Circle Council" : "بث حي مباشر من مجلس الإسناد والتحقيق بمعهد نافع..."}
                      </p>
                      <p className="text-[10px] text-slate-400">{lang === 'en' ? "Professor Keynote Slides & Live Audio Link" : "شاهد العرض المرفق وأوراق البحث العلمي"}</p>
                    </div>

                    {/* Stream Bottom controls */}
                    <div className="w-full flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-white/95">{lang === 'en' ? activeLiveSession.speaker : activeLiveSession.speakerAr}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[9px] text-slate-400">{activeLiveSession.attendees + liveChats.length} listening</span>
                      </div>
                      <button 
                        onClick={() => setActiveLiveSession(null)}
                        className="px-3 py-1 bg-red-650 hover:bg-red-700 bg-red-600 text-white rounded-lg text-[10px] font-bold transition"
                      >
                        {lang === 'en' ? "Exit Session" : "مغادرة الجلسة"}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-xl space-y-1.5">
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'en' ? activeLiveSession.title : activeLiveSession.titleAr}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === 'en' ? activeLiveSession.desc : activeLiveSession.descAr}
                    </p>
                  </div>
                </div>

                {/* Stream Live Chatbox */}
                <div className="bg-slate-850 rounded-2xl border border-slate-700 flex flex-col h-[350px] lg:h-full justify-between overflow-hidden">
                  <div className="p-3.5 border-b border-slate-700/80 bg-slate-900/40 flex justify-between items-center">
                    <span className="text-xs font-bold text-teal-350 text-teal-400 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      {lang === 'en' ? "Interactive Chat Room" : "غرفة الأسئلة التفاعلية"}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">SECURE</span>
                  </div>

                  {/* Comments list */}
                  <div className="p-4 flex-grow overflow-y-auto space-y-3 font-sans text-xs scrollbar-none">
                    {liveChats.map((c, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="font-extrabold text-[#dcae82] text-[11px]">{c.author} <span className="text-[8px] text-slate-500 font-normal ml-1">{c.time}</span></p>
                        <p className="text-slate-350 text-slate-200 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chat input form */}
                  <form onSubmit={handleSendLiveChat} className="p-3 border-t border-slate-700 bg-slate-900/30 flex gap-2">
                    <input 
                      type="text" 
                      value={liveChatText}
                      onChange={(e) => setLiveChatText(e.target.value)}
                      placeholder={lang === 'en' ? "Ask scholars/respond to peer..." : "اكتب سؤالك مقتضباً هنا..."}
                      className="flex-grow bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button 
                      type="submit"
                      disabled={!liveChatText.trim()}
                      className="p-2 bg-amber-600 disabled:opacity-50 hover:bg-amber-700 text-white rounded-xl transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Webinars schedule list Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="webinars-schedule-grid">
              {webinars.map((web) => (
                <div 
                  key={web.id}
                  className="bg-white border border-slate-200 hover:border-emerald-600 hover:shadow-lg rounded-3xl p-5 transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-850 border border-emerald-100">
                        {lang === 'en' ? web.category : web.categoryAr}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-450 text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {web.time}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-[#2a1b14] leading-snug">
                        {lang === 'en' ? web.title : web.titleAr}
                      </h4>
                      <p className="text-xs text-slate-500 font-bold">{lang === 'en' ? "Presented by: " : "تحت إشراف: "} {lang === 'en' ? web.speaker : web.speakerAr}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {lang === 'en' ? web.desc : web.descAr}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{web.attendees} REGISTERED</span>
                    
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => { setActiveLiveSession(web); }}
                        className="px-3 py-1.5 bg-[#2a1b14] hover:bg-[#120a06] text-amber-200 text-[10px] rounded-lg font-bold flex items-center gap-1 transition"
                      >
                        <Play className="w-3 min-w-3 h-3" />
                        <span>Live</span>
                      </button>

                      <button 
                        onClick={() => { setActiveRsvpWebinar(web); }}
                        className="px-3 py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-700 text-[10px] rounded-lg font-bold transition"
                      >
                        {lang === 'en' ? "Book Pass" : "حجز مقعد"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: SCHOLAR COMMUNITIES */}
        {activeSubTab === 'communities' && (
          <motion.div
            key="scholar-communities"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Communities Categories bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-3xs max-w-5xl mx-auto">
              {communities.map((comm) => {
                const Icon = comm.icon;
                const isSelected = activeCommunity === comm.id;
                return (
                  <button
                    key={comm.id}
                    onClick={() => setActiveCommunity(comm.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer ${
                      isSelected 
                        ? 'bg-[#2a1b14] text-white' 
                        : 'text-slate-650 hover:bg-slate-50'
                    }`}
                    id={`community-filter-${comm.id}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{lang === 'en' ? comm.label : comm.labelAr}</span>
                  </button>
                );
              })}
            </div>

            {/* Support forum creation header */}
            <div className="bg-[#faf8f3] border-2 border-dashed border-amber-900/10 rounded-3xl p-6 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[#503020] text-xs font-black uppercase tracking-widest">{lang === 'en' ? "SCHOLARLY CIRCLE BOARDS" : "مجالس ومنتديات الفقه والأدب المقارن"}</span>
                <p className="text-xs text-slate-500 max-w-md">{lang === 'en' ? "Initiate discussion threads about classics, jurisprudence, or historical validations." : "أسس وصمم مواضيع نقاشات متخصصة لمراجعة المناهج والآثار."}</p>
              </div>
              <button 
                onClick={() => setShowCreateThreadForm(!showCreateThreadForm)}
                className="px-5 py-2.5 bg-amber-800 hover:bg-[#3a2010] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                id="btn-create-community-thread"
              >
                <Plus className="w-4 h-4 text-amber-200" />
                <span>{lang === 'en' ? "Create Discussion Thread" : "كتابة مسودة نقاش جديدة"}</span>
              </button>
            </div>

            {/* Create Thread Form */}
            {showCreateThreadForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleCreateThread}
                className="bg-white border rounded-3xl p-6 space-y-4 max-w-2xl mx-auto shadow-lg"
                id="form-create-thread"
              >
                <h3 className="text-sm font-bold text-slate-800 pb-2 border-b">
                  {lang === 'en' ? "Start an Academic Thread" : "خطط لمسألة فقهية أو أدبية للتدارس والتحقيق"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Thread Title / Thesis Question" : "عنوان الأطروحة أو التساؤل المنهجي"}</label>
                    <input 
                      type="text" 
                      required 
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                      className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs"
                      placeholder="e.g. Istihsan vs Analogical comparison"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Field Category" : "بوابة التصنيف العلمي"}</label>
                    <select
                      value={newThreadCategory}
                      onChange={(e) => setNewThreadCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl premium-dropdown shadow-md cursor-pointer outline-none focus:border-amber-600"
                    >
                      <option value="fiqh">Jurisprudence</option>
                      <option value="hadith">Hadith criticism</option>
                      <option value="aqeedah">Theology</option>
                      <option value="language">Arabic Rhetoric</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Detailed explanation / References consulted" : "التبيين وأوراق التأسيس أو المراجع"}</label>
                  <textarea 
                    required 
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs h-24 resize-none"
                    placeholder="Reference the Book name, volume, page number..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateThreadForm(false)} 
                    className="px-4 py-2 border rounded-xl text-xs"
                  >
                    {lang === 'en' ? "Cancel" : "إلفاء"}
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-bold"
                  >
                    {lang === 'en' ? "Publish Thread" : "نشر وإطلاق النقاش"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Active Threads Grid */}
            <div className="max-w-4xl mx-auto space-y-4" id="community-threads-list">
              {threads
                .filter(t => activeCommunity === 'all' || t.category === activeCommunity)
                .map((th) => (
                  <div 
                    key={th.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-650 hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                    onClick={() => setShowThreadModal(th)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-805">
                          #{th.categoryAr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {lang === 'en' ? "Started by" : "الكاتب:"} {th.author}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-800 hover:text-indigo-900 transition">
                        {lang === 'en' ? th.title : th.titleAr}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
                        {lang === 'en' ? th.content : th.contentAr}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                        {th.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        {th.replies}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Thread Details and Commenting Modal Drawer */}
            {showThreadModal && (
              <div className="fixed inset-0 bg-[#120a06]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" id="thread-details-modal">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white border rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]"
                >
                  {/* Modal Header */}
                  <div className="bg-[#2a1b14] p-5 text-white flex justify-between items-center border-b font-sans">
                    <div>
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">🗣️ {lang === 'en' ? "SCHOLARLY PEER EXCHANGE" : "حلقة البحث والسجال الأكاديمي"}</span>
                      <h3 className="text-sm font-bold truncate max-w-md mt-0.5">
                        {lang === 'en' ? showThreadModal.title : showThreadModal.titleAr}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setShowThreadModal(null)} 
                      className="text-white/70 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modal Scroll Content */}
                  <div className="p-6 overflow-y-auto space-y-6 flex-grow scrollbar-none">
                    <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold uppercase">#{showThreadModal.category}</span>
                        <span className="text-[10px] text-slate-400">By: {showThreadModal.author}</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-sans">
                        {lang === 'en' ? showThreadModal.content : showThreadModal.contentAr}
                      </p>
                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={() => {
                            // Update likes
                            setThreads(prev => prev.map(t => {
                              if (t.id === showThreadModal.id) {
                                const withLike = { ...t, likes: t.likes + 1 };
                                setShowThreadModal(withLike);
                                return withLike;
                              }
                              return t;
                            }));
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-800 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{showThreadModal.likes} Likes</span>
                        </button>
                      </div>
                    </div>

                    {/* Replies & comments section */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">💬 {lang === 'en' ? "Scholarly Responses" : "الردود والتعقيبات المنهجية"} ({showThreadModal.comments.length})</h4>
                      
                      {showThreadModal.comments.length === 0 ? (
                        <p className="text-xs text-slate-405 text-slate-400 italic text-center py-4">{lang === 'en' ? "No comments posted yet. Add the first critique!" : "لم تدرج أي ردود بعد. شارك وقوم الأطروحة."}</p>
                      ) : (
                        <div className="space-y-3">
                          {showThreadModal.comments.map((comm, idx) => (
                            <div key={idx} className="p-4 bg-white border border-slate-105 rounded-xl space-y-1 shadow-2xs">
                              <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <span className="font-extrabold text-slate-800">{comm.author}</span>
                                <span>{comm.time}</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-sans">{comm.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Response Form */}
                  <div className="p-4 bg-slate-50 border-t flex gap-2">
                    <input 
                      type="text" 
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder={lang === 'en' ? "Write your scholarly reference or evaluation..." : "أضف رداً أصولياً مدعماً بالمصنف..."}
                      className="flex-grow bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-650"
                    />
                    <button 
                      onClick={handleAddComment}
                      disabled={!newCommentText.trim()}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-850 disabled:opacity-50"
                    >
                      {lang === 'en' ? "Post Reply" : "نشر الرد"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* SUBTAB 4: STUDENT CIRCLE LOUNGE */}
        {activeSubTab === 'lounge' && (
          <motion.div
            key="student-lounge"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Frame: Live Chat Wall & Pomodoro Focus Timer */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Islamic Focus Study Timer */}
              <div className="bg-[#faf8f3] border-2 border-[#503020]/10 rounded-3xl p-6 shadow-sm" id="study-focus-timer">
                <div className="flex justify-between items-center pb-3 border-b border-[#503020]/10 mb-5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">{lang === 'en' ? "ISLAMIC FOCUS COMPASS" : "بوصلة التركيز والورد الأكاديمي"}</span>
                    <h3 className="text-sm font-bold text-slate-800">{lang === 'en' ? "Sacred Study Intervals" : "فترات التركيز الأصولي والتقييد"}</h3>
                  </div>
                  <Clock className="w-5 h-5 text-amber-800 animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Timer selection */}
                  <div className="space-y-2 flex flex-col">
                    <button 
                      type="button"
                      onClick={() => handleTimerPreset('pomodoro')}
                      className={`p-3 text-left rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        timerSelectedPreset === 'pomodoro' 
                          ? 'border-amber-800 bg-[#2a1b14] text-amber-100' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>⏱️ Standard Focus</span>
                      <span className="font-mono text-[10px] opacity-75">25:00</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleTimerPreset('deep')}
                      className={`p-3 text-left rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        timerSelectedPreset === 'deep' 
                          ? 'border-[#2a1b14] bg-[#2a1b14] text-amber-100' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>📖 Deep Study</span>
                      <span className="font-mono text-[10px] opacity-75">50:00</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleTimerPreset('fajr')}
                      className={`p-3 text-left rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        timerSelectedPreset === 'fajr' 
                          ? 'border-[#2a1b14] bg-[#2a1b14] text-amber-100' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>🌅 Fajr revision</span>
                      <span className="font-mono text-[10px] opacity-75">15:00</span>
                    </button>
                  </div>

                  {/* Circular visual and controls */}
                  <div className="text-center md:border-x md:px-6 space-y-4">
                    <div className="text-4xl md:text-5xl font-mono font-black text-slate-900 tracking-tight">
                      {formatTime(timerTimeLeft)}
                    </div>
                    
                    <div className="flex justify-center gap-3">
                      {timerActive ? (
                        <button 
                          onClick={pauseTimer}
                          className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition"
                        >
                          Pause
                        </button>
                      ) : (
                        <button 
                          onClick={startTimer}
                          className="px-4 py-2 bg-amber-800 hover:bg-[#341d0f] text-white rounded-xl text-xs font-bold transition"
                        >
                          Start Study
                        </button>
                      )}
                      
                      <button 
                        onClick={resetTimer}
                        className="p-2 border rounded-xl hover:bg-slate-50 transition"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* Audio bells and utilities config */}
                  <div className="p-4 bg-white rounded-2xl border space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Ambient completion sound" : "أجراس التنبيه والمقاطعة"}</p>
                    
                    <div className="space-y-1">
                      {['page', 'bell', 'silent'].map((s) => (
                        <button 
                          key={s}
                          type="button"
                          onClick={() => setTimerSound(s as any)}
                          className={`w-full p-2 rounded-lg text-[11px] font-bold text-left capitalize transition flex items-center gap-2 ${
                            timerSound === s 
                              ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5 text-slate-450" />
                          <span>{s} alert</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat room lounge wall feed */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs" id="lounge-disc-wall">
                <div className="flex justify-between items-center pb-3 border-b">
                  <div>
                    <h3 className="text-sm font-black text-[#2a1b14]">{lang === 'en' ? "Peer Study Discussion Wall" : "حائط حوار ومثاقفة الزملاء اليومي"}</h3>
                    <p className="text-[11px] text-slate-500">{lang === 'en' ? "Share quick tips, notes resources, study cards, and progress updates." : "شارك زملائك بملاحظات تدوين الدرس وعزز التنافس الشريف."}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border px-2 py-0.5 rounded-full">{labelsTrans.activeLabel}</span>
                </div>

                {/* Create lounge update */}
                <form onSubmit={handlePostToLounge} className="flex gap-2">
                  <input 
                    type="text" 
                    required
                    value={newLoungeText}
                    onChange={(e) => setNewLoungeText(e.target.value)}
                    placeholder={lang === 'en' ? "What page/concepts are you revising today?" : "ما الباب الذي تبحثه اليوم؟ شارك مع الزملاء..."}
                    className="flex-grow bg-slate-50 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-600 font-medium"
                    id="lounge-input-box"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Share
                  </button>
                </form>

                {/* Lounge updates list scrolling framework */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-none font-sans" id="lounge-posts-feed">
                  {loungePosts.map((post) => (
                    <div key={post.id} className="p-4 bg-slate-50/70 border rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-extrabold text-[#503020]/90">@{post.author}</span>
                        <span className="text-slate-450 text-slate-400 font-medium">{post.time}</span>
                      </div>
                      
                      <p className="text-xs text-slate-705 text-slate-700 leading-relaxed font-sans">{post.text}</p>
                      
                      {/* Interactive reactions */}
                      <div className="flex gap-2.5 pt-1">
                        {['👍', '💡', '📝', '☕'].map((emoji) => {
                          const count = post.reactions[emoji] || 0;
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleLoungeReaction(post.id, emoji)}
                              className="px-2 py-1 bg-white border border-slate-200/60 rounded-lg text-[10px] hover:border-amber-500 font-mono transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>{emoji}</span>
                              <span className="font-bold text-slate-550 text-slate-500">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Frame: Active Study Circles Organizer */}
            <div className="space-y-8">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs" id="lounge-study-circles-organizer">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="text-sm font-black text-[#2a1b14] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-700" />
                    {lang === 'en' ? "Peer Study Circles" : "حلقات لتدارس الأنداد"}
                  </h3>
                  <button 
                    onClick={() => setShowCircleForm(!showCircleForm)}
                    className="p-1 bg-indigo-50 hover:bg-indigo-100 rounded-md border text-indigo-800 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Study Circle Form */}
                {showCircleForm && (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateCircle}
                    className="bg-slate-50 p-4 border rounded-2xl space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Circle/Room Name" : "اسم الحلقة العلمية"}</label>
                      <input 
                        type="text" 
                        required
                        value={newCircleName}
                        placeholder="e.g. Hifdh Revision"
                        onChange={(e) => setNewCircleName(e.target.value)}
                        className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Current Study Topic" : "المتن أو الموضوع"}</label>
                      <input 
                        type="text" 
                        required
                        value={newCircleTopic}
                        placeholder="e.g. Surat Al-Imran Revision"
                        onChange={(e) => setNewCircleTopic(e.target.value)}
                        className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Timing" : "الميعاد"}</label>
                        <input 
                          type="text" 
                          required
                          value={newCircleTime}
                          placeholder="e.g. After Fajr"
                          onChange={(e) => setNewCircleTime(e.target.value)}
                          className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Seats Limit" : "أقصى مقاعد"}</label>
                        <input 
                          type="number" 
                          min={2}
                          max={15}
                          value={newCircleSeats}
                          onChange={(e) => setNewCircleSeats(Number(e.target.value))}
                          className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-2 bg-indigo-700 text-white rounded-xl text-xs font-bold hover:bg-indigo-850"
                    >
                      {lang === 'en' ? "Launch Circle" : "إطلاق الحلقة"}
                    </button>
                  </motion.form>
                )}

                {/* List study circles */}
                <div className="space-y-4 font-sans text-xs" id="lounge-study-circles-list">
                  {studyCircles.map((circle) => {
                    const isFull = circle.joined >= circle.maxSeats;
                    return (
                      <div key={circle.id} className="p-4 bg-slate-50/50 border border-slate-200/90 rounded-2xl space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-slate-900">{lang === 'en' ? circle.name : circle.nameAr}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">By: @{circle.host}</span>
                          </div>
                          <p className="text-slate-500 leading-normal text-[11px]">{lang === 'en' ? circle.topic : circle.topicAr}</p>
                          <p className="text-[10px] text-slate-400 font-bold">⏰ {circle.time}</p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-[#503020] bg-amber-50 px-2 py-0.5 rounded-full">
                            {circle.joined}/{circle.maxSeats} slots taken
                          </span>
                          
                          <button 
                            onClick={() => handleJoinCircle(circle.id)}
                            disabled={isFull}
                            className="px-3 py-1 bg-indigo-50 border border-indigo-200 hover:bg-indigo-150 text-indigo-805 rounded-xl transition text-[10px] font-bold disabled:opacity-50"
                          >
                            {isFull ? "Full" : labelsTrans.joinBtn}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shared Student library widget placeholder */}
              <div className="bg-[#faf8f3] border border-amber-900/10 rounded-3xl p-5 space-y-4" id="shared-student-library">
                <div className="space-y-1">
                  <span className="text-[#503020] text-[9px] font-black uppercase tracking-wider block">📚 STUDENT HUB SHARED NOTES</span>
                  <h4 className="text-xs font-bold text-slate-800">{lang === 'en' ? "Open Resource Repositories" : "مكتبة تقييد وسجلات الطلاب للمراجعة"}</h4>
                </div>
                
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-3 bg-white border border-amber-900/5 rounded-xl flex items-center justify-between shadow-2xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#503020]">Al-Ajurrumiyyah_Grammar_CheatSheet.pdf</p>
                      <p className="text-[9px] text-slate-450 text-slate-400">Shared by: @Yahya_A</p>
                    </div>
                    <FileText className="w-4 h-4 text-amber-800 shrink-0" />
                  </div>
                  <div className="p-3 bg-white border border-amber-900/5 rounded-xl flex items-center justify-between shadow-2xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#503020]">Hadith_Sciences_Transmission_Terminologies.pdf</p>
                      <p className="text-[9px] text-slate-450 text-slate-400">Shared by: @Dr_Sulaiman</p>
                    </div>
                    <FileText className="w-4 h-4 text-emerald-800 shrink-0" />
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
