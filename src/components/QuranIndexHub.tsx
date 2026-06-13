import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Bookmark, ChevronLeft, RefreshCw, AlertCircle
} from 'lucide-react';

interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface QuranIndexHubProps {
  lang: 'en' | 'ar';
  surahs: SurahMeta[];
  loadingList: boolean;
  surahSearch: string;
  setSurahSearch: (s: string) => void;
  indexTab: 'surahs' | 'juz' | 'bookmarks';
  setIndexTab: (t: 'surahs' | 'juz' | 'bookmarks') => void;
  bookmarkedVerses: string[];
  setSelectedSurahNum: (n: number) => void;
  setShowReader: (b: boolean) => void;
  initialTargetAyahNumRef: React.MutableRefObject<number | null>;
  errorMsg: string | null;
  getSurahStartPage: (num: number) => number;
  JUZ_LIST: any[];
}

export default function QuranIndexHub({
  lang,
  surahs,
  loadingList,
  surahSearch,
  setSurahSearch,
  indexTab,
  setIndexTab,
  bookmarkedVerses,
  setSelectedSurahNum,
  setShowReader,
  initialTargetAyahNumRef,
  errorMsg,
  getSurahStartPage,
  JUZ_LIST
}: QuranIndexHubProps) {

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

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-24 font-sans selection:bg-amber-500/20 selection:text-amber-800" id="quran-catalog-index">
      
      {/* HEADER BAR */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <BookOpen className="w-5.5 h-5.5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-widest font-mono uppercase">
                {lang === 'en' ? "AL-QUR'AN" : "القرآن الكريم"}
              </h1>
              <p className="text-[10px] text-amber-700/80 font-serif italic tracking-wide">
                {lang === 'en' ? "Modular Divine Revelation Hub" : "تصفح ميسر مع التلاوة والتجويد"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] bg-slate-100 text-slate-650 font-mono font-black uppercase px-2.5 py-1 rounded border border-slate-200 tracking-wider">
              {lang === 'en' ? "OFFLINE AUDIO ENGINE" : "المزامنة الصوتية"}
            </span>
          </div>
        </div>
      </div>

      {/* DYNAMIC ERROR MESSAGE */}
      {errorMsg && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-800 text-xs font-bold">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* TAB BAR IN INDEX DECK */}
      <div className="max-w-2xl mx-auto px-4 mt-8" id="quran-index-tabs-parent">
        <div className="bg-white p-1.5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 border border-slate-200/80 gap-1.5 shadow-sm">
          {(['surahs', 'juz', 'bookmarks'] as const).map((tab) => {
            const isActive = indexTab === tab;
            const labels: Record<string, string> = {
              surahs: lang === 'en' ? 'SURAHS' : 'فهرس السور',
              juz: lang === 'en' ? "JUZ' SECTION (30)" : 'أجزاء المصحف',
              bookmarks: lang === 'en' ? 'MY BOOKMARKS' : 'الآيات المحفوظة'
            };
            return (
              <button
                key={tab}
                onClick={() => setIndexTab(tab)}
                className={`w-full py-3 text-[10px] sm:text-xs font-extrabold tracking-wider sm:tracking-widest rounded-xl cursor-pointer transition-all duration-200 border-0 ${
                  isActive 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 bg-transparent'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT VIEWPORTS CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`index-tab-view-${indexTab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* 1. SURAHS LISTING WITH SEARCH */}
            {indexTab === 'surahs' && (
              <div className="space-y-6" id="index-category-surahs">
                
                {/* Search Input */}
                <div className="max-w-xl mx-auto relative shadow-sm rounded-2xl overflow-hidden bg-white border border-slate-200">
                  <Search className="w-4 h-4 text-[#C59B32] absolute left-4.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder={lang === 'en' ? "Search surah by name, number, or keyword..." : "ابحث برقم السورة أو اسمها باللغة العربية والعلمية..."}
                    value={surahSearch}
                    onChange={(e) => setSurahSearch(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 bg-transparent text-sm text-slate-800 placeholder-slate-400 border-0 outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                    id="index-search-input"
                  />
                </div>

                {/* Surah List */}
                {loadingList ? (
                  <div className="py-24 text-center text-sm text-slate-500 font-medium space-y-3 flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                    <span>{lang === 'en' ? "Downloading chapters list..." : "جاري تحميل فهرس السور المباركة..."}</span>
                  </div>
                ) : filteredSurahs.length === 0 ? (
                  <div className="py-16 text-center text-slate-450 italic text-sm">
                    {lang === 'en' ? "No chapter matching this search." : "لم يتم العثور على سورة مطابقة."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredSurahs.map((surah) => (
                      <div
                        key={`index-surah-card-${surah.number}`}
                        onClick={() => {
                          setSelectedSurahNum(surah.number);
                          setShowReader(true);
                        }}
                        className="bg-white hover:bg-amber-50/15 border border-slate-200 hover:border-amber-500/40 rounded-3xl p-5 transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-mono font-black text-xs text-slate-650 border border-slate-200/60 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-700 transition">
                            {surah.number}
                          </div>
                          <div className="text-left">
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                              {surah.englishName}
                            </h3>
                            <p className="text-[10px] text-slate-500 group-hover:text-slate-650 capitalize mt-0.5 transition-colors">
                              {surah.englishNameTranslation} • {surah.revelationType}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-sm font-extrabold text-slate-800 font-serif pr-1">
                            {surah.name}
                          </span>
                          <span className="block text-[9px] text-slate-400 mt-0.5 tracking-tight uppercase">
                            {surah.numberOfAyahs} {lang === 'en' ? 'verses' : 'آية'} • Page {getSurahStartPage(surah.number)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. JUZ LIST CATEGORIES */}
            {indexTab === 'juz' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="index-category-juz">
                {JUZ_LIST.map((j) => (
                  <div
                    key={`index-juz-card-${j.juz}`}
                    onClick={() => {
                      setSelectedSurahNum(j.startSurah);
                      initialTargetAyahNumRef.current = j.startAyah;
                      setShowReader(true);
                    }}
                    className="bg-white hover:bg-amber-50/15 border border-slate-200 hover:border-amber-500/45 rounded-3xl p-5 transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200/60 group-hover:bg-amber-600 transition">
                        <span className="text-[8px] text-slate-450 group-hover:text-white uppercase font-black tracking-widest font-mono">JUZ'</span>
                        <span className="font-mono font-black text-sm text-slate-700 group-hover:text-white -mt-0.5">{j.juz}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                          {lang === 'en' ? `Juz' ${j.juz}` : `الجزء ${j.juz}`}
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {lang === 'en' ? `Starts at Surah ${j.startSurahName}` : `يبدأ عند سورة ${j.startSurahName}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-xs font-serif text-amber-700">
                        {j.startSurahAr}
                      </span>
                      <span className="block text-[9px] text-slate-400 font-mono tracking-tight uppercase mt-1">
                        Page {j.page} • Ayah {j.startAyah}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. BOOKMARKS COMPARTMENT */}
            {indexTab === 'bookmarks' && (
              <div className="max-w-3xl mx-auto space-y-4" id="index-category-bookmarks">
                {bookmarkedVerses.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-slate-500 text-xs italic space-y-3 shadow-xs">
                    <Bookmark className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                    <p>{lang === 'en' ? "You have no bookmarks saved yet. Click the bookmark icon on any verse while reading to save it here." : "فهرس المحفوظات فارغ حالياً. اضغط علامة الحفظ المجاورة للآية في صفحة المصحف لتجدها محفوظة هنا للوصول السريع."}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedVerses.map((bKey) => {
                      const [sNumStr, aNumStr] = bKey.split(':');
                      const sNum = parseInt(sNumStr);
                      const aNum = parseInt(aNumStr);
                      const sMeta = surahs.find(s => s.number === sNum);
                      return (
                        <div 
                          key={`index-bookmark-row-${bKey}`}
                          onClick={() => {
                            setSelectedSurahNum(sNum);
                            initialTargetAyahNumRef.current = aNum;
                            setShowReader(true);
                          }}
                          className="bg-white hover:bg-amber-50/15 border border-slate-200 hover:border-amber-500 rounded-2xl p-4.5 transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center font-mono font-bold text-xs text-amber-600">
                              🔖
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                                {sMeta?.englishName || `Surah ${sNum}`}
                              </h4>
                              <p className="text-[9px] text-amber-600 uppercase font-mono font-bold mt-0.5">
                                Verse {aNum}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="block text-xs font-serif text-slate-800">
                              {sMeta?.name}
                            </span>
                            <span className="block text-[8px] text-slate-400 tracking-wider font-mono mt-0.5">
                              TAP TO GO
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
