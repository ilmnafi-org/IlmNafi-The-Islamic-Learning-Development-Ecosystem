import React, { useEffect, useState } from 'react';
import { useMurajaah } from '../hooks/useMurajaah';
import { Activity, BookOpen, ShieldCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MurajaahSessionProps {
  juzTarget: number;
  taskName: string;
  onClose: () => void;
}

export default function MurajaahSession({ juzTarget, taskName, onClose }: MurajaahSessionProps) {
  const { 
    state, 
    ayahs, 
    currentIndex, 
    stats, 
    lastCorrection, 
    transcript,
    loadSession, 
    start, 
    stop 
  } = useMurajaah();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession(juzTarget).then(() => {
      setIsLoading(false);
    });
  }, [juzTarget]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#061410] z-[99999] flex flex-col items-center justify-center text-emerald-100 p-8">
        <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="mt-4 font-mono text-sm tracking-widest text-emerald-400/80">LOADING MURAJA'AH ENGINE...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#061410] z-[99999] flex flex-col items-center justify-center text-emerald-100 p-8 overflow-hidden">
      {state !== 'report' && (
        <button 
          onClick={() => { stop(); onClose(); }}
          className="absolute top-8 left-8 text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
        >
          <XCircle className="w-3.5 h-3.5" /> End Session
        </button>
      )}

      <div className="max-w-2xl w-full text-center space-y-8 animate-fadeIn">
        
        {state === 'intro' && (
          <div className="space-y-8">
            <BookOpen className="w-16 h-16 mx-auto text-emerald-500/50" />
            <h2 className="text-3xl md:text-5xl font-black tracking-widest text-emerald-50">{taskName}</h2>
            <p className="text-emerald-400/80 font-mono text-sm uppercase tracking-widest">
              Engine Ready • {ayahs.length} Ayahs Loaded
            </p>
            
            <div className="pt-8">
              <button 
                onClick={start}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(5,150,105,0.3)] transition-all hover:scale-105 cursor-pointer"
              >
                Start Reciting
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-amber-900/20 border border-amber-900/50 rounded-xl max-w-sm mx-auto text-amber-200/80 text-xs text-left leading-relaxed">
              <strong>Note on browser speech recognition:</strong> Arabic dialect support depends on your OS and browser. Enunciate clearly in Fusha. The engine listens continuously and matches your words to the Quranic text. If you pause for 8 seconds, the teacher will prompt you to continue.
            </div>
          </div>
        )}

        {(state === 'listening' || state === 'correction') && (
          <div className="space-y-12">
            
            {/* Progression UI */}
            <div className="flex flex-col items-center gap-2 mb-12">
              <span className="text-xs font-mono text-emerald-500/80 uppercase tracking-widest">
                Ayah {currentIndex + 1} of {ayahs.length}
              </span>
              <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(currentIndex / ayahs.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="relative h-40">
              <AnimatePresence mode="wait">
                {state === 'listening' ? (
                  <motion.div 
                    key="listening"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <div className="w-24 h-24 border-4 border-emerald-500 rounded-full flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                      <Activity className="w-10 h-10 text-emerald-400 animate-pulse" />
                    </div>
                    <p className="mt-6 text-emerald-400 font-mono text-sm uppercase tracking-widest animate-pulse">
                      Listening...
                    </p>
                    {transcript && (
                      <p className="mt-4 text-emerald-100/50 font-arabic text-lg max-w-md truncate">
                        "{transcript}"
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="correction"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border ${
                      lastCorrection?.type === 'mistake' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
                    }`}>
                      <span className="text-3xl">🗣️</span>
                    </div>
                    <h2 className={`text-4xl font-black mt-6 font-arabic ${
                      lastCorrection?.type === 'mistake' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {lastCorrection?.message}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Expected target (hidden by default for ghost mode, but useful for debugging) */}
            <div className="opacity-0 hover:opacity-100 transition-opacity p-4 border border-slate-800 rounded-xl mt-8">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Target Ayah (Hover to reveal)</span>
              <p className="font-arabic text-xl text-slate-300">{ayahs[currentIndex]?.text}</p>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => stop()}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold text-sm transition-colors border border-slate-700"
              >
                End Session Early
              </button>
            </div>
          </div>
        )}

        {state === 'report' && stats && (
          <div className="space-y-8 text-left bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl animate-fadeIn">
            <div className="text-center mb-10">
              <ShieldCheck className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
              <h2 className="text-3xl font-black text-white tracking-tight">Session Complete</h2>
              <p className="text-emerald-400 font-mono text-sm mt-2">{taskName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Mistakes</span>
                <p className="text-4xl font-black text-red-400 mt-2">{stats.mistakes}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Hesitations</span>
                <p className="text-4xl font-black text-amber-400 mt-2">{stats.hesitations}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Ayahs Completed</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{stats.completedAyahs} / {ayahs.length}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Duration</span>
                  <p className="text-2xl font-black text-white mt-1">
                    {Math.floor(stats.durationMs / 60000)}m {Math.floor((stats.durationMs % 60000) / 1000)}s
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/30 p-6 rounded-2xl border border-emerald-900/50 mt-6 text-center">
              <p className="text-emerald-300 font-medium text-sm">
                Next week's schedule will automatically adapt based on these metrics to strengthen retention.
              </p>
            </div>

            <div className="pt-8 text-center">
              <button 
                onClick={onClose}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(5,150,105,0.3)] transition-all hover:scale-105 cursor-pointer"
              >
                Return to Planner
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
