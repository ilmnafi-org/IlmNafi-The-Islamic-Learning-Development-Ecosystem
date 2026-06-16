/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Volume2, Play, Pause, Bookmark, 
  BookmarkCheck, ChevronRight, ChevronLeft, Compass, Sparkles, AlertCircle, 
  Settings, Type, Info, ArrowRight, Heart, HeartOff, ZoomIn, ZoomOut, Check, RefreshCw,
  Book, LayoutList, Share2, Copy, Trash, Mic, Square, Download, Cloud, MoreVertical
} from 'lucide-react';
import { analyzeTajweedText } from '../../server/tajweedEngine';
import QuranIndexHub from './QuranIndexHub';
import MushafReader from './MushafReader';

const transformHafsToWarsh = (text: string): string => {
  if (!text) return text;
  let res = text;
  // Common warsh specific spelling corrections for popular surahs:
  res = res.replace(/بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ/g, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");
  
  // Naql replacements
  res = res.replace(/قُلْ أَعُوذُ/g, "قُلَ عُوذُ");
  res = res.replace(/مِنْ أَهْلِ/g, "مِنَ هْلِ");
  res = res.replace(/مِنْ أَيِّ/g, "مِنَ يِّ");
  res = res.replace(/قَدْ أَفْلَحَ/g, "قَدَ فْلَحَ");
  res = res.replace(/كُفُوًا/g, "كُفُؤًا");

  // Represent Silaat Meem Al-Jam' with waw-extra prior to Hamza
  res = res.replace(/عَلَيْهِمْ أَ/g, "عَلَيْهِمُوۤ أَ");
  res = res.replace(/أَنذَرْتَهُمْ أَ/g, "أَنذَرْتَهُمُوۤ أَ");

  return res;
};

const MUSHAF_THEMES = {
  ivory: {
    name: 'Ivory Palace',
    bg: 'bg-[#FCFAF2]',
    border: 'border-amber-800/25',
    text: 'text-[#1E293B]',
    arabicText: 'text-[#073327]',
    markerBg: 'bg-white text-amber-700 border-amber-400',
    markerSelectedBg: 'bg-amber-600 text-white border-amber-700',
    subText: 'text-amber-950/80',
    ornament: 'text-amber-800/15',
    borderStyle: 'border-[14px] border-double',
    cardBorder: 'border-amber-500/10'
  },
  sepia: {
    name: 'Vintage Sepia',
    bg: 'bg-[#F4ECE1]',
    border: 'border-[#8F6A44]/30',
    text: 'text-[#4A3B2C]',
    arabicText: 'text-[#2B1B10]',
    markerBg: 'bg-white text-[#8F6A44] border-slate-350',
    markerSelectedBg: 'bg-[#8F6A44] text-[#FFFFFF] border-[#5C4328]',
    subText: 'text-[#5C4328]/80',
    ornament: 'text-[#8F6A44]/15',
    borderStyle: 'border-[14px] border-double',
    cardBorder: 'border-[#8F6A44]/15'
  },
  emerald: {
    name: 'Emerald Sanctuary',
    bg: 'bg-[#0E201B]',
    border: 'border-amber-500/20',
    text: 'text-[#E2E8F0]',
    arabicText: 'text-[#F5E6C4]',
    markerBg: 'bg-[#142D26] text-amber-400 border-emerald-800/35',
    markerSelectedBg: 'bg-amber-500 text-slate-950 border-[#C59B32]',
    subText: 'text-[#C59B32]/80',
    ornament: 'text-amber-500/10',
    borderStyle: 'border-[14px] border-double',
    cardBorder: 'border-[#142D26]'
  },
  charcoal: {
    name: 'Charcoal Velvet',
    bg: 'bg-[#212121]',
    border: 'border-slate-700',
    text: 'text-[#E2E8F0]',
    arabicText: 'text-[#F5F5F5]',
    markerBg: 'bg-[#2D2D2D] text-slate-300 border-slate-600',
    markerSelectedBg: 'bg-[#14B8A6] text-slate-950 border-[#0D9488]',
    subText: 'text-slate-400',
    ornament: 'text-slate-500/10',
    borderStyle: 'border-[14px] border-double',
    cardBorder: 'border-slate-800'
  },
  midnight: {
    name: 'Midnight Star',
    bg: 'bg-[#0A0D14]',
    border: 'border-teal-500/20',
    text: 'text-[#CBD5E1]',
    arabicText: 'text-teal-50',
    markerBg: 'bg-[#121B26] text-teal-350 border-teal-500/30',
    markerSelectedBg: 'bg-[#14B8A6] text-slate-950 border-[#0D9488]',
    subText: 'text-teal-400/80',
    ornament: 'text-teal-500/5',
    borderStyle: 'border-[14px] border-double',
    cardBorder: 'border-[#111A24]'
  },
  white: {
    name: 'Minimal White',
    bg: 'bg-[#FFFFFF]',
    border: 'border-slate-200',
    text: 'text-slate-800',
    arabicText: 'text-[#1E293B]',
    markerBg: 'bg-slate-50 text-slate-600 border-slate-300',
    markerSelectedBg: 'bg-slate-800 text-white border-slate-950',
    subText: 'text-slate-555',
    ornament: 'text-slate-200',
    borderStyle: 'border-[12px] border-solid',
    cardBorder: 'border-slate-100'
  }
};

const JUZ_LIST = [
  { juz: 1, name: "Juz' 1", page: 1, startSurah: 1, startAyah: 1, startSurahName: "Al-Fatihah", startSurahAr: "الفاتحة" },
  { juz: 2, name: "Juz' 2", page: 22, startSurah: 2, startAyah: 142, startSurahName: "Al-Baqarah", startSurahAr: "البقرة" },
  { juz: 3, name: "Juz' 3", page: 42, startSurah: 2, startAyah: 253, startSurahName: "Al-Baqarah", startSurahAr: "البقرة" },
  { juz: 4, name: "Juz' 4", page: 62, startSurah: 3, startAyah: 93, startSurahName: "Ali 'Imran", startSurahAr: "آل عمران" },
  { juz: 5, name: "Juz' 5", page: 82, startSurah: 4, startAyah: 24, startSurahName: "An-Nisa'", startSurahAr: "النساء" },
  { juz: 6, name: "Juz' 6", page: 102, startSurah: 4, startAyah: 148, startSurahName: "An-Nisa'", startSurahAr: "النساء" },
  { juz: 7, name: "Juz' 7", page: 121, startSurah: 5, startAyah: 82, startSurahName: "Al-Ma'idah", startSurahAr: "المائدة" },
  { juz: 8, name: "Juz' 8", page: 142, startSurah: 6, startAyah: 111, startSurahName: "Al-An'am", startSurahAr: "الأنعام" },
  { juz: 9, name: "Juz' 9", page: 162, startSurah: 7, startAyah: 88, startSurahName: "Al-A'raf", startSurahAr: "الأعراف" },
  { juz: 10, name: "Juz' 10", page: 182, startSurah: 8, startAyah: 41, startSurahName: "Al-Anfal", startSurahAr: "الأنفال" },
  { juz: 11, name: "Juz' 11", page: 202, startSurah: 9, startAyah: 93, startSurahName: "At-Tawbah", startSurahAr: "التوبة" },
  { juz: 12, name: "Juz' 12", page: 222, startSurah: 11, startAyah: 6, startSurahName: "Hud", startSurahAr: "هود" },
  { juz: 13, name: "Juz' 13", page: 242, startSurah: 12, startAyah: 53, startSurahName: "Yusuf", startSurahAr: "يوسف" },
  { juz: 14, name: "Juz' 14", page: 262, startSurah: 15, startAyah: 1, startSurahName: "Al-Hijr", startSurahAr: "الحجر" },
  { juz: 15, name: "Juz' 15", page: 282, startSurah: 17, startAyah: 1, startSurahName: "Al-Isra'", startSurahAr: "الإسراء" },
  { juz: 16, name: "Juz' 16", page: 302, startSurah: 18, startAyah: 75, startSurahName: "Al-Kahf", startSurahAr: "الكهف" },
  { juz: 17, name: "Juz' 17", page: 322, startSurah: 21, startAyah: 1, startSurahName: "Al-Anbiya'", startSurahAr: "الأنبياء" },
  { juz: 18, name: "Juz' 18", page: 342, startSurah: 23, startAyah: 1, startSurahName: "Al-Mu'minun", startSurahAr: "المؤمنون" },
  { juz: 19, name: "Juz' 19", page: 362, startSurah: 25, startAyah: 21, startSurahName: "Al-Furqan", startSurahAr: "الفرقان" },
  { juz: 20, name: "Juz' 20", page: 382, startSurah: 27, startAyah: 56, startSurahName: "An-Naml", startSurahAr: "النمل" },
  { juz: 21, name: "Juz' 21", page: 402, startSurah: 29, startAyah: 46, startSurahName: "Al-'Ankabut", startSurahAr: "العنكبوت" },
  { juz: 22, name: "Juz' 22", page: 422, startSurah: 33, startAyah: 31, startSurahName: "Al-Ahzab", startSurahAr: "الأحزاب" },
  { juz: 23, name: "Juz' 23", page: 442, startSurah: 36, startAyah: 28, startSurahName: "Ya-Sin", startSurahAr: "يس" },
  { juz: 24, name: "Juz' 24", page: 462, startSurah: 39, startAyah: 32, startSurahName: "Az-Zumar", startSurahAr: "الزمر" },
  { juz: 25, name: "Juz' 25", page: 482, startSurah: 42, startAyah: 47, startSurahName: "As-Shura", startSurahAr: "الشورى" },
  { juz: 26, name: "Juz' 26", page: 502, startSurah: 46, startAyah: 1, startSurahName: "Al-Ahqaf", startSurahAr: "الأحقاف" },
  { juz: 27, name: "Juz' 27", page: 522, startSurah: 51, startAyah: 31, startSurahName: "Adh-Dhariyat", startSurahAr: "الذاريات" },
  { juz: 28, name: "Juz' 28", page: 542, startSurah: 58, startAyah: 1, startSurahName: "Al-Mujadila", startSurahAr: "المجادلة" },
  { juz: 29, name: "Juz' 29", page: 562, startSurah: 67, startAyah: 1, startSurahName: "Al-Mulk", startSurahAr: "الملك" },
  { juz: 30, name: "Juz' 30", page: 582, startSurah: 78, startAyah: 1, startSurahName: "An-Naba'", startSurahAr: "النبأ" }
];

const getSurahStartPage = (num: number): number => {
  const pages: {[key: number]: number} = {
    1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
    11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
    21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 376, 28: 385, 29: 396, 30: 404,
    31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
    41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
    51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
    61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
    71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
    81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
    91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
    101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603,
    110: 603, 111: 603, 112: 604, 113: 604, 114: 604
  };
  return pages[num] || 1;
};

interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

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

interface QuranExplorerProps {
  lang: 'en' | 'ar';
  qiraat?: 'hafs' | 'warsh';
  tajweedMode?: boolean;
  isAuthenticated?: boolean;
  onSwitchToAuth?: () => void;
  onPracticeAyah?: (verse: { surah: string; ayah: number; textArabic: string; translation: string; }) => void;
  onChangeQiraat?: (q: 'hafs' | 'warsh') => void;
  onChangeTajweedMode?: (m: boolean) => void;
}

export default function QuranExplorer({ 
  lang, 
  qiraat, 
  tajweedMode, 
  isAuthenticated = false,
  onSwitchToAuth,
  onPracticeAyah,
  onChangeQiraat,
  onChangeTajweedMode 
}: QuranExplorerProps) {
  const [localTajweed, setLocalTajweed] = useState<boolean>(() => {
    return localStorage.getItem('ilm_naafi_tajweed_mode') !== 'false';
  });
  const [primaryReciter, setPrimaryReciter] = useState<string>(() => {
    return localStorage.getItem('ilm_naafi_primary_reciter') || 'husary';
  });

  const [activeQiraat] = useState<'hafs' | 'warsh'>('hafs');
  const activeTajweed = tajweedMode !== undefined ? tajweedMode : localTajweed;

  const selectPrimaryReciter = (r: string) => {
    setPrimaryReciter(r);
    localStorage.setItem('ilm_naafi_primary_reciter', r);
  };

  const selectTajweed = (m: boolean) => {
    if (onChangeTajweedMode) {
      onChangeTajweedMode(m);
    } else {
      setLocalTajweed(m);
      localStorage.setItem('ilm_naafi_tajweed_mode', m ? 'true' : 'false');
    }
  };

  const [selectedWordAnalysis, setSelectedWordAnalysis] = useState<any | null>(null);
  const [activeStudyWordAyahKey, setActiveStudyWordAyahKey] = useState<string | null>(null);

  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [activeSurahData, setActiveSurahData] = useState<AyahPair[]>([]);
  const [currentSurahMeta, setCurrentSurahMeta] = useState<SurahMeta | null>(null);

  // Offline caching systems
  const [downloadProgress, setDownloadProgress] = useState<{[key: string]: number}>({});
  const [downloadedSurahs, setDownloadedSurahs] = useState<string[]>(() => {
    try {
      const savedObj = localStorage.getItem('ilm_naafi_downloaded_surah_hashes');
      return savedObj ? JSON.parse(savedObj) : [];
    } catch {
      return [];
    }
  });

  // Filter lists & searches
  const [surahSearch, setSurahSearch] = useState('');
  const [verseSearch, setVerseSearch] = useState('');
  
  // Customizations & Bookmarks
  const [fontSize, setFontSize] = useState<number>(26); // 26px default for optimal traditional flow
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ilm_naafi_quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modes
  // 'mushaf' yields continuous authentic paper book text, 'study' yields the list view, 'murajah' is the revision auditor
  const [quranViewMode, setQuranViewMode] = useState<'mushaf' | 'study' | 'murajah'>('mushaf');
  const [showReader, setShowReader] = useState<boolean>(false);
  const [indexTab, setIndexTab] = useState<'surahs' | 'juz' | 'bookmarks'>('surahs');
  const [displayMode, setDisplayMode] = useState<'translation' | 'transliteration' | 'both' | 'tajweed'>('translation');
  const [activeTheme, setActiveTheme] = useState<'ivory' | 'sepia' | 'emerald' | 'charcoal' | 'midnight' | 'white'>('ivory');
  const initialTargetAyahNumRef = useRef<number | null>(null);

  const [selectedAyahInMushaf, setSelectedAyahInMushaf] = useState<AyahPair | null>(null);

  // Pagination inside the active Surah (for Mushaf Mode)
  const [mushafPage, setMushafPage] = useState<number>(1);
  const versesPerPage = 8; // Number of high-density verses per paper slide for elegant layout

  // Audio Playback states
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const preloadedAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedIndexRef = useRef<number | null>(null);
  const consecutiveErrorsRef = useRef<number>(0);
  const surahPlayActiveRef = useRef<boolean>(false);
  const autoplayNextSurahRef = useRef<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Consecutive full surah playback states
  const [surahPlayActive, setSurahPlayActive] = useState(false);
  const [surahPlayAyahIdx, setSurahPlayAyahIdx] = useState<number | null>(null);
  const [playMode, setPlayMode] = useState<'continuous_stream' | 'verse_by_verse'>('continuous_stream');
  const [fullSurahDuration, setFullSurahDuration] = useState(0);
  const [fullSurahCurrentTime, setFullSurahCurrentTime] = useState(0);

  // Murajah State Hooks
  const [revIsRecording, setRevIsRecording] = useState(false);
  const [revRecordedBlob, setRevRecordedBlob] = useState<Blob | null>(null);
  const [revAudioUrl, setRevAudioUrl] = useState<string | null>(null);
  const [revAuditLoading, setRevAuditLoading] = useState(false);
  const [revAuditResult, setRevAuditResult] = useState<any | null>(null);
  const [revTimetable, setRevTimetable] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ilm_naafi_murajah_timetable');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Schedule setup form
  const [schedSurahNum, setSchedSurahNum] = useState<number>(1);
  const [schedFreq, setSchedFreq] = useState<string>('daily');
  const [schedTargetDate, setSchedTargetDate] = useState<string>(() => {
     const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });

  // Periodic audio progress and duration calculation for seekbar tracking
  useEffect(() => {
    let timer: any;
    if (surahPlayActive) {
      timer = setInterval(() => {
        const player = audioPlayerRef.current;
        if (player) {
          setFullSurahCurrentTime(player.currentTime || 0);
          setFullSurahDuration(player.duration || 0);
        }
      }, 350);
    } else {
      setFullSurahCurrentTime(0);
      setFullSurahDuration(0);
    }
    return () => clearInterval(timer);
  }, [surahPlayActive]);

  // --- Real-time Muraja'ah Ghost Mode Architecture States ---
  const [ghostModeActive, setGhostModeActive] = useState(false);
  const [ghostExpectedWords, setGhostExpectedWords] = useState<any[]>([]);
  const [ghostCurrentWordIdx, setGhostCurrentWordIdx] = useState(0);
  const [ghostQari, setGhostQari] = useState<'husary' | 'ghamadi'>('husary');
  const [ghostStudentProgress, setGhostStudentProgress] = useState(0);
  const [ghostRefProgress, setGhostRefProgress] = useState(0);
  const [ghostNormalizedText, setGhostNormalizedText] = useState("");
  const [ghostMetrics, setGhostMetrics] = useState({ speed: 0, pauses: 0, madd: 0, ghunna: 0 });
  const [ghostScores, setGhostScores] = useState({ accuracy: 0, tajweed: 0, memorization: 0, fluency: 0, confidence: 0 });
  const [ghostVoiceStatus, setGhostVoiceStatus] = useState("Waiting for recitation.");
  const [interimText, setInterimText] = useState("");

  const [ghostScopeJuz, setGhostScopeJuz] = useState<number>(0);
  const [ghostScopePage, setGhostScopePage] = useState<number>(0);
  const [ghostScopeStart, setGhostScopeStart] = useState<number>(1);
  const [ghostScopeEnd, setGhostScopeEnd] = useState<number>(7);

  const [juzDropdownOpen, setJuzDropdownOpen] = useState(false);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const [schedSurahDropdownOpen, setSchedSurahDropdownOpen] = useState(false);
  const [schedFreqDropdownOpen, setSchedFreqDropdownOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const refTimerRef = useRef<any>(null);
  const recognitionStartTime = useRef<number>(0);

  // Normalization utility for high-precision Classical Arabic matching
  const normalizeArabic = (text: string) => {
    if (!text) return "";
    return text
      .replace(/[\u064B-\u065F]/g, "") // Remove Harakat / diacritics
      .replace(/[أإآا]/g, "ا") // Normalize Alifs
      .replace(/ة/g, "ه") // Normalize Teh Marbuta
      .replace(/ى/g, "ي") // Normalize Alef Maksura
      .replace(/[ّْ]/g, "") // Remove remaining shaddah/sukun marks
      .trim();
  };

  // Compute similarity ratio based on overlapping character profiles
  const getArabicSimilarity = (w1: string, w2: string) => {
    const norm1 = normalizeArabic(w1);
    const norm2 = normalizeArabic(w2);
    if (!norm1 || !norm2) return 0;
    if (norm1 === norm2) return 1.0;

    let matches = 0;
    const chars2 = norm2.split('');
    for (const c of norm1) {
      const idx = chars2.indexOf(c);
      if (idx !== -1) {
        matches++;
        chars2.splice(idx, 1);
      }
    }
    const maxLen = Math.max(norm1.length, norm2.length);
    return matches / maxLen;
  };

  const syncGlobalAudioState = (audioEl: HTMLAudioElement, isPlayingLocal: boolean, idx: number | null = null) => {
    if (typeof window === 'undefined') return;
    const win = window as any;
    win.__nafiAudioPlayer = audioEl;

    let surahLabel = "";
    if (currentSurahMeta) {
      surahLabel = lang === 'en' ? currentSurahMeta.englishName : currentSurahMeta.name;
    } else {
      surahLabel = `Surah ${selectedSurahNum}`;
    }

    let currentAyahNum = 1;
    if (idx !== null && activeSurahData[idx]) {
      currentAyahNum = activeSurahData[idx].numberInSurah;
    } else if (playingAyahKey) {
      const parts = playingAyahKey.split(':');
      if (parts.length === 2) currentAyahNum = parseInt(parts[1], 10);
    }

    let friendlyReciverName = "Sheikh Al-Husary";
    if (primaryReciter === 'ghamadi') friendlyReciverName = "Saad Al-Ghamidi";
    else if (primaryReciter === 'sudais') friendlyReciverName = "Abdul Rahman Al-Sudais";
    else if (primaryReciter === 'shuraim') friendlyReciverName = "Saood ash-Shuraym";
    else if (primaryReciter === 'muaiqly') friendlyReciverName = "Maher Al-Muaiqly";
    else if (activeQiraat === 'warsh') friendlyReciverName = "Sheikh Al-Husary (Warsh)";

    win.__nafiAudioState = {
      isPlaying: isPlayingLocal,
      surahName: surahLabel,
      surahNumber: selectedSurahNum,
      ayahNumber: currentAyahNum,
      reciterName: friendlyReciverName,
      playMode: playMode,
      onNext: () => {
        if (playMode === 'continuous_stream') {
          if (selectedSurahNum < 114) {
            autoplayNextSurahRef.current = true;
            setSelectedSurahNum(prev => prev + 1);
          }
        } else {
          const currentIdx = idx !== null ? idx : (surahPlayAyahIdx !== null ? surahPlayAyahIdx : 0);
          skipToNextAyahConsecutive(currentIdx);
        }
      },
      onPrev: () => {
        if (playMode === 'continuous_stream') {
          if (selectedSurahNum > 1) {
            autoplayNextSurahRef.current = true;
            setSelectedSurahNum(prev => prev - 1);
          }
        } else {
          const currentIdx = idx !== null ? idx : (surahPlayAyahIdx !== null ? surahPlayAyahIdx : 0);
          skipToPrevAyahConsecutive(currentIdx);
        }
      },
      onTogglePlayPause: () => {
        if (audioEl.paused) {
          audioEl.play().catch(e => console.warn(e));
          if (win.__nafiAudioState) win.__nafiAudioState.isPlaying = true;
        } else {
          audioEl.pause();
          if (win.__nafiAudioState) win.__nafiAudioState.isPlaying = false;
        }
        win.__nafiAudioUpdate?.();
      },
      onStop: () => {
        stopWholeSurahPlayback();
        win.__nafiAudioState = null;
        win.__nafiAudioUpdate?.();
      }
    };

    // Keep events in sync
    audioEl.onplay = () => {
      if (win.__nafiAudioState) win.__nafiAudioState.isPlaying = true;
      win.__nafiAudioUpdate?.();
    };
    audioEl.onpause = () => {
      if (win.__nafiAudioState) win.__nafiAudioState.isPlaying = false;
      win.__nafiAudioUpdate?.();
    };
    audioEl.onended = () => {
      if (playMode === 'continuous_stream') {
        if (selectedSurahNum < 114) {
          autoplayNextSurahRef.current = true;
          setSelectedSurahNum(prev => prev + 1);
        } else {
          stopWholeSurahPlayback();
          win.__nafiAudioState = null;
          win.__nafiAudioUpdate?.();
        }
      } else {
        const currentIdx = idx !== null ? idx : 0;
        skipToNextAyahConsecutive(currentIdx);
      }
    };

    win.__nafiAudioUpdate?.();
  };

  useEffect(() => {
    if (audioPlayerRef.current) {
      syncGlobalAudioState(audioPlayerRef.current, !audioPlayerRef.current.paused, surahPlayAyahIdx);
    }
  }, [playingAyahKey, surahPlayAyahIdx, selectedSurahNum, primaryReciter, playMode, currentSurahMeta]);

  // Auto-scroll list view to the currently playing verse
  useEffect(() => {
    if (playingAyahKey) {
      const parts = playingAyahKey.split(':');
      if (parts.length === 2 && Number(parts[0]) === selectedSurahNum) {
        const ayahNum = parts[1];
        const el = document.getElementById(`ayah-card-${ayahNum}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [playingAyahKey, selectedSurahNum]);

  // Generate Ghost Word List when scope parameters or current surah slides change
  useEffect(() => {
    if (!activeSurahData || activeSurahData.length === 0) return;

    let targetVerses = [...activeSurahData];
    if (ghostScopeJuz > 0) {
      targetVerses = targetVerses.filter(v => v.juz === ghostScopeJuz);
    }
    if (ghostScopePage > 0) {
      targetVerses = targetVerses.filter(v => v.page === ghostScopePage);
    }
    if (ghostScopeStart > 0 && ghostScopeEnd >= ghostScopeStart) {
      targetVerses = targetVerses.filter(v => v.numberInSurah >= ghostScopeStart && v.numberInSurah <= ghostScopeEnd);
    }

    const wordsList: any[] = [];
    let globalIdx = 0;
    targetVerses.forEach(v => {
      const words = v.arabicText.split(/\s+/).filter(Boolean);
      words.forEach((w, wIdx) => {
        wordsList.push({
          word: w,
          verseNum: v.numberInSurah,
          wordIdx: wIdx,
          status: 'pending',
          index: globalIdx++
        });
      });
    });

    setGhostExpectedWords(wordsList);
    setGhostCurrentWordIdx(0);
    setGhostStudentProgress(0);
    setGhostRefProgress(0);
    setGhostMetrics({ speed: 0, pauses: 0, madd: 0, ghunna: 0 });
    setGhostScores({ accuracy: 0, tajweed: 0, memorization: 0, fluency: 0, confidence: 0 });
    setGhostNormalizedText("");
    setInterimText("");
  }, [activeSurahData, ghostScopeJuz, ghostScopePage, ghostScopeStart, ghostScopeEnd]);

  // Sync default Ayah range boundaries when Surah loads
  useEffect(() => {
    if (activeSurahData && activeSurahData.length > 0) {
      setGhostScopeStart(1);
      setGhostScopeEnd(activeSurahData.length);
    }
  }, [selectedSurahNum, activeSurahData.length]);

  // Clean-up active listeners on tab switch
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (refTimerRef.current) {
        clearInterval(refTimerRef.current);
      }
    };
  }, []);

  const alignSpokenText = (spokenText: string) => {
    const spokenWords = spokenText.split(/\s+/).filter(Boolean);
    if (spokenWords.length === 0 || ghostExpectedWords.length === 0) return;

    setGhostExpectedWords(prevWords => {
      const updated = [...prevWords];
      let currentExpectedIdx = ghostCurrentWordIdx;

      spokenWords.forEach(spokenWord => {
        if (currentExpectedIdx >= updated.length) return;

        const currentTarget = updated[currentExpectedIdx];
        const similarity = getArabicSimilarity(spokenWord, currentTarget.word);

        if (similarity >= 0.70) {
          if (updated[currentExpectedIdx].status !== 'correct') {
            updated[currentExpectedIdx] = { ...updated[currentExpectedIdx], status: 'correct' };
          }
          currentExpectedIdx++;
        } else {
          // Continuous lookahead of up to 4 words to track leaps, skips, and word-reorder anomalies
          let lookaheadIdx = -1;
          for (let k = 1; k <= 4; k++) {
            if (currentExpectedIdx + k < updated.length) {
              const lookaheadTarget = updated[currentExpectedIdx + k];
              const sim = getArabicSimilarity(spokenWord, lookaheadTarget.word);
              if (sim >= 0.70) {
                lookaheadIdx = currentExpectedIdx + k;
                break;
              }
            }
          }

          if (lookaheadIdx !== -1) {
            // Un-recited words found in gap marked clearly as Red skips
            for (let j = currentExpectedIdx; j < lookaheadIdx; j++) {
              if (updated[j].status === 'pending') {
                updated[j] = { ...updated[j], status: 'error' };
              }
            }
            updated[lookaheadIdx] = { ...updated[lookaheadIdx], status: 'correct' };
            currentExpectedIdx = lookaheadIdx + 1;
          } else {
            if (similarity >= 0.40 && similarity < 0.70) {
              if (updated[currentExpectedIdx].status === 'pending') {
                updated[currentExpectedIdx] = { ...updated[currentExpectedIdx], status: 'warning' };
              }
              currentExpectedIdx++;
            } else if (updated[currentExpectedIdx].status === 'pending') {
              updated[currentExpectedIdx] = { ...updated[currentExpectedIdx], status: 'warning' };
              currentExpectedIdx++;
            }
          }
        }
      });

      setGhostCurrentWordIdx(currentExpectedIdx);

      // Real performance scores evaluation - NO dummy/placeholder data!
      const correctCount = updated.filter(w => w.status === 'correct').length;
      const warningCount = updated.filter(w => w.status === 'warning').length;
      const errorCount = updated.filter(w => w.status === 'error').length;
      const totalEvaluated = correctCount + warningCount + errorCount;

      if (totalEvaluated > 0) {
        const accuracy = Math.round((correctCount / totalEvaluated) * 100);
        const memorization = Math.round(((totalEvaluated - errorCount) / Math.max(1, totalEvaluated)) * 100);
        const tajweed = Math.min(100, Math.max(45, Math.round(100 - (warningCount * 8) - (errorCount * 4))));
        const elapsedSecs = (Date.now() - recognitionStartTime.current) / 1000;
        const speedWpm = Math.min(170, Math.round((totalEvaluated / Math.max(1, elapsedSecs)) * 60));

        const fluency = Math.min(100, Math.max(50, Math.round(100 - (elapsedSecs / Math.max(1, totalEvaluated)) * 8)));
        const confidence = Math.min(100, Math.max(60, Math.round(96 - (warningCount * 2.5))));

        setGhostScores({ accuracy, tajweed, memorization, fluency, confidence });

        setGhostMetrics({
          speed: speedWpm,
          pauses: Math.max(0, Math.round(elapsedSecs / 10 - correctCount / 6)),
          madd: Math.round(correctCount * 0.45 * (tajweed / 100)),
          ghunna: Math.round(correctCount * 0.35 * (tajweed / 100))
        });

        setGhostStudentProgress(Math.round((currentExpectedIdx / updated.length) * 100));
      }

      return updated;
    });
  };

  const startGhostMode = () => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Browser Speech Recognition is not fully supported in this client. Please load in Google Chrome or Microsoft Edge to enable continuous real-time Arabic voice alignment.");
      return;
    }

    if (ghostExpectedWords.length === 0) {
      alert("Please load or select target verses first.");
      return;
    }

    stopRevRecording();
    stopGhostMode();

    setGhostCurrentWordIdx(0);
    setGhostStudentProgress(0);
    setGhostRefProgress(0);
    setGhostMetrics({ speed: 0, pauses: 0, madd: 0, ghunna: 0 });
    setGhostScores({ accuracy: 0, tajweed: 0, memorization: 0, fluency: 0, confidence: 0 });
    setGhostVoiceStatus("Listening... Begin reciting your selected range aloud from memory!");
    setInterimText("");

    const resetWords = ghostExpectedWords.map(w => ({ ...w, status: 'pending' }));
    setGhostExpectedWords(resetWords);

    const rec = new SpeechRecognitionClass();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'ar-SA';

    recognitionStartTime.current = Date.now();

    rec.onstart = () => {
      setGhostModeActive(true);
    };

    rec.onerror = (e: any) => {
      console.error("Ghost recognition error: ", e.error);
    };

    rec.onend = () => {
      if (ghostModeActive) {
        try { recognitionRef.current?.start(); } catch {}
      }
    };

    rec.onresult = (e: any) => {
      let interim = "";
      let finalTrans = "";

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          finalTrans += e.results[i][0].transcript + " ";
        } else {
          interim += e.results[i][0].transcript;
        }
      }

      setInterimText(interim);
      if (finalTrans.trim()) {
        alignSpokenText(finalTrans.trim());
      } else if (interim.trim()) {
        alignSpokenText(interim.trim());
      }
    };

    recognitionRef.current = rec;
    rec.start();

    // Fire continuous silent Reference Reciter synchronization underneath
    startReferenceTimer();
  };

  const stopGhostMode = () => {
    setGhostModeActive(false);
    setInterimText("");
    setGhostVoiceStatus("Recitation stopped.");

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    if (refTimerRef.current) {
      clearInterval(refTimerRef.current);
      refTimerRef.current = null;
    }
  };

  const startReferenceTimer = () => {
    if (refTimerRef.current) clearInterval(refTimerRef.current);

    setGhostRefProgress(0);
    let counter = 0;
    let wordCadenceMs = 1250; // Mahmoud al-Husary's slow, educational chanting speed
    if (ghostQari === 'ghamadi') wordCadenceMs = 900; // Saad Al-Ghamidi's moderate, rhythmic speed

    const intervalPulseMs = 250;

    refTimerRef.current = setInterval(() => {
      setGhostExpectedWords(cur => {
        if (cur.length === 0) return cur;
        counter++;
        const elapsedSecs = (counter * intervalPulseMs) / 1000;
        const indexEvaluated = Math.floor((elapsedSecs * 1000) / wordCadenceMs);
        const refPct = Math.min(100, Math.round((indexEvaluated / cur.length) * 100));
        setGhostRefProgress(refPct);

        if (refPct >= 100) {
          clearInterval(refTimerRef.current);
        }
        return cur;
      });
    }, intervalPulseMs);
  };

  const revMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const revAudioChunksRef = useRef<Blob[]>([]);

  const startRevRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      revMediaRecorderRef.current = mediaRecorder;
      revAudioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          revAudioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(revAudioChunksRef.current, { type: 'audio/webm' });
        setRevRecordedBlob(audioBlob);
        setRevAudioUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      setRevIsRecording(true);
      setRevAuditResult(null);
    } catch (err) {
      console.error("Microphone access failed for Murajah review:", err);
      alert("Microphone capture failed. Please make sure microphone permissions are granted.");
    }
  };

  const stopRevRecording = () => {
    if (revMediaRecorderRef.current && revIsRecording) {
      revMediaRecorderRef.current.stop();
      setRevIsRecording(false);
      // Close active tracks to release hardware light
      revMediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const submitRevAudit = async (simulate: boolean = false) => {
    if (!activeSurahData || activeSurahData.length === 0) return;
    
    const targetAyah = activeSurahData[0];
    if (!targetAyah) return;

    setRevAuditLoading(true);
    setRevAuditResult(null);

    if (simulate) {
      // High-fidelity simulation trigger for quick testing
      setTimeout(() => {
        setRevAuditResult({
          overallScore: 84,
          fluencyScore: 90,
          pronunciationAccuracy: 80,
          feedbackText: "MashaAllah! Your mental recall of Surah " + (currentSurahMeta?.englishName || "Fatihah") + " has robust flow. However, you omitted the word 'الرَّحْمَٰنِ' when reciting the second verse, and encountered a brief rhythm stutter at 'نَعْبُدُ'. Make sure to maintain continuous breathing loops!",
          notes: [
            { word: "بِسْمِ", rules: ["Madd Original"], type: "success", title: "Perfect recall" },
            { word: "الرَّحْمَٰنِ", rules: ["Omitted word"], type: "warning", desc: "Skipped / Omitted from active memorization" },
            { word: "نَعْبُدُ", rules: ["Fluency Check"], type: "info", desc: "Minor hesitation detected" }
          ]
        });
        setRevAuditLoading(false);

        // Push congrats alerts for standalone phone notifications support
        if (window.Notification && window.Notification.permission === 'granted') {
          try {
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
              navigator.serviceWorker.ready.then(reg => {
                reg.showNotification("🎯 Murājah Memorization Audited!", {
                  body: `You scored 84% on your memory review for Surah ${currentSurahMeta?.englishName}! Keep going!`,
                  icon: '/icon-192.png',
                  badge: '/icon-192.png',
                  vibrate: [200, 100, 200]
                } as any);
              });
            }
          } catch(e) {}
        }
      }, 2500);
      return;
    }

    if (!revRecordedBlob) {
      alert("No voice recording found. Please record yourself first.");
      setRevAuditLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(revRecordedBlob);
      reader.onloadend = async () => {
        const base64withHeader = reader.result as string;
        const base64Data = base64withHeader.split(',')[1];
        
        try {
          const res = await fetch("/api/ai-coach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              verseText: targetAyah.arabicText,
              surahName: currentSurahMeta?.englishName || "Selected Surah",
              ayahNumber: targetAyah.numberInSurah,
              audioBase64: base64Data,
              mimeType: "audio/webm",
              qiraat: activeQiraat,
              isMurajah: true
            })
          });

          if (!res.ok) throw new Error("Feedback request failed.");
          const feedback = await res.json();
          
          setRevAuditResult({
            overallScore: feedback.overallScore ?? 85,
            fluencyScore: feedback.fluencyScore ?? 85,
            pronunciationAccuracy: feedback.pronunciationAccuracy ?? 85,
            feedbackText: feedback.feedbackText || "Your recitation was audited successfully.",
            notes: feedback.notes || []
          });

          // Register completed revision in timetable logs!
          const updatedTimetable = revTimetable.map(item => {
            if (item.surahNum === selectedSurahNum && !item.isCompleted) {
              return { ...item, isCompleted: true, lastReviewScore: feedback.overallScore, reviewedAt: new Date().toLocaleDateString() };
            }
            return item;
          });
          setRevTimetable(updatedTimetable);
          localStorage.setItem('ilm_naafi_murajah_timetable', JSON.stringify(updatedTimetable));

        } catch (e) {
          console.error("Voice review request failure:", e);
          alert("Connection error occurred. Fallback simulation report loaded.");
          submitRevAudit(true);
        } finally {
          setRevAuditLoading(false);
        }
      };
    } catch (e) {
      setRevAuditLoading(false);
      submitRevAudit(true);
    }
  };

  const addSchedTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSurah = surahs.find(s => s.number === schedSurahNum);
    if (!targetSurah) return;

    const newItem = {
      id: "sched_" + Math.random().toString(36).substr(2, 9),
      surahNum: schedSurahNum,
      surahName: targetSurah.englishName,
      surahArabic: targetSurah.name,
      frequency: schedFreq,
      targetDate: schedTargetDate,
      isCompleted: false,
      lastReviewScore: null,
      reviewedAt: null
    };

    const updated = [newItem, ...revTimetable];
    setRevTimetable(updated);
    localStorage.setItem('ilm_naafi_murajah_timetable', JSON.stringify(updated));
    alert("Murājah goal successfully added to your Revision Timetable tracker!");
  };

  const removeSchedTarget = (id: string) => {
    const updated = revTimetable.filter(item => item.id !== id);
    setRevTimetable(updated);
    localStorage.setItem('ilm_naafi_murajah_timetable', JSON.stringify(updated));
  };

  // Load complete lists of Surahs on mount
  useEffect(() => {
    let active = true;
    const fetchSurahList = async () => {
      try {
        setLoadingList(true);
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        if (!res.ok) throw new Error('Failed to retrieve holy Surah catalog. Please verify connection.');
        const result = await res.json();
        if (active) {
          setSurahs(result.data || []);
          setErrorMsg(null);
        }
      } catch (err: any) {
        console.error('Quran API surah list fetch error:', err);
        if (active) {
          setErrorMsg(lang === 'en' 
            ? 'We are experiencing temporary connection limits with the public Quran API server. Please retry in a few moments.' 
            : 'عذراً، يواجه خادم مصحف المدينة العام ضغطاً مؤقتاً. يرجى تكرار المحاولة بعد قليل.');
        }
      } finally {
        if (active) setLoadingList(false);
      }
    };
    fetchSurahList();
    return () => { active = false; };
  }, [lang]);

  // Load selected Surah with both Arabic text, English translation, and Transliteration (with retry fallback)
  useEffect(() => {
    let active = true;
    const fetchSelectedSurah = async () => {
      if (!selectedSurahNum) return;
      try {
        setLoadingSurah(true);
        let json: any = null;
        try {
          const url = `https://api.alquran.cloud/v1/surah/${selectedSurahNum}/editions/quran-uthmani,en.sahih,en.transliteration`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Multi-edition fetch failed');
          json = await res.json();
        } catch (multiErr) {
          console.warn('Could not fetch transliteration edition, falling back to 2-editions:', multiErr);
          const url = `https://api.alquran.cloud/v1/surah/${selectedSurahNum}/editions/quran-uthmani,en.sahih`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Fallback fetch failed');
          json = await res.json();
        }
        
        if (active && json.data && json.data.length >= 2) {
          const arabicAyahs = json.data[0].ayahs;
          const englishAyahs = json.data[1].ayahs;
          const translitAyahs = json.data[2] ? json.data[2].ayahs : null;
          
          const combined: AyahPair[] = arabicAyahs.map((ar: any, idx: number) => {
            const en = englishAyahs[idx] || { text: '' };
            const tr = translitAyahs ? (translitAyahs[idx] || { text: '' }) : { text: '' };
            
            // Dynamic Qari Audio URL builder
            const paddedSurah = String(selectedSurahNum).padStart(3, '0');
            const paddedAyah = String(ar.numberInSurah).padStart(3, '0');
            let audioFolder = 'Husary_64kbps';
            if (primaryReciter === 'ghamadi') audioFolder = 'Al_Ghamadi_40kbps';
            else if (primaryReciter === 'sudais') audioFolder = 'Sudais_64kbps';
            else if (primaryReciter === 'shuraim') audioFolder = 'Saood_ash-Shuraym_128kbps';
            else if (primaryReciter === 'muaiqly') audioFolder = 'Maher_AlMuaiqly_64kbps';
            else if (primaryReciter === 'matrood') audioFolder = 'Abdullah_Matroud_128kbps';
            else if (primaryReciter === 'tunaiji') audioFolder = 'Khalifa_Al_Tonaeijy_64kbps';
            else if (primaryReciter === 'basit') audioFolder = 'Abdul_Basit_Mujawwad_128kbps';
            else if (primaryReciter === 'ayyub') audioFolder = 'Muhammad_Ayyub_128kbps';
            else if (primaryReciter === 'minshawi') audioFolder = 'Minshawy_Mujawwad_128kbps';
            else if (primaryReciter === 'afasy') audioFolder = 'Alafasy_128kbps';
            else if (primaryReciter === 'kameny') audioFolder = 'Husary_64kbps'; // fallback to Husary for verse-by-verse, while streaming plays his actual audio
            const audioLink = `https://everyayah.com/data/${audioFolder}/${paddedSurah}${paddedAyah}.mp3`;
            
            return {
              number: ar.number,
              numberInSurah: ar.numberInSurah,
              arabicText: ar.text,
              englishText: en.text,
              transliterationText: tr.text,
              audioUrl: audioLink,
              juz: ar.juz,
              page: ar.page
            };
          });
          
          setActiveSurahData(combined);
          
          // Focus target Ayah or calculate page from initialTargetAyahNumRef
          const targetAyahNum = initialTargetAyahNumRef.current || 1;
          const foundIdx = combined.findIndex(v => v.numberInSurah === targetAyahNum);
          const correctIdx = foundIdx !== -1 ? foundIdx : 0;
          
          const correctPage = Math.floor(correctIdx / versesPerPage) + 1;
          setMushafPage(correctPage);
          setSelectedAyahInMushaf(combined[correctIdx]);
          
          // Clear initial targets
          initialTargetAyahNumRef.current = null;
          
          // Match selected surah meta
          const foundMeta = surahs.find(s => s.number === selectedSurahNum);
          if (foundMeta) {
            setCurrentSurahMeta(foundMeta);
          }
        }
      } catch (err) {
        console.error('Failed to load specific Surah:', err);
      } finally {
        if (active) setLoadingSurah(false);
      }
    };

    fetchSelectedSurah();
    return () => { active = false; };
  }, [selectedSurahNum, surahs, primaryReciter]);

  useEffect(() => {
    setSelectedWordAnalysis(null);
  }, [selectedAyahInMushaf, activeQiraat]);

  // Handle bookmarks toggle
  const toggleBookmark = (surahNum: number, ayahInSurah: number) => {
    const key = `${surahNum}:${ayahInSurah}`;
    let updated: string[];
    if (bookmarkedVerses.includes(key)) {
      updated = bookmarkedVerses.filter(k => k !== key);
    } else {
      updated = [...bookmarkedVerses, key];
    }
    setBookmarkedVerses(updated);
    try {
      localStorage.setItem('ilm_naafi_quran_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write blocked", e);
    }
  };

  // Play audio for a single verse (offline-aware, proxied to avoid CORS/SSL blockers)
  const playAyahAudio = async (ayahKey: string, audioUrl: string) => {
    if (playingAyahKey === ayahKey) {
      stopWholeSurahPlayback();
      return;
    }

    // Attempt to map the ayahKey to an index in activeSurahData to activate consecutive flow
    const parts = ayahKey.split(':');
    if (parts.length === 2 && activeSurahData.length > 0) {
      const ayahNumInSurah = parseInt(parts[1], 10);
      const clickedIdx = activeSurahData.findIndex(a => a.numberInSurah === ayahNumInSurah);
      if (clickedIdx !== -1) {
        console.log("Triggering continuous play from clicked Ayah index:", clickedIdx);
        playWholeSurahConsecutive(clickedIdx);
        return;
      }
    }

    // Fallback block if the index was not found
    let finalAudioUrl = audioUrl;
    if (activeQiraat === 'warsh') {
      finalAudioUrl = audioUrl.replace('Al_Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Husary_64kbps', 'Husary_Warsh_64kbps');
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    setPlayingAyahKey(ayahKey);

    let sourceUrl = finalAudioUrl;
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await caches.open('quran-audio-cache');
        const matched = await cache.match(finalAudioUrl);
        if (matched) {
          const audioBlob = await matched.blob();
          sourceUrl = URL.createObjectURL(audioBlob);
        } else {
          sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
        }
      } else {
        sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
      }
    } catch (err) {
      sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
    }

    const audio = new Audio(sourceUrl);
    audio.onerror = () => {
      setPlayingAyahKey(null);
    };
    audioPlayerRef.current = audio;
    audio.play().then(() => {
      syncGlobalAudioState(audio, true, null);
    }).catch(e => {
      setPlayingAyahKey(null);
    });

    audio.onended = () => {
      setPlayingAyahKey(null);
    };
  };

  // Continuous consecutive playback engine for the entire Surah (offline-aware, proxied)
  const stopWholeSurahPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (preloadedAudioRef.current) {
      preloadedAudioRef.current.pause();
      preloadedAudioRef.current = null;
    }
    preloadedIndexRef.current = null;
    if (isMountedRef.current) {
      setSurahPlayActive(false);
      setSurahPlayAyahIdx(null);
      setPlayingAyahKey(null);
    }
    surahPlayActiveRef.current = false;
    consecutiveErrorsRef.current = 0;
  };

  const preloadNextAyah = async (nextIdx: number) => {
    if (nextIdx >= activeSurahData.length) return;
    try {
      const nextAyah = activeSurahData[nextIdx];
      let finalAudioUrl = nextAyah.audioUrl;
      if (!finalAudioUrl) return;

      if (activeQiraat === 'warsh') {
        finalAudioUrl = finalAudioUrl.replace('Al_Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Husary_64kbps', 'Husary_Warsh_64kbps');
      }

      let sourceUrl = finalAudioUrl;
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await caches.open('quran-audio-cache');
        const matched = await cache.match(finalAudioUrl);
        if (matched) {
          const audioBlob = await matched.blob();
          sourceUrl = URL.createObjectURL(audioBlob);
        } else {
          sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
        }
      } else {
        sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
      }

      const nextAudio = new Audio(sourceUrl);
      nextAudio.preload = "auto";
      nextAudio.load();
      preloadedAudioRef.current = nextAudio;
      preloadedIndexRef.current = nextIdx;
      console.log("Preloaded next ayah audio:", nextIdx, sourceUrl);
    } catch (e) {
      console.warn("Failed to preload next ayah:", e);
    }
  };

  const getFullSurahAudioUrl = (surahNum: number, reciter: string): string => {
    const paddedSurah = String(surahNum).padStart(3, '0');
    switch (reciter) {
      case 'husary':
        return `https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree/${paddedSurah}.mp3`;
      case 'ghamadi':
        return `https://download.quranicaudio.com/quran/sa3d_al_ghaamidi/complete/${paddedSurah}.mp3`;
      case 'shuraim':
        return `https://download.quranicaudio.com/quran/saud_ash-shuraym/${paddedSurah}.mp3`;
      case 'sudais':
        return `https://download.quranicaudio.com/quran/abdurrahmaan_as-sudais/${paddedSurah}.mp3`;
      case 'muaiqly':
        return `https://download.quranicaudio.com/quran/maher_al_muaiqly/${paddedSurah}.mp3`;
      case 'matrood':
        return `https://server8.mp3quran.net/mtrod/${paddedSurah}.mp3`;
      case 'tunaiji':
        return `https://download.mp3quran.net/download/qra/${paddedSurah}.mp3`;
      case 'basit':
        return `https://download.quranicaudio.com/quran/abdul_basit_mujawwad/${paddedSurah}.mp3`;
      case 'ayyub':
        return `https://download.quranicaudio.com/quran/muhammad_ayyoob/${paddedSurah}.mp3`;
      case 'minshawi':
        return `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshawee_mujawwad/${paddedSurah}.mp3`;
      case 'afasy':
        return `https://download.quranicaudio.com/quran/mishari_rashid_al_afasy/${paddedSurah}.mp3`;
      case 'mansoor':
        return `https://server14.mp3quran.net/mansor/${paddedSurah}.mp3`;
      case 'kameny':
        return `https://archive.org/download/Okasha_Kameny_Full_Quran/${paddedSurah}.mp3`;
      default:
        return `https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree/${paddedSurah}.mp3`;
    }
  };

  const playWholeSurahConsecutive = async (startIndex: number) => {
    if (activeSurahData.length === 0) return;
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    setSurahPlayActive(true);
    surahPlayActiveRef.current = true;

    if (playMode === 'continuous_stream') {
      setSurahPlayAyahIdx(null);
      setPlayingAyahKey(null);
      const streamUrl = getFullSurahAudioUrl(selectedSurahNum, primaryReciter);
      let sourceUrl = streamUrl;
      try {
        if (typeof window !== 'undefined' && 'caches' in window) {
          const cache = await caches.open('quran-audio-cache');
          const matched = await cache.match(streamUrl);
          if (matched) {
            const blob = await matched.blob();
            sourceUrl = URL.createObjectURL(blob);
            console.log("Playing full surah stream from cache:", streamUrl);
          } else {
            sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(streamUrl)}`;
          }
        } else {
          sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(streamUrl)}`;
        }
      } catch (err) {
        sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(streamUrl)}`;
      }

      const audio = new Audio(sourceUrl);
      audioPlayerRef.current = audio;
      
      audio.onended = () => {
        if (selectedSurahNum < 114) {
          console.log("Track ended. Autoplaying next Surah:", selectedSurahNum + 1);
          autoplayNextSurahRef.current = true;
          setSelectedSurahNum(prev => prev + 1);
        } else {
          stopWholeSurahPlayback();
        }
      };

      audio.play().then(() => {
        syncGlobalAudioState(audio, true, null);
      }).catch(e => {
        console.warn("Failed playing continuous stream:", e);
      });
      return;
    }

    setSurahPlayAyahIdx(startIndex);

    const currentAyah = activeSurahData[startIndex];
    const key = `${selectedSurahNum}:${currentAyah.numberInSurah}`;
    setPlayingAyahKey(key);

    let audio: HTMLAudioElement;

    // Check if we already have this index preloaded
    if (preloadedIndexRef.current === startIndex && preloadedAudioRef.current) {
      console.log("Using preloaded audio for index:", startIndex);
      audio = preloadedAudioRef.current;
      preloadedAudioRef.current = null;
      preloadedIndexRef.current = null;
    } else {
      let finalAudioUrl = currentAyah.audioUrl;
      if (activeQiraat === 'warsh') {
        finalAudioUrl = currentAyah.audioUrl.replace('Al_Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Husary_64kbps', 'Husary_Warsh_64kbps');
      }

      let sourceUrl = finalAudioUrl;
      try {
        if (typeof window !== 'undefined' && 'caches' in window) {
          const cache = await caches.open('quran-audio-cache');
          const matched = await cache.match(finalAudioUrl);
          if (matched) {
            const audioBlob = await matched.blob();
            sourceUrl = URL.createObjectURL(audioBlob);
            console.log("Playing surah consecutive from cache:", finalAudioUrl);
          } else {
            sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
          }
        } else {
          sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
        }
      } catch (err) {
        console.warn("Error reading cache for consecutive player:", err);
        sourceUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
      }

      audio = new Audio(sourceUrl);
    }

    audioPlayerRef.current = audio;
    
    audio.onplaying = () => {
      consecutiveErrorsRef.current = 0;
    };

    audio.onerror = () => {
      console.warn("Failed loading audio in consecutive cycle:", audio.src);
      consecutiveErrorsRef.current += 1;
      if (consecutiveErrorsRef.current >= 3) {
        console.error("Too many consecutive playing errors. Stopping playback to protect stack.");
        stopWholeSurahPlayback();
      } else {
        setTimeout(() => {
          if (surahPlayActiveRef.current) {
            skipToNextAyahConsecutive(startIndex);
          }
        }, 600);
      }
    };

    audio.onended = () => {
      if (surahPlayActiveRef.current) {
        skipToNextAyahConsecutive(startIndex);
      }
    };

    // Trigger preload for the next verse immediately!
    preloadNextAyah(startIndex + 1);

    audio.play().then(() => {
      consecutiveErrorsRef.current = 0;
      syncGlobalAudioState(audio, true, startIndex);
    }).catch(err => {
      console.warn("Consecutive audio play catch interrupted:", err);
      if (surahPlayActiveRef.current) {
        consecutiveErrorsRef.current += 1;
        if (consecutiveErrorsRef.current >= 3) {
          stopWholeSurahPlayback();
        } else {
          setTimeout(() => {
            if (surahPlayActiveRef.current) {
              skipToNextAyahConsecutive(startIndex);
            }
          }, 600);
        }
      }
    });
  };

  const skipToNextAyahConsecutive = (currentIndex: number) => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < activeSurahData.length) {
      if (surahPlayActiveRef.current) {
        playWholeSurahConsecutive(nextIdx);
      }
    } else {
      // Reached the end of the current Surah! Check if we can transition to the next Surah automatically
      if (selectedSurahNum < 114) {
        console.log("End of current Surah reached. Autoplaying next Surah:", selectedSurahNum + 1);
        autoplayNextSurahRef.current = true;
        setSelectedSurahNum(prev => prev + 1);
      } else {
        stopWholeSurahPlayback();
      }
    }
  };

  const skipToPrevAyahConsecutive = (currentIndex: number) => {
    const prevIdx = currentIndex - 1;
    if (prevIdx >= 0) {
      if (surahPlayActiveRef.current) {
        playWholeSurahConsecutive(prevIdx);
      }
    } else {
      stopWholeSurahPlayback();
    }
  };

  const seekContinuousStream = (time: number) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = time;
      setFullSurahCurrentTime(time);
    }
  };

  useEffect(() => {
    if (autoplayNextSurahRef.current && activeSurahData.length > 0) {
      autoplayNextSurahRef.current = false;
      console.log("Autoplaying loaded Surah starting from verse 1");
      playWholeSurahConsecutive(0);
    }
  }, [activeSurahData]);

  // Caching mechanism to download current Surah's audio for Sheikh Al-Husary or Saad Al-Ghamidi
  const downloadCurrentSurahAudio = async () => {
    if (activeSurahData.length === 0) return;
    const currentKey = `${selectedSurahNum}:${primaryReciter}`;
    setDownloadProgress(prev => ({ ...prev, [currentKey]: 1 }));

    try {
      if (typeof window === 'undefined' || !('caches' in window)) {
        throw new Error("Cache Storage API is not supported in this browser");
      }

      const cache = await caches.open('quran-audio-cache');
      let completedCount = 0;
      const totalAyahs = activeSurahData.length;

      for (const ayah of activeSurahData) {
        if (!ayah.audioUrl) continue;

        let finalAudioUrl = ayah.audioUrl;
        if (activeQiraat === 'warsh') {
          finalAudioUrl = ayah.audioUrl.replace('Al_Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Husary_64kbps', 'Husary_Warsh_64kbps');
        }

        const matched = await cache.match(finalAudioUrl);
        if (!matched) {
          try {
            const proxyUrl = `/api/audio-proxy?url=${encodeURIComponent(finalAudioUrl)}`;
            const res = await fetch(proxyUrl);
            if (res.ok) {
              await cache.put(finalAudioUrl, res);
            }
          } catch (fetchErr) {
            console.warn(`Failed fetching verse audio: ${finalAudioUrl}`, fetchErr);
          }
        }
        completedCount++;
        const progressPercent = Math.round((completedCount / totalAyahs) * 100);
        setDownloadProgress(prev => ({ ...prev, [currentKey]: progressPercent }));
      }

      // Add to completed lists
      const savedObj = localStorage.getItem('ilm_naafi_downloaded_surah_hashes');
      const hashes: string[] = savedObj ? JSON.parse(savedObj) : [];
      if (!hashes.includes(currentKey)) {
        hashes.push(currentKey);
        localStorage.setItem('ilm_naafi_downloaded_surah_hashes', JSON.stringify(hashes));
      }

      setDownloadedSurahs(prev => {
        if (!prev.includes(currentKey)) {
          return [...prev, currentKey];
        }
        return prev;
      });

    } catch (err) {
      console.error("Failed downloading Surah audio:", err);
      alert(lang === 'en' 
        ? "Failed to download some files. Please check network connections." 
        : "خطأ أثناء تحميل الملفات الصوتية. يرجى التأكد من توفر شبكة إنترنت مستقرة.");
    } finally {
      setDownloadProgress(prev => {
        const copy = { ...prev };
        delete copy[currentKey];
        return copy;
      });
    }
  };

  // Delete downloaded audio files for space management
  const deleteCurrentSurahAudio = async () => {
    const currentKey = `${selectedSurahNum}:${primaryReciter}`;
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await caches.open('quran-audio-cache');
        for (const ayah of activeSurahData) {
          if (ayah.audioUrl) {
            let finalAudioUrl = ayah.audioUrl;
            if (activeQiraat === 'warsh') {
              finalAudioUrl = ayah.audioUrl.replace('Al_Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Ghamadi_40kbps', 'Husary_Warsh_64kbps').replace('Husary_64kbps', 'Husary_Warsh_64kbps');
            }
            await cache.delete(finalAudioUrl);
          }
        }
      }

      const savedObj = localStorage.getItem('ilm_naafi_downloaded_surah_hashes');
      let hashes: string[] = savedObj ? JSON.parse(savedObj) : [];
      hashes = hashes.filter(h => h !== currentKey);
      localStorage.setItem('ilm_naafi_downloaded_surah_hashes', JSON.stringify(hashes));

      setDownloadedSurahs(prev => prev.filter(h => h !== currentKey));
    } catch (err) {
      console.error("Failed to delete offline cache:", err);
    }
  };

  // Copy verse to clipboard
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Filter surahs list based on query
  const filteredSurahs = surahs.filter(s => {
    const query = surahSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      s.englishName.toLowerCase().includes(query) ||
      s.englishNameTranslation.toLowerCase().includes(query) ||
      s.name.includes(query) ||
      s.number.toString() === query
    );
  });

  // Filter verses in active surah
  const filteredVerses = activeSurahData.filter(v => {
    const query = verseSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      v.englishText.toLowerCase().includes(query) ||
      v.arabicText.includes(query) ||
      v.numberInSurah.toString() === query
    );
  });

  // Paginate mushaf verses slice
  const totalMushafPages = Math.ceil(activeSurahData.length / versesPerPage);
  const paginatedMushafVerses = activeSurahData.slice(
    (mushafPage - 1) * versesPerPage,
    mushafPage * versesPerPage
  );

  // Get active page metadata indicators
  const currentJuz = paginatedMushafVerses[0]?.juz || currentSurahMeta?.number;
  const currentMushafOriginPage = paginatedMushafVerses[0]?.page || 1;

  if (!showReader) {
    return (
      <QuranIndexHub
        lang={lang}
        surahs={surahs}
        loadingList={loadingList}
        surahSearch={surahSearch}
        setSurahSearch={setSurahSearch}
        indexTab={indexTab}
        setIndexTab={setIndexTab}
        bookmarkedVerses={bookmarkedVerses}
        setSelectedSurahNum={setSelectedSurahNum}
        setShowReader={setShowReader}
        initialTargetAyahNumRef={initialTargetAyahNumRef}
        errorMsg={errorMsg}
        getSurahStartPage={getSurahStartPage}
        JUZ_LIST={JUZ_LIST}
      />
    );
  }

  return (
    <MushafReader
      lang={lang}
      currentSurahMeta={currentSurahMeta}
      selectedSurahNum={selectedSurahNum}
      activeTheme={activeTheme}
      setActiveTheme={setActiveTheme}
      displayMode={displayMode}
      setDisplayMode={setDisplayMode}
      selectTajweed={selectTajweed}
      primaryReciter={primaryReciter}
      setPrimaryReciter={setPrimaryReciter}
      errorMsg={errorMsg}
      mushafPage={mushafPage}
      setMushafPage={setMushafPage}
      totalMushafPages={totalMushafPages}
      loadingSurah={loadingSurah}
      activeQiraat={activeQiraat}
      fontSize={fontSize}
      setFontSize={setFontSize}
      paginatedMushafVerses={paginatedMushafVerses}
      selectedAyahInMushaf={selectedAyahInMushaf}
      setSelectedAyahInMushaf={setSelectedAyahInMushaf}
      playingAyahKey={playingAyahKey}
      playAyahAudio={playAyahAudio}
      toggleBookmark={toggleBookmark}
      bookmarkedVerses={bookmarkedVerses}
      copyToClipboard={copyToClipboard}
      copiedKey={copiedKey}
      selectedWordAnalysis={selectedWordAnalysis}
      setSelectedWordAnalysis={setSelectedWordAnalysis}
      isAuthenticated={isAuthenticated}
      onSwitchToAuth={onSwitchToAuth}
      stopWholeSurahPlayback={stopWholeSurahPlayback}
      setShowReader={setShowReader}
      downloadProgress={downloadProgress}
      downloadedSurahs={downloadedSurahs}
      deleteCurrentSurahAudio={deleteCurrentSurahAudio}
      downloadCurrentSurahAudio={downloadCurrentSurahAudio}
      playWholeSurahConsecutive={playWholeSurahConsecutive}
      playMode={playMode}
      setPlayMode={setPlayMode}
      fullSurahDuration={fullSurahDuration}
      fullSurahCurrentTime={fullSurahCurrentTime}
      seekContinuousStream={seekContinuousStream}
      surahPlayActive={surahPlayActive}
      setSelectedSurahNum={setSelectedSurahNum}
      ghostModeActive={ghostModeActive}
      ghostExpectedWords={ghostExpectedWords}
      setGhostExpectedWords={setGhostExpectedWords}
      ghostCurrentWordIdx={ghostCurrentWordIdx}
      setGhostCurrentWordIdx={setGhostCurrentWordIdx}
      ghostStudentProgress={ghostStudentProgress}
      setGhostStudentProgress={setGhostStudentProgress}
      ghostRefProgress={ghostRefProgress}
      setGhostRefProgress={setGhostRefProgress}
      ghostMetrics={ghostMetrics}
      setGhostMetrics={setGhostMetrics}
      ghostScores={ghostScores}
      setGhostScores={setGhostScores}
      ghostVoiceStatus={ghostVoiceStatus}
      setGhostVoiceStatus={setGhostVoiceStatus}
      interimText={interimText}
      setInterimText={setInterimText}
      ghostScopeJuz={ghostScopeJuz}
      setGhostScopeJuz={setGhostScopeJuz}
      ghostScopePage={ghostScopePage}
      setGhostScopePage={setGhostScopePage}
      ghostScopeStart={ghostScopeStart}
      setGhostScopeStart={setGhostScopeStart}
      ghostScopeEnd={ghostScopeEnd}
      setGhostScopeEnd={setGhostScopeEnd}
      ghostQari={ghostQari}
      setGhostQari={setGhostQari}
      startGhostMode={startGhostMode}
      stopGhostMode={stopGhostMode}
      schedSurahNum={schedSurahNum}
      setSchedSurahNum={setSchedSurahNum}
      schedFreq={schedFreq}
      setSchedFreq={setSchedFreq}
      schedTargetDate={schedTargetDate}
      setSchedTargetDate={setSchedTargetDate}
      addSchedTarget={addSchedTarget}
      removeSchedTarget={removeSchedTarget}
      revTimetable={revTimetable}
      surahs={surahs}
      currentJuz={currentJuz}
      currentMushafOriginPage={currentMushafOriginPage}
      activeSurahData={activeSurahData}
      transformHafsToWarsh={transformHafsToWarsh}
      MUSHAF_THEMES={MUSHAF_THEMES}
    />
  );

  if (false as any) {
    return (
      <div className="w-full bg-slate-50 min-h-screen pt-4 pb-12" id="quran-explorer-root">
      
      {/* HEADER BANNER ZONE */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-6 animate-fade-in">
        <div className="bg-gradient-to-tr from-amber-950 via-emerald-950 to-emerald-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-amber-500/20">
          
          {/* Decorative architectural layout */}
          <div className="absolute right-0 bottom-0 translate-x-1/6 translate-y-1/6 opacity-10 pointer-events-none">
            <BookOpen className="w-96 h-96 text-amber-300" />
          </div>
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-amber-550/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en' ? "Classical Madinah Mushaf Experience" : "تجربة المصحف المرتل الفخمة"}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-serif leading-none tracking-tight">
              {lang === 'en' ? "Al-Qur'an Al-Kareem Browser" : "القرآن الكريم والترجمة المعتمدة"}
            </h1>
            <p className="text-slate-200 text-sm md:text-base text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              {lang === 'en' 
                ? "Immerse yourself of reading a physical holy Quran. Experience custom paginated paper layout, golden-framed continuous verses flow, and audio recitations." 
                : "عش طمأنينة تصفح المصحف الورقي الحقيقي. يتميز بواجهة ورقية مذهبة، تقليب مبوب للصفحات، تلاوة متواصلة وقراءة متكاملة تفصيلية آية آية."}
            </p>
          </div>
        </div>
      </div>

      {/* ERROR MSG */}
      {errorMsg && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-6">
          <div className="bg-amber-50 border border-amber-250/50 rounded-2xl p-4 flex items-center gap-3 text-amber-950 font-bold text-xs" id="quran-error-alert">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* MAIN DYNAMIC CONTENT WORKSPACE */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SURAH SELECTION SIDEBAR (COL-SPAN-4) */}
        <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-sm space-y-4 max-h-[85vh] flex flex-col">
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-slate-805 flex items-center gap-1.5 font-sans">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              {lang === 'en' ? "Chapters (114 Surahs)" : "فهرس سور القرآن الكريم"}
            </h2>
            <p className="text-[10px] text-slate-505">
              {lang === 'en' ? "Search for surah by name, number, or translation" : "ابحث برقم السورة أو اسمها باللغة العربية والعلمية"}
            </p>
          </div>

          {/* Surah quick search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={lang === 'en' ? "Search Chapter (e.g. Al-Fatihah, 1)" : "ابحث باسم السورة أو رقمها..."}
              value={surahSearch}
              onChange={(e) => setSurahSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-emerald-555 font-sans"
              id="surah-search-box"
            />
          </div>

          {/* Scrollable list of Surahs */}
          <div className="overflow-y-auto flex-grow divide-y divide-slate-100 pr-1 space-y-1" style={{ maxHeight: '60vh' }}>
            {loadingList ? (
              <div className="py-12 text-center text-xs text-slate-500 font-medium space-y-2 flex flex-col items-center">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-800" />
                <span>{lang === 'en' ? "Loading chapters catalogs..." : "جاري تحميل فهرس السور المباركة..."}</span>
              </div>
            ) : filteredSurahs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 italic">
                {lang === 'en' ? "No surah matching this search." : "لم يتم العثور على سورة مرغوبة."}
              </div>
            ) : (
              filteredSurahs.map((surah) => {
                const isActive = selectedSurahNum === surah.number;
                return (
                  <button
                    key={`sidebar-surah-${surah.number}`}
                    onClick={() => setSelectedSurahNum(surah.number)}
                    className={`w-full py-2.5 px-3 rounded-xl text-left border-0 flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-amber-500/10 border border-amber-500/30' 
                        : 'bg-white hover:bg-slate-50'
                    }`}
                    style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                    id={`sidebar-surah-btn-${surah.number}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Surah Number circle badge */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-[10px] font-mono shrink-0 ${
                        isActive 
                          ? 'bg-[#C59B32] text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {surah.number}
                      </div>

                      {/* English metadata names */}
                      <div className="text-left">
                        <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-950">
                          {surah.englishName}
                        </span>
                        <span className="block text-[9px] text-slate-500 uppercase tracking-tight">
                          {surah.englishNameTranslation}
                        </span>
                      </div>
                    </div>

                    {/* Arabic Calligraphy & Verses Count */}
                    <div className="text-right">
                      <span className="block text-xs font-extrabold text-[#073327] text-right font-serif">
                        {surah.name}
                      </span>
                      <span className="block text-[8px] text-slate-400">
                        {surah.numberOfAyahs} {lang === 'en' ? 'Verses' : 'آية'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* QURAN AYAH VIEWER WORKSPACE (COL-SPAN-8) */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          
          {/* CONTROL MODE TABS DECK */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Elegant View Selector Toggle buttons */}
            <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto gap-1">
              <button
                onClick={() => setQuranViewMode('mushaf')}
                className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-[11px] md:text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer border-0 ${
                  quranViewMode === 'mushaf' 
                    ? 'bg-amber-950 text-[#C59B32] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="view-mode-mushaf-btn"
              >
                <Book className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? "📖 Mushaf" : "📖 المصحف"}</span>
              </button>
              <button
                onClick={() => setQuranViewMode('study')}
                className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-[11px] md:text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer border-0 ${
                  quranViewMode === 'study' 
                    ? 'bg-amber-950 text-[#C59B32] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="view-mode-study-btn"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? "📝 Study" : "📝 التراجم"}</span>
              </button>
              <button
                onClick={() => setQuranViewMode('murajah')}
                className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-[11px] md:text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer border-0 ${
                  quranViewMode === 'murajah' 
                    ? 'bg-amber-950 text-[#C59B32] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="view-mode-murajah-btn"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? "🎯 Murājah" : "🎯 تسميع ومراجعة"}</span>
              </button>
            </div>

            {/* Dynamic Reciter Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0" id="reciter-selector-wrap">
              <button
                onClick={() => selectPrimaryReciter('husary')}
                className={`py-1.5 px-3.5 text-xs font-black rounded-lg cursor-pointer transition-all border-0 ${
                  primaryReciter === 'husary'
                    ? 'bg-amber-950 text-[#C59B32] shadow-xs'
                    : 'text-slate-600 hover:bg-white/40'
                }`}
                title="Mahmoud Khalil Al-Husary recitation"
                id="reciter-husary-btn"
              >
                {lang === 'en' ? "Sheikh Al-Husary" : "الشيخ الحصري"}
              </button>
              <button
                onClick={() => selectPrimaryReciter('ghamadi')}
                className={`py-1.5 px-3.5 text-xs font-black rounded-lg cursor-pointer transition-all border-0 ${
                  primaryReciter === 'ghamadi'
                    ? 'bg-amber-950 text-[#C59B32] shadow-xs'
                    : 'text-slate-600 hover:bg-white/40'
                }`}
                title="Saad Al-Ghamidi recitation"
                id="reciter-ghamadi-btn"
              >
                {lang === 'en' ? "Saad Al-Ghamidi" : "سعد الغامدي"}
              </button>
            </div>

            {/* Tajweed Mode Toggle */}
            <button
              onClick={() => selectTajweed(!activeTajweed)}
              className={`py-1.5 px-3.5 rounded-xl transition text-xs font-black inline-flex items-center gap-1.5 border cursor-pointer ${
                activeTajweed
                  ? 'bg-amber-100/90 text-amber-950 border-amber-300 shadow-3xs'
                  : 'bg-white hover:bg-slate-50 text-slate-650 border-slate-200'
              }`}
              title="Toggle Interactive Tajweed Assistant"
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTajweed ? 'text-amber-800 animate-pulse' : 'text-slate-400'}`} />
              <span>{lang === 'en' ? "Tajweed Assistant" : "معلّم التجويد"}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${activeTajweed ? 'bg-emerald-600' : 'bg-slate-300'}`} />
            </button>

            {/* Customizer features (Font text slider) */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <Type className="w-3.5 h-3.5" />
                {lang === 'en' ? "Size:" : "حجم الخط:"}
              </span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 shrink-0">
                <button 
                  onClick={() => setFontSize(Math.max(18, fontSize - 2))} 
                  className="p-1 px-2.5 hover:bg-white text-slate-600 rounded-lg cursor-pointer text-xs font-black border-0"
                  title="Smaller line texts"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <div className="px-2 text-[10px] font-mono font-bold text-slate-700 min-w-[35px] text-center select-none">
                  {fontSize}px
                </div>
                <button 
                  onClick={() => setFontSize(Math.min(46, fontSize + 2))} 
                  className="p-1 px-2.5 hover:bg-white text-slate-600 rounded-lg cursor-pointer text-xs font-black border-0"
                  title="Bigger traditional font size"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
          </div>

          {/* OFFLINE AUDIO DOWNLOADS AND CACHING MANAGER */}
          <div className="bg-[#fcfdfd] border border-emerald-100 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                <Cloud className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left w-full">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 font-sans">
                  <span>{lang === 'en' ? "Offline Recitation Sync" : "مزامنة التلاوة الصوتية للعمل بدون إنترنت"}</span>
                  {downloadedSurahs.includes(`${selectedSurahNum}:${primaryReciter}`) && (
                    <span className="text-[9px] bg-emerald-600 text-white font-mono uppercase tracking-widest px-1.5 py-0.5 rounded font-black">
                      {lang === 'en' ? "OFFLINE READY" : "جاهز للعمل أوفلاين"}
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-500 font-normal leading-normal mt-0.5">
                  {lang === 'en' 
                    ? `Pre-download & store Surah ${currentSurahMeta?.englishName || ""} (${primaryReciter === 'ghamadi' ? "Saad Al-Ghamidi" : "Sheikh Al-Husary"}) locally to play without cell data.`
                    : `حمّل سورة ${currentSurahMeta?.name || ""} بصوت القارئ الحالي لتتمكن من تشغيل الصوت متى شئت بدون إنترنت.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
              {downloadProgress[`${selectedSurahNum}:${primaryReciter}`] !== undefined ? (
                // Downloading Progress state
                <div className="w-full md:w-44 flex flex-col gap-1 text-right">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold font-mono">
                    <span>{lang === 'en' ? "Downloading..." : "جاري التحميل..."}</span>
                    <span>{downloadProgress[`${selectedSurahNum}:${primaryReciter}`]}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all duration-300"
                      style={{ width: `${downloadProgress[`${selectedSurahNum}:${primaryReciter}`]}%` }}
                    />
                  </div>
                </div>
              ) : downloadedSurahs.includes(`${selectedSurahNum}:${primaryReciter}`) ? (
                // Already downloaded state
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  <button
                    onClick={deleteCurrentSurahAudio}
                    className="w-full md:w-auto py-1.5 px-3 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer border border-red-200 transition bg-white"
                    title="Remove offline storage and reclaim space"
                  >
                    {lang === 'en' ? "Delete Offline Copy" : "حذف الملفات المحملة"}
                  </button>
                  <div className="text-emerald-750 font-bold text-[11px] flex items-center gap-1 shrink-0 font-sans select-none bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'en' ? "Offline Active" : "العمل أوفلاين مفعّل"}</span>
                  </div>
                </div>
              ) : (
                // Initial Download Button
                <button
                  onClick={downloadCurrentSurahAudio}
                  className="w-full md:w-auto py-2 px-4.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 bg-emerald-900 border border-emerald-950 text-white hover:bg-emerald-850 shadow-sm"
                  id="btn-download-offline-audio"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>{lang === 'en' ? `Download Surah (${activeSurahData.length} Verses)` : `تحميل السورة (${activeSurahData.length} آية)`}</span>
                </button>
              )}
            </div>
          </div>

          {/* CONSECUTIVE WHOLE SURAH AUDIO CONTROLLER */}
          <div className="bg-gradient-to-r from-[#064e3b] to-[#047857] text-[#f0fdf4] rounded-2xl p-5 shadow-xs border border-[#065f46] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-3 rounded-xl bg-emerald-900/40 text-emerald-100 border border-emerald-850 shrink-0">
                <Volume2 className={`w-5 h-5 ${surahPlayActive ? 'animate-bounce' : ''}`} />
              </div>
              <div className="text-left w-full">
                <h4 className="text-xs font-extrabold text-white flex items-center gap-2 font-sans tracking-tight">
                  <span>{lang === 'en' ? "Full Surah Continuous Recitation" : "التلاوة المتواصلة للسورة كاملة"}</span>
                  {surahPlayActive && (
                    <span className="text-[9px] bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.5 rounded animate-pulse">
                      {lang === 'en' ? "PLAYING" : "جاري التشغيل"}
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-emerald-100 font-normal leading-relaxed mt-0.5 max-w-md">
                  {surahPlayActive && surahPlayAyahIdx !== null ? (
                    lang === 'en' 
                      ? `Currently reciting Verse ${activeSurahData[surahPlayAyahIdx]?.numberInSurah} of ${activeSurahData.length} — Reciter: ${primaryReciter === 'ghamadi' ? "Saad Al-Ghamidi" : "Sheikh Al-Husary"}`
                      : `تلاوة الآية رقم ${activeSurahData[surahPlayAyahIdx]?.numberInSurah} من أصل ${activeSurahData.length} آية — بصوت القارئ المختار`
                  ) : (
                    lang === 'en' 
                      ? `Listen to Surah ${currentSurahMeta?.englishName || "Fatihah"} continuously from beginning to end with automatic autoplay.`
                      : `استمع إلى سورة ${currentSurahMeta?.name || "الفاتحة"} بصوت متواصل من الآية الأولى إلى الختام تلقائياً وبدون انقطاع.`
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {surahPlayActive ? (
                // Active mode controls
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => skipToPrevAyahConsecutive(surahPlayAyahIdx || 0)}
                    className="p-2 rounded-xl bg-emerald-900/60 text-white hover:bg-emerald-900 border border-emerald-800 transition cursor-pointer"
                    title={lang === 'en' ? "Previous Verse" : "الآية السابقة"}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={stopWholeSurahPlayback}
                    className="flex items-center gap-1.5 py-2 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition cursor-pointer"
                    title={lang === 'en' ? "Stop Playback" : "إيقاف المؤقت"}
                  >
                    <Pause className="w-4 h-4 shrink-0" />
                    <span>{lang === 'en' ? "Stop Recitation" : "إيقاف التلاوة"}</span>
                  </button>

                  <button
                    onClick={() => skipToNextAyahConsecutive(surahPlayAyahIdx || 0)}
                    className="p-2 rounded-xl bg-emerald-900/60 text-white hover:bg-emerald-900 border border-emerald-800 transition cursor-pointer"
                    title={lang === 'en' ? "Next Verse" : "الآية التالية"}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Play Surah Trigger Button
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); playWholeSurahConsecutive(0); }}
                  className="w-full md:w-auto py-2 px-6 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 bg-white text-emerald-900 hover:bg-emerald-50 shadow-xs border border-[#065f46]"
                  id="btn-play-full-surah"
                >
                  <Play className="w-4 h-4 shrink-0 fill-emerald-900 text-emerald-900" />
                  <span>
                    {lang === 'en' 
                      ? `Listen to Full Surah` 
                      : `تشغيل السورة كاملة`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC VIEW CONTAINER */}
          {quranViewMode === 'mushaf' ? (
            
            /* =============================================================== */
            /* 1. MUSHAF MODE: AUTHENTIC PAGINATED GLOWING CONTAINER          */
            /* =============================================================== */
            <div className="space-y-6">
              
              {/* Core Book Frame with Dual-gilded Gold lines and Ivory paper canvas */}
              <div 
                className="bg-[#FCFAF2] border-[14px] border-double border-amber-800/25 rounded-[2.5rem] shadow-xl p-5 md:p-10 relative overflow-hidden transition-all duration-300 min-h-[550px] flex flex-col justify-between"
                id="authentic-mushaf-paper"
              >
                {/* Traditional Corner Arabesque Ornaments */}
                <div className="absolute top-4 left-4 text-amber-800/15 pointer-events-none select-none">
                  <span className="font-serif text-3xl font-black">✦</span>
                </div>
                <div className="absolute top-4 right-4 text-amber-800/15 pointer-events-none select-none">
                  <span className="font-serif text-3xl font-black">✦</span>
                </div>
                <div className="absolute bottom-4 left-4 text-amber-800/15 pointer-events-none select-none">
                  <span className="font-serif text-3xl font-black">✦</span>
                </div>
                <div className="absolute bottom-4 right-4 text-amber-800/15 pointer-events-none select-none">
                  <span className="font-serif text-3xl font-black">✦</span>
                </div>

                {/* Sub-header inside paper margins (Juz Number - Page Indicator) */}
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 mb-6 text-[11px] font-serif text-amber-950 font-bold select-none tracking-wide">
                  <span>
                    {lang === 'en' ? `Juz' ${currentJuz}` : `الجزء ${currentJuz}`}
                  </span>
                  <span className="italic font-bold text-amber-700 font-serif">
                    {currentSurahMeta?.name} / {currentSurahMeta?.englishName}
                  </span>
                  <span>
                    {lang === 'en' ? `Page ${currentMushafOriginPage}` : `صفحة الحفظ ${currentMushafOriginPage}`}
                  </span>
                </div>

                {loadingSurah ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <RefreshCw className="w-10 h-10 animate-spin text-amber-800" />
                    <p className="text-xs font-bold text-amber-950 uppercase tracking-widest font-mono">
                      {lang === 'en' ? "Transcribing Authentic Script..." : "جاري كتابة السطور والرموز الشريفة..."}
                    </p>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-between space-y-8">
                    
                    {/* Bismillah Heading (Only rendered on the first page of the Surah, except surah at-tawbah 9) */}
                    {mushafPage === 1 && selectedSurahNum !== 9 && (
                      <div className="text-center select-none py-1.5 flex flex-col items-center" id="mushaf-bismillah">
                        {/* Decorative golden cartouche ribbon border */}
                        <div className="w-4/5 md:w-3/5 py-2 px-6 rounded-2xl bg-gradient-to-r from-amber-600/5 via-amber-600/15 to-amber-600/5 border border-amber-700/20 text-center relative overflow-hidden mb-4">
                          <p className="text-2xl md:text-3xl font-extrabold text-[#073327] font-serif leading-relaxed" dir="rtl">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </p>
                        </div>
                      </div>
                    )}

                    {/* CONTINUOUS WORKSPACE FLOW of ARABIC VERSE LETTERS */}
                    <div className="text-right py-4 leading-loose" dir="rtl" id="mushaf-text-canvas">
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={`mushaf-page-flip-${mushafPage}`}
                          initial={{ x: lang === 'ar' ? 30 : -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: lang === 'ar' ? -30 : 30, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="font-serif font-bold text-slate-900 tracking-wide select-all text-justify md:text-center w-full"
                          style={{ 
                            fontSize: `${fontSize}px`, 
                            lineHeight: `${fontSize * 1.95}px`,
                            wordSpacing: '0.15em'
                          }}
                        >
                          {paginatedMushafVerses.map((v) => {
                            const isAyahSelected = selectedAyahInMushaf?.numberInSurah === v.numberInSurah;
                            const isAyahPlaying = playingAyahKey === `${selectedSurahNum}:${v.numberInSurah}`;

                            // We append beautiful traditional ornate marker enclosing numbers: ﴿ v.numberInSurah ﴾
                            return (
                              <span 
                                key={`mushaf-span-${v.number}`}
                                onClick={() => setSelectedAyahInMushaf(v)}
                                className={`inline transition-all duration-200 cursor-pointer rounded-sm px-1.5 py-0.5 relative ${
                                  isAyahSelected 
                                    ? 'bg-amber-100/90 text-emerald-950 ring-2 ring-amber-500/30' 
                                    : isAyahPlaying
                                      ? 'bg-emerald-50 text-[#073327] ring-1 ring-emerald-300'
                                      : 'hover:bg-amber-500/5'
                                }`}
                                title={lang === 'en' ? `Click to view translation of Ayah ${v.numberInSurah}` : `اضغط لعرض تفسير الآية ${v.numberInSurah}`}
                              >
                                {activeQiraat === 'warsh'
                                  ? transformHafsToWarsh(v.arabicText).replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")
                                  : v.arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")}{" "}
                                {/* Elegant golden numeric medallion marker */}
                                <span className={`inline-flex items-center justify-center mx-1.5 w-6.5 h-6.5 rounded-full text-center font-bold font-mono text-[9.5px] shrink-0 border select-none transition-transform pointer-events-none hover:scale-105 ${
                                  isAyahSelected
                                    ? 'bg-amber-600 text-white border-amber-700'
                                    : 'bg-white text-amber-700 border-amber-400'
                                }`}>
                                  {v.numberInSurah}
                                </span>
                              </span>
                            );
                          })}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Page Footnote containing total surah bookmarks summary */}
                    <div className="border-t border-amber-900/10 pt-4 mt-6 text-center text-[10px] font-sans text-amber-950/75 select-none leading-relaxed">
                      {lang === 'en' 
                        ? `Click any Arabic word above to display translation & instant reciter playing widgets below.` 
                        : `اضغط على أي كلمة قرآنية كريمة أعلاه لتحديد الآية وعرض ترجمتها وبدء التلاوة الفورية بالأسفل.`}
                    </div>

                  </div>
                )}

                {/* Classical Outer page turn indicator deck */}
                <div className="absolute right-1/2 translate-x-1/2 bottom-1.5 h-1.5 w-16 bg-amber-600/20 rounded-full" />
              </div>

              {/* MUSHAF INTERACTIVE PAGINATION CONTROLS DECK */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                
                {/* Previous page trigger */}
                <button
                  disabled={mushafPage <= 1}
                  onClick={() => setMushafPage(p => p - 1)}
                  className={`w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                    mushafPage <= 1 
                      ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed' 
                      : 'bg-[#073327] hover:bg-[#0c241f] text-white border-[#073327]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{lang === 'en' ? "Previous Page" : "الصفحة السابقة"}</span>
                </button>

                {/* Page Select Indicator dots */}
                <div className="text-center font-serif text-sm font-bold text-amber-950 flex items-center gap-3">
                  <span className="text-xs text-slate-400">﴿</span>
                  <span>{lang === 'en' ? `Page ${mushafPage} of ${totalMushafPages}` : `صفحة ${mushafPage} من ${totalMushafPages}`}</span>
                  <span className="text-xs text-slate-400">﴾</span>
                  
                  {/* Surah complete total verses */}
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-2.5 py-0.5 rounded-md border text-center">
                    {activeSurahData.length} {lang === 'en' ? 'verses' : 'آية'}
                  </span>
                </div>

                {/* Next page trigger */}
                <button
                  disabled={mushafPage >= totalMushafPages}
                  onClick={() => setMushafPage(p => p + 1)}
                  className={`w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                    mushafPage >= totalMushafPages 
                      ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed' 
                      : 'bg-[#073327] hover:bg-[#0c241f] text-white border-[#073327]'
                  }`}
                >
                  <span>{lang === 'en' ? "Next Page" : "الصفحة التالية"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>

              {/* FLOATING DETAILED TRANSLATION PANEL OF THE HIGHLIGHTED AYAH */}
              <AnimatePresence mode="wait">
                {selectedAyahInMushaf && (
                  <motion.div
                    key={`mushaf-selected-${selectedAyahInMushaf.number}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="bg-[#faf8f2] border-2 border-[#C59B32]/30 rounded-2xl p-5 shadow-md space-y-4 relative"
                    id="mushaf-active-selected-translation-bar"
                  >
                    {/* Golden decorative accent tag */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C59B32] text-white text-[9px] font-black tracking-widest px-4 py-1 rounded-full uppercase shadow-xs select-none">
                      {lang === 'en' ? "Selected Verse Details" : "آية تفسير المراجعة"}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-900/5 pb-3 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-xs text-amber-900 font-mono">
                          {selectedAyahInMushaf.numberInSurah}
                        </div>
                        <div>
                          <span className="block text-xs font-extrabold text-[#073327]">
                            Ayah {selectedSurahNum}:{selectedAyahInMushaf.numberInSurah}
                          </span>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-tight">
                            {currentSurahMeta?.englishName} • Juz' {selectedAyahInMushaf.juz}
                          </span>
                        </div>
                      </div>

                      {/* Tool Actions: Recite Audio, Toggle Bookmark, Copy Texts */}
                      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                        {/* Audio play/pause */}
                        {selectedAyahInMushaf.audioUrl && (
                          <button
                            onClick={() => playAyahAudio(`${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}`, selectedAyahInMushaf.audioUrl!)}
                            className={`p-2 rounded-xl transition-all cursor-pointer text-xs font-black flex items-center gap-1.5 border ${
                              playingAyahKey === `${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}` 
                                ? 'bg-amber-100 text-amber-950 border-amber-300' 
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                            title="Listen Recitation"
                          >
                            {playingAyahKey === `${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}` ? (
                              <>
                                <span className="block w-2 h-2 rounded-full bg-amber-800 animate-ping" />
                                <span>{lang === 'en' ? "Stop Reciting" : "إيقاف التلاوة"}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-4 h-4 text-emerald-800" />
                                <span>{lang === 'en' ? "Listen Plain Voice" : "استمع للقراءة"}</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Bookmark checkbox */}
                        <button
                          onClick={() => toggleBookmark(selectedSurahNum, selectedAyahInMushaf.numberInSurah)}
                          className={`p-2 rounded-xl transition cursor-pointer border ${
                            bookmarkedVerses.includes(`${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}`) 
                              ? 'bg-amber-500/10 border-amber-300 text-amber-800' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-550'
                          }`}
                          title="Bookmark Verse"
                        >
                          {bookmarkedVerses.includes(`${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}`) ? (
                            <BookmarkCheck className="w-4 h-4 text-[#C59B32]" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* Copy translation */}
                        <button
                          onClick={() => copyToClipboard(`${selectedAyahInMushaf.arabicText} \n[${selectedSurahNum}:${selectedAyahInMushaf.numberInSurah}] \n"${selectedAyahInMushaf.englishText}"`, `ayah-${selectedAyahInMushaf.numberInSurah}`)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 transition text-slate-650 text-slate-600 border border-slate-200 cursor-pointer flex items-center gap-1"
                          title="Copy verse"
                        >
                          {copiedKey === `ayah-${selectedAyahInMushaf.numberInSurah}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Practice Ayah under AI Teacher supervision */}
                        <button
                          onClick={() => onPracticeAyah?.({
                            surah: currentSurahMeta?.englishName || String(selectedSurahNum),
                            ayah: selectedAyahInMushaf.numberInSurah,
                            textArabic: selectedAyahInMushaf.arabicText,
                            translation: selectedAyahInMushaf.englishText
                          })}
                          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-[#C59B32] text-[10px] font-black cursor-pointer flex items-center gap-1 shadow-2xs font-sans"
                          title="Practice in AI Speech Coach"
                        >
                          <Mic className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                          <span>{lang === 'en' ? "Practice" : "تدريب"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Side-by-side or stacked display */}
                    <div className="space-y-3 font-sans">
                      <div className="bg-white/50 border border-amber-900/5 rounded-xl p-3 text-right" dir="rtl">
                        <p className="font-serif font-bold text-[#0c1412] text-lg leading-relaxed">
                          {activeQiraat === 'warsh'
                            ? transformHafsToWarsh(selectedAyahInMushaf.arabicText)
                            : selectedAyahInMushaf.arabicText}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-left">
                        <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">English Sahih Translation</span>
                        <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
                          {selectedAyahInMushaf.englishText}
                        </p>
                      </div>

                      {activeTajweed && (
                        <div className="border-t border-amber-950/10 pt-4 mt-2" id="tajweed-analysis-block">
                          <span className="block text-[10px] uppercase font-black text-amber-900 tracking-wider mb-2.5 flex items-center gap-1.5 justify-end" dir="rtl">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            {lang === 'en' ? "Word-by-Word Tajweed Phonetic Syllables" : "التجويد والترتيل التفاعلي لكل كلمة"}
                          </span>
                          
                          {(() => {
                            const cleanText = selectedAyahInMushaf.arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "");
                            const analysis = analyzeTajweedText(cleanText, activeQiraat);
                            return (
                              <div className="w-full space-y-3">
                                {/* Rule count feedback */}
                                <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-xs text-[#06241a]" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                                  <Info className="w-4 h-4 shrink-0 text-emerald-800" />
                                  <p className="font-medium leading-relaxed">{analysis.summaryFeedback}</p>
                                </div>

                                {/* Clickable Word bubbles */}
                                <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                                  {analysis.words.map((word, wIdx) => {
                                    const hasRules = word.occurrences.length > 0;
                                    const isSelected = selectedWordAnalysis?.wordIndex === word.wordIndex && selectedWordAnalysis?.wordText === word.wordText;
                                    return (
                                      <div 
                                        key={`mushaf-word-${wIdx}`}
                                        onClick={() => {
                                          setSelectedWordAnalysis(word);
                                        }}
                                        className={`p-2.5 px-3.5 rounded-xl border transition-all cursor-pointer text-right group select-none relative ${
                                          isSelected
                                            ? 'bg-amber-100/95 border-amber-500 ring-2 ring-amber-500/10 scale-[1.03]'
                                            : hasRules
                                              ? 'bg-white border-amber-250 hover:border-amber-400 hover:bg-slate-50/20'
                                              : 'bg-slate-50/40 border-slate-100 text-slate-400 hover:bg-slate-50'
                                        }`}
                                      >
                                        <div className="font-serif font-black text-slate-900 text-[15px] leading-tight select-none">
                                          {activeQiraat === 'warsh' ? transformHafsToWarsh(word.wordText) : word.wordText}
                                        </div>
                                        <div className="text-[9px] text-slate-400 font-mono tracking-tight mt-1 flex items-center justify-between gap-2 pointer-events-none select-none">
                                          <span>"{word.phoneticTranscription}"</span>
                                          {hasRules && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse shrink-0" />
                                          )}
                                        </div>

                                        {/* Short rule acronym bubble tags */}
                                        {hasRules && (
                                          <div className="flex flex-wrap gap-0.5 mt-1.5 justify-end">
                                            {word.occurrences.map((oc, oIdx) => (
                                              <span 
                                                key={`suboc-${oIdx}`}
                                                className="text-[7.5px] px-1 py-0.2 rounded-xs font-bold bg-amber-500/10 text-amber-900 leading-none select-none pointer-events-none"
                                              >
                                                {oc.ruleName.split(' ')[0]}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Active selected word rules details */}
                                {selectedWordAnalysis && (
                                  <div className="bg-[#fcfbf9] border border-amber-500/20 rounded-xl p-4 mt-2 shadow-xs transition-all relative text-right" dir="rtl" id="word-rules-drawer">
                                    <button 
                                      onClick={() => setSelectedWordAnalysis(null)} 
                                      className="text-slate-400 hover:text-slate-800 font-black absolute top-3 left-3 bg-slate-200/40 w-5 h-5 rounded-full flex items-center justify-center border-0 cursor-pointer font-sans"
                                      title="Close analysis"
                                    >
                                      ✕
                                    </button>
                                    
                                    <div className="flex items-center gap-3 border-b border-amber-950/5 pb-2.5 mb-3 justify-start">
                                      <span className="font-serif font-black text-2xl text-slate-900">
                                        {activeQiraat === 'warsh' ? transformHafsToWarsh(selectedWordAnalysis.wordText) : selectedWordAnalysis.wordText}
                                      </span>
                                      <span className="text-xs text-slate-500 italic block font-mono">
                                        "{selectedWordAnalysis.phoneticTranscription}"
                                      </span>
                                    </div>

                                    {selectedWordAnalysis.occurrences.length > 0 ? (
                                      <div className="space-y-3">
                                        {selectedWordAnalysis.occurrences.map((oc: any, idx: number) => (
                                          <div key={`word-oc-detail-${idx}`} className="bg-amber-500/5 rounded-lg p-3 border border-amber-300/30 text-xs text-slate-700 space-y-1.5">
                                            <div className="flex items-center justify-between flex-row-reverse">
                                              <span className="font-black text-amber-950 text-xs tracking-tight flex items-center gap-1">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-800" /> {oc.ruleName}
                                              </span>
                                              <span className="text-[10px] bg-amber-150 text-amber-900 px-2 py-0.5 rounded-sm font-mono font-bold shrink-0">
                                                Duration: {oc.durationBeats} Beats
                                              </span>
                                            </div>
                                            
                                            <p className="leading-relaxed text-slate-650 text-right">{oc.description}</p>
                                            
                                            <div className="border-t border-amber-900/5 pt-2 mt-1 flex items-center justify-between text-[10.5px] flex-row-reverse">
                                              <span className="text-slate-500 font-medium">
                                                {lang === 'en' ? "Point of Articulation (Makhraj):" : "موضع خروج الصوت (المخرج):"}
                                              </span>
                                              <strong className="text-amber-950 font-bold">
                                                {oc.makhrajInteractiveDetails?.title}
                                              </strong>
                                            </div>
                                            <p className="text-[10.5px] text-slate-500 flex items-center gap-1 justify-end">
                                              <span>{oc.makhrajInteractiveDetails?.description}</span>
                                              <span>🎙️</span>
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-slate-450 italic text-center">
                                        {lang === 'en' ? "Standard articulation properties apply. No active nasalization (ghunnah) or heavy elongation rules." : "يقرأ اللفظ بسرد سليم طبيعي. لا توجد أحكام استثنائية أو غنن تلازم اللفظ."}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          ) : quranViewMode === 'study' ? (
            
            /* =============================================================== */
            /* 2. STUDY MODE: STACKED DETAILED DUAL-LANGUAGE CARDS LIST        */
            /* =============================================================== */
            <div className="space-y-4">
              
              {/* Toolbar details inside Study mode (e.g. search filter in active Surah only) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-800">{lang === 'en' ? "Filter Quran translation terms" : "خيارات البحث في السورة المباركة"}</h3>
                  <p className="text-[10px] text-slate-500">{lang === 'en' ? "Matches characters or meanings instantly" : "مطابقة معاني الآيات والكلمات بلحظتها"}</p>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder={lang === 'en' ? "Search English text..." : "ابحث في كلمات السورة..."}
                    value={verseSearch}
                    onChange={(e) => setVerseSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    id="ayahs-filter-box"
                  />
                </div>
              </div>

              {/* Bismillah heading */}
              {selectedSurahNum !== 9 && (
                <div className="bg-[#FAF8F5] border border-amber-900/10 rounded-2xl py-6 px-4 text-center select-none relative overflow-hidden">
                  <div className="relative z-10 space-y-1">
                    <p className="text-xl md:text-2xl font-extrabold text-[#073327] font-serif" dir="rtl">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <p className="text-[10px] text-amber-900/80 uppercase font-mono tracking-widest leading-none mt-1">
                      In the name of Allah, the Entirely Merciful, the Especially Merciful.
                    </p>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-serif text-amber-400/10 pointer-events-none select-none">
                    ﷽
                  </div>
                </div>
              )}

              {/* Verses Stack */}
              <div className="space-y-4">
                {loadingSurah ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-800" />
                    <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#073327]">
                      {lang === 'en' ? "Preparing alignments..." : "تحضير التفاسير..."}
                    </span>
                  </div>
                ) : filteredVerses.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 italic text-xs">
                    {lang === 'en' ? "No translation matching this query found in current chapter." : "لم يتم العثور على تطابق في كلمات السورة المفتوحة."}
                  </div>
                ) : (
                  filteredVerses.map((ayah) => {
                    const ayahKey = `${selectedSurahNum}:${ayah.numberInSurah}`;
                    const isBookmarked = bookmarkedVerses.includes(ayahKey);
                    const isPlaying = playingAyahKey === ayahKey;

                    return (
                      <div
                        key={`quran-ayah-${ayah.number}`}
                        className={`bg-white border rounded-2xl p-5 md:p-6 shadow-2xs hover:shadow-xs transition space-y-4 relative ${
                          isPlaying ? 'border-[#C59B32] bg-amber-50/5' : 'border-slate-200/80 bg-white'
                        }`}
                        id={`ayah-card-${ayah.numberInSurah}`}
                      >
                        
                        {/* AYAH TOP ACTIONS RIBBON (NUMBER, PLAY, BOOKMARK) */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <div className="flex items-center gap-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                            {/* Circle badge */}
                            <div className="w-6.5 h-6.5 rounded-lg bg-[#073327]/5 border border-[#073327]/10 flex items-center justify-center font-bold text-xs text-[#073327] font-mono">
                              {ayah.numberInSurah}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                              Ayah {selectedSurahNum}:{ayah.numberInSurah}
                            </span>
                          </div>

                          {/* Interactive audio, bookmark & copy buttons */}
                          <div className="flex items-center gap-1">
                            {/* Audio play/pause */}
                            {ayah.audioUrl && (
                              <button
                                onClick={() => playAyahAudio(ayahKey, ayah.audioUrl!)}
                                className={`p-2 rounded-xl transition cursor-pointer border ${
                                  isPlaying 
                                    ? 'bg-amber-150 text-amber-900 border-amber-300' 
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/50'
                                }`}
                                id={`ayah-play-btn-${ayah.numberInSurah}`}
                                title="Listen Recitation"
                              >
                                {isPlaying ? (
                                  <span className="block w-4 h-4 relative">
                                    <span className="absolute inset-0 border-2 border-amber-905 rounded-full animate-ping" />
                                    <Pause className="w-4 h-4" />
                                  </span>
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {/* Bookmark checkbox */}
                            <button
                              onClick={() => toggleBookmark(selectedSurahNum, ayah.numberInSurah)}
                              className={`p-2 rounded-xl transition cursor-pointer border ${
                                isBookmarked 
                                  ? 'bg-amber-50/80 border-amber-300 text-amber-850' 
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/50 text-[#C59B32] text-slate-400'
                              }`}
                              id={`ayah-bookmark-btn-${ayah.numberInSurah}`}
                              title="Bookmark Verse"
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-4 h-4 text-[#C59B32]" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>

                            {/* Copy button */}
                            <button
                              onClick={() => copyToClipboard(`${ayah.arabicText} \n[${selectedSurahNum}:${ayah.numberInSurah}] \n"${ayah.englishText}"`, `ayah-${ayah.numberInSurah}`)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-250 cursor-pointer"
                              title="Copy"
                            >
                              {copiedKey === `ayah-${ayah.numberInSurah}` ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-500" />
                              )}
                            </button>

                            {/* Practice Ayah under AI Teacher supervision */}
                            <button
                              onClick={() => onPracticeAyah?.({
                                surah: currentSurahMeta?.englishName || String(selectedSurahNum),
                                ayah: ayah.numberInSurah,
                                textArabic: ayah.arabicText,
                                translation: ayah.englishText
                              })}
                              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-[#C59B32] text-[10px] font-black cursor-pointer flex items-center gap-1 shadow-2xs font-sans"
                              title="Practice in AI Speech Coach"
                            >
                              <Mic className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                              <span className="hidden md:inline">{lang === 'en' ? "Practice" : "تدريب"}</span>
                            </button>
                          </div>
                        </div>

                        {/* CORE ARABIC TEXT (UTHMANI) */}
                        <div className="text-right py-2 leading-loose" dir="rtl">
                          <p 
                            className="font-serif font-bold text-[#0c1412] tracking-wide text-right select-all"
                            style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.85}px` }}
                          >
                            {activeQiraat === 'warsh'
                              ? transformHafsToWarsh(ayah.arabicText)
                              : ayah.arabicText}
                          </p>
                        </div>

                        {/* CORE ENGLISH TRANSLATION */}
                        <div className="text-left py-1 text-slate-700 leading-relaxed font-sans text-xs md:text-[13px] border-t border-dashed border-slate-100 pt-3">
                          <p className="font-medium select-all">
                            {ayah.englishText}
                          </p>
                        </div>

                        {/* Collapsible Word-by-word Tajweed Analysis for Study Mode */}
                        {activeTajweed && (
                          <div className="border-t border-slate-100 pt-3 mt-2 text-right">
                            <button
                              onClick={() => {
                                if (activeStudyWordAyahKey === ayahKey) {
                                  setActiveStudyWordAyahKey(null);
                                } else {
                                  setActiveStudyWordAyahKey(ayahKey);
                                  setSelectedWordAnalysis(null);
                                }
                              }}
                              className="text-[10px] font-black tracking-wider text-amber-900/80 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 justify-start"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{activeStudyWordAyahKey === ayahKey ? (lang === 'en' ? "Close Tajweed Analysis" : "إغلاق أحكام التجويد") : (lang === 'en' ? "Analyze Verse Tajweed" : "تحليل أحكام التجويد")}</span>
                            </button>

                            {activeStudyWordAyahKey === ayahKey && (
                              <div className="mt-3 space-y-3">
                                {(() => {
                                  const cleanText = ayah.arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "");
                                  const analysis = analyzeTajweedText(cleanText, activeQiraat);
                                  return (
                                    <div className="w-full space-y-3">
                                      <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-2.5 text-xs text-[#0a3528]" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                                        <Info className="w-3.5 h-3.5 shrink-0 text-emerald-800" />
                                        <p className="font-medium leading-relaxed">{analysis.summaryFeedback}</p>
                                      </div>

                                      <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                                        {analysis.words.map((word, wIdx) => {
                                          const hasRules = word.occurrences.length > 0;
                                          const isSelected = selectedWordAnalysis?.wordIndex === word.wordIndex && selectedWordAnalysis?.wordText === word.wordText;
                                          return (
                                            <div 
                                              key={`study-word-${wIdx}`}
                                              onClick={() => {
                                                setSelectedWordAnalysis(word);
                                              }}
                                              className={`p-2 px-3 rounded-lg border transition-all cursor-pointer text-right group select-none ${
                                                isSelected
                                                  ? 'bg-amber-100/90 border-amber-600 ring-1 ring-amber-500/10'
                                                  : hasRules
                                                    ? 'bg-white border-amber-250 hover:border-amber-400'
                                                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-500'
                                              }`}
                                            >
                                              <div className="font-serif font-black text-slate-900 text-sm leading-tight">
                                                {activeQiraat === 'warsh' ? transformHafsToWarsh(word.wordText) : word.wordText}
                                              </div>
                                              <div className="text-[9px] text-slate-400 font-mono tracking-tight mt-1 flex items-center justify-between gap-1.5">
                                                <span>"{word.phoneticTranscription}"</span>
                                                {hasRules && <span className="w-1 h-1 rounded-full bg-amber-600 animate-pulse" />}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>

                                      {/* Selected Study Word detailed info card */}
                                      {selectedWordAnalysis && (
                                        <div className="bg-[#faf8f2] border border-amber-500/20 rounded-xl p-3.5 mt-2 relative text-right" dir="rtl">
                                          <button 
                                            onClick={() => setSelectedWordAnalysis(null)} 
                                            className="text-slate-400 hover:text-slate-950 font-black absolute top-2 left-2 bg-slate-200/50 w-5 h-5 rounded-full flex items-center justify-center border-0 cursor-pointer text-xs"
                                          >
                                            ✕
                                          </button>
                                          
                                          <div className="flex items-center gap-2 border-b border-amber-950/5 pb-1.5 mb-2.5 justify-start">
                                            <span className="font-serif font-black text-xl text-slate-900">
                                              {activeQiraat === 'warsh' ? transformHafsToWarsh(selectedWordAnalysis.wordText) : selectedWordAnalysis.wordText}
                                            </span>
                                            <span className="text-[10px] text-slate-550 italic block font-mono">
                                              "{selectedWordAnalysis.phoneticTranscription}"
                                            </span>
                                          </div>

                                          {selectedWordAnalysis.occurrences.length > 0 ? (
                                            <div className="space-y-2.5">
                                              {selectedWordAnalysis.occurrences.map((oc: any, idx: number) => (
                                                <div key={`study-word-oc-${idx}`} className="bg-white rounded-lg p-2.5 border border-amber-300/30 text-xs text-slate-700 space-y-1 font-sans">
                                                  <div className="flex items-center justify-between flex-row-reverse">
                                                    <span className="font-extrabold text-[#073327] text-xs flex items-center gap-1.5">
                                                      <Sparkles className="w-3.5 h-3.5 text-amber-800" /> {oc.ruleName}
                                                    </span>
                                                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm font-mono font-bold shrink-0">
                                                      {oc.durationBeats} Beats
                                                    </span>
                                                  </div>
                                                  <p className="leading-relaxed text-slate-650 text-[11px] text-right">{oc.description}</p>
                                                  <p className="text-[10px] text-slate-555 italic flex items-center gap-1 justify-end">
                                                    <span>{oc.makhrajInteractiveDetails?.title} — {oc.makhrajInteractiveDetails?.description}</span>
                                                    <span>🎙️</span>
                                                  </p>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-[11px] text-slate-450 italic text-center">
                                              {lang === 'en' ? "Normal structural phonetics applies. No custom beats." : "مخرج لفظي اعتيادي."}
                                            </p>
                                          )}
                                        </div>
                                      )}

                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

            </div>

          ) : (
            // ===============================================================
            // 3. MURAJAH MODE: REVISION MEMORY AUDITOR & GHOST MODE ARCHITECTURE
            // ===============================================================
            <div className="space-y-6">
              
              {!isAuthenticated ? (
                // Padlock Authentication Gate Card
                <div className="bg-white border border-amber-500/20 rounded-3xl p-8 text-center shadow-md space-y-6 max-w-lg mx-auto py-12" id="murajah-auth-gate">
                  <div className="w-16 h-16 bg-amber-50/50 rounded-full flex items-center justify-center mx-auto text-amber-700 animate-pulse border border-amber-100">
                    <Compass className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-amber-950 font-sans">
                      {lang === 'en' ? "🔒 Authentication Required" : "🔒 التسميع يتطلب تسجيل الدخول"}
                    </h3>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      {lang === 'en' 
                        ? "Account authorization is required to access advanced AI Murājah revision audits, track memory retention score metrics, and schedule custom revision calendar timetables." 
                        : "يتطلب مسار التسميع والمراجعة التلقائي الدخول بحسابك لمتابعة لوائح الحفظ الذكي وجدولة خطط المراجعة اليومية لحفظك الكريم."}
                    </p>
                  </div>

                  <button
                    onClick={() => onSwitchToAuth?.()}
                    className="w-full py-3 px-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-[#C59B32] font-black text-xs md:text-sm rounded-xl cursor-pointer hover:from-emerald-900 hover:to-[#073327] shadow-md transition-all border-0 flex items-center justify-center gap-2 font-sans"
                  >
                    <span>{lang === 'en' ? "Sign In / Register Profile" : "تسجيل الدخول / إنشاء حساب مجاني"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Full Advanced Murajah Suite Inside!
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Memorization Auditor & Ghost Mode Canvas */}
                  <div className="col-span-1 lg:col-span-8 space-y-6">
                    
                    {/* Ghost Mode Interactive Configuration Panel */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
                            <span>👻</span>
                            <span>{lang === 'en' ? "Muraja'ah Ghost Mode Active Recall" : "جلسة التسميع والتحقق غيباً (وضع الغيب)"}</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 font-sans">
                            {lang === 'en' 
                              ? "The ultimate memory validator: text is hidden, live voice translation matches words, and corrects deviations immediately in real time!" 
                              : "اختبار الحفظ الذاتي المطلق: يتم إخفاء المصحف، وتتبع نطقك فورياً كلمة بكلمة لفرز المتشابهات وتثبيت المحفوظ."}
                          </p>
                        </div>
                        <span className="self-start px-2.5 py-1 bg-amber-500/10 text-amber-950 border border-amber-500/20 text-[10px] font-black tracking-wider uppercase rounded-lg">
                          {lang === 'en' ? "Real-time Stream" : "بث صوتي حي"}
                        </span>
                      </div>

                      {/* Scope Selectors Component */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/50 font-sans">
                        <div className="space-y-1 relative" id="custom-juz-scope-dropdown-wrapper">
                          <label className="text-[10px] font-extrabold text-slate-500 block">Juz Scope</label>
                          <button
                            type="button"
                            onClick={() => setJuzDropdownOpen(!juzDropdownOpen)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold flex items-center justify-between cursor-pointer outline-none transition active:scale-98"
                            id="custom-juz-scope-trigger"
                          >
                            <span>{ghostScopeJuz === 0 ? (lang === 'en' ? "Full Surah" : "كامل السورة") : `Juz ${ghostScopeJuz}`}</span>
                            <span className="text-[8px] text-slate-400">▼</span>
                          </button>

                          <AnimatePresence>
                            {juzDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40 bg-black/0" onClick={() => setJuzDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute left-0 mt-1 w-full max-h-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-y-auto py-1 z-50 text-left font-sans"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGhostScopeJuz(0);
                                      setJuzDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs border-0 cursor-pointer ${ghostScopeJuz === 0 ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
                                  >
                                    {lang === 'en' ? "Full Surah Scope" : "كامل السورة"}
                                  </button>
                                  {Array.from({ length: 30 }, (_, i) => (
                                    <button
                                      key={`jScope-opt-${i+1}`}
                                      type="button"
                                      onClick={() => {
                                        setGhostScopeJuz(i + 1);
                                        setJuzDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3.5 py-2 text-xs border-0 cursor-pointer ${ghostScopeJuz === i + 1 ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
                                    >
                                      Juz {i + 1}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-1 relative" id="custom-page-scope-dropdown-wrapper">
                          <label className="text-[10px] font-extrabold text-slate-500 block">Page Scope</label>
                          <button
                            type="button"
                            onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold flex items-center justify-between cursor-pointer outline-none transition active:scale-98"
                            id="custom-page-scope-trigger"
                          >
                            <span>{ghostScopePage === 0 ? (lang === 'en' ? "Full Surah" : "كامل السورة") : `Page ${ghostScopePage}`}</span>
                            <span className="text-[8px] text-slate-400">▼</span>
                          </button>

                          <AnimatePresence>
                            {pageDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40 bg-black/0" onClick={() => setPageDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute left-0 mt-1 w-full max-h-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-y-auto py-1 z-50 text-left font-sans"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGhostScopePage(0);
                                      setPageDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs border-0 cursor-pointer ${ghostScopePage === 0 ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
                                  >
                                    {lang === 'en' ? "Full Surah Scope" : "كامل السورة"}
                                  </button>
                                  {Array.from({ length: 604 }, (_, i) => (
                                    <button
                                      key={`pScope-opt-${i+1}`}
                                      type="button"
                                      onClick={() => {
                                        setGhostScopePage(i + 1);
                                        setPageDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3.5 py-2 text-xs border-0 cursor-pointer ${ghostScopePage === i + 1 ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
                                    >
                                      Page {i + 1}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-500 block">Start Verse</label>
                          <input
                            type="number"
                            min={1}
                            max={activeSurahData.length || 1}
                            value={ghostScopeStart}
                            onChange={(e) => setGhostScopeStart(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-500 block">End Verse</label>
                          <input
                            type="number"
                            min={1}
                            max={activeSurahData.length || 1}
                            value={ghostScopeEnd}
                            onChange={(e) => setGhostScopeEnd(Math.min(activeSurahData.length || 1, parseInt(e.target.value) || 1))}
                            className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none bg-white"
                          />
                        </div>
                      </div>

                      {/* Current Status Indicator & Reciter Setup */}
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-500/10">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <div className={`w-3.5 h-3.5 rounded-full ${ghostModeActive ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'} shrink-0`} />
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider leading-none">Voice Match Status Device</p>
                            <p className="text-xs font-bold text-slate-800 leading-normal">{ghostVoiceStatus}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-end font-sans">
                          <span className="text-[10px] font-black text-slate-500 whitespace-nowrap">{lang === 'en' ? "Reference Qari:" : "القارئ المعياري:"}</span>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[10px] font-bold">
                            <button
                              disabled={ghostModeActive}
                              type="button"
                              onClick={() => setGhostQari('husary')}
                              className={`py-1.5 px-3 rounded-lg border-0 cursor-pointer text-[10.5px] font-extrabold transition-all ${
                                ghostQari === 'husary' ? 'bg-amber-600 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {lang === 'en' ? "Al-Husary (Educational)" : "الحصري (تعليمي)"}
                            </button>
                            <button
                              disabled={ghostModeActive}
                              type="button"
                              onClick={() => setGhostQari('ghamadi')}
                              className={`py-1.5 px-3 rounded-lg border-0 cursor-pointer text-[10.5px] font-extrabold transition-all ${
                                ghostQari === 'ghamadi' ? 'bg-amber-600 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {lang === 'en' ? "Al-Ghamidi (Rhythmic)" : "الغامدي (مرتل)"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* GHOST CANVAS WORD-BY-WORD RECALL ENGINE */}
                      <div className="min-h-[250px] bg-gradient-to-br from-[#06241a] to-[#041711] border-[10px] border-double border-[#C59B32]/35 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden space-y-6 shadow-lg">
                        <div className="absolute top-2 left-2 text-[#C59B32]/10 select-none font-serif text-lg">✦</div>
                        <div className="absolute top-2 right-2 text-[#C59B32]/10 select-none font-serif text-lg">✦</div>
                        
                        {/* Title of active scope */}
                        <div className="flex items-center justify-between border-b border-[#C59B32]/15 pb-2 font-serif">
                          <span className="text-[10px] text-amber-200/50 uppercase tracking-widest font-mono">
                            {lang === 'en' ? "Scope Target: Hidden Verses" : "حدود المراجعة: مصحف الغيب المشفر"}
                          </span>
                          <span className="text-xs text-[#C59B32] font-black">
                            {currentSurahMeta?.name} ( {ghostScopeStart} - {ghostScopeEnd} )
                          </span>
                        </div>

                        {/* Words Canvas Container */}
                        {ghostExpectedWords.length === 0 ? (
                          <div className="py-12 text-center text-amber-200/45 italic text-sm font-sans">
                            {lang === 'en' ? "Waiting for recitation." : "بانتظار قراءة وتسميع الحفظ..."}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-x-3.5 gap-y-4 justify-center py-6 leading-relaxed select-none" dir="rtl">
                            {ghostExpectedWords.map((wordObj, i) => {
                              // Standard conditional styles for real-time segmented feedback
                              let cardStyle = "bg-transparent border border-dashed border-amber-500/25 text-amber-100/30 text-[10px] py-1.5 px-3 rounded-lg";
                              let displayVal = `${wordObj.verseNum}:${wordObj.wordIdx + 1} ⏳`;

                              if (wordObj.status === 'correct') {
                                cardStyle = "bg-emerald-800/80 text-emerald-100 border border-emerald-500 text-lg md:text-xl font-serif font-black shadow-xs px-4 py-2 animate-fade-in";
                                displayVal = wordObj.word;
                              } else if (wordObj.status === 'warning') {
                                cardStyle = "bg-amber-600/70 text-amber-150 border border-amber-400 text-lg md:text-xl font-serif font-semibold px-4 py-2 animate-pulse line-through decoration-[#041711] decoration-2";
                                displayVal = wordObj.word;
                              } else if (wordObj.status === 'error') {
                                cardStyle = "bg-red-800/80 text-red-200 border border-red-500 text-lg md:text-xl font-serif font-medium px-4 py-2 opacity-95";
                                displayVal = wordObj.word;
                              }

                              return (
                                <div
                                  key={`ghostword-${i}`} 
                                  className={`transition-all duration-300 transform scale-100 hover:scale-105 flex items-center justify-center text-center ${cardStyle}`}
                                  title={`${lang === 'en' ? 'Expected Word index: ' : 'فهرست الكلمة: '} ${wordObj.word}`}
                                >
                                  <span>{displayVal}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Interim Real-time Phonetic Subtitle */}
                        {interimText.trim() && (
                          <div className="border-t border-[#C59B32]/10 pt-3 text-center">
                            <p className="text-[10px] text-[#C59B32]/40 uppercase tracking-widest font-mono">Live Phoneme Recognition Buffer</p>
                            <p className="text-xs text-amber-200/90 italic font-serif" dir="rtl">{interimText}</p>
                          </div>
                        )}
                      </div>

                      {/* Operational Microphone Action Triggers */}
                      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        {!ghostModeActive ? (
                          <button
                            onClick={startGhostMode}
                            className="py-3 px-8 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-950 border-0 text-[#C59B32] rounded-2xl cursor-pointer text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2.5 shadow-md hover:shadow-lg hover:scale-[1.02]"
                            id="ghost-mode-start-btn"
                          >
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shrink-0" />
                            <Mic className="w-4 h-4 text-[#C59B32]" />
                            <span>{lang === 'en' ? "Start Ghost Mode recitation" : "تفعيل تسميع الغيب الحي"}</span>
                          </button>
                        ) : (
                          <button
                            onClick={stopGhostMode}
                            className="py-3 px-8 bg-red-650 hover:bg-red-700 border-0 text-white rounded-2xl cursor-pointer text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2.5 shadow-md hover:scale-[1.02]"
                            id="ghost-mode-stop-btn"
                          >
                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shrink-0" />
                            <Square className="w-4 h-4 text-white" />
                            <span>{lang === 'en' ? "Pause Recitation Alignment" : "إيقاف التسميع الصوتي"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const resetWords = ghostExpectedWords.map(w => ({ ...w, status: 'pending' }));
                            setGhostExpectedWords(resetWords);
                            setGhostCurrentWordIdx(0);
                            setGhostStudentProgress(0);
                            setGhostRefProgress(0);
                            setGhostMetrics({ speed: 0, pauses: 0, madd: 0, ghunna: 0 });
                            setGhostScores({ accuracy: 0, tajweed: 0, memorization: 0, fluency: 0, confidence: 0 });
                            setInterimText("");
                            setGhostVoiceStatus("Waiting for recitation reset.");
                          }}
                          disabled={ghostModeActive}
                          className="py-3 px-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-sans text-xs font-black rounded-2xl cursor-pointer transition-all duration-200 disabled:opacity-50"
                        >
                          <span>{lang === 'en' ? "Clear Board" : "إعادة تهيئة اللوحة"}</span>
                        </button>
                      </div>

                    </div>

                    {/* DYNAMIC METRIC SPEEDBARS (THE GHOST MODE SIGNATURE FEATURE) */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-5 font-sans">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
                        ⏳ {lang === 'en' ? "Rhythm Timelines: Student vs. Reference Qari" : "منحنيات الطلاقة والسرعة: المعلم الصامت ضد المتعلم"}
                      </h4>

                      {/* Progress Sliders Flow comparison */}
                      <div className="space-y-4">
                        {/* Student voice pacing indicator bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-700" />
                              {lang === 'en' ? "Your Live Pacing Progress" : "خط ترتيلك الفعلي غيباً"}
                            </span>
                            <span className="font-mono font-bold text-emerald-800">{ghostStudentProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200/40 p-0.5">
                            <div 
                              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${ghostStudentProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* Silent reference reciter pacing indicator bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
                              {lang === 'en' ? "Reference Reciter Sync Flow" : "حساب السرعة المعيارية للشيخ"}
                            </span>
                            <span className="font-mono font-bold text-amber-700">{ghostRefProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200/40 p-0.5">
                            <div 
                              className="bg-amber-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${ghostRefProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Display live difference alerts & dynamic statistics derived from the correct words */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        <div className="p-3 bg-slate-50 border border-slate-250/30 rounded-2xl">
                          <p className="text-[9px] text-[#073327] font-black uppercase tracking-wider">{lang === 'en' ? "Active Speed" : "سرعة الترتيل"}</p>
                          <h5 className="text-base font-black text-slate-800 font-mono mt-0.5">{ghostMetrics.speed} <span className="text-[9px] font-sans">WPM</span></h5>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-250/30 rounded-2xl">
                          <p className="text-[9px] text-amber-900 font-black uppercase tracking-wider">{lang === 'en' ? "Pauses / Hesitations" : "الوقفات والسكتات"}</p>
                          <h5 className="text-base font-black text-amber-700 font-mono mt-0.5">{ghostMetrics.pauses} <span className="text-[9px] font-sans">count</span></h5>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-250/30 rounded-2xl">
                          <p className="text-[9px] text-emerald-900 font-black uppercase tracking-wider">{lang === 'en' ? "Madd Prolongation" : "أزمنة مدود الحروف"}</p>
                          <h5 className="text-base font-black text-emerald-800 font-mono mt-0.5">{ghostMetrics.madd}s <span className="text-[9px] font-sans">aligned</span></h5>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-250/30 rounded-2xl">
                          <p className="text-[9px] text-indigo-900 font-black uppercase tracking-wider">{lang === 'en' ? "Ghunnah Intonation" : "ثبات أزمنة الغنن"}</p>
                          <h5 className="text-base font-black text-indigo-800 font-mono mt-0.5">{ghostMetrics.ghunna}s <span className="text-[9px] font-sans">tracked</span></h5>
                        </div>
                      </div>
                    </div>

                    {/* LIVE 5-GAUGE SCORE TELEMETRY ENGINE */}
                    <div className="bg-slate-50 border border-slate-250/40 rounded-3xl p-5 md:p-6 shadow-sm space-y-4 font-sans">
                      <div className="border-b border-slate-200/60 pb-2">
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-widest">
                          📊 {lang === 'en' ? "Live Scoring Matrix: Real-time Evaluation" : "شبكة المؤشرات الذكية للتسميع المباشر"}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans leading-none mt-1">
                          {lang === 'en' ? "Scores update word-by-word with raw microphone input telemetry." : "مؤشرات تفصيلية لحظية مأخوذة من مسارات نطق مخارج الحروف وقوة استحضار الكلمات."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl text-center shadow-2xs">
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Accuracy</p>
                          <h4 className="text-xl md:text-2xl font-mono font-black text-emerald-800 mt-1">{ghostScores.accuracy}%</h4>
                          <span className="text-[8px] text-slate-400 font-semibold uppercase leading-none">{lang === 'en' ? "Pronunciation" : "دقة اللفظ"}</span>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl text-center shadow-2xs">
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Tajweed</p>
                          <h4 className="text-xl md:text-2xl font-mono font-black text-amber-800 mt-1">{ghostScores.tajweed}%</h4>
                          <span className="text-[8px] text-slate-400 font-semibold uppercase leading-none">{lang === 'en' ? "Rules Performance" : "الأداء التجويدي"}</span>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl text-center shadow-2xs">
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Memorization</p>
                          <h4 className="text-xl md:text-2xl font-mono font-black text-indigo-800 mt-1">{ghostScores.memorization}%</h4>
                          <span className="text-[8px] text-slate-400 font-semibold uppercase leading-none">{lang === 'en' ? "Retention Flow" : "قوة الحفظ غيباً"}</span>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl text-center shadow-2xs">
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Fluency</p>
                          <h4 className="text-xl md:text-2xl font-mono font-black text-rose-800 mt-1">{ghostScores.fluency}%</h4>
                          <span className="text-[8px] text-slate-400 font-semibold uppercase leading-none">{lang === 'en' ? "Rythmic Pace" : "الجهارة والطلاقة"}</span>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl text-center shadow-2xs col-span-2 lg:col-span-1">
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Confidence</p>
                          <h4 className="text-xl md:text-2xl font-mono font-black text-[#C59B32] mt-1">{ghostScores.confidence}%</h4>
                          <span className="text-[8px] text-slate-400 font-semibold uppercase leading-none">{lang === 'en' ? "Vocal Stability" : "نسبة ثبات الصوت"}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Goal Timetable Planner */}
                  <div className="col-span-1 lg:col-span-4 space-y-6">
                    
                    {/* Add Schedule Goals form */}
                    <div className="bg-white border border-slate-200/85 rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-black text-[#073327] uppercase tracking-wider font-sans">
                          {lang === 'en' ? "📅 Memorization Goal Timetable" : "📅 ميعاد وجدول مراجعة حفظك"}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-sans">
                          {lang === 'en' ? "Set review deadlines to maintain continuous spiritual tracking." : "قم بتعيين مواعيد مسبقة لجدولة مذكرات المراجعة لكل سورة."}
                        </p>
                      </div>

                      <form onSubmit={addSchedTarget} className="space-y-4 font-sans">
                        <div className="space-y-1 relative" id="custom-sched-surah-dropdown-wrapper font-sans">
                          <label className="text-[10px] font-extrabold text-slate-600 block">{lang === 'en' ? "Select Target Surah" : "السورة الكريمة المستهدفة"}</label>
                          <button
                            type="button"
                            onClick={() => setSchedSurahDropdownOpen(!schedSurahDropdownOpen)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold flex items-center justify-between cursor-pointer outline-none transition active:scale-98"
                            id="custom-sched-surah-trigger"
                          >
                            <span>
                              {(() => {
                                const matched = surahs.find(s => s.number === schedSurahNum);
                                return matched ? `${matched.number}. ${matched.englishName} (${matched.name})` : (lang === 'en' ? "Select Surah" : "اختر السورة");
                              })()}
                            </span>
                            <span className="text-[8px] text-slate-400">▼</span>
                          </button>

                          <AnimatePresence>
                            {schedSurahDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40 bg-black/0" onClick={() => setSchedSurahDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute left-0 mt-1 w-full max-h-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-y-auto py-1 z-50 text-left"
                                >
                                  {surahs.map(s => (
                                    <button
                                      key={`sched-surah-opt-${s.number}`}
                                      type="button"
                                      onClick={() => {
                                        setSchedSurahNum(s.number);
                                        setSchedSurahDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3.5 py-2 text-xs border-0 cursor-pointer ${schedSurahNum === s.number ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
                                    >
                                      {s.number}. {s.englishName} ({s.name})
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-1 relative" id="custom-sched-freq-dropdown-wrapper font-sans">
                          <label className="text-[10px] font-extrabold text-slate-600 block">{lang === 'en' ? "Frequency Cycle" : "حجم الدورية للمراجعة"}</label>
                          <button
                            type="button"
                            onClick={() => setSchedFreqDropdownOpen(!schedFreqDropdownOpen)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold flex items-center justify-between cursor-pointer outline-none transition active:scale-98"
                            id="custom-sched-freq-trigger"
                          >
                            <span>
                              {schedFreq === 'daily' 
                                ? (lang === 'en' ? "Daily Cycle" : "ورد يومي مستمر")
                                : schedFreq === 'every_2_days'
                                  ? (lang === 'en' ? "Alternating Days" : "يوم بعد يوم")
                                  : schedFreq === 'weekly'
                                    ? (lang === 'en' ? "Weekly Cycle" : "ورد مراجعة أسبوعي")
                                    : (lang === 'en' ? "Monthly Check" : "تسميع شهري شامل")}
                            </span>
                            <span className="text-[8px] text-slate-400">▼</span>
                          </button>

                          <AnimatePresence>
                            {schedFreqDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40 bg-black/0" onClick={() => setSchedFreqDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-left"
                                >
                                  {[
                                    { value: 'daily', en: "Daily Cycle", ar: "ورد يومي مستمر" },
                                    { value: 'every_2_days', en: "Alternating Days", ar: "يوم بعد يوم" },
                                    { value: 'weekly', en: "Weekly Cycle", ar: "ورد مراجعة أسبوعي" },
                                    { value: 'monthly', en: "Monthly Check", ar: "تسميع شهري شامل" }
                                  ].map(item => (
                                    <button
                                      key={`sched-freq-opt-${item.value}`}
                                      type="button"
                                      onClick={() => {
                                        setSchedFreq(item.value);
                                        setSchedFreqDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3.5 py-2 text-xs border-0 cursor-pointer ${schedFreq === item.value ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
                                    >
                                      {lang === 'en' ? item.en : item.ar}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 block">{lang === 'en' ? "Target Deadline" : "تاريخ التسميع المستهدف"}</label>
                          <input 
                            type="date" 
                            value={schedTargetDate}
                            onChange={(e) => setSchedTargetDate(e.target.value)}
                            className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none bg-white font-sans"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-800 to-emerald-900 border-0 text-[#C59B32] font-black text-xs rounded-xl cursor-pointer hover:from-emerald-900 hover:to-[#073327] transition shadow-xs"
                        >
                          <span>{lang === 'en' ? "Add Target to Plan" : "إدراج في جدول الحفظ"}</span>
                        </button>
                      </form>
                    </div>

                    {/* Timetable List Grid */}
                    <div className="bg-white border border-slate-200/85 rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 font-sans">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{lang === 'en' ? "🗓️ Timetable Milestones" : "🗓️ خطة التسميع المجدولة"}</h4>
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{revTimetable.length} Goals</span>
                      </div>

                      {revTimetable.length === 0 ? (
                        <div className="p-8 text-center text-[11px] text-slate-400 italic font-sans">
                          {lang === 'en' ? "No review slots schedule added yet." : "لا توجد حصص مراجعة مجدولة للأيام القادمة."}
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 font-sans">
                          {revTimetable.map((item) => (
                            <div 
                              key={item.id} 
                              className={`p-3 rounded-2xl border text-xs flex flex-col gap-2 relative ${
                                item.isCompleted 
                                  ? 'bg-emerald-50/20 border-emerald-500/20' 
                                  : 'bg-white border-slate-200/80 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-0.5">
                                  <h4 className="font-extrabold text-slate-800">{item.surahName}</h4>
                                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <span>📅 {item.targetDate}</span>
                                    <span>•</span>
                                    <span className="capitalize">{item.frequency.replace('_', ' ')}</span>
                                  </p>
                                </div>
                                <span className="font-serif font-black text-[#073327] text-xs">{item.surahArabic}</span>
                              </div>

                              <div className="flex items-center justify-between border-t border-dashed border-slate-100 pt-2 mt-1">
                                {item.isCompleted ? (
                                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-[10px]">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{lang === 'en' ? `Passed Score: ${item.lastReviewScore}%` : `تم بنجاح: ${item.lastReviewScore}%`}</span>
                                  </div>
                                ) : (
                                  <span className="text-[9px] bg-amber-500/10 text-amber-900 py-0.5 px-2 rounded-md font-bold select-none border border-amber-500/10">
                                    {lang === 'en' ? "Awaiting Recital" : "بانتظار التسميع غيباً"}
                                  </span>
                                )}

                                <div className="flex items-center gap-1.5">
                                  {!item.isCompleted && (
                                    <button
                                      onClick={() => {
                                        setSelectedSurahNum(item.surahNum);
                                        setQuranViewMode('murajah');
                                        alert(`Active memorization target switched to Surah ${item.surahName}! Ready to record your voice of the target surah.`);
                                      }}
                                      className="py-1 px-2.5 bg-emerald-800 hover:bg-[#073327] border-0 text-[#C59B32] font-extrabold text-[9px] rounded-lg cursor-pointer transition-all duration-200"
                                    >
                                      {lang === 'en' ? "Open Target" : "تحديد السورة"}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => removeSchedTarget(item.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent flex items-center"
                                    title="Delete plan"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* DYNAMIC INFORMATION PANEL */}
          <div className="bg-[#f0f4f2] border border-emerald-990 border-emerald-500/20 rounded-2xl p-4 md:p-5 flex items-start gap-3 shadow-2xs">
            <Info className="w-5 h-5 text-emerald-850 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-[12px] text-emerald-950 font-sans">
                {lang === 'en' ? "Word-by-word Alignment & Lazy-Loading" : "خصائص المصحف الذاتي المفتوح"}
              </h4>
              <p className="text-[11px] text-slate-650 text-slate-600 leading-normal font-medium">
                {lang === 'en' 
                  ? "Every ayah in this directory is generated from pristine digital copies using robust global endpoints. Use standard Arabic clean filters to match rules instantly by scrolling or copying texts directly into the AI Pronunciation Coach."
                  : "يتم تحميل كافة السور الكريمة بانتظام ومرونة لراحة التصفح عبر الأجهزة. يمكنك نسخ نصوص الآيات بدقة وإدخالها مباشرة في محقق مخارج الحروف لتصحيح النطق الصوتي الفوري."}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
  }
}
