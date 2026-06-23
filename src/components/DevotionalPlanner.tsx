import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Activity, Clock, FileWarning, PlayCircle, BarChart, CheckCircle2, Circle } from 'lucide-react';
import { UserProgress } from '../types';

interface DevotionalPlannerProps {
  lang: 'en' | 'ar';
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export default function DevotionalPlanner({ lang, progress, onUpdateProgress }: DevotionalPlannerProps) {
  const [setupMode, setSetupMode] = useState<boolean>(true);
  const [setupStep, setSetupStep] = useState<number>(1);
  
  // Step 1: Planner Creation Flow State
  const [quranGoal, setQuranGoal] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState<string>('');
  const [availableTime, setAvailableTime] = useState<string>('');
  const [coreFocus, setCoreFocus] = useState<string>('');
  
  const [generating, setGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(null);

  // Step 3 & 4: Ghost Murāja'ah Mode
  const [ghostModeActive, setGhostModeActive] = useState(false);
  
  // View 8: Weekly Review
  const [reviewing, setReviewing] = useState(false);
  const [weeklyReview, setWeeklyReview] = useState<string>('');

  const handleGeneratePlan = async () => {
    setGenerating(true);
    // Simulate generation for Devotional Plan Map based on Rule Engine
    setTimeout(() => {
      setAiPlan({
        message: `Based on your ${availableTime || '30m'} availability and focus on ${coreFocus || 'quran'}, here is your realistic daily map. I recommend breaking it into equal sessions post-Fajr and before sleep.`,
        tasks: [
          { id: 'quran_task_1', title: 'Memorize 2 new lines', type: 'quran', time: '15m' },
          { id: 'quran_task_2', title: 'Review 1 page (Muraja\'ah)', type: 'revision', time: '15m' }
        ]
      });
      setGenerating(false);
      setSetupMode(false);
    }, 1500);
  };

  const handleGenerateReview = () => {
    setReviewing(true);
    setTimeout(() => {
      setWeeklyReview("You did great with Morning Adhkar (7/7), but missed your Muraja'ah twice. Try shifting Muraja'ah to the morning when your energy is higher.");
      setReviewing(false);
    }, 1500);
  };

  const nextStep = () => {
    if (setupStep < 4) {
      setSetupStep(setupStep + 1);
    } else {
      handleGeneratePlan();
    }
  };

  const prevStep = () => {
    if (setupStep > 1) {
      setSetupStep(setupStep - 1);
    }
  };

  if (ghostModeActive) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex flex-col items-center justify-center text-emerald-100 p-8">
        <button 
          onClick={() => setGhostModeActive(false)}
          className="absolute top-8 left-8 text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-xl"
        >
          Exit Ghost Mode
        </button>
        <div className="max-w-2xl text-center space-y-8 animate-fadeIn">
          <BookOpenIcon />
          <h2 className="text-3xl font-black tracking-widest">Surah Al-Mulk</h2>
          <p className="text-emerald-400/80 font-mono text-sm uppercase tracking-widest">Deep Focus Active • No Distractions</p>
          <div className="w-full max-w-sm mx-auto h-2 bg-slate-800 rounded-full mt-10 overflow-hidden">
             <div className="h-full bg-emerald-500 w-[10%] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-gradient-to-br from-slate-900 to-[#002f24] rounded-3xl p-6 md:p-8 text-white space-y-4 shadow-xl border border-emerald-900/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/30">
              Personal Productivity System
            </span>
            <h3 className="text-xl md:text-2xl font-black mt-3 text-emerald-50 font-sans tracking-tight">
              Islamic Devotional Planner
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-1.5 max-w-xl leading-relaxed">
              Consistently achieve your Quran, Murāja'ah, Adhkar, Salah, and Knowledge goals through dynamic tracking and personalized AI scheduling.
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl shrink-0">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {setupMode ? (
          <motion.div
            key="setup-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-sm"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900">Create Devotional Plan</h4>
              <p className="text-[11px] text-slate-500">Provide your current benchmarks to configure a precise map.</p>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${setupStep >= step ? 'w-8 bg-emerald-600' : 'w-4 bg-slate-200'}`} />
                ))}
              </div>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Step {setupStep} of 4</span>
            </div>

            <div className="py-4">
              <AnimatePresence mode="wait">
                {setupStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <label className="text-sm font-black text-slate-800 block text-center mb-6">What is your primary Quran goal right now?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'entire', title: 'Memorize Entirely', desc: 'Full Hifz journey' },
                        { id: 'portions', title: 'Memorize Portions', desc: 'Selected Surahs only' },
                        { id: 'reading', title: 'Daily Reading', desc: 'Consistent Khatam' },
                        { id: 'murajaah', title: 'Only Muraja\'ah', desc: 'Retaining what I know' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setQuranGoal(opt.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${quranGoal === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                        >
                          <h5 className="font-bold text-slate-800 text-sm">{opt.title}</h5>
                          <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {setupStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <label className="text-sm font-black text-slate-800 block text-center mb-6">What is your current proficiency level?</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'beginner', title: 'Beginner', desc: 'Starting fresh' },
                        { id: 'intermediate', title: 'Intermediate', desc: 'Know rules, building habits' },
                        { id: 'advanced', title: 'Advanced', desc: 'Solid foundation, deep refning' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setCurrentLevel(opt.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${currentLevel === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                        >
                          <h5 className="font-bold text-slate-800 text-sm">{opt.title}</h5>
                          <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {setupStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <label className="text-sm font-black text-slate-800 block text-center mb-6">How much realistic time can you commit daily?</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: '15m', title: '15 Min' },
                        { id: '30m', title: '30 Min' },
                        { id: '1h', title: '1 Hour' },
                        { id: '2h', title: '2+ Hours' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setAvailableTime(opt.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${availableTime === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                        >
                          <h5 className="font-bold text-slate-800 text-sm">{opt.title}</h5>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {setupStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <label className="text-sm font-black text-slate-800 block text-center mb-6">What is your core focus outside of Quran?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'quran', title: 'Quran Memorization Only', desc: 'Focus strictly on Hifz' },
                        { id: 'studies', title: 'Exams/Studies', desc: 'Balancing school/university' },
                        { id: 'patience', title: 'Mental Health/Patience', desc: 'Need spiritual grounding' },
                        { id: 'tahajjud', title: 'Night Prayers', desc: 'Establishing Tahajjud' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setCoreFocus(opt.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${coreFocus === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                        >
                          <h5 className="font-bold text-slate-800 text-sm">{opt.title}</h5>
                          <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={setupStep === 1 || generating}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50 transition cursor-pointer"
              >
                Back
              </button>
              
              <button
                disabled={generating || 
                  (setupStep === 1 && !quranGoal) || 
                  (setupStep === 2 && !currentLevel) || 
                  (setupStep === 3 && !availableTime) || 
                  (setupStep === 4 && !coreFocus)
                }
                onClick={nextStep}
                className="bg-[#004d3d] hover:bg-[#00362b] text-white px-6 py-2.5 rounded-xl font-bold text-xs tracking-tight transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {generating ? <span className="animate-pulse">Analyzing...</span> : (
                  setupStep === 4 ? <>Generate Plan <Sparkles className="w-3.5 h-3.5"/></> : 'Continue'
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* AI Generated Strategy Concept */}
            {aiPlan && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 md:p-6 text-emerald-950 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">Architected Strategy</h4>
                <p className="text-[12px] font-medium leading-relaxed max-w-2xl relative z-10">{aiPlan.message}</p>
                <button onClick={() => setSetupMode(true)} className="text-[9px] font-bold text-emerald-700 mt-4 underline underline-offset-2">Reconfigure Parameters</button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Timeline */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Daily Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                       <div className="flex-1">
                         <h5 className="text-xs font-bold text-slate-800">Morning Adhkar</h5>
                         <p className="text-[10px] text-slate-500">Post-Fajr • 10m</p>
                       </div>
                    </div>
                    {aiPlan?.tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                         <Circle className="w-5 h-5 text-slate-300" />
                         <div className="flex-1">
                           <h5 className="text-xs font-bold text-slate-800">{task.title}</h5>
                           <p className="text-[10px] text-slate-500">{task.time}</p>
                         </div>
                         {task.type === 'revision' && (
                           <button 
                             onClick={() => setGhostModeActive(true)}
                             className="text-[9px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                           >
                             <PlayCircle className="w-3.5 h-3.5" />
                             Ghost Murāja'ah
                           </button>
                         )}
                      </div>
                    ))}
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50">
                       <Circle className="w-5 h-5 text-slate-300" />
                       <div className="flex-1">
                         <h5 className="text-xs font-bold text-slate-800">Evening Adhkar</h5>
                         <p className="text-[10px] text-slate-500">After Asr/Maghrib • 10m</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Muhasabah Engine</h4>
                     <button 
                       onClick={handleGenerateReview}
                       disabled={reviewing}
                       className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg"
                     >
                       {reviewing ? 'Analyzing...' : 'Generate Weekly Review'}
                     </button>
                   </div>
                   {weeklyReview ? (
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                       <p className="text-xs font-medium text-slate-700 leading-relaxed">{weeklyReview}</p>
                     </div>
                   ) : (
                     <p className="text-[10px] text-slate-400 italic text-center py-6">Run analysis at the end of the week to adapt your schedule.</p>
                   )}
                </div>
              </div>

              {/* Rings & Heatmap */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm text-center">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Wird Completion Rings</h4>
                   <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                     {/* Outer Ring */}
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-500" strokeDasharray="351.85" strokeDashoffset="100" />
                     </svg>
                     {/* Inner Ring */}
                     <svg className="w-24 h-24 absolute transform -rotate-90">
                       <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                       <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-amber-500" strokeDasharray="251.2" strokeDashoffset="150" />
                     </svg>
                     <div className="absolute text-center flex flex-col items-center">
                       <Activity className="w-5 h-5 text-slate-400 mb-0.5" />
                       <span className="text-[10px] font-black">74%</span>
                     </div>
                   </div>
                   <div className="mt-5 space-y-2 text-[10px] font-bold text-slate-600 flex flex-col items-center">
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Standard Adhkar</span>
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Custom Wird Tracker</span>
                   </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Consistency Matrix</h4>
                   <div className="grid grid-cols-7 gap-1">
                     {Array.from({ length: 28 }).map((_, i) => (
                       <div key={i} className={`aspect-square rounded-sm ${Math.random() > 0.4 ? 'bg-emerald-500/80' : 'bg-slate-100'}`} />
                     ))}
                   </div>
                   <p className="text-[9px] text-slate-400 text-center mt-3 font-mono">Last 28 Days Activity</p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BookOpenIcon() {
  return <BookOpen className="w-12 h-12 text-emerald-500 mx-auto animate-pulse" />;
}
import { BookOpen } from 'lucide-react';
