import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, BookOpen, Clock, Settings2, PlayCircle, ShieldCheck } from 'lucide-react';
import { UserProgress } from '../types';

interface DevotionalPlannerProps {
  lang: 'en' | 'ar';
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export default function DevotionalPlanner({ lang, progress, onUpdateProgress }: DevotionalPlannerProps) {
  const [setupMode, setSetupMode] = useState<boolean>(true);
  const [setupStep, setSetupStep] = useState<number>(1);
  
  // Step 1: Inventory
  const [memorizedAmount, setMemorizedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [memorizedPortions, setMemorizedPortions] = useState<string>('');
  const [strength, setStrength] = useState<string>('');
  
  // Step 2: Frequency
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [timePerDay, setTimePerDay] = useState<string>('');
  
  // Step 3: Target
  const [completionGoal, setCompletionGoal] = useState<string>('');
  
  // Step 4: Time
  const [preferredTime, setPreferredTime] = useState<string>('');
  
  // Final Plan
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  
  // Ghost Mode
  const [ghostModeActive, setGhostModeActive] = useState(false);
  const [ghostTask, setGhostTask] = useState<string>('');
  const [engineState, setEngineState] = useState<'intro' | 'listening' | 'correction' | 'report'>('intro');
  const [engineMessage, setEngineMessage] = useState<string>('');
  const [sessionStats, setSessionStats] = useState({ mistakes: 0, hesitations: 0 });

  const calculatePlan = () => {
    setGenerating(true);
    
    setTimeout(() => {
      let totalJuz = 0;
      if (memorizedAmount === 'Juz Amma' || memorizedAmount === '1 Juz') totalJuz = 1;
      else if (memorizedAmount === '5 Juz') totalJuz = 5;
      else if (memorizedAmount === '10 Juz') totalJuz = 10;
      else if (memorizedAmount === 'Half Quran') totalJuz = 15;
      else if (memorizedAmount === '20 Juz') totalJuz = 20;
      else if (memorizedAmount === 'Full Quran') totalJuz = 30;
      else if (memorizedAmount === 'Custom') totalJuz = parseFloat(customAmount) || 1;
      
      let weeksToComplete = 1;
      if (completionGoal === 'Complete every 2 weeks') weeksToComplete = 2;
      else if (completionGoal === 'Complete monthly') weeksToComplete = 4;
      
      const totalRevisionDays = daysPerWeek * weeksToComplete;
      const juzPerDay = totalJuz / totalRevisionDays;
      
      const formatAmount = (amount: number) => {
        if (amount < 0.1) return 'Less than 1/4 Juz';
        if (amount <= 0.25) return '1/4 Juz (Rub\')';
        if (amount <= 0.5) return '1/2 Juz (Nisf)';
        if (amount <= 0.75) return '3/4 Juz';
        if (amount === 1) return '1 Juz';
        return `${amount.toFixed(1)} Juz`;
      };

      const dailyLoad = formatAmount(juzPerDay);
      
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].slice(0, daysPerWeek);
      
      const schedule = days.map((day, i) => {
        return {
          day,
          task: `Revise ${dailyLoad}`
        };
      });

      setGeneratedPlan({
        totalJuz,
        juzPerDay,
        dailyLoad,
        schedule,
        timePerDay,
        preferredTime,
        portions: memorizedPortions || memorizedAmount,
        strength
      });
      
      setGenerating(false);
      setSetupMode(false);
    }, 800);
  };

  const nextStep = () => {
    if (setupStep < 4) {
      setSetupStep(setupStep + 1);
    } else {
      calculatePlan();
    }
  };

  const prevStep = () => {
    if (setupStep > 1) {
      setSetupStep(setupStep - 1);
    }
  };

  const handleTeacherCorrection = (msg: string, type: 'mistake' | 'hesitation') => {
    setEngineState('correction');
    setEngineMessage(msg);
    if (type === 'mistake') setSessionStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
    if (type === 'hesitation') setSessionStats(prev => ({ ...prev, hesitations: prev.hesitations + 1 }));
    
    // Speak the correction in Arabic
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = 'ar-SA'; // Arabic (Saudi Arabia)
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1;
      
      // Try to find a good Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(voice => voice.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
    
    // Auto resume after 3 seconds
    setTimeout(() => {
      setEngineState('listening');
    }, 3000);
  };

  const endSession = () => {
    setGhostModeActive(false);
    setEngineState('intro');
    setSessionStats({ mistakes: 0, hesitations: 0 });
  };

  if (ghostModeActive) {
    return (
      <div className="fixed inset-0 bg-[#061410] z-[99999] flex flex-col items-center justify-center text-emerald-100 p-8">
        {engineState !== 'report' && (
          <button 
            onClick={endSession}
            className="absolute top-8 left-8 text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            End Session
          </button>
        )}
        
        <div className="max-w-2xl w-full text-center space-y-8 animate-fadeIn">
          {engineState === 'intro' && (
            <div className="space-y-8">
              <BookOpen className="w-16 h-16 mx-auto text-emerald-500/50" />
              <h2 className="text-3xl md:text-5xl font-black tracking-widest text-emerald-50">{ghostTask}</h2>
              <p className="text-emerald-400/80 font-mono text-sm uppercase tracking-widest">Muraja'ah Engine • Today's Assignment</p>
              
              <div className="pt-8">
                <button 
                  onClick={() => setEngineState('listening')}
                  className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(5,150,105,0.3)] transition-all hover:scale-105 cursor-pointer"
                >
                  Start Reciting
                </button>
              </div>
            </div>
          )}

          {engineState === 'listening' && (
            <div className="space-y-12">
              <div className="relative">
                <div className="w-32 h-32 mx-auto border-4 border-emerald-500 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                  <Activity className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>
                <p className="mt-8 text-emerald-400 font-mono text-lg uppercase tracking-widest animate-pulse">Virtual Teacher Listening...</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button 
                  onClick={() => handleTeacherCorrection('أكمل', 'hesitation')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl font-bold text-sm transition-colors border border-amber-900/50"
                >
                  Simulate Hesitation
                </button>
                <button 
                  onClick={() => handleTeacherCorrection('لا، أعد الآية', 'mistake')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-xl font-bold text-sm transition-colors border border-red-900/50"
                >
                  Simulate Mistake
                </button>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => setEngineState('report')}
                  className="px-8 py-3 bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 rounded-xl font-bold text-sm transition-colors border border-emerald-700"
                >
                  Finish Assignment
                </button>
              </div>
            </div>
          )}

          {engineState === 'correction' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="w-32 h-32 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30">
                <span className="text-4xl">🗣️</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-amber-400 font-arabic">{engineMessage}</h2>
              <p className="text-amber-200/80 font-mono text-sm uppercase tracking-widest">Virtual Teacher Correction</p>
            </div>
          )}

          {engineState === 'report' && (
            <div className="space-y-8 text-left bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl">
              <div className="text-center mb-10">
                <ShieldCheck className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                <h2 className="text-3xl font-black text-white tracking-tight">Session Complete</h2>
                <p className="text-emerald-400 font-mono text-sm mt-2">{ghostTask}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Mistakes</span>
                  <p className="text-4xl font-black text-red-400 mt-2">{sessionStats.mistakes}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Hesitations</span>
                  <p className="text-4xl font-black text-amber-400 mt-2">{sessionStats.hesitations}</p>
                </div>
              </div>

              <div className="bg-emerald-950/30 p-6 rounded-2xl border border-emerald-900/50 mt-6 text-center">
                <p className="text-emerald-300 font-medium">Next week's schedule will automatically adapt to provide more exposure to areas with mistakes.</p>
              </div>

              <div className="pt-8 text-center">
                <button 
                  onClick={endSession}
                  className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(5,150,105,0.3)] transition-all hover:scale-105 cursor-pointer"
                >
                  Continue to Planner
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-[#002f24] rounded-3xl p-6 md:p-8 text-white space-y-4 shadow-xl border border-emerald-900/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/30">
              Personal Hifz Supervisor
            </span>
            <h3 className="text-xl md:text-2xl font-black mt-3 text-emerald-50 font-sans tracking-tight">
              Devotional Planner
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-1.5 max-w-xl leading-relaxed">
              A deterministic Muraja'ah engine that calculates precise daily revision targets based on your exact memorization inventory.
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl shrink-0">
            <Settings2 className="w-6 h-6 text-emerald-400" />
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${setupStep >= step ? 'w-8 bg-emerald-600' : 'w-4 bg-slate-200'}`} />
                ))}
              </div>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Step {setupStep} of 4</span>
            </div>

            <div className="py-2">
              <AnimatePresence mode="wait">
                {setupStep === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div>
                      <label className="text-sm font-black text-slate-800 block mb-3">How much Quran have you memorized?</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['Juz Amma', '1 Juz', '5 Juz', '10 Juz', 'Half Quran', '20 Juz', 'Full Quran', 'Custom'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setMemorizedAmount(opt)}
                            className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${memorizedAmount === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 bg-white text-slate-600 hover:border-emerald-200'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {memorizedAmount === 'Custom' && (
                        <div className="mt-3">
                          <input type="number" placeholder="Enter number of Juz" value={customAmount} onChange={e => setCustomAmount(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-black text-slate-800 block mb-3">What specific portions? <span className="text-slate-400 font-normal text-xs">(Optional)</span></label>
                      <input type="text" placeholder="e.g. Surah Al-Baqarah 1-141, Juz 29" value={memorizedPortions} onChange={e => setMemorizedPortions(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500" />
                    </div>

                    <div>
                      <label className="text-sm font-black text-slate-800 block mb-3">How strong is your memorization?</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {['Very Strong', 'Strong', 'Average', 'Weak', 'Needs Rebuilding'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setStrength(opt)}
                            className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${strength === opt ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-100 bg-white text-slate-600 hover:border-amber-200'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {setupStep === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div>
                      <label className="text-sm font-black text-slate-800 block mb-3">How many days per week do you revise?</label>
                      <div className="grid grid-cols-7 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <button
                            key={num}
                            onClick={() => setDaysPerWeek(num)}
                            className={`p-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${daysPerWeek === num ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 bg-white text-slate-600 hover:border-emerald-200'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-black text-slate-800 block mb-3">How much time per day?</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['30 Minutes', '1 Hour', '2 Hours', '3 Hours'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setTimePerDay(opt)}
                            className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${timePerDay === opt ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-100 bg-white text-slate-600 hover:border-amber-200'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {setupStep === 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div>
                      <label className="text-sm font-black text-slate-800 block mb-3">What is your revision target?</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { id: 'Complete all memorized portions weekly', label: 'Finish Weekly' },
                          { id: 'Complete every 2 weeks', label: 'Finish Every 2 Weeks' },
                          { id: 'Complete monthly', label: 'Finish Monthly' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setCompletionGoal(opt.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${completionGoal === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                          >
                            <h5 className="font-bold text-slate-800 text-sm">{opt.label}</h5>
                            <p className="text-[10px] text-slate-500 mt-1">{opt.id}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {setupStep === 4 && (
                  <motion.div key="step-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div>
                      <label className="text-sm font-black text-slate-800 block mb-3">When do you revise?</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['After Fajr', 'Morning', 'After Dhuhr', 'After Asr', 'After Maghrib', 'After Isha'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setPreferredTime(opt)}
                            className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${preferredTime === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 bg-white text-slate-600 hover:border-emerald-200'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              {setupStep > 1 ? (
                <button onClick={prevStep} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer">
                  Back
                </button>
              ) : <div></div>}
              
              <button 
                onClick={nextStep}
                disabled={generating || (setupStep === 1 && (!memorizedAmount || !strength)) || (setupStep === 2 && !timePerDay) || (setupStep === 3 && !completionGoal) || (setupStep === 4 && !preferredTime)}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {generating ? 'Calculating...' : setupStep === 4 ? 'Build The Plan' : 'Continue'}
              </button>
            </div>
          </motion.div>
        ) : generatedPlan && (
          <motion.div
            key="generated-plan"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Today's Mission Panel */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">Today's Muraja'ah</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Scheduled for {generatedPlan.preferredTime} • Estimated: {generatedPlan.timePerDay}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target Load</span>
                  <p className="text-2xl font-black text-slate-800 mt-1">{generatedPlan.dailyLoad}</p>
                  <p className="text-xs text-slate-500 mt-1">From: {generatedPlan.portions}</p>
                </div>
                
                <button 
                  onClick={() => {
                    setGhostTask(generatedPlan.dailyLoad);
                    setGhostModeActive(true);
                  }}
                  className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Session
                </button>
              </div>
            </div>

            {/* Weekly Schedule Overview */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h4 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Weekly Protocol
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedPlan.schedule.map((day: any, i: number) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{day.day}</span>
                    <span className="text-sm font-bold text-slate-800">{day.task}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
               <button onClick={() => setSetupMode(true)} className="text-xs font-bold text-slate-400 hover:text-slate-600 underline">
                 Reconfigure Plan
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
