import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Type, ZoomOut, ZoomIn, Cloud, Volume2, Bookmark, Check, Copy, 
  Sparkles, Play, Pause, ChevronRight, Square, Compass, Mic, Trash, AlertCircle, LayoutList, RefreshCw,
  Info, Activity, HeartPulse
} from 'lucide-react';
import { analyzeTajweedText } from '../../server/tajweedEngine';

interface AyahPair {
  number: number;
  numberInSurah: number;
  arabicText: string;
  englishText: string;
  transliterationText?: string;
  audioUrl?: string;
  juz?: number;
  page?: number;
}

const RECITERS_LIST = [
  {
    id: 'husary',
    nameEn: "Mahmoud Khalil Al-Husary",
    nameAr: "محمود خليل الحصري",
    styleEn: "Tajweed Precision",
    styleAr: "ترتيل وتحقيق متقن",
    tagAr: "شيخ المقارئ",
    tagEn: "Preservation Pioneer"
  },
  {
    id: 'ghamadi',
    nameEn: "Saad Al-Ghamidi",
    nameAr: "سعد الغامدي",
    styleEn: "Warm & Melodic",
    styleAr: "عذب هادئ",
    tagAr: "طمأنينة القلوب",
    tagEn: "Melodic & Serene"
  },
  {
    id: 'sudais',
    nameEn: "Abdul Rahman Al-Sudais",
    nameAr: "عبد الرحمن السديس",
    styleEn: "Energetic Makkah pulpit",
    styleAr: "نبر جهوري مهيب",
    tagAr: "إمام الحرمين",
    tagEn: "Makkah Lead Qari"
  },
  {
    id: 'shuraim',
    nameEn: "Saud Al-Shuraim",
    nameAr: "سعود الشريم",
    styleEn: "Rhythmic classic cadence",
    styleAr: "ترتيل متزن رزين",
    tagAr: "تلاوة عريقة",
    tagEn: "Classic Cadence"
  },
  {
    id: 'muaiqly',
    nameEn: "Maher Al-Muaiqly",
    nameAr: "ماهر المعيقلي",
    styleEn: "Emotive & Gentle",
    styleAr: "خاشع رقراق",
    tagAr: "تأثير دافئ",
    tagEn: "Sanctuary Echo"
  },
  {
    id: 'kameny',
    nameEn: "Sheikh Okasha Kameny",
    nameAr: "عكاشة كميني",
    styleEn: "West-African rhythmic tempos",
    styleAr: "ترتيل أفريقي قوي متزن",
    tagAr: "مقامات عريقة",
    tagEn: "African Rhythm"
  }
];

interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface MushafReaderProps {
  lang: 'en' | 'ar';
  currentSurahMeta: SurahMeta | null;
  selectedSurahNum: number;
  activeTheme: 'ivory' | 'sepia' | 'emerald' | 'charcoal' | 'midnight' | 'white';
  setActiveTheme: (t: any) => void;
  displayMode: 'translation' | 'transliteration' | 'both' | 'tajweed';
  setDisplayMode: (m: any) => void;
  selectTajweed: (t: boolean) => void;
  primaryReciter: string;
  setPrimaryReciter: (r: any) => void;
  errorMsg: string | null;
  mushafPage: number;
  setMushafPage: React.Dispatch<React.SetStateAction<number>>;
  totalMushafPages: number;
  loadingSurah: boolean;
  activeQiraat: 'hafs' | 'warsh';
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  paginatedMushafVerses: AyahPair[];
  selectedAyahInMushaf: AyahPair | null;
  setSelectedAyahInMushaf: (v: AyahPair | null) => void;
  playingAyahKey: string | null;
  playAyahAudio: (key: string, url: string) => void;
  toggleBookmark: (surah: number, ayah: number) => void;
  bookmarkedVerses: string[];
  copyToClipboard: (t: string, k: string) => void;
  copiedKey: string | null;
  selectedWordAnalysis: any;
  setSelectedWordAnalysis: (w: any) => void;
  isAuthenticated: boolean;
  onSwitchToAuth: (() => void) | undefined;
  stopWholeSurahPlayback: () => void;
  setShowReader: (b: boolean) => void;
  downloadProgress: {[key: string]: number};
  downloadedSurahs: string[];
  deleteCurrentSurahAudio: () => void;
  downloadCurrentSurahAudio: () => void;
  playWholeSurahConsecutive: (idx: number) => void;
  ghostModeActive: boolean;
  ghostScopeJuz: number;
  setGhostScopeJuz: (j: number) => void;
  ghostScopePage: number;
  setGhostScopePage: (p: number) => void;
  ghostScopeStart: number;
  setGhostScopeStart: React.Dispatch<React.SetStateAction<number>>;
  ghostScopeEnd: number;
  setGhostScopeEnd: React.Dispatch<React.SetStateAction<number>>;
  ghostExpectedWords: any[];
  setGhostExpectedWords: React.Dispatch<React.SetStateAction<any[]>>;
  ghostCurrentWordIdx: number;
  setGhostCurrentWordIdx: React.Dispatch<React.SetStateAction<number>>;
  ghostVoiceStatus: string;
  setGhostVoiceStatus: React.Dispatch<React.SetStateAction<string>>;
  ghostQari: 'husary' | 'ghamadi';
  setGhostQari: React.Dispatch<React.SetStateAction<'husary' | 'ghamadi'>>;
  startGhostMode: () => void;
  stopGhostMode: () => void;
  interimText: string;
  setInterimText: React.Dispatch<React.SetStateAction<string>>;
  ghostStudentProgress: number;
  setGhostStudentProgress: React.Dispatch<React.SetStateAction<number>>;
  ghostRefProgress: number;
  setGhostRefProgress: React.Dispatch<React.SetStateAction<number>>;
  ghostMetrics: any;
  setGhostMetrics: React.Dispatch<React.SetStateAction<any>>;
  ghostScores: any;
  setGhostScores: React.Dispatch<React.SetStateAction<any>>;
  schedSurahNum: number;
  setSchedSurahNum: React.Dispatch<React.SetStateAction<number>>;
  schedFreq: string;
  setSchedFreq: React.Dispatch<React.SetStateAction<string>>;
  schedTargetDate: string;
  setSchedTargetDate: React.Dispatch<React.SetStateAction<string>>;
  addSchedTarget: (e: React.FormEvent) => void;
  removeSchedTarget: (id: string) => void;
  revTimetable: any[];
  surahs: SurahMeta[];
  currentJuz: number;
  currentMushafOriginPage: number;
  activeSurahData: AyahPair[];
  transformHafsToWarsh: (text: string) => string;
  MUSHAF_THEMES: any;
  playMode: 'continuous_stream' | 'verse_by_verse';
  setPlayMode: (m: 'continuous_stream' | 'verse_by_verse') => void;
  fullSurahDuration: number;
  fullSurahCurrentTime: number;
  seekContinuousStream: (time: number) => void;
  surahPlayActive: boolean;
  setSelectedSurahNum: React.Dispatch<React.SetStateAction<number>>;
}

