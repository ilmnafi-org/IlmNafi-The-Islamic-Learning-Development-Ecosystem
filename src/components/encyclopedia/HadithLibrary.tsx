import React, { useState, useEffect } from 'react';
import { Book, ArrowRight, Loader2 } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {collections.map((collection) => (
        <button
          key={collection.name}
          onClick={() => fetchSections(collection)}
          className="flex flex-col items-start p-8 bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all rounded-sm text-left group"
        >
          <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-sm group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
            <Book className="w-6 h-6 text-slate-700 group-hover:text-amber-800 transition-colors" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-serif font-medium text-slate-900 mb-2 group-hover:text-amber-900">
            {collection.collection[0].title}
          </h3>
          <p className="text-sm text-slate-500 font-serif mb-6">
            Authentic collection of Prophetic traditions.
          </p>
          <div className="mt-auto flex items-center text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-amber-700 transition-colors pt-4 border-t border-slate-100 w-full">
            Read Collection <ArrowRight className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" strokeWidth={2} />
          </div>
        </button>
      ))}
    </div>
  );
};
