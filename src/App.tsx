import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, Flame, Award, Sun, X, Mic, BookOpen, Users, ChevronRight, Star, Heart, 
  ArrowRight, Play, BarChart3, Activity, Headphones, Trophy, CheckCircle, 
  ShieldCheck, WifiOff, Globe2, Quote, ExternalLink, LayoutDashboard, MessageSquare, 
  ArrowLeft, LogOut, Lock, User, Send, ThumbsUp, Download, Volume2, Pause, Loader2, 
  PlusCircle, FolderOpen, Video, GraduationCap, RefreshCw, Sparkles, BookMarked,
  Search, PlayCircle, Eye, AlertCircle
} from 'lucide-react';
import { useMurajaah } from './hooks/useMurajaah';

const AppleIcon = () => (
  <svg viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5 md:w-6 h-6">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const PlayStoreIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5 md:w-6 h-6">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
  </svg>
);

const PhoneFrame = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative w-[280px] sm:w-[300px] md:w-[320px] h-[580px] md:h-[680px] bg-zinc-950 rounded-[2.5rem] md:rounded-[3.5rem] p-2 md:p-3 shadow-2xl border-4 border-zinc-800 ${className}`}>
    <div className="w-full h-full bg-white rounded-[2.2rem] md:rounded-[2.75rem] overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-4 md:h-6 bg-zinc-950 rounded-b-[1rem] md:rounded-b-[1.5rem] z-30 mx-14 md:mx-16" />
      {children}
    </div>
  </div>
);

const TypewriterText = ({ text, className = "" }: { text: string, className?: string }) => {
  const characters = Array.from(text);
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.02 } },
        hidden: {}
      }}
      className={className}
    >
      {characters.map((char, index) => (
         <motion.span
           key={index}
           variants={{
             hidden: { opacity: 0, y: 5 },
             visible: { opacity: 1, y: 0 }
           }}
         >
           {char}
         </motion.span>
      ))}
    </motion.span>
  );
};

// Comprehensive Dataset for the Fully Functional Web App Version
const SURAHS_DATA = [
  { id: 1, name: "Al-Fatihah", ar: "الفاتحة", verses: 7, juz: 1, translation: "The Opening", type: "Meccan", audioUrl: "https://download.quranicaudio.com/quran/mishari_rashid_alafasy/001.mp3",
    ayahs: [
      { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", trans: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", trans: "All praise is due to Allah, Lord of the worlds -" },
      { text: "الرَّحْمَٰنِ الرَّحِيمِ", trans: "The Entirely Merciful, the Especially Merciful," },
      { text: "مَالِكِ يَوْمِ الدِّينِ", trans: "Sovereign of the Day of Recompense." },
      { text: "إِيَّاكُ نَعْبُدُ وَإِيَّاكُ نَسْتَعِينُ", trans: "It is You we worship and You we ask for help." },
      { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", trans: "Guide us to the straight path -" },
      { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", trans: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
    ]
  },
  { id: 94, name: "Ash-Sharh", ar: "الشرح", verses: 8, juz: 30, translation: "The Relief", type: "Meccan", audioUrl: "https://download.quranicaudio.com/quran/mishari_rashid_alafasy/094.mp3",
    ayahs: [
      { text: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", trans: "Did We not expand for you, [O Muhammad], your breast?" },
      { text: "وَوَضَعْنَا عَنكَ وِزْرَكَ", trans: "And We removed from you your burden" },
      { text: "الَّذِي أَنقَضَ ظَهْرَكَ", trans: "Which weighed upon your back" },
      { text: "وَرَفَعْنَا لَكَ ذِكْرَكَ", trans: "And raised high for you your repute." },
      { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", trans: "For indeed, with hardship [will be] ease." },
      { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans: "Indeed, with hardship [will be] ease." },
      { text: "فَإِذَا فَرَغْتَ فَانصَبْ", trans: "So when you have finished [your duties], labor [in worship]." },
      { text: "وَإِلَىٰ رَبِّكَ فَارْغَب", trans: "And to your Lord direct [your] longing." }
    ]
  },
  { id: 67, name: "Al-Mulk", ar: "الملك", verses: 30, juz: 29, translation: "The Sovereignty", type: "Meccan", audioUrl: "https://download.quranicaudio.com/quran/mishari_rashid_alafasy/067.mp3",
    ayahs: [
      { text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", trans: "Blessed is He in whose hand is dominion, and He is over all things competent -" },
      { text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ", trans: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -" },
      { text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَّا تَرَىٰ فِي خَلَقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", trans: "[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision; do you see any rifts?" },
      { text: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", trans: "Then return your vision twice again. [Your] vision will return to you humbled while it is fatigued." },
      { text: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", trans: "And We have certainly beautified the nearest heaven with lamps and have made them throwing stones for the devils and have prepared for them the punishment of the Blaze." }
    ]
  },
  { id: 18, name: "Al-Kahf", ar: "الكهف", verses: 110, juz: 15, translation: "The Cave", type: "Meccan", audioUrl: "https://download.quranicaudio.com/quran/mishari_rashid_alafasy/018.mp3",
    ayahs: [
      { text: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا", trans: "All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance." },
      { text: "قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا", trans: "[He has made it] straight to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward," },
      { text: "مَّاكِثِينَ فِيهِ أَبَدًا", trans: "In which they will remain forever" },
      { text: "وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا", trans: "And to warn those who say, 'Allah has taken a son.'" }
    ]
  },
  { id: 36, name: "Ya-Sin", ar: "يس", verses: 83, juz: 22, translation: "Ya Sin", type: "Meccan", audioUrl: "https://download.quranicaudio.com/quran/mishari_rashid_alafasy/036.mp3",
    ayahs: [
      { text: "يس", trans: "Ya, Seen." },
      { text: "وَالْقُرْآنِ الْحَكِيمِ", trans: "By the wise Quran," },
      { text: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", trans: "Indeed you, [O Muhammad], are from among the messengers," },
      { text: "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", trans: "On a straight path." }
    ]
  }
];

export default function App() {
  // Navigation & View Toggles
  const [mode, setMode] = useState<'landing' | 'app'>('landing');
  const [appTab, setAppTab] = useState<'dashboard' | 'murajah' | 'quran' | 'community'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Authentication states
  const [user, setUser] = useState<any | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Quran state
  const [activePlayingSurah, setActivePlayingSurah] = useState<number | null>(null);
  const [quranIsPlaying, setQuranIsPlaying] = useState(false);
  const [activeReadingSurah, setActiveReadingSurah] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Voice Notes & Muraja'ah simulation states
  const murajaah = useMurajaah();
  const [simulatedStatus, setSimulatedStatus] = useState<string>('Ready for recitation');
  const [selectedJuz, setSelectedJuz] = useState<number>(30);
  const [simulationActive, setSimulationActive] = useState(false);

  // Community State (Forums & Resource sharing)
  const [forumCategory, setForumCategory] = useState<string>('all');
  const [forumThreads, setForumThreads] = useState<any[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [activeThread, setActiveThread] = useState<any | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('recitation');
  const [newReplyBody, setNewReplyBody] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Drag-and-drop Resource Upload State
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([
    { name: "Tajweed_Rules_CheatSheet.pdf", size: "1.4 MB", author: "Sheikh Yusuf", date: "Jul 10, 2026", downloads: 42 },
    { name: "Surah_AlMulk_Recitation_Check.mp3", size: "8.2 MB", author: "Student Suleiman", date: "Jul 12, 2026", downloads: 15 },
    { name: "Makharij_Vowel_Positions.png", size: "640 KB", author: "Dr. Fatimah", date: "Jul 14, 2026", downloads: 58 }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Auto-fetch profile session and forum boards on mount
  useEffect(() => {
    fetchSession();
    fetchForumThreads();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.warn("Session check failed, operating in guest sandbox.");
    }
  };

  const fetchForumThreads = async () => {
    setLoadingThreads(true);
    try {
      const res = await fetch('/api/forum/threads');
      const data = await res.json();
      if (data && data.threads) {
        setForumThreads(data.threads);
      }
    } catch (e) {
      console.warn("Could not fetch forum threads.");
    } finally {
      setLoadingThreads(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const endpoint = showAuthModal === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const payload = showAuthModal === 'login' 
      ? { email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword, name: authName, role: authRole };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setShowAuthModal(null);
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
      } else {
        setAuthError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setAuthError('Network error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    setAppTab('dashboard');
  };

  // Custom audio playback methods
  const playSurahAudio = (surahId: number) => {
    const selected = SURAHS_DATA.find(s => s.id === surahId);
    if (!selected) return;

    if (activePlayingSurah === surahId) {
      if (quranIsPlaying) {
        audioRef.current?.pause();
        setQuranIsPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {});
        setQuranIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActivePlayingSurah(surahId);
      setQuranIsPlaying(true);
      
      const audio = new Audio(selected.audioUrl);
      audioRef.current = audio;
      audio.play().catch(() => {});
      
      audio.addEventListener('ended', () => {
        setQuranIsPlaying(false);
        setActivePlayingSurah(null);
      });
    }
  };

  // Drag and Drop File Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadResource(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadResource(e.target.files[0]);
    }
  };

  const uploadResource = (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles((prevFiles) => [
            {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              author: user ? user.username : "Guest Student",
              date: "Today",
              downloads: 0
            },
            ...prevFiles
          ]);
          return 0;
        }
        return prev + 30;
      });
    }, 400);
  };

  // Recitation Simulator Helpers
  const startSimulationSession = async () => {
    setSimulationActive(true);
    setSimulatedStatus('Loading Surah Verses...');
    await murajaah.loadSession(selectedJuz);
    setSimulatedStatus('AI Listening: Recite Surah Al-Fatihah, Verse 1');
    murajaah.start();
  };

  const triggerSimulationEvent = (type: 'perfect' | 'hesitation' | 'mistake' | 'double_mistake') => {
    if (!simulationActive) return;
    
    if (type === 'perfect') {
      setSimulatedStatus('Perfect Recitation! "Alhamdu lillahi rabbil alamin" recognized with 98% accuracy.');
      murajaah.resume();
    } else if (type === 'hesitation') {
      setSimulatedStatus('AI Intervention: Long pause detected. "Please continue reciting..."');
    } else if (type === 'mistake') {
      setSimulatedStatus('Correction: Sheikh Yusuf says: "Careful with the letter Sad (ص) in Sirat. Please repeat."');
    } else if (type === 'double_mistake') {
      setSimulatedStatus('Academic Guidance: Sheikh Yusuf provides pronunciation check for "Al-Maghdoob".');
    }
  };

  // Forum Action Handlers
  const handleLikeThread = async (id: string) => {
    if (!user) {
      setShowAuthModal('login');
      return;
    }
    try {
      const res = await fetch(`/api/forum/threads/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setForumThreads(forumThreads.map(t => t.id === id ? data.thread : t));
        if (activeThread && activeThread.id === id) {
          setActiveThread(data.thread);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal('login');
      return;
    }
    if (!newThreadTitle.trim() || !newThreadBody.trim()) return;

    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newThreadTitle,
          body: newThreadBody,
          category: newThreadCategory
        })
      });
      if (res.ok) {
        const data = await res.json();
        setForumThreads([data.thread, ...forumThreads]);
        setNewThreadTitle('');
        setNewThreadBody('');
        setShowNewThreadModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal('login');
      return;
    }
    if (!newReplyBody.trim() || !activeThread) return;

    try {
      const res = await fetch(`/api/forum/threads/${activeThread.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newReplyBody })
      });
      if (res.ok) {
        const data = await res.json();
        setForumThreads(forumThreads.map(t => t.id === activeThread.id ? data.thread : t));
        setActiveThread(data.thread);
        setNewReplyBody('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredThreads = forumThreads.filter(t => {
    const matchesCategory = forumCategory === 'all' || t.category === forumCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqs = [
    { q: "Is Ilm Nafi completely free?", a: "The core Quran reading and listening features are completely free. We offer premium features for advanced Virtual Murāja'ah analytics." },
    { q: "Does speech recognition require internet?", a: "Yes, currently our AI models require an active internet connection to process Arabic pronunciation accurately." },
    { q: "Can I use it on multiple devices?", a: "Yes! Create an account and your progress, bookmarks, and community circles will sync across all your iOS and Android devices." },
    { q: "How do I join a study circle?", a: "Navigate to the Community tab in the app, where you can discover public circles or join private ones using an invite code." }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-zinc-900 selection:bg-teal-200 overflow-x-hidden">
      
      {/* LANDING PAGE MODE */}
      {mode === 'landing' && (
        <>
          {/* Floating Navbar */}
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-6 pointer-events-none">
            <motion.header 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-6xl transition-all duration-500 rounded-full bg-white/95 backdrop-blur-xl shadow-lg shadow-zinc-200/50 border border-zinc-200/50 py-3 px-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-lg text-white">📖</span>
                  </div>
                  <span className="text-lg font-display font-bold tracking-tight text-zinc-900">Ilm Naafi</span>
                </div>
                
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                  <a href="#features" className="text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">Features</a>
                  <a href="#phones-showcase" className="text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">Interface</a>
                  <a href="#gamification" className="text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">Streaks</a>
                  <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">
                    <span>Quran.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => { setMode('app'); setAppTab('dashboard'); }} 
                    className="flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    <span>Use Web Version</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a href="#download" className="px-5 py-2 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-teal-600 transition-all shadow-md">
                    Download Now
                  </a>
                </nav>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setMode('app'); setAppTab('dashboard'); }}
                    className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-3.5 py-2 rounded-full hover:bg-teal-100 transition-all"
                  >
                    Use Web Version
                  </button>
                  <button 
                    className="md:hidden p-2 text-zinc-600 bg-zinc-100 rounded-full"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.header>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed inset-x-4 top-4 z-[60] bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 p-6 flex flex-col gap-6 md:hidden overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-xl text-white">📖</span>
                    </div>
                    <span className="text-xl font-display font-bold">Ilm Naafi</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-600">
                    <X />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Features</a>
                  <a href="#phones-showcase" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Interface Showcase</a>
                  <a href="#gamification" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Daily Streaks</a>
                  <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Quran.com <ExternalLink className="w-5 h-5 text-zinc-400" /></a>
                  <button 
                    onClick={() => { setMode('app'); setAppTab('dashboard'); setMobileMenuOpen(false); }} 
                    className="flex items-center gap-2 text-xl font-display font-bold text-teal-600 p-2 hover:bg-teal-50 rounded-2xl text-left"
                  >
                    <span>Use Web Version</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 pt-6 border-t border-zinc-100">
                  <a href="#download" onClick={() => setMobileMenuOpen(false)} className="flex justify-center py-4 bg-teal-600 text-white text-lg font-bold rounded-2xl">
                    Download the App
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          )}

          {/* Hero Section */}
          <section className="relative pt-36 md:pt-48 pb-20 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-teal-50/50 to-transparent -z-10" />
            
            <div className="max-w-7xl mx-auto text-center relative z-10 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm text-teal-700 text-sm font-semibold mb-8"
              >
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-duration-1000"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                Available on iOS, Android & Web
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-8xl lg:text-[7.5rem] font-display font-extrabold tracking-tight mb-8 text-zinc-900 leading-[1.05]"
              >
                <TypewriterText text="The pocket-sized" /> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Islamic academy.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl text-zinc-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Master your Quranic recitation with real-time AI, join globally connected study circles, and organize your daily spiritual goals—all from a single, polished platform.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto sm:max-w-none"
              >
                <button 
                  onClick={() => { setMode('app'); setAppTab('dashboard'); }} 
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-teal-600 text-white px-8 py-4.5 rounded-full text-lg font-bold hover:bg-teal-500 transition-all shadow-lg hover:shadow-teal-600/20 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <div>Launch Web Version</div>
                </button>
                <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-4.5 rounded-full text-lg font-bold hover:bg-zinc-800 transition-all hover:shadow-2xl hover:shadow-zinc-900/20 active:scale-95 group">
                  <AppleIcon />
                  <div className="text-left leading-tight">
                    <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Download for</div>
                    <div>Apple iOS</div>
                  </div>
                </a>
                <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-100 text-zinc-900 border border-zinc-200 px-8 py-4.5 rounded-full text-lg font-bold hover:bg-zinc-200 transition-all active:scale-95">
                  <PlayStoreIcon />
                  <div className="text-left leading-tight">
                    <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Get it on</div>
                    <div>Google Play</div>
                  </div>
                </a>
              </motion.div>
            </div>

            {/* REDESIGNED: COMPACT, OVERLAPPING SMARTPHONE SHOWCASE */}
            <div id="phones-showcase" className="mt-20 md:mt-32 max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-teal-600 font-bold uppercase tracking-wider text-xs">Dynamic UI Preview</span>
                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-zinc-900 mt-2">Beautiful, high-contrast workspace.</h2>
              </div>

              {/* Handheld mockup grid with tighter padding & beautiful layout */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 lg:gap-8 perspective-1000">
                
                {/* Phone 1: Virtual Mushaf Page */}
                <motion.div 
                  initial={{ opacity: 0, x: -30, rotateY: -10 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: -5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="shadow-xl"
                >
                  <PhoneFrame>
                    <div className="absolute inset-0 bg-zinc-50 pt-10 md:pt-12 px-4 flex flex-col justify-between h-full">
                      <div className="border-b border-zinc-200 pb-2 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Surah</p>
                          <h4 className="text-xs font-bold text-zinc-800 font-display">Al-Kahf (Cave)</h4>
                        </div>
                        <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Juz 15</span>
                      </div>

                      {/* Islamic Content Text */}
                      <div className="my-auto py-4 text-center">
                        <p className="text-right font-arabic text-2xl md:text-3xl text-zinc-950 leading-relaxed mb-4">
                          ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ
                        </p>
                        <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 text-left shadow-sm">
                          <p className="text-[11px] text-zinc-600 leading-relaxed">
                            "All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance."
                          </p>
                        </div>
                      </div>

                      {/* Compact Qari Player Controls */}
                      <div className="border-t border-zinc-200 pt-3 pb-6 space-y-3">
                        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                          <span>0:45</span>
                          <div className="flex-1 mx-3 h-1 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="w-[45%] h-full bg-teal-600" />
                          </div>
                          <span>4:12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-zinc-700">Maher Al-Muaiqly</span>
                          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </PhoneFrame>
                </motion.div>

                {/* Phone 2: AI Recitation Coach (Active Listening) */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="shadow-2xl z-20 scale-100 md:scale-105"
                >
                  <PhoneFrame className="border-zinc-300">
                    <div className="absolute inset-0 bg-white pt-10 md:pt-12 px-4 flex flex-col justify-between h-full">
                      <div className="text-center pt-2">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2 border border-red-100">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                        </div>
                        <h4 className="text-xs font-bold text-zinc-800">Live AI Recitation Analysis</h4>
                        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Listening...</p>
                      </div>

                      {/* Recitation Visual feedback */}
                      <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 my-3 text-center space-y-3">
                        <p className="text-right font-arabic text-xl text-teal-700 font-semibold leading-relaxed">
                          الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
                        </p>
                        <p className="text-[10px] text-zinc-400 italic">"Voice matches standard Hafs recitation patterns."</p>
                        <div className="flex justify-center gap-1">
                          {[5, 10, 8, 3, 7, 9, 4, 8, 12, 6, 9].map((h, i) => (
                            <div key={i} className="w-1 bg-teal-500 rounded-full" style={{ height: `${h * 1.5}px` }} />
                          ))}
                        </div>
                      </div>

                      {/* Feedback Prompt */}
                      <div className="bg-teal-900 text-white p-3 rounded-2xl mb-6 shadow-md text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Perfect Pronunciation</span>
                        </div>
                        <p className="text-[10px] text-teal-100 leading-tight">Excellent! Transition between 'H' and 'M' was smooth and authentic.</p>
                      </div>
                    </div>
                  </PhoneFrame>
                </motion.div>

                {/* Phone 3: Global Study Groups */}
                <motion.div 
                  initial={{ opacity: 0, x: 30, rotateY: 10 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="shadow-xl"
                >
                  <PhoneFrame>
                    <div className="absolute inset-0 bg-zinc-50 pt-10 md:pt-12 px-4 flex flex-col justify-between h-full">
                      <div className="border-b border-zinc-200 pb-2 flex justify-between items-center">
                        <h4 className="text-xs font-bold text-zinc-800 font-display">Study Circles</h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">12 Active</span>
                      </div>

                      {/* Study Circles list */}
                      <div className="space-y-3 my-auto py-2">
                        <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-xs text-left">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[10px] text-teal-700 font-bold">HQ</div>
                            <div>
                              <h5 className="text-[11px] font-bold text-zinc-800">Hifz Qur'an Circle</h5>
                              <p className="text-[9px] text-zinc-400">Moderated by Sheikh Yusuf</p>
                            </div>
                          </div>
                          <div className="bg-zinc-50 p-2 rounded-lg text-[10px] text-zinc-600 border border-zinc-100">
                            💬 Sister Sarah just uploaded a study guide PDF.
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-xs text-left">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] text-amber-700 font-bold">TM</div>
                            <div>
                              <h5 className="text-[11px] font-bold text-zinc-800">Tajweed Masterclass</h5>
                              <p className="text-[9px] text-zinc-400">Daily Recitation</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-bold text-emerald-700 bg-emerald-50 p-1 px-2 rounded-md">
                            <span>● LIVE STUDYING NOW</span>
                            <span>42 Students</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer area */}
                      <div className="pb-6 pt-2 text-center">
                        <p className="text-[10px] text-zinc-400">Join hifz circles globally in one click</p>
                      </div>
                    </div>
                  </PhoneFrame>
                </motion.div>

              </div>
            </div>
          </section>

          {/* Curved Stats Section */}
          <section className="relative z-40 -mt-8 md:-mt-16 px-4">
            <div className="bg-teal-900 text-white rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-6xl mx-auto py-12 px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="relative z-10">
                <div className="text-3xl md:text-5xl font-display font-extrabold text-teal-300 mb-1">50K+</div>
                <div className="text-[11px] md:text-xs font-bold text-teal-100/80 uppercase tracking-wider">Active Users</div>
              </div>
              <div className="relative z-10">
                <div className="text-3xl md:text-5xl font-display font-extrabold text-teal-300 mb-1">1M+</div>
                <div className="text-[11px] md:text-xs font-bold text-teal-100/80 uppercase tracking-wider">Ayahs Recited</div>
              </div>
              <div className="relative z-10">
                <div className="text-3xl md:text-5xl font-display font-extrabold text-teal-300 mb-1">4.9/5</div>
                <div className="text-[11px] md:text-xs font-bold text-teal-100/80 uppercase tracking-wider">App Store Rating</div>
              </div>
              <div className="relative z-10">
                <div className="text-3xl md:text-5xl font-display font-extrabold text-teal-300 mb-1">120+</div>
                <div className="text-[11px] md:text-xs font-bold text-teal-100/80 uppercase tracking-wider">Countries</div>
              </div>
            </div>
          </section>

          {/* GRID STYLE FEATURES ARRANGEMENT LIKE THE SURAHS */}
          <section id="features" className="py-24 px-6 bg-white border-b border-zinc-200">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-teal-600 font-bold uppercase tracking-wider text-xs block mb-2">Pristine Islamic Features</span>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-zinc-900">
                  <TypewriterText text="Complete Academic Workspace" />
                </h2>
                <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mt-4 leading-relaxed">
                  Everything you need to memorize the Quran, review lessons, and connect with global mentors in a single, high-contrast workspace.
                </p>
              </div>

              {/* Grid Layout: Responsive 2-column on mobile, styled like Surah listings */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { id: "01", title: "Public Study Groups", tag: "Join groups globally", desc: "Collaborate with peers, review lessons, and memorize together in shared circles.", icon: <Users className="w-5 h-5 text-teal-600 animate-pulse" />, bgColor: "bg-teal-50" },
                  { id: "02", title: "Resource Sharing", tag: "Docs, audio & notes", desc: "Share lecture transcripts, audio clips, and custom study sheets with direct feedback.", icon: <FolderOpen className="w-5 h-5 text-emerald-600" />, bgColor: "bg-emerald-50" },
                  { id: "03", title: "Leaderboards", tag: "Group milestones", desc: "Stay motivated with weekly streaks, points, badges, and shared peer achievements.", icon: <Trophy className="w-5 h-5 text-amber-600" />, bgColor: "bg-amber-50" },
                  { id: "04", title: "Voice Notes", tag: "Direct feedback", desc: "Record and submit your recitations for direct visual and audio pronunciation checks.", icon: <Mic className="w-5 h-5 text-rose-600" />, bgColor: "bg-rose-50" },
                  { id: "05", title: "Live Sessions", tag: "Real-time halaqas", desc: "Join streaming recitation circles led by certified scholars and educators.", icon: <Video className="w-5 h-5 text-indigo-600" />, bgColor: "bg-indigo-50" },
                  { id: "06", title: "Global Mentors", tag: "Find a teacher", desc: "Connect with certified Qaris for personalized one-on-one study paths.", icon: <GraduationCap className="w-5 h-5 text-teal-600" />, bgColor: "bg-teal-50" },
                ].map((f, i) => (
                  <div 
                    key={f.id}
                    className="bg-white p-4 md:p-6 rounded-2xl border border-zinc-200/80 hover:border-teal-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="flex items-center gap-3 mb-3 border-b border-zinc-100 pb-3 justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${f.bgColor} flex items-center justify-center shrink-0`}>
                          {f.icon}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-xs md:text-sm text-zinc-900 group-hover:text-teal-600 transition-colors">{f.title}</h4>
                          <p className="text-[10px] font-bold text-zinc-400">{f.tag}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-300 group-hover:text-teal-500 transition-colors font-mono">{f.id}</span>
                    </div>
                    <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed text-left">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Gamification Streak Section */}
          <section id="gamification" className="py-24 md:py-32 px-6 bg-zinc-50 border-b border-zinc-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse gap-16 items-center">
              <div className="flex-1 w-full">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 border border-amber-200">
                  <Trophy className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-zinc-900 mb-6 leading-tight">Turn learning into a habit.</h2>
                <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-8">Stay motivated with daily streaks, achievement badges, and milestone celebrations. Our gamified system makes consistent recitation engaging and rewarding.</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { title: "7 Day Streak", icon: <Flame className="w-5 h-5 text-orange-500" />, color: "from-orange-100 to-orange-50", borderColor: "border-orange-200" },
                     { title: "Juz Amma", icon: <Award className="w-5 h-5 text-amber-500" />, color: "from-amber-100 to-amber-50", borderColor: "border-amber-200" },
                     { title: "Early Bird", icon: <Sun className="w-5 h-5 text-blue-500" />, color: "from-blue-100 to-blue-50", borderColor: "border-blue-200" },
                     { title: "100 Ayahs", icon: <Star className="w-5 h-5 text-teal-500" />, color: "from-teal-100 to-teal-50", borderColor: "border-teal-200" }
                   ].map((b, i) => (
                     <div key={i} className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${b.color} border ${b.borderColor} flex items-center justify-center shrink-0`}>
                         {b.icon}
                       </div>
                       <span className="font-bold text-xs md:text-sm text-zinc-800">{b.title}</span>
                     </div>
                   ))}
                </div>
              </div>
              <div className="flex-1 w-full relative h-[380px] md:h-[450px]">
                {/* Detailed Analytics Chart */}
                <div className="absolute inset-0 bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-zinc-200 shadow-xl flex flex-col justify-end">
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-teal-600" />
                        <span className="font-bold text-sm text-zinc-900">Consistency Tracker</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">Weekly recitation minutes</p>
                    </div>
                    <div className="flex items-end justify-between gap-3 md:gap-4 h-48 md:h-56 mt-auto">
                      {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                        <div key={i} className="w-full relative group h-full flex flex-col justify-end">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {h} mins
                          </div>
                          <div className="w-full bg-teal-500 rounded-t-lg hover:bg-teal-400 transition-colors" style={{ height: `${h}%` }} />
                          <div className="text-center mt-2 text-xs text-zinc-400 font-medium">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Daily Reflection Section */}
          <section className="py-24 px-6 bg-white border-b border-zinc-200">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-teal-600 font-bold uppercase tracking-wider text-xs">Ayah of the Day</span>
                <h2 className="text-3xl font-display font-extrabold mt-2"><TypewriterText text="Daily Reflection" /></h2>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-50 p-8 md:p-12 rounded-[2rem] border border-zinc-200 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                <Quote className="w-10 h-10 text-teal-100 mb-6" />
                <div className="text-right font-arabic text-3xl md:text-4xl text-zinc-900 leading-[2.2] mb-6">
                  فَإِنَّ مَعَ الْعُسْرِ يُسْرًا 
                </div>
                <div className="text-base md:text-lg text-zinc-600 font-serif italic leading-relaxed mb-4">
                  "For indeed, with hardship [will be] ease."
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Surah Ash-Sharh (94:5)
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQs section */}
          <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-200">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-teal-600 font-bold uppercase tracking-wider text-xs">Answers</span>
                <h2 className="text-3xl font-display font-extrabold text-zinc-900 mt-2">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full p-5 text-left flex justify-between items-center font-bold text-sm md:text-base text-zinc-800 hover:text-teal-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`w-5 h-5 text-zinc-400 transition-transform ${activeFaq === index ? 'rotate-90 text-teal-600' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 text-xs md:text-sm text-zinc-500 border-t border-zinc-100 leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-white py-12 px-6 border-t border-zinc-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📖</span>
                </div>
                <span className="font-display font-extrabold text-lg text-zinc-900">Ilm Naafi</span>
              </div>
              
              <div className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                Made with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1" /> for the Ummah
              </div>
            </div>
          </footer>
        </>
      )}

      {/* FULLY FUNCTIONAL INTERACTIVE WEB PORTAL APP MODE */}
      {mode === 'app' && (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
          
          {/* Dashboard Left Sidebar for Desktop */}
          <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200 p-6 shrink-0 justify-between">
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">📖</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-zinc-900 tracking-tight leading-none">Ilm Naafi</h3>
                  <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Web Academy</span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
                  { id: 'murajah', label: "Virtual Murāja'ah", icon: <Mic className="w-4 h-4" /> },
                  { id: 'quran', label: 'Read & Listen', icon: <BookOpen className="w-4 h-4" /> },
                  { id: 'community', label: 'Community Hub', icon: <Users className="w-4 h-4" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAppTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      appTab === item.id 
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/15' 
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-4 border-t border-zinc-100 pt-4">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                      {user.username ? user.username[0] : 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-zinc-800 truncate leading-none">{user.username}</p>
                      <p className="text-[9px] text-zinc-400 truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal('login')} 
                  className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              <button 
                onClick={() => setMode('landing')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-zinc-200 text-zinc-500 rounded-xl text-xs font-bold hover:bg-zinc-50 hover:text-zinc-900 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back to Web</span>
              </button>
            </div>
          </aside>

          {/* Bottom Navigation for Mobile Devices */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-zinc-200 py-2 px-4 flex justify-around items-center z-50">
            {[
              { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
              { id: 'murajah', label: 'Coach', icon: <Mic className="w-5 h-5" /> },
              { id: 'quran', label: 'Quran', icon: <BookOpen className="w-5 h-5" /> },
              { id: 'community', label: 'Circles', icon: <Users className="w-5 h-5" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setAppTab(item.id as any)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${
                  appTab === item.id ? 'text-teal-600' : 'text-zinc-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Main Workspace Content Area */}
          <main className="flex-1 flex flex-col min-h-0 pb-20 md:pb-0">
            {/* Top Workspace Header */}
            <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setMode('landing')} className="md:hidden p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-lg">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm md:text-base font-extrabold text-zinc-900 font-display">
                  {appTab === 'dashboard' && "Student Dashboard"}
                  {appTab === 'murajah' && "Virtual Recitation Murāja'ah Coach"}
                  {appTab === 'quran' && "Holy Quran Recitation Platform"}
                  {appTab === 'community' && "Academic Circle Hub"}
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Cloud Synchronized
                </span>
                
                {/* Mobile Logout / User Icon */}
                <div className="md:hidden">
                  {user ? (
                    <button onClick={handleLogout} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg bg-zinc-50">
                      <LogOut className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => setShowAuthModal('login')} className="p-1.5 text-zinc-600 hover:text-teal-600 rounded-lg bg-zinc-50">
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Active Workspace View Switcher */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <AnimatePresence mode="wait">
                
                {/* 1. STUDENT DASHBOARD VIEW */}
                {appTab === 'dashboard' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Welcome banner */}
                    <div className="bg-gradient-to-r from-teal-800 to-teal-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-teal-950/10 text-left">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-700/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                      <div className="relative z-10 max-w-xl">
                        <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Student Progress</span>
                        </div>
                        <h2 className="text-2xl md:text-3.5xl font-display font-black leading-tight">
                          Assalamu Alaykum, {user ? user.username : "Guest Scholar"}!
                        </h2>
                        <p className="text-teal-100/90 text-xs md:text-sm mt-3 leading-relaxed">
                          "Read! In the Name of your Lord, Who has created..." Welcome back to your learning space. Continue your memorization review using the AI coach below.
                        </p>
                        <div className="flex gap-3 mt-6">
                          <button 
                            onClick={() => setAppTab('murajah')} 
                            className="bg-white text-teal-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-50 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Mic className="w-3.5 h-3.5 text-teal-600" />
                            <span>Recite Now</span>
                          </button>
                          <button 
                            onClick={() => setAppTab('quran')} 
                            className="bg-teal-800/80 text-white border border-teal-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-800 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                            <span>Browse Surahs</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stats Panels Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                          <Flame className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active Streak</p>
                          <h4 className="text-xl font-display font-extrabold text-zinc-900 mt-0.5">7 Days</h4>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Study Minutes</p>
                          <h4 className="text-xl font-display font-extrabold text-zinc-900 mt-0.5">180 Mins</h4>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Badges Earned</p>
                          <h4 className="text-xl font-display font-extrabold text-zinc-900 mt-0.5">4 Unique</h4>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Circles Joined</p>
                          <h4 className="text-xl font-display font-extrabold text-zinc-900 mt-0.5">3 Active</h4>
                        </div>
                      </div>
                    </div>

                    {/* Chart & Reflection Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Consistent activity graph */}
                      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 lg:col-span-2 flex flex-col justify-between text-left">
                        <div>
                          <h4 className="font-display font-bold text-sm text-zinc-800">Recitation Activity Log</h4>
                          <p className="text-zinc-400 text-[11px] mt-0.5">Review your minutes spent practicing Tajweed</p>
                        </div>
                        <div className="flex items-end justify-between gap-4 h-48 mt-6">
                          {[30, 45, 20, 60, 40, 80, 55].map((h, i) => (
                            <div key={i} className="w-full relative group h-full flex flex-col justify-end">
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {h} mins
                              </div>
                              <div className="w-full bg-teal-600 rounded-t-lg hover:bg-teal-500 transition-colors" style={{ height: `${h}%` }} />
                              <div className="text-center mt-2 text-xs text-zinc-400 font-bold">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Daily reminder panel */}
                      <div className="bg-teal-900 text-white p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between text-left shadow-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800 rounded-full blur-2xl opacity-40" />
                        <div className="relative z-10">
                          <Quote className="w-8 h-8 text-teal-300 opacity-60 mb-4" />
                          <p className="text-right font-arabic text-xl leading-relaxed text-teal-50">
                            قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ
                          </p>
                          <p className="text-xs text-teal-100 italic mt-4 leading-relaxed">
                            "Say, 'Are those who know equal to those who do not know?'"
                          </p>
                        </div>
                        <span className="text-[9px] font-bold tracking-widest text-teal-300 mt-6 block uppercase">Surah Az-Zumar (39:9)</span>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 2. VIRTUAL MURAJA'AH COACH VIEW */}
                {appTab === 'murajah' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Setup & Simulator Column */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-6 text-left lg:col-span-1">
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-zinc-900">Virtual Qari Config</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Configure your recitation goals</p>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-600 block">Select Juz Target</label>
                        <select 
                          value={selectedJuz}
                          onChange={(e) => setSelectedJuz(Number(e.target.value))}
                          className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-bold focus:outline-none focus:border-teal-500 bg-white"
                        >
                          <option value={1}>Juz 1 (Al-Fatihah, Al-Baqarah)</option>
                          <option value={15}>Juz 15 (Al-Kahf)</option>
                          <option value={30}>Juz 30 (Amma - Ash-Sharh)</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        {simulationActive ? (
                          <button 
                            onClick={() => { setSimulationActive(false); murajaah.stop(); }}
                            className="w-full py-3 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-500 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                          >
                            <Pause className="w-4 h-4" />
                            <span>Stop Recitation Coach</span>
                          </button>
                        ) : (
                          <button 
                            onClick={startSimulationSession}
                            className="w-full py-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-teal-600/10 cursor-pointer"
                          >
                            <Play className="w-4 h-4" />
                            <span>Start Live Recitation Coach</span>
                          </button>
                        )}
                      </div>

                      {/* Recitation Simulator Controls */}
                      <div className="border-t border-zinc-150 pt-4 space-y-3">
                        <div>
                          <h5 className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">Recitation Simulator</h5>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Click actions below to test AI feedback when mic permissions are restricted in iframe sandboxes.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => triggerSimulationEvent('perfect')}
                            disabled={!simulationActive}
                            className="p-2 border border-zinc-200 hover:border-teal-500 rounded-lg text-[10px] font-bold text-zinc-700 hover:text-teal-600 disabled:opacity-50 text-center cursor-pointer"
                          >
                            Simulate Perfect
                          </button>
                          <button 
                            onClick={() => triggerSimulationEvent('hesitation')}
                            disabled={!simulationActive}
                            className="p-2 border border-zinc-200 hover:border-teal-500 rounded-lg text-[10px] font-bold text-zinc-700 hover:text-teal-600 disabled:opacity-50 text-center cursor-pointer"
                          >
                            Simulate Pause
                          </button>
                          <button 
                            onClick={() => triggerSimulationEvent('mistake')}
                            disabled={!simulationActive}
                            className="p-2 border border-zinc-200 hover:border-teal-500 rounded-lg text-[10px] font-bold text-zinc-700 hover:text-teal-600 disabled:opacity-50 text-center cursor-pointer"
                          >
                            Simulate Mistake
                          </button>
                          <button 
                            onClick={() => triggerSimulationEvent('double_mistake')}
                            disabled={!simulationActive}
                            className="p-2 border border-zinc-200 hover:border-teal-500 rounded-lg text-[10px] font-bold text-zinc-700 hover:text-teal-600 disabled:opacity-50 text-center cursor-pointer"
                          >
                            Pronunciation check
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Interaction Screen */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 lg:col-span-2 flex flex-col justify-between text-left space-y-6">
                      
                      {/* Active Verse Display */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                          <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-800 px-3 py-1 rounded-full">
                            Active Recitation
                          </span>
                          <span className="text-xs font-bold text-zinc-400 font-mono">
                            Juz {selectedJuz} target
                          </span>
                        </div>

                        {/* Centered Large Arab Scripture */}
                        <div className="py-12 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center px-6">
                          <p className="text-right font-arabic text-3xl md:text-4.5xl leading-loose text-zinc-950 font-bold max-w-xl text-center">
                            {selectedJuz === 1 && "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
                            {selectedJuz === 15 && "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ"}
                            {selectedJuz === 30 && "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ"}
                          </p>
                          <p className="text-zinc-500 text-xs text-center mt-6 max-w-md italic">
                            {selectedJuz === 1 && "In the name of Allah, the Entirely Merciful, the Especially Merciful."}
                            {selectedJuz === 15 && "All praise is due to Allah, who has sent down upon His Servant the Book."}
                            {selectedJuz === 30 && "Did We not expand for you, [O Muhammad], your breast?"}
                          </p>
                        </div>
                      </div>

                      {/* Coach Live Transcript Output */}
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Live Transcript & AI Feedback</h5>
                        <div className="bg-zinc-900 text-zinc-100 p-4.5 rounded-2xl font-mono text-xs leading-relaxed min-h-24 flex flex-col justify-between">
                          <p className="text-teal-400 font-semibold">{simulatedStatus}</p>
                          <div className="flex justify-between items-center mt-4 text-[10px] text-zinc-500 border-t border-zinc-800 pt-2.5">
                            <span>Status: {simulationActive ? "Active Session" : "Inactive"}</span>
                            <span>Engine: Browser Speech API (ar-SA)</span>
                          </div>
                        </div>
                      </div>

                      {/* Reciter Coach Guide Card */}
                      <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl flex gap-3 text-left">
                        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <h6 className="text-xs font-bold text-teal-900">Tajweed Coach Advice</h6>
                          <p className="text-[11px] text-teal-700 leading-relaxed mt-0.5">
                            Connect your microphone and recite clearly. The AI system evaluates vowel lengths, pauses, and articulation points automatically.
                          </p>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 3. READ & LISTEN QURAN PLAYBACK VIEW */}
                {appTab === 'quran' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Surahs Left Sidebar Column */}
                    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4 text-left h-fit lg:col-span-1">
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-zinc-900">Surah Directory</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">Listen to world-class Qaris with visual text follow</p>
                      </div>

                      <div className="space-y-1 overflow-y-auto max-h-[480px] pr-1">
                        {SURAHS_DATA.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => setActiveReadingSurah(s.id)}
                            className={`w-full p-3.5 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                              activeReadingSurah === s.id
                                ? 'bg-teal-50/80 border-teal-500 text-teal-950'
                                : 'bg-white border-zinc-200/60 hover:bg-zinc-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-700">
                                {s.id}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-zinc-900">{s.name}</h5>
                                <p className="text-[10px] text-zinc-400 font-medium">{s.verses} Verses • {s.type}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="font-arabic font-bold text-sm text-teal-800">{s.ar}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); playSurahAudio(s.id); }}
                                className="w-7 h-7 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm"
                              >
                                {activePlayingSurah === s.id && quranIsPlaying ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 ml-0.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Reading Workspace */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 lg:col-span-2 flex flex-col justify-between text-left space-y-6">
                      
                      {/* Active Reading Surah Header */}
                      <div className="border-b border-zinc-200 pb-4 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Currently Reading
                          </span>
                          <h3 className="text-xl font-display font-black text-zinc-900 mt-1">
                            {SURAHS_DATA.find(s => s.id === activeReadingSurah)?.name} ({SURAHS_DATA.find(s => s.id === activeReadingSurah)?.translation})
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="font-arabic font-extrabold text-2xl text-teal-800">
                            {SURAHS_DATA.find(s => s.id === activeReadingSurah)?.ar}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-bold mt-0.5">Mishary Rashid Alafasy Recitation</p>
                        </div>
                      </div>

                      {/* Scrollable Ayahs Script block */}
                      <div className="space-y-6 max-h-[440px] overflow-y-auto pr-2">
                        {SURAHS_DATA.find(s => s.id === activeReadingSurah)?.ayahs.map((ayah, i) => (
                          <div 
                            key={i} 
                            className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-3 relative group hover:bg-white hover:border-teal-400 transition-all duration-300"
                          >
                            <span className="absolute left-4 top-4 w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            
                            <p className="text-right font-arabic text-2xl md:text-3xl leading-loose text-zinc-900 font-bold pl-12 pr-4">
                              {ayah.text}
                            </p>
                            
                            <p className="text-xs text-zinc-500 leading-relaxed font-sans border-t border-zinc-200/50 pt-2 text-left pl-1 pr-4">
                              {ayah.trans}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Floating player status bar */}
                      {activePlayingSurah && (
                        <div className="bg-zinc-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl">
                          <div className="flex items-center gap-3">
                            <Headphones className="w-6 h-6 text-teal-400 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-teal-50">
                                Playing Recitation: {SURAHS_DATA.find(s => s.id === activePlayingSurah)?.name}
                              </p>
                              <p className="text-[9px] text-zinc-400 mt-0.5">Mishary Rashid Alafasy • Live Audio</p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => playSurahAudio(activePlayingSurah)}
                            className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white shrink-0 hover:bg-teal-500 transition-all cursor-pointer"
                          >
                            {quranIsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}

                {/* 4. COMMUNITY HUB / STUDY CIRCLES VIEW */}
                {appTab === 'community' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Top Forum Search & Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
                      <div className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3.5 py-2.5 w-full sm:max-w-md bg-zinc-50">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <input 
                          type="text" 
                          placeholder="Search discussion threads, questions..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent text-xs text-zinc-800 placeholder-zinc-400 w-full focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <select 
                          value={forumCategory}
                          onChange={(e) => setForumCategory(e.target.value)}
                          className="p-2.5 rounded-xl border border-zinc-200 text-xs font-bold bg-white focus:outline-none"
                        >
                          <option value="all">All Categories</option>
                          <option value="recitation">Tajweed & Makharij</option>
                          <option value="jurisprudence">Fiqh (Jurisprudence)</option>
                          <option value="history">Quranic History</option>
                          <option value="scholarships">Scholarships</option>
                        </select>

                        <button 
                          onClick={() => {
                            if (!user) {
                              setShowAuthModal('login');
                            } else {
                              setShowNewThreadModal(true);
                            }
                          }}
                          className="px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Ask Question</span>
                        </button>
                      </div>
                    </div>

                    {/* Shared Materials File Sharing Block */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 text-left space-y-4">
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-zinc-900">Shared Study Resources</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Drag-and-drop or select files to share notes, Tajweed sheets, and recordings with the community.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Drag and Drop Zone */}
                        <div 
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`lg:col-span-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                            dragActive ? 'border-teal-500 bg-teal-50/50' : 'border-zinc-200 bg-zinc-50/40 hover:bg-zinc-50'
                          }`}
                        >
                          <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            onChange={handleFileSelect} 
                          />
                          <label htmlFor="file-upload" className="cursor-pointer space-y-3 w-full">
                            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                              <FolderOpen className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-zinc-700">
                                {isUploading ? "Uploading..." : "Click to select or drag file"}
                              </p>
                              <p className="text-[10px] text-zinc-400 mt-1">PDF, MP3, PNG up to 15MB</p>
                            </div>
                            
                            {isUploading && (
                              <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-4 overflow-hidden max-w-xs mx-auto">
                                <div className="h-full bg-teal-600" style={{ width: `${uploadProgress}%` }} />
                              </div>
                            )}
                          </label>
                        </div>

                        {/* List of Shared Resources */}
                        <div className="lg:col-span-2 space-y-2 max-h-[220px] overflow-y-auto">
                          {uploadedFiles.map((file, i) => (
                            <div key={i} className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-500">
                                  <BookMarked className="w-4 h-4 text-teal-600" />
                                </div>
                                <div className="text-left">
                                  <h5 className="text-xs font-bold text-zinc-800">{file.name}</h5>
                                  <p className="text-[10px] text-zinc-400 font-medium">Size: {file.size} • Shared by {file.author}</p>
                                </div>
                              </div>
                              <button className="p-2 bg-white hover:bg-teal-50 border border-zinc-200 hover:border-teal-200 rounded-lg text-zinc-500 hover:text-teal-600 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>

                    {/* Split Forums Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                      
                      {/* Left: Threads Directory List */}
                      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4 lg:col-span-1 h-fit">
                        <div>
                          <h4 className="font-display font-extrabold text-sm text-zinc-900">Study Forums</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Interact with teachers and fellow student scholars</p>
                        </div>

                        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                          {loadingThreads ? (
                            <div className="text-center py-8">
                              <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
                              <p className="text-xs text-zinc-400 mt-2">Loading threads...</p>
                            </div>
                          ) : filteredThreads.length === 0 ? (
                            <div className="text-center py-8">
                              <AlertCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                              <p className="text-xs text-zinc-400">No threads found matching criteria.</p>
                            </div>
                          ) : (
                            filteredThreads.map((t) => (
                              <div
                                key={t.id}
                                onClick={() => setActiveThread(t)}
                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                  activeThread?.id === t.id
                                    ? 'bg-teal-50 border-teal-500 text-teal-950'
                                    : 'bg-white border-zinc-200 hover:bg-zinc-50'
                                }`}
                              >
                                <h5 className="text-xs font-extrabold text-zinc-900 line-clamp-1">{t.title}</h5>
                                <p className="text-[10px] text-zinc-400 mt-1 truncate">{t.body}</p>
                                <div className="flex justify-between items-center mt-3 text-[9px] font-bold text-zinc-400 border-t border-zinc-100 pt-2">
                                  <span>{t.author_name} ({t.author_role})</span>
                                  <span className="bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded-md uppercase font-mono">{t.category}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right: Selected Thread Details Workspace */}
                      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 lg:col-span-2 flex flex-col justify-between space-y-6">
                        {activeThread ? (
                          <>
                            {/* Thread Title Area */}
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                    {activeThread.author_name ? activeThread.author_name[0] : 'U'}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-zinc-800 leading-none">{activeThread.author_name}</h5>
                                    <p className="text-[9px] text-zinc-400 font-bold mt-0.5">{activeThread.author_role} • {new Date(activeThread.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full uppercase">
                                  {activeThread.category}
                                </span>
                              </div>

                              <div className="space-y-3">
                                <h3 className="text-base font-extrabold text-zinc-900">{activeThread.title}</h3>
                                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                                  {activeThread.body}
                                </p>
                              </div>

                              {/* Thumbs up like trigger */}
                              <div className="flex justify-end pt-2">
                                <button 
                                  onClick={() => handleLikeThread(activeThread.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-teal-50 border border-zinc-200 hover:border-teal-200 rounded-lg text-[11px] font-bold text-zinc-600 hover:text-teal-600 transition-colors cursor-pointer"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>{activeThread.thumbs_up} Support</span>
                                </button>
                              </div>
                            </div>

                            {/* Replies listing */}
                            <div className="space-y-3 border-t border-zinc-150 pt-4.5">
                              <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Replies ({activeThread.replies.length})</h5>
                              
                              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                                {activeThread.replies.length === 0 ? (
                                  <p className="text-xs text-zinc-400 italic py-4">No answers yet. Scholars can post feedback below.</p>
                                ) : (
                                  activeThread.replies.map((r: any) => (
                                    <div key={r.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-left">
                                      <div className="flex items-center gap-2 mb-1 border-b border-zinc-100 pb-1.5">
                                        <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-[9px] font-bold shrink-0">
                                          {r.author_name ? r.author_name[0] : 'S'}
                                        </div>
                                        <div>
                                          <h6 className="text-[10px] font-bold text-zinc-800 leading-none">{r.author_name}</h6>
                                          <span className="text-[8px] font-bold text-teal-600 tracking-wider uppercase">{r.author_role}</span>
                                        </div>
                                      </div>
                                      <p className="text-[11px] text-zinc-600 leading-relaxed pl-1">{r.body}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                            {/* Post reply editor */}
                            <form onSubmit={handlePostReply} className="flex gap-2.5 items-end pt-2 border-t border-zinc-100">
                              <div className="flex-1">
                                <textarea 
                                  placeholder="Write academic answer or feedback..." 
                                  value={newReplyBody}
                                  onChange={(e) => setNewReplyBody(e.target.value)}
                                  className="w-full p-3 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-teal-500 bg-zinc-50/50"
                                  rows={2}
                                />
                              </div>
                              <button 
                                type="submit" 
                                className="px-4.5 py-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500 transition-colors flex items-center gap-1.5 h-10 shrink-0 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Send</span>
                              </button>
                            </form>
                          </>
                        ) : (
                          <div className="my-auto py-12 text-center text-zinc-400 space-y-2">
                            <MessageSquare className="w-12 h-12 text-zinc-200 mx-auto" />
                            <h4 className="font-bold text-sm">Select discussion thread</h4>
                            <p className="text-xs">Browse discussion topics on the left or search categories.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </main>
        </div>
      )}

      {/* NEW QUESTION / THREAD CREATION MODAL */}
      <AnimatePresence>
        {showNewThreadModal && (
          <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 max-w-lg w-full p-6 text-left shadow-2xl relative"
            >
              <button 
                onClick={() => setShowNewThreadModal(false)}
                className="absolute top-4 right-4 p-1 bg-zinc-50 hover:bg-zinc-100 rounded-lg text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-display font-black text-base text-zinc-900 border-b border-zinc-100 pb-3 mb-4">Post Academic Question</h3>
              
              <form onSubmit={handlePostThread} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 block">Topic Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter short, descriptive title (e.g. Correct Makhraj of Baa)" 
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-teal-500 bg-zinc-50/50 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-600 block">Category Category</label>
                    <select 
                      value={newThreadCategory}
                      onChange={(e) => setNewThreadCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-bold bg-white focus:outline-none"
                    >
                      <option value="recitation">Tajweed & Makharij</option>
                      <option value="jurisprudence">Fiqh (Jurisprudence)</option>
                      <option value="history">Quranic History</option>
                      <option value="scholarships">Scholarships</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 block">Question / Description</label>
                  <textarea 
                    placeholder="Describe your query or research topic..." 
                    value={newThreadBody}
                    onChange={(e) => setNewThreadBody(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-teal-500 bg-zinc-50/50"
                    rows={4}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowNewThreadModal(false)}
                    className="px-4 py-2 border border-zinc-200 text-zinc-500 rounded-xl text-xs font-bold hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500 shadow-md cursor-pointer"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE SIGN IN / AUTHENTICATION DIALOG MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 max-w-sm w-full p-6 text-left shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAuthModal(null)}
                className="absolute top-4 right-4 p-1 bg-zinc-50 hover:bg-zinc-100 rounded-lg text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="font-display font-black text-lg text-zinc-900">
                  {showAuthModal === 'login' ? 'Sign In to Academy' : 'Join Ilm Naafi Academy'}
                </h3>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  {showAuthModal === 'login' ? 'Enter credentials to synchronize progress' : 'Register a free scholar account today'}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-[11px] font-bold border border-red-100 mb-4 text-left leading-relaxed">
                  ⚠️ {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {showAuthModal === 'signup' && (
                  <>
                    <div className="space-y-1 block">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Full Academic Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Suleiman Al-Hassan"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-teal-500 bg-zinc-50/50"
                      />
                    </div>
                    
                    <div className="space-y-1 block">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Academic Role</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setAuthRole('student')}
                          className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                            authRole === 'student' ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-white border-zinc-200 text-zinc-500'
                          }`}
                        >
                          Student Scholar
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthRole('teacher')}
                          className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                            authRole === 'teacher' ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-white border-zinc-200 text-zinc-500'
                          }`}
                        >
                          Faculty Qari
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1 block">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Scholar Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. student@ilmnaafi.org"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-teal-500 bg-zinc-50/50"
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Access PIN / Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Minimum 6 characters with letters & numbers"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-teal-500 bg-zinc-50/50"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full py-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500 transition-all shadow-md hover:shadow-teal-600/10 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>{showAuthModal === 'login' ? 'Secure Access Login' : 'Register Free Account'}</span>
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
                {showAuthModal === 'login' ? (
                  <p className="text-xs text-zinc-400">
                    New to the Academy?{' '}
                    <button onClick={() => { setShowAuthModal('signup'); setAuthError(''); }} className="text-teal-600 font-bold hover:underline cursor-pointer">
                      Register now
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400">
                    Already have a scholar account?{' '}
                    <button onClick={() => { setShowAuthModal('login'); setAuthError(''); }} className="text-teal-600 font-bold hover:underline cursor-pointer">
                      Sign In
                    </button>
                  </p>
                )}
                
                {/* Guest bypass */}
                <button 
                  onClick={() => { setShowAuthModal(null); setMode('app'); setAppTab('dashboard'); }}
                  className="mt-3.5 text-xs font-bold text-zinc-400 hover:text-zinc-600 block mx-auto cursor-pointer"
                >
                  Bypass with Guest Mode
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
