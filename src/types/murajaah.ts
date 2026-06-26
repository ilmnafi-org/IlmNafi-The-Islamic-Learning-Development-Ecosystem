export interface Ayah {
  number: number;
  text: string;
  surah: number;
  juz: number;
}

export interface SessionStats {
  mistakes: number;
  hesitations: number;
  completedAyahs: number;
  durationMs: number;
}

export type EngineState = 'intro' | 'listening' | 'correction' | 'report' | 'paused';

export interface CorrectionEvent {
  type: 'mistake' | 'hesitation';
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
