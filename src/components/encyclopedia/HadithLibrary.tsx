import React, { useState, useEffect } from 'react';
import { Book, ArrowRight, Loader2 } from 'lucide-react';

const collectionMetadata: Record<string, { desc: string, count: string, compiler: string, era: string }> = {
  bukhari: {
    desc: "The most authentic book of Hadith, compiled by Imam Al-Bukhari, focusing strictly on highly authenticated prophetic narrations.",
    count: "~7,563 Hadiths",
    compiler: "Imam Al-Bukhari",
    era: "194 - 256 AH"
  },
  muslim: {
    desc: "A highly rigorous, authentic compilation second only to Sahih al-Bukhari, compiled by Imam Muslim ibn al-Hajjaj.",
    count: "~7,500 Hadiths",
    compiler: "Imam Muslim",
    era: "204 - 261 AH"
  },
  abudawud: {
    desc: "A major canonical collection focusing extensively on Sunan (legal rulings and traditions) of jurisprudence.",
    count: "~5,274 Hadiths",
    compiler: "Imam Abu Dawud",
    era: "202 - 275 AH"
  },
  tirmidhi: {
    desc: "A comprehensive collection renowned for its discussion of grades of authenticity and comparative legal schools.",
    count: "~3,956 Hadiths",
    compiler: "Imam At-Tirmidhi",
    era: "209 - 279 AH"
  },
  nasai: {
    desc: "Characterized by its extremely rigorous rules of selection and categorization, compiled by Imam An-Nasa'i.",
    count: "~5,758 Hadiths",
    compiler: "Imam An-Nasa'i",
    era: "215 - 303 AH"
  },
  ibnmajah: {
    desc: "One of the six major canonical books, compiled by Imam Ibn Majah, featuring extensive legal topics.",
    count: "~4,341 Hadiths",
    compiler: "Imam Ibn Majah",
    era: "209 - 273 AH"
  },
  malik: {
    desc: "One of the earliest compiled books of Islamic law and Prophetic traditions, written by the Imam of Madinah.",
    count: "~1,720 Hadiths",
    compiler: "Imam Malik ibn Anas",
    era: "93 - 179 AH"
  },
  nawawi40: {
    desc: "A universally acclaimed selection of the forty-two most fundamental hadiths summarizing the core of the Islamic faith.",
    count: "42 Hadiths",
    compiler: "Imam An-Nawawi",
    era: "631 - 676 AH"
  }
};

