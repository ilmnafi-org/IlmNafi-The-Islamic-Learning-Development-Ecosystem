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

  static calculateMatchScore(spoken: string, expected: string): number {
    const normSpoken = this.normalizeArabic(spoken);
    const normExpected = this.normalizeArabic(expected);

    if (normSpoken === normExpected) return 1.0;
    
    // Very basic partial match check
    if (normExpected.includes(normSpoken) && normSpoken.length > 3) {
      return normSpoken.length / normExpected.length;
    }

    return 0; // Not a good match
  }

  static isWordMatch(spokenWords: string[], expectedText: string): boolean {
    const normExpected = this.normalizeArabic(expectedText);
    const spokenPhrase = this.normalizeArabic(spokenWords.join(' '));
    
    // Check if the spoken phrase is contained within the expected text, 
    // or if the expected text is contained within the spoken phrase (if they appended extra words)
    return normExpected.includes(spokenPhrase) || spokenPhrase.includes(normExpected);
  }
}
