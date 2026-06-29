import React, { useState } from 'react';
import { ArrowRight, Search, Shield, Users, Clock, Library, Globe, Book } from 'lucide-react';

const mockData: Record<string, any[]> = {
  sahabah: [
    {
      id: 'abu-bakr',
      name: 'Abu Bakr as-Siddiq',
      arabic: 'أبو بكر الصديق',
      birth: '573 CE',
      death: '634 CE',
      title: 'The Truthful',
      contributions: 'First Caliph, companion in the Hijrah, preserved the Quran.',
      battles: ['Badr', 'Uhud', 'Trench', 'Hunayn'],
      biography: 'Abu Bakr was the senior companion and—through his daughter Aisha—the father-in-law of the Islamic prophet Muhammad. He was the first openly declared Muslim outside Muhammad\'s family. Abu Bakr served as a trusted advisor to Muhammad.'
    },
    {
      id: 'umar',
      name: 'Umar ibn al-Khattab',
      arabic: 'عمر بن الخطاب',
      birth: '584 CE',
      death: '644 CE',
      title: 'Al-Faruq (The Distinguisher)',
      contributions: 'Second Caliph, expanded the Islamic state significantly, established the Hijri calendar.',
      battles: ['Badr', 'Uhud', 'Trench'],
      biography: 'Umar was a senior companion of the Islamic prophet Muhammad. He succeeded Abu Bakr as the second caliph of the Rashidun Caliphate on 23 August 634. He was an expert Islamic jurist known for his pious and just nature.'
    }
  ],
  prophets: [
    {
      id: 'ibrahim',
      name: 'Ibrahim (Abraham)',
      arabic: 'إبراهيم',
      title: 'Khalilullah (Friend of Allah)',
      miracles: ['Saved from the fire'],
      biography: 'Recognized as a prophet and messenger of God, and patriarch of many peoples. Ibrahim fulfilled all the commandments and trials wherein God nurtured him throughout his lifetime.'
    },
    {
      id: 'musa',
      name: 'Musa (Moses)',
      arabic: 'موسى',
      title: 'Kalimullah (He who spoke to Allah)',
      miracles: ['Parting the Red Sea', 'The Staff'],
      biography: 'A prophet and messenger of God. He is the most frequently mentioned individual in the Quran. He led the Israelites out of Egypt.'
    }
  ],
  battles: [
    {
      id: 'badr',
      name: 'Battle of Badr',
      arabic: 'غزوة بدر',
      date: '17 Ramadan, 2 AH (March 624 CE)',
      location: 'Badr, Hejaz',
      outcome: 'Decisive Muslim victory',
      details: 'The Battle of Badr was a key battle in the early days of Islam and a turning point in Muhammad\'s struggle with his opponents among the Quraish in Mecca.'
    },
    {
      id: 'uhud',
      name: 'Battle of Uhud',
      arabic: 'غزوة أحد',
      date: '3 Shawwal, 3 AH (March 625 CE)',
      location: 'Mount Uhud, Medina',
      outcome: 'Quraish tactical victory',
      details: 'Fought by the early Muslims led by the Islamic prophet Muhammad against a Meccan force led by Abu Sufyan ibn Harb.'
    }
  ],
  scholars: [
    {
      id: 'abu-hanifa',
      name: 'Abu Hanifa',
      arabic: 'أبو حنيفة',
      birth: '699 CE',
      death: '767 CE',
      contributions: 'Founder of the Hanafi school of jurisprudence.',
      biography: 'Nuʿmān ibn Thābit ibn Zūṭā ibn Marzubān, known as Abū Ḥanīfa, was an 8th-century Sunni Muslim theologian and jurist of Persian origin.'
    },
    {
      id: 'shafii',
      name: 'Muhammad ibn Idris al-Shafi\'i',
      arabic: 'محمد بن إدريس الشافعي',
      birth: '767 CE',
      death: '820 CE',
      contributions: 'Founder of the Shafi\'i school of jurisprudence.',
      biography: 'An Arab Muslim theologian, writer, and scholar, who was the first contributor of the principles of Islamic jurisprudence (Uṣūl al-fiqh).'
    }
  ]
};

