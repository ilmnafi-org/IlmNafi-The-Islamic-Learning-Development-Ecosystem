/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Heart, 
  Trash2, 
  Plus, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  RefreshCw,
  X,
  Award,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Flame,
  Calendar,
  MapPin,
  Users,
  Timer,
  CheckSquare,
  Info,
  ChevronUp,
  Bell,
  BellOff,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AUTHENTIC_ADHKAR_DB, DhikrItem, DAILY_WIRDS_PRESETS } from '../adhkarData';

interface DailyViewProps {
  lang: 'en' | 'ar';
  onDrawerChange?: (drawer: 'tasbih' | 'prayers' | 'dua' | null) => void;
}

interface CustomDua {
  id: string;
  topic: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  context: string;
  date: string;
}

interface PeerActivity {
  id: string;
  time: string;
  name: string;
  location: string;
  action: string;
}

export const DailyView: React.FC<DailyViewProps> = ({ lang, onDrawerChange }) => {
  // Navigation: Sub-tabs within the Spiritual Board
  const [activeSubTab, setActiveSubTab] = useState<'walkthrough' | 'tasbih' | 'prayers' | 'dua'>('walkthrough');
  const [activeAdhkarDrawer, setActiveAdhkarDrawer] = useState<'tasbih' | 'prayers' | 'dua' | null>(null);

  const handleSetAdhkarDrawer = (val: 'tasbih' | 'prayers' | 'dua' | null) => {
    setActiveAdhkarDrawer(val);
    onDrawerChange?.(val);
  };
  
  // Translation dictionary
  const t = {
    en: {
      morningTitle: "Morning Adhkar",
      eveningTitle: "Evening Adhkar",
      salahTitle: "After Salah Adhkar",
      sleepTitle: "Sleep Adhkar",
      dailyLifeTitle: "Daily Life Duas",
      adhkarSubtitle: "Step-by-step recitation of authentic, protective morning and evening remembrances.",
      completedStatus: "All remembrances completed for this category!",
      completedWellDone: "Superb! You completed {count} items. Take this moment to reflect on their virtues.",
      resetAdhkar: "Reset Progression",
      bulkCompleteAll: "Bulk Complete All",
      prevItem: "Previous",
      nextItem: "Next",
      sourceLabel: "Hadith Source",
      virtueLabel: "Virtue & Scientific Benefit",
      tasbihTitle: "Sacred Tasbih Counter",
      tasbihSubtitle: "Digital glorification interface. Keep track of SubhanAllah, Alhamdulillah, Allahu Akbar, or custom wird.",
      synthBeep: "Acoustic Bead clicks (Synth sound)",
      hapticsLabel: "Haptic Vibration (Touch feedback)",
      soundSampleBtn: "Click Bead",
      wirdSelectFocus: "Select Focus Remembrance",
      wirdCustomLabel: "Or set a custom Wird target:",
      customWirdPlaceholder: "Enter custom dhikr text...",
      customTargetLabel: "Target Count",
      groupTasbihTitle: "Live Multi-User Halaqa Chamber",
      groupTasbihDesc: "A collaborative spiritual room. Contribute alongside other students of knowledge.",
      groupJointGoal: "Collective Daily Goal",
      groupContribute: "Add Your Current Tally",
      groupLogsTitle: "Peer Halaqa Activity Ledger",
      prayerTimesTitle: "Astronomical Sun & Prayer Clock",
      prayerTimesDesc: "Using precise astronomical calculation to determine peak times for Adhkar Al-Sabah & Al-Masaa.",
      detectLocBtn: "Detect Geographical Position",
      locDetected: "Coordinates cached",
      recommendedNow: "Optimal window active right now!",
      morningAdhkarWindow: "Morning Adhkar: Fajr to Sunrise",
      eveningAdhkarWindow: "Evening Adhkar: Asr to Maghrib",
      tempClock: "Standard Calculated Prayer times:",
      noSavedDuas: "No pinned supplications yet. Formulate or explore the list below to pin your favorites.",
      savedDuasTitle: "Your Saved Supplications Repository",
      counselorTitle: "Prophetic AI Counsellor",
      counselorDesc: "Ask the counsellor to synthesize verified prophetic supplications with references.",
      goalPlaceholder: "e.g., Guidance for deep concentration in exam sessions, or patience in times of distress...",
      formulateBtn: "Formulate Core Supplication",
      classicBackupTitle: "Curated Canonical Supplications",
      classicBackupDesc: "Authentic Quranic & prophetic prayers to use anytime offline.",
      streakCompleted: "remembrances completed today!",
      consecutiveDays: "Consecutive Days Streak",
      consistencyHeatmap: "Consistency Heatmap (Last 14 Days)",
      completeMorningReminder: "Morning Adhkar completed",
      completeEveningReminder: "Evening Adhkar completed",
      tasbihClicksLogged: "Logged Tasbih Tally"
    },
    ar: {
      morningTitle: "أذكار الصباح",
      eveningTitle: "أذكار المساء",
      salahTitle: "أذكار بعد الصلاة",
      sleepTitle: "أذكار النوم",
      dailyLifeTitle: "أدعية الحياة والآداب اليومية",
      adhkarSubtitle: "تلاوة تفاعلية خطوة بخطوة للأوراد والأذكار اليومية المأثورة بإسناد صحيح.",
      completedStatus: "اكتملت جميع أذكار هذا القسم بنجاح!",
      completedWellDone: "تقبل الله طاعتك! أكملت {count} ذكراً منفرداً. تأمل فضلها والسكينة النفسية.",
      resetAdhkar: "إعادة تعيين الأذكار",
      bulkCompleteAll: "إكمال الكل دفعة واحدة",
      prevItem: "السابق",
      nextItem: "التالي",
      sourceLabel: "تخريج الحديث وإسناده",
      virtueLabel: "الأثر الروحي والفضل العلمي",
      tasbihTitle: "مسبحة الأذكار والأوراد",
      tasbihSubtitle: "مسبحة رقمية مزودة بمؤثرات صوتية وارتجاجية لمساعدتك على إعداد مئة استغفار وتسبيح يومي.",
      synthBeep: "نقرات الحبات الصوتية (رنين مسموع)",
      hapticsLabel: "نظام الارتجاج اللمسي (للهواتف)",
      soundSampleBtn: "عقد حبة",
      wirdSelectFocus: "اختر صيغة الذكر الحالية",
      wirdCustomLabel: "أو حدد ورداً خاصاً بك:",
      customWirdPlaceholder: "اكتب الذكر المخصص هنا...",
      customTargetLabel: "العدد المستهدف",
      groupTasbihTitle: "مجلس الذكر التضامني المباشر",
      groupTasbihDesc: "حلقة ذكر افتراضية تفاعلية. ساهم في تحقيق الهدف المشترك للأمة مع سائر المتعلمين.",
      groupJointGoal: "الهدف اليومي الجماعي للأكاديمية",
      groupContribute: "ساهم بتسبيحاتك الحالية للمجموع",
      groupLogsTitle: "الأثر المباشر لطلاب العلم في الحلقة",
      prayerTimesTitle: "مواقيت الفلك ومقادير الأذكار",
      prayerTimesDesc: "رصد فلكي دقيق لتحديد الفترات الذهبية لترتيل أذكار الغدوة والآصال الحابسة للهموم.",
      detectLocBtn: "كشف الموقع الجغرافي الآمن",
      locDetected: "تم كشف وتخزين الإحداثيات",
      recommendedNow: "الفترة الفضلى للأذكار نشطة الآن!",
      morningAdhkarWindow: "وقت أذكار الصباح: من الفجر إلى الشروق",
      eveningAdhkarWindow: "وقت أذكار المساء: من العصر إلى غروب الشمس",
      tempClock: "تقدير المواقيت الفلكية اليومية:",
      noSavedDuas: "لا توجد أدعية محفوظة بعد. استخدم صانع الأدعية بالأعلى أو تصفح القائمة لحفظ المفضلة.",
      savedDuasTitle: "حفظ الكنوز المأثورة المخصصة",
      counselorTitle: "مرشد الأدعية القرآني الموثق بالذكاء الاصطناعي",
      counselorDesc: "اطلب صياغة تضرّع مأثور موجه لعلاج قلق أو نية دراسية بجمع الآيات والأدعية المسندة.",
      goalPlaceholder: "مثال: التوفيق للتركيز العميق في الامتحانات الفقهية، أو تفريج هم وصعوبة مالية...",
      formulateBtn: "صياغة الدعاء الآن",
      classicBackupTitle: "موسوعة الفواتح والأدعية المأثورة",
      classicBackupDesc: "أدعية قرآنية معتمدة من كتب السلف صالحة لمختلف الأحوال والاحتياجات.",
      streakCompleted: "أذكاراً مكتملة اليوم!",
      consecutiveDays: "أيام الالتزام المتتالية",
      consistencyHeatmap: "مؤشر الالتزام اليومي (آخر 14 يوماً)",
      completeMorningReminder: "اكتملت أذكار الصباح",
      completeEveningReminder: "اكتملت أذكار المساء",
      tasbihClicksLogged: "إجمالي التسبيحات المسجلة"
    }
  }[lang];

  // Global user statistics and active duration statistics
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState<{morning: boolean; evening: boolean; count: number}>({morning: false, evening: false, count: 0});
  const [heatmap, setHeatmap] = useState<{[key: string]: boolean}>({});
  const [tasbihTotalScore, setTasbihTotalScore] = useState(0);

  // Browser Notification & Reminder states
  const [morningReminderEnabled, setMorningReminderEnabled] = useState(() => {
    return localStorage.getItem('morningReminderEnabled') === 'true';
  });
  const [morningReminderTime, setMorningReminderTime] = useState(() => {
    return localStorage.getItem('morningReminderTime') || '06:30';
  });
  const [eveningReminderEnabled, setEveningReminderEnabled] = useState(() => {
    return localStorage.getItem('eveningReminderEnabled') === 'true';
  });
  const [eveningReminderTime, setEveningReminderTime] = useState(() => {
    return localStorage.getItem('eveningReminderTime') || '17:30';
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');
  const [lastTriggeredMorning, setLastTriggeredMorning] = useState(() => {
    return localStorage.getItem('lastTriggeredMorning') || '';
  });
  const [lastTriggeredEvening, setLastTriggeredEvening] = useState(() => {
    return localStorage.getItem('lastTriggeredEvening') || '';
  });
  const [notificationStatusMsg, setNotificationStatusMsg] = useState<{ text: string; mode: 'success' | 'warn' | 'error' } | null>(null);

  // Adhkar Step-Through selection module
  const [adhkarCategory, setAdhkarCategory] = useState<'morning' | 'evening' | 'after_salah' | 'sleep' | 'daily_life' | 'travel' | 'anxiety' | 'food'>('morning');
  const [selectedAdhkarCategory, setSelectedAdhkarCategory] = useState<'morning' | 'evening' | 'after_salah' | 'sleep' | 'daily_life' | 'travel' | 'anxiety' | 'food' | null>(null);
  const [adhkarViewState, setAdhkarViewState] = useState<'categories' | 'list' | 'detail'>('categories');
  const [adhkarIndex, setAdhkarIndex] = useState(0);
  const [adhkarCompletedStates, setAdhkarCompletedStates] = useState<{[key: string]: number}>({}); // tracks clicks per item ID
  const [translationLang, setTranslationLang] = useState<'en' | 'ar' | 'ur' | 'ha'>(lang);
  const [progressionPage, setProgressionPage] = useState(0);

  
  // Custom & Standard Tasbih State
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihPresetIdx, setTasbihPresetIdx] = useState(0);
  const [tasbihBeep, setTasbihBeep] = useState(true);
  const [tasbihVibrate, setTasbihVibrate] = useState(true);
  const [customWirdText, setCustomWirdText] = useState("");
  const [customTarget, setCustomTarget] = useState(33);

  // Simulated Group Halaqa State
  const [groupTargetCount, setGroupTargetCount] = useState(7243);
  const [peerActivities, setPeerActivities] = useState<PeerActivity[]>([]);
  
  // Prayer location and times state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<{
    Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
  }>({
    Fajr: "03:45", Sunrise: "05:12", Dhuhr: "12:15", Asr: "15:45", Maghrib: "19:10", Isha: "20:38"
  });
  const [nextPrayerName, setNextPrayerName] = useState("Fajr");
  const [nextPrayerTimeLeft, setNextPrayerTimeLeft] = useState("02:18:12");
  const [locStatus, setLocStatus] = useState<string>("");

  // Supplication states matching database integration / backup
  const [duaIntention, setDuaIntention] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDua, setGeneratedDua] = useState<CustomDua | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pinnedDuas, setPinnedDuas] = useState<CustomDua[]>([]);

  // Text to Speech states and Clipboard copy helper states
  const [isCurrentlyReading, setIsCurrentlyReading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Notification authorization and triggering handlers API
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Reset pagination to 0 when category shifts
  useEffect(() => {
    setProgressionPage(0);
  }, [adhkarCategory]);

  // Keep pagination page in sync with the active step swiper (5 items per page)
  useEffect(() => {
    const targetPage = Math.floor(adhkarIndex / 5);
    setProgressionPage(targetPage);
  }, [adhkarIndex]);

  // Synchronize Reminder properties with LocalStorage
  useEffect(() => {
    localStorage.setItem('morningReminderEnabled', String(morningReminderEnabled));
  }, [morningReminderEnabled]);

  useEffect(() => {
    localStorage.setItem('morningReminderTime', morningReminderTime);
  }, [morningReminderTime]);

  useEffect(() => {
    localStorage.setItem('eveningReminderEnabled', String(eveningReminderEnabled));
  }, [eveningReminderEnabled]);

  useEffect(() => {
    localStorage.setItem('eveningReminderTime', eveningReminderTime);
  }, [eveningReminderTime]);

  useEffect(() => {
    localStorage.setItem('lastTriggeredMorning', lastTriggeredMorning);
  }, [lastTriggeredMorning]);

  useEffect(() => {
    localStorage.setItem('lastTriggeredEvening', lastTriggeredEvening);
  }, [lastTriggeredEvening]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      setNotificationStatusMsg({
        text: lang === 'en' 
          ? "Local notifications are not supported by your current browser." 
          : "الإشعارات المحلية غير مدعومة في متصفحك الحالي.",
        mode: 'error'
      });
      return 'default';
    }
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setNotificationStatusMsg({
          text: lang === 'en' 
            ? "Notification permission granted successfully! Tap 'Test Notification' to verify." 
            : "تم منح إذن الإشعارات بنجاح! انقر على 'تجربة الإشعار' للتحقق.",
          mode: 'success'
        });
      } else {
        setNotificationStatusMsg({
          text: lang === 'en' 
            ? "Permission denied. Please ensure notifications are enabled in your site permission settings." 
            : "تم رفض الإذن. يرجى تفعيل الإشعارات من إعدادات المتصفح الخاصة بالموقع.",
          mode: 'warn'
        });
      }
      setTimeout(() => setNotificationStatusMsg(null), 5000);
      return permission;
    } catch (e) {
      console.warn("Permission request failed:", e);
      return 'default';
    }
  };

  const triggerNotification = (title: string, options: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, options);
      } catch (e) {
        console.warn("Direct notification constructor failed, trying serviceWorker registry fallback:", e);
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, options);
          });
        }
      }
    }
  };

  const testNotification = async () => {
    let perm = notificationPermission;
    if (perm !== "granted") {
      perm = await requestNotificationPermission();
    }
    
    if (perm === "granted") {
      triggerNotification(
        lang === 'en' ? "DeenSuite Reminder Service" : "خدمة تذكير دِين سويت",
        {
          body: lang === 'en' 
            ? "Praise be to Allah! Local browser scheduled reminders are active." 
            : "الحمد لله! تم تفعيل خدمة التذكير بجدول الأوراد في هذا المتصفح مسبقاً.",
          icon: "/favicon.ico"
        }
      );
    }
  };

  // Background ticker that compares browser systems current time with scheduled alarms
  useEffect(() => {
    const reminderTicker = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toDateString(); // Keeps track of unique day cycles

      // Clock ticking alert helper morning check
      if (
        morningReminderEnabled && 
        currentTimeStr === morningReminderTime && 
        lastTriggeredMorning !== todayDateStr
      ) {
        triggerNotification(
          lang === 'en' ? "Morning Adhkar Reminder" : "تذكير أذكار الصباح",
          {
            body: lang === 'en' 
              ? "It's time to recite your Morning Adhkars. Click to open and begin your protective routine." 
              : "حان الآن موعد أذكار الصباح. حافظ على وردك اليومي للسكينة والحفظ.",
            icon: "/favicon.ico",
            tag: "morning-adhkar-alarm"
          }
        );
        setLastTriggeredMorning(todayDateStr);
      }

      // Clock ticking alert helper evening check
      if (
        eveningReminderEnabled && 
        currentTimeStr === eveningReminderTime && 
        lastTriggeredEvening !== todayDateStr
      ) {
        triggerNotification(
          lang === 'en' ? "Evening Adhkar Reminder" : "تذكير أذكار المساء",
          {
            body: lang === 'en' 
              ? "It's time to recite your Evening Adhkars. Take a moment to renew your peace." 
              : "حان الآن وقت أذكار المساء. طمئن قلبك بذكر الله مع الغروب.",
            icon: "/favicon.ico",
            tag: "evening-adhkar-alarm"
          }
        );
        setLastTriggeredEvening(todayDateStr);
      }

    }, 15000); // Check every 15 seconds to ensure we do not miss the matching minute window

    return () => clearInterval(reminderTicker);
  }, [
    morningReminderEnabled, 
    morningReminderTime, 
    lastTriggeredMorning, 
    eveningReminderEnabled, 
    eveningReminderTime, 
    lastTriggeredEvening, 
    lang
  ]);

  const handleTTS = (text: string, languageCode: 'ar' | 'en' | 'ur' | 'ha', id: string) => {
    if ('speechSynthesis' in window) {
      if (isCurrentlyReading === id) {
        window.speechSynthesis.cancel();
        setIsCurrentlyReading(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 
        languageCode === 'ar' ? 'ar-SA' : 
        languageCode === 'ur' ? 'ur-PK' : 
        languageCode === 'ha' ? 'ha-NG' : 
        'en-US';
      utterance.rate = languageCode === 'ar' ? 0.78 : 0.90; // slightly modulated rate for authentic study pace
      utterance.onend = () => setIsCurrentlyReading(null);
      utterance.onerror = () => setIsCurrentlyReading(null);
      
      setIsCurrentlyReading(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleShare = (dhikr: DhikrItem) => {
    const textToShare = `${dhikr.arabic}\n\n${dhikr.translationEn}\n\nShared from Ilm Nafi App`;
    if (navigator.share) {
      navigator.share({
        title: 'Ilm Nafi Adhkar',
        text: textToShare,
      }).catch((err) => console.error("Error sharing:", err));
    } else {
      handleCopy(textToShare, dhikr.id);
      alert(lang === 'en' ? "Copied to clipboard to share" : "تم النسخ للمشاركة");
    }
  };

  // 12 Backup Classical Prayers for complete robust offline operation (always valid)
  const OPTIMAL_CLASSIC_PRAYERS = [
    {
      topic: lang === 'en' ? "Guidance for Knowledge & Intellect" : "سؤال الهدى وزيادة العلم النافع",
      arabic: "رَّبِّ زِدْنِي عِلْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ",
      transliteration: "Rabbi zidni 'ilman wa al-hiqni bis-salihin.",
      translation: lang === 'en' ? "My Lord, increase me in knowledge and join me with the righteous." : "ربِّ هب لي فهماً ثاقباً وزدني من العلوم النافعة ما أخدم به الملة.",
      context: lang === 'en' ? "Sura Taha (Verse 114). The fundamental primary prayer for every seeker of knowledge." : "سورة طه (الآية 114)؛ الطلب القرآني الوحيد بالازدياد هو العلم."
    },
    {
      topic: lang === 'en' ? "Speech Perfection & Anxiety Relief" : "صيانة المنطق وتيسير شرح الصدر والامتحان",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",
      transliteration: "Rabbish-rah li sadri, wa yassir li amri, wahlul 'uqdatan min lisani, yafqahu qawli.",
      translation: lang === 'en' ? "My Lord, expand for me my breast [with assurance] and ease for me my task and untie the knot from my tongue that they may understand my speech." : "سيد أدعية الثبات في ملمات الشرح والمناظرة وامتحانات تلاوة القرآن الكريم.",
      context: lang === 'en' ? "Supplication of Prophet Musa (AS) when ordered to face Pharaoh." : "سورة طه (الآيات 25-28)؛ سلاح المؤمن المرتكب غمرات الدروس والوعظ."
    },
    {
      topic: lang === 'en' ? "Praise & Comprehensive Ease" : "تيسير شدائد الأمور ومطالب الحوائج الصعبة",
      arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
      transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa Anta taj'alul-hazna idha shi'ta sahla.",
      translation: lang === 'en' ? "O Allah, there is no ease except in what You have made easy, and You make difficulty, if You wish, easy." : "اللهم الطف بنا ويسر لنا الدراسة وحفظ المتون وسائر مغاليق الرزق.",
      context: lang === 'en' ? "Narrated by Ibn Hibban and graded Sahih by researchers." : "تخريج ابن حبان بسند صحيح عن النبي ﷺ؛ ترياق لمواجهة العسير وعقد اللسان."
    },
    {
      topic: lang === 'en' ? "Relief of Deep Anguish & Anxiety" : "معالجة الخوف والقلق وكروب الديون والقلوب",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
      transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayn, wa ghalabatir-rijal.",
      translation: lang === 'en' ? "O Allah, I seek refuge in You from anxiety and grief, helplessness and laziness, stinginess and cowardice, being heavily in debt and of being overpowered by men." : "دعاء شامل يدفع الكسل والخمول البدني ويقوي الهمم لحفظ الأوراد والدروس.",
      context: lang === 'en' ? "Sahih Al-Bukhari 2893." : "أشهر جامع نبوي للاستعاذة من معوقات المعاش والمعاد وموانع التقدم."
    }
  ];

  // Initialize nice default state values on mount
  useEffect(() => {
    setStreak(3);
    setCompletedToday({morning: false, evening: false, count: 2});
    setTasbihTotalScore(640);

    // Geolocation detection fallback
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocStatus("Detected successfully");
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setLocStatus("Using estimated timing");
          // default Mecca coordinates
          setLatitude(21.3891);
          setLongitude(39.8579);
          fetchPrayerTimes(21.3891, 39.8579);
        }
      );
    }

    // Initialize Group Chamber simulated messages
    const initialPeers = [
      { id: "1", time: "12:14", name: "Aisha bin Yahya", location: "Cairo, Egypt", action: "Completed Morning Adhkar" },
      { id: "2", time: "12:15", name: "Yusuf Al-Farid", location: "Kuala Lumpur", action: "Contributed +33 Tasbih beads" },
      { id: "3", time: "12:15", name: "Fatima Alzahra", location: "Jakarta, Indonesia", action: "Completed After Salah Adhkar" }
    ];
    setPeerActivities(initialPeers);

    // Set countdown timer ticker
    const timer = setInterval(() => {
      // Simulate real-time ticks
      setGroupTargetCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      
      // Random peer arrivals
      if (Math.random() > 0.85) {
        const peerNames = ["Ahmad Al-Misri", "Ameen Mezghani", "Mariam Al-Balushi", "Zayd Al-Malki", "Soliman France", "Ruqayyah UK"];
        const peerLocs = ["Strasbourg", "Casablanca", "Muscat", "Riyadh", "Amman", "Fez"];
        const peerActions = ["Added +10 Tasbih", "Completed Evening Adhkar", "Read Sleep Protections", "Set a custom Wird target"];
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const newPeer: PeerActivity = {
          id: String(Date.now()),
          time: timeStr,
          name: peerNames[Math.floor(Math.random() * peerNames.length)],
          location: peerLocs[Math.floor(Math.random() * peerLocs.length)],
          action: peerActions[Math.floor(Math.random() * peerActions.length)]
        };
        setPeerActivities(prev => {
          const updated = [newPeer, ...prev];
          return updated.slice(0, 10); // Keep last 10 messages
        });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Fetch astronomical prayer timings
  const fetchPrayerTimes = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.timings) {
          const timings = data.data.timings;
          setPrayerTimes({
            Fajr: timings.Fajr,
            Sunrise: timings.Sunrise,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha
          });
        }
      }
    } catch (e) {
      console.warn("Could not retrieve online prayer times, using standard estimations", e);
    }
  };

  // Sound generator
  const triggerSynthClick = (freq: number) => {
    if (!tasbihBeep) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn("Sound context blocked:", e);
    }
  };

  // Counter Actions
  const handleTasbihBeadIncrement = () => {
    const isTargetReached = (tasbihCount + 1) === (customWirdText ? customTarget : 33);
    const soundFreq = isTargetReached ? 980 : 440;
    
    setTasbihCount(prev => prev + 1);
    triggerSynthClick(soundFreq);

    if (tasbihVibrate && navigator?.vibrate) {
      navigator.vibrate(isTargetReached ? 200 : 40);
    }

    // If target achieved, automatically reward and aggregate stats
    if (isTargetReached) {
      setTasbihCount(0);
      setTasbihTotalScore(prev => {
        const next = prev + (customWirdText ? customTarget : 33);
        return next;
      });
      // Increment Completed count
      setCompletedToday(prev => {
        const updated = { ...prev, count: prev.count + 1 };
        return updated;
      });
      // Add visual active state to heatmap
      const todayString = new Date().toISOString().split('T')[0];
      setHeatmap(prev => {
        const updated = { ...prev, [todayString]: true };
        return updated;
      });
    }
  };

  // Step-through Category Adhkar increments
  const handleStepClick = (item: DhikrItem) => {
    const currentClicks = adhkarCompletedStates[item.id] || 0;
    if (currentClicks >= item.targetCount) {
      // already completed, skip
      return;
    }

    const nextClicks = currentClicks + 1;
    setAdhkarCompletedStates(prev => ({
      ...prev,
      [item.id]: nextClicks
    }));

    // Trigger feedback sound
    const isReady = nextClicks === item.targetCount;
    triggerSynthClick(isReady ? 880 : 480);

    if (tasbihVibrate && navigator?.vibrate) {
      navigator.vibrate(isReady ? 180 : 40);
    }

    // If matches complete count
    if (isReady) {
      // Check if all items in this section are completed
      const itemsInCat = AUTHENTIC_ADHKAR_DB.filter(x => x.category === adhkarCategory);
      const isEntireCategoryCompleted = itemsInCat.every(x => {
        const currentCount = x.id === item.id ? nextClicks : (adhkarCompletedStates[x.id] || 0);
        return currentCount >= x.targetCount;
      });

      if (isEntireCategoryCompleted) {
        // Complete the category lock in statistics
        const todayString = new Date().toISOString().split('T')[0];
        setCompletedToday(prev => {
          const updated = {
            ...prev,
            morning: adhkarCategory === 'morning' ? true : prev.morning,
            evening: adhkarCategory === 'evening' ? true : prev.evening,
            count: prev.count + 1
          };
          return updated;
        });

        // Update heatmap of engagement
        setHeatmap(prev => {
          const updated = { ...prev, [todayString]: true };
          return updated;
        });

        // Trigger streak advance on full Morning/Evening completion
        setStreak(prev => {
          const nextVal = prev + 1;
          return nextVal;
        });
      }
    }
  };

  const handleIntentionSubmit = async () => {
    if (!duaIntention.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedDua(null);

    try {
      const response = await fetch('/api/dua-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: duaIntention })
      });

      if (!response.ok) {
        throw new Error("Unable to contact dynamic Supplication compiler.");
      }

      const data = await response.json();
      setGeneratedDua(data);
    } catch (err: any) {
      console.warn("Dua compiler API failed fallback active:", err);
      // Fallback: Pick a beautiful classic matching words
      const searchWord = duaIntention.toLowerCase();
      let matched = OPTIMAL_CLASSIC_PRAYERS[0];
      if (searchWord.includes("anxiety") || searchWord.includes("anxious") || searchWord.includes("sad") || searchWord.includes("قلق") || searchWord.includes("هم")) {
        matched = OPTIMAL_CLASSIC_PRAYERS[3];
      } else if (searchWord.includes("exam") || searchWord.includes("test") || searchWord.includes("study") || searchWord.includes("تحضير") || searchWord.includes("اختبار")) {
        matched = OPTIMAL_CLASSIC_PRAYERS[1];
      } else if (searchWord.includes("difficulty") || searchWord.includes("hard") || searchWord.includes("صعب") || searchWord.includes("عسر")) {
        matched = OPTIMAL_CLASSIC_PRAYERS[2];
      }
      
      setGeneratedDua({
        id: "dua-fb-" + Date.now(),
        topic: matched.topic,
        arabicText: matched.arabic,
        transliteration: matched.transliteration,
        translation: matched.translation,
        context: matched.context,
        date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG')
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pinDua = () => {
    if (!generatedDua) return;
    const isAlreadyPinned = pinnedDuas.some(d => d.arabicText === generatedDua.arabicText);
    if (isAlreadyPinned) return;

    const newPin: CustomDua = {
      id: "dua-" + Date.now(),
      topic: generatedDua.topic,
      arabicText: generatedDua.arabicText,
      transliteration: generatedDua.transliteration,
      translation: generatedDua.translation,
      context: generatedDua.context,
      date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG')
    };

    const updated = [newPin, ...pinnedDuas];
    setPinnedDuas(updated);
    setGeneratedDua(null);
    setDuaIntention('');
  };

  const removePinnedDua = (id: string) => {
    const updated = pinnedDuas.filter(d => d.id !== id);
    setPinnedDuas(updated);
  };

  // Filter Adhkar DB by selected category
  const filteredAdhkar = AUTHENTIC_ADHKAR_DB.filter(x => x.category === adhkarCategory);
  
  // Guard indices dynamically at render time to prevent state-flicker bounds crashes
  const safeAdhkarIndex = adhkarIndex < filteredAdhkar.length ? adhkarIndex : 0;
  const activeStep = filteredAdhkar[safeAdhkarIndex] || filteredAdhkar[0];

  const maxPage = Math.max(0, Math.ceil(filteredAdhkar.length / 5) - 1);
  const safeProgressionPage = Math.min(progressionPage, maxPage);

  // Progression scores
  const categoryClicksSummary = filteredAdhkar.map(x => adhkarCompletedStates[x.id] || 0);
  const totalCompletedInCat = categoryClicksSummary.filter((clicks, idx) => clicks >= filteredAdhkar[idx].targetCount).length;
  const isCategoryCurrentlyFullyComplete = totalCompletedInCat === filteredAdhkar.length;

  return (
    <div className="w-full max-w-full px-2 sm:px-4 md:px-6 pt-6 pb-24" id="view-daily-spiritual-board">
      
      {/* Redesigned Space-Optimized Compact Header */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-4 md:p-5 shadow-xl mb-6 flex items-center justify-between gap-4 border border-slate-800" id="spiritual-board-compact-header">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight leading-none">
              {lang === 'en' ? "Spiritual Companion" : "الرفيق الروحي"}
            </h1>
            <p className="text-slate-400 text-[11px] leading-tight mt-1">
              {lang === 'en' ? "Daily Wird, Adhkar & Tasbih Portal" : "الأوراد المأثورة وبوابة الأذكار والتسابيح"}
            </p>
          </div>
        </div>
      </div>

      {/* Remembrances Main Deck (No more top tab switcher container) */}
      <div className="space-y-8 pb-28 animate-fadeIn" id="adhkars-walkthrough-deck">
            {selectedAdhkarCategory === null && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center max-w-xl mx-auto space-y-1.5 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-amber-700 font-mono font-bold block">Al-Adhkar Al-Yawmiyyah</span>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    {lang === 'en' ? "Authentic Remembrances & Supplications" : "الأذكار والأوراد اليومية المأثورة"}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal font-medium">
                    {lang === 'en' 
                      ? "Select a protective remembrance page below to begin itemized recitation walkthroughs, with digital counter registers." 
                      : "اختر نوع الورد من الفهرس أدناه لبدء التلاوة الذكية والعد التصاعدي بالأسانيد الصحيحة."}
                  </p>
                </div>

                {/* MUSHAF-STYLE CATEGORY INDEX GRID - 8 COLUMNS */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3 max-w-6xl mx-auto" id="adhkar-categories-index-grid">
                  {[
                    { type: 'morning', title: t.morningTitle, descEn: "Morning Protection", descAr: "أذكار الصباح الشريفة", icon: '☀️' },
                    { type: 'evening', title: t.eveningTitle, descEn: "Evening Protection", descAr: "أذكار المساء الشريفة", icon: '🌙' },
                    { type: 'after_salah', title: t.salahTitle, descEn: "Post-Salah Prayers", descAr: "أدعية ما بعد الصلاة", icon: '📿' },
                    { type: 'sleep', title: t.sleepTitle, descEn: "Before Sleeping", descAr: "أذكار النوم الصحيحة", icon: '💤' },
                    { type: 'daily_life', title: t.dailyLifeTitle, descEn: "Remembrance of Life", descAr: "الأدعية اليومية العامة", icon: '🤲' },
                    { type: 'travel', title: lang === 'en' ? "Travel Dua" : "أذكار السفر", descEn: "Safe Journeying", descAr: "أدعية السفر والركوب", icon: '🚀' },
                    { type: 'anxiety', title: lang === 'en' ? "Relief & Peace" : "الكرب والفرج", descEn: "Overcome Anxiety", descAr: "أدعية الهم والحزن", icon: '🛡️' },
                    { type: 'food', title: lang === 'en' ? "Food & Drinks" : "أذكار الطعام", descEn: "Eating Gratitude", descAr: "أدعية الطعام والشراب", icon: '🍉' },
                  ].map((item) => {
                    const count = AUTHENTIC_ADHKAR_DB.filter(x => x.category === item.type).length;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          setAdhkarCategory(item.type as any);
                          setSelectedAdhkarCategory(item.type as any);
                          setAdhkarViewState('list');
                          setAdhkarIndex(0);
                        }}
                        className="aspect-square bg-white border-0 rounded-3xl p-2 flex flex-col items-center justify-between text-center transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group active:scale-95"
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-lg transition">
                          {item.icon}
                        </div>
                        <div className="space-y-0.5 mt-1 select-none">
                          <h4 className="font-extrabold text-[10px] text-slate-800 group-hover:text-amber-800 leading-tight truncate max-w-full">
                            {item.title}
                          </h4>
                          <p className="text-[7.5px] text-slate-400 font-medium truncate block max-w-full">
                            {lang === 'en' ? item.descEn : item.descAr}
                          </p>
                        </div>
                        <span className="text-[7px] uppercase font-mono font-black bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md leading-none select-none">
                          {count} {lang === 'en' ? "Adhkar" : "أذكار"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedAdhkarCategory !== null && (
              <div className="space-y-6 animate-fadeIn">
                {/* Back controls on top */}
                <div className="flex items-center justify-between max-w-4xl mx-auto border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAdhkarCategory(null)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 border-0 cursor-pointer transition active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'en' ? "Back to Index" : "العودة للفهرس"}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {selectedAdhkarCategory === 'morning' ? '☀️' : selectedAdhkarCategory === 'evening' ? '🌙' : selectedAdhkarCategory === 'after_salah' ? '📿' : selectedAdhkarCategory === 'sleep' ? '💤' : selectedAdhkarCategory === 'travel' ? '🚀' : selectedAdhkarCategory === 'anxiety' ? '🛡️' : selectedAdhkarCategory === 'food' ? '🍉' : '🤲'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 capitalize font-sans">
                      {lang === 'en' ? `${selectedAdhkarCategory.replace('_', ' ')} Walkthrough` : `أذكار ${selectedAdhkarCategory === 'morning' ? 'الصباح' : selectedAdhkarCategory === 'evening' ? 'المساء' : selectedAdhkarCategory === 'after_salah' ? 'بعد الصلاة' : selectedAdhkarCategory === 'sleep' ? 'النوم' : selectedAdhkarCategory === 'travel' ? 'السفر والركوب' : selectedAdhkarCategory === 'anxiety' ? 'الفرج والهمّ' : selectedAdhkarCategory === 'food' ? 'الطعام والشراب' : 'اليوم الكلية'}`}
                    </h3>
                  </div>
                </div>

                {adhkarViewState === 'list' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAdhkar.map((item, globalIdx) => {
                      const currentCount = adhkarCompletedStates[item.id] || 0;
                      const isDone = currentCount >= item.targetCount;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setAdhkarIndex(globalIdx);
                            setAdhkarViewState('detail');
                          }}
                          className={`w-full p-4 rounded-[2rem] border-0 text-left transition flex flex-col justify-between cursor-pointer gap-3 min-h-[120px] shadow-lg ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-950 shadow-emerald-900/5'
                              : 'bg-white hover:bg-slate-50 hover:shadow-xl text-slate-800 shadow-slate-200/50'
                          }`}
                          style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-mono shrink-0 mt-0.5 ${
                              isDone ? 'bg-emerald-200 text-emerald-900 font-extrabold' : 'bg-slate-100 text-slate-600 font-bold'
                            }`}>
                              {isDone ? "✓" : globalIdx + 1}
                            </span>
                            <span className="font-sans leading-relaxed text-sm md:text-base font-semibold line-clamp-3 overflow-hidden text-right w-full" dir="rtl">
                              {item.arabic}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-auto w-full pt-2 border-t border-slate-100/50">
                            <span className="text-[10px] text-slate-500 line-clamp-1 flex-1">
                              {lang === 'en' ? item.translationEn : item.transliteration}
                            </span>
                            <span className={`font-mono text-[10px] font-black shrink-0 px-2 py-0.5 rounded-lg ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                              {currentCount} / {item.targetCount}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {adhkarViewState === 'detail' && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    {/* Return to list button */}
                    <button
                      onClick={() => setAdhkarViewState('list')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition py-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {lang === 'en' ? "Back to List" : "العودة للقائمة"}
                    </button>

                    {isCategoryCurrentlyFullyComplete ? (
                      <motion.div 
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#FAF8F5] border-2 border-dashed border-emerald-500/30 rounded-3xl p-10 text-center space-y-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 mx-auto flex items-center justify-center">
                          <Check className="w-8 h-8 font-extrabold" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900">{t.completedStatus}</h4>
                        <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                          {t.completedWellDone.replace("{count}", String(filteredAdhkar.length))}
                        </p>
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              const resetObj = { ...adhkarCompletedStates };
                              filteredAdhkar.forEach(x => { resetObj[x.id] = 0; });
                              setAdhkarCompletedStates(resetObj);
                              setAdhkarIndex(0);
                            }}
                            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-950 text-white font-extrabold text-[11px] uppercase tracking-wide rounded-xl shadow cursor-pointer transition"
                          >
                            {t.resetAdhkar}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100 relative space-y-6">
                        {/* Title / Badge details - smaller text, left aligned */}
                        <div className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg">
                              {activeStep.grade === 'Sahih' ? "Sahih" : "Hasan"}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {adhkarIndex + 1} / {filteredAdhkar.length}
                          </span>
                        </div>

                        {/* Transliteration & Source references */}
                        <div className="space-y-8 text-center w-full">
                          <div className="relative w-full text-center" dir="rtl">
                            <p className="text-3xl md:text-4xl text-[#004d3d] font-serif leading-loose font-bold py-4 select-all">
                              {activeStep.arabic}
                            </p>
                            
                            {/* REDESIGNED COUNTER ZONE - Centered, Prominent */}
                            <div className="flex justify-center items-center py-4">
                              <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  triggerSynthClick(800);
                                  handleStepClick(activeStep);
                                }}
                                disabled={(adhkarCompletedStates[activeStep.id] || 0) >= activeStep.targetCount}
                                className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center border-4 shadow-xl cursor-pointer transition-all ${
                                  (adhkarCompletedStates[activeStep.id] || 0) >= activeStep.targetCount
                                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/30'
                                    : 'bg-white border-amber-100 text-slate-800 hover:border-amber-200'
                                }`}
                              >
                                {((adhkarCompletedStates[activeStep.id] || 0) >= activeStep.targetCount) ? (
                                  <Check className="w-12 h-12 md:w-16 md:h-16 mb-1" />
                                ) : (
                                  <span className="text-4xl md:text-5xl font-black font-mono">
                                    {activeStep.targetCount - (adhkarCompletedStates[activeStep.id] || 0)}
                                  </span>
                                )}
                                <span className="text-[9px] uppercase tracking-widest font-bold opacity-80 mt-1">
                                  {lang === 'en' ? "Count" : "العدد"}: {adhkarCompletedStates[activeStep.id] || 0} / {activeStep.targetCount}
                                </span>
                              </motion.button>
                            </div>
                          </div>
                          
                          <p className="text-slate-600 text-sm md:text-base font-serif italic max-w-lg mx-auto mt-4">
                            {lang === 'en' ? activeStep.translationEn : activeStep.translationAr}
                          </p>
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 inline-block w-full max-w-lg text-left">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              {lang === 'en' ? "Transliteration" : "اللفظ"}
                            </span>
                            <p className="text-xs text-slate-700 font-mono leading-relaxed">
                              {activeStep.transliteration}
                            </p>
                          </div>
                        </div>

                        {/* Navigation Actions */}
                        <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => setAdhkarIndex(prev => Math.max(0, prev - 1))}
                            disabled={adhkarIndex === 0}
                            className={`p-3 rounded-xl transition-all ${adhkarIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-700 bg-slate-50 hover:bg-slate-100'}`}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={() => setAdhkarIndex(prev => Math.min(filteredAdhkar.length - 1, prev + 1))}
                            disabled={adhkarIndex === filteredAdhkar.length - 1}
                            className={`p-3 rounded-xl transition-all ${adhkarIndex === filteredAdhkar.length - 1 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-700 bg-slate-50 hover:bg-slate-100'}`}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      
      {/* ADHKAR BOTTOM DRAWERS */}
      <AnimatePresence>
        {activeAdhkarDrawer === 'tasbih' && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => handleSetAdhkarDrawer(null)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-3xl shadow-2xl h-[85vh] md:h-[75vh] flex flex-col overflow-hidden"
            >
              <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex flex-col">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">{t.tasbih}</h3>
                  <p className="text-xs text-slate-500 font-medium">Digital Dhikr Counter</p>
                </div>
                <button 
                  onClick={() => handleSetAdhkarDrawer(null)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center pb-24 space-y-8">
                
                {/* Custom Wird Header */}
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.tasbihHeader}</span>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                      <button onClick={() => setCustomTarget(33)} className={`px-3 py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${customTarget === 33 ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}`}>33</button>
                      <div className="w-[1px] h-4 bg-slate-200"></div>
                      <button onClick={() => setCustomTarget(100)} className={`px-3 py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${customTarget === 100 ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}`}>100</button>
                      <div className="w-[1px] h-4 bg-slate-200"></div>
                      <button onClick={() => setCustomTarget(999)} className={`px-3 py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${customTarget === 999 ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}`}>∞</button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="E.g., Subhanallah, Alhamdulillah..." 
                    value={customWirdText}
                    onChange={(e) => setCustomWirdText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-800"
                  />
                </div>

                <div className="flex justify-center items-center py-4 w-full">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTasbihBeadIncrement}
                    className="w-full max-w-sm aspect-[2/1] rounded-3xl bg-white text-slate-900 shadow-md border border-slate-200 flex flex-col items-center justify-center relative cursor-pointer outline-none select-none hover:shadow-lg transition-all group overflow-hidden"
                    id="bead-circle-counter"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                      <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${(tasbihCount / (customTarget || 33)) * 100}%` }}></div>
                    </div>
                    
                    <span className="text-7xl font-black font-mono text-slate-900 mb-3 tracking-tighter">
                      {tasbihCount.toString().padStart(2, '0')}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                        Target: {customTarget || 33}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                        {(customTarget || 33) - tasbihCount} {lang === 'en' ? "Left" : "متبقٍ"}
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors"></div>
                  </motion.button>
                </div>
                
                {/* Haptic / Synth sound controls */}
                <div className="w-full max-w-md bg-slate-50 border border-slate-200/60 rounded-2xl p-4.5 flex flex-col gap-3 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                      <input
                        type="checkbox"
                        checked={tasbihBeep}
                        onChange={(e) => setTasbihBeep(e.target.checked)}
                        className="rounded border-slate-300 text-amber-700 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{t.synthBeep}</span>
                    </label>
                    <button 
                      onClick={() => triggerSynthClick(440)}
                      className="px-2.5 py-1 bg-white border border-slate-200 uppercase tracking-wider text-[9px] rounded-lg font-mono hover:bg-slate-100"
                    >
                      {t.soundSampleBtn}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                      <input
                        type="checkbox"
                        checked={tasbihVibrate}
                        onChange={(e) => setTasbihVibrate(e.target.checked)}
                        className="rounded border-slate-300 text-amber-700 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{t.hapticsLabel}</span>
                    </label>
                    <span className="text-[9px] font-mono text-slate-400">Mobile Haptic engine</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTasbihCount(0)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-amber-950 text-white font-extrabold text-xs rounded-xl shadow transition duration-250 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "Full Recount Reset" : "تصفير المعداد"}</span>
                  </button>
                </div>

            {/* MOCK LIVE MULTI-USER DHIKR CHAMBER OR HALAQA ROOM (Extremely Retentive Feature) */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden border border-slate-800 shadow-xl space-y-6">
              
              <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-y-1/4">
                <Users className="w-80 h-80" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Side description */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-yellow-300 bg-yellow-950/60 px-3 py-1 rounded-full border border-yellow-500/20">
                    <Users className="w-3.5 h-3.5" /> Live Shared Halaqa
                  </span>
                  
                  <h3 className="text-2xl font-black tracking-tight font-sans">
                    {t.groupTasbihTitle}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed text-justify">
                    {t.groupTasbihDesc}
                  </p>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-slate-300 font-sans mb-1.5">
                      <span>{t.groupJointGoal}</span>
                      <span className="font-extrabold text-yellow-400">{groupTargetCount} / 15,000 taps</span>
                    </div>
                    {/* Goal Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-2.5 transition-all duration-500" 
                        style={{ width: `${(groupTargetCount / 15000) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setGroupTargetCount(prev => prev + 33);
                        triggerSynthClick(880);
                        // Add action to state simulated log
                        const customMsg: PeerActivity = {
                          id: String(Date.now()),
                          time: "Now",
                          name: lang === 'en' ? "You (Academy Fellow)" : "أنت (طالب مجتهد)",
                          location: lang === 'en' ? "Your Region" : "إقليمك الحالي",
                          action: "Contributed +33 Tasbih beads"
                        };
                        setPeerActivities(prev => [customMsg, ...prev]);
                      }}
                      className="px-6 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black hover:text-black font-extrabold text-xs tracking-wider rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 justify-center w-full uppercase"
                    >
                      <span>{t.groupContribute}</span>
                    </button>
                  </div>
                </div>

                {/* Right Side live logs ledger ticker */}
                <div className="lg:col-span-7 bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-6 h-64 overflow-y-auto shadow-inner space-y-3 scrollbar-thin">
                  <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider block border-b border-slate-800 pb-2">
                    ● {t.groupLogsTitle}
                  </span>

                  <div className="space-y-2.5">
                    {peerActivities.map((act) => (
                      <div 
                        key={act.id} 
                        className="flex items-center justify-between text-xs py-2 px-3 bg-slate-900/60 rounded-xl border border-slate-800/60 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span className="font-bold text-slate-200">{act.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({act.location})</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-mono text-yellow-350">{act.action}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

              </div>
            </motion.div>
          </div>
        )}

        {/* DRAWER C: GEOLOCATION ASTRONOMICAL PRAYER TIMES */}
        {activeAdhkarDrawer === 'prayers' && (
          <div key="prayers-drawer-root">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[200] cursor-pointer"
              onClick={() => handleSetAdhkarDrawer(null)}
            />
            {/* Slide-Up Sheet */}
            <motion.div
              key="prayers-drawer"
              drag="y"
              dragConstraints={{ top: 0, bottom: 600 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 150) {
                  handleSetAdhkarDrawer(null);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "105%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 bg-white text-slate-800 rounded-t-[2rem] shadow-2xl z-[201] max-h-[90vh] overflow-y-auto border-t border-slate-205 pb-12"
            >
              <div className="flex flex-col items-center py-3.5 select-none">
                <div className="w-14 h-1.5 bg-slate-200 hover:bg-slate-350 rounded-full cursor-pointer transition-colors" onClick={() => handleSetAdhkarDrawer(null)} />
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 font-sans">Swipe down or tap above to close</span>
              </div>
              
              <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-6 pb-12">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#C59B32] font-mono font-bold leading-none mb-1 block">Astronomical Calculations</span>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                      {lang === 'en' ? "Solar Timings Scheduler" : "رصد مواقيت الصلاة الشمسية"}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleSetAdhkarDrawer(null)}
                    type="button"
                    className="p-1.5 px-4 bg-slate-100 text-slate-705 hover:bg-slate-200 rounded-xl text-xs font-black cursor-pointer border-0 transition-all active:scale-95"
                  >
                    {lang === 'en' ? "Dismiss" : "إغلاق"}
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Coordinates search */}
              <div className="lg:col-span-5 bg-white border border-slate-150/40 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
                
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-amber-900 bg-amber-55 bg-amber-50 px-2.5 py-1 rounded-lg font-black">
                    🛰 Geographic Positioning
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {t.prayerTimesTitle}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed text-justify">
                    {t.prayerTimesDesc}
                  </p>

                  <table className="w-full border-t border-slate-100 mt-2 text-xs">
                    <tbody>
                      <tr className="border-b border-slate-100/60 py-2.5 block">
                        <td className="font-bold text-slate-500 uppercase text-[10px] w-40">Device Status</td>
                        <td className="text-slate-800 font-mono font-bold text-right">{locStatus || "No coordinates loaded"}</td>
                      </tr>
                      {latitude && (
                        <>
                          <tr className="border-b border-slate-100/60 py-2.5 block">
                            <td className="font-bold text-slate-500 uppercase text-[10px] w-40">Latitude</td>
                            <td className="text-slate-800 font-mono text-right">{latitude.toFixed(4)}</td>
                          </tr>
                          <tr className="border-b border-slate-100/60 py-2.5 block">
                            <td className="font-bold text-slate-500 uppercase text-[10px] w-40">Longitude</td>
                            <td className="text-slate-800 font-mono text-right">{longitude.toFixed(4)}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        setLocStatus("Searching GPS...");
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setLatitude(pos.coords.latitude);
                            setLongitude(pos.coords.longitude);
                            setLocStatus("Detected successfully");
                            fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
                          },
                          () => setLocStatus("Unable to fetch")
                        );
                      }
                    }}
                    className="px-5 py-3.5 bg-slate-900 hover:bg-[#201004] text-white font-extrabold text-xs tracking-wide rounded-xl shadow-md w-full transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{t.detectLocBtn}</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Calculations times cards ledger */}
              <div className="lg:col-span-7 bg-white border border-slate-150/40 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider">
                      Astronomy Sun Tracking Schedule
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {t.recommendedNow}
                    </span>
                  </div>

                  <p className="text-slate-650 text-[11px] leading-relaxed">
                    Reciting Adhkar at these times keeps your heart steady. Below are evaluated solar milestones.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { name: "Fajr (Dawn)", time: prayerTimes.Fajr, highlight: true, note: t.morningAdhkarWindow },
                      { name: "Sunrise (Shuruq)", time: prayerTimes.Sunrise, highlight: false, note: "End of morning window" },
                      { name: "Dhuhr (Midday)", time: prayerTimes.Dhuhr, highlight: false, note: "Zenith transition" },
                      { name: "Asr (Afternoon)", time: prayerTimes.Asr, highlight: true, note: t.eveningAdhkarWindow },
                      { name: "Maghrib (Sunset)", time: prayerTimes.Maghrib, highlight: false, note: "Reposes declarations" },
                      { name: "Isha (Nightfall)", time: prayerTimes.Isha, highlight: false, note: "Read sleep protections" },
                    ].map((time) => (
                      <div 
                        key={time.name}
                        className={`p-4 rounded-2xl border text-center space-y-1.5 transition ${
                          time.highlight 
                            ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-250 shadow-xs' 
                            : 'bg-slate-50/50 border-slate-200'
                        }`}
                      >
                        <span className={`text-[10px] font-black uppercase ${time.highlight ? 'text-amber-900' : 'text-slate-400'}`}>
                          {time.name}
                        </span>
                        <span className="text-xl font-bold font-mono text-slate-805 block">
                          {time.time}
                        </span>
                        <p className="text-[8px] text-slate-450 mt-1 leading-snug">{time.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-300 p-4.5 rounded-2xl border border-slate-800 mt-6 flex items-center justify-between text-xs leading-none">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />
                    <span className="font-bold">Next Milestone: <strong className="text-white">{nextPrayerName}</strong></span>
                  </div>
                  <span className="font-mono text-emerald-300 font-bold">{nextPrayerTimeLeft} remaining</span>
                </div>

              </div>

            </div>

            {/* Notification Reminders Panel */}
            <div className="bg-white border border-slate-150/40 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#d97706] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#f59e0b]/20 font-extrabold">
                    <Bell className="w-3 h-3 text-amber-700 animate-bounce" /> {lang === 'en' ? "Reminders Hub" : "مركز الاستيقاظ والتذكيرات"}
                  </span>
                  <h4 className="text-lg font-black text-slate-950 font-sans tracking-tight">
                    {lang === 'en' ? "Daily Adhkar Notification Reminders" : "جدولة إشعارات الأذكار اليومية"}
                  </h4>
                  <p className="text-xs text-slate-505 max-w-xl">
                    {lang === 'en' 
                      ? "Enlist browser-native push notifications to remind you when the morning and evening adhkar periods open. Ensure the application is open in the background to dispatch alarms." 
                      : "احصل على تنبيهات فورية مباشرة من متصفحك يذكرك فور دخول وقت الورد الصباحي والمسائي. تأكد من إبقاء النافذة مفتوحة لتلقي التنبيه."}
                  </p>
                </div>
                
                {/* Visual Status and Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{lang === 'en' ? "System Integration" : "تكامل النظام"}</span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border mt-0.5 ${
                      notificationPermission === 'granted' 
                        ? 'text-emerald-800 bg-emerald-50 border-emerald-250' 
                        : notificationPermission === 'denied' 
                        ? 'text-rose-800 bg-rose-50 border-rose-200' 
                        : 'text-amber-850 bg-amber-50 border-amber-200'
                    }`}>
                      {notificationPermission === 'granted' 
                        ? (lang === 'en' ? "Active ✓" : "مفعّل ✓") 
                        : notificationPermission === 'denied' 
                        ? (lang === 'en' ? "Blocked ✕" : "محجوب ✕") 
                        : (lang === 'en' ? "Needs Permission" : "يتطلب تصريح")}
                    </span>
                  </div>

                  <button
                    onClick={testNotification}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-220 text-xs font-black rounded-xl transition cursor-pointer"
                  >
                    {lang === 'en' ? "Test Notification" : "تجربة الإشعار"}
                  </button>
                  
                  {notificationPermission !== 'granted' && (
                    <button
                      onClick={requestNotificationPermission}
                      className="px-4 py-2 bg-amber-800 hover:bg-[#201002] text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{lang === 'en' ? "Enable Permission" : "منح تصريح"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Message Notification Toast inside UI */}
              <AnimatePresence>
                {notificationStatusMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl text-xs border ${
                      notificationStatusMsg.mode === 'success' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : notificationStatusMsg.mode === 'warn' 
                        ? 'bg-amber-50 border-amber-200 text-amber-800' 
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {notificationStatusMsg.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scheduler Input Forms Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Morning reminder block */}
                <div className="p-5 border border-slate-200/80 rounded-2xl bg-[#fafafa]/50 flex flex-col justify-between hover:border-amber-500/25 transition">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <h5 className="font-extrabold text-slate-900 text-sm">
                          {lang === 'en' ? "Morning Adhkar Alarm" : "تنبيه أوراد الصباح"}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-500 max-w-xs">
                        {lang === 'en' 
                          ? "Set a standard daily alarm to recite protective morning adhkar." 
                          : "قم بتوصيف وقت الإشعار اليومي المفضل لتلاوة أذكار الصباح."}
                      </p>
                    </div>

                    {/* Enable input toggler checkbox switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={morningReminderEnabled}
                        onChange={(e) => {
                          setMorningReminderEnabled(e.target.checked);
                          if (e.target.checked && notificationPermission !== 'granted') {
                            requestNotificationPermission();
                          }
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
                    </label>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100/60 pt-4">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      {lang === 'en' ? "Daily Alarm time" : "توقيت التنبيه"}
                    </span>
                    <input 
                      type="time" 
                      value={morningReminderTime}
                      onChange={(e) => setMorningReminderTime(e.target.value)}
                      disabled={!morningReminderEnabled}
                      className="px-3 py-1.5 bg-white border border-slate-350 disabled:opacity-40 rounded-xl text-xs font-mono font-black text-slate-905 outline-none focus:ring-1 focus:ring-amber-500/50 transition cursor-pointer"
                    />
                  </div>
                </div>

                {/* Evening reminder block */}
                <div className="p-5 border border-slate-200/80 rounded-2xl bg-[#fafafa]/50 flex flex-col justify-between hover:border-amber-500/25 transition">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-750 animate-pulse"></span>
                        <h5 className="font-extrabold text-slate-900 text-sm">
                          {lang === 'en' ? "Evening Adhkar Alarm" : "تنبيه أوراد المساء"}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-450 max-w-xs">
                        {lang === 'en' 
                          ? "Set a standard daily alarm to recite protective evening adhkar." 
                          : "قم بتوصيف وقت الإشعار اليومي المفضل لتلاوة أذكار المساء."}
                      </p>
                    </div>

                    {/* Enable input toggler checkbox switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={eveningReminderEnabled}
                        onChange={(e) => {
                          setEveningReminderEnabled(e.target.checked);
                          if (e.target.checked && notificationPermission !== 'granted') {
                            requestNotificationPermission();
                          }
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
                    </label>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100/60 pt-4">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      {lang === 'en' ? "Daily Alarm time" : "توقيت التنبيه"}
                    </span>
                    <input 
                      type="time" 
                      value={eveningReminderTime}
                      onChange={(e) => setEveningReminderTime(e.target.value)}
                      disabled={!eveningReminderEnabled}
                      className="px-3 py-1.5 bg-white border border-slate-350 disabled:opacity-40 rounded-xl text-xs font-mono font-black text-slate-905 outline-none focus:ring-1 focus:ring-amber-500/50 transition cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            </div>

              </div>
            </motion.div>
          </div>
        )}

        {/* DRAWER D: AI SUPPLICATION PLANNER & ARCHIVE */}
        {activeAdhkarDrawer === 'dua' && (
          <div key="dua-drawer-root">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[200] cursor-pointer"
              onClick={() => handleSetAdhkarDrawer(null)}
            />
            {/* Slide-Up Sheet */}
            <motion.div
              key="dua-drawer"
              drag="y"
              dragConstraints={{ top: 0, bottom: 600 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 150) {
                  handleSetAdhkarDrawer(null);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "105%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 bg-white text-slate-800 rounded-t-[2rem] shadow-2xl z-[201] max-h-[90vh] overflow-y-auto border-t border-slate-205 pb-12"
            >
              <div className="flex flex-col items-center py-3.5 select-none">
                <div className="w-14 h-1.5 bg-slate-200 hover:bg-slate-350 rounded-full cursor-pointer transition-colors" onClick={() => handleSetAdhkarDrawer(null)} />
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 font-sans">Swipe down or tap above to close</span>
              </div>
              
              <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-6 pb-12">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#C59B32] font-mono font-bold leading-none mb-1 block">Mental Counselor & Intentional Supplicator</span>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                      {lang === 'en' ? "Counselor Supplications Planner" : "مرشد أدعية المؤمن الشخصي"}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleSetAdhkarDrawer(null)}
                    type="button"
                    className="p-1.5 px-4 bg-slate-100 text-slate-705 hover:bg-slate-200 rounded-xl text-xs font-black cursor-pointer border-0 transition-all active:scale-95"
                  >
                    {lang === 'en' ? "Dismiss" : "إغلاق"}
                  </button>
                </div>
            {/* Planner Header */}
            <div className="bg-white border border-slate-150/40 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-905 bg-amber-50 rounded-full border border-amber-250/20 py-0.5 px-3 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Intentional supplicator engine
                </span>
                <label className="block text-sm font-black text-slate-850">
                  {lang === 'en' ? "Describe your study/life goal or anxiety:" : "صف أمنيتك، قلقك، رغبتك في الدراسة والتعلم أو نيتك الصادقة:"}
                </label>
                <input
                  type="text"
                  className="w-full p-4.5 text-sm bg-slate-50/70 text-slate-900 border border-slate-220 hover:border-slate-350 rounded-2xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all shadow-sm"
                  placeholder={t.goalPlaceholder}
                  value={duaIntention}
                  onChange={(e) => setDuaIntention(e.target.value)}
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleIntentionSubmit();
                  }}
                  id="input-dua-topic"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleIntentionSubmit}
                  disabled={isGenerating || !duaIntention.trim()}
                  className="px-6 py-4 rounded-xl bg-amber-800 hover:bg-[#201002] text-white font-extrabold text-xs tracking-wide transition shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  id="btn-generate-dua"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>{lang === 'en' ? "Assembling Spiritual Supplications..." : "يجري صياغة الدعاء المناسب..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5 text-amber-250 animate-pulse" />
                      <span>{t.formulateBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-250/30 flex items-start gap-3 text-xs leading-relaxed max-w-2xl mx-auto shadow-sm" 
                id="error-dua"
              >
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Supplication Assembly Notice</p>
                  <p>{error}</p>
                </div>
              </motion.div>
            )}

            {/* Generated Supplication card */}
            {generatedDua && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#faf8f3] border border-amber-900/10 rounded-3xl shadow-xl p-6 md:p-12 space-y-8" 
                id="generated-dua-card"
              >
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-5">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] px-3.5 py-1.5 rounded-xl uppercase tracking-wider font-extrabold border border-amber-205/20">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    {lang === 'en' ? "Spiritual Assembly Accomplished" : "دعاء وتوجيه روحي مخصص"}
                  </span>
                  <button
                    onClick={pinDua}
                    className="text-xs font-bold bg-amber-805 hover:bg-black text-white px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    id="btn-pin-dua"
                  >
                    <Heart className="w-4 h-4 fill-amber-200 text-amber-200" />
                    <span>{lang === 'en' ? "Pin to Saved board" : "حفظ لبطاقاتي"}</span>
                  </button>
                </div>

                <div className="space-y-6 text-center">
                  <span className="text-xs text-slate-500 font-sans tracking-tight">
                    {lang === 'en' ? "Topic Intention" : "الغاية"} — <strong className="text-amber-900">{generatedDua.topic}</strong>
                  </span>
                  
                  {/* Large Beautiful Arabic text inside custom plaque */}
                  <p className="text-3xl text-emerald-950 font-serif leading-loose font-extrabold py-6 px-4 md:px-12 border-y border-amber-900/10 bg-white rounded-2xl shadow-inner max-w-3xl mx-auto" dir="rtl">
                    {generatedDua.arabicText}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{lang === 'en' ? "Pronunciation / Transliteration" : "اللفظ بالحروف اللاتينية"}</span>
                    <p className="text-xs md:text-sm text-slate-700 font-sans italic max-w-2xl mx-auto leading-relaxed">
                      {generatedDua.transliteration}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{lang === 'en' ? "English Meaning" : "المعنى بالإنجليزية"}</span>
                    <p className="text-sm md:text-base text-slate-800 leading-relaxed font-sans font-medium max-w-2xl mx-auto">
                      "{generatedDua.translation}"
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/50 p-5 border border-amber-250/20 rounded-2xl space-y-1 text-slate-700 max-w-4xl mx-auto shadow-sm">
                  <span className="text-[10px] font-bold text-amber-905 uppercase tracking-wider block">{lang === 'en' ? "Traditional Wisdom & Etiquette" : "الفضل والأثر الروحي للمريض والتعلم"}</span>
                  <p className="text-xs leading-relaxed font-sans italic">
                    {generatedDua.context}
                  </p>
                </div>
              </motion.div>
            )}

            {/* CURATED CLASSICAL BACKUPS LEDGER */}
            <div className="space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-l-4 border-amber-805 pl-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-805" />
                  <span>{t.classicBackupTitle}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {t.classicBackupDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {OPTIMAL_CLASSIC_PRAYERS.map((pr, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-200/80 hover:border-amber-600/20 transition rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider">
                          {pr.topic}
                        </span>
                      </div>
                      
                      <p className="text-2xl text-slate-850 font-serif leading-loose font-extrabold select-all text-right" dir="rtl">
                        {pr.arabic}
                      </p>

                      <p className="text-[10px] text-slate-505 font-mono italic leading-relaxed">
                        "{pr.transliteration}"
                      </p>

                      <p className="text-xs text-slate-650 leading-relaxed">
                        {pr.translation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Source: K-12 Canon book</span>
                      <button 
                        onClick={() => {
                          const mockCustom: CustomDua = {
                            id: "pn-" + Date.now() + idx,
                            topic: pr.topic,
                            arabicText: pr.arabic,
                            transliteration: pr.transliteration,
                            translation: pr.translation,
                            context: pr.context,
                            date: new Date().toLocaleDateString()
                          };
                          setPinnedDuas(prev => {
                            const updated = [mockCustom, ...prev];
                            return updated;
                          });
                        }}
                        className="text-xs text-amber-900 border border-amber-250 bg-amber-50 px-2.5 py-1 rounded-xl font-sans font-extrabold hover:bg-amber-950 hover:text-white transition cursor-pointer"
                      >
                        Pin to Saved
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* PINNED SUPPLICAITONS GALLERY */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-l-4 border-amber-800 pl-3 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-805" />
                {t.savedDuasTitle}
              </h3>

              {pinnedDuas.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-slate-200 text-center rounded-3xl text-slate-400 text-xs font-sans">
                  {t.noSavedDuas}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pinnedDuas.map((dua, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={dua.id}
                      className="p-6 md:p-8 rounded-3xl bg-white border border-slate-205 shadow-md flex flex-col justify-between space-y-5 transition-all hover:shadow-lg relative group"
                    >
                      <button
                        onClick={() => removePinnedDua(dua.id)}
                        className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={lang === 'en' ? "Unpin supplication" : "إلغاء الحفظ"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          <span className="text-[10px] font-black text-slate-650 uppercase tracking-wider">
                            {dua.topic}
                          </span>
                        </div>
                        <p className="text-xl md:text-2xl text-emerald-950 font-serif font-extrabold leading-loose py-2 border-b border-dashed border-slate-100" dir="rtl">
                          {dua.arabicText}
                        </p>
                        <p className="text-xs text-slate-650 leading-relaxed italic block mt-2">
                          "{dua.translation}"
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-400 font-bold font-sans flex justify-between items-center border-t border-slate-100 pt-3 mt-4">
                        <span>Pinned on {dua.date}</span>
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-205/30 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest">Verified Verse</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

      {/* BOTTOM PREMIUM FLOATING DOCK (only visible on index page of Adhkars) */}
      {selectedAdhkarCategory === null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm sm:max-w-md px-4 select-none animate-fadeIn">
          <div className="bg-linear-to-b from-[#0e4b3b] to-[#062c21] border border-emerald-700/50 rounded-3xl shadow-2xl p-2 md:p-2.5 flex items-center justify-around text-white">
            
            <button 
              onClick={() => handleSetAdhkarDrawer('prayers')}
              type="button"
              className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all w-1/3 hover:bg-emerald-800/40 cursor-pointer active:scale-95 ${activeAdhkarDrawer === 'prayers' ? 'bg-amber-900/45 text-amber-300 font-bold' : 'text-slate-200'}`}
            >
              <MapPin className="w-5 h-5 text-amber-400 mb-1 animate-pulse" />
              <span className="text-[10px] font-bold tracking-tight">{lang === 'en' ? "Solar Timings" : "مواقيت الصلاة"}</span>
            </button>

            <div className="w-[1px] h-8 bg-emerald-800/40" />

            <button 
              onClick={() => handleSetAdhkarDrawer('tasbih')}
              type="button"
              className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all w-1/3 hover:bg-emerald-800/40 cursor-pointer active:scale-95 ${activeAdhkarDrawer === 'tasbih' ? 'bg-amber-900/45 text-amber-300 font-bold' : 'text-slate-200'}`}
            >
              <Compass className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[10px] font-bold tracking-tight">{lang === 'en' ? "Digital Tasbih" : "المسبحة الإلكترونية"}</span>
            </button>

            <div className="w-[1px] h-8 bg-emerald-800/40" />

            <button 
              onClick={() => handleSetAdhkarDrawer('dua')}
              type="button"
              className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all w-1/3 hover:bg-emerald-800/40 cursor-pointer active:scale-95 ${activeAdhkarDrawer === 'dua' ? 'bg-amber-900/45 text-amber-300 font-bold' : 'text-slate-200'}`}
            >
              <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[10px] font-bold tracking-tight">{lang === 'en' ? "AI Supplications" : "مرشد الأدعية"}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
