import { Ayah, CorrectionEvent, EngineState, SessionStats } from '../types/murajaah';
import { QuranAlignment } from './QuranAlignment';
import { RecognitionEngine } from './RecognitionEngine';
import { HesitationDetector } from './HesitationDetector';
import { AttemptManager } from './AttemptManager';
import { TeacherEngine } from './TeacherEngine';
import { MistakeClassifier } from './MistakeClassifier';
import { GoBackEngine } from './GoBackEngine';

export class MurajaahEngine {
  private ayahs: Ayah[] = [];
  public currentIndex: number = 0;
  
  private recognition: RecognitionEngine;
  private hesitationDetector: HesitationDetector;
  private attemptManager: AttemptManager;
  private teacher: TeacherEngine;
  private goBackEngine: GoBackEngine;
  
  private currentState: EngineState = 'idle';
  private stats: SessionStats = {
    accuracy: 100,
    completion: 0,
    mistakes: 0,
    hesitations: 0,
    repeatedMistakes: 0,
    weakAyahs: [],
    strongAyahs: [],
    confusedPairs: [],
    averageConfidence: 1.0,
    longestPause: 0,
    averageRetries: 0,
    mostDifficultTransition: [],
    reviewPriority: [],
    completedAyahs: 0,
    durationMs: 0
  };
  
  private sessionStartTime: number = 0;
  private perfectAyahsCount: number = 0;
  private isTestingGoBack: boolean = false;
  private savedIndexBeforeGoBack: number = 0;
  
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
    this.goBackEngine = new GoBackEngine();
    
    this.hesitationDetector = new HesitationDetector(8000, () => {
      this.handleHesitation();
    });

