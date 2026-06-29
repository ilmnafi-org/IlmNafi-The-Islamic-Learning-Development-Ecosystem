import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowRight, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuranLibrary = () => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  useEffect(() => {
    fetch('https://api.quran.com/api/v4/chapters?language=en')
      .then(res => res.json())
      .then(data => {
        setChapters(data.chapters);
        setLoading(false);
      });
  }, []);

  const fetchVerses = (chapterId: number) => {
    setLoadingVerses(true);
    // Fetch Arabic text
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${chapterId}`)
      .then(res => res.json())
      .then(arabicData => {
        // Fetch English translation (Clear Quran - 131 or Sahih International - 20)
        fetch(`https://api.quran.com/api/v4/quran/translations/131?chapter_number=${chapterId}`)
          .then(res => res.json())
          .then(translationData => {
            const combined = arabicData.verses.map((v: any, i: number) => ({
              id: v.id,
              verse_key: v.verse_key,
              text_uthmani: v.text_uthmani,
              translation: translationData.translations[i]?.text
            }));
            setVerses(combined);
            setLoadingVerses(false);
          });
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (selectedChapter) {
    return (
      <div className="animate-in fade-in duration-500">
        <button 
          onClick={() => setSelectedChapter(null)}
          className="flex items-center text-xs font-mono text-slate-500 hover:text-amber-800 mb-8 transition-colors uppercase tracking-widest"
        >
          <ArrowRight className="w-4 h-4 rotate-180 mr-2" strokeWidth={1.5} /> Back to Surahs
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">{selectedChapter.name_simple}</h2>
          <p className="text-2xl font-arabic text-amber-800 mb-4">{selectedChapter.name_arabic}</p>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-mono">{selectedChapter.translated_name.name} • {selectedChapter.revelation_place} • {selectedChapter.verses_count} Verses</p>
        </div>

        {loadingVerses ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          </div>
        ) : (
          <div className="space-y-12 max-w-4xl mx-auto">
            {verses.map((verse) => (
              <div key={verse.id} className="border-b border-slate-200 pb-8">
                <div className="flex justify-between items-start gap-8 mb-6">
                  <span className="text-amber-800/50 font-mono text-sm shrink-0 mt-2">{verse.verse_key}</span>
                  <p className="text-3xl leading-loose font-arabic text-right text-slate-900" dir="rtl">
                    {verse.text_uthmani}
                  </p>
                </div>
                <div dangerouslySetInnerHTML={{ __html: verse.translation }} className="text-slate-600 font-serif leading-relaxed text-lg pl-12" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          onClick={() => {
            setSelectedChapter(chapter);
            fetchVerses(chapter.id);
          }}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all rounded-sm text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center font-mono text-sm text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-800 group-hover:border-amber-200 transition-colors">
              {chapter.id}
            </div>
            <div>
              <h4 className="font-serif font-medium text-slate-900 group-hover:text-amber-900">{chapter.name_simple}</h4>
              <p className="text-xs text-slate-500">{chapter.translated_name.name}</p>
            </div>
          </div>
          <div className="text-xl font-arabic text-amber-800/70 group-hover:text-amber-800 transition-colors">
            {chapter.name_arabic}
          </div>
        </button>
      ))}
    </div>
  );
};
