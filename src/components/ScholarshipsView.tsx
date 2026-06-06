/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Globe, 
  DollarSign, 
  Bookmark, 
  ExternalLink, 
  Check, 
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SCHOLARSHIPS_DATA } from '../data';
import { Scholarship, UserProgress } from '../types';

interface ScholarshipsViewProps {
  progress: UserProgress;
  onToggleSaveScholarship: (scholarshipId: string) => void;
}

export default function ScholarshipsView({ progress, onToggleSaveScholarship }: ScholarshipsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Undergraduate' | 'Postgraduate' | 'Research Grants'>('All');
  
  // Custom filter helper
  const filteredScholarships = SCHOLARSHIPS_DATA.filter(sch => {
    const matchesSearch = sch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sch.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sch.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sch.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = activeFilter === 'All' || sch.level.includes(activeFilter);
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="scholarships-container">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 border-b border-slate-100 pb-8">
        <div>
          <span className="inline-flex items-center gap-1 bg-[#fdfcf9] text-amber-900 text-[10px] px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-widest border border-amber-905/10 mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-805" /> Academics Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Global Scholarships & Financial Aid
          </h1>
          <p className="text-slate-655 text-xs md:text-sm mt-3 max-w-2xl leading-relaxed">
            Access our curated database of international scholarships, foundations, and research bursaries specifically tailored to support high-achieving Islamic students and research fellows worldwide.
          </p>
        </div>

        {/* Saved scholarships statistics counter */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-905/10 rounded-2xl p-5 flex items-center gap-4 shrink-0 shadow-lg text-white"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
            <Bookmark className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <span className="text-amber-100/70 text-[9px] uppercase font-bold tracking-widest block">My Saved Opportunities</span>
            <span className="font-extrabold text-[#fcfbf8] text-base md:text-lg">{progress.savedScholarships.length} scholarships saved</span>
          </div>
        </motion.div>
      </div>

      {/* SEARCH AND FILTERING PANEL */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl mb-10 space-y-6" 
        id="search-filters-panel"
      >
        <div className="relative">
          <input 
            type="text"
            placeholder="Search by provider, title, country, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-205 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none rounded-xl px-4 py-3.5 pl-11 text-xs text-slate-900 shadow-sm transition"
            id="scholarships-search"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-[10px] text-slate-405 uppercase tracking-widest font-bold flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-805" /> Filter levels:
          </span>
          {(['All', 'Undergraduate', 'Postgraduate', 'Research Grants'] as const).map(level => (
            <button
              key={level}
              onClick={() => setActiveFilter(level)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                activeFilter === level
                  ? 'bg-amber-800 border-amber-800 text-white shadow-md'
                  : 'bg-white border-slate-150 text-slate-500 hover:text-slate-805'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </motion.div>

      {/* SCHOLARSHIP CARD LISTINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="scholarships-listings">
        <AnimatePresence mode="popLayout">
          {filteredScholarships.length > 0 ? (
            filteredScholarships.map((sch, idx) => {
              const isSaved = progress.savedScholarships.includes(sch.id);
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: idx * 0.05 }}
                  key={sch.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-amber-600 transition duration-300 relative group shadow-md"
                  id={`scholarship-card-${sch.id}`}
                >
                  <div>
                    {/* Top header row */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-xl border overflow-hidden whitespace-nowrap leading-none ${
                        sch.coverage === 'Fully Funded' 
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-205' 
                          : 'bg-amber-50 text-amber-900 border-amber-205'
                      }`}>
                        {sch.coverage}
                      </span>

                      <button
                        onClick={() => onToggleSaveScholarship(sch.id)}
                        className={`p-2.5 rounded-full border transition active:scale-95 cursor-pointer ${
                          isSaved 
                            ? 'bg-amber-50 border-amber-205 text-amber-805 shadow-inner' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-205 text-slate-400 hover:text-slate-600'
                        }`}
                        id={`btn-save-${sch.id}`}
                        title={isSaved ? "Remove Bookmark" : "Save Opportunity"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-805 text-amber-805' : ''}`} />
                      </button>
                    </div>

                    {/* Title details */}
                    <h3 className="text-base md:text-lg font-extrabold text-slate-900 group-hover:text-amber-800 tracking-tight leading-snug">
                      {sch.title}
                    </h3>
                    <p className="text-slate-400 font-bold text-xs mt-1">
                      {sch.provider}
                    </p>

                    <p className="text-slate-655 mt-4 text-xs md:text-sm leading-relaxed font-sans">
                      {sch.description}
                    </p>

                    {/* Icon details row */}
                    <div className="grid grid-cols-2 gap-4 mt-5 text-xs font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Globe className="w-4 h-4 text-amber-805 flex-shrink-0" />
                        <span className="truncate">{sch.country}</span>
                      </div>
                      {sch.stipendAmount && (
                        <div className="flex items-center gap-2 overflow-hidden">
                          <DollarSign className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                          <span className="truncate text-emerald-950 font-extrabold">{sch.stipendAmount}</span>
                        </div>
                      )}
                    </div>

                    {/* Eligibility criteria list */}
                    <div className="mt-6 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#503020] block pb-1 border-b border-dashed border-slate-200">
                        Eligibility Requirements
                      </span>
                      <ul className="space-y-2">
                        {sch.eligibility.map((crit, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-705 leading-relaxed font-sans font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Base Action Row */}
                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold leading-none font-sans">
                      <Calendar className="w-4 h-4 text-[#503020]" />
                      <span>Apply by: {sch.deadline}</span>
                    </div>

                    <a 
                      href={sch.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-900 border border-amber-205 px-4 py-2.5 bg-[#fdfcf9] rounded-xl hover:bg-amber-50 transition shadow-sm whitespace-nowrap cursor-pointer"
                      id={`btn-apply-link-${sch.id}`}
                    >
                      Apply Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-1 lg:col-span-2 bg-[#fdfcf9] border-2 border-dashed border-amber-900/10 rounded-3xl p-12 text-center space-y-3 shadow-inner" 
              id="scholarships-empty"
            >
              <GraduationCap className="w-14 h-14 text-amber-805/45 mx-auto" />
              <h4 className="font-extrabold text-slate-900 text-lg">No Matching Scholarships Found</h4>
              <p className="text-slate-500 text-xs font-sans max-w-sm mx-auto leading-relaxed">Try selecting a different category level or clearing your search phrase to retrieve classic verified opportunities.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