export const HadithLibrary = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [loadingHadiths, setLoadingHadiths] = useState(false);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json')
      .then(res => res.json())
      .then(data => {
        // Filter for English editions of major collections
        const englishEditions = Object.values(data).filter((edition: any) => 
          edition.language === 'English' && 
          ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik', 'nawawi40'].includes(edition.collection[0].name)
        );
        // Deduplicate by collection name
        const uniqueCollections = Array.from(new Map(englishEditions.map((e: any) => [e.collection[0].name, e])).values());
        setCollections(uniqueCollections);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fetchSections = (collection: any) => {
    setSelectedCollection(collection);
    setLoadingSections(true);
    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection.name}/sections.json`)
      .then(res => res.json())
      .then(data => {
        const validSections = Object.entries(data).map(([id, title]) => ({ id, title })).filter(s => s.title !== "");
        setSections(validSections);
        setLoadingSections(false);
      });
  };

  const fetchHadiths = (sectionId: string) => {
    setSelectedSection(sections.find(s => s.id === sectionId));
    setLoadingHadiths(true);
    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${selectedCollection.name}/sections/${sectionId}.json`)
      .then(res => res.json())
      .then(data => {
        setHadiths(data.hadiths);
        setLoadingHadiths(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (selectedSection) {
    return (
      <div className="animate-in fade-in duration-500">
        <button 
          onClick={() => {
            setSelectedSection(null);
            setHadiths([]);
          }}
          className="flex items-center text-xs font-mono text-slate-500 hover:text-amber-800 mb-8 transition-colors uppercase tracking-widest"
        >
          <ArrowRight className="w-4 h-4 rotate-180 mr-2" strokeWidth={1.5} /> Back to Books
        </button>
        
        <div className="mb-12 border-b border-slate-200 pb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">{selectedSection.title}</h2>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-mono">{selectedCollection.collection[0].title} • Book {selectedSection.id}</p>
        </div>

        {loadingHadiths ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          </div>
        ) : (
          <div className="space-y-10 max-w-4xl mx-auto">
            {hadiths.map((hadith) => (
              <div key={hadith.hadithnumber} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <span className="text-amber-800 font-mono text-sm bg-amber-50 px-2 py-1 rounded">Hadith {hadith.hadithnumber}</span>
                  {hadith.grades && hadith.grades.length > 0 && (
                    <span className="text-emerald-700 font-mono text-xs uppercase tracking-wider border border-emerald-200 bg-emerald-50 px-2 py-1 rounded">
                      {hadith.grades[0].grade}
                    </span>
                  )}
                </div>
                {hadith.arabicnumber && <p className="text-2xl leading-loose font-arabic text-right text-slate-900 mb-6" dir="rtl">{hadith.text_ar}</p>}
                <div dangerouslySetInnerHTML={{ __html: hadith.text.replace(/\n/g, '<br/>') }} className="text-slate-700 font-serif leading-relaxed text-lg" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (selectedCollection) {
    return (
      <div className="animate-in fade-in duration-500">
        <button 
          onClick={() => setSelectedCollection(null)}
          className="flex items-center text-xs font-mono text-slate-500 hover:text-amber-800 mb-8 transition-colors uppercase tracking-widest"
        >
          <ArrowRight className="w-4 h-4 rotate-180 mr-2" strokeWidth={1.5} /> Back to Collections
        </button>
        
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">{selectedCollection.collection[0].title}</h2>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-mono">Select a Book (Section)</p>
        </div>

        {loadingSections ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => fetchHadiths(section.id)}
                className="flex items-start p-4 bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all rounded-sm text-left group"
              >
                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center font-mono text-xs text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-800 group-hover:border-amber-200 transition-colors shrink-0 mr-4 mt-1">
                  {section.id}
                </div>
                <div>
                  <h4 className="font-serif text-slate-900 group-hover:text-amber-900 line-clamp-2 leading-snug">{section.title}</h4>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-slate-900 mb-2 font-bold">Hadith Collections</h2>
        <p className="text-slate-600 font-serif italic text-sm">
          Accessing {collections.length} major authenticated collections from our open source database.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {collections.map((collection) => {
        const metadata = collectionMetadata[collection.name] || {
          desc: "Authentic collection of Prophetic traditions.",
          count: "Multiple Traditions",
          compiler: "Traditional Scholars",
          era: ""
        };
        return (
          <button
            key={collection.name}
            onClick={() => fetchSections(collection)}
            className="flex flex-col items-start p-6 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all rounded-2xl text-left group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                <Book className="w-5 h-5 text-slate-700 group-hover:text-amber-800 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-amber-900 leading-snug">
                  {collection.collection[0].title}
                </h3>
                <span className="text-[10px] font-mono text-amber-850 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/40 inline-block mt-0.5 font-bold">
                  {metadata.count}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 font-serif mb-5 leading-relaxed min-h-[48px]">
              {metadata.desc}
            </p>

            <div className="grid grid-cols-2 gap-2 w-full text-[10px] font-mono text-slate-500 mb-5 border-t border-slate-50 pt-3">
              <div>
                <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Compiler</span>
                <span className="font-semibold text-slate-700">{metadata.compiler}</span>
              </div>
              {metadata.era && (
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Era</span>
                  <span className="font-semibold text-slate-700">{metadata.era}</span>
                </div>
              )}
            </div>

            <div className="mt-auto flex items-center text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-amber-700 transition-colors pt-3 border-t border-slate-100 w-full justify-between">
              <span>Read Collection</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 opacity-50 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" strokeWidth={2} />
            </div>
          </button>
        );
      })}
    </div>
    </>
  );
};
