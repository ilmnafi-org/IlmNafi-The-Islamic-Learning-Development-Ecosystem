/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, Bell, BellOff, Compass, MapPin, Sparkles, 
  Activity, Check, Moon, Heart, Info, AlertCircle, 
  RefreshCw, Navigation, CheckCircle2 
} from 'lucide-react';

interface PrayerTime {
  name: string;
  labelEn: string;
  labelAr: string;
  timeString: string;
}

const PRAYERS: PrayerTime[] = [
  { name: 'fajr', labelEn: 'Fajr', labelAr: 'الفجر', timeString: '04:12' },
  { name: 'dhuhr', labelEn: 'Dhuhr', labelAr: 'الظهر', timeString: '12:35' },
  { name: 'asr', labelEn: 'Asr', labelAr: 'العصر', timeString: '16:15' },
  { name: 'maghrib', labelEn: 'Maghrib', labelAr: 'المغرب', timeString: '19:42' },
  { name: 'isha', labelEn: 'Isha', labelAr: 'العشاء', timeString: '21:18' }
];

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const PRESETS = [
  { name: 'Mecca', lat: 21.4225, lng: 39.8262 },
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 }
];

const DAILY_HADITHS = [
  "Seeking knowledge is a boundary obligation upon every Muslim. (Sunan Ibn Majah)",
  "The best of you are those who learn the Quran and teach it to others. (Sahih Al-Bukhari)",
  "Whoever treads a path in search of knowledge, Allah will make easy for him a path to Paradise. (Sahih Muslim)",
  "Verily, the angels lower their wings in pleasure for the seeker of knowledge. (Sunan Abi Dawud)",
  "Knowledge is only acquired through study, and understanding only through contemplation."
];

