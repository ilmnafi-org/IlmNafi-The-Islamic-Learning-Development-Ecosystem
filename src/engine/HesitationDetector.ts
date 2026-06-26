export class HesitationDetector {
  private timeoutId: NodeJS.Timeout | null = null;
  private timeoutMs: number;
  private onHesitation: () => void;

  constructor(timeoutMs: number = 8000, onHesitation: () => void) {
    this.timeoutMs = timeoutMs;
    this.onHesitation = onHesitation;
  }

  reset() {
    this.stop();
    this.start();
  }

  start() {
    this.timeoutId = setTimeout(() => {
      this.onHesitation();
    }, this.timeoutMs);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
