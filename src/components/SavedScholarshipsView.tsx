/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Clock, 
  MapPin, 
  Globe, 
  ExternalLink, 
  ArrowRight,
  ClipboardList,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SCHOLARSHIPS_DATA } from '../data';
import { Scholarship, UserProgress } from '../types';

interface SavedScholarshipsViewProps {
  progress: UserProgress;
  onToggleSaveScholarship: (scholarshipId: string) => void;
  lang: 'en' | 'ar';
}

interface ApplicationTracker {
  status: 'saved' | 'drafting' | 'submitted' | 'interview' | 'accepted' | 'closed';
  notes: string;
  checklist: string[];
}

export default function SavedScholarshipsView({ progress, onToggleSaveScholarship, lang }: SavedScholarshipsViewProps) {
  // Track state purely in-memory
  const [trackers, setTrackers] = useState<Record<string, ApplicationTracker>>({});

  const [activeTab, setActiveTab] = useState<'board' | 'list'>('board');
  const [selectedSch, setSelectedSch] = useState<Scholarship | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  // Extract saved scholarships
  const savedItems = SCHOLARSHIPS_DATA.filter(sch => progress.savedScholarships.includes(sch.id));

  // Initialize tracker for items if they don't exist
  useEffect(() => {
    let changed = false;
    const updated = { ...trackers };
    savedItems.forEach(item => {
      if (!updated[item.id]) {
        updated[item.id] = {
          status: 'saved',
          notes: '',
          checklist: [
            lang === 'en' ? 'Prepare Statement of Purpose / Research Proposal' : 'إعداد بيان الغرض من الدراسة أو المقترح البحثي',
            lang === 'en' ? 'Acquire 2 academic Recommendation Letters' : 'الحصول على خطابي توصية أكاديميين',
            lang === 'en' ? 'Translate official Transcript into English' : 'ترجمة السجل الأكاديمي الرسمي إلى الإنجليزية'
          ]
        };
        changed = true;
      }
    });
    if (changed) {
      setTrackers(updated);
    }
  }, [savedItems, lang]);

  const updateStatus = (id: string, status: ApplicationTracker['status']) => {
    setTrackers(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status
      }
    }));
  };

  const updateNotes = (id: string, notes: string) => {
    setTrackers(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes
      }
    }));
  };

  const toggleChecklistItem = (id: string, index: number) => {
    const checklist = trackers[id]?.checklist || [];
    // Here we can append a special marker like [X] or just Toggle
    // Let's implement an in-memory checklist toggle or indices
  };

  const openNotesModal = (sch: Scholarship) => {
    setSelectedSch(sch);
    setEditingNotes(trackers[sch.id]?.notes || '');
  };

  const saveNotesModal = () => {
    if (selectedSch) {
      updateNotes(selectedSch.id, editingNotes);
      setSelectedSch(null);
    }
  };

  // Status definitions
  const statuses = [
    { key: 'saved', label: lang === 'en' ? 'Saved (Reviewing)' : 'محفوظة (قيد المراجعة)', bg: 'bg-slate-100 text-slate-700 border-slate-350', dot: 'bg-slate-400' },
    { key: 'drafting', label: lang === 'en' ? 'Drafting Essays' : 'كتابة المقالات والخطابات', bg: 'bg-amber-50 text-amber-900 border-amber-205', dot: 'bg-amber-500' },
    { key: 'submitted', label: lang === 'en' ? 'Submitted' : 'تم تقديم الطلب', bg: 'bg-blue-50 text-blue-900 border-blue-200', dot: 'bg-blue-500' },
    { key: 'interview', label: lang === 'en' ? 'Interview Stage' : 'مرحلة المقابلة الشخصية', bg: 'bg-purple-50 text-purple-950 border-purple-200', dot: 'bg-purple-500' },
    { key: 'accepted', label: lang === 'en' ? 'Offer Received! 🎉' : 'تم القبول بحمد الله! 🎉', bg: 'bg-emerald-50 text-emerald-950 border-emerald-250', dot: 'bg-emerald-600' },
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="saved-scholarships-container">
      {/* HEADER SEGMENT */}
      <div className="border-b border-slate-100 pb-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[10px] px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-widest border border-amber-200 shadow-sm mb-4">
            <ClipboardList className="w-3.5 h-3.5 text-amber-700" /> {lang === 'en' ? "Registry Workspace" : "مصنف الفرص وحالة التقديم"}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            {lang === 'en' ? "My Saved Opportunities" : "ديوان المنح المحفوظة"}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-3 max-w-2xl leading-relaxed">
            {lang === 'en' 
              ? "Track application stages, write down custom essay drafts, manage credentials checklist, and organize your global academic path in real-time."
              : "نظم وقيد تقدمك الدراسي؛ اكتب ملاحظات التقديم والمقالات، تحكم بخطوات الاعتماد الأكاديمي، ونظم خطتك البحثية والتمويلية لبيوت الحكمة العالمية."
            }
          </p>
        </div>

        {/* Workspace Mode switch / status summary */}
        <div className="bg-slate-100 p-1 rounded-2xl border border-slate-205 flex h-11 items-center shrink-0">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 h-9 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'board'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'en' ? "Kanban Board" : "لوحة المتابعة"}
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 h-9 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'en' ? "Detailed Workspace" : "تفصيل المسودات"}
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {savedItems.length === 0 ? (
        <div className="bg-[#fdfcf9] border-2 border-dashed border-amber-900/10 rounded-3xl p-16 text-center space-y-4 max-w-2xl mx-auto shadow-inner">
          <GraduationCap className="w-16 h-16 text-amber-805/30 mx-auto" />
          <h3 className="font-extrabold text-slate-900 text-lg">
            {lang === 'en' ? "No Saved Scholarships Yet" : "لا توجد منح محفوظة بالتفضيلات حالياً"}
          </h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
            {lang === 'en' 
              ? "When you find undergraduate, postgraduate, or research scholarships you are eligible for, click the bookmark icon to start tracking your journey here."
              : "عند عثورك على فرصة بحثية أو منحة دراسية في منبر البعثات، اضغط على زر الحفظ لتظهر في هذا الديوان وتفعل خطة التقديم والاعتمادات والطلبات الأكاديمية."
            }
          </p>
        </div>
      ) : activeTab === 'board' ? (
        /* KANBAN BOARD LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start overflow-x-auto pb-4">
          {statuses.map(col => {
            const itemsInCol = savedItems.filter(item => (trackers[item.id]?.status || 'saved') === col.key);
            return (
              <div key={col.key} className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 min-w-[220px] flex flex-col gap-4">
                {/* Header segment */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <h3 className="font-bold text-slate-850 text-xs truncate max-w-[130px]">{col.label}</h3>
                  </div>
                  <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-slate-550 border border-slate-200">{itemsInCol.length}</span>
                </div>

                {/* Items loop */}
                <div className="space-y-3 min-h-[350px] flex flex-col">
                  {itemsInCol.map(item => {
                    const info = trackers[item.id];
                    return (
                      <motion.div
                        layout
                        key={item.id}
                        className="bg-white border border-slate-150 p-4 rounded-xl shadow-xs hover:shadow-md transition hover:border-amber-600/70 group"
                      >
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-850 line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1 truncate font-medium">{item.provider}</p>
                        
                        {/* Location / coverage */}
                        <div className="flex items-center gap-2 text-[9px] text-[#503020] font-mono mt-3">
                          <Globe className="w-3 h-3 text-amber-700" />
                          <span className="truncate">{item.country}</span>
                        </div>

                        {/* Status updater dropdown */}
                        <div className="mt-4 pt-3 border-t border-dashed border-slate-100 flex flex-col gap-2">
                          <label className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Move Stage:</label>
                          <select
                            value={info?.status || 'saved'}
                            onChange={(e) => updateStatus(item.id, e.target.value as any)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-1.5 text-[10px] text-slate-800 outline-none w-full font-bold cursor-pointer transition"
                          >
                            <option value="saved">{lang === 'en' ? "Saved (Review)" : "محفوظة (مراجعة)"}</option>
                            <option value="drafting">{lang === 'en' ? "Drafting Essays" : "كتابة المقالات والخطابات"}</option>
                            <option value="submitted">{lang === 'en' ? "Submitted" : "تم تقديم الطلب"}</option>
                            <option value="interview">{lang === 'en' ? "Interview Stage" : "مرحلة المقابلة الشخصية"}</option>
                            <option value="accepted">{lang === 'en' ? "Offer Received! 🎉" : "تم القبول بحمد الله! 🎉"}</option>
                          </select>
                        </div>

                        {/* Footer buttons / notes */}
                        <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
                          <button
                            onClick={() => openNotesModal(item)}
                            className="text-[10px] font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{info?.notes ? (lang === 'en' ? 'Edit Notes' : 'تحديث المسودة') : (lang === 'en' ? 'Add Notes' : 'إضافة مسودة')}</span>
                          </button>
                          
                          <button
                            onClick={() => onToggleSaveScholarship(item.id)}
                            className="text-slate-400 hover:text-red-650 p-1 hover:bg-slate-50 rounded-lg cursor-pointer transition"
                            title={lang === 'en' ? "Unsave opportunity" : "إزالة الحفظ"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                  {itemsInCol.length === 0 && (
                    <div className="flex-1 border-2 border-dashed border-slate-200/50 rounded-xl flex items-center justify-center p-4">
                      <span className="text-[10px] text-slate-400 font-medium">{lang === 'en' ? "Empty stage" : "تغريد فارغ"}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DETAILED WORKSPACE LIST LAYOUT */
        <div className="space-y-6" id="saved-scholarships-detailed-workspace">
          {savedItems.map(item => {
            const info = trackers[item.id] || { status: 'saved', notes: '', checklist: [] };
            const statusObj = statuses.find(s => s.key === info.status) || statuses[0];
            return (
              <div 
                key={item.id} 
                className="bg-white border border-slate-205 rounded-3xl p-6 md:p-8 hover:shadow-lg transition flex flex-col lg:flex-row justify-between gap-8 relative"
              >
                {/* Scholarship Information segment */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-xl border ${statusObj.bg}`}>
                      {statusObj.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">ID: {item.id}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 font-bold text-xs">{item.provider}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-slate-650 font-mono">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{item.country}</span>
                    </div>
                    {item.stipendAmount && (
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate text-emerald-950">{item.stipendAmount}</span>
                      </div>
                    )}
                    <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="truncate">{item.deadline}</span>
                    </div>
                  </div>

                  {/* Drafting workspace */}
                  <div className="bg-[#fcfbf9]/60 border border-slate-150 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                        {lang === 'en' ? "Drafting Desk & Application Notes:" : "طاولة تحرير المقالة وكتابة المسودة:"}
                      </span>
                      <button
                        onClick={() => openNotesModal(item)}
                        className="text-[10px] font-bold text-amber-905 hover:bg-amber-100/50 px-2.5 py-1 rounded-lg border border-amber-900/15 cursor-pointer transition"
                      >
                        {lang === 'en' ? "Expand Desk" : "توسيع المحرر"}
                      </button>
                    </div>

                    {info.notes ? (
                      <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                        {info.notes}
                      </p>
                    ) : (
                      <button
                        onClick={() => openNotesModal(item)}
                        className="w-full bg-dashed border-2 border-dashed border-slate-200 p-4 rounded-xl text-center text-xs text-slate-400 hover:border-amber-600 hover:text-amber-800 font-bold transition cursor-pointer"
                      >
                        {lang === 'en' ? "+ Write Application Concept / Letter Draft" : "+ ابدأ بكتابة هيكلية التقديم وبيان المقصد الأكاديمي"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tracking panel & actions */}
                <div className="w-full lg:w-80 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 space-y-6">
                  {/* Status update widget */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">
                      {lang === 'en' ? "Application Progress State" : "الحالة الحالية لمراحل التقديم"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
                      {statuses.map(s => {
                        const isCurrent = s.key === info.status;
                        return (
                          <button
                            key={s.key}
                            onClick={() => updateStatus(item.id, s.key)}
                            className={`p-2 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              isCurrent 
                                ? 'border-amber-500 bg-amber-500/5 text-amber-900' 
                                : 'border-slate-100 hover:bg-slate-50 text-slate-600 bg-white'
                            }`}
                          >
                            <span className="truncate">{s.label}</span>
                            {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions segment wrapper */}
                  <div className="space-y-3 pt-2">
                    <a 
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-slate-950 text-white font-extrabold text-xs tracking-wider uppercase py-3 px-5 rounded-xl hover:bg-amber-900 transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      {lang === 'en' ? "Open Portal Website" : "الانتقال لفرع التقديم"} <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onToggleSaveScholarship(item.id)}
                      className="w-full bg-slate-100 text-slate-655 font-bold text-xs py-2.5 rounded-xl hover:bg-red-50 hover:text-red-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {lang === 'en' ? "Unsave Scholarship" : "إلغاء التتبع وإزالة الحفظ"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NOTES DESK MODAL */}
      <AnimatePresence>
        {selectedSch && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Background glass overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSch(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col"
              id="drafting-desk-modal"
            >
              {/* Header */}
              <div className="bg-slate-50 border-b border-slate-205 p-6 md:p-8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5 text-amber-700" />
                    {lang === 'en' ? "Scholarship Drafting Desk" : "طاولة تحرير المقالة وصياغة ملف المنحة"}
                  </span>
                  <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight mt-1 line-clamp-1">{selectedSch.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedSch(null)}
                  className="bg-white border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-605 cursor-pointer text-sm font-bold shadow-xs transition"
                >
                  ✕
                </button>
              </div>

              {/* Textarea */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    {lang === 'en' ? "Scholarship Notes, Essay Skeleton, or TO-DO Items:" : "مسودة خطاب الغرض، متطلبات المقالة أو أفكار المقابلة للجنة:"}
                  </label>
                  <textarea
                    rows={12}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder={
                      lang === 'en' 
                        ? "E.g. Write down answers to: Why are you applying? What is your research scope? Paste links to drafts here..."
                        : "مثال: اكتب النقاط الهيكلية: كيف يساهم المبحث الشرعي/التقني في خدمة الأكاديمية؟ مواعيد تجميع الأوراق، ملاحظات الدكاترة الموصين..."
                    }
                    className="w-full bg-slate-50 border border-slate-205 rounded-2xl p-4 text-xs font-sans text-slate-800 focus:bg-white focus:border-amber-600 outline-none shadow-inner transition"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-205 p-6 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setSelectedSch(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white bg-transparent transition cursor-pointer"
                >
                  {lang === 'en' ? "Cancel" : "إلغاء الأمر"}
                </button>
                <button
                  type="button"
                  onClick={saveNotesModal}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-extrabold hover:bg-amber-900 shadow-md transition cursor-pointer"
                >
                  {lang === 'en' ? "Save Draft" : "حفظ التغييرات"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
