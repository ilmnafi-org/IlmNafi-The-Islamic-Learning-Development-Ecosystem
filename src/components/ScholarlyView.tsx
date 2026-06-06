/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Book, 
  GraduationCap, 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  UserCheck, 
  MessageSquare, 
  AlertCircle,
  FileText,
  Award,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScholarlyViewProps {
  lang: 'en' | 'ar';
}

interface ScholarlyResult {
  answer: string;
  scholars: string;
  verses: {
    text: string;
    translation: string;
  }[];
  actionItems: string[];
}

export const ScholarlyView: React.FC<ScholarlyViewProps> = ({ lang }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScholarlyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      en: "How can I improve my mindfulness (Khushu) and focus in daily prayers?",
      ar: "كيف يمكنني تحسين الخشوع والتركيز في الصلوات اليومية؟",
      tag: lang === 'en' ? "Spiritual Growth" : "النمو الروحي"
    },
    {
      en: "What are the stages of compiling and verifying the text of the Holy Quran?",
      ar: "ما هي مراحل جمع وتوثيق نص القرآن الكريم؟",
      tag: lang === 'en' ? "History" : "التاريخ"
    },
    {
      en: "Explain the theological and scientific definition of 'Beneficial Knowledge' in Islam.",
      ar: "اشرح التعريف العقدي والعلمي لـ 'العلم النافع' في الإسلام.",
      tag: lang === 'en' ? "Theology" : "العقيدة"
    }
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scholarly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: queryText }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error rating. Please verify connectivity.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(lang === 'en' ? 'Failed to consult scholars database. Please try again.' : 'فشل الاتصال بقاعدة بيانات العلماء. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    en: {
      title: "Scholarly Enquiry Hub",
      subtitle: "Consult the classical councils. Ask deep questions about theology, Islamic Golden Age science, jurisprudence, or spiritual focus and explore authenticated answers.",
      placeholder: "Ask about prayer, fasting, Hadith transmission, or the House of Wisdom...",
      btnAsk: "Consult Advisors",
      loadingText: "Assembling classical citations & consensus...",
      suggestedHeading: "Suggested Academic Inquiries",
      responseHeading: "Academic Advisory Statement",
      scholarlyConsensus: "Classical Scholarly Consensus",
      guidanceVerses: "Foundational Verses & Traditions",
      actionsHeading: "Practical Action Plan for Students",
      disclaimer: "Answers are structured based on authenticated classical schools of jurisprudence (Hanafi, Shafi'i, Maliki, Hanbali) for academic research and personal education.",
      verifiedBadge: "Advisory Verified"
    },
    ar: {
      title: "منصة الاستقصاء المعرفي والشرعي",
      subtitle: "استشر المجامع الفقهية الكلاسيكية. اطرح أسئلة عميقة حول العقيدة، تاريخ العلوم الإسلامية، الأحكام أو التركيز الروحي، واستكشف الإجابات الموثقة.",
      placeholder: "اسأل عن الصلاة، الصيام، رواية الحديث، أو بيت الحكمة ببغداد...",
      btnAsk: "استشارة فقهاء المعرفة",
      loadingText: "يجري جمع الشواهد الكلاسيكية الفقهية والتاريخية...",
      suggestedHeading: "مقترحات الاستقصاء الأكاديمي",
      responseHeading: "بيان الاستشارة العلمية الأكاديمي",
      scholarlyConsensus: "إجماع المدارس الكلاسيكية الفقهية",
      guidanceVerses: "الآيات والآثار المؤسسة للأحكام",
      actionsHeading: "منهج عملي تطبيقي للمتعلم",
      disclaimer: "تمت صياغة الإجابات بناءً على المصادر الكلاسيكية ومذاهب الفقه الأربعة (الحنفية، الشافعية، المالكية، الحنابلة) للبحث والدراسة الشخصية.",
      verifiedBadge: "مستند علمي معتمد"
    }
  }[lang];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="view-scholarly">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-205/20 mb-4 uppercase tracking-widest">
          <GraduationCap className="w-3.5 h-3.5 text-amber-805" />
          {labels.verifiedBadge}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-sans mb-3 block">
          {labels.title}
        </h1>
        <p className="text-xs md:text-sm text-slate-655 max-w-2xl mx-auto leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      {/* Main Form Box */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 md:p-10 mb-10"
      >
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
            {lang === 'en' ? "Your Theological or Historical Question" : "مسألتك العلمية والتاريخية"}
          </label>
          <div className="relative">
            <textarea
              className="w-full min-h-[120px] p-4 text-sm bg-slate-50/70 text-slate-900 border border-slate-200 hover:border-slate-300 rounded-2xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all resize-none leading-relaxed shadow-sm font-sans"
              placeholder={labels.placeholder}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              disabled={loading}
              id="input-mufti-question"
            />
          </div>
          
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={() => handleAsk(question)}
              disabled={loading || !question.trim()}
              className="px-6 py-4 rounded-xl bg-amber-800 hover:bg-[#201002] text-white font-extrabold text-xs tracking-wide transition shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
              id="btn-consult-mufti"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{labels.loadingText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{labels.btnAsk}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestion list */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            {labels.suggestedHeading}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presets.map((p, i) => {
              const text = lang === 'en' ? p.en : p.ar;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setQuestion(text);
                    handleAsk(text);
                  }}
                  disabled={loading}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-amber-450 hover:bg-amber-50/10 text-left transition-all duration-200 text-xs font-semibold text-slate-800 bg-white hover:shadow-md cursor-pointer flex flex-col justify-between h-40"
                  style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                >
                  <span className="text-[9px] text-amber-805 uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100/50 self-start mb-3">
                    {p.tag}
                  </span>
                  <span className="line-clamp-3 leading-relaxed text-slate-900 font-sans flex-grow w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {text}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-2 font-bold tracking-wide flex items-center gap-1 hover:text-amber-805 self-end">
                    Consult <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Error state */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-250/30 flex items-start gap-3.5 mb-10 text-xs max-w-2xl mx-auto shadow-sm" 
          id="error-scholarly"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Inquiry Notice</p>
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      {/* Results view if evaluated */}
      {loading && !result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-205/80 shadow-lg p-10 text-center space-y-4 py-16"
        >
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-800 animate-spin border border-amber-900/5 shadow">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{labels.loadingText}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">{lang === 'en' ? "Retrieving Hadith references and classical commentaries..." : "يتم جلب الروايات والآثار وتفاسير المذاهب الأربعة..."}</p>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#faf8f3] border-2 border-amber-900/10 rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto" 
          id="scholarly-result-box"
        >
          {/* Certificate header block */}
          <div className="bg-gradient-to-r from-[#2a1b14] to-[#1a100a] p-6 md:p-8 text-white flex items-center justify-between border-b border-amber-900/15">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-305 uppercase tracking-widest flex items-center gap-1.5 justify-start">
                <Book className="w-4 h-4 text-amber-250 animate-pulse" />
                {lang === 'en' ? "Verified Academy Advisory" : "مستند موثق ومخّرج علمياً"}
              </span>
              <h2 className="text-xl font-black font-sans leading-tight">
                {labels.responseHeading}
              </h2>
            </div>
            <div className="text-right text-[10px] text-amber-200/60 hidden sm:block font-mono">
              <p>{lang === 'en' ? "Date: Current School Session" : "التاريخ: الفصل الدراسي الجاري"}</p>
              <p>{lang === 'en' ? "Source: Ilm-Naafi Libraries" : "المصدر: مكتبة العلم النافع"}</p>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            {/* Core Answer */}
            <div className="space-y-3">
              <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-3">
                {lang === 'en' ? "Advisory Conclusion & Commentary" : "الشرح الفقهي والتعليق العلمي"}
              </h3>
              <p className="text-sm md:text-base text-slate-800 leading-relaxed font-sans" style={{ textAlign: 'justify' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {result.answer}
              </p>
            </div>

            {/* Verses block */}
            {result.verses && result.verses.length > 0 && (
              <div className="p-6 md:p-8 rounded-2xl bg-white border border-amber-900/5 space-y-6 shadow-inner">
                <span className="text-[9px] font-extrabold text-[#503020] uppercase tracking-widest flex items-center gap-1">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  {labels.guidanceVerses}
                </span>
                {result.verses.map((v, index) => (
                  <div key={index} className="space-y-3 pt-4 border-t border-amber-100 first:border-t-0 first:pt-0">
                    <p className="text-xl md:text-2xl text-emerald-950 text-center font-serif leading-loose font-extrabold" dir="rtl">
                      {v.text}
                    </p>
                    <p className="text-xs md:text-sm text-slate-505 italic leading-relaxed text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      "{v.translation}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Jurisprudence grid */}
            <div className="space-y-3 pt-6 border-t border-amber-900/10">
              <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-3">
                {labels.scholarlyConsensus}
              </h3>
              <p className="text-xs md:text-sm text-slate-750 leading-relaxed font-sans bg-amber-50/30 p-5 border border-amber-205/30 rounded-2xl italic shadow-sm" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {result.scholars}
              </p>
            </div>

            {/* Action Items */}
            {result.actionItems && result.actionItems.length > 0 && (
              <div className="pt-6 border-t border-amber-900/10 space-y-4">
                <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-[#503020] border-l-4 border-amber-800 pl-3">
                  {labels.actionsHeading}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.actionItems.map((action, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-amber-100/70 flex items-center justify-center text-xs font-bold text-[#503020] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-[9px] text-slate-500 text-center leading-relaxed mt-4 pt-6 border-t border-amber-900/10 block w-full">
              {labels.disclaimer}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
