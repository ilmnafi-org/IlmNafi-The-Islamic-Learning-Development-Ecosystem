/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  Settings, 
  Radio, 
  Tv, 
  Rss, 
  Check, 
  X, 
  GraduationCap, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../types';

interface NotificationsViewProps {
  lang: 'en' | 'ar';
  progress: UserProgress;
  onUpdateProgress: (newProgress: any) => void;
  onNavigateToTab: (tab: any) => void;
}

export default function NotificationsView({
  lang,
  progress,
  onUpdateProgress,
  onNavigateToTab
}: NotificationsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'unread'>('all');
  const [submittingJoin, setSubmittingJoin] = useState<string | null>(null);
  
  // Simulator states
  const [simulationCategory, setSimulationCategory] = useState<string>('general');
  const [simulationType, setSimulationType] = useState<'topic' | 'reply'>('reply');
  const [simBoardDropdownOpen, setSimBoardDropdownOpen] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  
  // Sound toggle state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('alert_sound_enabled');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  // Browser Permission local display state
  const [browserPermission, setBrowserPermission] = useState<string>('default');

  useEffect(() => {
    if (window.Notification) {
      setBrowserPermission(window.Notification.permission);
    }
  }, []);

  const requestBrowserPermission = () => {
    if (!window.Notification) {
      alert("This browser does not support web pushes.");
      return;
    }
    window.Notification.requestPermission().then(perm => {
      setBrowserPermission(perm);
    });
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('alert_sound_enabled', String(next));
    } catch {}
  };

  const handleJoinLeaveForum = async (category: string, isCurrentlyJoined: boolean) => {
    setSubmittingJoin(category);
    try {
      const endpoint = isCurrentlyJoined ? '/api/forum/leave' : '/api/forum/join';
      const token = localStorage.getItem('ilm_token');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ category })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.joinedForums) {
          onUpdateProgress({
            ...progress,
            joinedForums: result.joinedForums
          });
        }
      }
    } catch (e) {
      console.error("Failed to alter forum membership:", e);
    } finally {
      setSubmittingJoin(null);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('ilm_token');
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ notificationId: id })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.notifications) {
          onUpdateProgress({
            ...progress,
            notifications: result.notifications
          });
        }
      }
    } catch (e) {
      console.error("Mark notification read error:", e);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem('ilm_token');
      const response = await fetch('/api/notifications/clear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.notifications) {
          onUpdateProgress({
            ...progress,
            notifications: result.notifications
          });
        }
      }
    } catch (e) {
      console.error("Clear notifications error:", e);
    }
  };

  const handleTriggerActivitySim = async () => {
    setIsSimulating(true);
    setSimulationStatus(null);
    try {
      const token = localStorage.getItem('ilm_token');
      const response = await fetch('/api/forum/simulate-activity', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ category: simulationCategory, type: simulationType })
      });
      if (response.ok) {
        const result = await response.json();
        setSimulationStatus(
          lang === 'en' 
            ? `Successfully broadcasted to ${result.countDispatched} subscriber(s)!` 
            : `تمت إرسال الإشارة بنجاح إلى ${result.countDispatched} متلقّين!`
        );

        // Play standard soft sfx if sound is enabled
        if (soundEnabled) {
          const alertSfx = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-600.wav");
          alertSfx.volume = 0.25;
          alertSfx.play().catch(() => {});
        }
      }
    } catch (e) {
      console.error("Simulated activity trigger failure:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Filter local state notifications
  const rawNotifs = progress.notifications || [];
  const filteredNotifs = activeSubTab === 'unread' 
    ? rawNotifs.filter(n => !n.isRead) 
    : rawNotifs;

  const unreadCount = rawNotifs.filter(n => !n.isRead).length;

  const forumBoards = [
    { 
      id: 'recitation', 
      title: lang === 'en' ? "Tajweed & Accentuation Study Panel" : "حلقة التجويد وتحقيق المخارج",
      desc: lang === 'en' ? "Clarifications regarding throat letters, Ghunnah rules, and classical vocal feedback loops." : "مخارج الحروف، جهارة الأصوات، والمدود والتدقيقات الصوتية لورش وحفص.",
      tag: lang === 'en' ? "Tajweed" : "التجويد"
    },
    { 
      id: 'history', 
      title: lang === 'en' ? "Historic Manuscripts & Civilizations" : "حلقة العلوم الشرعية وتراجم المخطوطات",
      desc: lang === 'en' ? "Discussions tracking ancient Andalusian texts, translation epochs, and scholars of Maghreb." : "المباحث التاريخية، المراجع النادرة، وتاريخ تدوين المخطوطات والعلوم.",
      tag: lang === 'en' ? "History" : "التاريخ"
    },
    { 
      id: 'jurisprudence', 
      title: lang === 'en' ? "Comparative Legal Fiqh Consensus" : "حلقة دراسات الفقه العقدي المقارن",
      desc: lang === 'en' ? "Classical legal analysis of acts, text verification, and contemporary jurisprudence models." : "المدارس الفقهية الأربع، تحقيق المسائل، ومداولات الاجتهاد والنوازل المعاصرة.",
      tag: lang === 'en' ? "Jurisprudence" : "الفقه والمقاصد"
    },
    { 
      id: 'scholarships', 
      title: lang === 'en' ? "Global Grants Placement Office" : "حلقة المنح والإيفاد الأكاديمي المباشر",
      desc: lang === 'en' ? "Peer matching and notifications for specialized Islamic University statements." : "مشاركة ملفات التقديم، ورش كتابة المقترحات البحثية، والقبول الجامعي.",
      tag: lang === 'en' ? "Scholarships" : "المنح والدراسات"
    },
    { 
      id: 'general', 
      title: lang === 'en' ? "General Scholar Assembly Hall" : "بهو المذاكرة والآداب العامة",
      desc: lang === 'en' ? "General student chat, review methods, and peer-to-peer memorization support queues." : "الآداب المنهجية لطلب العلم الشرعي، ومناقشة البرامج الإثرائية والتعارف.",
      tag: lang === 'en' ? "General" : "المذاكرة العامة"
    }
  ];

  return (
    <div className="py-10 px-4 md:px-12 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2">
            <span className="text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200/50 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              {lang === 'en' ? "Consensus Notification Center" : "ديوان الإشعارات المباشر والرباط الفوري"}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#704214] tracking-tight">
              {lang === 'en' ? "Real-Time Notifications Hub" : "قنوات المذاكرة والإشعارات الفورية"}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-normal">
              {lang === 'en' 
                ? "Configure subscription channels, receive live socket notifications for peer activity, replies, and announcements, and test web push configurations."
                : "قم بتهيئة قنوات البث ومتابعة أنشطة الطلاب والمشايخ في الوقت الحقيقي، مع إمكانية تجربة المحاكاة الفورية."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {/* Audio configuration button */}
            <button
              onClick={toggleSound}
              className={`p-3 rounded-xl border flex items-center gap-1.5 transition text-xs font-bold cursor-pointer ${
                soundEnabled 
                  ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/70' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'en' ? "Alert Sounds Active" : "الأصوات مفعّلة"}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>{lang === 'en' ? "Muted" : "صامت"}</span>
                </>
              )}
            </button>

            {/* Browser Permission trigger */}
            <button
              onClick={requestBrowserPermission}
              className={`p-3 rounded-xl border transition text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                browserPermission === 'granted'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-extrabold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {browserPermission === 'granted' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block animate-ping" />
                  <span>{lang === 'en' ? "Web Push Configured" : "مصادقة المتصفح مفعّلة"}</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>{lang === 'en' ? "Authorize Browser Push" : "تفعيل تنبيهات المتصفح"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CONTROLS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: TIMELINE & SIMULATOR */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* INBOX SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-slate-200">
                    <Bell className="w-5 h-5 text-[#8c6239]" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#704214]">
                      {lang === 'en' ? "Academic Action Inbox" : "صندوق الوارد الدراسي والأنشطة"}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'en' 
                        ? `Displaying ${filteredNotifs.length} transaction notifications` 
                        : `يتم عرض ${filteredNotifs.length} إشعار حقيقي حالياً`}
                    </p>
                  </div>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold font-sans self-start sm:self-auto border border-slate-200">
                  <button
                    onClick={() => setActiveSubTab('all')}
                    className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeSubTab === 'all' 
                        ? 'bg-white text-slate-900 shadow-xs font-extrabold' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {lang === 'en' ? "All History" : "جميع المقروء والجديد"}
                  </button>
                  <button
                    onClick={() => setActiveSubTab('unread')}
                    className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSubTab === 'unread' 
                        ? 'bg-white text-slate-900 shadow-xs font-extrabold' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{lang === 'en' ? "Unread Only" : "غير المقروء فقط"}</span>
                    {unreadCount > 0 && (
                      <span className="bg-[#704214] text-white text-[8px] px-1.5 py-0.5 rounded-md font-mono font-black animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ACTION TOOLS */}
              {rawNotifs.length > 0 && (
                <div className="flex justify-between items-center bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    {lang === 'en' ? "Bulk Administration" : "عمليات جماعية للتحكم"}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleMarkAsRead('all')}
                      className="text-[10px] font-black text-[#5c3610] hover:underline bg-transparent cursor-pointer flex items-center gap-1 font-sans"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? "Mark All Read" : "تعيين الكل كمقروء"}</span>
                    </button>
                    <span className="text-slate-250">|</span>
                    <button
                      onClick={handleClearAll}
                      className="text-[10px] font-black text-red-650 hover:text-red-800 hover:underline bg-transparent cursor-pointer flex items-center gap-1 font-sans"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? "Clear Archive" : "تفريغ السجل"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TIMELINE ARCHIVE LIST */}
              {filteredNotifs.length === 0 ? (
                <div className="p-12 border border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-[#FAF9F6]/40">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">
                    {lang === 'en' 
                      ? "No active system announcements in this section. Join academic discussion rings below to start capturing real-time forum logs!" 
                      : "لا توجد تحديثات متاحة حالياً. قم بالانضمام للرابط وقنوات قراءة وحلقات العلم أدناه!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                  {filteredNotifs.map((notif) => (
                    <motion.div 
                      key={notif.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border text-xs flex gap-4 transition-all hover:bg-slate-50/10 ${
                        notif.isRead 
                          ? 'bg-slate-50/60 border-slate-150 text-slate-600' 
                          : 'bg-white border-emerald-500/25 shadow-xs text-slate-900 border-l-4 border-l-emerald-600'
                      }`}
                      style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                    >
                      <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.isRead 
                          ? 'bg-slate-100 text-slate-400' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-250/20'
                      }`}>
                        <Bell className="w-4.5 h-4.5" />
                      </div>

                      <div className="flex-1 min-w-0" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="font-extrabold leading-snug text-slate-850 truncate">{notif.title}</h4>
                          {!notif.isRead && (
                            <button 
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="text-[8px] font-black text-emerald-700 bg-emerald-100/50 border border-emerald-200/50 px-2 py-0.5 rounded hover:bg-emerald-100 transition shrink-0 cursor-pointer uppercase tracking-tight"
                            >
                              {lang === 'en' ? "Mark Read" : "تحديد كمقروء"}
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal mt-1 block">{notif.body}</p>
                        
                        <div className="flex items-center gap-2 mt-2.5" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <span className="text-[8px] text-slate-400 font-mono font-bold">
                            {new Date(notif.createdAt).toLocaleTimeString()} • {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                          
                          {notif.referenceId && (
                            <>
                              <span className="text-slate-200">•</span>
                              <button
                                onClick={() => onNavigateToTab('forum')}
                                className="text-[9px] font-bold text-[#8c6239] hover:underline bg-transparent cursor-pointer flex items-center gap-0.5"
                              >
                                <span>{lang === 'en' ? "Go to Forum" : "انتقال للحلقة"}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* DISCUSSION CHANNELS LIST REMOVED AND MOVED TO DASHBOARD */}

          </div>

          {/* RIGHT PANEL: LIVE PUSH BROADCAST SIMULATOR */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* WEB SIMULATOR CONTROLS */}
            <div className="bg-[#FAF8F5]/80 rounded-3xl border border-slate-200 p-6 space-y-5 relative overflow-hidden backdrop-blur-xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-1">
                <span className="text-[9px] font-black text-amber-850 uppercase tracking-widest font-mono block">
                  {lang === 'en' ? "Socket Core Service" : "متحكم الخادم والرباط"}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'en' ? "Interactive Activity Simulator" : "محاكي التفاعلات الحية للعامة"}
                </h3>
                <p className="text-[10.5px] text-slate-400 leading-snug">
                  {lang === 'en'
                    ? "Manually trigger background peer replies or scholar publications in selected boards to witness the instant high-fidelity notification socket delivery!"
                    : "قم بمحاكاة قيام باحث آخر أو أحد المشايخ بطرح تعليق أو فتوى معاصرة لمشاهدة المزامنة الفورية للإشعارات."}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200/60 font-sans">
                
                {/* Select category */}
                <div className="space-y-1 relative" id="custom-sim-category-dropdown-wrapper">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">
                    {lang === 'en' ? "Target Academic Board" : "حلقة المذاكرة المستهدفة"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setSimBoardDropdownOpen(!simBoardDropdownOpen)}
                    className="w-full bg-white border border-slate-200 p-2.5 text-xs font-bold text-slate-800 rounded-xl outline-none flex items-center justify-between cursor-pointer"
                    id="custom-sim-category-trigger"
                  >
                    <span>
                      {simulationCategory === 'recitation'
                        ? (lang === 'en' ? "Tajweed & Recite" : "حلقة التجويد وتحقيق مخارج المعرفة")
                        : simulationCategory === 'history'
                          ? (lang === 'en' ? "History Books" : "تاريخ العلوم وتراجم المخطوطات النادرة")
                          : simulationCategory === 'jurisprudence'
                            ? (lang === 'en' ? "Comparative Fiqh" : "الفقه والمذهب ونوازل الشغل معاصرة")
                            : simulationCategory === 'scholarships'
                              ? (lang === 'en' ? "Scholarship Grants" : "المنح والمقاعد الشرعية المجانية")
                              : (lang === 'en' ? "General Assembly Hall" : "بهو المذاكرة والآداب لعامة الطلاب")}
                    </span>
                    <span className="text-[8px] text-slate-400">▼</span>
                  </button>

                  <AnimatePresence>
                    {simBoardDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setSimBoardDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-left"
                        >
                          {[
                            { id: 'recitation', en: "Tajweed & Recite", ar: "حلقة التجويد وتحقيق مخارج المعرفة" },
                            { id: 'history', en: "History Books", ar: "تاريخ العلوم وتراجم المخطوطات النادرة" },
                            { id: 'jurisprudence', en: "Comparative Fiqh", ar: "الفقه والمذهب ونوازل الشغل معاصرة" },
                            { id: 'scholarships', en: "Scholarship Grants", ar: "المنح والمقاعد الشرعية المجانية" },
                            { id: 'general', en: "General Assembly Hall", ar: "بهو المذاكرة والآداب لعامة الطلاب" }
                          ].map(opt => (
                            <button
                              key={`sim-cat-opt-${opt.id}`}
                              type="button"
                              onClick={() => {
                                setSimulationCategory(opt.id);
                                setSimBoardDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2 text-xs border-0 cursor-pointer ${simulationCategory === opt.id ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
                            >
                              {lang === 'en' ? opt.en : opt.ar}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submitting Type */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">
                    {lang === 'en' ? "Simulation Action Type" : "نوع الفعالية التجريبية"}
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSimulationType('topic')}
                      className={`flex-1 py-1.5 px-3 rounded-lg border-0 cursor-pointer text-[10px] font-bold transition-all ${
                        simulationType === 'topic' ? 'bg-amber-600 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {lang === 'en' ? "New Study Topic" : "مسألة للمناقشة"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulationType('reply')}
                      className={`flex-1 py-1.5 px-3 rounded-lg border-0 cursor-pointer text-[10px] font-bold transition-all ${
                        simulationType === 'reply' ? 'bg-amber-600 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {lang === 'en' ? "Interactive Reply" : "تعليق الشيخ/الزملاء"}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isSimulating}
                  onClick={handleTriggerActivitySim}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black min-h-[44px] rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-2 border border-amber-500"
                >
                  <Radio className={`w-4 h-4 ${isSimulating ? 'animate-ping' : ''}`} />
                  <span>
                    {isSimulating 
                      ? (lang === 'en' ? "Broadcasting WebSockets..." : "جارِ بث الإشعارات الحية...") 
                      : (lang === 'en' ? "Broadcast Live Activity Push" : "إرسال وبث التحديث المباشر")}
                  </span>
                </button>

                {simulationStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[10.5px] font-bold text-emerald-805 text-center"
                  >
                    {simulationStatus}
                  </motion.div>
                )}

              </div>

              {/* SIMULATION TIPS */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-150 space-y-1">
                <span className="text-[8.5px] font-black text-[#5c3610] uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{lang === 'en' ? "Integration Note" : "ملاحظة المزامنة والويب"}</span>
                </span>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {lang === 'en'
                    ? "In production, browser pushes run asynchronously through global service workers, meaning you receive notifications even if your tab is in the background!"
                    : "في بيئة الاستخدام الحقيقي للموقع يتم تخزين الإشارات في خوادم السحاب لإيصالها حتى وإن كان هاتفك أو متصفحك مغلقاً تماماً."}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
