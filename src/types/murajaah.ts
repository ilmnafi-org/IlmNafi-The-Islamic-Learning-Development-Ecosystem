export interface Ayah {
  number: number;
  text: string;
  surah: number;
  juz: number;
}

export interface SessionStats {
  accuracy: number;
  completion: number;
  mistakes: number;
  hesitations: number;
  repeatedMistakes: number;
  weakAyahs: number[];
  strongAyahs: number[];
  confusedPairs: [number, number][];
  averageConfidence: number;
  longestPause: number;
  averageRetries: number;
  mostDifficultTransition: number[];
  reviewPriority: number[];
  completedAyahs: number;
  durationMs: number;
}

export type EngineState = 'idle' | 'preparing' | 'listening' | 'matching' | 'paused' | 'teacher_prompt' | 'waiting_retry' | 'correction_playback' | 'go_back_test' | 'advance_ayah' | 'finished' | 'report';

export enum MistakeType {
  SkippedWord = 'SkippedWord',
  ExtraWord = 'ExtraWord',
  WrongWord = 'WrongWord',
  WrongAyah = 'WrongAyah',
  SkippedAyah = 'SkippedAyah',
  RepeatedPhrase = 'RepeatedPhrase',
  Pronunciation = 'Pronunciation',
  Hesitation = 'Hesitation',
  SimilarAyah = 'SimilarAyah'
}

export interface CorrectionEvent {
  type: 'mistake' | 'hesitation' | 'go_back' | 'encouragement' | 'correction';
  mistakeType?: MistakeType;
  message: string;
  timestamp: number;
  ayahNumber: number;
}

export interface RecitationCursor {
  currentAyah: number;
  currentWord: number;
  currentCharacter: number;
  timestamp: number;
}

export interface RecognizedWord {
  word: string;
  confidence: number;
  start: number;
  end: number;
}

export interface MurajaahConfig {
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  juzTarget?: number;
}

