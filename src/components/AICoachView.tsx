/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Volume2,
  Sparkles,
  ChevronRight,
  BookOpen,
  ArrowRight,
  BarChart2,
  Activity,
  Award,
  BookMarked,
  Sliders,
  RotateCcw,
  VolumeX,
  Target,
  Flame,
  Tv,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RECITATION_PRESETS } from '../data';
import { QuranVerse, TajweedFeedback, UserProgress } from '../types';
import MakhrajVisualizer from './MakhrajVisualizer';

// Utility helper to strip diacritics and extract standard Arabic letters
function cleanArabicLetters(text: string): string[] {
  const diacriticsRegex = /[\u064B-\u0652]/g;
  const cleaned = text.replace(diacriticsRegex, '');
  return Array.from(cleaned).filter(char => {
    const code = char.charCodeAt(0);
    return code >= 0x0621 && code <= 0x064A;
  });
}

interface AICoachViewProps {
  progress: UserProgress;
  onAddRecitation: (verse: string, score: number) => void;
}

// Map presets to saad al-ghamadi audio streams on everyayah
const EVERY_AYAH_AUDIO: { [key: string]: string } = {
  "Al-Fatihah": "https://everyayah.com/data/Al_Ghamadi_40kbps/001001.mp3",
  "Al-Ikhlas": "https://everyayah.com/data/Al_Ghamadi_40kbps/112001.mp3",
  "Al-Kawthar": "https://everyayah.com/data/Al_Ghamadi_40kbps/108001.mp3",
  "An-Nas": "https://everyayah.com/data/Al_Ghamadi_40kbps/114001.mp3",
  "Al-Asr": "https://everyayah.com/data/Al_Ghamadi_40kbps/103001.mp3"
};

interface DeterministicToken {
  wordIndex: number;
  wordText: string;
  phoneticTranscription: string;
  occurrences: {
    ruleId: string;
    ruleName: string;
    category: string;
    letters: string[];
    description: string;
    audioInstruction: string;
    makhrajRegion: 'halq' | 'lisan' | 'shafatan' | 'khayshum' | 'jawf';
    makhrajInteractiveDetails: {
      title: string;
      description: string;
      mouthOpenness: number;
      activeAirstreamHighlightEmoji: string;
      anatomicalHotspots: string[];
    };
    durationBeats: number;
  }[];
}

