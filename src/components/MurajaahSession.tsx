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

  const isListeningOrMatching = state === 'listening' || state === 'matching' || state === 'go_back_test';
  const isTeacherPrompt = state === 'teacher_prompt' || state === 'waiting_retry' || state === 'correction_playback';

  // Extract Surah Name from taskName if possible
  const surahName = taskName.includes('-') ? taskName.split('-')[0].trim() : taskName;

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
        
        {state === 'preparing' && (
          <div className="space-y-8">
            <BookOpen className="w-16 h-16 mx-auto text-emerald-500/50" />
            <h2 className="text-3xl md:text-5xl font-black tracking-widest text-emerald-50">{surahName}</h2>
            <p className="text-emerald-400/80 font-mono text-sm uppercase tracking-widest">
              Ayah 1–{ayahs.length}
            </p>
            
            <div className="pt-8">
              <button 
                onClick={start}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(5,150,105,0.3)] transition-all hover:scale-105 cursor-pointer"
              >
                Start Reciting
              </button>
            </div>
          </div>
        )}

        {(isListeningOrMatching || isTeacherPrompt || state === 'advance_ayah') && (
          <div className="space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h3 className="text-xl font-medium text-emerald-400/80 mb-4">Murāja'ah Session</h3>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                <span className="font-mono text-sm tracking-widest text-emerald-300">Listening...</span>
              </div>
              <div className="text-center pt-10">
                 <h2 className="text-4xl font-black text-white tracking-widest mb-3">{surahName}</h2>
                 <p className="text-emerald-500/80 font-mono tracking-widest uppercase">Ayah {currentIndex + 1}–{ayahs.length}</p>
              </div>
            </div>

            <AnimatePresence>
              {isTeacherPrompt && lastCorrection?.type === 'mistake' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-16 text-center bg-red-950/20 border border-red-900/40 p-8 rounded-3xl max-w-lg mx-auto"
                >
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-4">Last Correct:</p>
                  <p className="text-3xl font-arabic text-red-200/90 leading-relaxed">{lastCorrection.message}</p>
                  <p className="mt-8 text-red-400/80 font-mono text-xs uppercase tracking-widest animate-pulse">Continue...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-16 text-center">
              <button 
                onClick={() => stop()}
                className="px-8 py-3 bg-[#0a1a16] hover:bg-slate-900 text-slate-500 rounded-full font-bold text-xs uppercase tracking-widest transition-colors border border-slate-800"
              >
                End Session Early
              </button>
            </div>
          </div>
        )}

        {state === 'report' && stats && (
          <div className="space-y-8 text-center bg-[#0a1a16] border border-emerald-900/30 p-12 rounded-3xl animate-fadeIn max-w-lg mx-auto">
            <ShieldCheck className="w-16 h-16 mx-auto text-emerald-500 mb-6" />
            <h2 className="text-3xl font-black text-white tracking-tight">Session Complete</h2>
            <p className="text-emerald-400/60 font-mono text-sm mt-4">Audio feedback playing...</p>
            
            <div className="pt-12 flex flex-col gap-4">
              <button 
                className="px-8 py-4 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-200 rounded-2xl font-bold text-sm transition-all border border-emerald-800/50 flex items-center justify-center gap-2"
                onClick={() => { /* Audio replay logic */ }}
              >
                Replay Feedback
              </button>
              <button 
                onClick={onClose}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(5,150,105,0.2)] transition-all hover:scale-105 cursor-pointer"
              >
                Finish
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