export default function MushafReader({
  lang,
  currentSurahMeta,
  selectedSurahNum,
  activeTheme,
  setActiveTheme,
  displayMode,
  setDisplayMode,
  selectTajweed,
  primaryReciter,
  setPrimaryReciter,
  errorMsg,
  mushafPage,
  setMushafPage,
  totalMushafPages,
  loadingSurah,
  activeQiraat,
  fontSize,
  setFontSize,
  paginatedMushafVerses,
  selectedAyahInMushaf,
  setSelectedAyahInMushaf,
  playingAyahKey,
  playAyahAudio,
  toggleBookmark,
  bookmarkedVerses,
  copyToClipboard,
  copiedKey,
  selectedWordAnalysis,
  setSelectedWordAnalysis,
  isAuthenticated,
  onSwitchToAuth,
  stopWholeSurahPlayback,
  setShowReader,
  downloadProgress,
  downloadedSurahs,
  deleteCurrentSurahAudio,
  downloadCurrentSurahAudio,
  playWholeSurahConsecutive,
  playMode,
  setPlayMode,
  fullSurahDuration,
  fullSurahCurrentTime,
  seekContinuousStream,
  surahPlayActive,
  setSelectedSurahNum,
  ghostModeActive,
  ghostScopeJuz,
  setGhostScopeJuz,
  ghostScopePage,
  setGhostScopePage,
  ghostScopeStart,
  setGhostScopeStart,
  ghostScopeEnd,
  setGhostScopeEnd,
  ghostExpectedWords,
  setGhostExpectedWords,
  ghostCurrentWordIdx,
  setGhostCurrentWordIdx,
  ghostVoiceStatus,
  setGhostVoiceStatus,
  ghostQari,
  setGhostQari,
  startGhostMode,
  stopGhostMode,
  interimText,
  setInterimText,
  ghostStudentProgress,
  setGhostStudentProgress,
  ghostRefProgress,
  setGhostRefProgress,
  ghostMetrics,
  setGhostMetrics,
  ghostScores,
  setGhostScores,
  schedSurahNum,
  setSchedSurahNum,
  schedFreq,
  setSchedFreq,
  schedTargetDate,
  setSchedTargetDate,
  addSchedTarget,
  removeSchedTarget,
  revTimetable,
  surahs,
  currentJuz,
  currentMushafOriginPage,
  activeSurahData,
  transformHafsToWarsh,
  MUSHAF_THEMES
}: MushafReaderProps) {

  const themeStyles = MUSHAF_THEMES[activeTheme];
  const [displayModeDropdownOpen, setDisplayModeDropdownOpen] = React.useState(false);
  const [showTopQariDropdown, setShowTopQariDropdown] = React.useState(false);
  const [showBottomQariDropdown, setShowBottomQariDropdown] = React.useState(false);
  const [readingLayout, setReadingLayout] = React.useState<'continuous' | 'interactive'>('interactive');
  const [expandedRuleId, setExpandedRuleId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (playingAyahKey) {
      const parts = playingAyahKey.split(':');
      if (parts.length === 2 && Number(parts[0]) === selectedSurahNum) {
        const ayahNum = parts[1];
        const elementId = `mushaf-span-${selectedSurahNum}-${ayahNum}`;
        const scrollTarget = document.getElementById(elementId) || document.getElementById(`mushaf-block-${selectedSurahNum}-${ayahNum}`);
        if (scrollTarget) {
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [playingAyahKey, selectedSurahNum]);

  return (
    <div className={`${themeStyles.bg} ${themeStyles.text} transition-all duration-300 min-h-screen pb-24 font-sans select-none`} id="quran-reader-hub">
      
      {/* Slim floating circular Back Button instead of a bulky horizontal container */}
      <button 
        onClick={() => {
          stopWholeSurahPlayback(); 
          setShowReader(false);
        }}
        className="fixed left-4 top-24 z-50 p-2.5 bg-white/95 hover:bg-slate-100 text-slate-850 rounded-full shadow-lg border border-slate-350 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        id="reader-back-btn"
        title={lang === 'en' ? "Back to Index" : "العودة للفهرس"}
      >
        <ChevronLeft className="w-5 h-5 text-amber-600" />
      </button>

      {/* DYNAMIC ERROR ALERT */}
      {errorMsg && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-100 text-xs font-bold leading-normal">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT SPLIT GRID */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8 animate-fadeIn">
        
        {/* LEFT AREA: CHOSEN BACKGROUND MUSHAF BOOK (COL-SPAN-7) */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          
          {/* Authentic Book Margin Box */}
          <div 
            className={`${themeStyles.bg} ${themeStyles.borderStyle} ${themeStyles.border} rounded-[2.5rem] shadow-xl p-5 md:p-10 relative overflow-hidden transition-all duration-300 min-h-[550px] flex flex-col justify-between`}
            id="authentic-mushaf-paper"
          >
            {/* Corner Ornaments */}
            <div className={`absolute top-4 left-4 ${themeStyles.ornament} pointer-events-none select-none`}>
              <span className="font-serif text-3xl font-black">✦</span>
            </div>
            <div className={`absolute top-4 right-4 ${themeStyles.ornament} pointer-events-none select-none`}>
              <span className="font-serif text-3xl font-black">✦</span>
            </div>
            <div className={`absolute bottom-4 left-4 ${themeStyles.ornament} pointer-events-none select-none`}>
              <span className="font-serif text-3xl font-black">✦</span>
            </div>
            <div className={`absolute bottom-4 right-4 ${themeStyles.ornament} pointer-events-none select-none`}>
              <span className="font-serif text-3xl font-black">✦</span>
            </div>

            {/* Inner Page Header */}
            <div className={`flex items-center justify-between border-b border-amber-900/10 pb-3 mb-4 text-[11px] font-serif ${themeStyles.text} font-bold select-none tracking-wide`}>
              <span>
                {lang === 'en' ? `Juz' ${currentJuz}` : `الجزء ${currentJuz}`}
              </span>
              <span className="italic font-bold text-amber-600 font-serif">
                {currentSurahMeta?.name} / {currentSurahMeta?.englishName}
              </span>
              <span>
                {lang === 'en' ? `Page ${currentMushafOriginPage}` : `صفحة الحفظ ${currentMushafOriginPage}`}
              </span>
            </div>

            {/* Visual Layout Mode Selector */}
            <div className="flex items-center justify-center gap-1.5 mb-3 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[10px] font-bold max-w-sm mx-auto shadow-inner select-none font-sans">
              <button
                type="button"
                onClick={() => setReadingLayout('continuous')}
                className={`flex-1 py-1 px-3.5 rounded-lg border-0 cursor-pointer text-[10px] font-extrabold tracking-wide transition-all active:scale-95 ${
                  readingLayout === 'continuous' ? 'bg-amber-600 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {lang === 'en' ? "Continuous Flow" : "تلاوة متصلة"}
              </button>
              <button
                type="button"
                onClick={() => setReadingLayout('interactive')}
                className={`flex-1 py-1 px-3.5 rounded-lg border-0 cursor-pointer text-[10px] font-extrabold tracking-wide transition-all active:scale-95 ${
                  readingLayout === 'interactive' ? 'bg-amber-600 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {lang === 'en' ? "Inline Translate" : "ترجمة مدمجة"}
              </button>
            </div>

            {/* Compact inline reader controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] pb-4 mb-4 border-b border-amber-900/5 select-none font-sans">
              
              {/* Display mode buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 select-none">
                {[
                  { value: 'translation', label: '📖 ' + (lang === 'en' ? 'Meaning' : 'الترجمة') },
                  { value: 'both', label: '📙 ' + (lang === 'en' ? 'Both' : 'الكل') },
                  { value: 'tajweed', label: '💎 ' + (lang === 'en' ? 'Tajweed' : 'التجويد') }
                ].map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setDisplayMode(item.value as any);
                      selectTajweed(item.value === 'tajweed');
                    }}
                    className={`py-1 px-3 rounded-lg border-0 cursor-pointer text-[10px] font-extrabold transition-all active:scale-95 ${
                      displayMode === item.value ? 'bg-amber-600 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Theme SelectorDots */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 select-none">
                {(Object.keys(MUSHAF_THEMES) as Array<keyof typeof MUSHAF_THEMES>).map((tKey) => {
                  const isActive = activeTheme === tKey;
                  const dotBg = tKey === 'ivory' ? 'bg-[#FCFAF2]' : 
                                tKey === 'sepia' ? 'bg-[#F4ECE1]' : 
                                tKey === 'emerald' ? 'bg-[#0E201B]' :
                                tKey === 'charcoal' ? 'bg-[#212121]' :
                                tKey === 'midnight' ? 'bg-[#0A0D14]' : 'bg-white';
                  return (
                    <button
                      key={`theme-dot-mini-${String(tKey)}`}
                      onClick={() => setActiveTheme(tKey)}
                      className={`w-4 h-4 rounded-full border border-slate-250 transition-all cursor-pointer ${dotBg} ${isActive ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-white scale-110' : 'opacity-80 hover:opacity-100'}`}
                      title={String(tKey)}
                    />
                  );
                })}
              </div>

              {/* Reciter selector (Custom dropdown) */}
              <div className="relative select-none shrink-0" id="top-qari-dropdown-trigger">
                <button
                  onClick={() => setShowTopQariDropdown(!showTopQariDropdown)}
                  className="bg-white hover:bg-slate-50 text-slate-800 text-[10px] font-extrabold py-1.5 px-3 rounded-lg border border-slate-250 cursor-pointer outline-none transition-all flex items-center gap-1.5 shadow-xs"
                  title="Choose Audio Reciter"
                >
                  <Volume2 className="w-3 h-3 text-amber-600 animate-pulse" />
                  <span>
                    {(() => {
                      const found = RECITERS_LIST.find(r => r.id === primaryReciter);
                      return found ? (lang === 'en' ? found.nameEn.split(' ').pop() : found.nameAr.split(' ').pop()) : primaryReciter;
                    })()}
                  </span>
                  <span className="text-[7px] text-slate-400">▼</span>
                </button>

                {showTopQariDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowTopQariDropdown(false)} 
                    />
                    <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 max-h-80 overflow-y-auto">
                      <div className="px-3 py-1 border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left">
                        {lang === 'en' ? 'Select Reciter (Qari)' : 'اختر القارئ المجود'}
                      </div>
                      {RECITERS_LIST.map((qari) => {
                        const isSelected = primaryReciter === qari.id;
                        return (
                          <button
                            key={`top-qari-opt-${qari.id}`}
                            onClick={() => {
                              setPrimaryReciter(qari.id);
                              setShowTopQariDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between border-0 bg-transparent cursor-pointer ${isSelected ? 'bg-amber-50/50' : ''}`}
                          >
                            <div className="min-w-0 pr-1.5 text-left">
                              <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-amber-700' : 'text-slate-800'}`}>
                                {lang === 'en' ? qari.nameEn : qari.nameAr}
                              </p>
                              <p className="text-[9px] text-slate-400 truncate mt-0.5 text-left">
                                {lang === 'en' ? qari.styleEn : qari.styleAr}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 select-none" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

            </div>

            {loadingSurah ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
                <RefreshCw className="w-10 h-10 animate-spin text-amber-500" />
                <p className="text-xs font-bold uppercase tracking-widest font-mono">
                  {lang === 'en' ? "Transcribing Authentic Script..." : "جاري كتابة السطور والرموز الشريفة..."}
                </p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between space-y-8">
                
                {mushafPage === 1 && selectedSurahNum !== 9 && (
                  <div className="text-center select-none py-1.5 flex flex-col items-center">
                    <div className="w-4/5 md:w-3/5 py-2 px-6 rounded-2xl bg-gradient-to-r from-amber-600/5 via-amber-600/15 to-amber-600/5 border border-amber-700/20 text-center mb-4">
                      <p className={`text-2xl md:text-3xl font-extrabold ${themeStyles.arabicText} font-serif leading-relaxed`} dir="rtl">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                    </div>
                  </div>
                )}

                 {/* Calligraphy Flow */}
                <div className="text-right py-4" dir="rtl" id="mushaf-text-canvas">
                  <AnimatePresence mode="wait">
                    {readingLayout === 'continuous' ? (
                      <motion.p 
                        key={`mushaf-p-flip-continuous-${mushafPage}`}
                        initial={{ x: lang === 'ar' ? 30 : -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: lang === 'ar' ? -30 : 30, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`font-serif font-bold ${themeStyles.arabicText} tracking-wide select-all text-justify md:text-center w-full leading-loose`}
                        style={{ 
                          fontSize: `${fontSize}px`, 
                          lineHeight: `${fontSize * 1.95}px`,
                          wordSpacing: '0.15em'
                        }}
                      >
                        {paginatedMushafVerses.map((v) => {
                          const isSelected = selectedAyahInMushaf?.numberInSurah === v.numberInSurah;
                          const isPlaying = playingAyahKey === `${selectedSurahNum}:${v.numberInSurah}`;

                          return (
                            <span 
                              key={`mushaf-span-${v.number}`}
                              id={`mushaf-span-${selectedSurahNum}-${v.numberInSurah}`}
                              onClick={() => setSelectedAyahInMushaf(v)}
                              className={`inline transition-all duration-200 cursor-pointer rounded-sm px-1.5 py-0.5 relative ${
                                isSelected 
                                  ? 'bg-amber-500/15 ring-2 ring-amber-500/35 text-amber-800 font-extrabold' 
                                  : isPlaying
                                    ? 'bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/45 font-extrabold scale-102 inline-block'
                                    : 'hover:bg-amber-500/5'
                              }`}
                            >
                              {transformHafsToWarsh(v.arabicText).replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")}{" "}
                              {/* Medallion indicator */}
                              <span className="inline-flex items-center justify-center mx-1.5 w-6.5 h-6.5 rounded-full text-center font-bold font-mono text-[9.5px] shrink-0 border select-none transition-transform pointer-events-none hover:scale-105 bg-white text-amber-700 border-amber-400">
                                {v.numberInSurah}
                              </span>
                            </span>
                          );
                        })}
                      </motion.p>
                    ) : (
                      <motion.div
                        key={`mushaf-grid-interactive-${mushafPage}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3"
                      >
                        {paginatedMushafVerses.map((v) => {
                          const isSelected = selectedAyahInMushaf?.numberInSurah === v.numberInSurah;
                          const isPlaying = playingAyahKey === `${selectedSurahNum}:${v.numberInSurah}`;

                          return (
                            <div 
                              key={`mushaf-block-${v.number}`}
                              id={`mushaf-block-${selectedSurahNum}-${v.numberInSurah}`}
                              onClick={() => setSelectedAyahInMushaf(v)}
                              className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer block border text-right relative ${
                                isSelected 
                                  ? 'bg-amber-500/10 border-amber-500/30 shadow-inner' 
                                  : isPlaying
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-950 dark:text-emerald-50 shadow-xs ring-1 ring-emerald-400/30'
                                    : 'hover:bg-amber-500/10 bg-black/5 border-slate-200/40 text-slate-800'
                              }`}
                            >
                              <div className="flex items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-1.5 opacity-90 select-none">
                                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-mono text-[10px] font-black shrink-0 border select-none ${
                                    isSelected ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-white text-amber-700 border-amber-400'
                                  }`}>
                                    {v.numberInSurah}
                                  </span>
                                </div>
                                
                                <p 
                                  className={`font-serif font-bold ${themeStyles.arabicText} text-right flex-1 line-relaxed leading-loose`}
                                  style={{ 
                                    fontSize: `${Math.max(16, fontSize - 4)}px`, 
                                  }}
                                >
                                  {transformHafsToWarsh(v.arabicText).replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")}
                                </p>
                              </div>

                              {/* Interactive Inline Translation Expander */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden text-left border-t border-amber-900/10 mt-3 pt-3 space-y-2.5 font-sans"
                                    dir="ltr"
                                  >
                                    {/* Action bar inside the Mushaf card */}
                                    <div className="flex items-center gap-2 pb-1 select-none" onClick={e => e.stopPropagation()}>
                                      {v.audioUrl && (
                                        <button 
                                          onClick={() => playAyahAudio(`${selectedSurahNum}:${v.numberInSurah}`, v.audioUrl!)} 
                                          className={`py-1.5 px-3 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${isPlaying ? 'bg-amber-600 text-white border-amber-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}
                                        >
                                          <Volume2 className="w-3.5 h-3.5" />
                                          <span>{isPlaying ? 'Playing' : 'Play Audio'}</span>
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => toggleBookmark(selectedSurahNum, v.numberInSurah)} 
                                        className={`p-1.5 rounded-lg border transition ${bookmarkedVerses.includes(`${selectedSurahNum}:${v.numberInSurah}`) ? 'bg-amber-500/10 border-amber-300 text-amber-850' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'}`}
                                      >
                                        <Bookmark className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => copyToClipboard(`${v.arabicText} \n[${selectedSurahNum}:${v.numberInSurah}] \n"${v.englishText}"`, `ayah-${v.numberInSurah}`)} 
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-500"
                                      >
                                        {copiedKey === `ayah-${v.numberInSurah}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>

                                    {(displayMode === 'translation' || displayMode === 'both') && (
                                      <div className="text-left text-slate-700 text-[11px] leading-relaxed">
                                        <span className="block text-[8px] uppercase tracking-widest text-amber-700 font-mono leading-none mb-1 font-black">English Meaning</span>
                                        <p className="font-semibold text-slate-800">{v.englishText}</p>
                                      </div>
                                    )}
                                    {(displayMode === 'transliteration' || displayMode === 'both') && v.transliterationText && (
                                      <div className="text-left text-emerald-950 italic font-mono text-[10px] leading-relaxed">
                                        <span className="block text-[8px] uppercase tracking-widest text-[#0D5B41] font-mono leading-none mb-1 font-black">Transliteration</span>
                                        <p className="font-sans font-semibold">{v.transliterationText}</p>
                                      </div>
                                    )}
                                    {displayMode === 'tajweed' && (
                                      <div className="text-left text-emerald-950 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-500/15 text-[10px]">
                                        <span className="block text-[8px] uppercase tracking-widest text-emerald-700 font-mono leading-none mb-1 font-black">Pronunciation Guide</span>
                                        <p className="font-medium text-emerald-950">💎 {analyzeTajweedText(v.arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", ""), activeQiraat).summaryFeedback}</p>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={`border-t border-amber-900/10 pt-4 mt-6 text-center text-[10px] font-sans ${themeStyles.text} opacity-80 select-none leading-relaxed`}>
                  {lang === 'en' 
                    ? `Click any Verse text above to select it. Detail specifications & interactive tools are rendered on the right sidebar.` 
                    : `اضغط على رموز الآيات أو السطور أعلاه لتحديد الآية ومعاينة الشرح التفصلي باليمين.`}
                </div>

              </div>
            )}
            <div className="absolute right-1/2 translate-x-1/2 bottom-1.5 h-1.5 w-16 bg-amber-600/20 rounded-full" />
          </div>

          {/* READER PAGINATION DECK */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white text-slate-800 border border-slate-200 rounded-2xl p-4 shadow-sm">
            <button
              disabled={mushafPage <= 1}
              onClick={() => setMushafPage(p => p - 1)}
              className={`w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 border-0 ${
                mushafPage <= 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/55' : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'en' ? "Previous Page" : "الصفحة السابقة"}</span>
            </button>

            <div className="text-center font-serif text-sm font-bold text-amber-600 flex items-center gap-3">
              <span className="text-xs text-slate-350">﴿</span>
              <span>{lang === 'en' ? `Page ${mushafPage} of ${totalMushafPages}` : `صفحة ${mushafPage} من ${totalMushafPages}`}</span>
              <span className="text-xs text-slate-350">﴾</span>
              
              <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 text-center">
                {activeSurahData.length} {lang === 'en' ? 'verses' : 'آية'}
              </span>
            </div>

            <button
              disabled={mushafPage >= totalMushafPages}
              onClick={() => setMushafPage(p => p + 1)}
              className={`w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 border-0 ${
                mushafPage >= totalMushafPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/55' : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <span>{lang === 'en' ? "Next Page" : "الصفحة التالية"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* AUDIO DOWNLOAD CARD */}
          <div className="bg-white border border-slate-200 text-slate-800 rounded-3xl p-5 shadow flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                <Cloud className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left w-full">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>{lang === 'en' ? "Offline Audio Sync" : "التنزيل الصوتي"}</span>
                  {downloadedSurahs.includes(`${selectedSurahNum}:${primaryReciter}`) && (
                    <span className="text-[8px] bg-emerald-600 text-white font-mono uppercase tracking-widest px-1.5 py-0.5 rounded font-black border border-emerald-500">
                      {lang === 'en' ? "LOCAL" : "محلي"}
                    </span>
                  )}
                </h4>
                <p className="text-[9px] text-slate-500 leading-normal font-medium max-w-sm mt-0.5">
                  {lang === 'en' 
                    ? `Store Surah ${currentSurahMeta?.englishName || ""} offline for play.`
                    : `تحميل تلاوة سورة ${currentSurahMeta?.name} محلياً للاستماع بدون شبكة.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
              {downloadProgress[`${selectedSurahNum}:${primaryReciter}`] !== undefined ? (
                <div className="w-full md:w-44 flex flex-col gap-1 text-right">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold font-mono">
                    <span>{downloadProgress[`${selectedSurahNum}:${primaryReciter}`]}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 border border-slate-250 rounded-full overflow-hidden animate-pulse">
                    <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${downloadProgress[`${selectedSurahNum}:${primaryReciter}`]}%` }} />
                  </div>
                </div>
              ) : downloadedSurahs.includes(`${selectedSurahNum}:${primaryReciter}`) ? (
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={deleteCurrentSurahAudio}
                    className="py-1.5 px-3 text-[10px] font-bold text-red-500 hover:bg-red-55 border border-red-200 rounded-xl cursor-pointer bg-white transition-all"
                  >
                    Delete Cache
                  </button>
                  <div className="text-emerald-700 font-bold text-[10px] bg-emerald-100/60 px-2.5 py-1.5 rounded-xl border border-emerald-300/60 shadow-inner">
                    Ready
                  </div>
                </div>
              ) : (
                <button
                  onClick={downloadCurrentSurahAudio}
                  className="w-full md:w-auto py-2 px-4 text-[10px] font-extrabold bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer transition-all uppercase tracking-wider border-0"
                >
                  Download Audio
                </button>
              )}
            </div>
          </div>

          {/* CALIGRAPHIC TEXT ENLARGER */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 flex items-center justify-between gap-4 text-slate-850 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase font-mono tracking-widest">
              <Type className="w-4 h-4 text-amber-600" />
              {lang === 'en' ? "Visual Text Zoom" : "حجم الخط الشريف"}
            </span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
              <button onClick={() => setFontSize(Math.max(18, fontSize - 2))} className="p-1.5 px-3 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer text-xs font-black border-0 bg-transparent">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <div className="px-3.5 text-[10px] font-mono font-bold text-amber-600 min-w-[#45px] text-center">{fontSize}px</div>
              <button onClick={() => setFontSize(Math.min(46, fontSize + 2))} className="p-1.5 px-3 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer text-xs font-black border-0 bg-transparent">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT AREA: ACTIVE SELECTED AYAH DETAILED PRESENTATION DECK (COL-SPAN-5) */}
        <div className="col-span-1 lg:col-span-12 xl:col-span-5 space-y-6">
          
          {selectedAyahInMushaf ? (
            <div className="bg-white border border-slate-250/75 rounded-[2rem] p-5 md:p-6 shadow-md text-slate-900 space-y-5 flex flex-col justify-between" id="active-selected-verse-details">
              
              {/* Card coordinate tracking info list */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-mono font-black text-xs flex items-center justify-center select-none shadow">
                    {selectedAyahInMushaf.numberInSurah}
                  </div>
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-widest text-[#C59B32] font-mono font-black leading-none mb-0.5">Active Recitation Spot</span>
                    <span className="block text-xs font-black text-[#041E15] uppercase tracking-wider">
                      {currentSurahMeta?.englishName} • {selectedSurahNum}:{selectedAyahInMushaf.numberInSurah}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  {selectedAyahInMushaf.audioUrl && (
                    <button 
                      onClick={() => playAyahAudio(`${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}`, selectedAyahInMushaf.audioUrl!)} 
                      className={`p-2 rounded-xl border transition ${
                        playingAyahKey === `${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}` 
                          ? 'bg-amber-600 text-white border-amber-700 animate-pulse shadow-sm' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => toggleBookmark(selectedSurahNum, selectedAyahInMushaf.numberInSurah)} 
                    className={`p-2 rounded-xl border transition ${
                      bookmarkedVerses.includes(`${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}`) 
                        ? 'bg-amber-500/10 border-amber-300 text-amber-800' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(`${selectedAyahInMushaf.arabicText} \n[${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}] \n"${selectedAyahInMushaf.englishText}"`, `ayah-${selectedAyahInMushaf.numberInSurah}`)} 
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500"
                  >
                    {copiedKey === `ayah-${selectedAyahInMushaf.numberInSurah}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Calligraphy block preview */}
              <div className="bg-[#FAF8F5] border border-amber-900/5 p-4 rounded-2xl text-center shadow-inner">
                <p className="text-right font-serif font-black text-[#041E15] text-[18px] md:text-[21px] leading-relaxed pr-1" dir="rtl">
                  {activeQiraat === 'warsh' ? transformHafsToWarsh(selectedAyahInMushaf.arabicText) : selectedAyahInMushaf.arabicText}
                </p>
              </div>

              {/* Dynamic text settings selection */}
              <div className="space-y-4 pt-1">
                {(displayMode === 'translation' || displayMode === 'both') && (
                  <div className="text-left text-slate-700 text-[11px] leading-relaxed">
                    <span className="block text-[8px] uppercase tracking-widest text-[#C59B32] font-mono leading-none mb-1 font-extrabold">English Meaning</span>
                    <p className="font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-150/60 leading-normal">{selectedAyahInMushaf.englishText}</p>
                  </div>
                )}
                {(displayMode === 'transliteration' || displayMode === 'both') && selectedAyahInMushaf.transliterationText && (
                  <div className="text-left text-emerald-950 italic font-mono text-[10px] leading-relaxed">
                    <span className="block text-[8px] uppercase tracking-widest text-[#0D5B41] font-mono leading-none mb-1 font-extrabold">Phonetic Transliteration</span>
                    <p className="font-sans font-semibold bg-emerald-50/30 p-3 rounded-xl border border-emerald-500/10 text-emerald-900">{selectedAyahInMushaf.transliterationText}</p>
                  </div>
                )}
                {displayMode === 'tajweed' && (
                  <div className="text-left text-emerald-950 bg-emerald-100/30 p-3 rounded-2xl border border-emerald-500/15 text-[10px] leading-normal flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-emerald-800 font-mono leading-none mb-1 font-extrabold">Dynamic Verse Feedback</span>
                      <p className="font-bold text-emerald-950">💎 {analyzeTajweedText(selectedAyahInMushaf.arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", ""), activeQiraat).summaryFeedback}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seamless Inline Word Bubbles for Tajweed Assistance and Pronunciation details */}
              {displayMode === 'tajweed' && (
                <div className="border-t border-slate-100 pt-4 mt-2 space-y-2.5">
                  <span className="block text-[9px] uppercase font-black text-slate-500 tracking-wider text-right" dir="rtl">
                    💎 رسم الكلمات (اضغط للتفصيل التجويدي والمخرج):
                  </span>
                  {(() => {
                    const clean = selectedAyahInMushaf.arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "");
                    const analysis = analyzeTajweedText(clean, activeQiraat);
                    return (
                      <div className="flex flex-wrap gap-1.5 justify-end" dir="rtl">
                        {analysis.words.map((word, wIdx) => {
                          const hasRules = word.occurrences.length > 0;
                          const isWordSelected = selectedWordAnalysis?.wordIndex === word.wordIndex;
                          return (
                            <button
                              type="button"
                              key={`word-bubble-${wIdx}`}
                              onClick={() => {
                                setSelectedWordAnalysis(word);
                                if (word.occurrences.length > 0) {
                                  setExpandedRuleId(word.occurrences[0].ruleId);
                                }
                              }}
                              className={`p-2 rounded-xl text-right transition-all duration-150 cursor-pointer ${
                                isWordSelected 
                                  ? 'bg-amber-600 text-white font-bold scale-102 ring-2 ring-amber-500/20' 
                                  : hasRules 
                                    ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 font-bold border border-amber-300' 
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span className="block font-serif font-black text-[15px]">{word.wordText}</span>
                              <span className="block text-[8px] opacity-75 font-mono">"{word.phoneticTranscription}"</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          ) : (
            /* Selected state Empty guidance */
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center text-slate-500 space-y-4 shadow">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner select-none">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">{lang === 'en' ? "Verify & Read Verses" : "تتبع قراءتك الشريفة"}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                  {lang === 'en' 
                    ? "Choose any verse in the Mushaf page on the left to activate word syllable structures, traditional Tajweed rules, and live performance auditing!"
                    : "يرجى تحديد آية من المصحف على اليسار لاستعراض أحكام تجويدها، مع قراءة الكلمات والمسمع الذكي الفوري."}
                </p>
              </div>
            </div>
          )}

          {/* REPRISAL MURAJAH REVISION ACTIVE RECALL GHOST ENGINE */}
          {displayMode === 'tajweed' && (
            <div className="space-y-4">
              {!isAuthenticated ? (
                <div className="bg-[#FAF8F5] border-2 border-slate-200/80 rounded-3xl p-6 text-center space-y-4 shadow-sm">
                  <HeartPulse className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
                  <h3 className="font-extrabold text-xs text-slate-800">🔒 Student Profile Authorization Required</h3>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Sign in to save weekly recite logs, schedule memory maintenance plans, and trigger voice auditor mechanics.</p>
                  <button onClick={() => onSwitchToAuth?.()} className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl cursor-pointer border-0 w-full shadow-md">Sign In Student Account</button>
                </div>
              ) : (
                <div className="space-y-6 text-slate-900">
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="text-left w-full sm:w-auto">
                        <span className="text-[8px] bg-[#073327] text-[#C59B32] font-mono font-black uppercase px-2.5 py-1 rounded">Oral Auditor</span>
                        <h3 className="text-sm font-black text-slate-800 mt-1">Live Recital Alignment</h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                      <button 
                        onClick={ghostModeActive ? stopGhostMode : startGhostMode}
                        className={`py-2.5 px-5 rounded-xl font-bold text-xs border-0 cursor-pointer text-[#C59B32] ${ghostModeActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                      >
                        {ghostModeActive ? "Stop Alignment Buffer" : "Start Voice Alignment"}
                      </button>
                      <div className="text-right text-[9.5px] font-mono text-slate-500">
                        <span className="block">Status:</span>
                        <span className="font-bold uppercase text-emerald-800">{ghostVoiceStatus}</span>
                      </div>
                    </div>

                    {/* Word segment flow */}
                    <div className="min-h-[160px] bg-emerald-50/60 border-2 border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
                      <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
                        {ghostExpectedWords.map((wordObj, i) => {
                          let styleStr = "bg-transparent border border-dashed border-emerald-300 text-emerald-700 text-[11px] p-1.5 rounded";
                          if (wordObj.status === 'correct') {
                            styleStr = "bg-emerald-600 text-white text-base font-serif px-2.5 py-1 border border-emerald-500";
                          } else if (wordObj.status === 'warning') {
                            styleStr = "bg-amber-550 text-white text-base font-serif px-2.5 py-1 line-through";
                          } else if (wordObj.status === 'error') {
                            styleStr = "bg-rose-500 text-white text-base font-serif px-2.5 py-1";
                          }
                          return (
                            <span key={i} className={`font-black select-none ${styleStr}`}>
                              {wordObj.status === 'pending' ? '⏳' : wordObj.word}
                            </span>
                          );
                        })}
                      </div>

                      {interimText.trim() && (
                        <div className="border-t border-emerald-500/10 pt-2 text-center text-xs text-emerald-800 font-mono italic" dir="rtl">
                          {interimText}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TIMELINE SPEEDS */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-650">
                          <span>Live Vocal Progress</span>
                          <span className="font-bold">{ghostStudentProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                          <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${ghostStudentProgress}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-650">
                          <span>Standard Reference Cadence</span>
                          <span className="font-bold">{ghostRefProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${ghostRefProgress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-slate-50 p-2 rounded-xl text-[10px]">
                        <span className="block text-slate-400 uppercase">WPM</span>
                        <h6 className="font-black mt-0.5">{ghostMetrics.speed}</h6>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl text-[10px]">
                        <span className="block text-slate-400 uppercase">Pauses</span>
                        <h6 className="font-black mt-0.5">{ghostMetrics.pauses}</h6>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl text-[10px]">
                        <span className="block text-slate-400 uppercase">Madd(s)</span>
                        <h6 className="font-black mt-0.5">{ghostMetrics.madd}s</h6>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl text-[10px]">
                        <span className="block text-slate-400 uppercase">Ghunnah</span>
                        <h6 className="font-black mt-0.5">{ghostMetrics.ghunna}s</h6>
                      </div>
                    </div>
                  </div>

                  {/* SCORE GAUGES */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm grid grid-cols-5 gap-2 text-center text-slate-800">
                    <div className="p-1">
                      <span className="text-[8px] text-slate-400 block">Accuracy</span>
                      <strong className="text-sm font-mono text-emerald-800 block mt-0.5">{ghostScores.accuracy}%</strong>
                    </div>
                    <div className="p-1">
                      <span className="text-[8px] text-slate-400 block">Tajweed</span>
                      <strong className="text-sm font-mono text-amber-800 block mt-0.5">{ghostScores.tajweed}%</strong>
                    </div>
                    <div className="p-1">
                      <span className="text-[8px] text-slate-400 block">Retention</span>
                      <strong className="text-sm font-mono text-indigo-800 block mt-0.5">{ghostScores.memorization}%</strong>
                    </div>
                    <div className="p-1">
                      <span className="text-[8px] text-slate-400 block">Fluency</span>
                      <strong className="text-sm font-mono text-rose-800 block mt-0.5">{ghostScores.fluency}%</strong>
                    </div>
                    <div className="p-1">
                      <span className="text-[8px] text-slate-400 block">Confidence</span>
                      <strong className="text-sm font-mono text-amber-600 block mt-0.5">{ghostScores.confidence}%</strong>
                    </div>
                  </div>

                  {/* METRIC SCHEDULING FORM */}
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 text-left">
                    <form onSubmit={addSchedTarget} className="space-y-4">
                      <h4 className="text-xs uppercase font-black tracking-widest text-[#073327]">📅 Append Revision Target Plan</h4>
                      <input type="date" value={schedTargetDate} onChange={e => setSchedTargetDate(e.target.value)} className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white" />
                      <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-900 border-0 text-[#C59B32] font-black text-xs rounded-xl cursor-pointer shadow">Add Goal Slot</button>
                    </form>

                    <div className="space-y-2 mt-4">
                      {revTimetable.map(plan => (
                        <div key={plan.id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-xs text-left">
                          <div>
                            <span className="font-extrabold text-slate-800 block">{plan.surahName}</span>
                            <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">Frequency: {plan.frequency} • Target: {plan.targetDate}</span>
                          </div>
                          <button onClick={() => removeSchedTarget(plan.id)} className="p-1 text-slate-450 hover:text-red-500 bg-transparent border-0 cursor-pointer">
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* BEAUTIFUL BOTTOM SHEET DRAWER FOR TAJWEED RULES EXPLANATIONS */}
      <AnimatePresence>
        {selectedWordAnalysis && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[100] cursor-pointer"
              onClick={() => setSelectedWordAnalysis(null)}
            />

            {/* Slide-Up Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '105%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 bg-white text-slate-800 rounded-t-[2.5rem] shadow-2xl z-[101] max-h-[85vh] overflow-y-auto border-t border-slate-250 select-none pb-12"
              id="tajweed-bottom-drawer"
            >
              {/* Little drag/grab bar visual indicator */}
              <div className="flex justify-center py-3.5">
                <div className="w-14 h-1.5 bg-slate-300 rounded-full cursor-pointer" onClick={() => setSelectedWordAnalysis(null)} />
              </div>

              <div className="max-w-3xl mx-auto px-6 md:px-8 space-y-5">
                {/* Header detail */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-widest text-[#C59B32] font-mono font-bold leading-none mb-1 block">Qur'anic Pronunciation Alignment</span>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                      {lang === 'en' ? "Tajweed & Articulation Analysis" : "تحليل التجويد ومخارج الحروف"}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedWordAnalysis(null);
                    }}
                    type="button"
                    className="p-1 px-4 bg-slate-155 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-black cursor-pointer border-0 transition-all active:scale-95"
                  >
                    {lang === 'en' ? "Dismiss" : "إغلاق"}
                  </button>
                </div>

                {/* Content: Selected Word details */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left space-y-1">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Chosen Vocabulary Unit</span>
                    <h4 className="text-2xl font-serif font-black text-[#073327] tracking-wider leading-none">{selectedWordAnalysis.wordText}</h4>
                    <span className="block italic text-[10.5px] font-mono text-slate-500">
                      Transflection: <strong className="text-slate-750 font-black font-sans capitalize">"{selectedWordAnalysis.phoneticTranscription}"</strong>
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-800 border border-emerald-300/40 px-4 py-2 rounded-2xl text-center shadow-xs">
                    <span className="block text-[8px] uppercase tracking-widest font-mono font-bold leading-none mb-0.5">Syllables</span>
                    <strong className="text-xs font-mono font-black">{selectedWordAnalysis.wordText.split("").join(" · ")}</strong>
                  </div>
                </div>

                {/* Rules lists */}
                {selectedWordAnalysis.occurrences && selectedWordAnalysis.occurrences.length > 0 ? (
                  <div className="space-y-4">
                    {selectedWordAnalysis.occurrences.map((oc: any, oIdx: number) => {
                      return (
                        <div 
                          key={`drawer-oc-${oIdx}`} 
                          className="p-5 rounded-[2rem] text-left text-xs transition-all duration-200 border border-slate-150/80 bg-slate-50 shadow-xs"
                        >
                          <div className="flex items-center justify-between font-black border-b border-slate-205/60 pb-2 mb-3">
                            <span className="font-extrabold text-[#0D5B41] font-sans text-sm flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                              {oc.ruleName}
                            </span>
                            <span className="text-[8px] uppercase font-mono bg-[#C59B32]/10 text-[#7D5E0E] px-2.5 py-1 rounded-lg font-black border border-[#C59B32]/20">
                              ⏱️ Duration: {oc.durationBeats} count{oc.durationBeats > 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <p className="text-slate-700 text-[11px] leading-relaxed font-semibold">
                            {oc.description}
                          </p>

                          {/* Graphical Articulation point simulator panel */}
                          <div className="mt-4 space-y-3 pt-4 border-t border-slate-200/50">
                            
                            {/* Audio Performance Instruction Tip */}
                            <div className="border-l-2 border-emerald-500 pl-3 italic text-emerald-950 text-[10.5px] bg-emerald-500/5 p-3 rounded-r-xl leading-relaxed font-sans">
                              <strong className="block text-[8.5px] uppercase tracking-widest text-[#0D5B41] font-mono not-italic mt-0.5 font-bold mb-1">Oral Delivery Guideline (توضيحات الترتيل)</strong>
                              "{oc.audioInstruction}"
                            </div>

                            {/* Simulator dashboard */}
                            {oc.makhrajInteractiveDetails && (
                              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5 font-sans shadow-inner">
                                <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-400 font-mono border-b border-slate-105 pb-1.5">
                                  <span>Makhraj Point • مخرج الحرف الأصيل</span>
                                  <span className="flex items-center gap-1 text-emerald-800">
                                    <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                    Active Simulation
                                  </span>
                                </div>
                                
                                {/* Organ details */}
                                <div className="space-y-1">
                                  <strong className="text-[11px] text-slate-900 block font-bold capitalize">Articulation Organ (العضو): {oc.makhrajInteractiveDetails?.title}</strong>
                                  <p className="text-[10px] text-slate-500 leading-normal font-medium">{oc.makhrajInteractiveDetails?.description}</p>
                                </div>

                                {/* Mouth openness simulator scale */}
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 font-mono">
                                    <span>Lips & Jaw Posture (وضعية الفم واللسان):</span>
                                    <span className="text-emerald-700 font-black">{(oc.makhrajInteractiveDetails?.mouthOpenness * 100).toFixed(0)}% Open</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/80 flex">
                                    <div 
                                      className="bg-emerald-600 h-full rounded-full transition-all duration-300" 
                                      style={{ width: `${oc.makhrajInteractiveDetails?.mouthOpenness * 100}%` }} 
                                    />
                                  </div>
                                  <div className="flex justify-between text-[7px] text-slate-400 font-mono leading-none">
                                    <span>Closed (مطبق)</span>
                                    <span>Neutral</span>
                                    <span>Wide Open (مفتوح)</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/80 flex flex-col gap-0.5">
                                    <span className="text-slate-400 text-[8px] uppercase tracking-wider font-mono">Airstream Passage</span>
                                    <span className="font-extrabold text-slate-700 flex items-center gap-1">
                                      <span>Active stream:</span>
                                      <span>{oc.makhrajInteractiveDetails?.activeAirstreamHighlightEmoji}</span>
                                    </span>
                                  </div>
                                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/80 flex flex-col gap-0.5">
                                    <span className="text-slate-400 text-[8px] uppercase tracking-wider font-mono">Vowel Duration</span>
                                    <span className="font-black text-slate-800">
                                      ⏱️ {oc.durationBeats} count{oc.durationBeats > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                </div>

                                {/* Hotspots */}
                                {oc.makhrajInteractiveDetails?.anatomicalHotspots && (
                                  <div className="space-y-1 pt-1">
                                    <span className="text-slate-400 text-[8px] uppercase tracking-wider font-mono block">Anatomical Focus Spotlights</span>
                                    <div className="flex flex-wrap gap-1">
                                      {oc.makhrajInteractiveDetails.anatomicalHotspots.map((spot: string, sIdx: number) => (
                                        <span 
                                          key={`spot-ds-${sIdx}`} 
                                          className="bg-emerald-500/10 text-emerald-800 border border-emerald-300/30 text-[8.5px] px-2 py-0.5 rounded font-mono font-bold tracking-wide animate-pulse"
                                        >
                                          🔥 {spot.replace('-', ' ')}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl text-center text-slate-400 italic font-medium">
                    {lang === 'en' 
                      ? "No complex traditional phonological rules were registered for this syllable." 
                      : "لا توجد أحكام غنة أو مدود معقدة مسجلة في هذا التقطيع الصوتي."}
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Audio Playback Controller Bar */}
      <div 
        className="fixed bottom-6 left-1/2 -track-layout -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-zinc-950/95 backdrop-blur-md text-white border border-neutral-800 rounded-3xl shadow-2xl p-4 sm:p-5 flex flex-col gap-3 font-sans"
        id="floating-audio-panel"
      >
        {/* Upper Track Details and Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="text-left">
            <span className="block text-[8px] sm:text-[9.5px] uppercase tracking-widest text-amber-500 font-extrabold font-mono">
              Quran Stream • {playMode === 'continuous_stream' ? (lang === 'en' ? 'Continuous MP3 Track' : 'تلاوة متواصلة بدون تقطيع') : (lang === 'en' ? 'Syllable Highlighter' : 'تتبع الآيات')}
            </span>
            <h4 className="text-sm font-black tracking-tight text-white flex flex-wrap items-center gap-2 mt-0.5">
              <span>{lang === 'en' ? "Surah" : "سورة"} {currentSurahMeta?.englishName} ({currentSurahMeta?.name})</span>
              <span className="text-[10px] text-zinc-400 font-normal">
                by {primaryReciter === 'husary' ? 'Sheikh Al-Husary' : primaryReciter === 'ghamadi' ? 'Saad Al-Ghamidi' : primaryReciter === 'sudais' ? 'Al-Sudais' : primaryReciter === 'shuraim' ? 'Saud Al-Shuraim' : primaryReciter === 'muaiqly' ? 'Maher Al-Muaiqly' : 'Okasha Kameny'}
              </span>
            </h4>
          </div>
          
          <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-between bg-zinc-900 p-1 rounded-xl border border-zinc-850">
            <button
              onClick={() => {
                stopWholeSurahPlayback();
                setPlayMode('continuous_stream');
              }}
              className={`py-1 px-2 text-[8px] sm:text-[9px] uppercase font-black tracking-wider rounded-lg cursor-pointer transition-all ${
                playMode === 'continuous_stream' 
                  ? 'bg-amber-500 text-zinc-950 font-black' 
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
              title="Seamless whole-surah listening with draggable seekbar"
            >
              {lang === 'en' ? "Continuous Stream" : "تلاوة متواصلة"}
            </button>
            <button
              onClick={() => {
                stopWholeSurahPlayback();
                setPlayMode('verse_by_verse');
              }}
              className={`py-1 px-2 text-[8px] sm:text-[9px] uppercase font-black tracking-wider rounded-lg cursor-pointer transition-all ${
                playMode === 'verse_by_verse' 
                  ? 'bg-amber-500 text-zinc-950 font-black' 
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
              title="Autoplay with verse highlights"
            >
              {lang === 'en' ? "Verse Highlights" : "تتبع الآيات"}
            </button>
          </div>
        </div>

        {/* DRAGGABLE TIMELINE TRACKER (Only for Continuous Stream Mode) */}
        {playMode === 'continuous_stream' && (
          <div className="flex items-center gap-3 w-full">
            <span className="text-[10.5px] font-mono text-zinc-400 select-none shrink-0">
              {(() => {
                const secs = fullSurahCurrentTime || 0;
                const m = Math.floor(secs / 60);
                const s = Math.floor(secs % 60);
                return `${m}:${s < 10 ? '0' : ''}${s}`;
              })()}
            </span>
            <input
              type="range"
              min="0"
              max={fullSurahDuration || 100}
              value={fullSurahCurrentTime || 0}
              onChange={(e) => seekContinuousStream(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-colors hover:bg-zinc-700 outline-none"
              title="Seek audio track position"
            />
            <span className="text-[10.5px] font-mono text-zinc-450 select-none shrink-0 font-bold text-amber-500">
              {(() => {
                const secs = fullSurahDuration || 0;
                const m = Math.floor(secs / 60);
                const s = Math.floor(secs % 60);
                return `${m}:${s < 10 ? '0' : ''}${s}`;
              })()}
            </span>
          </div>
        )}

        {/* Lower row controllers */}
        <div className="flex items-center justify-between gap-2.5 mt-1 border-t border-zinc-900 pt-3">
          {/* Reciter dropdown list (Custom dark theme) */}
          <div className="relative select-none shrink-0" id="bottom-qari-dropdown-container">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono hidden sm:inline">Qari:</span>
              <button
                onClick={() => setShowBottomQariDropdown(!showBottomQariDropdown)}
                className="bg-zinc-900 hover:bg-zinc-850 text-white text-[10px] sm:text-xs font-black py-1.5 px-3 rounded-xl border border-zinc-800 cursor-pointer outline-none transition-all flex items-center gap-1.5 shadow-md"
              >
                <span>
                  {(() => {
                    const found = RECITERS_LIST.find(r => r.id === primaryReciter);
                    return found ? found.nameEn : "Select Reciter";
                  })()}
                </span>
                <span className="text-[8px] text-zinc-500">▼</span>
              </button>
            </div>

            {showBottomQariDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowBottomQariDropdown(false)} 
                />
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-50 py-2 max-h-80 overflow-y-auto">
                  <div className="px-3.5 py-1.5 border-b border-zinc-900 text-[9px] font-bold text-zinc-500 uppercase tracking-wider text-left">
                    {lang === 'en' ? 'Select Reciter (Classical Qari)' : 'اختر الرواية والتلاوة المطهرة'}
                  </div>
                  {RECITERS_LIST.map((qari) => {
                    const isSelected = primaryReciter === qari.id;
                    return (
                      <button
                        key={`bottom-qari-opt-${qari.id}`}
                        onClick={() => {
                          stopWholeSurahPlayback();
                          setPrimaryReciter(qari.id);
                          setShowBottomQariDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 hover:bg-zinc-900/80 transition-colors flex items-center justify-between border-0 bg-transparent cursor-pointer ${isSelected ? 'bg-zinc-900' : ''}`}
                      >
                        <div className="min-w-0 pr-2 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[11px] sm:text-xs font-black leading-tight ${isSelected ? 'text-amber-500' : 'text-zinc-200'}`}>
                              {lang === 'en' ? qari.nameEn : qari.nameAr}
                            </span>
                            <span className="text-[8px] font-extrabold bg-[#A37B12]/20 text-[#D4AF37] px-1 rounded uppercase tracking-wider shrink-0 select-none">
                              {lang === 'en' ? qari.tagEn : qari.tagAr}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate mt-1 text-left">
                            {lang === 'en' ? qari.styleEn : qari.styleAr}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Core Player Center actions */}
          <div className="flex items-center gap-3">
            {/* Previous Surah button */}
            <button
              onClick={() => {
                if (selectedSurahNum > 1) {
                  stopWholeSurahPlayback();
                  setSelectedSurahNum(selectedSurahNum - 1);
                }
              }}
              disabled={selectedSurahNum <= 1}
              className="p-1.5 sm:p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed shrink-0 border border-zinc-800"
              title="Previous Surah"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
            </button>

            {/* Core Play/Pause Trigger Button */}
            <button
              onClick={() => {
                if (surahPlayActive) {
                  stopWholeSurahPlayback();
                } else {
                  playWholeSurahConsecutive(0);
                }
              }}
              id="btn-play-full-surah"
              className={`p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-all cursor-pointer scale-110 active:scale-95 shadow-lg border ${
                surahPlayActive 
                  ? 'bg-amber-400 text-zinc-950 font-black hover:bg-amber-300 border-zinc-900' 
                  : 'bg-emerald-600 text-white font-extrabold hover:bg-emerald-500 hover:scale-115 border-zinc-900'
              }`}
              title={surahPlayActive ? "Pause Audio Track" : "Start Audio Recitation"}
            >
              {surahPlayActive ? (
                <Pause className="w-5 h-5 fill-current shrink-0" />
              ) : (
                <Play className="w-5 h-5 fill-current shrink-0" />
              )}
            </button>

            {/* Next Surah button */}
            <button
              onClick={() => {
                if (selectedSurahNum < 114) {
                  stopWholeSurahPlayback();
                  setSelectedSurahNum(selectedSurahNum + 1);
                }
              }}
              disabled={selectedSurahNum >= 114}
              className="p-1.5 sm:p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed shrink-0 border border-zinc-800"
              title="Next Surah"
            >
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Quick ZIP Downloader Link for complete Quran files */}
          <div className="flex items-center gap-2">
            <a
              href={
                primaryReciter === 'ghamadi' ? 'https://download.mp3quran.net/download/s_gmd/s_gmd_complete.zip' :
                primaryReciter === 'sudais' ? 'https://download.mp3quran.net/download/sds/sds_complete.zip' :
                primaryReciter === 'shuraim' ? 'https://download.mp3quran.net/download/shrm/shrm_complete.zip' :
                primaryReciter === 'muaiqly' ? 'https://download.mp3quran.net/download/maher/maher_complete.zip' :
                primaryReciter === 'husary' ? 'https://download.mp3quran.net/download/husr/husr_complete.zip' :
                'https://archive.org/compress/Okasha_Kameny_Full_Quran/formats=VBR%20MP3'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-1.5 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-amber-500 font-extrabold text-[10px] border border-zinc-800 transition"
              title={lang === 'en' ? "Download Complete Offline Quran ZIP" : "تحميل المصحف كاملاً ملف مضغوط"}
            >
              <Cloud className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="hidden md:inline">{lang === 'en' ? "Download Quran ZIP" : "تحميل المصحف كاملاً"}</span>
              <span className="md:hidden">{lang === 'en' ? "ZIP" : "تحميل"}</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
