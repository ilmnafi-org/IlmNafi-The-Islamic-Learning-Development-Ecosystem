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
  Book, LayoutList, Share2, Copy
} from 'lucide-react';

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
  audioUrl?: string;
  juz?: number;
  page?: number;
}

interface QuranExplorerProps {
  lang: 'en' | 'ar';
}

export default function QuranExplorer({ lang }: QuranExplorerProps) {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [activeSurahData, setActiveSurahData] = useState<AyahPair[]>([]);
  const [currentSurahMeta, setCurrentSurahMeta] = useState<SurahMeta | null>(null);

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
  // 'mushaf' yields continuous authentic paper book text, 'study' yields the list view
  const [quranViewMode, setQuranViewMode] = useState<'mushaf' | 'study'>('mushaf');
  const [selectedAyahInMushaf, setSelectedAyahInMushaf] = useState<AyahPair | null>(null);

  // Pagination inside the active Surah (for Mushaf Mode)
  const [mushafPage, setMushafPage] = useState<number>(1);
  const versesPerPage = 8; // Number of high-density verses per paper slide for elegant layout

  // Audio Playback states
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  // Load selected Surah with both Arabic text and Sahih International translation
  useEffect(() => {
    let active = true;
    const fetchSelectedSurah = async () => {
      if (!selectedSurahNum) return;
      try {
        setLoadingSurah(true);
        // We use Uthmani script and English Sahih International translation
        const url = `https://api.alquran.cloud/v1/surah/${selectedSurahNum}/editions/quran-uthmani,en.sahih`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Unable to extract verse tokens.');
        const json = await res.json();
        
        if (active && json.data && json.data.length >= 2) {
          const arabicAyahs = json.data[0].ayahs;
          const englishAyahs = json.data[1].ayahs;
          
          const combined: AyahPair[] = arabicAyahs.map((ar: any, idx: number) => {
            const en = englishAyahs[idx] || { text: '' };
            // Audio URL format: (using Al-Ghamadi recitations)
            const paddedSurah = String(selectedSurahNum).padStart(3, '0');
            const paddedAyah = String(ar.numberInSurah).padStart(3, '0');
            const audioLink = `https://everyayah.com/data/Al_Ghamadi_40kbps/${paddedSurah}${paddedAyah}.mp3`;
            
            return {
              number: ar.number,
              numberInSurah: ar.numberInSurah,
              arabicText: ar.text,
              englishText: en.text,
              audioUrl: audioLink,
              juz: ar.juz,
              page: ar.page
            };
          });
          
          setActiveSurahData(combined);
          setMushafPage(1); // reset to first page when Surah changes
          
          // Select first verse as default for the Mushaf translation deck
          if (combined.length > 0) {
            setSelectedAyahInMushaf(combined[0]);
          }

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
  }, [selectedSurahNum, surahs]);

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

  // Play audio for a single verse
  const playAyahAudio = (ayahKey: string, audioUrl: string) => {
    if (playingAyahKey === ayahKey) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingAyahKey(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    setPlayingAyahKey(ayahKey);
    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;
    audio.play().catch(e => {
      console.warn("Audio play interrupted/blocked:", e);
      setPlayingAyahKey(null);
    });

    audio.onended = () => {
      setPlayingAyahKey(null);
    };
  };

  // Copy verse to clipboard
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Clean memory on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
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
            <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto">
              <button
                onClick={() => setQuranViewMode('mushaf')}
                className={`flex-1 sm:flex-initial py-2 px-5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer border-0 ${
                  quranViewMode === 'mushaf' 
                    ? 'bg-amber-950 text-[#C59B32] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="view-mode-mushaf-btn"
              >
                <Book className="w-4 h-4" />
                <span>{lang === 'en' ? "📖 Mushaf Mode (Page View)" : "📖 المصحف الكريم (الصفحي)"}</span>
              </button>
              <button
                onClick={() => setQuranViewMode('study')}
                className={`flex-1 sm:flex-initial py-2 px-5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer border-0 ${
                  quranViewMode === 'study' 
                    ? 'bg-amber-950 text-[#C59B32] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="view-mode-study-btn"
              >
                <LayoutList className="w-4 h-4" />
                <span>{lang === 'en' ? "📝 Study Mode (Reference)" : "📝 منهج التراجم والتفاسير"}</span>
              </button>
            </div>

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
                                {v.arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")}{" "}
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
                      </div>
                    </div>

                    {/* Side-by-side or stacked display */}
                    <div className="space-y-3 font-sans">
                      <div className="bg-white/50 border border-amber-900/5 rounded-xl p-3 text-right" dir="rtl">
                        <p className="font-serif font-bold text-[#0c1412] text-lg leading-relaxed">
                          {selectedAyahInMushaf.arabicText}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-left">
                        <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">English Sahih Translation</span>
                        <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
                          {selectedAyahInMushaf.englishText}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          ) : (
            
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
                          </div>
                        </div>

                        {/* CORE ARABIC TEXT (UTHMANI) */}
                        <div className="text-right py-2 leading-loose" dir="rtl">
                          <p 
                            className="font-serif font-bold text-[#0c1412] tracking-wide text-right select-all"
                            style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.85}px` }}
                          >
                            {ayah.arabicText}
                          </p>
                        </div>

                        {/* CORE ENGLISH TRANSLATION */}
                        <div className="text-left py-1 text-slate-700 leading-relaxed font-sans text-xs md:text-[13px] border-t border-dashed border-slate-100 pt-3">
                          <p className="font-medium select-all">
                            {ayah.englishText}
                          </p>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

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
