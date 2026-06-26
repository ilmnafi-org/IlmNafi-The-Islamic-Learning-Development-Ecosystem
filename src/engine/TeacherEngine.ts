type DialogueIntent = 'PROMPT_CONTINUE' | 'PROMPT_REPEAT' | 'PROMPT_REPEAT_AGAIN' | 'PROMPT_REPEAT_FROM_START' | 'PROMPT_GO_BACK' | 'PROMPT_ENCOURAGE' | 'PROMPT_CORRECT' | 'PROMPT_FINISH';

export class TeacherEngine {
  private synth: SpeechSynthesis;
  private arabicVoice: SpeechSynthesisVoice | null = null;

  private dialogueMap: Record<DialogueIntent, string[]> = {
    PROMPT_CONTINUE: ['أكمل', 'تابع', 'واصل'],
    PROMPT_REPEAT: ['أعد الآية', 'لا، أعد'],
    PROMPT_REPEAT_AGAIN: ['حاول مرة أخرى'],
    PROMPT_REPEAT_FROM_START: ['أعد من أول الآية'],
    PROMPT_GO_BACK: ['ارجع إلى قوله تعالى'],
    PROMPT_ENCOURAGE: ['أحسنت', 'بارك الله فيك', 'ممتاز', 'فتح الله عليك'],
    PROMPT_CORRECT: ['الصواب هو'],
    PROMPT_FINISH: ['صدق الله العظيم', 'حسبك، أحسنت']
  };

  constructor() {
    this.synth = window.speechSynthesis;
    this.initVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.initVoices.bind(this);
    }
  }

  private initVoices() {
    const voices = this.synth.getVoices();
    this.arabicVoice = voices.find(voice => voice.lang.startsWith('ar')) || null;
  }

  speak(text: string, onEnd?: () => void) {
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    
    if (this.arabicVoice) {
      utterance.voice = this.arabicVoice;
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    this.synth.speak(utterance);
  }

  sayIntent(intent: DialogueIntent, suffix: string = '', onEnd?: () => void) {
    const phrases = this.dialogueMap[intent];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const text = suffix ? `${phrase} ${suffix}` : phrase;
    this.speak(text, onEnd);
    return text;
  }
}