const iconMap: Record<string, any> = {
  sahabah: Users,
  prophets: Globe,
  battles: Shield,
  scholars: Library
};

export const CustomLibrary = ({ categoryId, categoryTitle, categoryDescription }: { categoryId: string, categoryTitle: string, categoryDescription: string }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const data = mockData[categoryId] || [];
  const Icon = iconMap[categoryId] || Book;

  if (selectedItem) {
    return (
      <div className="animate-in fade-in duration-500">
        <button 
          onClick={() => setSelectedItem(null)}
          className="flex items-center text-xs font-mono text-slate-500 hover:text-amber-800 mb-8 transition-colors uppercase tracking-widest"
        >
          <ArrowRight className="w-4 h-4 rotate-180 mr-2" strokeWidth={1.5} /> Back to {categoryTitle}
        </button>
        
        <div className="bg-white border border-slate-200 p-8 md:p-12 shadow-sm rounded-sm max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-2">{selectedItem.name}</h2>
              {selectedItem.title && <p className="text-amber-800 font-serif italic text-lg">{selectedItem.title}</p>}
            </div>
            <div className="text-3xl font-arabic text-amber-800/70" dir="rtl">{selectedItem.arabic}</div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {selectedItem.birth && <span className="bg-slate-50 border border-slate-100 px-3 py-1 text-sm font-mono text-slate-600 rounded">Born: {selectedItem.birth}</span>}
            {selectedItem.death && <span className="bg-slate-50 border border-slate-100 px-3 py-1 text-sm font-mono text-slate-600 rounded">Died: {selectedItem.death}</span>}
            {selectedItem.date && <span className="bg-slate-50 border border-slate-100 px-3 py-1 text-sm font-mono text-slate-600 rounded">Date: {selectedItem.date}</span>}
            {selectedItem.location && <span className="bg-slate-50 border border-slate-100 px-3 py-1 text-sm font-mono text-slate-600 rounded">Location: {selectedItem.location}</span>}
          </div>

          {selectedItem.biography && (
            <div className="mb-8">
              <h4 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Biography</h4>
              <p className="text-slate-700 font-serif leading-relaxed text-lg">{selectedItem.biography}</p>
            </div>
          )}

          {selectedItem.details && (
            <div className="mb-8">
              <h4 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Details</h4>
              <p className="text-slate-700 font-serif leading-relaxed text-lg">{selectedItem.details}</p>
            </div>
          )}

          {selectedItem.contributions && (
            <div className="mb-8">
              <h4 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Contributions</h4>
              <p className="text-slate-700 font-serif leading-relaxed text-lg">{selectedItem.contributions}</p>
            </div>
          )}

          {selectedItem.battles && (
            <div>
              <h4 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Major Events</h4>
              <ul className="list-disc list-inside text-slate-700 font-serif leading-relaxed text-lg">
                {selectedItem.battles.map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          )}
          
          {selectedItem.miracles && (
            <div>
              <h4 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Notable Miracles</h4>
              <ul className="list-disc list-inside text-slate-700 font-serif leading-relaxed text-lg">
                {selectedItem.miracles.map((m: string, i: number) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">{categoryTitle}</h2>
        <p className="text-slate-500 uppercase tracking-widest text-xs font-mono">{categoryDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="flex items-center justify-between p-6 bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all rounded-sm text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-800 group-hover:border-amber-200 transition-colors shrink-0">
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-serif text-xl font-medium text-slate-900 group-hover:text-amber-900 mb-1">{item.name}</h4>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest truncate max-w-[200px]">{item.title || item.date || item.birth}</p>
              </div>
            </div>
            <div className="text-2xl font-arabic text-amber-800/70 group-hover:text-amber-800 transition-colors">
              {item.arabic}
            </div>
          </button>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-sm">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
          <p className="text-slate-500 text-lg font-serif italic mb-2">This section is currently being authenticated and compiled.</p>
          <p className="text-slate-400 text-sm font-mono">It will be available in the upcoming database synchronization.</p>
        </div>
      )}
    </div>
  );
};
