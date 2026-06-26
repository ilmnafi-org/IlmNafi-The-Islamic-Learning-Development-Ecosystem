import { useState, useEffect, useRef } from 'react';
import { MurajaahEngine } from '../engine/MurajaahEngine';
import { Ayah, EngineState, SessionStats, CorrectionEvent } from '../types/murajaah';
import { QuranService } from '../services/QuranService';

export function useMurajaah() {
  const engineRef = useRef<MurajaahEngine | null>(null);
  
  const [state, setState] = useState<EngineState>('idle');
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [lastCorrection, setLastCorrection] = useState<CorrectionEvent | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  useEffect(() => {
    engineRef.current = new MurajaahEngine();
    const engine = engineRef.current;

    engine.onStateChange = (newState) => setState(newState);
    engine.onAyahProgress = (index, total) => setCurrentIndex(index);
    engine.onCorrection = (event) => setLastCorrection(event);
    engine.onSessionComplete = (finalStats) => setStats(finalStats);
    engine.onTranscript = (text) => setTranscript(text);

    return () => {
      engine.stop();
    };
  }, []);

  const loadSession = async (juz: number) => {
    try {
      // Use the service to load ayahs
      const loadedAyahs = await QuranService.getAyahsByJuz(juz);
      // For demo purposes, just take the first 5 ayahs to make it testable quickly
      const demoAyahs = loadedAyahs.slice(0, 5); 
      setAyahs(demoAyahs);
      engineRef.current?.loadSession(demoAyahs);
    } catch (e) {
      console.error(e);
    }
  };

  const start = () => engineRef.current?.start();
  const pause = () => engineRef.current?.pause();
  const resume = () => engineRef.current?.resume();
  const stop = () => engineRef.current?.stop();

  return {
    state,
    ayahs,
    currentIndex,
    stats,
    lastCorrection,
    transcript,
    loadSession,
    start,
    pause,
    resume,
    stop
  };
}

