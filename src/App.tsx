/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Compass, 
  History, 
  Clock, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  User, 
  Bell, 
  LogIn, 
  LogOut, 
  Award, 
  BarChart, 
  Bookmark, 
  Mic, 
  School, 
  Settings,
  Globe, 
  BookMarked,
  Sparkles,
  HelpCircle,
  Users,
  Calendar,
  MessageSquare,
  BookmarkCheck,
  ChevronDown,
  Plus,
  ArrowUp,
  Activity,
  Home,
  Sliders,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  Lock,
  Terminal,
  ShieldAlert,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Square
} from 'lucide-react';

import CurriculumView from './components/CurriculumView';
import AICoachView from './components/AICoachView';
import QuranExplorer from './components/QuranExplorer';
import CommunityHubView from './components/CommunityHubView';
import { DailyView } from './components/DailyView';
import AuthPage from './components/AuthPage';
import { EncyclopediaView } from './components/EncyclopediaView';
import { DeenSuite } from './components/DeenSuite';
import StudentDashboard from './components/StudentDashboard';
import ScholarshipsView from './components/ScholarshipsView';
import SavedScholarshipsView from './components/SavedScholarshipsView';
import NotificationsView from './components/NotificationsView';
import SettingsView from './components/SettingsView';
import LegalDocsView from './components/LegalDocsView';
import ApiDocsView from './components/ApiDocsView';
import IssueTrackerView from './components/IssueTrackerView';
import { ForumView } from './components/ForumView';
import { dbService } from './lib/supabase';

import { UserProgress } from './types';

// Wisdom quotes database for dynamic landing page section
const WISDOM_QUOTES = [
  {
    ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    en: "Recite (Read), in the name of your Lord who created",
    source: "Surah Al-Alaq, Verse 1"
  },
  {
    ar: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    en: "And say: 'O my Lord! Increase me in knowledge.'",
    source: "Surah Ta-Ha, Verse 114"
  },
  {
    ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    en: "Indeed, with hardship [will be] ease.",
    source: "Surah Al-Sharh, Verse 6"
  },
  {
    ar: "مَن سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    en: "Whoever treads a path to acquire knowledge, Allah will facilitate for him a path to Paradise.",
    source: "Sahih Muslim"
  }
];

// Dynamic landing page Hero content variations that cycle on interaction/timer
const HERO_TEMPLATES = [
  {
    titleEn: "Beneficial Knowledge.",
    titleAr: "طلبُ العِلْمِ فَرِيضَةٌ",
    subtitleEn: "Discover a unified scholarly platform combining K-12 open-source Islamic curriculum, advanced AI recitation guidance, and a global scholarships database.",
    subtitleAr: "اكتشف منصة علمية موحدة تجمع بين المناهج الإسلامية مفتوحة المصدر، وتصحيح التلاوة بالذكاء الاصطناعي، وقاعدة بيانات المنح العالمية.",
    ctaStartEn: "AI Reciter Coach",
    ctaStartAr: "مصحح التلاوة الذكي",
    ctaCurriculumEn: "Explore Curriculum",
    ctaCurriculumAr: "تصفح المناهج"
  },
  {
    titleEn: "Read in the Name of your Lord.",
    titleAr: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    subtitleEn: "Refine your Tajweed and memorize classical texts with real-time audio alignment designed by traditional scholars and expert educators.",
    subtitleAr: "صقّل تجويدك واحفظ المتون التفصيلية مع تقييم صوتي فوري مصمم لتيسير طلب العلم وحفظ كتاب الله العزيز.",
    ctaStartEn: "Check Tajweed Now",
    ctaStartAr: "افحص تجويدك الآن",
    ctaCurriculumEn: "Study Classical Texts",
    ctaCurriculumAr: "دراسة المتون الأصيلة"
  },
  {
    titleEn: "An Inheritance of Prophets.",
    titleAr: "العُلَمَاءُ وَرَثَةُ الأَنْبِيَاءِ",
    subtitleEn: "Engage with live webinars, class forums, and a dedicated academic community keeping the pristine chains of classical Islamic traditions alive.",
    subtitleAr: "شارك في الحلقات المباشرة، والمنتديات الدراسية، والندوات العلمية لحفظ وبث التراث الشرعي الأصيل والتواصل السليم.",
    ctaStartEn: "Join Live Seminars",
    ctaStartAr: "حضور الحلقات الحية",
    ctaCurriculumEn: "Meet Our Faculty",
    ctaCurriculumAr: "أعضاء المجمع العلمي"
  },
  {
    titleEn: "And say: My Lord, increase me in knowledge.",
    titleAr: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    subtitleEn: "Access curated scholarship tracks, academic directories, and authentic open education resources completely free from barriers.",
    subtitleAr: "احصل على بوابات المنح الدراسية المنسقة، والمصادر الأكاديمية الأصيلة، ومسارات السلوك المعرفي بيسر وسهولة للجميع بالهوية الإسلامية.",
    ctaStartEn: "Discover Grants",
    ctaStartAr: "اكتشف المنح الدراسية",
    ctaCurriculumEn: "Browse Materials",
    ctaCurriculumAr: "تصفح الكتب والمذكرات"
  }
];

// Scientific Golden Age Timeline Database
const TIMELINE_DATA = [
  {
    century: "8th Century",
    arEpoch: "القرن الثاني الهجري - عصر التراجم",
    figure: "Caliph Harun Al-Rashid",
    arFigure: "الخليفة هارون الرشيد",
    title: "Beit Al-Hikma Baghdad Foundation",
    arTitle: "تأسيس بيت الحكمة وحركة الترجمة الكبرى",
    milestone: "Established a grand library that translated major Sanskrit, Persian, and Syriac computational books into Arabic, igniting a systematic scientific renaissance.",
    arMilestone: "أمر بترجمة المخطوطات الفلسفية والرياضية الهندية واليونانية إلى اللسان العربي، مما أرسى القواعد الأولى للعلوم المقارنة في بغداد وعموم المشرق."
  },
  {
    century: "9th Century",
    arEpoch: "القرن الثالث الهجري - عصر الجبر",
    figure: "Al-Khwarizmi",
    arFigure: "محمد بن موسى الخوارزمي",
    title: "The Birth of Algebra (Algorithms)",
    arTitle: "صياغة علم الجبر والمقابلة واللوغاريتمات",
    milestone: "Published the foundational treatise 'Kitab al-Jabr wa-l-Muqabala', inventing algebra as an independent branch and describing modern systemic algorithms.",
    arMilestone: "صنف كتابه الشهير 'الجبر والمقابلة' واشتق أولى الخوارزميات الحسابية المنهجية لحل المعادلات التربيعية، ليدخل اسمه لغات العالم بصفة الخوارزمي (Algorithm)."
  },
  {
    century: "11th Century",
    arEpoch: "القرن الخامس الهجري - عصر البصريات",
    figure: "Ibn Al-Haytham (Alhazen)",
    arFigure: "الحسن ابن الهيثم",
    title: "Experimental Method & Visual Optics",
    arTitle: "تأطير المنهج التجريبي وعلم المناظر البصري",
    milestone: "Authored 'Kitab al-Manazir', proving that vision relies on ambient light reflections arriving in the eye. Perfected the camera obscura, laying the framework of photography.",
    arMilestone: "صنف كتاب المناظر الرياضي مبطلاً نظريات اليونان، وأثبت كيف يسير الضوء في غرف مظلمة (القمرة) ليؤسس ركائز الفيزياء البصرية والمنهج العلمي التجريبي."
  },
  {
    century: "12th Century",
    arEpoch: "القرن السادس الهجري - عصر الهندسة",
    figure: "Al-Jazari",
    arFigure: "بديع الزمان الجزري",
    title: "Mechanical Automata & Engineering",
    arTitle: "الهندسة الميكانيكية وأولى الآلات المبرمجة",
    milestone: "Engineered segmented gears, crankshafts, and several water-raising machines. Described early programmable humanoid automatons and castles.",
    arMilestone: "ابتكر تروس القطاعات المسننة ومضخات السحب المزدوجة والمكابس الدوارة، وصمم أولى الساعات المائية الكهروميكانيكية والآلات ذاتية الحركة تاريخياً."
  }
];

// Active global scholar peer activity feed
const ACTIVE_CIRCLES = [
  {
    id: "medina",
    city: { en: "Medina", ar: "المدينة المنورة" },
    activeScholars: 247,
    topic: { en: "Verifying articulation of Tajweed letters", ar: "تحقيق صفات مخارج الحلق والصفير والهمس" },
    status: { en: "Live Circle", ar: "حلقة نشطة حالياً" }
  },
  {
    id: "cairo",
    city: { en: "Cairo (Al-Azhar)", ar: "القاهرة (جامع الأزهر)" },
    activeScholars: 412,
    topic: { en: "Hadith and Sanad chains auditing", ar: "دراسة مراتب ومصطلحات مسانيد الإسناد" },
    status: { en: "Halaqah Scheduled Today", ar: "تدارس مجالس الرواية اليوم" }
  },
  {
    id: "damascus",
    city: { en: "Damascus", ar: "دمشق القديمة" },
    activeScholars: 118,
    topic: { en: "Science manuscripts at Umayyad library", ar: "مراجعة مخطوطات الفلك والهندسة بالمستودع الأموي" },
    status: { en: "Awaiting Speaker", ar: "يقرأون المخطوطات الآن" }
  },
  {
    id: "jakarta",
    city: { en: "Jakarta", ar: "جاكرتا" },
    activeScholars: 320,
    topic: { en: "Completing IsDB higher-education application", ar: "شرح ملفات منح البنك الإسلامي للتنمية" },
    status: { en: "Group Discussion Live", ar: "مجموعة بحث تفاعلية" }
  },
  {
    id: "cordoba",
    city: { en: "Córdoba", ar: "قرطبة" },
    activeScholars: 84,
    topic: { en: "Translating Averroes logical physics texts", ar: "تراجم ومقارنات الفلسفة والطب الأندلسي العتيق" },
    status: { en: "Reading Room Live", ar: "غرفة قراءة مغلقة" }
  }
];

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQiblah(lat: number, lng: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LNG * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  
  const dLng = lambdaK - lambda;
  const y = Math.sin(dLng);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(dLng);
  
  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;
  return (bearingDeg + 360) % 360;
}