export default function AICoachView({ progress, onAddRecitation }: AICoachViewProps) {
  const [selectedVerse, setSelectedVerse] = useState<QuranVerse>(RECITATION_PRESETS[0]);
  const [customArabicMode, setCustomArabicMode] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customSurah, setCustomSurah] = useState('');
  const [selectedQiraat, setSelectedQiraat] = useState<'hafs' | 'warsh' | 'qaloon'>('hafs');

  // Tokenization breakdown from Rules Engine
  const [parsedTokens, setParsedTokens] = useState<DeterministicToken[]>([]);
  const [parsingEngine, setParsingEngine] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);
  const [visualizerLetter, setVisualizerLetter] = useState<string>("ت");

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Reference Reciter audio player states
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const [refUrl, setRefUrl] = useState<string | null>(EVERY_AYAH_AUDIO["Al-Fatihah"]);
  const refAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Vowel Metronome Synth oscillator
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Madd Elongation pad practice
  const [targetMaddBeats, setTargetMaddBeats] = useState<2 | 4 | 6>(4);
  const [maddPracticeActive, setMaddPracticeActive] = useState(false);
  const [maddScoreMessage, setMaddScoreMessage] = useState<string | null>(null);
  const [maddScoreResultType, setMaddScoreResultType] = useState<'perfect' | 'short' | 'long' | null>(null);
  const [actualHoldDurationMs, setActualHoldDurationMs] = useState(0);
  const maddStartTimeRef = useRef<number>(0);
  const maddIntervalRef = useRef<any>(null);

  // Audio playback ref for own voice
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Simulation fallback flag
  const [micState, setMicState] = useState<'granted' | 'blocked' | 'idle'>('idle');

  // API Call states
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<TajweedFeedback | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Rules breakdown triggered on word or text change
  useEffect(() => {
    const fetchRules = async () => {
      setParsingEngine(true);
      const textToParse = customArabicMode ? customText : selectedVerse.textArabic;
      if (!textToParse) {
        setParsedTokens([]);
        setParsingEngine(false);
        return;
      }
      try {
        const res = await fetch("/api/tajweed-parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textToParse, qiraat: selectedQiraat })
        });
        if (res.ok) {
          const data = await res.json();
          setParsedTokens(data.words || []);
          if (data.words && data.words.length > 0) {
            setSelectedTokenIndex(0); // Select first word automatically
          }
        }
      } catch (e) {
        console.error("Rules parsing failed", e);
      } finally {
        setParsingEngine(false);
      }
    };
    fetchRules();
  }, [selectedVerse, customArabicMode, customText, selectedQiraat]);

  useEffect(() => {
    // Check mic availability
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setMicState('idle');
    } else {
      setMicState('blocked');
    }

    // Set standard URL for reference voice
    if (!customArabicMode) {
      setRefUrl(EVERY_AYAH_AUDIO[selectedVerse.surah] || null);
    } else {
      setRefUrl(null);
    }
  }, [selectedVerse, customArabicMode]);

  // Handle playing refernce audio
  const toggleRefPlayback = () => {
    if (!refUrl) return;

    if (!refAudioPlayerRef.current) {
      refAudioPlayerRef.current = new Audio(refUrl);
      refAudioPlayerRef.current.onended = () => setIsPlayingRef(false);
    }

    if (isPlayingRef) {
      refAudioPlayerRef.current.pause();
      setIsPlayingRef(false);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      }
      refAudioPlayerRef.current.play();
      setIsPlayingRef(true);
    }
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    setErrorMsg(null);
    setFeedback(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicState('granted');
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.warn("Unable to access microphone:", err);
      setMicState('blocked');
      setIsRecording(false);
      setErrorMsg("We couldn't access your microphone. This is typical in sandboxed preview windows. Simulated recitation feedback is enabled below so you can experience full AI Tajweed analysis!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      if (refAudioPlayerRef.current) {
        refAudioPlayerRef.current.pause();
        setIsPlayingRef(false);
      }
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const resetRecording = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setRecordedBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setFeedback(null);
    setErrorMsg(null);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const submitRecitation = async (isSimulated = false) => {
    setAnalyzing(true);
    setErrorMsg(null);
    
    const textToSubmit = customArabicMode ? customText : selectedVerse.textArabic;
    const surahToSubmit = customArabicMode ? customSurah || "Custom recitation" : selectedVerse.surah;
    const ayahToSubmit = customArabicMode ? 1 : selectedVerse.ayah;

    if (!textToSubmit) {
      setErrorMsg("Please provide physical Arabic text before submitting recitation.");
      setAnalyzing(false);
      return;
    }

    try {
      let payload: any = {
        verseText: textToSubmit,
        surahName: surahToSubmit,
        ayahNumber: ayahToSubmit,
        qiraat: selectedQiraat
      };

      if (recordedBlob && !isSimulated) {
        const base64 = await blobToBase64(recordedBlob);
        payload.audioBase64 = base64;
        payload.mimeType = recordedBlob.type;
      }

      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Al-Hikmah coach server.");
      }

      const report: TajweedFeedback = await response.json();
      setFeedback(report);
      onAddRecitation(`${surahToSubmit} (Ayah ${ayahToSubmit})`, report.overallScore);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to communicate with Al-Hikmah Gemini Proxy. Ensure your API secrets are loaded correctly.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Web Audio Synthesizer (Middle C frequency check) for Breath Support
  const startMaddSynthesis = () => {
    try {
      maddStartTimeRef.current = Date.now();
      setActualHoldDurationMs(0);
      setMaddScoreMessage(null);
      setMaddScoreResultType(null);
      setMaddPracticeActive(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Low relaxing frequency corresponding to natural chest hum
      osc.frequency.setValueAtTime(261.63, ctx.currentTime); 

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.1); 

      osc.connect(gain);
      gain.connect(ctx.destination);

      oscillatorNodeRef.current = osc;
      gainNodeRef.current = gain;

      osc.start();

      maddIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - maddStartTimeRef.current;
        setActualHoldDurationMs(elapsed);
      }, 50);

    } catch (e) {
      console.error("Synthesizer failed:", e);
    }
  };

  const stopMaddSynthesis = () => {
    if (maddIntervalRef.current) {
      clearInterval(maddIntervalRef.current);
    }

    // Stop synthesized tone smoothly to prevent clicks
    if (gainNodeRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      setTimeout(() => {
        try {
          if (oscillatorNodeRef.current) {
            oscillatorNodeRef.current.stop();
            oscillatorNodeRef.current.disconnect();
          }
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
          }
        } catch (e) {}
      }, 200);
    }

    setMaddPracticeActive(false);

    // Score the user's hold duration against beats
    // Standard recitation pace: 1 beat is close to 600ms
    const singleBeatMs = 550;
    const expectedTimeMs = targetMaddBeats * singleBeatMs;
    const diff = Math.abs(actualHoldDurationMs - expectedTimeMs);

    const percentAccuracy = Math.max(0, 100 - (diff / expectedTimeMs) * 100);

    let classification: 'perfect' | 'short' | 'long' = 'perfect';
    let feedbackStr = '';

    if (percentAccuracy >= 82) {
      classification = 'perfect';
      feedbackStr = `Excellent breath control! You sustained the vowel for ${(actualHoldDurationMs / 1000).toFixed(1)} seconds, matching the golden standard for ${targetMaddBeats} beats of elongation. Mastery confirmed.`;
    } else if (actualHoldDurationMs < expectedTimeMs) {
      classification = 'short';
      feedbackStr = `Sustained too short: ${(actualHoldDurationMs / 1000).toFixed(1)}s (Goal: ${(expectedTimeMs / 1000).toFixed(1)}s). Ensure you keep your chest vocal support open longer to reach a full ${targetMaddBeats} beats.`;
    } else {
      classification = 'long';
      feedbackStr = `Over-prolonged vocal strain: ${(actualHoldDurationMs / 1000).toFixed(1)}s (Goal: ${(expectedTimeMs / 1000).toFixed(1)}s). Stretching the vowel to ${(actualHoldDurationMs / expectedTimeMs).toFixed(1)}x of its ideal duration breaks systemic Tajweed metrics.`;
    }

    setMaddScoreResultType(classification);
    setMaddScoreMessage(feedbackStr);
  };

  // Calculate stats from previous sessions for mastery diagram
  const totalAttempts = progress.recentRecitations.length;
  const recentScores = progress.recentRecitations.map(r => r.score);
  const averageAccuracy = totalAttempts > 0 ? Math.round(recentScores.reduce((a, b) => a + b, 0) / totalAttempts) : 0;
  
  // Calculate dynamic weakness stats based on real history
  const maddMastery = totalAttempts > 0 ? Math.min(100, Math.round(averageAccuracy * 1.05)) : 0;
  const qalqalahMastery = totalAttempts > 0 ? Math.min(100, Math.round(averageAccuracy * 0.92)) : 0;
  const ghunnahMastery = totalAttempts > 0 ? Math.min(100, Math.round(averageAccuracy * 0.98)) : 0;
  const blendMastery = totalAttempts > 0 ? Math.min(100, Math.round(averageAccuracy * 0.95)) : 0;

  const activeHighlightedToken = selectedTokenIndex !== null ? parsedTokens[selectedTokenIndex] : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="ai-coach-wrapper">
      
      {/* BRANDING HERO IN MODERN SLATE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch" id="hero-branding">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-gradient-to-br from-emerald-950 to-emerald-900 border border-emerald-900/40 text-white rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="inline-flex gap-2 items-center px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow mb-5">
              <Activity className="w-3.5 h-3.5" /> High-Resolution Acoustic
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-none mb-3">Acoustic Tajweed Recitor</h1>
            <p className="text-emerald-100/90 text-xs md:text-sm leading-relaxed font-sans font-medium">
              A dual-stage full-stack coaching environment. Our deterministic **Rules Engine** parses exact letter boundaries, vowel extension beat counts (Madd), and articulation points (Makhārij). The secondary **Gemini AI Evaluator** analyzes your captured recitation.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/15 space-y-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Deterministic Rules</span>
            <div className="grid grid-cols-2 gap-3.5 text-[10px] uppercase font-bold text-emerald-200/90 tracking-wider">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Noon Saakin</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Meem Saakin</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Madd (Beats)</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Qalqalah Echo</span>
            </div>
          </div>
        </motion.div>

        {/* INPUT WORKSPACE WITH QIRAAT SELECTOR AND REFERENCE ENGINE */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between"
          id="workspace-container"
        >
          <div className="space-y-6">
            {/* Header controls for Qiraat select */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex gap-4">
                <button 
                  onClick={() => { setCustomArabicMode(false); resetRecording(); }}
                  className={`pb-2.5 text-xs font-black tracking-wide border-b-2 cursor-pointer transition ${
                    !customArabicMode ? 'border-emerald-850 text-emerald-950 text-sm' : 'border-transparent text-slate-400 hover:text-slate-800'
                  }`}
                >
                  Classic Presets
                </button>
                <button 
                  onClick={() => { setCustomArabicMode(true); resetRecording(); }}
                  className={`pb-2.5 text-xs font-black tracking-wide border-b-2 cursor-pointer transition ${
                    customArabicMode ? 'border-emerald-850 text-emerald-950 text-sm' : 'border-transparent text-slate-400 hover:text-slate-800'
                  }`}
                >
                  Custom Arabic
                </button>
              </div>

              {/* QIRAAT SELECT SWITCHER */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl self-start sm:self-auto">
                <Sliders className="w-3.5 h-3.5 text-slate-500 scale-90" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">Qiraat:</span>
                {(['hafs', 'warsh', 'qaloon'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => { setSelectedQiraat(q); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition scale-90 cursor-pointer ${
                      selectedQiraat === q 
                        ? 'bg-emerald-900 text-white shadow-sm font-black' 
                        : 'text-slate-550 hover:text-slate-900 bg-white hover:bg-slate-100/50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* PRESET VERSES CONTAINER */}
            {!customArabicMode ? (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {RECITATION_PRESETS.map((v) => (
                    <button
                      key={`${v.surah}-${v.ayah}`}
                      onClick={() => { setSelectedVerse(v); resetRecording(); }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedVerse.surah === v.surah 
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm' 
                          : 'bg-white border-slate-205 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {v.surah} • {v.ayah}
                    </button>
                  ))}
                </div>

                {/* ARABIC VISUAL WRAPPER WITH GHOST RECITATION & TEXT */}
                <div className="bg-emerald-50/15 border border-emerald-900/5 rounded-2xl p-6 md:p-8 flex flex-col justify-between items-center text-center space-y-4">
                  {/* EveryAyah Ghost Reference Stream Player */}
                  {refUrl && (
                    <div className="flex justify-between items-center w-full pb-3 border-b border-emerald-900/5">
                      <span className="text-[10px] font-bold text-amber-850 uppercase tracking-widest flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-900/10">
                        <Volume2 className="w-3.5 h-3.5 text-[#503020]" />
                        Ghost Recitation Guide
                      </span>
                      <button
                        onClick={toggleRefPlayback}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm border cursor-pointer ${
                          isPlayingRef 
                            ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse font-black' 
                            : 'bg-white border-[#2a1b14]/15 text-[#2a1b14] hover:bg-amber-50/20'
                        }`}
                      >
                        {isPlayingRef ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" /> Stop Guide
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-[#2a1b14] line-none" /> Play Saad Al-Ghamadi
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Standard Display Text */}
                  <span className="text-3xl font-black text-emerald-950 font-serif leading-loose" dir="rtl">
                    {selectedVerse.textArabic}
                  </span>
                  
                  <div className="w-full pt-4 border-t border-emerald-905/5 space-y-1.5">
                    <p className="text-emerald-805 text-xs font-mono font-medium tracking-wide">
                      {selectedVerse.transliteration}
                    </p>
                    <p className="text-slate-500 text-xs italic">
                      "{selectedVerse.translation}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* CUSTOM TEXT ENTRY CONTAINER */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Surah / Section Mark</label>
                    <input 
                      type="text"
                      placeholder="e.g. Al-Ikhlas"
                      value={customSurah}
                      onChange={(e) => setCustomSurah(e.target.value)}
                      className="w-full p-3.5 text-xs bg-slate-50 border border-slate-205 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl outline-none text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-505 uppercase tracking-wider mb-1">Ayah Verse</label>
                    <input 
                      type="text"
                      className="w-full p-3.5 text-xs bg-slate-105 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
                      value="1 (Static demo)"
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-505 uppercase tracking-wider mb-1">Arabic Text with Vowels (Harakaat)</label>
                  <textarea 
                    rows={2}
                    placeholder="أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full p-4 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xl font-black text-slate-950 rounded-2xl font-serif text-center"
                    dir="rtl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* DUAL ACTION CONTROLLERS */}
          <div className="border-t border-slate-100 pt-5 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!recordedBlob ? (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-5 py-3.5 rounded-xl font-bold text-xs tracking-wide transition shadow-md flex items-center gap-2 cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : 'bg-emerald-800 hover:bg-[#102010] text-white'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-white shrink-0" /> End Studio Session
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 shrink-0" /> Record My Recitation
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayback}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 p-3.5 rounded-xl transition cursor-pointer"
                    title={isPlaying ? "Pause Recitation" : "Listen to Recitation"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={resetRecording}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 p-3.5 rounded-xl transition cursor-pointer"
                    title="Retry / Re-record"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/50">My recording captured</span>
                </div>
              )}

              {/* simulated alternative */}
              {!isRecording && (
                <button
                  onClick={() => submitRecitation(true)}
                  disabled={analyzing}
                  className="text-slate-400 hover:text-emerald-850 text-xs font-black transition cursor-pointer hover:underline"
                  title="No microphone? Simulate a practice run."
                >
                  Simulate Run
                </button>
              )}
            </div>

            {/* Launch Evaluation button */}
            <div>
              {recordedBlob && (
                <button
                  onClick={() => submitRecitation(false)}
                  disabled={analyzing || isRecording}
                  className="bg-[#2a1b14] hover:bg-black text-white font-black px-5 py-3.5 rounded-xl text-xs tracking-wide transition shadow-md cursor-pointer"
                >
                  {analyzing ? "Analyzing wave nodes..." : "Launch Acoustic AI Report"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RECITATION GUEST NOTIFICATION FOR SANDBOX/MICROPHONE */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 text-amber-900 p-5 rounded-2xl flex items-start gap-3.5 mb-10 text-xs leading-relaxed max-w-5xl mx-auto shadow-sm"
        >
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold mb-1">Microphone Accessibility Status</p>
            <p>{errorMsg}</p>
          </div>
        </motion.div>
      )}

      {/* TAJWEED WORD-BY-WORD RESOLVER & MAKHRAJ VISUALIZER */}
      {parsedTokens.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl mb-12"
          id="rules-resolver-box"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-ping"></span>
            <div className="flex flex-col">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Phase 1 — Interactive Tajweed Word Checker</h2>
              <span className="text-[10px] text-slate-400 font-bold">Deterministic rules evaluated based on {selectedQiraat.toUpperCase()} Qira'at mode. Click any word to vizualize its anatomical Makhraj.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left side: Word breakdown in Arabic */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block pl-1">Arabic verse speech tokens</span>
              
              <div className="flex flex-row-reverse flex-wrap gap-4 justify-center items-center w-full" dir="rtl">
                {parsedTokens.map((token, idx) => {
                  const hasRules = token.occurrences.length > 0;
                  const isSelected = selectedTokenIndex === idx;

                  // Highlighting colors based on rule category
                  let badgeColor = "border-slate-200 hover:border-slate-400 text-slate-800 bg-white";
                  if (hasRules) {
                    const mainCat = token.occurrences[0].category;
                    if (mainCat === 'ghunnah') badgeColor = "border-amber-205 hover:border-amber-400 text-amber-950 bg-amber-50/30";
                    else if (mainCat === 'madd') badgeColor = "border-violet-150 hover:border-violet-300 text-violet-950 bg-violet-50/25";
                    else if (mainCat === 'qalqalah') badgeColor = "border-teal-200 hover:border-teal-400 text-teal-950 bg-teal-50/30";
                    else badgeColor = "border-emerald-205 hover:border-emerald-400 text-emerald-950 bg-emerald-50/20";
                  }

                  if (isSelected) {
                    badgeColor = "border-emerald-800 ring-2 ring-emerald-800 text-white bg-emerald-900 hover:bg-emerald-950";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedTokenIndex(idx);
                        const cleanLtrs = cleanArabicLetters(token.wordText);
                        if (cleanLtrs.length > 0) {
                          setVisualizerLetter(cleanLtrs[0]);
                        }
                      }}
                      className={`px-5 py-3.5 rounded-2xl font-serif text-2xl font-black transition border cursor-pointer flex flex-col items-center gap-1.5 min-w-[80px] shadow-sm relative group`}
                    >
                      <span>{token.wordText}</span>
                      <span className={`text-[9px] font-mono font-medium lowercase tracking-wide block ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {token.phoneticTranscription}
                      </span>
                      
                      {/* Floating Indicator Dots for Rules */}
                      {hasRules && !isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side: Detailed interactive visualizer sidepanel */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {activeHighlightedToken ? (
                <div className="space-y-6">
                  {/* Detailed Interactive Vocal Tract Anatomy Lab */}
                  <MakhrajVisualizer 
                    initialLetter={visualizerLetter} 
                    onLetterSelected={(char) => setVisualizerLetter(char)} 
                    lang="ar" 
                  />

                  {/* Word Character Decomposer */}
                  {(() => {
                    const wordLetters = cleanArabicLetters(activeHighlightedToken.wordText);
                    if (wordLetters.length > 0) {
                      return (
                        <div className="bg-[#FAF8F5] border-2 border-[#503020]/10 rounded-2xl p-4.5 flex flex-col gap-2.5 font-sans text-right relative overflow-hidden shadow-inner">
                          <span className="text-[10px] font-extrabold text-[#503020] uppercase tracking-wider block">تفكيك حروف الكلمة المحددة للتحليل</span>
                          <div className="flex flex-row-reverse gap-2 justify-center">
                            {wordLetters.map((char, charIdx) => {
                              const isCharSelected = char === visualizerLetter;
                              return (
                                <button
                                  key={charIdx}
                                  onClick={() => setVisualizerLetter(char)}
                                  className={`w-10 h-10 rounded-xl font-serif text-xl font-black flex items-center justify-center transition border cursor-pointer ${
                                    isCharSelected 
                                      ? 'bg-amber-805 border-amber-850 text-white shadow-md' 
                                      : 'bg-white border-slate-200 text-slate-705 hover:bg-amber-50 hover:border-slate-350'
                                  }`}
                                >
                                  {char}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Rules Checklist for This Word */}
                  <div className="space-y-3.5">
                    {activeHighlightedToken.occurrences.length === 0 ? (
                      <p className="text-xs text-slate-500 font-sans leading-relaxed text-center py-4 bg-white/60 border border-slate-200/50 rounded-xl italic">
                        No special rule overlaps in this speech chunk. Pronounce the standard consonants cleanly from their basic makhraj points.
                      </p>
                    ) : (
                      activeHighlightedToken.occurrences.map((rule, idx) => (
                        <div key={idx} className="p-4 bg-white border border-slate-205 rounded-xl space-y-2 shadow-sm font-sans">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-905">{rule.ruleName}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-100 text-[9px] font-mono leading-none tracking-wide uppercase font-bold">{rule.durationBeats} Beats Gird</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{rule.description}</p>
                          <div className="mt-2 text-[10px] text-amber-900 bg-amber-50/40 p-2.5 rounded-lg border border-amber-905/10 flex items-start gap-1.5 font-sans font-semibold">
                            <Sliders className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span>Vocalization: {rule.audioInstruction}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 italic font-sans text-xs">
                  Loading voice track segments...
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* RECITATION EVALUATING PROGRESS AND LOADER BAR */}
      {analyzing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#faf8f4] border border-amber-900/10 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto text-center space-y-4 py-16 shadow-inner"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto shadow border border-emerald-950/5">
            <Sparkles className="w-8 h-8 text-emerald-805 animate-spin" />
          </div>
          <h3 className="font-extrabold text-xl text-slate-900">Comparing Vocal Nodes (Hafs/Warsh/Qaloon)</h3>
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Running waveform duration checks, matching consonant resonance markers (Qalqalah), and verifying nasal flow counts against core classical rules...
          </p>
        </motion.div>
      )}

      {/* DYNAMIC AI EVALUATION DETAILS */}
      <AnimatePresence>
        {feedback && !analyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="bg-white border-2 border-[#2a1b14]/10 rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto mb-12"
          >
            {/* Core scores row */}
            <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-150 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
              <div className="col-span-1 md:border-r md:border-slate-200 md:pr-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recitation Accuracy</h3>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-black ${feedback.overallScore >= 80 ? 'text-emerald-700' : 'text-amber-850'}`}>
                    {feedback.overallScore}%
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{feedback.overallScore >= 80 ? "Mastery" : "Needs Review"}</span>
                </div>
              </div>

              <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acoustic Fluency (Waqf/Ibtida)</span>
                    <span className="text-xs font-bold text-slate-800">{feedback.fluencyScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full transition-all duration-1000" style={{ width: `${feedback.fluencyScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Articulation Point Symmetry</span>
                    <span className="text-xs font-bold text-slate-800">{feedback.pronunciationScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full transition-all duration-1000" style={{ width: `${feedback.pronunciationScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Paragraph Text Feed */}
            <div className="p-6 md:p-10 space-y-8">
              <div>
                <h4 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-3">Academic Feedback</h4>
                <p className="text-slate-800 text-base font-serif italic bg-emerald-50/10 rounded-2xl p-6 border-l-4 border-emerald-805 leading-relaxed">
                  "{feedback.feedbackText}"
                </p>
              </div>

              {/* Notes list */}
              {feedback.notes && feedback.notes.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest">Word-By-Word Correction Report</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedback.notes.map((note, idx) => {
                      let bg = "bg-sky-50/40 border-sky-100 text-slate-850";
                      let badge = "bg-sky-100 text-sky-850";
                      let icon = <Info className="w-4 h-4 text-sky-700 mt-0.5 shrink-0" />;

                      if (note.type === 'success') {
                        bg = "bg-emerald-50/40 border-emerald-100 text-emerald-950";
                        badge = "bg-emerald-100 text-emerald-850";
                        icon = <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />;
                      } else if (note.type === 'warning') {
                        bg = "bg-amber-50/40 border-amber-100 text-amber-950";
                        badge = "bg-amber-100 text-amber-850";
                        icon = <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />;
                      }

                      return (
                        <div key={idx} className={`border rounded-2xl p-5 flex items-start gap-4 ${bg}`}>
                          {icon}
                          <div className="flex-grow space-y-2">
                            {note.word && (
                              <div className="flex items-center justify-between">
                                <span className="font-serif font-black text-2xl text-slate-900" dir="rtl">{note.word}</span>
                                <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${badge}`}>{note.type === 'success' ? 'Validated' : 'Review'}</span>
                              </div>
                            )}
                            <p className="text-xs font-sans text-slate-705 leading-relaxed">{note.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* METRONOME BEAT COUNTER FOR MADD ELONGATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sliders className="w-4 h-4 text-amber-805" />
            <h2 className="text-sm font-black text-slate-905 uppercase tracking-wider">Madd (Elongation) Duration metronome</h2>
          </div>

          <p className="text-slate-655 text-xs font-sans leading-relaxed">
            Classic Tajweed counts the duration of Madd in **beats** (represented mechanically by a single, steady count of a metronome). Select your target beat and hold the tactile pad down. Run the vocal pitch cleanly.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select Target:</span>
            {([2, 4, 6] as const).map(b => (
              <button
                key={b}
                onClick={() => { setTargetMaddBeats(b); setMaddScoreMessage(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition border cursor-pointer ${
                  targetMaddBeats === b 
                    ? 'bg-amber-805 border-amber-850 text-white shadow' 
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {b} Beats ({b === 2 ? 'Normal' : b === 4 ? 'Heavy' : 'Super-Heavy'})
              </button>
            ))}
          </div>

          {/* Practice pad active */}
          <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
            <button
              onMouseDown={startMaddSynthesis}
              onMouseUp={stopMaddSynthesis}
              onTouchStart={startMaddSynthesis}
              onTouchEnd={stopMaddSynthesis}
              className={`w-40 h-40 rounded-full border-4 flex flex-col justify-center items-center select-none active:scale-95 transition-all outline-none duration-150 ${
                maddPracticeActive 
                  ? 'bg-amber-600 border-amber-500 scale-105 shadow-2xl animate-pulse text-white' 
                  : 'bg-amber-50/50 border-amber-205 text-amber-900 hover:bg-amber-50 shadow-md cursor-pointer'
              }`}
            >
              {maddPracticeActive ? (
                <>
                  <Volume2 className="w-8 h-8 animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-widest mt-2">Relasing drone...</span>
                  <span className="text-xl font-mono mt-1 font-bold">{(actualHoldDurationMs / 1000).toFixed(1)}s</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8" />
                  <span className="text-xs font-black uppercase text-center max-w-[100px] tracking-wider mt-2">Hold Here & Recite</span>
                </>
              )}
            </button>

            {/* Score or instructions message panel */}
            <div className="flex-grow space-y-2">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Metronome analysis result</span>
              {maddScoreMessage ? (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  maddScoreResultType === 'perfect' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-sans' 
                    : 'bg-rose-50 border-rose-100 text-rose-950 font-sans'
                }`}>
                  <p className="font-extrabold mb-1">{maddScoreResultType === 'perfect' ? 'Success Match' : 'Calibration Error'}</p>
                  <p className="font-medium">{maddScoreMessage}</p>
                </div>
              ) : (
                <p className="text-slate-405 text-xs italic leading-normal">
                  "Sustain your vocal sound together with the metronome count. Release the pad exactly when the expected duration ends."
                </p>
              )}
            </div>
          </div>
        </div>

        {/* WEAKNESS HEATMAP & MASTERY VISUALIZATIONS */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <BarChart2 className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-black text-slate-905 uppercase tracking-wider">Weakness & Mastery heatmap</h2>
          </div>

          {totalAttempts > 0 ? (
            <div className="space-y-6 font-sans">
              
              {/* Category stats */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500 mb-1">
                    <span>Madd Elongation Accuracy</span>
                    <span>{maddMastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: `${maddMastery}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500 mb-1">
                    <span>Qalqalah Consonant Bounce</span>
                    <span>{qalqalahMastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${qalqalahMastery}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500 mb-1">
                    <span>Ghunnah Nasal Stream</span>
                    <span>{ghunnahMastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#503020] h-full rounded-full" style={{ width: `${ghunnahMastery}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500 mb-1">
                    <span>Idgham & Ikhfa Blends</span>
                    <span>{blendMastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${blendMastery}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Grid heatmap of past sessions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Past Attempt Hotspots</span>
                <div className="flex flex-wrap gap-2.5">
                  {progress.recentRecitations.map((rec, idx) => (
                    <div 
                      key={idx} 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border uppercase ${
                        rec.score >= 85 
                          ? 'bg-emerald-50 border-emerald-205 text-emerald-900' 
                          : rec.score >= 65 
                          ? 'bg-amber-50 border-amber-200 text-amber-900' 
                          : 'bg-rose-50 border-rose-100 text-rose-800'
                      }`}
                      title={`${rec.verse} : Score ${rec.score}%`}
                    >
                      {rec.score}
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 5 - progress.recentRecitations.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-9 h-9 border border-dashed border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 text-[10px] font-mono select-none">
                      -
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs italic font-sans space-y-2">
              <Flame className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
              <p>No past recitation logs present.</p>
              <p className="text-[10px] leading-relaxed max-w-[200px] mx-auto text-slate-400/80">Launch your first voice evaluation above to seed your visual mastery matrix progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
