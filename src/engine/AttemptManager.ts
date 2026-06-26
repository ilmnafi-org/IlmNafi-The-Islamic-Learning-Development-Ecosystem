export class AttemptManager {
  private ayahAttempts: Record<number, number> = {};

  recordAttempt(ayahNumber: number): number {
    if (!this.ayahAttempts[ayahNumber]) {
      this.ayahAttempts[ayahNumber] = 0;
    }
    this.ayahAttempts[ayahNumber]++;
    return this.ayahAttempts[ayahNumber];
  }

  reset(ayahNumber: number) {
    this.ayahAttempts[ayahNumber] = 0;
  }
  
  getAttempts(ayahNumber: number) {
    return this.ayahAttempts[ayahNumber] || 0;
  }
}

