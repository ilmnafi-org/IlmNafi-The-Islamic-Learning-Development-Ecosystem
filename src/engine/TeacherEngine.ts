export class TeacherEngine {
  private synth: SpeechSynthesis;
  private arabicVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    // Voices might be loaded asynchronously, so we try to get it now, and also set a listener
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
    this.synth.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // Slightly slower for clarity
    
    if (this.arabicVoice) {
      utterance.voice = this.arabicVoice;
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    this.synth.speak(utterance);
  }

  sayHesitationPrompt(onEnd?: () => void) {
    this.speak('أكمل', onEnd);
  }

  sayMistakePrompt(onEnd?: () => void) {
    this.speak('لا، أعد الآية', onEnd);
  }

  sayCorrection(correctText: string, onEnd?: () => void) {
    this.speak(correctText, onEnd);
  }
}
