export class GoBackEngine {
  private lastGoBackTime: number = 0;
  
  shouldGoBack(currentIndex: number, currentTime: number): boolean {
    if (currentIndex < 3) return false; // Need some context to go back
    
    // E.g., once every 3 minutes, or random 10% chance if last time was > 3 mins ago
    if (currentTime - this.lastGoBackTime > 180000 && Math.random() > 0.8) {
      this.lastGoBackTime = currentTime;
      return true;
    }
    
    return false;
  }
  
  getTargetAyah(currentIndex: number): number {
    // Jump back 1 to 3 ayahs
    return Math.max(0, currentIndex - Math.floor(Math.random() * 3 + 1));
  }
}