function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function App() {
  // Navigation active tab: 'home' | 'curriculum' | 'coach' | 'daily' | 'auth' | 'community' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'home' | 'curriculum' | 'coach' | 'quran' | 'encyclopedia' | 'daily' | 'auth' | 'community' | 'dashboard' | 'settings' | 'notifications' | 'privacy' | 'terms' | 'academic' | 'issue-tracker'>('home');
  const [lang, setLang] = useState<'ar' | 'en'>('ar'); // Default mainly Arabic content preference
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adhkarDrawerActive, setAdhkarDrawerActive] = useState<'tasbih' | 'prayers' | 'dua' | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [loadingQuoteIdx] = useState(() => Math.floor(Math.random() * WISDOM_QUOTES.length));
  
  // Hero Index for dynamic rotating headlines and CTA buttons
  const [heroIndex, setHeroIndex] = useState(() => Math.floor(Math.random() * HERO_TEMPLATES.length));

  // Auto-cycle the hero templates every 9 seconds when user is on home screen
  useEffect(() => {
    if (activeTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_TEMPLATES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const [globalAudio, setGlobalAudio] = useState<{
    isPlaying: boolean;
    surahName: string;
    surahNumber: number;
    ayahNumber: number;
    reciterName: string;
    playMode: string;
  } | null>(null);

  useEffect(() => {
    const updateHandler = () => {
      const state = (window as any).__nafiAudioState;
      if (state) {
        setGlobalAudio({
          isPlaying: state.isPlaying,
          surahName: state.surahName,
          surahNumber: state.surahNumber,
          ayahNumber: state.ayahNumber,
          reciterName: state.reciterName,
          playMode: state.playMode,
        });
      } else {
        setGlobalAudio(null);
      }
    };

    (window as any).__nafiAudioUpdate = updateHandler;
    updateHandler(); // Check initially

    const interval = setInterval(() => {
      const player = (window as any).__nafiAudioPlayer;
      const state = (window as any).__nafiAudioState;
      if (player && state) {
        const isPaused = player.paused;
        if (state.isPlaying === isPaused) {
          state.isPlaying = !isPaused;
          updateHandler();
        }
      }
    }, 1000);

    return () => {
      (window as any).__nafiAudioUpdate = undefined;
      clearInterval(interval);
    };
  }, [activeTab]);

  // URL Path synchronization logic (PushState / Popstate)
  useEffect(() => {
    // Synchronize initial URL path on mount
    const path = window.location.pathname.substring(1);
    const validTabs: any[] = ['home', 'curriculum', 'coach', 'quran', 'daily', 'auth', 'community', 'dashboard', 'settings', 'notifications', 'privacy', 'terms', 'academic', 'issue-tracker', 'forum'];
    
    // Check for reset_token
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset_token')) {
      setActiveTab('auth');
    } else if (path && validTabs.includes(path)) {
      setActiveTab(path as any);
    }

    // Popstate backward/forward navigation handler
    const handlePopState = () => {
      const uPath = window.location.pathname.substring(1);
      const targetTab = uPath || 'home';
      if (validTabs.includes(targetTab)) {
        setActiveTab(targetTab as any);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL history path when state changes (without full reload)
  useEffect(() => {
    const currentPath = window.location.pathname.substring(1);
    if (currentPath !== activeTab) {
      const designPath = activeTab === 'home' ? '/' : `/${activeTab}`;
      window.history.pushState(null, '', designPath);
    }
  }, [activeTab]);

  const handleMiniNext = () => {
    const state = (window as any).__nafiAudioState;
    if (state && state.onNext) state.onNext();
  };

  const handleMiniToggle = () => {
    const state = (window as any).__nafiAudioState;
    if (state && state.onTogglePlayPause) state.onTogglePlayPause();
  };

  const handleMiniStop = () => {
    const state = (window as any).__nafiAudioState;
    if (state && state.onStop) state.onStop();
    (window as any).__nafiAudioState = null;
    setGlobalAudio(null);
  };
  
  // Landing dynamics states
  const [landingQiblah, setLandingQiblah] = useState<number | null>(null);
  const [landingNextPrayer, setLandingNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [landingLocation, setLandingLocation] = useState<string>("Makkah");
  const [showLaunchLangGuide, setShowLaunchLangGuide] = useState(true);

  // Daily reminder index state
  const [wisdomIdx, setWisdomIdx] = useState(0);

  // FAQ open state
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);

  // peer interactive active selection
  const [selectedCircleId, setSelectedCircleId] = useState<string>("medina");

  // RSVP seats state
  const [rsvps, setRsvps] = useState<{[key: number]: number}>({ 0: 42, 1: 18, 2: 29 });
  const [userRsvped, setUserRsvped] = useState<{[key: number]: boolean}>({});

  // Dynamic Salah Reminder State & Salah Lesson State
  const [selectedSalah, setSelectedSalah] = useState<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'>('fajr');
  const [activeSalahLesson, setActiveSalahLesson] = useState<number>(0);

  // Scroll tracking and smooth-scroll navigation effects
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 6200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Hide language pointer dynamic launch guide after 12 seconds
    const timer = setTimeout(() => {
      setShowLaunchLangGuide(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const bearing = calculateQiblah(latitude, longitude);
          setLandingQiblah(bearing);
          
          try {
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
            if (res.ok) {
              const json = await res.json();
              const timings = json?.data?.timings;
              if (timings) {
                const now = new Date();
                const hrs = now.getHours();
                const mins = now.getMinutes();
                const currentMinTotal = hrs * 60 + mins;
                
                const prayerOrder = [
                  { name: 'Fajr', timeStr: timings.Fajr },
                  { name: 'Sunrise', timeStr: timings.Sunrise },
                  { name: 'Dhuhr', timeStr: timings.Dhuhr },
                  { name: 'Asr', timeStr: timings.Asr },
                  { name: 'Maghrib', timeStr: timings.Maghrib },
                  { name: 'Isha', timeStr: timings.Isha }
                ];
                
                let foundNext = prayerOrder[0];
                for (const pr of prayerOrder) {
                  const parts = pr.timeStr.split(':');
                  const prMinTotal = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
                  if (prMinTotal > currentMinTotal) {
                    foundNext = pr;
                    break;
                  }
                }
                setLandingNextPrayer({ name: foundNext.name, time: formatTo12Hour(foundNext.timeStr) });
                setLandingLocation(`${latitude.toFixed(1)}°, ${longitude.toFixed(1)}°`);
              }
            }
          } catch (err) {
            console.warn("Landing page prayer times dynamic fetch failed", err);
          }
        },
        (err) => {
          console.log("No dynamic location query for landing page default coords used", err);
        }
      );
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const RenderAuthGateway = ({ tabName }: { tabName: string }) => {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center font-sans" id="auth-gateway-container">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/20 text-[#A37B12] animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2 max-w-md">
            <span className="text-[10px] bg-amber-500/10 text-amber-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              {lang === 'en' ? "Identity Authentication Required" : "مطلوب تسجيل الدخول للاطلاع"}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? `Access Restricted for ${tabName}` : `طلب الحضور غير مصرح لـ ${tabName}`}
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed font-normal">
              {lang === 'en' 
                ? "This secure page requires Ilm Naafi scholar authentication credentials to load. Sign in to your verified account to access notifications, study progress, and personalization."
                : "تتطلب مراجعة هذه التفضيلات (الضبط واللقاءات التفاعلية والنبضات التعليمية) مواءمة بطاقة العضوية العلمية الخاصة بكم لتفادي ضياع الإنجاز والمسارات. يرجى تسجيل الدخول مجاناً."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs pt-2">
            <button
              onClick={() => setActiveTab('auth')}
              className="flex-grow bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-transform transform active:scale-95 shadow-sm min-h-[44px] cursor-pointer border-0"
              id="gateway-authenticate"
            >
              {lang === 'en' ? "Login / Sign Up" : "تسجيل الدخول / فتح حساب"}
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors border border-slate-200 min-h-[44px] cursor-pointer"
              id="gateway-return-home"
            >
              {lang === 'en' ? "Return Home" : "العودة للرئيسية"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Initialize progress state
  const [progress, setProgress] = useState<UserProgress>({
    weeklyMinutes: 0,
    lessonsCompleted: [], 
    savedScholarships: [], 
    recentRecitations: [],
    username: '',
    email: '',
    joinedForums: [],
    notifications: []
  });

  const [liveToast, setLiveToast] = useState<any>(null);
  const [practiceVerse, setPracticeVerse] = useState<any>(null);
  const [showDeenSuiteModal, setShowDeenSuiteModal] = useState(false);

  // Home Interactive Study Planner States & Helper
  const [activeTimelineEpoch, setActiveTimelineEpoch] = useState<number>(0);
  const [dailyCommitMinutes, setDailyCommitMinutes] = useState<number>(30);
  const [planFocus, setPlanFocus] = useState<'tajweed' | 'jurisprudence' | 'history' | 'scholarships'>('tajweed');

  const getPlannerResults = (minutes: number, focus: string) => {
    const weeklyLessons = Math.max(1, Math.round((minutes * 7) / 45));
    const audioMinutes = Math.round(minutes * 0.4 * 7);
    const completionWeeks = Math.max(4, Math.round(180 / minutes));
    
    let syllabusPoints: string[] = [];
    if (focus === 'tajweed') {
      syllabusPoints = lang === 'en' ? [
        "Makharij al-Huruf (Vocal Articulation Atlas)",
        "Sifat al-Huruf (Acoustic Attributes & Echo)",
        "Rules of Nun Sakinah & Tanween",
        "Interactive AI Waveform Feedback"
      ] : [
        "مخارج الحروف (أطلس التصحيح الصوتي)",
        "صفات الحروف (الهمس والجهر وقوة الحرف)",
        "أحكام النون الساكنة والتنوين والمدود",
        "التقييم اللحظي لمخارج اللسان"
      ];
    } else if (focus === 'jurisprudence') {
      syllabusPoints = lang === 'en' ? [
        "The Nine Conditions of Sacred Worship",
        "Essential Pillars (Arkan) vs. Obligations",
        "Prosternation of Forgetfulness (Sujud as-Sahw)",
        "Classical Comparative Texts Exploration"
      ] : [
        "شروط الصلاة التسعة المفروضة للقبول",
        "أركان الصلاة الـ 14 والواجبات المترتبة",
        "أحكام سجود السهو والأعذار المبيحة",
        "دراسة مقارنة للمتون الفقهية المعتمدة"
      ];
    } else if (focus === 'history') {
      syllabusPoints = lang === 'en' ? [
        "The House of Wisdom (Bayt al-Hikmah)",
        "Islamic Optics & Camera Obscura Milestones",
        "The Translation Movement (Arabic & Greek)",
        "Scholarly Preservation Epics"
      ] : [
        "بيت الحكمة في العصر العباسي ونشأة التدوين",
        "إنجازات البصريات والكاميرا المظلمة لابن الهيثم",
        "حركة الترجمة من اللغات القديمة إلى العربية",
        "إسهامات علماء الجبر والهندسة في التنمية"
      ];
    } else {
      syllabusPoints = lang === 'en' ? [
        "Postgraduate Grant Criteria Identification",
        "IsDB Scholarship Application Blueprint",
        "Undergraduate and K-12 Literacy Maps",
        "Scholarly Network Integration Guides"
      ] : [
        "تحديد معايير المنح الأكاديمية للدراسات العليا",
        "دليل التقديم لبرنامج منح البنك الإسلامي",
        "تحليل شروط القبول بمؤسسات التعليم المعتمدة",
        "قنوات تواصل الباحثين وتوثيق الأعمال العلمية"
      ];
    }

    return {
      weeklyLessons,
      audioMinutes,
      completionWeeks,
      syllabusPoints
    };
  };

  // ADHAN & PRAYER NOTIFICATION ENGINE STATES
  const [showAdhanModal, setShowAdhanModal] = useState(false);
  const [activeAdhanName, setActiveAdhanName] = useState("");
  const [activeAdhanLabelAr, setActiveAdhanLabelAr] = useState("");
  const [adhanPlaying, setAdhanPlaying] = useState(false);
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);
  const prayerTimesRef = useRef<any>(null);
  const lastNotifiedRef = useRef<{[key: string]: boolean}>({});

  // Synchronize prayer timings with Aladhan API or fall back to scholarly standard
  useEffect(() => {
    // Standard Scholarly Timings (Fajr, Dhuhr, Asr, Maghrib, Isha)
    const fallbackTimings = {
      Fajr: "04:12",
      Sunrise: "05:45",
      Dhuhr: "12:35",
      Asr: "16:15",
      Maghrib: "19:42",
      Isha: "21:18"
    };

    prayerTimesRef.current = fallbackTimings;

    // Fetch live timings if geolocation is active
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
            if (res.ok) {
              const json = await res.json();
              const timings = json?.data?.timings;
              if (timings) {
                prayerTimesRef.current = {
                  Fajr: timings.Fajr,
                  Sunrise: timings.Sunrise,
                  Dhuhr: timings.Dhuhr,
                  Asr: timings.Asr,
                  Maghrib: timings.Maghrib,
                  Isha: timings.Isha
                };
              }
            }
          } catch (e) {
            console.warn("Notification engine prayer timings fallback used:", e);
          }
        },
        () => {}
      );
    }
  }, []);

  // Time ticking loop checking every 10 seconds for notifications, Adhan, Iqamah, and Adhkar reminders
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes();
      const timeString = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

      // 1. Bedtime Adhkar check (Exactly at 22:00 / 10:00 PM)
      if (timeString === "22:00") {
        const key = `sleep-${now.toDateString()}`;
        if (!lastNotifiedRef.current[key]) {
          lastNotifiedRef.current[key] = true;
          setLiveToast({
            title: lang === 'en' ? "💤 Bedtime Remembrance" : "💤 أذكار النوم المباركة",
            body: lang === 'en' 
              ? "It is now 10:00 PM. Tap to recite your protective Bedtime Remembrances and Surah Al-Mulk." 
              : "حان الآن موعد أذكار النوم المأثورة وسورة الملك المنجية. اضغط للقراءة والتحصين."
          });
        }
      }

      // Check each prayer time
      const timings = prayerTimesRef.current;
      if (!timings) return;

      const prayersList = [
        { name: "Fajr", labelAr: "الفجر", timeStr: timings.Fajr },
        { name: "Dhuhr", labelAr: "الظهر", timeStr: timings.Dhuhr },
        { name: "Asr", labelAr: "العصر", timeStr: timings.Asr },
        { name: "Maghrib", labelAr: "المغرب", timeStr: timings.Maghrib },
        { name: "Isha", labelAr: "العشاء", timeStr: timings.Isha }
      ];

      prayersList.forEach((prayer) => {
        const [pHrs, pMins] = prayer.timeStr.split(':').map(Number);
        
        // Target Date minutes
        const prayerTotalMins = pHrs * 60 + pMins;
        const currentTotalMins = hrs * 60 + mins;
        
        const diff = prayerTotalMins - currentTotalMins;

        // A. 15-Minute Left Alert
        if (diff === 15) {
          const key = `${prayer.name}-15min-${now.toDateString()}`;
          if (!lastNotifiedRef.current[key]) {
            lastNotifiedRef.current[key] = true;
            setLiveToast({
              title: lang === 'en' ? `🕌 ${prayer.name} Prayer Alert` : `🕌 تنبيه صلاة ${prayer.labelAr}`,
              body: lang === 'en'
                ? `15 minutes left before the Adhan of ${prayer.name} Salat. Prepare yourself for Ablution (Wudu).`
                : `بقي ١٥ دقيقة على أذان صلاة ${prayer.labelAr}. تهيأ الآن بالوضوء للوقوف بين يدي الله.`
            });
          }
        }

        // B. Entry Time / Adhan Call
        if (diff === 0) {
          const key = `${prayer.name}-adhan-${now.toDateString()}`;
          if (!lastNotifiedRef.current[key]) {
            lastNotifiedRef.current[key] = true;
            
            // Pop the stunning Adhan Modal!
            setActiveAdhanName(prayer.name);
            setActiveAdhanLabelAr(prayer.labelAr);
            setShowAdhanModal(true);
            setAdhanPlaying(true);

            // Play the soul-stirring Adhan audio
            if (adhanAudioRef.current) {
              adhanAudioRef.current.pause();
            }
            const audio = new Audio("https://archive.org/download/Adhan_201602/adhan.mp3");
            adhanAudioRef.current = audio;
            audio.play().catch(err => console.warn("Adhan autoplay prevented:", err));

            setLiveToast({
              title: lang === 'en' ? `🕌 Adhan Is Calling` : `🕌 الأذان يرتفع الآن`,
              body: lang === 'en'
                ? `The Adhan is now calling for ${prayer.name} Salat! Prepare for prayer.`
                : `حي على الصلاة.. ارتفع الآن أذان صلاة ${prayer.labelAr}، بادر بالوقوف بالصف.`
            });
          }
        }

        // C. 10-Minute After Iqamah Alert
        if (diff === -10) {
          const key = `${prayer.name}-iqama-${now.toDateString()}`;
          if (!lastNotifiedRef.current[key]) {
            lastNotifiedRef.current[key] = true;
            setLiveToast({
              title: lang === 'en' ? "✨ Iqamah Gathering" : "✨ إقامة الصلاة",
              body: lang === 'en'
                ? `Iqamah is now being called for ${prayer.name} Salat. Join the congregation prayer.`
                : `تقام الآن الصلاة المفروضة فرداً وجماعة لصلاة ${prayer.labelAr}. أسرع بالإنضمام.`
            });
          }
        }

        // D. 15-Minute After Post-Salah Adhkar Reminder
        if (diff === -15) {
          const key = `${prayer.name}-adhkar-${now.toDateString()}`;
          if (!lastNotifiedRef.current[key]) {
            lastNotifiedRef.current[key] = true;
            setLiveToast({
              title: lang === 'en' ? "📿 Post-Salah Remembrance" : "📿 أذكار دبر الصلاة",
              body: lang === 'en'
                ? `Don't forget your post-prayer remembrances. Tap to recite your Tasbih & Ayah Al-Kursi.`
                : `لا تحرم نفسك الأجر؛ حان وقت قراءة التحصين والتسبيحات وأوراد ما بعد صلاة ${prayer.labelAr}.`
            });
          }
        }
      });
    };

    // Check once immediately
    checkSchedule();

    const intervalId = setInterval(checkSchedule, 10000); // Ticks every 10 seconds for high-precision
    return () => clearInterval(intervalId);
  }, [lang]);

  // Auto-restore secure HttpOnly session on load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = await dbService.getCurrentSession();
        if (session) {
          setProgress({
            weeklyMinutes: session.weeklyMinutes ?? 45,
            lessonsCompleted: session.lessonsCompleted ?? ['les-taj-1'],
            savedScholarships: session.savedScholarships ?? ['sch-isdb'],
            recentRecitations: session.recentRecitations ?? [],
            username: session.username,
            email: session.email,
            joinedForums: session.joinedForums ?? [],
            notifications: session.notifications ?? [],
            devotionalPlan: (session as any).devotionalPlan
          });
        }
      } catch (err) {
        // Silent catch on unauthenticated page loads
      }
    };
    restoreSession();
  }, []);

  // Automatically query and request desktop browser notification permissions upon site opening
  useEffect(() => {
    if (window.Notification && window.Notification.permission === 'default') {
      window.Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Real-Time WebSocket Notification socket sync connection
  useEffect(() => {
    let socket: WebSocket | null = null;
    let pingInterval: any = null;

    if (progress.email) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      
      const connectWS = () => {
        try {
          socket = new WebSocket(wsUrl);
          
          socket.onopen = () => {
            console.log("WebSocket connected to Ilm Naafi live-alert router.");
            if (socket) {
              socket.send(JSON.stringify({
                type: 'register',
                email: progress.email
              }));
            }
          };

          socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'notification' && data.notification) {
                // Update student progress notifications list
                setProgress(prev => {
                  const currentNotifs = prev.notifications || [];
                  if (currentNotifs.some(n => n.id === data.notification.id)) {
                    return prev;
                  }

                  // Standard Web Push notifications trigger (Native service worker showNotification for mobile phone background compliance)
                  if (window.Notification && window.Notification.permission === 'granted') {
                    try {
                      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                        navigator.serviceWorker.ready.then((reg) => {
                          reg.showNotification(data.notification.title, {
                            body: data.notification.body,
                            icon: '/icon-192.png',
                            badge: '/icon-192.png',
                            vibrate: [200, 100, 200]
                          } as any);
                        }).catch(() => {
                          new window.Notification(data.notification.title, {
                            body: data.notification.body,
                            icon: '/icon-192.png'
                          });
                        });
                      } else {
                        new window.Notification(data.notification.title, {
                          body: data.notification.body,
                          icon: '/icon-192.png'
                        });
                      }
                    } catch (e) {
                      try {
                        new window.Notification(data.notification.title, {
                          body: data.notification.body,
                          icon: '/icon-192.png'
                        });
                      } catch (err) {}
                    }
                  }

                  // Trigger simulated telephone visual alerts on dashboard if registered
                  if ((window as any).onPhoneNotificationTriggered) {
                    (window as any).onPhoneNotificationTriggered(data.notification);
                  }

                  // Show client-facing toast
                  setLiveToast(data.notification);
                  setTimeout(() => setLiveToast(null), 6000);

                  return {
                    ...prev,
                    notifications: [data.notification, ...currentNotifs]
                  };
                });
              }
            } catch (err) {
              console.error("WS parse failure: ", err);
            }
          };

          socket.onclose = () => {
            console.warn("WebSocket disconnected. Retrying in 5s...");
            setTimeout(() => {
              if (progress.email) connectWS();
            }, 5000);
          };

          socket.onerror = () => {
            if (socket) socket.close();
          };
        } catch (e) {
          console.error("Setup WS failure: ", e);
        }
      };

      connectWS();

      pingInterval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
    }

    return () => {
      if (socket) socket.close();
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [progress.email]);

  // Save progress changes directly to the back-end database
  useEffect(() => {
    if (progress.email) {
      dbService.updateSession(progress).catch(() => {});
    }
  }, [progress]);

  const handleCompleteLesson = (lessonId: string) => {
    if (!progress.lessonsCompleted.includes(lessonId)) {
      setProgress(prev => ({
        ...prev,
        lessonsCompleted: [...prev.lessonsCompleted, lessonId],
        weeklyMinutes: prev.weeklyMinutes + 15
      }));
    }
  };

  const handleToggleSaveScholarship = (scholarshipId: string) => {
    setProgress(prev => {
      const exists = prev.savedScholarships.includes(scholarshipId);
      const updated = exists 
        ? prev.savedScholarships.filter(id => id !== scholarshipId)
        : [...prev.savedScholarships, scholarshipId];
      return {
        ...prev,
        savedScholarships: updated
      };
    });
  };

  const handleAddRecitation = (verse: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      recentRecitations: [
        { date: new Date().toISOString().split('T')[0], verse, score },
        ...prev.recentRecitations.slice(0, 4) 
      ],
      weeklyMinutes: prev.weeklyMinutes + 5
    }));
  };

  const handleAuthSuccess = (username: string, email: string) => {
    // Attempt full session restore on successful credentials authentication
    const fetchFullAndSet = async () => {
      try {
        const session = await dbService.getCurrentSession();
        if (session) {
          setProgress({
            weeklyMinutes: session.weeklyMinutes ?? 45,
            lessonsCompleted: session.lessonsCompleted ?? ['les-taj-1'],
            savedScholarships: session.savedScholarships ?? ['sch-isdb'],
            recentRecitations: session.recentRecitations ?? [],
            username: session.username,
            email: session.email,
            joinedForums: session.joinedForums ?? [],
            notifications: session.notifications ?? [],
            devotionalPlan: (session as any).devotionalPlan
          });
        } else {
          setProgress(prev => ({ ...prev, username, email, joinedForums: [], notifications: [] }));
        }
      } catch {
        setProgress(prev => ({ ...prev, username, email, joinedForums: [], notifications: [] }));
      }
    };
    fetchFullAndSet();
    setActiveTab('dashboard');
  };

  const handleSignOut = async () => {
    try {
      await dbService.signOut();
    } catch (e) {}
    setProgress({
      weeklyMinutes: 0,
      lessonsCompleted: [],
      savedScholarships: [],
      recentRecitations: [],
      username: '',
      email: '',
      joinedForums: [],
      notifications: []
    });
    setShowProfileDropdown(false);
    setActiveTab('home');
  };

  const triggerRsvp = (idx: number) => {
    if (userRsvped[idx]) {
      setRsvps(prev => ({ ...prev, [idx]: prev[idx] - 1 }));
      setUserRsvped(prev => ({ ...prev, [idx]: false }));
    } else {
      setRsvps(prev => ({ ...prev, [idx]: prev[idx] + 1 }));
      setUserRsvped(prev => ({ ...prev, [idx]: true }));
    }
  };

  // Translations dictionary matching user intent
  const labels = {
    en: {
      brand: "Ilm Naafi Academy",
      desc: "Beneficial Knowledge Platform",
      tagline: "Sacred Academic Tradition & Audio Technology",
      subtitle: "Discover a unified scholarly platform combining K-12 open-source Islamic curriculum, advanced AI recitation guidance, and a global scholarships database.",
      ctaStart: "Learn Tajweed",
      ctaCurriculum: "Explore Curriculum",
      curriculum: "Curriculum",
      coach: "Learn Tajweed",
      quran: "Quran Browser",
      daily: "Dhikr & Tasbih",
      scholarly: "Scholar Network",
      scholarships: "Grant Database",
      signin: "Student ID Login",
      signout: "Sign Out",
      weeklyMinutes: "Weekly Minutes",
      articlesRead: "Articles Read",
      bookmarked: "Bookmarked",
      arabicFocus: "العربية (Arabic)",
      englishFocus: "English",
      statsCountries: "Global Regions",
      statsStudents: "Active Scholars",
      statsLessons: "Lessons Completed",
      statsFree: "Free Forever",
      wisdomHeading: "Wisdom of the Day",
      refreshWisdom: "Recall Prophetic Tradition",
      faqHeading: "Platform Orientation & FAQs",
      facultyTitle: "Trustee Academic Faculty",
      webinarHeading: "Upcoming Seminars and Halaqas",
      registeredLabel: "RSVP Seat",
      registeredDone: "Seat Booked!",
      savedHub: "Saved Opportunities",
      openSource: "Open Source Hub",
      apiDocs: "API Docs",
      notifications: "Notifications",
      settings: "Settings",
      issueTracker: "Issue Tracker",
      footerText: "Ilm Naafi Academy is built as an open consensus academy. Empowering pristine pronunciations and academic equity.",
      copyright: "All Rights Reserved."
    },
    ar: {
      brand: "مِنصَّة العلم النافع",
      desc: "جامعة التعليم الإسلامي المفتوح",
      tagline: "قنوات العلوم الشريفة وفنون التلاوة الصوتية بالذكاء الاصطناعي",
      subtitle: "نظام أكاديمي موحد يربط متعلمي العلوم المنهجية (فقه، عقيدة، وسيرة)، وأدوات تصحيح التجويد لآيات الذكر الحكيم، وقاعدة بيانات المنح الموثقة مجاناً بالكامل.",
      ctaStart: "تعلّم التجويد",
      ctaCurriculum: "تصفح المناهج العلمية",
      curriculum: "مناهج التعليم",
      coach: "تعلّم التجويد",
      quran: "القرآن الكريم",
      daily: "الأوراد والتسابيح",
      scholarly: "شبكة العلماء",
      scholarships: "المنح الأكاديمية",
      signin: "بطاقة الهوية الأكاديمية",
      signout: "تسجيل الخروج",
      weeklyMinutes: "دقائق التعلم",
      articlesRead: "الدروس المكتملة",
      bookmarked: "المنح المحفوظة",
      arabicFocus: "العربية",
      englishFocus: "English",
      statsCountries: "أقطار مستفيدة",
      statsStudents: "طالب علم نشط",
      statsLessons: "تلاوة ومحاضرة مكتملة",
      statsFree: "مجاني بالكامل للجميع",
      wisdomHeading: "الحكمة اليومية المأثورة",
      refreshWisdom: "استفتح حكمة أخرى",
      faqHeading: "الأسئلة الشائعة والبروتوكول العلمي",
      facultyTitle: "هيئة مجلس الإشراف الأكاديمي",
      webinarHeading: "الحلقات الدراسية المباشرة والمحاضرات",
      registeredLabel: "حجز منبر",
      registeredDone: "تم حجز المقعد!",
      savedHub: "ديوان المحفوظات",
      openSource: "الرمز المفتوح",
      apiDocs: "واجهة المطورين API",
      notifications: "الإشعارات المباشرة",
      settings: "الإعدادات العامة",
      issueTracker: "مركز البلاغات والملاحظات",
      footerText: "تأسست منصة العلم النافع لتمكين المتعلمين من ضبط التلاوة وتسهيل سبل طلب العلم النافع عبر الأقطار والبحار.",
      copyright: "جميع الحقوق محفوظة."
    }
  }[lang];

  return (
    <>
      <AnimatePresence>
        {appLoading && (
          <motion.div
            key="academy-loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-gradient-to-br from-[#06241c] to-[#0c1412] text-white flex flex-col items-center justify-center z-[99999] p-6 select-none"
            id="loading-presence-wrapper"
          >
            {/* Ambient glowing particles/halos */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-900/10 blur-[130px] pointer-events-none" />

            <div className="max-w-md w-full text-center space-y-8 relative z-10">
              
              {/* Premium Minimalist Emblem */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ 
                    scale: [0.98, 1.02, 0.98]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-800/10 to-amber-600/5 border border-amber-500/20 flex items-center justify-center text-amber-500 text-3xl font-serif relative"
                >
                  <span className="relative z-10 select-none">ع</span>
                  <div className="absolute inset-0 rounded-2xl border border-amber-500/10 scale-105 animate-pulse" />
                </motion.div>
              </div>

              {/* Minimized Gilded Loading Indicators (Minimalist horizontal dots) */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="w-2.5 h-2.5 bg-amber-500 rounded-full" 
                  />
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                    className="w-2.5 h-2.5 bg-emerald-600 rounded-full" 
                  />
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="w-2.5 h-2.5 bg-amber-600 rounded-full" 
                  />
                </div>
                <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest font-mono text-center">
                  <span>ilm Naafi / جاري التحضير</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="bg-[#fafbfc] text-slate-900 font-sans antialiased min-h-screen flex flex-col relative pb-0" 
        id="ilm-naafi-app"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
      
      {/* FULL WIDTH STICKY TOP NAVBAR */}
      <nav 
        className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm z-[80] transition-all min-h-[4rem] h-auto lg:h-16 py-2.5 lg:py-0 px-4 md:px-6 lg:px-8 flex flex-row flex-nowrap items-center justify-between gap-1.5 overflow-visible" 
        id="app-top-navbar"
      >
        {/* Brand identity logo */}
        <button 
          onClick={() => { setActiveTab('home'); setShowMoreNav(false); }} 
          className="font-extrabold text-[#004d3d] tracking-tight cursor-pointer py-1 text-left flex items-center gap-1.5 md:gap-2 outline-none focus:outline-none shrink-0"
          id="brand-logo"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-700/10 flex items-center justify-center text-amber-800 font-extrabold border border-amber-850/15 shrink-0 select-none">
            ع
          </span>
          <div className="flex flex-col items-start leading-none whitespace-nowrap">
            <span className="text-xs sm:text-sm font-extrabold">{labels.brand}</span>
            <span className="text-[8px] sm:text-[9px] text-amber-800 font-semibold mt-0.5">{labels.desc}</span>
          </div>
        </button>

        {/* Centered Desktop Navigation Links - hardened with overflow safety and compact sizing against large font zoom */}
        <div className="hidden lg:flex flex-1 items-center justify-center border-l border-r border-slate-100/90 mx-1 xl:mx-2">
          <div className="flex items-center justify-center gap-1 xl:gap-1.5 font-medium text-[10px] xl:text-[12px] whitespace-nowrap py-1 px-1.5 xl:px-3 overflow-x-auto scroller-hidden select-none flex-nowrap scroll-smooth" id="desktop-nav-links-center">
            <button 
              onClick={() => { setActiveTab('curriculum'); setShowMoreNav(false); }}
              className={`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
                activeTab === 'curriculum' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }`}
              id="nav-curriculum"
            >
              {labels.curriculum}
            </button>
            <button 
              onClick={() => { setActiveTab('coach'); setShowMoreNav(false); }}
              className={`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
                activeTab === 'coach' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }`}
              id="nav-coach"
            >
              {labels.coach}
            </button>
            <button 
              onClick={() => { setActiveTab('quran'); setShowMoreNav(false); }}
              className={`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
                activeTab === 'quran' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-550/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }`}
              id="nav-quran"
            >
              {labels.quran}
            </button>
            <button 
              onClick={() => { setActiveTab('encyclopedia'); setShowMoreNav(false); }}
              className={`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
                activeTab === 'encyclopedia' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }`}
              id="nav-encyclopedia"
            >
              {lang === 'en' ? 'Hadith & Library' : 'الحديث والموسوعة'}
            </button>
            <button 
              onClick={() => { setActiveTab('daily'); setShowMoreNav(false); }}
              className={`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
                activeTab === 'daily' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }`}
              id="nav-daily"
            >
              {labels.daily}
            </button>
          </div>

          {/* MORE DROPDOWN DESKTOP - MOVED HERE */}
          <div className="relative hidden lg:flex items-center ml-1 xl:ml-2 text-[10px] xl:text-[12px]">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMoreNav(!showMoreNav); }}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 relative ${
                ['community', 'dashboard', 'settings', 'issue-tracker', 'privacy', 'terms', 'academic'].includes(activeTab)
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15'
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }`}
              id="nav-more-systems"
            >
              <span>{lang === 'en' ? "Hub" : "المنصات"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreNav ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop More Nav Dropdown Panel */}
            <AnimatePresence>
              {showMoreNav && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute top-full mt-3 w-64 premium-dropdown p-2.5 space-y-1 z-[9999] max-h-[75vh] overflow-y-auto text-xs shadow-2xl border border-slate-200/80 bg-white rounded-2xl ${
                    lang === 'ar' ? '-left-6' : '-right-6'
                  }`}
                  id="nav-more-dropdown"
                >
                  <button 
                    onClick={() => { setActiveTab('community'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'community' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-800 shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 pointer-events-none">
                      <span className="text-[12px]">{lang === 'en' ? "Open Source Connect" : "بوابة المطورين والمجتمع"}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Contribute resources" : "المساهمة المفتوحة"}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('api-docs'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'api-docs' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-800 shrink-0 pointer-events-none">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 pointer-events-none">
                      <span className="text-[12px]">{lang === 'en' ? "Developer APIs" : "مستندات الربط"}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "API specifications" : "واجهات المبرمجين"}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('notifications'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} relative ${
                      activeTab === 'notifications' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-800 shrink-0 pointer-events-none">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 pointer-events-none">
                      <span className="text-[12px] flex items-center gap-1.5">
                        <span>{labels.notifications}</span>
                        {progress.notifications && progress.notifications.filter(n => !n.isRead).length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        )}
                      </span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "System alerts & cues" : "إشعارات المنصة الفورية"}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('issue-tracker'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'issue-tracker' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-550/10 flex items-center justify-center text-amber-800 shrink-0 pointer-events-none">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 pointer-events-none">
                      <span className="text-[12px]">{labels.issueTracker}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Report & audit bugs" : "تقديم ومتابعة بلاغات الأعطال"}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('settings'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'settings' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-800 shrink-0 pointer-events-none">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 pointer-events-none">
                      <span className="text-[12px]">{labels.settings}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "User Preferences" : "إعدادات الهوية والمنصة"}
                      </span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Nav Box: Lang Toggle and Login profiles */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 bg-slate-50 hover:bg-amber-50 hover:text-amber-900 text-slate-700 rounded-xl px-3 py-1.5 border border-slate-200 transition-colors text-xs font-semibold"
              id="lang-toggle-nav"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'en' ? "العربية" : "English"}
              </span>
            </button>

            {/* Direction pointer cue pointing to language change icon */}
            <AnimatePresence>
              {((activeTab === 'daily' && adhkarDrawerActive !== null) || showLaunchLangGuide) && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  onClick={() => setShowLaunchLangGuide(false)}
                  className="absolute right-0 top-full mt-2.5 z-[250] w-48 bg-emerald-950 text-white rounded-2xl p-3 shadow-2xl border border-emerald-500 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-102"
                >
                  {/* Upward pointer arrow */}
                  <div className="absolute -top-1.5 right-6 w-3 h-3 bg-emerald-950 border-t border-l border-emerald-500 rotate-45" />
                  
                  {/* Glowing Indicator pointing upwards */}
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="text-amber-300 text-sm font-bold mb-1"
                  >
                    ↑
                  </motion.div>
                  
                  <span className="text-[11px] font-extrabold tracking-tight text-white leading-tight font-sans">
                    Change language here
                  </span>
                  <span className="text-[8px] text-emerald-200 mt-0.5 font-medium leading-normal block font-sans">
                    Switch text, audio & translation instantly (Tap to close)
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User ID controls */}
          {progress.username ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); }}
                className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2 font-bold text-xs text-slate-800 transition shadow-sm outline-none"
                id="btn-profile-dropdown"
              >
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>{progress.username}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              
              {showProfileDropdown && (
                <div 
                  className={`absolute mt-2 w-64 premium-dropdown p-4 space-y-4 z-[999] text-xs animate-fadeIn bg-white border border-slate-200/80 rounded-2xl shadow-xl max-h-[75vh] overflow-y-auto ${
                    lang === 'ar' ? 'left-0' : 'right-0'
                  }`} 
                  id="profile-dropdown-card"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <p className="font-extrabold text-slate-900 leading-tight">{progress.username}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{progress.email}</p>
                  </div>

                  {/* Progress details */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <BarChart className="w-3.5 h-3.5 text-amber-700" /> {labels.weeklyMinutes}
                      </span>
                      <span className="font-bold text-slate-950">{progress.weeklyMinutes} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> {labels.articlesRead}
                      </span>
                      <span className="font-bold text-slate-950">{progress.lessonsCompleted.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-amber-700" /> {labels.bookmarked}
                      </span>
                      <span className="font-bold text-slate-950">{progress.savedScholarships.length}</span>
                    </div>
                  </div>

                  {/* Open dashboard quick navigation trigger */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => { setActiveTab('dashboard'); setShowProfileDropdown(false); }}
                      className="w-full h-10 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-205/30 rounded-xl transition-colors font-extrabold text-[11px] text-amber-955 flex items-center justify-between cursor-pointer"
                      style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                      id="dropdown-btn-to-dashboard"
                    >
                      <span className="flex items-center gap-1.5" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <GraduationCap className="w-4 h-4 text-amber-900 shrink-0" />
                        <span>{lang === 'en' ? "Student Workspace Dev" : "معمل المتابعة الأكاديمية"}</span>
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-amber-900 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSignOut}
                      className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1.5 bg-transparent cursor-pointer"
                      id="btn-sign-out"
                    >
                      <LogOut className="w-3.5 h-3.5" /> {labels.signout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => { setActiveTab('auth'); }}
              className="bg-[#004d3d] hover:bg-[#00362b] text-teal-100 px-4 py-2 rounded-xl font-bold text-xs tracking-tight transition shadow-sm shrink-0 border border-[#004d3d]"
              id="btn-signin-nav"
            >
              {labels.signin}
            </button>
          )}

        </div>
      </nav>

      {/* MOBILE BOTTOM SLIDING SHEET NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark blurred interactive Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 lg:hidden"
              id="mobile-nav-backdrop"
            />
            
            {/* Sliding Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[55vh] bg-white border-t border-slate-200 shadow-2xl rounded-t-[2.5rem] p-6 pb-12 z-50 flex flex-col lg:hidden overflow-y-auto overscroll-contain"
              id="mobile-bottom-sheet"
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            >
              {/* Drag indicator handle on top */}
              <div 
                className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0 cursor-pointer hover:bg-slate-300 transition"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3 shrink-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  {lang === 'en' ? "Academy Navigation Menu" : "قائمة منارة العلم والمنصات"}
                </p>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-6 pb-20">
                
                {/* Learn & Practice */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3 px-1">{lang === 'en' ? 'Learn & Practice' : 'التعلم والتطبيق'}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'curriculum', label: labels.curriculum, icon: GraduationCap, color: 'text-amber-800 bg-amber-500/10' },
                      { id: 'coach', label: labels.coach, icon: Mic, color: 'text-emerald-800 bg-emerald-500/10' },
                      ...(progress.username ? [{ id: 'dashboard', label: lang === 'en' ? "Dashboard" : "اللوحة الموحدة", icon: GraduationCap, color: 'text-amber-900 bg-amber-500/20' }] : [])
                    ].map(item => {
                      const IconComponent = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button key={item.id} onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }} className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${isActive ? 'border-amber-600 bg-amber-50/80 text-amber-955 font-black shadow-inner' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}><IconComponent className="w-4 h-4" /></span>
                          <span className="text-[11px] font-bold leading-tight truncate text-left">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Libraries */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3 px-1">{lang === 'en' ? 'Libraries & Resources' : 'المكتبات والمصادر'}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'quran', label: labels.quran, icon: BookOpen, color: 'text-teal-800 bg-teal-500/10' },
                      { id: 'encyclopedia', label: lang === 'en' ? 'Encyclopedia & Hadith' : 'الموسوعة والحديث', icon: BookOpen, color: 'text-rose-800 bg-rose-500/10' },
                      { id: 'daily', label: labels.daily, icon: Clock, color: 'text-blue-800 bg-blue-500/10' },
                    ].map(item => {
                      const IconComponent = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button key={item.id} onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }} className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${isActive ? 'border-amber-600 bg-amber-50/80 text-amber-955 font-black shadow-inner' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}><IconComponent className="w-4 h-4" /></span>
                          <span className="text-[11px] font-bold leading-tight truncate text-left">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tools & Settings */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3 px-1">{lang === 'en' ? 'Tools & Settings' : 'الأدوات والإعدادات'}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'notifications', label: labels.notifications, icon: Bell, color: 'text-red-800 bg-red-500/10' },
                      { id: 'settings', label: labels.settings, icon: Settings, color: 'text-slate-800 bg-slate-500/10' },
                      { id: 'community', label: lang === 'en' ? 'Community' : 'المجتمع', icon: Users, color: 'text-indigo-800 bg-indigo-500/10' },
                      { id: 'api-docs', label: lang === 'en' ? 'APIs' : 'المبرمجين', icon: Terminal, color: 'text-emerald-800 bg-emerald-500/10' },
                      { id: 'issue-tracker', label: labels.issueTracker, icon: ShieldAlert, color: 'text-amber-800 bg-amber-550/10' },
                    ].map(item => {
                      const IconComponent = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button key={item.id} onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }} className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${isActive ? 'border-amber-600 bg-amber-50/80 text-amber-955 font-black shadow-inner' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}><IconComponent className="w-4 h-4" /></span>
                          <span className="text-[11px] font-bold leading-tight truncate text-left">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SPACE FILLER FOR NAV BAR */}
      <div className="h-20 sm:h-24"></div>

      {/* RENDER ACTIVE TAB CANVASES */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
        
        {/* HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            id="home-view"
            className="space-y-16"
          >
            
            {/* PRESTIGE DESIGN HERO HERO SECTION WITH PICTURE OVERLAY LAYER */}
            <section 
              className="relative overflow-hidden py-24 md:py-36 text-center px-4 rounded-[2.5rem] w-[94%] max-w-7xl mx-auto bg-cover bg-center text-white shadow-[0_25px_60px_rgba(7,28,23,0.12)] border border-emerald-950/20"
              style={{
                backgroundImage: "linear-gradient(to bottom, rgba(5, 23, 19, 0.95), rgba(9, 15, 14, 0.9)), url('https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1600')"
              }}
              id="hero-majestic-block"
            >
              <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                
                {/* Globe sticker container with gold badges and dynamic change trigger */}
                <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span className="font-bold text-[10px] text-amber-200 uppercase tracking-widest font-sans">
                    {lang === 'en' ? "Inspired Quranic Verses & Wisdoms" : "من وحي آيات الذكر الحكيم والحكم الشرعية"} • {heroIndex + 1}/{HERO_TEMPLATES.length}
                  </span>
                  <button 
                    onClick={() => setHeroIndex(prev => (prev + 1) % HERO_TEMPLATES.length)}
                    className="ml-2 pl-2 border-l border-amber-500/30 text-amber-300 hover:text-white cursor-pointer transition text-[10px] font-black flex items-center gap-1.5 focus:outline-none"
                    title="Cycle Wisdom"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-slow inline text-amber-400" />
                    <span>{lang === 'en' ? "Inspire Me" : "آية وحكمة أخرى"}</span>
                  </button>
                </div>

                <motion.h1 
                  key={`title-${heroIndex}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-none font-sans drop-shadow-sm max-w-3xl"
                >
                  {lang === 'en' ? HERO_TEMPLATES[heroIndex].titleEn : HERO_TEMPLATES[heroIndex].titleAr}
                </motion.h1>
                
                <motion.p 
                  key={`subtitle-${heroIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-emerald-100/80 font-medium text-sm md:text-base max-w-2xl mt-5 leading-relaxed font-sans"
                >
                  {lang === 'en' ? HERO_TEMPLATES[heroIndex].subtitleEn : HERO_TEMPLATES[heroIndex].subtitleAr}
                </motion.p>

                {/* Sub-banner layout action triggers */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                  <motion.button 
                    key={`cta1-${heroIndex}`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    onClick={() => { setActiveTab('coach'); }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-2xl font-bold text-xs tracking-wide transition shadow-lg shadow-amber-950/20 cursor-pointer border border-amber-600 scale-[1.02] hover:scale-[1.05]"
                  >
                    {lang === 'en' ? HERO_TEMPLATES[heroIndex].ctaStartEn : HERO_TEMPLATES[heroIndex].ctaStartAr}
                  </motion.button>
                </div>

              </div>
            </section>

            {/* PLATFORM VALUE PILLARS & FEATURES MATRIX */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12" id="platform-value-pillars">
              <div className="mt-12 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-extrabold text-[#0a2e24] font-sans tracking-tight">
                    {lang === 'en' ? "Platform Core Portals" : "بوابات العلم والهدى"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    {lang === 'en' ? "Choose a specialized academic segment to begin learning classical traditions with no friction." : "اختر المحضن المعرفي المناسب للبدء برحلة العلم النافع والترتيل القويم."}
                  </p>
                </div>

                {/* Redesigned Clean Icon-Based Portals Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                  
                  {/* PORTAL 1: HOLY QURAN */}
                  <div 
                    onClick={() => setActiveTab('quran')}
                    className="premium-card hover:border-amber-600 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-quran"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <BookOpen className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-850 leading-tight font-sans">
                        {lang === 'en' ? "Holy Quran" : "المصحف الشريف"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "Uthmani Script" : "تلاوة وعرض متكامل"}
                      </p>
                    </div>
                  </div>

                  {/* PORTAL 2: AI RECITATION COACH */}
                  <div 
                    onClick={() => setActiveTab('coach')}
                    className="premium-card hover:border-emerald-700 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-coach"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <Mic className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-750 leading-tight font-sans">
                        {lang === 'en' ? "Recitation Coach" : "مصحح المخارج"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "Real-time AI" : "تحليل مخارج الصوت غيباً"}
                      </p>
                    </div>
                  </div>

                  {/* PORTAL 3: DAILY DHIKR */}
                  <div 
                    onClick={() => setActiveTab('daily')}
                    className="premium-card hover:border-blue-600 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-daily"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <Clock className="w-5 h-5 text-blue-800" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-800 leading-tight font-sans">
                        {lang === 'en' ? "Daily Dhikr" : "الأذكار والقبلة"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "Tasbih & Compass" : "مسبحة وبوصلة تفاعلية"}
                      </p>
                    </div>
                  </div>

                  {/* PORTAL 4: ENCYCLOPEDIA (Hadith, etc) */}
                  <div 
                    onClick={() => setActiveTab('encyclopedia')}
                    className="premium-card hover:border-rose-600 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-encyclopedia"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <BookOpen className="w-5 h-5 text-rose-800" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-rose-800 leading-tight font-sans">
                        {lang === 'en' ? "Hadith & Library" : "الحديث والموسوعة"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "Sahih Bukhari & Seerah" : "صحيح البخاري والسيرة"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>



            {/* IN-DEPTH BENTO GRID */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12-custom mt-16" id="bento-grid-section">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* TILE 1: CURRICULUM */}
                  <div 
                    onClick={() => { setActiveTab('curriculum'); }}
                    className="bg-white rounded-3xl border border-slate-200/80 p-8 hover:border-amber-600 hover:shadow-lg transition relative overflow-hidden group cursor-pointer shadow-sm flex flex-col justify-between"
                  >
                    <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition translate-x-1/4 translate-y-1/4">
                      <BookOpen className="w-64 h-64 text-amber-800" />
                    </div>
                    <div>
                      <span className="bg-amber-50 text-amber-850 border border-amber-100 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-6 inline-block">
                        {lang === 'en' ? "Open Wiki Curriculum" : "موسوعة المناهج الحرة"}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 font-sans">
                        {lang === 'en' ? "Wikipedia of Sacred Sciences" : "موسوعة مفتوحة للعلوم الإسلامية الشريفة"}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed max-w-md mb-8">
                        {lang === 'en' 
                          ? "K-12 structured segments across Quran, verified traditions, and Islamic history verified back to pristine primary sources."
                          : "نهج دراسي ميسر ومنهجي يغطي التجويد، وعلوم الرواية والحديث النبوي، وحقائق من العصر الذهبي."}
                      </p>
                    </div>
                    <span className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase cursor-pointer">
                      {lang === 'en' ? "Explore articles" : "تصفح المقررات"} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>

                  {/* TILE 2: AI RECITATION COACH */}
                  <div 
                    onClick={() => { setActiveTab('coach'); }}
                    className="bg-[#073327] text-white rounded-3xl border border-[#0d4538] p-8 hover:shadow-lg transition relative overflow-hidden group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                        <Mic className="w-4 h-4 text-amber-400" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 font-sans text-white">
                        {lang === 'en' ? "AI Recitation Coach" : "مصحح ومحقق تلاوة الذكر الحكيم"}
                      </h3>
                      <p className="text-emerald-100/80 text-xs leading-relaxed mb-6">
                        {lang === 'en'
                          ? "Pronounce letters, adjust Makhārij, and analyze oral fluency instantly using advanced audio telemetry vectors."
                          : "حلل نطقك ومخارج الحروف غيباً واسترجع إرشاداً مخصصاً لتصحيح التلاوة وتجويدها بدقة."}
                      </p>
                    </div>
                    <span className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase cursor-pointer relative z-10">
                      {lang === 'en' ? "Open Recitation Studio" : "فتح معمل التجويد"} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>

                </div>
              </div>
            </section>

            {/* ACADEMY FELLOWS & TESTIMONIALS */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 mt-16" id="fellows-testimonials">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-extrabold text-[#0a2e24] font-sans tracking-tight">
                    {lang === 'en' ? "Academy Scholar Voices" : "أصوات وبحوث قادة التغيير الفكري"}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Fellow Card 1 */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-slate-700 italic text-xs leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                      {lang === 'en'
                        ? "\"The interactive Makhraj Visualizer changed everything for me. Watching my tongue position move dynamically on the anatomical tracker helped me correct my throat consonants (Ayn, Haa). The feedback notes are so detailed they feel like a private Sheikh sitting with me.\""
                        : "\"غيّر معمل المخارج التفاعلي طريقتي في الفهم تماماً. رؤية حركة اللسان والشفاه تنقبض وتنبسط بالتوجيه الآني ساعدتني في تصحيح مخرجي حرفي العين والحاء المغبونين. نقد تفكيك الحروف دقيق بدرجة لا تتوفر حتى في الدروس الفردية التقليدية.\""
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4">
                    <div className="w-11 h-11 rounded-full bg-[#fca5a5]/10 border border-[#fca5a5]/30 flex items-center justify-center font-bold text-slate-800">
                      FA
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        {lang === 'en' ? "Fatimah Alzahra" : "فاطمة الزهراء البتول"}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {lang === 'en' ? "Undergraduate / Jakarta" : "طالبة لغويات - جاكرتا"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fellow Card 2 */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-slate-700 italic text-xs leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                      {lang === 'en'
                        ? "\"Implementing my daily commitment plan with the home custom scheduler led me to apply for the Islamic Development Bank (IsDB) Postgraduate Scholarship. Utilizing the clean filtering criteria, I won my postgrad funding and am now researching legal physics in France.\""
                        : "\"الانتظام اليومي بجدول المخطط الدراسي قادني مباشرة لكتابة وتجهيز ملف طلب الحصول على منحة البحوث العليا للبنك الإسلامي للتنمية. بفضل تصفية المنصّة وبدون معلومات وهمية، فزت بتمويل بحثي للدراسة بفرنسا ونشر كتاب القانون الطبي للمخطوطات.\""
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4">
                    <div className="w-11 h-11 rounded-full bg-[#94a3b8]/10 border border-[#94a3b8]/30 flex items-center justify-center font-bold text-slate-800">
                      AM
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        {lang === 'en' ? "Amine Mezghani" : "أمين مزغني"}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {lang === 'en' ? "Researcher / Strasbourg" : "باحث ماجستير مقاصد - ستراسبورغ"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fellow Card 3 */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-slate-700 italic text-xs leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                      {lang === 'en'
                        ? "\"The open K-12 Wiki curriculum has become the core standard for my youth circles at our university council. Combining structural modules with authentic primary texts gives students unmatched rigor. An absolutely exemplary project for open-access education.\""
                        : "\"باتت موسوعة المناهج المفتوحة ركيزة أساسية أعتمد عليها في تنظيم الحلقات العامة للطلبة الوافدين. الجمع بين المقررات التبسيطية الحديثة وسياق الكتب التاريخية المعتمدة يُكسب الطالب متانة معرفية لا تضاهى. مشروع رائد ونموذج للتضامن المعرفي.\""
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4">
                    <div className="w-11 h-11 rounded-full bg-[#fcd34d]/10 border border-[#fcd34d]/30 flex items-center justify-center font-bold text-slate-800">
                      YA
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        {lang === 'en' ? "Dr. Yusuf Al-Misri" : "د. يوسف المصري"}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {lang === 'en' ? "Islamic Studies / Al-Azhar" : "أستاذ مساعد - جامع الأزهر"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>


            {/* SECTION 4: PLATFORM ORIENTATION INTERACTIVE FAQ (REDESIGNED FOR EXTRAORDINARY CRAFT) */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-12" id="faq-section">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left illustrative card */}
                <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-4">
                  <span className="inline-block text-[10px] font-bold text-amber-805 bg-amber-100 rounded-full py-1 px-3">
                    {lang === 'en' ? "Institutional FAQs" : "التوجيه الأكاديمي"}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 font-sans tracking-tight">
                    {lang === 'en' ? "Guidance & Scholarly Integrity" : "أسئلة شائعة ودليل طالب العلم"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {lang === 'en' 
                      ? "If you have questions about academic credentials, the artificial intelligence recitation coach, or how list information is verified, read our protocol."
                      : "نصحب مراجعي المقررات وحفاظ التلاوة ورياض الباحثين بدليل مبسط لشرح ميكانيكية عمل مصحح الأخطاء الصوتي ودورة المناهج والمنح الشريانية."}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-center">
                      <HelpCircle className="w-5 h-5 mx-auto" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 text-right">{lang === 'en' ? "Need help?" : "التواصل المباشر"}</h4>
                      <p className="text-[10px] text-slate-400 font-bold font-mono text-right">support@ilmnaafi.academy</p>
                    </div>
                  </div>
                </div>

                {/* Right accordion group */}
                <div className="lg:col-span-8 space-y-3">
                  {[
                    {
                      q: lang === 'en' ? "How does the AI recite speech model evaluate my pronunciation?" : "كيف يقيّم مصحح التلاوة نطق مخارج الحروف العربية بدقة؟",
                      a: lang === 'en' 
                        ? "The speech Evaluator routes raw vocal tracks securely to server-side endpoints invoking advanced Gemini audio transcription API models. It accurately verifies Makhārij (articulation segments), throat tension, and length parameters, returning actionable improvement notes."
                        : "تُنقل المسارات الصوتية المسجلة عبر الأجهزة بأمان تام لنهايات الخادم السحابية، حيث يتم تغذية واجهة برمجة النماذج الذكية (Gemini API) لتحليل جهارة صوت الحرف ومدى زمن المد ومواقع الصمت، وتزويدك بتقديرات فورية مبسطة."
                    },
                    {
                      q: lang === 'en' ? "Is the curriculum structured for academic certificate credits?" : "هل المناهج الدراسية متطابقة مع المعايير والأقطار التعليمية؟",
                      a: lang === 'en'
                        ? "Yes, all lessons are generated using authentic primary manuscripts (including classical Tajweed texts, certified Hadith series) reviewed by historic trustees, matching modern open-source K-12 learning maps."
                        : "نعم، المناهج مصممة وموثقة بالاعتماد على روايات معتمدة ومراجعة علمية وتاريخية صارمة، وهي مهيأة لتناسب الفئات العمرية المختلفة وتمنح المتعلم نقداً ذاتياً ومراجعة لتثبيت الحفظ."
                    },
                    {
                      q: lang === 'en' ? "How often are global postgraduate and undergraduate scholarships updated?" : "كيف يتم تحديث وتصفية المنح الدراسية والمالية بصورة دورية؟",
                      a: lang === 'en'
                        ? "The scholarly grants portal checks certified databases monthly (including Islamic Development Bank, major universities). It verifies regions, financial coverage status, and eligibility requirements without mock entries."
                        : "يتم فحص قاعدة بيانات المنح العالمية بصورة مستمرة وسحب تفاصيل التقديم الخاصة بالمؤسسات الكبرى (مثل البنك الإسلامي للتنمية) لضمان دقة البيانات من حيث شمولية السكن أو تصفير تذكرة السفر دون سجلات وهمية."
                    },
                    {
                      q: lang === 'en' ? "Is the platform free and open-source?" : "هل المنصة مخصصة للانتفاع المجاني المفتوح؟",
                      a: lang === 'en'
                        ? "Indeed, Ilm Naafi Academy is built as an open consensus framework. We enforce extreme accessibility norms to safeguard academic equity for students in developing nations."
                        : "نعم، العلم النافع وقف أكاديمي يسعى لتسوية الفجوة التعليمية وصيانة تكافؤ الفرص لمتعلمي العلوم الشرعية في المناطق الأقل دخلاً، وموادها مرخصة بالكامل للانتفاع العام."
                    }
                  ].map((faq, idx) => {
                    const isOpen = faqOpenIdx === idx;
                    return (
                      <div 
                        key={idx} 
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                          isOpen 
                            ? 'bg-amber-500/5 border-amber-600/30 shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <button
                          onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
                          className="w-full p-5 text-xs font-bold text-slate-800 hover:text-slate-900 flex items-center justify-between outline-none"
                        >
                          <span className="font-sans text-right" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{faq.q}</span>
                          <span className={`text-sm shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                            isOpen ? 'bg-amber-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </span>
                        </button>
                        
                        {/* Smooth collapsing block */}
                        <div className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-72 opacity-100 py-5 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden py-0'
                        } px-5 text-slate-600 text-xs leading-relaxed font-sans`} style={{ textAlign: 'justify' }}>
                          {faq.a}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>



          </motion.div>
        )}

        {/* CURRICULUM SCREEN */}
        {activeTab === 'curriculum' && (
          <motion.div
            key="curriculum"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <CurriculumView 
              progress={progress} 
              onCompleteLesson={handleCompleteLesson} 
              lang={lang}
            />
          </motion.div>
        )}

        {/* AI COACH SCREEN */}
        {activeTab === 'coach' && (
          <motion.div
            key="coach"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <AICoachView 
              progress={progress} 
              onAddRecitation={handleAddRecitation} 
              practiceVerse={practiceVerse}
              onClearPracticeVerse={() => setPracticeVerse(null)}
              lang={lang}
            />
          </motion.div>
        )}

        {/* QURAN EXPLORER SCREEN - kept mounted to allow background audio thread to keep playing across tabs */}
        <div className={activeTab === 'quran' ? "block" : "hidden"}>
          <motion.div
            key="quran"
            initial={{ opacity: 0, y: 15 }}
            animate={activeTab === 'quran' ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.25 }}
          >
            <QuranExplorer 
              lang={lang} 
              qiraat={progress.qiraat}
              tajweedMode={progress.tajweedMode}
              isAuthenticated={!!progress.email}
              onSwitchToAuth={() => setActiveTab('auth')}
              onPracticeAyah={(verse) => {
                setPracticeVerse(verse);
                setActiveTab('coach');
              }}
              onChangeQiraat={(q) => {
                setProgress(prev => {
                  const updated = { ...prev, qiraat: q };
                  localStorage.setItem('ilm_naafi_qiraat', q);
                  return updated;
                });
              }}
              onChangeTajweedMode={(m) => {
                setProgress(prev => {
                  const updated = { ...prev, tajweedMode: m };
                  localStorage.setItem('ilm_naafi_tajweed_mode', m ? 'true' : 'false');
                  return updated;
                });
              }}
            />
          </motion.div>
        </div>

        {/* ENCYCLOPEDIA VIEW */}
        {activeTab === 'encyclopedia' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <EncyclopediaView lang={lang} />
          </motion.div>
        )}

        {/* DAILY SPIRITUAL TOOLS */}
        {activeTab === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <DailyView lang={lang} onDrawerChange={(drawer) => setAdhkarDrawerActive(drawer)} />
          </motion.div>
        )}

        {/* OPEN SOURCE COMMUNITY HUB */}
        {activeTab === 'community' && (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <CommunityHubView 
              lang={lang}
            />
          </motion.div>
        )}

        {/* STANDALONE STUDENT ID AUTH PAGE (NEW PAGE METHOD) */}
        {activeTab === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <AuthPage 
              lang={lang} 
              onSuccess={handleAuthSuccess} 
              onCancel={() => { setActiveTab('home'); }} 
            />
          </motion.div>
        )}

        {/* STUDENT WORKSPACE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <StudentDashboard 
              lang={lang}
              progress={progress}
              onNavigateToTab={(tab) => { setActiveTab(tab); }}
              onRemoveBookmark={handleToggleSaveScholarship}
              onUpdateProgress={setProgress}
            />
          </motion.div>
        )}

        {/* SCHOLARSHIP SEARCH ENGINE */}
        {activeTab === 'scholarships' && (
          <motion.div
            key="scholarships"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ScholarshipsView 
              progress={progress}
              onToggleSaveScholarship={handleToggleSaveScholarship}
            />
          </motion.div>
        )}

        {/* SAVED SCHOLARSHIPS DESK */}
        {activeTab === 'saved-scholarships' && (
          <motion.div
            key="saved-scholarships"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <SavedScholarshipsView 
              progress={progress}
              onToggleSaveScholarship={handleToggleSaveScholarship}
              lang={lang}
            />
          </motion.div>
        )}

        {/* STANDALONE REAL-TIME NOTIFICATIONS HUB */}
        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {progress && progress.email ? (
              <NotificationsView 
                lang={lang}
                progress={progress}
                onUpdateProgress={setProgress}
                onNavigateToTab={(tab) => { setActiveTab(tab); }}
              />
            ) : (
              <RenderAuthGateway tabName={lang === 'en' ? "Notifications" : "شاشة الإشعارات والدراسة"} />
            )}
          </motion.div>
        )}

        {/* STANDALONE SETTINGS & SYSTEMS PREFERENCES VIEW */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {progress && progress.email ? (
              <SettingsView 
                lang={lang}
                progress={progress}
                setProgress={setProgress}
                onUpdateUsername={(newName) => {
                  setProgress(prev => ({
                    ...prev,
                    username: newName
                  }));
                }}
              />
            ) : (
              <RenderAuthGateway tabName={lang === 'en' ? "Settings" : "قائمة خيارات الضبط العامة"} />
            )}
          </motion.div>
        )}

        {/* STANDALONE API DOCUMENTATION VIEW */}
        {activeTab === 'api-docs' && (
          <motion.div
            key="api-docs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ApiDocsView lang={lang} />
          </motion.div>
        )}

        {/* INTERACTIVE INTEGRATED ISSUE & FEEDBACK SYSTEM */}
        {activeTab === 'issue-tracker' && (
          <motion.div
            key="issue-tracker"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <IssueTrackerView lang={lang} />
          </motion.div>
        )}

        {/* CLASS FORUMS SCREEN */}
        {activeTab === 'forum' && (
          <motion.div
            key="forum"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ForumView 
              lang={lang}
              currentUser={progress.username ? { username: progress.username, email: progress.email } : null}
              onAuthSuccess={(username, email) => {
                setProgress(prev => ({ ...prev, username, email }));
              }}
              onNavigateToTab={(tab) => {
                setActiveTab(tab as any);
              }}
            />
          </motion.div>
        )}

        {/* INTERACTIVE LEGAL & HONOR CHARTERS CODES */}
        {(activeTab === 'privacy' || activeTab === 'terms' || activeTab === 'academic') && (
          <motion.div
            key="legal-docs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <LegalDocsView 
              lang={lang}
              initialDoc={activeTab as 'privacy' | 'terms' | 'academic'}
              onBackToHome={() => setActiveTab('home')}
            />
          </motion.div>
        )}

        </AnimatePresence>
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-12 border-t border-slate-800 text-xs font-semibold">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="font-extrabold text-white tracking-tight text-sm inline-flex items-center gap-1">
              <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[11px] font-bold">ع</span>
              {labels.brand}
            </p>
            <p className="text-slate-500 text-[10px] max-w-sm mt-1 leading-normal text-right">
              {labels.footerText}
            </p>
          </div>
          <div className="flex gap-6 text-[11px] text-slate-500 font-sans">
            <button onClick={() => setActiveTab('terms')} className="hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-0 text-slate-500 font-semibold text-xs">Terms of Service</button>
            <button onClick={() => setActiveTab('academic')} className="hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-0 text-slate-500 font-semibold text-xs">Academic Integrity</button>
            <button onClick={() => setActiveTab('privacy')} className="hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-0 text-slate-500 font-semibold text-xs">Privacy Policy</button>
          </div>
          <p className="text-slate-600 text-[11px] font-mono leading-none">&copy; 2026 {labels.brand}. {labels.copyright}</p>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION REMOVED PER REQUEST */}

      {/* SCROLL-TO-TOP FLOATING STICKER */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={`fixed bottom-20 md:bottom-8 ${lang === 'ar' ? 'left-6' : 'right-6'} bg-amber-600 hover:bg-amber-750 text-white p-3 rounded-full shadow-lg z-50 border border-amber-500 transition-all cursor-pointer`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* REAL-TIME NOTIFICATION POPUP PANEL */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            key="live-toast"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 ${lang === 'ar' ? 'left-6 md:left-12' : 'right-6 md:right-12'} max-w-sm w-[90%] md:w-96 bg-slate-900 border border-emerald-500/35 text-white rounded-2xl p-4.5 shadow-2xl z-[100] flex gap-3.5`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shrink-0 text-white">
              <Bell className="w-4.5 h-4.5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-black tracking-tight text-emerald-400 block font-sans truncate">
                  {liveToast.title}
                </span>
                <button 
                  onClick={() => setLiveToast(null)} 
                  className="text-slate-400 hover:text-white transition-all text-[9px] uppercase font-mono px-2 py-0.5 bg-slate-800 rounded-md shrink-0"
                >
                  Clear
                </button>
              </div>
              <p className="text-[10px] text-slate-300 font-sans leading-tight mt-1 text-left">
                {liveToast.body}
              </p>
              <span className="text-[8px] text-slate-500 font-mono block mt-2 text-left">
                Live Alert Socket • Just Now
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT GLOBAL MINI PLAYER FOR BACKGROUND QURAN READING */}
      <AnimatePresence>
        {globalAudio && activeTab !== 'quran' && (
          <motion.div
            key="global-mini-player"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl z-50 p-4 font-sans flex items-center justify-between gap-3"
            id="global-mini-audio-container"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md animate-pulse shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="font-sans text-xs font-bold text-slate-800 dark:text-slate-150 truncate">
                  {globalAudio.surahName}
                  {globalAudio.playMode === 'verse_by_verse' && globalAudio.ayahNumber > 0 && (
                    <span className="ml-1 text-amber-600 dark:text-amber-400 font-mono">
                      • {lang === 'en' ? 'Verse' : 'آية'} {globalAudio.ayahNumber}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {globalAudio.reciterName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleMiniToggle}
                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md hover:scale-105 transition active:scale-95 cursor-pointer flex items-center justify-center"
                title={globalAudio.isPlaying ? "Pause" : "Play"}
              >
                {globalAudio.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleMiniNext}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-300 rounded-full transition active:scale-95 cursor-pointer flex items-center justify-center"
                title="Play Next Verse"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleMiniStop}
                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-full transition active:scale-95 cursor-pointer flex items-center justify-center"
                title="Stop Audio"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BEAUTIFUL STUNNING INTERACTIVE ADHAN MODAL OVERLAY */}
      <AnimatePresence>
        {showAdhanModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/85 backdrop-blur-md p-4 animate-fade-in" id="adhan-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-emerald-950 border border-amber-500/40 rounded-[32px] p-6 text-center relative overflow-hidden shadow-2xl"
              style={{
                backgroundImage: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.15), transparent 70%)',
              }}
              id="adhan-modal-card"
            >
              {/* Decorative top Islamic arch */}
              <div className="mx-auto w-24 h-12 bg-amber-500/10 border border-amber-500/20 border-b-0 rounded-t-full flex items-end justify-center pb-1">
                <span className="text-amber-500 text-lg">🕌</span>
              </div>

              <div className="space-y-1 mt-4">
                <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-extrabold px-3 py-1 bg-amber-500/10 rounded-full inline-block">
                  {lang === 'en' ? 'Call to Prayer' : 'أذان الصلاة'}
                </span>
                <h2 className="text-2xl font-serif font-semibold text-amber-400 mt-2">
                  {lang === 'en' ? `${activeAdhanName} Adhan` : `أذان صلاة ${activeAdhanLabelAr}`}
                </h2>
                <p className="text-xs text-zinc-400">
                  {lang === 'en' ? 'Live soul-stirring recitation' : 'النداء الخالد للصلوات المفروضة'}
                </p>
              </div>

              {/* Calligraphy illustration placeholder / animated wave */}
              <div className="my-6 py-8 px-4 bg-emerald-900/30 rounded-2xl border border-emerald-500/10 flex flex-col items-center justify-center space-y-4">
                <span className="text-4xl font-serif text-emerald-400 tracking-widest leading-relaxed">
                  حَيَّ عَلَى الصَّلَاةِ
                </span>
                
                {/* Waving Sound Bar Visualizer */}
                {adhanPlaying ? (
                  <div className="flex items-end justify-center gap-1.5 h-10 w-32">
                    <span className="w-1.5 bg-amber-500 rounded-full animate-[ping_1.2s_infinite] h-8" />
                    <span className="w-1.5 bg-amber-400 rounded-full animate-[ping_0.8s_infinite] h-4" />
                    <span className="w-1.5 bg-amber-500 rounded-full animate-[ping_1s_infinite] h-10" />
                    <span className="w-1.5 bg-amber-300 rounded-full animate-[ping_1.4s_infinite] h-6" />
                    <span className="w-1.5 bg-amber-500 rounded-full animate-[ping_0.9s_infinite] h-8" />
                  </div>
                ) : (
                  <div className="flex items-end justify-center gap-1.5 h-10 w-32 opacity-40">
                    <span className="w-1.5 bg-zinc-600 rounded-full h-2" />
                    <span className="w-1.5 bg-zinc-600 rounded-full h-2" />
                    <span className="w-1.5 bg-zinc-600 rounded-full h-2" />
                    <span className="w-1.5 bg-zinc-600 rounded-full h-2" />
                    <span className="w-1.5 bg-zinc-600 rounded-full h-2" />
                  </div>
                )}
              </div>

              {/* Translation list of Adhan phrases */}
              <div className="text-left bg-zinc-950/40 rounded-2xl p-4 max-h-[140px] overflow-y-auto text-xs text-zinc-300 space-y-2 border border-zinc-800 scrollbar-thin">
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-amber-500 font-bold">٢x اللَّهُ أَكْبَرُ</span>
                  <span>Allah is the Greatest (2x)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-emerald-400 font-bold">٢x أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ</span>
                  <span>I bear witness that there is no deity except Allah (2x)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-emerald-400 font-bold">٢x أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</span>
                  <span>I bear witness that Muhammad is the Messenger of Allah (2x)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-amber-500 font-bold">٢x حَيَّ عَلَى الصَّلَاةِ</span>
                  <span>Hasten to prayer (2x)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-amber-500 font-bold">٢x حَيَّ عَلَى الْفَلَاحِ</span>
                  <span>Hasten to success (2x)</span>
                </div>
                {activeAdhanName === 'Fajr' && (
                  <div className="flex justify-between border-b border-zinc-850 pb-1">
                    <span className="text-amber-400 font-bold">٢x الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ</span>
                    <span>Prayer is better than sleep (2x)</span>
                  </div>
                )}
                <div className="flex justify-between pb-1">
                  <span className="text-amber-500 font-bold">١x لَا إِلَهَ إِلَّا اللَّهُ</span>
                  <span>There is no deity except Allah (1x)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="adhan-toggle-play-btn"
                  onClick={() => {
                    if (adhanAudioRef.current) {
                      if (adhanPlaying) {
                        adhanAudioRef.current.pause();
                        setAdhanPlaying(false);
                      } else {
                        adhanAudioRef.current.play().catch(err => console.warn(err));
                        setAdhanPlaying(true);
                      }
                    }
                  }}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-amber-500/20"
                >
                  {adhanPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{lang === 'en' ? "Mute / Pause" : "إيقاف مؤقت"}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{lang === 'en' ? "Play Recitation" : "تشغيل الأذان"}</span>
                    </>
                  )}
                </button>

                <button
                  id="adhan-close-btn"
                  onClick={() => {
                    if (adhanAudioRef.current) {
                      adhanAudioRef.current.pause();
                    }
                    setShowAdhanModal(false);
                    setAdhanPlaying(false);
                  }}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold transition cursor-pointer active:scale-95"
                >
                  {lang === 'en' ? "Dismiss & Close" : "إغلاق نافذة الأذان"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
      {activeTab !== 'home' && activeTab !== 'dashboard' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-[80] flex items-center justify-around pb-safe pt-2 px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
          <button 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'home' && !mobileMenuOpen ? 'text-emerald-800' : 'text-slate-500 hover:text-emerald-700'}`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' && !mobileMenuOpen ? 'fill-emerald-100/50 stroke-2' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-bold mt-1 tracking-tight">{lang === 'en' ? 'Home' : 'الرئيسية'}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('curriculum'); setMobileMenuOpen(false); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'curriculum' && !mobileMenuOpen ? 'text-amber-800' : 'text-slate-500 hover:text-amber-700'}`}
          >
            <GraduationCap className={`w-5 h-5 ${activeTab === 'curriculum' && !mobileMenuOpen ? 'fill-amber-100/50 stroke-2' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-bold mt-1 tracking-tight">{labels.curriculum}</span>
          </button>

          {progress.username ? (
            <button 
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'dashboard' && !mobileMenuOpen ? 'text-emerald-900' : 'text-slate-500 hover:text-emerald-800'}`}
            >
              <div className="bg-emerald-50 w-10 h-10 -mt-6 rounded-full flex items-center justify-center shadow-sm border border-emerald-100">
                <span className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm border-2 border-white shadow-inner">
                  {progress.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] font-bold mt-0.5 tracking-tight text-emerald-800">{lang === 'en' ? 'Dash' : 'لوحة'}</span>
            </button>
          ) : (
            <button 
              onClick={() => { setActiveTab('daily'); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'daily' && !mobileMenuOpen ? 'text-blue-800' : 'text-slate-500 hover:text-blue-700'}`}
            >
              <Clock className={`w-5 h-5 ${activeTab === 'daily' && !mobileMenuOpen ? 'fill-blue-100/50 stroke-2' : 'stroke-1.5'}`} />
              <span className="text-[10px] font-bold mt-1 tracking-tight">{labels.daily}</span>
            </button>
          )}

          <button 
            onClick={() => { setActiveTab('quran'); setMobileMenuOpen(false); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'quran' && !mobileMenuOpen ? 'text-teal-800' : 'text-slate-500 hover:text-teal-700'}`}
          >
            <BookOpen className={`w-5 h-5 ${activeTab === 'quran' && !mobileMenuOpen ? 'fill-teal-100/50 stroke-2' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-bold mt-1 tracking-tight">{labels.quran}</span>
          </button>

          <button 
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${mobileMenuOpen ? 'text-indigo-800' : 'text-slate-500 hover:text-indigo-700'}`}
          >
            <Menu className={`w-5 h-5 ${mobileMenuOpen ? 'stroke-2' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-bold mt-1 tracking-tight">{lang === 'en' ? 'Menu' : 'المزيد'}</span>
          </button>
        </div>
      )}

    </div>
    </>
  );
}
