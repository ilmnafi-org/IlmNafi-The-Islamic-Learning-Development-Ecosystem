import { Ayah, CorrectionEvent, EngineState, SessionStats } from '../types/murajaah';
import { QuranAlignment } from './QuranAlignment';
import { RecognitionEngine } from './RecognitionEngine';
import { HesitationDetector } from './HesitationDetector';
import { AttemptManager } from './AttemptManager';
import { TeacherEngine } from './TeacherEngine';

export class MurajaahEngine {
  private ayahs: Ayah[] = [];
  public currentIndex: number = 0;
  
  private recognition: RecognitionEngine;
  private hesitationDetector: HesitationDetector;
  private attemptManager: AttemptManager;
  private teacher: TeacherEngine;
  
  private currentState: EngineState = 'idle';
  private stats: SessionStats = {
    mistakes: 0,
    hesitations: 0,
    repeatedMistakes: 0,
    weakAyahs: [],
    strongAyahs: [],
    confusedPairs: [],
    averageConfidence: 1.0,
    completedAyahs: 0,
    durationMs: 0
  };
  
  private sessionStartTime: number = 0;
  
  // Callbacks
  public onStateChange?: (state: EngineState) => void;
  public onAyahProgress?: (currentIndex: number, total: number) => void;
  public onCorrection?: (event: CorrectionEvent) => void;
  public onSessionComplete?: (stats: SessionStats) => void;
  public onTranscript?: (transcript: string) => void;

  constructor() {
    this.teacher = new TeacherEngine();
    this.attemptManager = new AttemptManager();
    this.recognition = new RecognitionEngine();
    
    this.hesitationDetector = new HesitationDetector(8000, () => {
      this.handleHesitation();
    });

    this.recognition.onResult = (transcript: string, isFinal: boolean) => {
      if (this.onTranscript) this.onTranscript(transcript);
      this.hesitationDetector.reset();
      
      if (isFinal && this.currentState === 'listening') {
        this.processRecitation(transcript);
      }
    };
  }

  public loadSession(ayahs: Ayah[]) {
    this.ayahs = ayahs;
    this.currentIndex = 0;
    this.stats = { 
      mistakes: 0, hesitations: 0, repeatedMistakes: 0,
      weakAyahs: [], strongAyahs: [], confusedPairs: [],
      averageConfidence: 0.9, completedAyahs: 0, durationMs: 0 
    };
    this.setState('preparing');
    if (this.onAyahProgress) this.onAyahProgress(0, this.ayahs.length);
  }

  public start() {
    if (this.ayahs.length === 0) return;
    this.sessionStartTime = Date.now();
    this.resume();
  }

  public resume() {
    if (this.currentIndex >= this.ayahs.length) return;
    this.setState('listening');
    this.recognition.start();
    this.hesitationDetector.start();
  }

  public pause() {
    this.setState('paused');
    this.recognition.stop();
    this.hesitationDetector.stop();
  }

  public stop() {
    this.pause();
    this.stats.durationMs = Date.now() - this.sessionStartTime;
    this.setState('report');
    if (this.onSessionComplete) this.onSessionComplete(this.stats);
  }

  private processRecitation(transcript: string) {
    if (this.currentIndex >= this.ayahs.length) return;
    this.setState('matching');
    
    const currentAyah = this.ayahs[this.currentIndex];
    const expectedText = currentAyah.text;
    
    // We get a simple matched word count
    const matchCount = QuranAlignment.getMatchedWordsCount(transcript, expectedText);
    const expectedWordsCount = QuranAlignment.normalizeArabic(expectedText).split(/\s+/).filter(w => w).length;
    
    // A simplistic mock logic for demonstration: 
    // If it matches a good portion of the expected ayah (or all of it), we pass
    if (matchCount >= expectedWordsCount * 0.5) {
      this.handleCorrectRecitation();
    } else {
      this.handleMistake();
    }
  }

  private handleCorrectRecitation() {
    const ayahNum = this.ayahs[this.currentIndex]?.number;
    if (this.attemptManager.getAttempts(ayahNum) === 0) {
      if (!this.stats.strongAyahs.includes(ayahNum)) this.stats.strongAyahs.push(ayahNum);
    }
    this.attemptManager.reset(ayahNum);
    
    this.stats.completedAyahs++;
    this.currentIndex++;
    
    if (this.onAyahProgress) {
      this.onAyahProgress(this.currentIndex, this.ayahs.length);
    }

    if (this.currentIndex >= this.ayahs.length) {
      this.teacher.sayIntent('PROMPT_FINISH', '', () => {
         this.stop();
      });
    } else {
      // Small chance teacher encourages
      if (Math.random() > 0.8) {
        this.pause();
        this.setState('teacher_prompt');
        this.emitCorrection('encouragement', 'أحسنت');
        this.teacher.sayIntent('PROMPT_ENCOURAGE', '', () => this.resume());
      } else {
        this.setState('advance_ayah');
        this.resume();
      }
    }
  }

  private handleMistake() {
    this.stats.mistakes++;
    const currentAyah = this.ayahs[this.currentIndex];
    
    this.pause();
    const attempts = this.attemptManager.recordAttempt(currentAyah.number);
    
    if (attempts > 1) {
      this.stats.repeatedMistakes++;
      if (!this.stats.weakAyahs.includes(currentAyah.number)) {
        this.stats.weakAyahs.push(currentAyah.number);
      }
    }

    this.setState('waiting_retry');
    
    if (attempts === 1) {
      const msg = this.teacher.sayIntent('PROMPT_REPEAT', '', () => this.resume());
      this.emitCorrection('mistake', msg);
    } else if (attempts === 2) {
      const msg = this.teacher.sayIntent('PROMPT_REPEAT_AGAIN', '', () => this.resume());
      this.emitCorrection('mistake', msg);
    } else if (attempts === 3) {
      const msg = this.teacher.sayIntent('PROMPT_REPEAT_FROM_START', '', () => this.resume());
      this.emitCorrection('mistake', msg);
    } else {
      this.setState('correction_playback');
      const msg = this.teacher.sayIntent('PROMPT_CORRECT', currentAyah.text, () => {
        this.attemptManager.reset(currentAyah.number);
        this.resume();
      });
      this.emitCorrection('correction', msg);
    }
  }

  private handleHesitation() {
    this.stats.hesitations++;
    this.pause();
    
    this.setState('teacher_prompt');
    const msg = this.teacher.sayIntent('PROMPT_CONTINUE', '', () => this.resume());
    this.emitCorrection('hesitation', msg);
  }

  private emitCorrection(type: CorrectionEvent['type'], message: string) {
    if (this.onCorrection) {
      this.onCorrection({
        type,
        message,
        timestamp: Date.now(),
        ayahNumber: this.ayahs[this.currentIndex]?.number || 0
      });
    }
  }

  private setState(state: EngineState) {
    this.currentState = state;
    if (this.onStateChange) this.onStateChange(state);
  }
}

