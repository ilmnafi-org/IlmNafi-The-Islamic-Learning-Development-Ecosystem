export interface AlignmentResult {
  matchedWords: number;
  skippedWords: number[];
  insertedWords: number[];
  wrongWords: number[];
  completion: number; // 0-100
  confidence: number;
  expectedWordCount: number;
}

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

  static alignSequence(spokenWords: string[], expectedWords: string[]): AlignmentResult {
    const normSpoken = spokenWords.map(w => this.normalizeArabic(w));
    const normExpected = expectedWords.map(w => this.normalizeArabic(w));

    const n = normSpoken.length;
    const m = normExpected.length;
    
    // DP Table for Levenshtein Distance
    const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
    
    for (let i = 0; i <= n; i++) dp[i][0] = i;
    for (let j = 0; j <= m; j++) dp[0][j] = j;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (normSpoken[i - 1] === normExpected[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // Insertion in spoken
            dp[i][j - 1] + 1, // Deletion (skipped word)
            dp[i - 1][j - 1] + 1 // Substitution (wrong word)
          );
        }
      }
    }

    // Backtrack to find operations
    let i = n, j = m;
    const skippedWords: number[] = [];
    const insertedWords: number[] = [];
    const wrongWords: number[] = [];
    let matchedCount = 0;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normSpoken[i - 1] === normExpected[j - 1]) {
        matchedCount++;
        i--;
        j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        wrongWords.push(j - 1);
        i--;
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
        insertedWords.push(i - 1);
        i--;
      } else {
        skippedWords.push(j - 1);
        j--;
      }
    }

    skippedWords.reverse();
    insertedWords.reverse();
    wrongWords.reverse();

    const completion = m > 0 ? (matchedCount / m) * 100 : 0;
    
    // Simulate confidence based on match ratio (placeholder until real ASR confidence is integrated)
    const confidence = matchedCount / Math.max(1, (matchedCount + skippedWords.length + wrongWords.length));

    return {
      matchedWords: matchedCount,
      skippedWords,
      insertedWords,
      wrongWords,
      completion,
      confidence,
      expectedWordCount: m
    };
  }
}
