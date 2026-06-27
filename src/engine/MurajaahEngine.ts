import { Ayah, CorrectionEvent, EngineState, SessionStats, RecitationCursor } from '../types/murajaah';
import { QuranAlignment } from './QuranAlignment';
import { RecognitionEngine } from './RecognitionEngine';
import { HesitationDetector } from './HesitationDetector';
import { AttemptManager } from './AttemptManager';
import { TeacherEngine } from './TeacherEngine';
import { MistakeClassifier } from './MistakeClassifier';
import { GoBackEngine } from './GoBackEngine';
import { TeacherDecisionEngine, TeacherAction } from './TeacherDecisionEngine';
import { ReviewPlanner } from './ReviewPlanner';

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
  private totalExpectedWords: number = 0;
  private totalMatchedWords: number = 0;
  private ayahScores: Record<number, number> = {};
  public cursor: RecitationCursor = {
    currentAyah: 0,
    currentWord: 0,
    currentCharacter: 0,
    timestamp: 0
  };
  
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
    this.totalExpectedWords = 0;
    this.totalMatchedWords = 0;
    this.ayahScores = {};
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
    
    // Accurate accuracy computation using word alignment
    if (this.totalExpectedWords > 0) {
      this.stats.accuracy = Math.min(100, Math.max(0, (this.totalMatchedWords / this.totalExpectedWords) * 100));
    }
    
    this.stats.reviewPriority = ReviewPlanner.computePriorities(this.ayahScores);
    
    this.setState('report');
    if (this.onSessionComplete) this.onSessionComplete(this.stats);
  }

  private incrementAyahScore(ayahNumber: number, score: number) {
    if (!this.ayahScores[ayahNumber]) this.ayahScores[ayahNumber] = 0;
    this.ayahScores[ayahNumber] += score;
  }

  private processRecitation(transcript: string) {
    if (this.currentIndex >= this.ayahs.length) return;
    this.setState('matching');
    
    const currentAyah = this.ayahs[this.currentIndex];
    const expectedWords = QuranAlignment.normalizeArabic(currentAyah.text).split(/\s+/).filter(w => w);
    const spokenWords = QuranAlignment.normalizeArabic(transcript).split(/\s+/).filter(w => w);
    
    const alignment = QuranAlignment.alignSequence(spokenWords, expectedWords);
    
    // Update cursor position
    this.cursor = {
      currentAyah: currentAyah.number,
      currentWord: alignment.matchedWords, // Approximate cursor progression
      currentCharacter: 0,
      timestamp: Date.now()
    };

    // Update confidence rolling average
    this.stats.averageConfidence = (this.stats.averageConfidence + alignment.confidence) / 2;

    // Track global stats for accuracy calculation
    if (!this.isTestingGoBack) {
      this.totalExpectedWords += alignment.expectedWordCount;
      this.totalMatchedWords += alignment.matchedWords;
    }

    const mistakeType = MistakeClassifier.classify(alignment);
    
    // Collect context for Decision Engine
    const attempts = mistakeType ? this.attemptManager.recordAttempt(currentAyah.number) : this.attemptManager.getAttempts(currentAyah.number);
    const isPerfectStreak = (this.perfectAyahsCount + 1) >= 5; // Reaching 5 triggers encouragement
    const isGoBackTriggered = this.goBackEngine.shouldGoBack(this.currentIndex);
    const isEndOfSession = (this.currentIndex + 1) >= this.ayahs.length;

    const decisionContext = {
      mistakeType,
      completion: alignment.completion,
      attempts,
      isPerfectStreak,
      isGoBackTriggered,
      isEndOfSession,
      isTestingGoBack: this.isTestingGoBack
    };

    const action = TeacherDecisionEngine.decideNextAction(decisionContext);
    this.executeTeacherAction(action, currentAyah, mistakeType);
  }

  private executeTeacherAction(action: TeacherAction, currentAyah: Ayah, mistakeType: any) {
    switch (action) {
      case TeacherAction.Advance:
        if (this.attemptManager.getAttempts(currentAyah.number) === 0) {
          if (!this.stats.strongAyahs.includes(currentAyah.number)) this.stats.strongAyahs.push(currentAyah.number);
          this.perfectAyahsCount++;
          this.goBackEngine.recordPerfectAyah();
        }
        this.attemptManager.reset(currentAyah.number);
        
        if (this.isTestingGoBack) {
          this.isTestingGoBack = false;
          this.currentIndex = this.savedIndexBeforeGoBack;
          this.teacher.sayIntent('PROMPT_ENCOURAGE', 'أحسنت', () => this.resume());
          return;
        }

        this.stats.completedAyahs++;
        this.currentIndex++;
        if (this.onAyahProgress) this.onAyahProgress(this.currentIndex, this.ayahs.length);
        this.setState('advance_ayah');
        this.resume();
        break;

      case TeacherAction.Encourage:
        this.perfectAyahsCount = 0;
        this.goBackEngine.recordMistake(); // Reset streak counter in GoBack Engine too
        this.stats.completedAyahs++;
        this.currentIndex++;
        if (this.onAyahProgress) this.onAyahProgress(this.currentIndex, this.ayahs.length);
        
        this.pause();
        this.setState('teacher_prompt');
        this.emitCorrection('encouragement', 'أحسنت');
        this.teacher.sayIntent('PROMPT_ENCOURAGE', '', () => {
          this.setState('advance_ayah');
          this.resume();
        });
        break;

      case TeacherAction.Finish:
        this.stats.completedAyahs++;
        this.teacher.sayIntent('PROMPT_FINISH', '', () => this.stop());
        break;

      case TeacherAction.GoBack:
        this.pause();
        this.savedIndexBeforeGoBack = this.currentIndex;
        this.currentIndex = this.goBackEngine.getTargetAyah(this.currentIndex);
        this.isTestingGoBack = true;
        this.setState('teacher_prompt');
        this.emitCorrection('go_back', 'اختبار مراجعة');
        
        const targetAyahText = this.ayahs[this.currentIndex].text;
        // Say the first few words of the target ayah as the prompt
        const firstFewWords = targetAyahText.split(' ').slice(0, 3).join(' ');
        this.teacher.sayIntent('PROMPT_GO_BACK', firstFewWords, () => this.resume());
        break;

      case TeacherAction.Repeat:
      case TeacherAction.RepeatAgain:
      case TeacherAction.RepeatFromStart:
        this.stats.mistakes++;
        this.perfectAyahsCount = 0;
        this.goBackEngine.recordMistake();
        this.pause();
        
        const attempts = this.attemptManager.getAttempts(currentAyah.number);
        if (attempts > 1) {
          this.stats.repeatedMistakes++;
          this.incrementAyahScore(currentAyah.number, 5); // Add priority score
          if (!this.stats.weakAyahs.includes(currentAyah.number)) {
            this.stats.weakAyahs.push(currentAyah.number);
          }
        } else {
          this.incrementAyahScore(currentAyah.number, 2);
        }

        this.setState('waiting_retry');
        
        let promptIntent: any = 'PROMPT_REPEAT';
        if (action === TeacherAction.RepeatAgain) promptIntent = 'PROMPT_REPEAT_AGAIN';
        if (action === TeacherAction.RepeatFromStart) promptIntent = 'PROMPT_REPEAT_FROM_START';

        const msg = this.teacher.sayIntent(promptIntent, '', () => this.resume());
        this.emitCorrection('mistake', msg, mistakeType);
        break;

      case TeacherAction.Correct:
        this.stats.mistakes++;
        this.perfectAyahsCount = 0;
        this.goBackEngine.recordMistake();
        this.pause();
        this.incrementAyahScore(currentAyah.number, 10); // High priority
        
        this.setState('correction_playback');
        const correctMsg = this.teacher.sayIntent('PROMPT_CORRECT', currentAyah.text, () => {
          if (this.isTestingGoBack) {
             this.isTestingGoBack = false;
             this.currentIndex = this.savedIndexBeforeGoBack;
          }
          this.attemptManager.reset(currentAyah.number);
          this.resume();
        });
        this.emitCorrection('correction', correctMsg, mistakeType);
        break;

      case TeacherAction.PromptContinue:
        // For partial completions without specific mistakes
        this.pause();
        this.setState('teacher_prompt');
        const continueMsg = this.teacher.sayIntent('PROMPT_CONTINUE', '', () => this.resume());
        this.emitCorrection('hesitation', continueMsg, 'Hesitation' as any);
        break;
    }
  }

  private handleHesitation() {
    this.stats.hesitations++;
    this.perfectAyahsCount = 0;
    this.goBackEngine.recordMistake();
    
    // Add priority score for hesitations
    const currentAyah = this.ayahs[this.currentIndex];
    if (currentAyah) {
      this.incrementAyahScore(currentAyah.number, 1);
    }
    
    this.pause();
    this.setState('teacher_prompt');
    const msg = this.teacher.sayIntent('PROMPT_CONTINUE', '', () => this.resume());
    this.emitCorrection('hesitation', msg, 'Hesitation' as any);
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

