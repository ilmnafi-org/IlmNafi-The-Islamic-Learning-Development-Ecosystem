export class GoBackEngine {
  private perfectStreak: number = 0;
  
  recordPerfectAyah() {
    this.perfectStreak++;
  }
  
  recordMistake() {
    this.perfectStreak = 0;
  }

  shouldGoBack(currentIndex: number): boolean {
    if (currentIndex < 3) return false; // Need some context to go back
    
    // Deterministic rule: Go back every 7 perfect ayahs
    if (this.perfectStreak >= 7) {
      this.perfectStreak = 0; // reset after triggering
      return true;
    }
    
    return false;
  }
  
  getTargetAyah(currentIndex: number): number {
    // Jump back 3 ayahs for recall testing
    return Math.max(0, currentIndex - 3);
  }
}
