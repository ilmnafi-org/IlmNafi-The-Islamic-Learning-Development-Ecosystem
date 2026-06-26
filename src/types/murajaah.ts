export interface Ayah {
  number: number;
  text: string;
  surah: number;
  juz: number;
}

export interface SessionStats {
  mistakes: number;
  hesitations: number;
  repeatedMistakes: number;
  weakAyahs: number[];
  strongAyahs: number[];
  confusedPairs: [number, number][];
  averageConfidence: number;
  completedAyahs: number;
  durationMs: number;
}

export type EngineState = 'idle' | 'preparing' | 'listening' | 'matching' | 'paused' | 'teacher_prompt' | 'waiting_retry' | 'correction_playback' | 'go_back_test' | 'advance_ayah' | 'finished' | 'report';

export interface CorrectionEvent {
  type: 'mistake' | 'hesitation' | 'go_back' | 'encouragement' | 'correction';
  message: string;
  timestamp: number;
  ayahNumber: number;
}

export interface MurajaahConfig {
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  juzTarget?: number;
}