export function DeenSuite({ lang }: { lang: 'en' | 'ar' }) {
  // --- STATE DECLARATIONS ---
  const [countdownStr, setCountdownStr] = useState('00:00:00');
  const [nextPrayer, setNextPrayer] = useState<PrayerTime>(PRAYERS[0]);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTime>(PRAYERS[PRAYERS.length - 1]);
  
  // Notification Permissions & Subscriptions State
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );
  const [hadithEnabled, setHadithEnabled] = useState(false);
  const [stickyEnabled, setStickyEnabled] = useState(false);

  // Qiblah Compass State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [manualLat, setManualLat] = useState('30.0440');
  const [manualLng, setManualLng] = useState('31.2350');
  const [qiblahAngle, setQiblahAngle] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // PWA Installation Prompts State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // References to handle timing checks and notification throttle
  const stickyNotificationRef = useRef<Notification | null>(null);
  const lastUpdatedRef = useRef<number>(0);

  // --- MATHEMATICAL FORMULAS ---
  const calculateQiblah = (lat: number, lng: number): number => {
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
  };

  // --- INITIALIZE GEOLOCATION / DEFAULTS & AUTO-PERMISSIONS ---
  useEffect(() => {
    // 1. Set initial location (Cairo)
    const initLat = 30.0444;
    const initLng = 31.2357;
    setUserCoords({ lat: initLat, lng: initLng });
    setQiblahAngle(calculateQiblah(initLat, initLng));

    // 2. Automatical Geolocation detection on launch (non-blocking)
    if (navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setManualLat(latitude.toFixed(4));
          setManualLng(longitude.toFixed(4));
          setQiblahAngle(calculateQiblah(latitude, longitude));
          setGpsLoading(false);
        },
        (err) => {
          setGpsLoading(false);
          console.log("Automatic high-precision GPS on mount failed, using Egypt placeholder. Detail: ", err);
          // Still fetch if allowed standard precision
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }

    // 3. Automatical prompt for Notifications on load
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((res) => {
        setPermission(res);
        if (res === 'granted') {
          new Notification(
            lang === 'en' ? "Welcome to Ilm Naafi Academy!" : "مرحباً بكم في أكاديمية علم نافع",
            {
              body: lang === 'en'
                ? "Academic lessons, prayer alerts, and beneficial Hadith push services are activated."
                : "تم تفعيل حزمة أذكار اليوم والليلة وتنبيهات مواقيت الصلاة والمقررات الدراسية بنجاح.",
              icon: '/icon-192.png'
            }
          );
        }
      }).catch(err => console.warn("Failed to request notifications automatically: ", err));
    }

    // 4. PWA checks and install prompt captures
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(!!isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Try tracking mobile device orientation compass bearing
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const heading = (e as any).webkitCompassHeading || e.alpha;
      if (typeof heading === 'number') {
        setDeviceHeading(heading);
      }
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (stickyNotificationRef.current) {
        stickyNotificationRef.current.close();
      }
    };
  }, []);

  // --- SALAH TIMES COUNTDOWN TIMER LOOP ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let nextIdx = -1;
      let targetDate = new Date();

      for (let i = 0; i < PRAYERS.length; i++) {
        const [hours, minutes] = PRAYERS[i].timeString.split(':').map(Number);
        const pDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
        
        if (pDate > now) {
          nextIdx = i;
          targetDate = pDate;
          break;
        }
      }

      let currentIdx = 0;
      if (nextIdx === -1) {
        currentIdx = PRAYERS.length - 1; // Isha
        nextIdx = 0; // Fajr of tomorrow
        const [hours, minutes] = PRAYERS[0].timeString.split(':').map(Number);
        targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hours, minutes, 0, 0);
      } else {
        currentIdx = (nextIdx - 1 + PRAYERS.length) % PRAYERS.length;
      }

      setNextPrayer(PRAYERS[nextIdx]);
      setCurrentPrayer(PRAYERS[currentIdx]);

      const msRemaining = targetDate.getTime() - now.getTime();
      const hours = Math.floor(msRemaining / (3600 * 1000));
      const minutes = Math.floor((msRemaining % (3600 * 1000)) / (60 * 1000));
      const seconds = Math.floor((msRemaining % (60 * 1000)) / 1000);

      const fHours = String(hours).padStart(2, '0');
      const fMinutes = String(minutes).padStart(2, '0');
      const fSeconds = String(seconds).padStart(2, '0');
      
      const countdownString = `${fHours}:${fMinutes}:${fSeconds}`;
      setCountdownStr(countdownString);

      // --- STICKY NOTIFICATION COMPONENT ---
      // Update sticky system notification every 30 seconds to maintain high performance and low battery consumption
      if (stickyEnabled && permission === 'granted' && Date.now() - lastUpdatedRef.current > 30000) {
        lastUpdatedRef.current = Date.now();
        const notificationTitle = lang === 'en' 
          ? `Next Salah Tracker: ${PRAYERS[nextIdx].labelEn}` 
          : `مواقيت الصلاة: ${PRAYERS[nextIdx].labelAr}`;
        const notificationBody = lang === 'en'
          ? `Adhan in: ${fHours}h ${fMinutes}m | Calibrated for scholarly discipline.`
          : `متبقي على الأذان: ${fHours} ساعة و ${fMinutes} دقيقة.`;

        try {
          // Check if Service Worker is active for robust background sticky actions
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification(notificationTitle, {
                body: notificationBody,
                tag: 'salah-sticky',
                requireInteraction: true,
                icon: '/icon-192.png',
                badge: '/icon-192.png'
              } as any);
            });
          } else {
            // Native normal browser notification fallback
            if (stickyNotificationRef.current) {
              stickyNotificationRef.current.close();
            }
            stickyNotificationRef.current = new Notification(notificationTitle, {
              body: notificationBody,
              tag: 'salah-sticky',
              requireInteraction: true,
              icon: '/icon-192.png'
            });
          }
        } catch (e) {
          console.warn("Unable to trigger service-worker sticky, falling block: ", e);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [stickyEnabled, permission, lang]);

  // --- RECONCILE LOCATION VIA GEO-GPS API ---
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(lang === 'en' ? "Your web browser does not support Geolocation APIs." : "متصفحك لا يدعم خاصية تحديد الموقع الجغرافي.");
      return;
    }

    setGpsLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setManualLat(latitude.toFixed(4));
        setManualLng(longitude.toFixed(4));
        const angle = calculateQiblah(latitude, longitude);
        setQiblahAngle(angle);
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        let errMsg = lang === 'en' ? "Access to GPS was denied. Please insert manually." : "تم رفض الوصول للمكان الجغرافي. الرجاء الإدخال يدوياً.";
        if (err.code === err.POSITION_UNAVAILABLE) {
          errMsg = lang === 'en' ? "GPS position is unavailable on your network." : "الموقع الجغرافي غير متوفر حالياً على شبكتك.";
        }
        setLocationError(errMsg);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // --- MANUAL COORDINATES CHANGES ---
  const handleManualCoordsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setUserCoords({ lat, lng });
      setQiblahAngle(calculateQiblah(lat, lng));
      setLocationError(null);
    }
  };

  const selectPreset = (preset: typeof PRESETS[0]) => {
    setUserCoords({ lat: preset.lat, lng: preset.lng });
    setManualLat(preset.lat.toFixed(4));
    setManualLng(preset.lng.toFixed(4));
    setQiblahAngle(calculateQiblah(preset.lat, preset.lng));
    setLocationError(null);
  };

  // --- NOTIFICATION MANAGER CONTROLLERS ---
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert(lang === 'en' ? "Notifications are not supported in this browser." : "الإشعارات غير مدعومة في هذا المتصفح.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification(
          lang === 'en' ? "Spiritual Alerts Enabled!" : "تم تفعيل التنبيهات الروحية",
          {
            body: lang === 'en' 
              ? "All daily Hadith notifications and academic prayer alerts are successfully activated." 
              : "تم تفعيل أذكار اليوم والليلة وتنبيهات مواقيت التعلم والصلاة بنجاح.",
            icon: '/icon-192.png'
          }
        );
      }
    } catch (e) {
      console.error("Error setting notification values: ", e);
    }
  };

  const handleHadithNotificationTrigger = () => {
    if (permission !== 'granted') {
      requestNotificationPermission();
      return;
    }

    const nextState = !hadithEnabled;
    setHadithEnabled(nextState);

    if (nextState) {
      const randomHadith = DAILY_HADITHS[Math.floor(Math.random() * DAILY_HADITHS.length)];
      new Notification(
        lang === 'en' ? "Selected Scholar Supplication / Hadith" : "الحديث الشريف وتزكية اليوم",
        {
          body: randomHadith,
          icon: '/icon-192.png'
        }
      );
    }
  };

  const handleStickyNotificationTrigger = () => {
    if (permission !== 'granted') {
      requestNotificationPermission();
      return;
    }

    const nextState = !stickyEnabled;
    setStickyEnabled(nextState);

    if (!nextState) {
      // Clear standard tracker immediately
      if (stickyNotificationRef.current) {
        stickyNotificationRef.current.close();
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.getNotifications({ tag: 'salah-sticky' }).then((notifications) => {
            notifications.forEach(n => n.close());
          });
        });
      }
    } else {
      lastUpdatedRef.current = 0; // Trigger instant update loop
    }
  };

  // --- CALC COMPASS ROTATIONS ---
  // If we have a calculated Qiblah angle and device orientation sensor, rotate accordingly.
  // Standard formulas: compass rotation angle = Qiblah angle - device north heading
  const needleRotation = qiblahAngle !== null 
    ? (deviceHeading !== null ? (qiblahAngle - deviceHeading) : qiblahAngle) 
    : 0;

  const isWithPrecision = qiblahAngle !== null && Math.abs(needleRotation % 360) < 6;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Installation choice outcome is: ", outcome);
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* PWA INSTALLATION PROMPT SUITE */}
      {!isInstalled && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C59B32]/10 flex items-center justify-center border border-[#C59B32]/35 shrink-0">
              <Sparkles className="w-5 h-5 text-[#C59B32]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                {lang === 'en' ? "Install Ilm Naafi App Shortcut" : "تثبيت تطبيق علم نافع على هاتفك"}
                <span className="bg-amber-100 text-amber-900 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded font-mono uppercase">Offline Ready</span>
              </h4>
              <p className="text-xs text-slate-600 leading-normal max-w-xl">
                {lang === 'en' 
                  ? "Add shortcut to your phone or desktop home screen for offline access and instant, reliable, sticky adhan/salah reminders." 
                  : "أضف أيقونة سريعة للشاشة الرئيسية لسرعة التصفح وتفعيل تنبيهات الأذكار تلقائياً والعمل حتى بدون إنترنت."}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto self-stretch md:self-center flex flex-col justify-center">
            {isIOS ? (
              <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-[11px] text-slate-700 leading-relaxed font-semibold self-end md:self-auto shadow-2xs">
                {lang === 'en' ? (
                  <span className="flex items-center gap-1">
                    Tap <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-sm">📤</span> then <span className="text-amber-950 font-black">"Add to Home Screen"</span> in Safari.
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-right" dir="rtl">
                    اضغط زر المشاركة <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-sm">📤</span> ثم اختر <span className="text-amber-950 font-black">"إضافة للشاشة الرئيسية"</span>.
                  </span>
                )}
              </div>
            ) : showInstallPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full md:w-auto bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-305" />
                {lang === 'en' ? "Add to Home Screen" : "تثبيت فوري على الجهاز"}
              </button>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-[11px] text-slate-700 leading-relaxed font-semibold self-end md:self-auto shadow-2xs">
                {lang === 'en' ? (
                  <span>Use Chrome/Safari and select <span className="text-amber-950 font-black">"Add to Home Screen"</span> in settings.</span>
                ) : (
                  <span>افتح المتصفح الرسمي واختر <span className="text-amber-950 font-black">"إضافة إلى الشاشة الرئيسية"</span>.</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isInstalled && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-emerald-900 font-bold select-none">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            {lang === 'en' ? "PWA App Status: Connected & Calibrated (PWA Mode Active)" : "حالة التطبيق: مثبت ونشط في شاشتك (وضع التطبيق المستقل)"}
          </span>
          <span className="text-[9px] uppercase font-mono tracking-wider bg-emerald-100 border border-emerald-300 rounded px-2 py-0.5">Standalone</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4">
      
      {/* 1. COMPASS & TIME SYNERGAL ZONE */}
      <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative corner background graphics */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full uppercase font-mono border border-emerald-200/50">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              {lang === 'en' ? "Spiritual Adhan Timer" : "ساعة الأذان والتعاقب الزمنية"}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              UTC: 2026-06-08
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800">
              {lang === 'en' ? "Countdown to Next Devotion" : "الوقت المتبقي للأذان القادم"}
            </h4>
            
            {/* LARGE MAJESTIC TIMER DISPLAY */}
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-5 border border-emerald-800/60 shadow-inner flex items-center justify-between">
              <div>
                <span className="text-3xl md:text-4xl font-extrabold tracking-widest font-mono text-[#F4E6B4] filter drop-shadow">
                  {countdownStr}
                </span>
                <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-mono font-black mt-1">
                  {lang === 'en' 
                    ? `Time until ${nextPrayer.labelEn} (${nextPrayer.timeString})`
                    : `متبقي لنداء صلاة ${nextPrayer.labelAr} (${nextPrayer.timeString})`}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30">
                <Moon className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Schedulers Details list */}
          <div className="grid grid-cols-5 gap-1.5 bg-white p-2 rounded-xl border border-slate-150">
            {PRAYERS.map((p) => {
              const isPNext = nextPrayer.name === p.name;
              return (
                <div 
                  key={p.name}
                  className={`text-center p-2 rounded-lg transition-all ${
                    isPNext 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold shadow-sm' 
                      : 'text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-bold">
                    {lang === 'en' ? p.labelEn : p.labelAr}
                  </div>
                  <div className="text-[10px] font-sans font-black mt-1">
                    {p.timeString}
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Notifications Action Panel */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#C19854]" />
                {lang === 'en' ? "Supplicative Alert Center" : "مركز الإشعارات التعليمية والروتينية"}
              </span>
              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                permission === 'granted' 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                  : permission === 'denied' 
                    ? 'bg-rose-100 text-rose-900 border border-rose-200' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {permission}
              </span>
            </div>

            {permission !== 'granted' ? (
              <button
                onClick={requestNotificationPermission}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold p-3 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                {lang === 'en' ? "Request OS Alert Permissions" : "طلب صلاحيات التنبيهات على الجهاز"}
              </button>
            ) : (
              <div className="space-y-2 font-sans text-xs">
                {/* 1. Hadith toggler */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-150 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4.5 h-4.5 text-pink-500" />
                    <div>
                      <p className="font-bold text-slate-800">{lang === 'en' ? "Daily Supplication & Hadith Alerts" : "أذكار وحكم تعليمية يومية"}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{lang === 'en' ? "Periodic whispers of beneficial Hadiths" : "إرسال حكمة الصباح وأقوال المصطفى"}</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={hadithEnabled} 
                    onChange={handleHadithNotificationTrigger}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </label>

                {/* 2. Sticky adhan tracker toggler */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-150 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4.5 h-4.5 text-blue-500" />
                    <div>
                      <p className="font-bold text-slate-800">{lang === 'en' ? "Sticky Next-Salah Tracker Banner" : "شريط إشعار دائم للصلاة القادمة"}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{lang === 'en' ? "Silent update in your system drawer" : "شريط محدث باستمرار في لوحة الإشعارات"}</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={stickyEnabled} 
                    onChange={handleStickyNotificationTrigger}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC QIBLAH FINDER COMPASS ZONE */}
      <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full uppercase font-mono border border-amber-200/50">
              <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
              {lang === 'en' ? "Qiblah Compass Alignment" : "محدد القبلة الجغرافي الفلكي"}
            </span>

            <button
              onClick={requestLocation}
              disabled={gpsLoading}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] tracking-wide transition shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <MapPin className="w-3 h-3 text-amber-300" />
              {gpsLoading ? (lang === 'en' ? "Locating..." : "جاري التحديد...") : (lang === 'en' ? "Request GPS" : "تحديد الموقع")}
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-normal">
            {lang === 'en' 
              ? "Calculates the precise geographical bearing from your coordinates directly to the Kaaba in Mecca. Support hardware magnetometer rotations on iOS and desktop simulation." 
              : "يقيس بدقة متناهية الحقل الفلكي للقبلة انطلاقاً من خط العرض الجغرافي ونقاط الاتصال بالمسجد الحرام بمكة المشرفة."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
            
            {/* Left circular compass rotating layout */}
            <div className="sm:col-span-2 flex flex-col items-center">
              <div className="relative w-36 h-36 bg-gradient-to-b from-white to-slate-100 rounded-full shadow-md border-3 border-[#DDC185] flex items-center justify-center overflow-hidden">
                {/* Internal compass coordinates markings */}
                <div className="absolute top-1 text-[8px] font-black font-mono text-slate-400">N</div>
                <div className="absolute bottom-1 text-[8px] font-black font-mono text-slate-400">S</div>
                <div className="absolute left-1 text-[8px] font-black font-mono text-slate-400">W</div>
                <div className="absolute right-1 text-[8px] font-black font-mono text-slate-400">E</div>

                {/* Sparkling green concentric inner circle */}
                <div className={`absolute w-28 h-28 rounded-full border border-dashed transition-all duration-300 ${isWithPrecision ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-200'}`} />

                {/* MECCA BADGE ICON ON DEGREE BOUNDARY */}
                {qiblahAngle !== null && (
                  <div 
                    className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-500" 
                    style={{ transform: `rotate(${qiblahAngle}deg)` }}
                  >
                    <div className="absolute top-1 select-none">
                      <span className="text-[10px] filter drop-shadow animate-ping">🕋</span>
                    </div>
                  </div>
                )}

                {/* THE MOVING DIAL NEEDLE */}
                <motion.div 
                  className="relative w-full h-full p-2 flex items-center justify-center pointer-events-none"
                  animate={{ rotate: needleRotation }}
                  transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Upper Needle side (Emerald Dark / Gold tip) */}
                    <div className="absolute h-14 w-1.5 bg-emerald-700 rounded-full top-4" />
                    <div className="absolute w-3.5 h-3.5 bg-[#C59B32] rotate-45 top-4 rounded-sm border border-white" />
                    <div className="absolute h-1.5 w-1.5 bg-amber-200 rounded-full top-5" />

                    {/* Pivot center core */}
                    <div className="w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-white shadow flex items-center justify-center z-15">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>

                    {/* Lower needle side */}
                    <div className="absolute h-14 w-1.5 bg-slate-300 rounded-full bottom-4" />
                  </div>
                </motion.div>
              </div>

              {/* Angle aligned notification */}
              {isWithPrecision ? (
                <div className="mt-3 flex items-center gap-1.5 text-emerald-800 bg-emerald-100 hover:bg-emerald-200 py-1 px-3 rounded-full text-[9px] font-black uppercase font-mono transition shadow-sm animate-pulse border border-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {lang === 'en' ? "Aligned to Mecca!" : "متجه نحو مكة!"}
                </div>
              ) : (
                <div className="mt-3 text-[9px] font-mono uppercase bg-slate-150 border border-slate-250 py-1 px-3 rounded-full text-slate-500 font-extrabold text-center">
                  {lang === 'en' ? `Heading: ${needleRotation.toFixed(0)}°` : `الزاوية: ${needleRotation.toFixed(0)}°`}
                </div>
              )}
            </div>

            {/* Right coordinates customization options */}
            <div className="sm:col-span-3 space-y-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                  {lang === 'en' ? "Current Calibrations" : "الإحداثيات المفعلة حالياً"}
                </span>

                <div className="flex gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">{lang === 'en' ? "Latitude" : "خط العرض"}</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{userCoords?.lat.toFixed(4) || "0.0000"}° N</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-[9px] text-slate-400 block font-semibold">{lang === 'en' ? "Longitude" : "خط الطول"}</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{userCoords?.lng.toFixed(4) || "0.0000"}° E</span>
                  </div>
                </div>

                {qiblahAngle !== null && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{lang === 'en' ? "Calculated Qiblah:" : "اتجاه القبلة الفلكي:"}</span>
                    <span className="font-mono font-black text-emerald-800">{qiblahAngle.toFixed(1)}° {lang === 'en' ? "from North" : "من الشمال"}</span>
                  </div>
                )}
              </div>

              {/* City quick presets triggers */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider font-mono">
                  {lang === 'en' ? "Select Pre-calibrated City" : "إحداثيات كبرى الحواضر الإسلامية"}
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {PRESETS.map((p) => {
                    const isSelected = userCoords && Math.abs(userCoords.lat - p.lat) < 0.05;
                    return (
                      <button
                        key={p.name}
                        onClick={() => selectPreset(p)}
                        className={`p-1.5 rounded-lg text-[9px] font-sans font-extrabold transition text-center cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-sm' 
                            : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {locationError && (
                <div className="flex items-center gap-1.5 bg-red-50 text-red-950 p-2.5 rounded-xl border border-red-200 text-[10px] font-semibold leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 text-red-650 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
    </div>
  );
}
