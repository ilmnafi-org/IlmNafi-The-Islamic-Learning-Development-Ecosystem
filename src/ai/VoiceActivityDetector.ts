/**
 * VoiceActivityDetector (VAD)
 * Monitors microphone stream to detect human speech and silence.
 * Essential for triggering teacher interventions ("أكمل") during long hesitations.
 */
export class VoiceActivityDetector {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private silenceThreshold: number = 10; // dB or RMS threshold
  private checkInterval: any = null;
  private silenceStartMs: number = 0;
  private isSilent: boolean = true;
  
  public onLongSilence?: (durationMs: number) => void;

  public async startListening() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      source.connect(this.analyser);
      
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      this.checkInterval = setInterval(() => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        
        // Calculate volume RMS
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const volume = sum / bufferLength;

        if (volume < this.silenceThreshold) {
          if (!this.isSilent) {
            this.isSilent = true;
            this.silenceStartMs = Date.now();
          } else {
            const silenceDuration = Date.now() - this.silenceStartMs;
            if (silenceDuration >= 8000) { // 8 seconds silence
              if (this.onLongSilence) this.onLongSilence(silenceDuration);
              this.silenceStartMs = Date.now(); // Reset to avoid spamming
            }
          }
        } else {
          this.isSilent = false;
        }
      }, 500);

    } catch (e) {
      console.error('[VAD] Microphone access denied or failed.', e);
    }
  }

  public stopListening() {
    if (this.checkInterval) clearInterval(this.checkInterval);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
