import { Ayah, CorrectionEvent, EngineState, SessionStats } from '../types/murajaah';
import { QuranAlignment } from './QuranAlignment';
import { RecognitionEngine } from './RecognitionEngine';
import { HesitationDetector } from './HesitationDetector';
import { AttemptManager } from './AttemptManager';
import { TeacherEngine } from './TeacherEngine';

export class MurajaahEngine {
  private ayahs: Ayah[] = [];
  private currentIndex: number = 0;
  
  private recognition: RecognitionEngine;
  private hesitationDetector: HesitationDetector;
  private attemptManager: AttemptManager;
  private teacher: TeacherEngine;
  
  private stats: SessionStats = {
    mistakes: 0,
    hesitations: 0,
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
      
      if (isFinal) {
        this.processRecitation(transcript);
      }
    };
  }

  public loadSession(ayahs: Ayah[]) {
    this.ayahs = ayahs;
    this.currentIndex = 0;
    this.stats = { mistakes: 0, hesitations: 0, completedAyahs: 0, durationMs: 0 };
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
    
    const currentAyah = this.ayahs[this.currentIndex];
    const words = transcript.split(' ');
    
    const isMatch = QuranAlignment.isWordMatch(words, currentAyah.text);
    
    if (isMatch) {
      this.handleCorrectRecitation();
    } else {
      this.handleMistake();
    }
  }

  private handleCorrectRecitation() {
    this.attemptManager.reset();
    this.stats.completedAyahs++;
    this.currentIndex++;
    
    if (this.onAyahProgress) {
      this.onAyahProgress(this.currentIndex, this.ayahs.length);
    }

    if (this.currentIndex >= this.ayahs.length) {
      this.stop();
    } else {
      this.hesitationDetector.reset();
    }
  }

  private handleMistake() {
    this.stats.mistakes++;
    this.pause();
    
    if (this.onCorrection) {
      this.onCorrection({
        type: 'mistake',
        message: 'لا، أعد الآية',
        timestamp: Date.now(),
        ayahNumber: this.ayahs[this.currentIndex]?.number || 0
      });
    }

    const maxReached = this.attemptManager.recordAttempt();
    
    this.setState('correction');
    
    if (maxReached) {
      // Give the correction
      const correctText = this.ayahs[this.currentIndex].text;
      this.teacher.sayCorrection(correctText, () => {
        this.attemptManager.reset();
        this.resume();
      });
    } else {
      // Prompt to repeat
      this.teacher.sayMistakePrompt(() => {
        this.resume();
      });
    }
  }

  private handleHesitation() {
    this.stats.hesitations++;
    this.pause();
    
    if (this.onCorrection) {
      this.onCorrection({
        type: 'hesitation',
        message: 'أكمل',
        timestamp: Date.now(),
        ayahNumber: this.ayahs[this.currentIndex]?.number || 0
      });
    }

    this.setState('correction');
    this.teacher.sayHesitationPrompt(() => {
      this.resume();
    });
  }

  private setState(state: EngineState) {
    if (this.onStateChange) this.onStateChange(state);
  }
}