    this.recognition.onResult = (transcript: string, isFinal: boolean) => {
      if (this.onTranscript) this.onTranscript(transcript);
      this.hesitationDetector.reset();
      
      if (isFinal && (this.currentState === 'listening' || this.currentState === 'go_back_test')) {
        this.processRecitation(transcript);
      }
    };
  }

  public loadSession(ayahs: Ayah[]) {
    this.ayahs = ayahs;
    this.currentIndex = 0;
    this.stats = { 
      accuracy: 100, completion: 0,
      mistakes: 0, hesitations: 0, repeatedMistakes: 0,
      weakAyahs: [], strongAyahs: [], confusedPairs: [],
      averageConfidence: 0.9, longestPause: 0, averageRetries: 0,
      mostDifficultTransition: [], reviewPriority: [],
      completedAyahs: 0, durationMs: 0 
    };
    this.perfectAyahsCount = 0;
    this.isTestingGoBack = false;
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
    this.setState(this.isTestingGoBack ? 'go_back_test' : 'listening');
    this.recognition.start();
    this.hesitationDetector.start();
  }

  public pause() {
    if (this.currentState !== 'paused') {
      this.setState('paused');
      this.recognition.stop();
      this.hesitationDetector.stop();
    }
  }

  public stop() {
    this.pause();
    this.stats.durationMs = Date.now() - this.sessionStartTime;
    this.stats.completion = (this.stats.completedAyahs / Math.max(1, this.ayahs.length)) * 100;
    this.stats.accuracy = Math.max(0, 100 - (this.stats.mistakes * 2) - (this.stats.hesitations));
    
    this.setState('report');
    if (this.onSessionComplete) this.onSessionComplete(this.stats);
  }

  private processRecitation(transcript: string) {
    if (this.currentIndex >= this.ayahs.length) return;
    this.setState('matching');
    
    const currentAyah = this.ayahs[this.currentIndex];
    
    const expectedWords = QuranAlignment.normalizeArabic(currentAyah.text).split(/\s+/).filter(w => w);
    const spokenWords = QuranAlignment.normalizeArabic(transcript).split(/\s+/).filter(w => w);
    
    const alignment = QuranAlignment.alignSequence(spokenWords, expectedWords);
    
    // Update confidence rolling average
    this.stats.averageConfidence = (this.stats.averageConfidence + alignment.confidence) / 2;

    const mistakeType = MistakeClassifier.classify(alignment);
    
    // If completion > 75% and no major mistake, pass
    if (alignment.completion > 75 && !mistakeType) {
      this.handleCorrectRecitation();
    } else {
      this.handleMistake(mistakeType || 'WrongWord');
    }
  }

  private handleCorrectRecitation() {
    const ayahNum = this.ayahs[this.currentIndex]?.number;
    
    if (this.attemptManager.getAttempts(ayahNum) === 0) {
      if (!this.stats.strongAyahs.includes(ayahNum)) this.stats.strongAyahs.push(ayahNum);
      this.perfectAyahsCount++;
    }
    this.attemptManager.reset(ayahNum);
    
    if (this.isTestingGoBack) {
      // Finished go-back test, return to normal
      this.isTestingGoBack = false;
      this.currentIndex = this.savedIndexBeforeGoBack;
      this.teacher.sayIntent('PROMPT_ENCOURAGE', 'أحسنت', () => {
         this.resume();
      });
      return;
    }

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
      // Check for go-back test
      if (this.goBackEngine.shouldGoBack(this.currentIndex, Date.now())) {
        this.pause();
        this.savedIndexBeforeGoBack = this.currentIndex;
        this.currentIndex = this.goBackEngine.getTargetAyah(this.currentIndex);
        this.isTestingGoBack = true;
        this.setState('teacher_prompt');
        this.emitCorrection('go_back', 'اختبار مراجعة');
        this.teacher.sayIntent('PROMPT_GO_BACK', '...', () => this.resume());
        return;
      }

      // Check for encouragement
      if (this.perfectAyahsCount >= 5) {
        this.perfectAyahsCount = 0;
        this.pause();
        this.setState('teacher_prompt');
        this.emitCorrection('encouragement', 'أحسنت');
        this.teacher.sayIntent('PROMPT_ENCOURAGE', '', () => {
          this.setState('advance_ayah');
          this.resume();
        });
      } else {
        this.setState('advance_ayah');
        this.resume();
      }
    }
  }

  private handleMistake(mistakeType: string) {
    this.stats.mistakes++;
    this.perfectAyahsCount = 0; // Reset perfect streak
    
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
    
    let promptIntent: any = 'PROMPT_REPEAT';
    if (attempts === 1) promptIntent = 'PROMPT_REPEAT';
    else if (attempts === 2) promptIntent = 'PROMPT_REPEAT_AGAIN';
    else if (attempts === 3) promptIntent = 'PROMPT_REPEAT_FROM_START';
    
    if (attempts <= 3) {
      const msg = this.teacher.sayIntent(promptIntent, '', () => this.resume());
      this.emitCorrection('mistake', msg, mistakeType as any);
    } else {
      this.setState('correction_playback');
      const msg = this.teacher.sayIntent('PROMPT_CORRECT', currentAyah.text, () => {
        this.attemptManager.reset(currentAyah.number);
        // If testing go-back and failed completely, end test
        if (this.isTestingGoBack) {
           this.isTestingGoBack = false;
           this.currentIndex = this.savedIndexBeforeGoBack;
        }
        this.resume();
      });
      this.emitCorrection('correction', msg, mistakeType as any);
    }
  }

  private handleHesitation() {
    this.stats.hesitations++;
    this.perfectAyahsCount = 0;
    this.pause();
    
    this.setState('teacher_prompt');
    const msg = this.teacher.sayIntent('PROMPT_CONTINUE', '', () => this.resume());
    this.emitCorrection('hesitation', msg);
  }

  private emitCorrection(type: CorrectionEvent['type'], message: string, mistakeType?: any) {
    if (this.onCorrection) {
      this.onCorrection({
        type,
        mistakeType,
        message,
        timestamp: Date.now(),
        ayahNumber: this.ayahs[this.currentIndex]?.number || 0
      });
    }
  }

  private setState(state: EngineState) {
    if (this.currentState === state) return;
    this.currentState = state;
    if (this.onStateChange) this.onStateChange(state);
  }
}

