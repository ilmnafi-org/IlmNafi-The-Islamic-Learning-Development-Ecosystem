import React, { useState } from 'react';
import { 
  BookOpen, 
  Map as MapIcon, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  Shield, 
  Book, 
  MessageCircle, 
  Scale, 
  GraduationCap, 
  Sparkles,
  ArrowRight,
  BookMarked,
  Feather,
  Globe,
  Library,
  ScrollText,
  Quote,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { id: 'quran', title: 'Qur\'an & Sciences', description: 'Tafsir, recitation, and meanings', icon: BookOpen },
  { id: 'hadith', title: 'Hadith Collections', description: 'Authentic sayings and traditions', icon: Book },
  { id: 'prophet', title: 'Seerah of the Prophet ﷺ', description: 'Life, events, and character', icon: Star },
  { id: 'prophets', title: 'Stories of the Prophets', description: 'From Adam (AS) to Isa (AS)', icon: Globe },
  { id: 'sahabah', title: 'The Companions', description: 'Biographies and contributions', icon: Users },
  { id: 'ahlul_bayt', title: 'Ahlul Bayt', description: 'The family of the Prophet ﷺ', icon: Heart },
  { id: 'mothers', title: 'Mothers of the Believers', description: 'The wives of the Prophet ﷺ', icon: Heart },
  { id: 'fiqh', title: 'Fiqh & Jurisprudence', description: 'Rulings, worship, and transactions', icon: Scale },
  { id: 'usul', title: 'Usul al-Fiqh', description: 'Principles of Islamic jurisprudence', icon: ScrollText },
  { id: 'aqeedah', title: 'Aqeedah & Theology', description: 'Core beliefs and creed', icon: BookMarked },
  { id: 'tazkiyah', title: 'Tazkiyah & Adab', description: 'Purification and manners', icon: Feather },
  { id: 'battles', title: 'Battles & Expeditions', description: 'Key events and strategies', icon: Shield },
  { id: 'history', title: 'Islamic History', description: 'From the early Caliphates to modern times', icon: Clock },
  { id: 'scholars', title: 'Classical Scholars', description: 'Lives of the Imams and scholars', icon: Library },
  { id: 'duas', title: 'Supplications (Adhkar)', description: 'Daily prayers and remembrances', icon: MessageCircle },
  { id: 'asmaul_husna', title: 'Names of Allah', description: 'The 99 beautiful names and meanings', icon: Quote },
  { id: 'arabic', title: 'Classical Arabic', description: 'Grammar, vocabulary, and morphology', icon: GraduationCap },
  { id: 'maps', title: 'Historical Maps', description: 'Geographic context and timelines', icon: MapIcon },
];

export const EncyclopediaView = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = categories.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8 min-h-screen bg-[#faf9f6] font-sans">
      {/* Header & AI Search */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-300 pb-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight mb-4">
              The Grand Library
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-serif italic">
              "Read! In the name of your Lord who created." A structured, scholarly archive of Islamic history, theology, and jurisprudence.
            </p>
          </div>
          
          <div className="relative w-full md:w-96 shrink-0">
            <input
              type="text"
              placeholder="Search the archives..."
              className="w-full bg-transparent border-b-2 border-slate-300 py-3 pl-2 pr-12 text-lg font-serif text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-700 transition-colors rounded-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-amber-700 transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid (Library Shelves) */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div 
              key="index"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="group flex flex-col items-start p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all text-left w-full h-full rounded-sm"
                  >
                    <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-sm group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                      <Icon className="w-6 h-6 text-slate-700 group-hover:text-amber-800 transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-serif font-medium text-slate-900 mb-2 group-hover:text-amber-900 transition-colors line-clamp-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-serif leading-relaxed line-clamp-2 mb-4">
                      {category.description}
                    </p>
                    <div className="mt-auto flex items-center text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-amber-700 transition-colors pt-4 border-t border-slate-100 w-full">
                      Explore Volume <ArrowRight className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" strokeWidth={2} />
                    </div>
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 p-8 md:p-12 shadow-sm rounded-sm"
            >
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center text-xs font-mono text-slate-500 hover:text-amber-800 mb-10 transition-colors uppercase tracking-widest"
              >
                <ArrowRight className="w-4 h-4 rotate-180 mr-2" strokeWidth={1.5} /> Return to Index
              </button>
              <div className="max-w-4xl">
                 <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight mb-6">
                   {categories.find(c => c.id === selectedCategory)?.title}
                 </h2>
                 <p className="text-lg text-slate-600 font-serif italic mb-10">
                   {categories.find(c => c.id === selectedCategory)?.description}
                 </p>
                 <div className="prose prose-slate max-w-none font-serif">
                   <p className="text-slate-700 leading-loose text-base md:text-lg mb-8">
                     This volume of the library contains structured knowledge, verified references, timelines, and scholarly insights. Search specific inquiries above to extract and synthesize information across chapters.
                   </p>
                   <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-amber-800 border border-amber-200 bg-amber-50 px-4 py-3 rounded-sm inline-flex">
                     <BookOpen className="w-4 h-4" strokeWidth={1.5} /> Verified Scholarly Archive
                   </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {filteredCategories.length === 0 && !selectedCategory && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
            <p className="text-slate-500 text-lg font-serif italic">No volumes found matching your inquiry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

