/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Volume2, BookOpen, Sparkles, Check, CheckCircle2, 
  Languages, RotateCcw, HelpCircle, Info, Lock, Compass, Eye, Heart,
  Shield, Edit3, Save, RefreshCw, Send, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProgress } from '../types';
import { analyzeTajweedText } from '../../server/tajweedEngine';

interface SettingsViewProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  onUpdateUsername?: (newUsername: string) => void;
  lang: 'en' | 'ar';
}

export default function SettingsView({ progress, setProgress, onUpdateUsername, lang }: SettingsViewProps) {
  const [qiraat, setQiraatState] = useState<'hafs' | 'warsh'>(progress.qiraat || 'hafs');
  const [tajweedMode, setTajweedModeState] = useState<boolean>(progress.tajweedMode !== false);
  const [profileName, setProfileName] = useState<string>(progress.username || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Parser sandbox state
  const [sandboxText, setSandboxText] = useState('قُلْ أَعُوذُ بِرَبِّ النَّاسِ');
  const [sandboxAnalysis, setSandboxAnalysis] = useState<any>(null);

  // Sync state changes with parent progress object and localStorage
  const handleQiraatChange = (selected: 'hafs' | 'warsh') => {
    setQiraatState(selected);
    localStorage.setItem('ilm_naafi_qiraat', selected);
    setProgress(prev => ({
      ...prev,
      qiraat: selected
    }));
    triggerBriefToast(lang === 'en' ? `Qira'at switched to ${selected.toUpperCase()}` : `تم تحويل رواية المطالعة إلى: ${selected === 'hafs' ? 'حفص' : 'ورش'}`);
  };

  const handleTajweedModeChange = (enabled: boolean) => {
    setTajweedModeState(enabled);
    localStorage.setItem('ilm_naafi_tajweed_mode', enabled ? 'true' : 'false');
    setProgress(prev => ({
      ...prev,
      tajweedMode: enabled
    }));
    triggerBriefToast(lang === 'en' ? `Tajweed assistance ${enabled ? 'enabled' : 'disabled'}` : `تم ${enabled ? 'تفعيل' : 'إيقاف'} معالج الترتيل التلقائي`);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setIsSaving(true);
    setSuccessMsg(null);
    
    // Simulate minor network debounce
    setTimeout(() => {
      setProgress(prev => ({
        ...prev,
        username: profileName.trim()
      }));
      if (onUpdateUsername) {
        onUpdateUsername(profileName.trim());
      }
      setIsSaving(false);
      setSuccessMsg(lang === 'en' ? "Profile credentials saved successfully & synced." : "تم حفظ وتزامن بيانات الطالب الأكاديمية بنجاح.");
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 800);
  };

  // Run dynamic tajweed parser on sandbox change
  useEffect(() => {
    if (sandboxText.trim()) {
      try {
        const result = analyzeTajweedText(sandboxText, qiraat);
        setSandboxAnalysis(result);
      } catch (err) {
        setSandboxAnalysis(null);
      }
    } else {
      setSandboxAnalysis(null);
    }
  }, [sandboxText, qiraat]);

  const triggerBriefToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-4 pb-12 font-sans" id="settings-view-root">
      
      {/* HEADER BANNER ZONE */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-6 animate-fade-in">
        <div className="bg-gradient-to-tr from-slate-900 via-emerald-950 to-emerald-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-500/20">
          <div className="absolute right-0 bottom-0 translate-x-1/6 translate-y-1/6 opacity-10 pointer-events-none">
            <Settings className="w-96 h-96 text-emerald-300" />
          </div>
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'en' ? "Modular System Core Settings" : "لوحة التحكم ومعايرة الروايات الأكاديمية"}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-serif leading-none tracking-tight">
              {lang === 'en' ? "Platform Settings & Qira'at Calibration" : "الإعدادات العامة وتخصيص روايات التنزيل"}
            </h1>
            <p className="text-slate-200 text-sm md:text-base text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              {lang === 'en' 
                ? "Calibrate transmission standards, switch between Hafs and Warsh readings, manage your profile and test rules word-by-word with the interactive learning sandbox." 
                : "قم بمعايرة الإسناد، والتحويل بين رواية حفص ورواية ورش، مع ضبط خيارات دمج نطق المدود السمعية والتدقيق الصوتي في المتن."}
            </p>
          </div>
        </div>
      </div>

      {/* TOAST SYSTEM */}
      {successMsg && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-6">
          <div className="bg-emerald-50 border border-emerald-250/50 text-[#073327] rounded-2xl p-4 flex items-center justify-between font-bold text-xs" id="settings-success-alert">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <p className="leading-relaxed">{successMsg}</p>
            </div>
            <button 
              onClick={() => setSuccessMsg(null)} 
              className="text-emerald-700 hover:text-emerald-950 bg-transparent border-0 font-bold shrink-0 text-[10px] uppercase cursor-pointer"
            >
              {lang === 'en' ? "Dismiss" : "إغلاق"}
            </button>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN RESPONSIVE LAYOUT */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (COL-SPAN-8) - GLOBAL PREFERENCES */}
        <div className="col-span-1 lg:col-span-8 space-y-8">
          
          {/* 1. QIRA'AT CHANGER INTERACTIVE DECK */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Languages className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  {lang === 'en' ? "Select Quran Variant Reading (Riwayah)" : "رواية قراءة التنزيل (بين عاصم ونافع)"}
                </h2>
                <p className="text-[10px] text-slate-500">
                  {lang === 'en' ? "Calibrate text characters spelling and audio reciter outputs" : "تغيير رسم الحروف وضوابط المخارج والمقاطع الصوتية المصاحبة لها"}
                </p>
              </div>
            </div>

            {/* SELECTION CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card A: Hafs 'an 'Asim */}
              <button
                onClick={() => handleQiraatChange('hafs')}
                className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden ${
                  qiraat === 'hafs'
                    ? 'border-emerald-600 bg-emerald-500/5'
                    : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/50'
                }`}
                style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                id="btn-settings-hafs"
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-xs font-black tracking-wider uppercase text-emerald-800 bg-emerald-100 border border-emerald-250 px-2.5 py-1 rounded-md">
                      {lang === 'en' ? "Hafs / حفص" : "حفص عن عاصم"}
                    </span>
                    {qiraat === 'hafs' && (
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {lang === 'en' ? "Hafs 'an 'Asim" : "قراءة عاصم الكوفي الكلاسيكية"}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1 text-justify">
                    {lang === 'en' 
                      ? "The standard academic reading used globally. Characteristics: standard word separations, precise hamzas, average natural Madd prolongations."
                      : "القراءة الأكثر انتشاراً في العالم الإسلامي، مروية بإسناد وثيق عن أمير المؤمنين علي بن أبي طالب. وتتميز بالوضوح والسلاسة."}
                  </p>
                </div>
                <div className="text-[10px] font-bold text-slate-400 mt-2">
                  {lang === 'en' ? "Reciter: Al-Ghamadi (Plain Clear)" : "القارئ النموذجي: عبد الله الغامدي وجيل المرتلين"}
                </div>
              </button>

              {/* Card B: Warsh 'an Nafi' */}
              <button
                onClick={() => handleQiraatChange('warsh')}
                className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden ${
                  qiraat === 'warsh'
                    ? 'border-emerald-600 bg-emerald-500/5'
                    : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/50'
                }`}
                style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                id="btn-settings-warsh"
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-xs font-black tracking-wider uppercase text-amber-800 bg-amber-100 border border-amber-250 px-2.5 py-1 rounded-md">
                      {lang === 'en' ? "Warsh / ورش" : "ورش عن نافع"}
                    </span>
                    {qiraat === 'warsh' && (
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {lang === 'en' ? "Warsh 'an Nafi'" : "قراءة نافع المدني الفصيحة"}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1 text-justify">
                    {lang === 'en' 
                      ? "Prominent reading in North & West Africa. Includes Al-Naql (vowel transit), Al-Imalah, special Tarqeeq of Raa, and long 6-beat extensions."
                      : "رواية أهل المدينة والمنطقة المغاربية وقارئ الحجاز الإمام نافع. تتميز بزيادة طول المدود، وترقيق الرامات، ونقل حركة الهمزة الساقطة."}
                  </p>
                </div>
                <div className="text-[10px] font-bold text-[#C59B32] mt-2">
                  {lang === 'en' ? "Reciter: Al-Husary (Warsh Standard)" : "القارئ النموذجي: الشيخ محمود خليل الحصري برواية ورش"}
                </div>
              </button>

            </div>

            {/* Riwayah differences guide */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <span className="font-extrabold text-[11px] text-slate-900 uppercase tracking-widest flex items-center gap-1">
                <Info className="w-4 h-4 text-emerald-700" />
                {lang === 'en' ? "Linguistic differences in action:" : "من الفروق الأدائية المعتمدة علمياً:"}
              </span>
              <ul className="list-disc pr-4 pl-4 space-y-1.5 leading-relaxed font-serif">
                <li>
                  <strong className="text-slate-800">{lang === 'en' ? "Al-Naql (النقل):" : "النقل (نقل حركة الهمزة):"}</strong>{' '}
                  {lang === 'en' 
                    ? "Eliminating Hamzat Al-Qat' and moving its vowel to the preceding silent letter (e.g., 'Qul a'oodhu' is read as 'Qula 'oodhu')." 
                    : "إسقاط الهمزة الشديدة ونقل حركتها إلى الساكن الصحيح قبلها، فيرتج الكلمتان لفظاً واحداً (مثل: قُلْ أَعُوذُ تنطق: قُلَ عُوذُ)."}
                </li>
                <li>
                  <strong className="text-slate-800">{lang === 'en' ? "Al-Imalah (الإمالة):" : "الإمالة والتقليل:"}</strong>{' '}
                  {lang === 'en' 
                    ? "Bending Alif vowel towards Ya (e.g., Al-Huda becomes Al-Hudé)." 
                    : "تقريب نطق الياء والألف بالاضطجاع في بعض المواضع الشريفة (مثل: الهُدَى تنطق بفتحة مائلة للياء)."}
                </li>
                <li>
                  <strong className="text-slate-800">{lang === 'en' ? "Raa rules (ترقيق الراء):" : "ترقيق الراءات لورش:"}</strong>{' '}
                  {lang === 'en' 
                    ? "Raa is read with a thin flat voice when preceded by a kasra or Ya saakin (e.g., standard 'basyrun' heavy Raa becomes light Raa 'basyren')." 
                    : "ترقيق الراء متى سبقت بكسرة لازمة أو ياء ساكنة، فيفارق الإمام ورش حفصاً بترقيقها تيسيراً للنطق الفصيح."}
                </li>
              </ul>
            </div>
          </div>

          {/* 2. TAJWEED AUTOMATED ENGINE CONFIG */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    {lang === 'en' ? "Active Tajweed Engine on Highlights" : "مساعد التدقيق وترتيل المتون"}
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    {lang === 'en' ? "Instantly analyzes phonology and vowel rules when clicking verses" : "يقوم بفحص وتبيان الساكن والمدود والترقيق لفظياً فور الضغط على الكلمة المقروءة"}
                  </p>
                </div>
              </div>

              {/* Toggle slider Switch */}
              <button
                onClick={() => handleTajweedModeChange(!tajweedMode)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all border-0 outline-none cursor-pointer flex items-center ${
                  tajweedMode ? 'bg-[#073327] justify-end' : 'bg-slate-200 justify-start'
                }`}
                id="toggle-settings-tajweed"
              >
                <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[8px] text-[#073327]">
                  {tajweedMode ? "✓" : ""}
                </div>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {lang === 'en'
                ? "When active, selecting any verse in the Quran Explorer triggers the deterministic phonetic rules parser. It scans the Arabic letters, maps makharij anatomical points (mouth correctness, lip rounds, or nasal holding beats) and presents clean visual summaries."
                : "برنامج حاسوبي لمعايرة اللفظ العربي الشريف، يبين مواضع الضغط في الجوف أو الحلق ومقدار الثواني أو الحركات المحددة لحكم الإدغام، الأخفاء، القلقلة، والمدود للتطبيق العلمي السردي المتقن."}
            </p>
          </div>

          {/* 3. INTERACTIVE PARSER SANDBOX */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Compass className="w-5 h-5 text-violet-700" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  {lang === 'en' ? "Scholarly Sandbox: Instant Arabic Phonetics Parser" : "المختبر اللغوي: محلل تراكيب وتجويد الآيات التلقائي"}
                </h2>
                <p className="text-[10px] text-slate-500">
                  {lang === 'en' ? "Type any Arabic speech text to see dynamic rules parsed by the backend algorithm" : "اكتب أو الصق أي نص أو كلمات عربية لتشغيل معالج التجويد الرقمي عليها بلحظتها"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                  {lang === 'en' ? "Input Text Block (Supports full diacritics):" : "النص العربي المراد تحليله (يدعم الضبط والتشكيل):"}
                </label>
                <input
                  type="text"
                  value={sandboxText}
                  onChange={(e) => setSandboxText(e.target.value)}
                  placeholder={lang === 'en' ? "e.g., إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ" : "مثال: مِّن رَّبِّهِمْ كَدَأْبِ آلِ فِرْعَوْنَ"}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-serif font-bold text-right tracking-wide"
                  style={{ fontSize: '18px' }}
                  id="settings-sandbox-input"
                />
              </div>

              {/* Analysis Results Display */}
              <div className="bg-[#FAF9F5] rounded-xl p-5 border border-amber-900/10 space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-amber-900/5 pb-2">
                  <span className="text-[9px] uppercase tracking-widest font-black text-amber-900">
                    {lang === 'en' ? "Algorithmic Analysis Output" : "مخرجات الفحص وحساب الأزمنة"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-450 bg-white border px-2 py-0.5 rounded-md font-bold">
                    Qira'at: {qiraat === 'hafs' ? "Hafs / حفص" : "Warsh / ورش"}
                  </span>
                </div>

                {sandboxAnalysis ? (
                  <div className="space-y-3 font-sans">
                    {/* feedback line */}
                    <div className="flex items-start gap-2 text-xs md:text-[13px] text-[#073327] font-medium leading-relaxed bg-[#073327]/5 p-3 rounded-lg border border-[#073327]/10">
                      <Sparkles className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                      <p>{sandboxAnalysis.summaryFeedback}</p>
                    </div>

                    {/* Word bubbles with rules */}
                    <div className="flex flex-wrap gap-2 pt-2 justify-end" dir="rtl">
                      {sandboxAnalysis.words.map((word: any, sIdx: number) => {
                        const hasRules = word.occurrences.length > 0;
                        return (
                          <div 
                            key={`sandbox-word-${sIdx}`}
                            className={`p-2.5 rounded-xl border flex flex-col items-center min-w-[80px] transition-all relative ${
                              hasRules 
                                ? 'bg-white border-amber-300 shadow-sm' 
                                : 'bg-slate-50/50 border-slate-100 text-slate-500'
                            }`}
                          >
                            <span className="font-serif font-black text-slate-900 text-sm md:text-base leading-tight">
                              {word.wordText}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono tracking-tight mt-1">
                              "{word.phoneticTranscription}"
                            </span>

                            {/* rules count tag inside bubble */}
                            {hasRules && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-600 text-white font-extrabold text-[8px] rounded-full flex items-center justify-center shadow-xs">
                                {word.occurrences.length}
                              </span>
                            )}

                            {/* small descriptions */}
                            {word.occurrences.map((oc: any, oIdx: number) => (
                              <span 
                                key={`oc-${oIdx}`}
                                className="text-[7.5px] uppercase font-bold tracking-tight px-1 py-0.5 rounded-sm bg-amber-500/10 text-amber-900 mt-1 min-w-[50px] text-center"
                                title={oc.description}
                              >
                                {oc.ruleName}
                              </span>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-450 italic py-3">
                    {lang === 'en' ? "Enter speech text in the field above to run computation." : "قم بكتابة كلمات أو جملاً عربية بالأعلى لعرض التحليل الرياضي للترتيل."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (COL-SPAN-4) - STUDENT PROFILE & SYNC STATUS */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          
          {/* PROFILE CONTROL FORM */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-emerald-800" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                {lang === 'en' ? "Student Identity" : "هوية الدارس الأكاديمية"}
              </h2>
            </div>

            {/* Account authentication status banner */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-[11px] leading-relaxed font-bold ${
              progress.username 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${progress.username ? 'text-emerald-700' : 'text-amber-700'}`} />
              <div>
                <span>
                  {progress.username 
                    ? (lang === 'en' ? "Authenticated Session Connected" : "جلسة آمنة مسجلة بنجاح") 
                    : (lang === 'en' ? "Guest / Anonymous State" : "وضع زائر عام غير مسجل")}
                </span>
                <p className={`font-normal mt-0.5 text-[10px] ${progress.username ? 'text-slate-600' : 'text-amber-805 text-amber-800'}`}>
                  {progress.username 
                    ? (lang === 'en' ? `Automatically syncing to: ${progress.email}` : `يتم حفظ وتزامن الإنجاز تلقائياً للحساب: ${progress.email}`)
                    : (lang === 'en' ? "All preferences persist on this local device. Sign in to sync achievements." : "الخيارات تحفظ مصفوفة محلياً على هذا المتصفح. يرجى تسجيل الدخول لحفظ المناهج.")}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  {lang === 'en' ? "Your Display Name:" : "الاسم المعروض الأكاديمي:"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder={lang === 'en' ? "Unauthenticated Guest" : "طالب علم عام"}
                    className="w-full border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    id="input-settings-name"
                  />
                  <Edit3 className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  {lang === 'en' ? "Registered Email Address:" : "البريد الإلكتروني للتوثيق:"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={progress.email || ''}
                    disabled
                    placeholder={lang === 'en' ? "Local browser only" : "حفظ سحابي معطل"}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold bg-slate-100 text-slate-450 cursor-not-allowed outline-none"
                    id="input-settings-email"
                  />
                  <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving || !profileName.trim()}
                className={`w-full h-9 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer border-0 ${
                  isSaving || !profileName.trim()
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-emerald-805 hover:bg-emerald-950 text-white'
                }`}
                id="btn-settings-save-profile"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'en' ? "Synchronizing..." : "جاري المعالجة..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{lang === 'en' ? "Save & Apply Settings" : "حفظ الهوية وتعديل الاختيار"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ACADEMIC SUMMARY BOARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5">
              {lang === 'en' ? "Classroom Snapshot" : "سجل الدارس الحالي"}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{lang === 'en' ? "Completed Modules:" : "المحاضرات المكتملة:"}</span>
                <span className="font-extrabold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border font-mono">
                  {progress.lessonsCompleted.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{lang === 'en' ? "Study Time Goals:" : "معدل الحضور الأسبوعي:"}</span>
                <span className="font-extrabold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border font-mono">
                  {progress.weeklyMinutes} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{lang === 'en' ? "Bookmarks Recorded:" : "فرص المنح والآيات المحفوظة:"}</span>
                <span className="font-extrabold text-[#C59B32] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-mono">
                  {progress.savedScholarships.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
