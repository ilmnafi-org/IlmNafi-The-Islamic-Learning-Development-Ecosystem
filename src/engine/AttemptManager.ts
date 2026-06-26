export class AttemptManager {
  private attempts: number = 0;
  private readonly maxAttempts: number = 3;

  recordAttempt(): boolean {
    this.attempts++;
    return this.attempts >= this.maxAttempts;
  }

  reset() {
    this.attempts = 0;
  }
  
  getAttempts() {
    return this.attempts;
  }
}
