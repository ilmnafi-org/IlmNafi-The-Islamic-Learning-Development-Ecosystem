export class QuranAlignment {
  static normalizeArabic(text: string): string {
    return text
      .replace(/[\u0617-\u061A\u064B-\u0652]/g, '') // Remove diacritics
      .replace(/[أإآا]/g, 'ا') // Normalize Alef
      .replace(/ة/g, 'ه') // Normalize Teh Marbuta to Heh
      .replace(/ي/g, 'ى') // Normalize Yeh to Alef Maksura
      .replace(/ؤ/g, 'و') // Normalize Waw with Hamza
      .replace(/ئ/g, 'ى') // Normalize Yeh with Hamza
      .trim();
  }

  static getMatchedWordsCount(spoken: string, expected: string): number {
    const spokenWords = this.normalizeArabic(spoken).split(/\s+/).filter(w => w);
    const expectedWords = this.normalizeArabic(expected).split(/\s+/).filter(w => w);
    
    let matchCount = 0;
    // Simple greedy match
    let expectedIdx = 0;
    for (let i = 0; i < spokenWords.length; i++) {
      if (expectedIdx < expectedWords.length && spokenWords[i] === expectedWords[expectedIdx]) {
        matchCount++;
        expectedIdx++;
      }
    }
    return matchCount;
  }
}

