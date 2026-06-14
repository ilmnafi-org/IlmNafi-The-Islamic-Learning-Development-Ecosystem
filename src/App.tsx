/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Sliders,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  Lock,
  Terminal
} from 'lucide-react';

import CurriculumView from './components/CurriculumView';
import AICoachView from './components/AICoachView';
import QuranExplorer from './components/QuranExplorer';
import ScholarshipsView from './components/ScholarshipsView';
import SavedScholarshipsView from './components/SavedScholarshipsView';
import CommunityHubView from './components/CommunityHubView';
import { ScholarlyView } from './components/ScholarlyView';
import { DailyView } from './components/DailyView';
import { ForumView } from './components/ForumView';
import AuthPage from './components/AuthPage';
import { DeenSuite } from './components/DeenSuite';
import StudentDashboard from './components/StudentDashboard';
import NotificationsView from './components/NotificationsView';
import SettingsView from './components/SettingsView';
import LegalDocsView from './components/LegalDocsView';
import ApiDocsView from './components/ApiDocsView';
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
  // Navigation active tab: 'home' | 'curriculum' | 'coach' | 'daily' | 'scholarly' | 'forum' | 'scholarships' | 'auth' | 'saved-scholarships' | 'community' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'home' | 'curriculum' | 'coach' | 'quran' | 'daily' | 'scholarly' | 'forum' | 'scholarships' | 'auth' | 'saved-scholarships' | 'community' | 'dashboard' | 'settings' | 'notifications' | 'privacy' | 'terms' | 'academic'>('home');
  const [lang, setLang] = useState<'ar' | 'en'>('ar'); // Default mainly Arabic content preference
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adhkarDrawerActive, setAdhkarDrawerActive] = useState<'tasbih' | 'prayers' | 'dua' | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [loadingQuoteIdx] = useState(() => Math.floor(Math.random() * WISDOM_QUOTES.length));
  
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
                ? "This secure page requires Al-Hikmah scholar authentication credentials to load. Sign in to your verified account to access notifications, study progress, and personalization."
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

  // New interactive states for newly added rich landing page sections
  const [activeTimelineEpoch, setActiveTimelineEpoch] = useState<number>(0);
  const [dailyCommitMinutes, setDailyCommitMinutes] = useState<number>(30);
  const [planFocus, setPlanFocus] = useState<'tajweed' | 'jurisprudence' | 'history' | 'scholarships'>('tajweed');

  // Dynamic Planner Computation helper
  const getPlannerResults = (minutes: number, focus: 'tajweed' | 'jurisprudence' | 'history' | 'scholarships') => {
    const weeklyLessons = Math.floor((minutes * 7) / 25) || 1;
    const audioMinutes = Math.floor((minutes * 7) * 0.4) || 2;
    const completionWeeks = focus === 'tajweed' ? 6 : focus === 'jurisprudence' ? 8 : focus === 'history' ? 4 : 5;
    
    // Syllabus points for planner card
    const syllabusPoints = {
      ar: focus === 'tajweed' 
        ? ["مخارج الحروف الأساسية (الحلق والشفة)", "أحكام التنوين والإدغام البغني", "قواعد طلاقة القراءة ومداواة اللحن"]
        : focus === 'jurisprudence'
        ? ["مقدمات في أصول الفقه المنهجي", "دراسة المذاهب الأربعة وأحكام الطهارة", "الإجماع السنوي وفقه النوازل المعاصر"]
        : focus === 'history'
        ? ["نشأة بيت الحكمة في بغداد", "علماء الفيزياء في الأندلس والشام", "التراجم الرياضية من الخوارزمي لابن الهيثم"]
        : ["شروط المنح الدراسية بالبنك الإسلامي وتجهيز السيرة", "البحث والتصفية بالمنطقة الجغرافية", "كتابة خطاب الغرض المالي المعتمد"],
      en: focus === 'tajweed'
        ? ["Accoustic Makhārij of guttural vowels", "Rules of Nun Sakinah & Tanween blending", "Fluency strategies to eliminate oral mistakes"]
        : focus === 'jurisprudence'
        ? ["Foundations of comparative law schools", "Study of classical rulings of rituals", "Consensus rulings in contemporary situations"]
        : focus === 'history'
        ? ["The translation epoch in Baghdad", "Physics research in Levant & Andalusia", "Mathematical texts from Arab scientists"]
        : ["Requirements of IsDB research grants", "Filtering grants based on global scopes", "Writing development statements for universities"]
    }[lang];

    return { weeklyLessons, audioMinutes, completionWeeks, syllabusPoints };
  };

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
            notifications: session.notifications ?? []
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
            console.log("WebSocket connected to Al-Hikmah live-alert router.");
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
            notifications: session.notifications ?? []
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
      ctaStart: "Recitation Coach",
      ctaCurriculum: "Explore Curriculum",
      curriculum: "Curriculum",
      coach: "AI Reciter",
      quran: "Quran Browser",
      daily: "Dhikr & Tasbih",
      scholarly: "Ask the Mufti",
      forum: "Class Forums",
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
      footerText: "Ilm Naafi Academy is built as an open consensus academy. Empowering pristine pronunciations and academic equity.",
      copyright: "All Rights Reserved."
    },
    ar: {
      brand: "مِنصَّة العلم النافع",
      desc: "جامعة التعليم الإسلامي المفتوح",
      tagline: "قنوات العلوم الشريفة وفنون التلاوة الصوتية بالذكاء الاصطناعي",
      subtitle: "نظام أكاديمي موحد يربط متعلمي العلوم المنهجية (فقه، عقيدة، وسيرة)، وأدوات تصحيح التجويد لآيات الذكر الحكيم، وقاعدة بيانات المنح الموثقة مجاناً بالكامل.",
      ctaStart: "مصحح المخارج الفوري",
      ctaCurriculum: "تصفح المناهج العلمية",
      curriculum: "مناهج التعليم",
      coach: "مصحح التلاوة",
      quran: "القرآن الكريم",
      daily: "الأوراد والتسابيح",
      scholarly: "استشر المفتي",
      forum: "مجلس الطلاب",
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
            className="fixed inset-0 bg-gradient-to-br from-[#06241c] to-[#0c1412] text-white flex flex-col items-center justify-center z-[9999] p-6 select-none"
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
                  <span>Al-Hikmah / جاري التحضير</span>
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
      
      {/* FLOATING TOP NAVBAR */}
      <nav 
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl bg-white/95 backdrop-blur-md border border-slate-200/95 rounded-2xl shadow-lg z-50 transition-all h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between" 
        id="app-floating-navbar"
      >
        {/* Brand identity logo */}
        <button 
          onClick={() => { setActiveTab('home'); setShowMoreNav(false); }} 
          className="font-extrabold text-[#004d3d] tracking-tight cursor-pointer py-1 text-left flex items-center gap-2 outline-none focus:outline-none shrink-0"
          id="brand-logo"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-700/10 flex items-center justify-center text-amber-800 font-extrabold border border-amber-850/15 shrink-0">
            ع
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-sm md:text-base font-extrabold">{labels.brand}</span>
            <span className="text-[9px] text-amber-800 font-semibold mt-0.5">{labels.desc}</span>
          </div>
        </button>
        
        {/* Centered Desktop Navigation Links */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-1.5 xl:gap-2 font-medium text-[11.5px] xl:text-[12.5px] whitespace-nowrap py-1 px-4 border-l border-r border-slate-100/85 mx-4" id="desktop-nav-links-center">
          <button 
            onClick={() => { setActiveTab('curriculum'); setShowMoreNav(false); }}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
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
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
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
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              activeTab === 'quran' 
                ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-550/15' 
                : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
            }`}
            id="nav-quran"
          >
            {labels.quran}
          </button>
          <button 
            onClick={() => { setActiveTab('daily'); setShowMoreNav(false); }}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              activeTab === 'daily' 
                ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
            }`}
            id="nav-daily"
          >
            {labels.daily}
          </button>
          <button 
            onClick={() => { setActiveTab('scholarly'); setShowMoreNav(false); }}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              activeTab === 'scholarly' 
                ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
            }`}
            id="nav-scholarly"
          >
            {labels.scholarly}
          </button>

          {/* More Academy Platforms Popover Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowMoreNav(true)}
            onMouseLeave={() => setShowMoreNav(false)}
          >
            <button
              onClick={() => setShowMoreNav(!showMoreNav)}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1 border ${
                showMoreNav || ['forum', 'scholarships', 'saved-scholarships', 'community', 'api-docs', 'notifications', 'settings'].includes(activeTab)
                  ? 'text-amber-900 bg-amber-50/90 border-amber-200/60 font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border-transparent'
              }`}
              id="nav-more-dropdown"
            >
              <span>{lang === 'en' ? "Platforms Hub" : "بوابات ومصادر"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreNav ? 'rotate-180 text-amber-700' : 'text-slate-400'}`} />
            </button>

            <AnimatePresence>
              {showMoreNav && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute ${lang === 'ar' ? 'left-auto right-0' : 'right-auto left-0'} mt-2 w-72 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-2.5 z-[100] gap-0.5 flex flex-col`}
                  id="nav-more-dropdown-panel"
                >
                  <button 
                    onClick={() => { setActiveTab('forum'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'forum' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                    id="nav-forum"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-800 shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px]">{labels.forum}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Discuss academic topics" : "نقاشات ومجالس علمية"}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('scholarships'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'scholarships' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                    id="nav-scholarships"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-800 shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px]">{labels.scholarships}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Explore academic grants" : "قاعدة بيانات المنح الموثقة"}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('saved-scholarships'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'saved-scholarships' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                    id="nav-saved-scholarships"
                  >
                    <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-800 shrink-0">
                      <Bookmark className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px]">{labels.savedHub}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Your bookmarked grants" : "فرص المنح المحفوظة"}
                      </span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('community'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'community' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                    id="nav-community"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-800 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px]">{labels.openSource}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Contribute to resources" : "المساهمة البرمجية المفتوحة"}
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
                    id="nav-api-docs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-800 shrink-0">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px]">{labels.apiDocs}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Developer credentials" : "بوابات الربط البرمجي"}
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
                    id="nav-notifications"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-800 shrink-0">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
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
                    onClick={() => { setActiveTab('settings'); setShowMoreNav(false); }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      activeTab === 'settings' 
                        ? 'bg-amber-500/10 text-amber-955 font-extrabold' 
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                    id="nav-settings"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-800 shrink-0">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px]">{labels.settings}</span>
                      <span className="text-[9.5px] text-slate-400 truncate font-normal">
                        {lang === 'en' ? "Preferences & configs" : "إعدادات الهوية والمنصة"}
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
          
          {/* Languange switcher toggle */}
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
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2 font-bold text-xs text-slate-800 transition shadow-sm outline-none"
                id="btn-profile-dropdown"
              >
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>{progress.username}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              
              {showProfileDropdown && (
                <div 
                  className={`absolute mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 space-y-4 z-50 text-xs animate-fadeIn ${
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
                      <span className="text-slate-550 text-slate-500 font-medium flex items-center gap-1.5">
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
                      className="w-full h-10 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-205/30 rounded-xl transition-colors font-extrabold text-[11px] text-amber-950 flex items-center justify-between cursor-pointer"
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

          {/* Trigger list and mobile navigation bar */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 lg:hidden focus:outline-none cursor-pointer"
            id="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
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
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white border-t border-slate-200 shadow-2xl rounded-t-[2.5rem] p-6 pb-12 z-50 flex flex-col lg:hidden overflow-y-auto"
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

              <div className="grid grid-cols-2 gap-3 pb-6">
                {[
                  { id: 'curriculum', label: labels.curriculum, icon: BookOpen, color: 'text-amber-800 bg-amber-500/10' },
                  { id: 'coach', label: labels.coach, icon: Mic, color: 'text-emerald-800 bg-emerald-500/10' },
                  { id: 'quran', label: labels.quran, icon: BookOpen, color: 'text-teal-800 bg-teal-500/10' },
                  { id: 'daily', label: labels.daily, icon: Clock, color: 'text-blue-800 bg-blue-500/10' },
                  { id: 'scholarly', label: labels.scholarly, icon: Compass, color: 'text-purple-800 bg-purple-500/10' },
                  { id: 'forum', label: labels.forum, icon: MessageSquare, color: 'text-sky-800 bg-sky-500/10' },
                  { id: 'scholarships', label: labels.scholarships, icon: Award, color: 'text-rose-800 bg-rose-500/10' },
                  { id: 'saved-scholarships', label: labels.savedHub, icon: Bookmark, color: 'text-yellow-800 bg-yellow-500/10' },
                  { id: 'community', label: labels.openSource, icon: Sparkles, color: 'text-teal-800 bg-teal-500/10' },
                  { id: 'api-docs', label: labels.apiDocs, icon: Terminal, color: 'text-emerald-800 bg-emerald-500/10' },
                  { id: 'notifications', label: labels.notifications, icon: Bell, color: 'text-amber-700 bg-amber-500/10' },
                  { id: 'settings', label: labels.settings, icon: Settings, color: 'text-emerald-700 bg-emerald-500/10' },
                  ...(progress.username ? [{ id: 'dashboard', label: lang === 'en' ? "Workspace Dashboard" : "لوحة المتعلم الموحدة", icon: GraduationCap, color: 'text-amber-900 bg-amber-500/20' }] : [])
                ].map(item => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all w-full cursor-pointer gap-2 ${
                        isActive 
                          ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-black shadow-inner' 
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-bold leading-tight block truncate max-w-full">{item.label}</span>
                    </button>
                  );
                })}
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
              className="relative overflow-hidden py-24 md:py-36 text-center px-4 rounded-[2rem] w-[94%] max-w-7xl mx-auto bg-cover bg-center text-white"
              style={{
                backgroundImage: "linear-gradient(to bottom, rgba(7, 28, 23, 0.94), rgba(12, 20, 18, 0.88)), url('https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1600')"
              }}
              id="hero-majestic-block"
            >
              <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                
                {/* Globe sticker container with gold badges */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span className="font-bold text-[10px] text-amber-200 uppercase tracking-widest font-sans">
                    {labels.tagline}
                  </span>
                </div>

                <h1 className="font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-none font-sans drop-shadow-sm max-w-3xl">
                  {lang === 'en' ? "Beneficial Knowledge." : "طلبُ العِلْمِ فَرِيضَة"}
                </h1>
                
                <p className="text-emerald-100/80 font-medium text-sm md:text-base max-w-2xl mt-5 leading-relaxed font-sans">
                  {labels.subtitle}
                </p>

                {/* Sub-banner layout action triggers */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                  <button 
                    onClick={() => { setActiveTab('coach'); }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-wide transition shadow-sm cursor-pointer border border-amber-600"
                    id="hero-btn-learning"
                  >
                    {labels.ctaStart}
                  </button>
                  <button 
                    onClick={() => { setActiveTab('curriculum'); }}
                    className="border border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-wide transition backdrop-blur cursor-pointer"
                    id="hero-btn-curriculum"
                  >
                    {labels.ctaCurriculum}
                  </button>
                </div>

              </div>
            </section>

            {/* PLATFORM VALUE PILLARS & FEATURES MATRIX */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12" id="platform-value-pillars">
              <div className="text-center space-y-2 mb-8">
                <span className="text-[10px] font-black text-[#C59B32] uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 font-sans">
                  {lang === 'en' ? "✨ Authentic Core Pillars" : "✨ ركائز التعليم الصحيح"}
                </span>
                <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed font-sans">
                  {lang === 'en' 
                    ? "Interactive departments crafted with precision to cultivate authentic education of classical Islamic traditions." 
                    : "منصات ومصادر تخصصية تهدف إلى تمكين المعرفة وبناء الفهم الشرعي واللفظي القويم."}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                
                {/* PILLAR 1: SPEECH RECITATION COACH */}
                <div className="bg-white border border-slate-200/80 hover:border-amber-500/30 hover:shadow-xs p-5 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 transition group">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Mic className="w-5 h-5 text-amber-800" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-amber-950 font-sans">
                      {lang === 'en' ? "AI Speech Coach" : "مصحح التلاوة الذكي"}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-w-[170px] mx-auto">
                      {lang === 'en'
                        ? "Real-time voice alignment and Tajweed feedback."
                        : "تتبع مخارج الحروف غيباً وتصحيح الترتيل فورياً."}
                    </p>
                  </div>
                </div>

                {/* PILLAR 2: SHARIAH CURRICULUMS */}
                <div className="bg-white border border-slate-200/80 hover:border-emerald-500/30 hover:shadow-xs p-5 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 transition group">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <GraduationCap className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-emerald-950 font-sans">
                      {lang === 'en' ? "Classic Curriculums" : "المناهج التأصيلية"}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-w-[170px] mx-auto">
                      {lang === 'en'
                        ? "Vetted Islamic history, jurisprudence, and Tajweed lessons."
                        : "دروس العقيدة والفقه وتراجم الأئمة لمختلف المستويات."}
                    </p>
                  </div>
                </div>

                {/* PILLAR 3: DAILY SUPPLICATIONS */}
                <div className="bg-white border border-slate-200/80 hover:border-blue-500/30 hover:shadow-xs p-5 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 transition group">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-800 border border-blue-500/25 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Clock className="w-5 h-5 text-blue-800" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-blue-950 font-sans">
                      {lang === 'en' ? "Dhikr & Supplications" : "أوراد اليوم والليلة"}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-w-[170px] mx-auto">
                      {lang === 'en'
                        ? "Digital Tasbih counter with live Qiblah compass check."
                        : "مسبحة إلكترونية ونظام تتبع النوافل والقبلة."}
                    </p>
                  </div>
                </div>

                {/* PILLAR 4: SCHOLARLY INQUIRIES */}
                <div className="bg-white border border-slate-200/80 hover:border-purple-500/30 hover:shadow-xs p-5 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 transition group">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-800 border border-purple-500/25 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Compass className="w-5 h-5 text-purple-800" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-purple-950 font-sans">
                      {lang === 'en' ? "Ask the Mufti Center" : "الإرشاد والفتوى الشرعية"}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-w-[170px] mx-auto">
                      {lang === 'en'
                        ? "Submit complex juristic inquiries matching canonical consensus."
                        : "إرسال المسائل الفقهية وتلقي توجيه الأئمة الفقهاء."}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* INTERACTIVE NAVIGATION TERMINAL (UX DIRECTION BLOCK) */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12" id="platform-navigation-terminal">
              <div className="bg-[#FAF8F5] border-2 border-[#073327]/10 rounded-[2rem] p-6 md:p-10 shadow-xs space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C59B32]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-800/5 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#073327]/5 pb-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-md border border-amber-200" style={{ letterSpacing: '0.15em' }}>
                      {lang === 'en' ? "🎓 DIRECT PORTAL SYSTEM" : "الأروقة التعليمية والربط السريع"}
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 font-sans tracking-tight">
                      {lang === 'en' ? "Where would you like to build your knowledge today?" : "ماذا تود أن تتعلم وتستكشف اليوم؟"}
                    </h2>
                    <p className="text-slate-500 text-xs">
                      {lang === 'en' 
                        ? "Select any department below to open its dedicated interactive workspace." 
                        : "اضغط على أي منبر أدناه للانتقال الفوري إلى بيئة العمل والتحقق الفقهية والصوتية الخاصة به."}
                    </p>
                  </div>

                  {/* Student ID badge indicator status sync */}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-2xs shrink-0 select-none">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-slate-800">
                      {progress.username 
                        ? (lang === 'en' ? `Connected: ${progress.username}` : `مرحباً بك: ${progress.username}`) 
                        : (lang === 'en' ? "Accessing as Guest Student" : "ولوج بصفة زائر")}
                    </span>
                  </div>
                </div>

                {/* Redesigned Clean Icon-Based Portals Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                  
                  {/* PORTAL 1: HOLY QURAN */}
                  <div 
                    onClick={() => setActiveTab('quran')}
                    className="bg-white border border-slate-250/75 hover:border-amber-600 hover:shadow-md rounded-[1.75rem] p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-quran"
                  >
                    <div className="absolute top-1.5 right-1.5 bg-amber-150 text-[#C59B32] font-black text-[7px] tracking-widest px-1.5 py-0.5 rounded-full uppercase scale-90">NEW</div>
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

                  {/* PORTAL 2: EDUCATION CURRICULUMS */}
                  <div 
                    onClick={() => setActiveTab('curriculum')}
                    className="bg-white border border-slate-250/75 hover:border-emerald-600 hover:shadow-md rounded-[1.75rem] p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-curriculum"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <GraduationCap className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-800 leading-tight font-sans">
                        {lang === 'en' ? "Curriculums" : "المناهج التأصيلية"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "K-12 Syllabus" : "دروس العقيدة والفقه"}
                      </p>
                    </div>
                  </div>

                  {/* PORTAL 3: AI RECITATION COACH */}
                  <div 
                    onClick={() => setActiveTab('coach')}
                    className="bg-white border border-slate-250/75 hover:border-emerald-750 hover:shadow-md rounded-[1.75rem] p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-coach"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <Mic className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 leading-tight font-sans">
                        {lang === 'en' ? "Recitation Coach" : "مصحح المخارج"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "Real-time AI" : "تحليل مخارج الصوت غيباً"}
                      </p>
                    </div>
                  </div>

                  {/* PORTAL 4: IKHLAS DAILY TOOLS */}
                  <div 
                    onClick={() => setActiveTab('daily')}
                    className="bg-white border border-slate-250/75 hover:border-blue-600 hover:shadow-md rounded-[1.75rem] p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
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

                  {/* PORTAL 5: ASK THE MUFTI */}
                  <div 
                    onClick={() => setActiveTab('scholarly')}
                    className="bg-white border border-slate-250/75 hover:border-purple-600 hover:shadow-md rounded-[1.75rem] p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-scholarly"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <Compass className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-purple-800 leading-tight font-sans">
                        {lang === 'en' ? "Ask the Mufti" : "إرشاد الفتوى"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "Scholarly Advice" : "مسائل الفقه المقارن"}
                      </p>
                    </div>
                  </div>

                  {/* PORTAL 6: IVY SCHOLARSHIPS REGISTRY */}
                  <div 
                    onClick={() => setActiveTab('scholarships')}
                    className="bg-white border border-slate-250/75 hover:border-amber-600 hover:shadow-md rounded-[1.75rem] p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    id="terminal-portal-scholarships"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                      <Award className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-850 leading-tight font-sans">
                        {lang === 'en' ? "Scholarships" : "بوابة المنح"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">
                        {lang === 'en' ? "Global Registry" : "فرص التمويل والدراسة"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION 1: DAILY WISDOM REMINDER (NEW ADDED SECTION) */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12">
              <div 
                className="bg-gradient-to-tr from-[#FAF8F5] to-[#FCFAF6] border-2 border-amber-800/10 rounded-2rem p-8 md:p-12 relative overflow-hidden"
                id="interactive-daily-wisdom-sec"
              >
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-5 pointer-events-none scale-150">
                  <Sparkles className="w-96 h-96 text-amber-800" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                  <span className="text-xs font-bold text-amber-850 uppercase tracking-widest bg-amber-100/60 px-3.5 py-1.5 rounded-full border border-amber-200/50 inline-block mb-2">
                    ✦ {labels.wisdomHeading} ✦
                  </span>

                  <p className="text-2xl md:text-4xl text-slate-900 leading-tight font-serif font-bold italic" dir="rtl">
                    {WISDOM_QUOTES[wisdomIdx].ar}
                  </p>

                  <p className="text-xs md:text-sm text-slate-600 font-sans italic max-w-xl mx-auto">
                    "{WISDOM_QUOTES[wisdomIdx].en}"
                  </p>

                  <p className="text-[10px] font-bold text-amber-800 font-mono tracking-widest uppercase">
                    — {WISDOM_QUOTES[wisdomIdx].source}
                  </p>

                  <div className="pt-4">
                    <button
                      onClick={() => setWisdomIdx((wisdomIdx + 1) % WISDOM_QUOTES.length)}
                      className="px-5 py-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs transition-colors shadow-sm flex items-center gap-2 mx-auto"
                      id="btn-refresh-wisdom"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-700" />
                      <span>{labels.refreshWisdom}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* PILLARS PORTFOLIO TILES */}
            <section className="bg-slate-50/50 py-16 border-y border-slate-200/60">
              <div className="max-w-[1280px] mx-auto px-4 md:px-12">
                
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                    {lang === 'en' ? "Modular Academic Foundations" : "الأروقة الأكاديمية والخدمات التعليمية المتاحة"}
                  </h2>
                  <p className="text-slate-500 text-xs max-w-md mx-auto mt-2">
                    {lang === 'en' ? "Six dynamic support departments designed entirely to facilitate learning and development with zero cost barriers." : "ستة منابر متكاملة مخصصة لتمكين المتعلمين والباحثين من شتى أقطار العالم العربي والدولي."}
                  </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* TILE 1: CURRICULUM */}
                  <div 
                    onClick={() => { setActiveTab('curriculum'); }}
                    className="md:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 hover:border-amber-600 hover:shadow-lg transition relative overflow-hidden group cursor-pointer shadow-sm flex flex-col justify-between"
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
                      <p className="text-slate-605 text-slate-600 text-xs leading-relaxed max-w-md mb-8">
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
                    className="md:col-span-4 bg-[#073327] text-white rounded-3xl border border-[#0d4538] p-8 hover:shadow-lg transition relative overflow-hidden group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                        <Mic className="w-4 h-4 text-amber-400" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 font-sans">
                        {lang === 'en' ? "AI Recitation Coach" : "مصحح ومحقق تلاوة الذكر الحكيم"}
                      </h3>
                      <p className="text-emerald-100/80 text-xs leading-relaxed mb-6">
                        {lang === 'en'
                          ? "Pronounce letters, adjust Makhārij, and analyze oral fluency instantly using advanced audio telemetry vectors."
                          : "حلل نطقك ومخارج الحروف للأعيرة النطقية والتجويد في الحال وبأمان تام."}
                      </p>
                    </div>
                    <span className="bg-amber-600 text-white font-bold tracking-wider text-[10px] uppercase px-4 py-2.5 rounded-xl hover:bg-amber-700 transition w-fit shadow-sm">
                      {lang === 'en' ? "Open Coach" : "ابدأ تجربة المصحح"}
                    </span>
                  </div>

                  {/* TILE 3: DAILY SPRIITUAL BOARD */}
                  <div 
                    onClick={() => { setActiveTab('daily'); }}
                    className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 hover:border-amber-600 hover:shadow-lg transition cursor-pointer shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-800 mb-4 border border-amber-100">
                        <Clock className="w-4 h-4 text-amber-700" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2 font-sans">
                        {lang === 'en' ? "Daily Supplications & Tasbih" : "الأوراد والتسبيحات اليومية"}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {lang === 'en' ? "Interactive click Tasbih counter with audio feedbacks coupled with AI-powered Dua intention composer." : "عداد تسبيح رقمي مع مؤثرات تفاعلية، ومصمم أدعية يعتمد على رغبة وغايات المتعلم الفردية."}
                      </p>
                    </div>
                    <span className="text-amber-800 text-[11px] font-bold uppercase mt-4 block">{lang === 'en' ? "Plan Daily Board" : "صمم وردك اليومي"} →</span>
                  </div>

                  {/* TILE 4: ASK THE MUFTI */}
                  <div 
                    onClick={() => { setActiveTab('scholarly'); }}
                    className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 hover:border-amber-600 hover:shadow-lg transition cursor-pointer shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-800 mb-4 border border-amber-100">
                        <Compass className="w-4 h-4 text-amber-700" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2 font-sans">
                        {lang === 'en' ? "Scholarly Q&A Hub" : "منبر المذاهب والمسائل العلمية"}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {lang === 'en' ? "Sift theological answers from classical Islamic authorities. Get academic feedback pointing to canonical consensus." : "ناقش المسائل الفلسفية والتفاسير المعقدة عبر المذاهب الأربعة بإشراف معايير دقيقة."}
                      </p>
                    </div>
                    <span className="text-amber-800 text-[11px] font-bold uppercase mt-4 block">{lang === 'en' ? "Submit Inquiry" : "استشارة العلماء"} →</span>
                  </div>

                  {/* TILE 5: DISCUSSION SPACE */}
                  <div 
                    onClick={() => { setActiveTab('forum'); }}
                    className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 hover:border-amber-600 hover:shadow-lg transition cursor-pointer shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-800 mb-4 border border-amber-100">
                        <MessageSquare className="w-4 h-4 text-amber-700" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2 font-sans">
                        {lang === 'en' ? "Open Student Forums" : "منتدى البحوث الطلابية"}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {lang === 'en' ? "Converse about pronunciation rhythms, university requirements, and share Golden Age review links." : "تبادل الشروح الفقهية، مراجع السير، والبحث مع زملاء التخصص العلمي والجامعي."}
                      </p>
                    </div>
                    <span className="text-amber-800 text-[11px] font-bold uppercase mt-4 block">{lang === 'en' ? "Converse Forums" : "ادخل غرف النقاش"} →</span>
                  </div>

                  {/* TILE 6: SCHOLARSHIPS HUB */}
                  <div 
                    onClick={() => { setActiveTab('scholarships'); }}
                    className="md:col-span-12 bg-gradient-to-r from-amber-900/10 via-emerald-900/15 to-[#faf8f5] rounded-3xl border border-amber-900/15 p-6 md:p-8 hover:border-amber-600 hover:shadow-lg transition cursor-pointer shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-850 border border-amber-200/60 shadow-xs">
                          <Award className="w-4 h-4 text-amber-700" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-900 uppercase font-mono tracking-wider">
                          {lang === 'en' ? "Global Ivy Seminary Registry" : "بوابة المنح والبعثات الدراسية العالمية"}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 font-sans leading-none">
                        {lang === 'en' ? "Academics & Financial Aid Center" : "منبر التمويل وصندوق رعاية المتفوقين"}
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed max-w-xl">
                        {lang === 'en' 
                          ? "Apply to fully funded undergraduate, graduate, and research grants worldwide. Filter live opportunities and curate your personal academic record history in-memory." 
                          : "استعرض وحلّل منحة دراسية وبحثية ممولة بالكامل لدى الجامعات الشريكة. احفظ المباحث العلمية المفضلة لديك لفرزها لاحقاً وتوثيق التقديم الفقهي الميسر."}
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-wrap items-center gap-3">
                      <div className="bg-white/75 border border-amber-200 py-2.5 px-4 rounded-xl text-center text-slate-800 font-bold text-xs shadow-inner">
                        <span className="text-amber-850 font-black">{progress.savedScholarships.length}</span> {lang === 'en' ? " Saved Opportunities" : " أبحاث ومنح محفوظة"}
                      </div>
                      <span className="bg-emerald-850 hover:bg-emerald-950 text-white font-bold tracking-wider text-[11px] uppercase px-5 py-3 rounded-xl transition shadow-md whitespace-nowrap cursor-pointer">
                        {lang === 'en' ? "Registry Portal" : "دخول ديوان المنح"} →
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* REDUCED CLEAN REAL-TIME REMINDER CARD */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-4" id="salah-reminders-panel">
              <div className="bg-gradient-to-br from-[#041d18] to-[#020b08] text-white rounded-2xl p-4 md:p-6 border border-emerald-950/60 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest text-[#d97706] font-mono font-bold block">
                      ✦ {lang === 'en' ? "Astronomy & Liturgical Alignment" : "اتجاه القبلة ومواقيت الفريضة"} ✦
                    </span>
                    <h4 className="text-sm font-extrabold text-white font-sans">
                      {lang === 'en' ? "Salah Times & Qiblah Features" : "رصد أوقات الصلوات والقبلة الرقمية"}
                    </h4>
                    <p className="text-zinc-400 text-[10px] max-w-md font-sans">
                      {lang === 'en' 
                        ? "Real-time calculation based on global astronomical coordinate equations."
                        : "حساب فلكي دقيق لدوائر العرض مبني على المعادلات المعيارية للرابطة الإسلامية."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    {/* Qiblah Feature Item */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 shrink-0">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-mono font-black animate-pulse">
                        🧭
                      </span>
                      <div>
                        <span className="text-[8px] text-zinc-400 uppercase tracking-widest block font-mono">Qiblah</span>
                        <span className="text-[10px] font-bold text-white font-sans">
                          {landingQiblah !== null 
                            ? `${landingQiblah.toFixed(1)}° (${lang === 'en' ? 'Calculated' : 'رصد فلكي'})` 
                            : `57.3° NE (${lang === 'en' ? 'Makkah' : 'مكة المكرمة'})`
                          }
                        </span>
                      </div>
                    </div>

                    {/* Prayer Time Feature Item */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 shrink-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-black">
                        🕌
                      </span>
                      <div>
                        <span className="text-[8px] text-zinc-400 uppercase tracking-widest block font-mono">
                          {lang === 'en' ? "Next Prayer" : "الصلاة القادمة"}
                        </span>
                        <span className="text-[10px] font-bold text-white font-sans">
                          {landingNextPrayer 
                            ? `${lang === 'en' ? landingNextPrayer.name : (landingNextPrayer.name === 'Fajr' ? 'الفجر' : landingNextPrayer.name === 'Sunrise' ? 'الشروق' : landingNextPrayer.name === 'Dhuhr' ? 'الظهر' : landingNextPrayer.name === 'Asr' ? 'العصر' : landingNextPrayer.name === 'Maghrib' ? 'المغرب' : 'العشاء')} ${landingNextPrayer.time}` 
                            : `Dhuhr 12:24 PM`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>            {/* NEW SECTION 2B: THE ESSENTIAL LESSONS OF SALAH - Compact Responsive Columns */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-6" id="salah-lessons-suite">
              <div className="bg-[#FAF9F5] border border-amber-900/10 rounded-3xl p-5 md:p-6 shadow-xs">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-2 border-b border-amber-900/10 gap-2">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-900 bg-amber-100 py-0.5 px-2.5 rounded-full border border-amber-200 inline-block mb-1 font-sans">
                      {lang === 'en' ? "Essential Islamic Pillars" : "تعليم أركان العبادات ومبانيها"}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0c2420] tracking-tight">
                      {lang === 'en' ? "The Core Lessons of Prayer" : "دروس ومحاور الصلاة الجوهرية"}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('curriculum')}
                    className="text-[10px] font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer font-sans bg-transparent border-0 self-end sm:self-auto"
                  >
                    {lang === 'en' ? "View full study curriculum →" : "عرض المنهج الدراسي بالكامل ←"}
                  </button>
                </div>

                {/* Grid layout with 2 columns on mobile and 3 columns on tablet+ sizes as requested */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  
                  {/* Card 1: Conditions & Pillars */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-900/20 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 pb-1">
                        <span className="w-4 h-4 rounded bg-emerald-50 text-emerald-800 text-[9px] font-black flex items-center justify-center shrink-0 border border-emerald-100 font-sans">
                          ١
                        </span>
                        <h4 className="text-[11px] font-extrabold text-slate-900 font-sans leading-tight">
                          {lang === 'en' ? "Canonical Pillars" : "الشروط والأركان المفروضة"}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#64748b] leading-tight font-sans">
                        {lang === 'en' 
                          ? "Recognize the nine conditions of worship and fourteen mandatory pillars."
                          : "معرفة شروط صحة الصلاة التسعة وأركانها الأربعة عشر اللازمة للقبول."}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono font-bold text-[#94a3b8]">
                      <span>{lang === 'en' ? "FAQH" : "مبحث الفقه"}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-sans">9 + 14</span>
                    </div>
                  </div>

                  {/* Card 2: Khushu' */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-900/20 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 pb-1">
                        <span className="w-4 h-4 rounded bg-emerald-50 text-emerald-800 text-[9px] font-black flex items-center justify-center shrink-0 border border-emerald-100 font-sans">
                          ٢
                        </span>
                        <h4 className="text-[11px] font-extrabold text-slate-900 font-sans leading-tight">
                          {lang === 'en' ? "Focus & Serenity" : "رعاية الطمأنينة والخشوع"}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#64748b] leading-tight font-sans">
                        {lang === 'en'
                          ? "Cultivate concentration with paced breathing and steady eye gaze."
                          : "تحقيق السكينة بالهدوء البصري وتدبر الكلمات أثناء الصلاة."}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono font-bold text-[#94a3b8]">
                      <span>{lang === 'en' ? "FOCUS" : "الخشوع الباطن"}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-sans">{lang === 'en' ? "Mindful" : "حضور القلب"}</span>
                    </div>
                  </div>

                  {/* Card 3: Fatihah Articulation */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-900/20 transition-all col-span-2 md:col-span-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 pb-1">
                        <span className="w-4 h-4 rounded bg-amber-50 text-amber-800 text-[9px] font-black flex items-center justify-center shrink-0 border border-amber-100 font-sans">
                          ٣
                        </span>
                        <h4 className="text-[11px] font-extrabold text-[#0c2420] tracking-tight">
                          {lang === 'en' ? "Fatihah Precision" : "مخارج سورة الفاتحة"}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#64748b] leading-tight font-sans">
                        {lang === 'en'
                          ? "Correct articulation of verses to prevent errors that affect validity."
                          : "صيانة نطق الفاتحة من اللحن الجلي المغير للمعاني المؤثر على الصلاة."}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono font-bold text-[#94a3b8]">
                      <span>{lang === 'en' ? "VOICE" : "التحليل الصوتي"}</span>
                      <button
                        onClick={() => setActiveTab('coach')}
                        className="px-1.5 py-0.5 bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-[8px] rounded transition-colors cursor-pointer border-0 font-sans"
                      >
                        {lang === 'en' ? "Launch" : "ابدأ"}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* NEW SECTION 2C: THE OPEN SOURCE CONTRIBUTORS HUB */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-6" id="open-source-contributors-hub">
              <div className="bg-gradient-to-tr from-[#faf8f5] to-[#f5effa]/10 border-2 border-slate-200 rounded-3rem p-8 md:p-10 relative overflow-hidden shadow-sm">
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-5 pointer-events-none scale-150">
                  <Globe className="w-64 h-64 text-slate-900" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest bg-slate-105 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 inline-block mb-1 font-sans">
                    ✦ {lang === 'en' ? "Democratic Open Source Path (nafi-org)" : "المبادرة الجماعية المفتوحة - مؤسسة نافع"} ✦
                  </span>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-950 font-serif tracking-tight">
                    {lang === 'en' ? "Help Shape the Future of Quranic Sciences" : "شارك في تطوير منهاج التجويد وفقه العبادات"}
                  </h3>

                  <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
                    {lang === 'en'
                      ? "Nafi is a community-owned academy. Developers, Arabic linguists, Quran teachers, and researchers collaborate on GitHub to power makhraj audio analyses, compile authentic Adhkar, and review Tajweed code rules."
                      : "نحن نؤمن بأن العلم الشريف يجب أن يتاح للجميع بلا حواجز مادية. يشارك المبرمجون ولغويو العربية في كتابة كود مفسر التجويد ومعالجة الصوتيات وتوثيق التراجم المعرفية لتسهيل العلم المستدام."}
                  </p>

                  {/* Code repositories mock grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2 font-sans" dir="ltr">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 hover:border-amber-500 hover:shadow-sm transition">
                      <span className="text-[9px] font-extrabold text-amber-800 uppercase font-mono tracking-wider">GitHub Org Core</span>
                      <h5 className="font-extrabold text-xs text-slate-900">nafi-org/nafi-platform</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-normal">Next.js/React layout interactive portals and scholar dashboards.</p>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 hover:border-amber-500 hover:shadow-sm transition">
                      <span className="text-[9px] font-extrabold text-emerald-805 text-emerald-805 text-emerald-800 uppercase font-mono tracking-wider font-bold">Tajweed Parser</span>
                      <h5 className="font-extrabold text-xs text-slate-900">nafi-org/tajweed-engine</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-normal">Linguistic parsing scripts, sound wave math, and JSON schema rules validation.</p>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 hover:border-amber-500 hover:shadow-sm transition">
                      <span className="text-[9px] font-extrabold text-indigo-800 uppercase font-mono tracking-wider">Daily Microservice</span>
                      <h5 className="font-extrabold text-xs text-slate-900">nafi-org/adhkar-service</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-normal">Authentic step remembrance storage, audio recitation hosting & global translations CDN.</p>
                    </div>
                  </div>

                  {/* Call to action buttons */}
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <a
                      href="https://github.com/nafi-org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs transition-colors shadow-md flex items-center gap-2 font-sans"
                    >
                      <span className="font-mono">github.com/nafi-org</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: UPCOMING WEBINARS AND STUDY SEATS TIMER (NEW ADDED SECTION) */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-4">
              <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 py-1 px-3 rounded-full border border-amber-400/20">
                    <Calendar className="w-3.5 h-3.5" />
                    {labels.webinarHeading}
                  </span>
                  
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex gap-4 items-start border-b border-white/5 pb-4">
                      <span className="text-amber-400 font-mono text-sm shrink-0 font-bold mt-1">1</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {lang === 'en' ? "Advanced Tajweed Rule Compilations (tanwin blending)" : "أحكام النون والحديث: قواعد التبسيط الصوتي"}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 font-sans">
                          {lang === 'en' ? "Speaker: Dr. Salim Al-Azhari | Date: June 15, 2026, 1 PM UTC" : "الشيخ المدرس: أ. د. سالم الأزهري | التاريخ: الجمعة المقبلة الساعة ٤ مساءً"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <span className="text-amber-400 font-mono text-sm shrink-0 font-bold mt-1">2</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {lang === 'en' ? "Ibn Al-Haytham and the foundation of visual optics research" : "مخطوطات بيت الحكمة ببغداد وكيف أسست العلوم الرياضية"}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 font-sans">
                          {lang === 'en' ? "Speaker: Dr. Fatima Al-Qurashi | Date: June 22, 2026, 3 PM UTC" : "المحاضرة: أ. د. فاطمة القرشي | التاريخ: الثلاثاء القادم الساعة ٧ مساءً"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shrink-0 w-full lg:w-72 space-y-4 text-center">
                  <h4 className="font-bold text-xs text-amber-300 uppercase tracking-wider">{lang === 'en' ? "Seminary Reservation Seat" : "حجز المقعد الدراسي"}</h4>
                  <p className="text-lg font-bold text-white font-sans">{rsvps[1]} {lang === 'en' ? "Students RSVP'd" : "طالب حجزوا حالياً"}</p>
                  
                  <button
                    onClick={() => triggerRsvp(1)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                      userRsvped[1]
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{userRsvped[1] ? labels.registeredDone : labels.registeredLabel}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* NEW SECTION A: SCIENTIFIC GOLDEN AGE INTERACTIVE TIMELINE */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-10" id="golden-age-timeline">
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-900 bg-amber-55/10 rounded-full border border-amber-200 py-1 px-3 mb-2" style={{ direction: 'ltr' }}>
                  <History className="w-3.5 h-3.5" />
                  {lang === 'en' ? "Preserving Scholarly History" : "العصر الذهبي للعلوم النافعة"}
                </span>
                <h3 className="text-2xl font-bold text-slate-850 font-sans">
                  {lang === 'en' ? "Islamic Intellectual Heritage & Science" : "منارة بيت الحكمة والعلوم التجريبية"}
                </h3>
                <p className="text-slate-500 text-xs mt-1 font-sans">
                  {lang === 'en' ? "Explore interactive milestones mapping sacred scholarship to physical sciences & mathematics" : "تتبع قنوات الترجمة والأطروحات التاريخية من الجبر المبتكر إلى نظريات الإبصار والآلات المبرمجة"}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                {/* Epoch Selection Tabs */}
                <div className="lg:col-span-4 bg-slate-50/70 border-r border-slate-200 p-6 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible shrink-0 min-h-[60px]" style={{ scrollbarWidth: 'none' }}>
                  {TIMELINE_DATA.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTimelineEpoch(idx)}
                      className={`w-full p-4 rounded-xl transition-all font-sans text-xs font-bold flex flex-col md:flex-row justify-between items-center lg:items-start gap-1 shrink-0 ${
                        activeTimelineEpoch === idx
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100/80 text-amber-900 border border-slate-200'
                      }`}
                      style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                    >
                      <div className="flex flex-col w-full">
                        <span className="opacity-90 font-mono text-[10px] text-right">
                          {lang === 'en' ? item.century : item.arEpoch.split(' - ')[0]}
                        </span>
                        <span className="mt-0.5 text-xs text-right whitespace-nowrap">
                          {lang === 'en' ? item.figure : item.arFigure}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Micro Content Panel */}
                <div className="lg:col-span-8 p-8 md:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[11px] font-mono text-amber-700 font-semibold bg-amber-50 rounded px-2.5 py-1">
                      {lang === 'en' ? TIMELINE_DATA[activeTimelineEpoch].century : TIMELINE_DATA[activeTimelineEpoch].arEpoch}
                    </span>
                    <h4 className="text-xl font-extrabold text-slate-900 font-sans mt-3">
                      {lang === 'en' ? TIMELINE_DATA[activeTimelineEpoch].title : TIMELINE_DATA[activeTimelineEpoch].arTitle}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                      {lang === 'en' ? TIMELINE_DATA[activeTimelineEpoch].milestone : TIMELINE_DATA[activeTimelineEpoch].arMilestone}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-6 mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? "Steward Authority" : "ركن الإسناد"}</p>
                        <p className="text-xs font-bold text-slate-750 font-sans">
                          {lang === 'en' ? TIMELINE_DATA[activeTimelineEpoch].figure : TIMELINE_DATA[activeTimelineEpoch].arFigure}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setActiveTab('curriculum'); }}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{lang === 'en' ? "Study This Unit" : "ادرس هذا المقرر"}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW SECTION B: INTERACTIVE BENEFICIAL-KNOWLEDGE PATH BUILDER */}
            <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 mx-[3%] py-12 md:py-16" id="study-planner">
              <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Visual info left bar */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-text-amber-400">
                    <Sliders className="w-3.5 h-3.5" />
                    <span className="font-bold text-[10px] uppercase tracking-wide text-amber-300">{lang === 'en' ? "Spiritual Growth Planner" : "مخطط البناء المعرفي التفاعلي"}</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white font-sans tracking-tight">
                    {lang === 'en' ? "Tailor Your Study Roadmap" : "صمم خطتك الدراسية لطلب العلم"}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {lang === 'en' 
                      ? "Specify your daily minutes. Our mathematical planner calibrates lessons completed, required audio recitation tasks, and estimates your path dynamically." 
                      : "حدد عدد الدقائق التي ترغب في استثمارها يومياً لطلب العلم، وستقوم الآلة بحساب خطتك وموادك لتساعدك على الحفاظ على وردك المنهجي تلقائياً."}
                  </p>

                  {/* Slider Control Container */}
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">{lang === 'en' ? "Daily Commitment" : "الالتزام اليومي المقترح"}</span>
                      <span className="font-mono text-amber-400 font-extrabold text-sm">{dailyCommitMinutes} {lang === 'en' ? "Minutes" : "دقيقة"}</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="120" 
                      step="5"
                      value={dailyCommitMinutes}
                      onChange={(e) => setDailyCommitMinutes(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>10m</span>
                      <span>30m</span>
                      <span>60m</span>
                      <span>120m</span>
                    </div>
                  </div>

                  {/* Focus Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-400 inline-block">{lang === 'en' ? "Core Study Focus" : "المسار التخصصي المرغوب"}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'tajweed', labelEn: "Tajweed Coach", labelAr: "مصحح التجويد" },
                        { id: 'jurisprudence', labelEn: "Comparative Law", labelAr: "مناهج الفقه" },
                        { id: 'history', labelEn: "Islamic Science", labelAr: "ثقافة العلوم" },
                        { id: 'scholarships', labelEn: "Grant Search", labelAr: "بحث الفرص والمنح" }
                      ].map((focus) => (
                        <button
                          key={focus.id}
                          onClick={() => setPlanFocus(focus.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-sans transition-all text-center border font-bold cursor-pointer ${
                            planFocus === focus.id
                              ? 'bg-amber-600 text-white border-transparent'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {lang === 'en' ? focus.labelEn : focus.labelAr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Computed results visual layout */}
                <div className="lg:col-span-7 bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">{lang === 'en' ? "Your Estimated Path Blueprint" : "مخرجات خطتك المقترحة"}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">{lang === 'en' ? "Weekly Lectures" : "المقاطع الأسبوعية"}</span>
                      <span className="text-2xl font-black text-white block mt-2">{getPlannerResults(dailyCommitMinutes, planFocus).weeklyLessons}</span>
                      <span className="text-[9px] text-slate-500 mt-1">{lang === 'en' ? "bite-sized modules" : "وحدات علمية مبسطة"}</span>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">{lang === 'en' ? "Voice Practice" : "تطبيق صوتي"}</span>
                      <span className="text-2xl font-black text-amber-500 block mt-2">{getPlannerResults(dailyCommitMinutes, planFocus).audioMinutes} {lang === 'en' ? "mins" : "دقيقة"}</span>
                      <span className="text-[9px] text-slate-500 mt-1">{lang === 'en' ? "recitations with AI" : "مراجعة تلاوة بالذكاء"}</span>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">{lang === 'en' ? "Achievement ETA" : "إتمام المستوى"}</span>
                      <span className="text-2xl font-black text-emerald-400 block mt-2">~{getPlannerResults(dailyCommitMinutes, planFocus).completionWeeks} {lang === 'en' ? "weeks" : "أسابيع"}</span>
                      <span className="text-[9px] text-slate-500 mt-1">{lang === 'en' ? "to verify certificate" : "للحصول على التقييم"}</span>
                    </div>
                  </div>

                  {/* Core Syllabus Snippets */}
                  <div className="space-y-2 bg-slate-950/30 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? "Syllabus Highlights" : "أبرز محتويات المنهج المبرمج"}</span>
                    </p>
                    <div className="space-y-1.5 pt-1 text-slate-400 text-xs">
                      {getPlannerResults(dailyCommitMinutes, planFocus).syllabusPoints.map((pt, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button 
                      onClick={() => { setActiveTab(planFocus === 'scholarships' ? 'scholarships' : planFocus === 'tajweed' ? 'coach' : 'curriculum'); }}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 py-3 rounded-xl text-center text-xs font-bold font-sans transition-all text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{lang === 'en' ? "Initialize Learning Stream" : "ابدأ تفعيل خطتك العلمية"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW SECTION D: SCIENTIFIC ACOUSTIC METHODOLOGY - Reduced Contents */}
            <section className="bg-[#FAF8F5] border-y border-slate-200 py-10 relative overflow-hidden" id="academic-framework">
              <div className="max-w-[1280px] mx-auto px-4 md:px-12">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8 pb-4 border-b border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-900 bg-amber-100 py-0.5 px-2.5 rounded-full border border-amber-200 inline-block font-sans">
                      ✦ {lang === 'en' ? "Computational Phonology Core" : "منهجية الفونولوجيا وحفظ النطق"} ✦
                    </span>
                    <h3 className="text-base font-extrabold text-[#2a1b14] leading-tight font-sans">
                      {lang === 'en' ? "Where Auditory Physics Meets Classical Transmission Chains" : "فيزياء الصوت تلتقي بأسانيد التلقي والرواية"}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-normal font-sans max-w-xl self-end md:text-right">
                    {lang === 'en'
                      ? "Classical Tajweed is a systemic acoustic ruleset. Nafi utilizes physical articulation maps to verify letter traits, eliminating guesswork with traditional rigor."
                      : "علم التجويد التطبيقي هو نسق فيزيائي لضبط المخارج والمدود. ندمج بين التقييم الهندسي للصوتيات ومعايير الإتقان المرتكزة تاريخياً."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Pathway Hafs */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-slate-900 font-sans">
                      {lang === 'en' ? "Hafs 'an 'Asim" : "حفص عن عاصم"}
                    </h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed font-sans">
                      {lang === 'en' 
                        ? "Undisputed predominant classic global narration. Emphasizes clean vocalic transitions and standard rules."
                        : "الرواية الأكثر شيوعاً في العالم الإسلامي، تمتاز بالقواعد المتسقة والأداء المتزن السلس."}
                    </p>
                  </div>

                  {/* Pathway Warsh */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-slate-900 font-sans">
                      {lang === 'en' ? "Warsh 'an Nafi'" : "ورش عن نافع"}
                    </h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed font-sans">
                      {lang === 'en' 
                        ? "Predominant narration in North and West Africa, unique for vocal inclinings, heavy 'Ra's, and soft vocal glides."
                        : "الرواية المشتهرة بالمغرب العربي وغرب إفريقيا، منفردة بنقل الهمز وتقليل ذوات الياء وتغليظ اللامات."}
                    </p>
                  </div>

                  {/* Pathway Qaloon */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-slate-900 font-sans">
                      {lang === 'en' ? "Qaloon 'an Nafi'" : "قالون عن نافع"}
                    </h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed font-sans">
                      {lang === 'en' 
                        ? "Preserved classic transmission recognized for plural meem extension modes and vocal ease."
                        : "رواية ناصعة تمتاز بصِلة ميم الجمع وسهولة ضبط الأداء والمد المنفصل التام."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW SECTION E: ACCREDIATED FELLOWSHIP STORIES & SPOTLIGHT */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-20" id="fellowship-spotlight">
              <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-905 bg-amber-50 rounded-full border border-amber-250/20 py-1 px-3">
                  ✦ {lang === 'en' ? "Academy Alumni Showcase" : "منصّة الانتفاع وقصص نجاح الزملاء"} ✦
                </span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {lang === 'en' ? "Fellowships Mapped to Academic Realities" : "رحلات علمية واقعية للطلاب عبر الأقطار"}
                </h3>
                <p className="text-slate-500 text-xs">
                  {lang === 'en' 
                    ? "See how our students utilized our modular curriculums, interactive coach tools, and scholarship filters to advance their academic goals."
                    : "اقرأ مراجعات وقصص الطلاب الموفقين الذين دمجوا بين التقييم الآني لمخارج الحروف مع تصفح قاعدة بيانات المنح الأكاديمية للدراسات العليا."
                  }
                </p>
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
            </section>

            {/* NEW SECTION C: GLOBAL SCHOLAR PEER ACTIVE ACTIVITY FEED */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-8" id="live-peers">
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-500/10 rounded-full border border-emerald-200/60 py-1 px-3 mb-2" style={{ direction: 'ltr' }}>
                      <Activity className="w-3 h-3 animate-pulse text-emerald-600" />
                      {lang === 'en' ? "Academy Global Sync" : "حلقات التدارس العالمية"}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 font-sans">
                      {lang === 'en' ? "Real-time Peer Activity Circles" : "حلقات البث ومدارسات المتعلمين النشطة"}
                    </h3>
                  </div>

                  {/* HIGHLY COMPACT ICON/AVATAR ROW CLUSTER */}
                  <div className="flex flex-wrap gap-2.5 items-center justify-start md:justify-end">
                    {ACTIVE_CIRCLES.map((circle) => {
                      const isSelected = selectedCircleId === circle.id;
                      // Get abbreviation based on ID
                      const abbrev = circle.id.slice(0, 2).toUpperCase();
                      return (
                        <button
                          key={circle.id}
                          onClick={() => setSelectedCircleId(circle.id)}
                          className={`w-11 h-11 rounded-full relative font-bold text-[11px] tracking-wider transition-all flex items-center justify-center cursor-pointer border-2 ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50 text-amber-950 scale-105 shadow-sm' 
                              : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50 hover:border-slate-350'
                          }`}
                          title={lang === 'en' ? circle.city.en : circle.city.ar}
                          id={`btn-peer-${circle.id}`}
                        >
                          <span>{abbrev}</span>
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SINGLE DYNAMIC VIEWPORT FOR VALUE PRESENTATION */}
                {(() => {
                  const currentCircle = ACTIVE_CIRCLES.find(c => c.id === selectedCircleId) || ACTIVE_CIRCLES[0];
                  return (
                    <motion.div 
                      key={selectedCircleId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                    >
                      <div className="md:col-span-8 space-y-3 text-right">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                            {lang === 'en' ? "Selected Broadcast Node" : "مركز البث المختار"}
                          </p>
                          <h4 className="text-lg font-black text-slate-800 leading-snug">
                            {lang === 'en' ? currentCircle.city.en : currentCircle.city.ar}
                          </h4>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-150 space-y-1">
                          <p className="text-[9px] text-[#C59B32] font-black uppercase tracking-widest">{lang === 'en' ? "Active Discussion" : "موضوع التداول بمجلس الطلاب"}</p>
                          <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed font-serif">
                            {lang === 'en' ? currentCircle.topic.en : currentCircle.topic.ar}
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center items-stretch bg-white border border-slate-205 p-5 rounded-2xl">
                        <div className="flex-1 text-center md:text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? "Simulated Attendance" : "الحضور الحالي"}</p>
                          <div className="flex items-center justify-center md:justify-start gap-1 mt-0.5">
                            <span className="text-xl font-mono font-black text-slate-800">{currentCircle.activeScholars}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{lang === 'en' ? "online scholars" : "طالب متواجد الآن"}</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="inline-block text-[9px] font-extrabold text-amber-800 bg-amber-50 rounded py-0.5 px-2 font-mono w-full text-center">
                            {lang === 'en' ? currentCircle.status.en : currentCircle.status.ar}
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab('forum');
                              setLiveToast({
                                title: lang === 'en' ? "Redirecting..." : "جاري توجيهك الآن...",
                                body: lang === 'en' ? "Redirecting to student discussion boards..." : "جاري توجيهك إلى مجالس النقاش وحوارات الطلاب..."
                              });
                              setTimeout(() => setLiveToast(null), 5000);
                            }}
                            className="w-full text-[10px] font-extrabold bg-slate-900 text-white rounded-xl py-2 hover:bg-slate-800 transition-colors cursor-pointer border-0"
                          >
                            {lang === 'en' ? "Enter Study Room →" : "دخول غرفة النقاش ←"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
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
            />
          </motion.div>
        )}

        {/* QURAN EXPLORER SCREEN */}
        {activeTab === 'quran' && (
          <motion.div
            key="quran"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
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

        {/* ASK THE MUFTI QA */}
        {activeTab === 'scholarly' && (
          <motion.div
            key="scholarly"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ScholarlyView lang={lang} />
          </motion.div>
        )}

        {/* DISCUSSION FORUM */}
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
              onAuthSuccess={handleAuthSuccess}
            />
          </motion.div>
        )}

        {/* SCHOLARSHIPS GRANTS */}
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

        {/* SAVED SCHOLARSHIPS WORKSPACE */}
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

    </div>
    </>
  );
}
