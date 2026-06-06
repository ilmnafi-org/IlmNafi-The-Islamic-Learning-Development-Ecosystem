/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  History, 
  Clock, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Edit, 
  Send,
  Award,
  BookMarked,
  FileText,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRICULUM_DATA } from '../data';
import { Subject, Lesson, UserProgress } from '../types';

interface CurriculumViewProps {
  progress: UserProgress;
  onCompleteLesson: (lessonId: string) => void;
}

export default function CurriculumView({ progress, onCompleteLesson }: CurriculumViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Suggestion contribution modal state
  const [showContribute, setShowContribute] = useState(false);
  const [contribSubject, setContribSubject] = useState('sub-quran');
  const [contribTitle, setContribTitle] = useState('');
  const [contribContent, setContribContent] = useState('');
  const [contribSubmitted, setContribSubmitted] = useState(false);

  // Map icon names to Lucide elements
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-700" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-700" />;
      case 'History': return <History className="w-5 h-5 text-emerald-700" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-700" />;
    }
  };

  const filteredSubjects = CURRICULUM_DATA.filter(sub => {
    const matchesSubject = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLessons = sub.lessons.some(l => 
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesSubject || matchesLessons;
  });

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveQuizIndex(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!selectedLesson?.quiz) return;
    if (Object.keys(selectedAnswers).length < selectedLesson.quiz.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setQuizSubmitted(true);
    // Mark as completed
    onCompleteLesson(selectedLesson.id);
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribTitle || !contribContent) return;
    setContribSubmitted(true);
    setTimeout(() => {
      // Clear after submission simulation
      setContribTitle('');
      setContribContent('');
      setShowContribute(false);
      setContribSubmitted(false);
      alert("Jazakum Allah Khayr! Your contribution has been submitted to the community editor board for peer review.");
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="curriculum-container">
      
      {/* HEADER SECTION */}
      {!selectedLesson && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-200/80"
          id="curriculum-header-block"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-3 border border-emerald-250/30">
              <BookMarked className="w-3 h-3 text-emerald-700" />
              Academic Open Repository
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              Interactive Scholar Curricula
            </h1>
            <p className="text-slate-600 mt-3 max-w-2xl text-sm leading-relaxed">
              Explore our peer-reviewed knowledge architecture. Read verified curricula texts, study historical sources, and validate your progression with specialized academic quizzes.
            </p>
          </div>
          <button 
            onClick={() => setShowContribute(true)}
            className="group bg-slate-900 hover:bg-emerald-950 text-white flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
            id="btn-contribute"
          >
            <Edit className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            Contribute Scholarly Text
          </button>
        </motion.div>
      )}

      {/* ARTICLE READER VIEW */}
      <AnimatePresence mode="wait">
        {selectedLesson ? (
          <motion.div 
            key="reader"
            className="bg-[#faf8f4] rounded-3xl border border-amber-900/10 shadow-xl overflow-hidden" 
            id="lesson-reader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {/* Elegant Topbar */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5 bg-white border-b border-amber-900/10">
              <button 
                onClick={() => setSelectedLesson(null)}
                className="group flex items-center gap-2 text-slate-600 hover:text-emerald-850 font-bold text-xs"
                id="btn-lesson-back"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                Return to Academy Syllabus
              </button>
              
              <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
                <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedLesson.duration} Premium Read</span>
                </span>
                
                {progress.lessonsCompleted.includes(selectedLesson.id) && (
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Verified Pass
                  </span>
                )}
              </div>
            </div>

            {/* Reading Board Canvas resembling high-level academic publications */}
            <div className="p-6 md:p-14 max-w-4xl mx-auto">
              
              {/* Header block with elegant double-rule */}
              <div className="text-center mb-10 pb-6 border-b border-double border-amber-900/20">
                <span className="font-serif text-amber-800 text-xs tracking-widest font-bold uppercase">SECTION ARTICLE</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-sans tracking-tight leading-tight mt-2">
                  {selectedLesson.title}
                </h2>
              </div>
              
              {/* Journal Article Content */}
              <div className="font-serif text-slate-800 leading-relaxed text-base md:text-lg space-y-6">
                {selectedLesson.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl md:text-2xl font-bold font-sans text-emerald-950 pt-8 border-b border-emerald-100/60 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-700 rounded-full inline-block"></span>
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('#### ')) {
                    return (
                      <h4 key={index} className="text-base md:text-lg font-bold font-sans text-amber-850 pt-4">
                        {paragraph.replace('#### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('* ')) {
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-3 font-sans text-sm md:text-base text-slate-700 my-4">
                        {paragraph.split('\n').map((li, liIdx) => (
                          <li key={liIdx} className="pl-1">
                            {li.replace('* ', '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  // Quranic plaque or scholarly quote block styling
                  if (paragraph.includes(' * ')) {
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={index} 
                        className="pl-5 pr-5 py-4 border-l-4 border-emerald-700 text-emerald-950 bg-emerald-50/50 rounded-r-xl font-serif text-sm md:text-base leading-relaxed my-6 shadow-sm border border-emerald-900/5"
                      >
                        {paragraph}
                      </motion.div>
                    );
                  }
                  return <p key={index} className="whitespace-pre-line text-justify leading-relaxed">{paragraph}</p>;
                })}
              </div>

              {/* INTERACTIVE QUIZ SECTION */}
              {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16 pt-10 border-t-2 border-dashed border-amber-900/10" 
                  id="quiz-block"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-250/30 flex items-center justify-center text-amber-805">
                      <Award className="w-5 h-5 text-amber-750" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Academic Knowledge Check</h3>
                      <p className="text-xs text-slate-505">Validate understanding of this text block to mark it complete.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {selectedLesson.quiz.map((q, qIdx) => {
                      const isAnswered = selectedAnswers[qIdx] !== undefined;
                      const isCorrect = selectedAnswers[qIdx] === q.answerIndex;

                      return (
                        <div key={qIdx} className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 hover:shadow-md transition-all duration-300">
                          <h4 className="text-base font-bold text-slate-900 mb-5 leading-snug">
                            Question {qIdx + 1}: {q.question}
                          </h4>
                          
                          <div className="space-y-3">
                            {q.options.map((option, oIdx) => {
                              const isSelected = selectedAnswers[qIdx] === oIdx;
                              let btnStyle = "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 hover:border-slate-350";

                              if (quizSubmitted) {
                                if (oIdx === q.answerIndex) {
                                  btnStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold";
                                } else if (isSelected) {
                                  btnStyle = "border-rose-450 bg-rose-50 text-rose-900";
                                } else {
                                  btnStyle = "border-slate-100 bg-white text-slate-400 opacity-50";
                                }
                              } else if (isSelected) {
                                btnStyle = "border-emerald-600 bg-emerald-100/50 text-emerald-950 font-bold shadow-sm";
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleAnswerSelect(qIdx, oIdx)}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all duration-200 flex items-center justify-between cursor-pointer ${btnStyle}`}
                                  id={`quiz-q${qIdx}-option-${oIdx}`}
                                >
                                  <span>{option}</span>
                                  {quizSubmitted && oIdx === q.answerIndex && (
                                    <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded">Correct Answer</span>
                                  )}
                                  {quizSubmitted && isSelected && oIdx !== q.answerIndex && (
                                    <span className="text-rose-700 font-bold text-xs bg-rose-100 px-2 py-0.5 rounded">Your Selection</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation block once submitted */}
                          {quizSubmitted && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-5 p-4 bg-amber-50/50 border border-amber-200/40 rounded-xl text-xs text-slate-700"
                            >
                              <strong className="text-amber-900 block mb-1">Scholarly Commentary:</strong>
                              {q.explanation}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Quiz actions */}
                  <div className="mt-10 flex justify-end">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="bg-emerald-805 hover:bg-emerald-900 text-white font-bold px-6 py-3.5 rounded-xl text-xs tracking-wide transition shadow-md active:scale-95"
                        id="btn-quiz-submit"
                      >
                        Submit Examination Answers
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedLesson(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="border border-emerald-700 text-emerald-850 hover:bg-emerald-50 font-extrabold px-6 py-3.5 rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
                        id="btn-quiz-continue"
                      >
                        Continue to Next Lesson <ArrowRight className="w-4 h-4 animate-bounce" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          /* SUBJECT OVERVIEW & BROWSER */
          <motion.div 
            key="browser"
            className="space-y-12 animate-fadeIn" 
            id="curriculum-browser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* SEARCH ROW */}
            <div className="relative max-w-lg shadow-sm rounded-xl">
              <input 
                type="text"
                placeholder="Search scholar subjects, topic manuscripts, summaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 pl-12 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-sans text-slate-800 transition-all shadow-sm"
                id="curriculum-search"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            </div>

            {/* SUBJECT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSubjects.map((subject, idx) => {
                const isSelected = selectedSubject?.id === subject.id;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={subject.id} 
                    className={`bg-white border rounded-2xl hover:shadow-xl hover:border-emerald-600/30 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                      isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/10' : 'border-slate-200/85'
                    }`}
                    onClick={() => setSelectedSubject(isSelected ? null : subject)}
                    id={`subject-card-${subject.id}`}
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {renderIcon(subject.icon)}
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-black tracking-wider uppercase">
                          {subject.gradeRange}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {subject.name}
                      </h3>
                      {subject.arabicName && (
                        <p className="text-emerald-800/90 font-serif text-lg mt-1 pb-4 border-b border-slate-150 inline-block font-bold" dir="rtl">
                          {subject.arabicName}
                        </p>
                      )}
                      
                      <p className="text-slate-600 text-xs leading-relaxed mt-4 line-clamp-3">
                        {subject.description}
                      </p>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between group-hover:bg-slate-100/50 transition-colors">
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {subject.lessons.length} Detailed Modules
                      </span>
                      <span className="text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                        {isSelected ? "Hide syllabus" : "Explore syllabus"}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ACTIVE SUBJECT LESSON LIST & SYLLABUS DETAIL */}
            {selectedSubject && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50/20 rounded-3xl border border-amber-900/10 p-6 md:p-10" 
                id="lessons-list"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-amber-900/10 pb-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#111c12] tracking-tight">
                      {selectedSubject.name} — Syllabus Articles
                    </h3>
                    <p className="text-xs text-slate-550 mt-1">Select an article below to enter the interactive academic reader view.</p>
                  </div>
                  <span className="text-xs font-bold bg-amber-100/50 text-amber-900 border border-amber-200/40 px-3 py-1.5 rounded-xl shrink-0 self-start">
                    {selectedSubject.lessons.length} Modules Available
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedSubject.lessons.map((lesson) => {
                    const isCompleted = progress.lessonsCompleted.includes(lesson.id);
                    return (
                      <div 
                        key={lesson.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-600/40 hover:shadow-md transition-all duration-300 shadow-sm"
                      >
                        <div className="max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-extrabold text-slate-900 text-base md:text-lg">
                              {lesson.title}
                            </h4>
                            {isCompleted && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Checked Complete
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {lesson.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
                          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {lesson.duration} study
                          </span>
                          <button
                            onClick={() => handleStartLesson(lesson)}
                            className="bg-emerald-805 hover:bg-emerald-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                            id={`btn-start-${lesson.id}`}
                          >
                            {isCompleted ? "Reread & Practice" : "Launch Reader"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPEN SOURCE COMMUNITY CONTRIBUTOR POPUP */}
      <AnimatePresence>
        {showContribute && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-800 rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden" 
              id="contribute-modal"
            >
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-emerald-700" />
                  Community Manuscript Submission
                </h3>
                <button 
                  onClick={() => setShowContribute(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSuggestSubmit} className="p-6 space-y-4 font-sans">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thank you for contributing to the Al-Hikmah open academy! Your historical or linguistic submission enters a scholarly blind peer review for factual and doctrinal verification.
                </p>

                <div>
                  <label className="block text-[10px] font-bold text-slate-705 uppercase mb-1">Select Subject Field</label>
                  <select 
                    value={contribSubject}
                    onChange={(e) => setContribSubject(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50/55 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    {CURRICULUM_DATA.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-705 uppercase mb-1">Article or Draft Title</label>
                  <input 
                    type="text" 
                    value={contribTitle}
                    onChange={(e) => setContribTitle(e.target.value)}
                    placeholder="e.g., Al-Farabi's Classification of the Sciences"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-705 uppercase mb-1">Article Content (Markdown supported)</label>
                  <textarea 
                    rows={5}
                    value={contribContent}
                    onChange={(e) => setContribContent(e.target.value)}
                    placeholder="Provide your structured text block, citations, and linguistic notes..."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowContribute(false)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={contribSubmitted}
                    className="bg-emerald-805 hover:bg-emerald-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    id="btn-contrib-submit"
                  >
                    {contribSubmitted ? "Uploading Submission..." : "Submit Manuscript"}
                    <Send className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
