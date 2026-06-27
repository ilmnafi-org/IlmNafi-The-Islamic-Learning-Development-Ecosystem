/**
 * ElevenLabsProvider
 * Neural Text-to-Speech specifically tuned for a natural Arabic Teacher's voice.
 */
export class ElevenLabsProvider {
  private apiKey: string;
  private voiceId: string = 'pNInz6obbf5AWCGqEa3X'; // Example generic Arabic voice ID
  private audioContext: AudioContext | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || ''; // In production, proxy via backend
  }

  public async speak(text: string, onComplete?: () => void) {
    if (!text.trim()) {
      if (onComplete) onComplete();
      return;
    }

    console.log(`[ElevenLabs] Synthesizing: "${text}"`);
    
    // Fallback to browser TTS if no key provided
    if (!this.apiKey) {
      console.warn('[ElevenLabs] No API key detected. Falling back to Browser TTS.');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.onend = () => { if (onComplete) onComplete(); };
      window.speechSynthesis.speak(utterance);
      return;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.8
          }
        })
      });

      if (!response.ok) throw new Error('ElevenLabs API Error');

      const arrayBuffer = await response.arrayBuffer();
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        if (onComplete) onComplete();
      };

      source.start(0);
    } catch (e) {
      console.error('[ElevenLabs] Failed to play audio:', e);
      if (onComplete) onComplete();
    }
  }
}
