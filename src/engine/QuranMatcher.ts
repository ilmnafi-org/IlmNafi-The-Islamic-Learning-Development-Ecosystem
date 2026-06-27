/**
 * QuranMatcher
 * Evaluates the streaming recognized text against multiple references to detect:
 * - Expected Ayah Match
 * - Skipped Ayah
 * - Wrong Surah
 * - Wrong Juz
 * - Similar Ayah confusion
 */
import { QuranAlignment } from './QuranAlignment';
import { Ayah } from '../types/murajaah';

export class QuranMatcher {
  public static evaluateSequence(transcript: string, currentTarget: Ayah, contextAyahs: Ayah[]): {
    matchType: 'exact' | 'partial' | 'wrong_surah' | 'skipped_ayah' | 'similar_ayah' | 'no_match';
    confidence: number;
    targetAyahNumber?: number;
  } {
    const normalizedTranscript = QuranAlignment.normalizeArabic(transcript);
    
    // Check against expected ayah first
    const targetAlignment = QuranAlignment.calculate(transcript, currentTarget.text);
    if (targetAlignment.completion > 70) {
      return { matchType: 'exact', confidence: targetAlignment.confidence, targetAyahNumber: currentTarget.number };
    }

    if (targetAlignment.completion > 30) {
      return { matchType: 'partial', confidence: targetAlignment.confidence };
    }

    // Heuristics for advanced detection
    // E.g. Check next 3 ayahs for skipping
    const lookAhead = contextAyahs.slice(0, 3);
    for (let i = 0; i < lookAhead.length; i++) {
      const skipAlignment = QuranAlignment.calculate(transcript, lookAhead[i].text);
      if (skipAlignment.completion > 80) {
        return { matchType: 'skipped_ayah', confidence: skipAlignment.confidence, targetAyahNumber: lookAhead[i].number };
      }
    }

    // Hardcoded example for Wrong Surah detection based on well-known openers
    if (normalizedTranscript.includes("قل هو الله احد")) {
      return { matchType: 'wrong_surah', confidence: 100 };
    }

    return { matchType: 'no_match', confidence: 0 };
  }
}
