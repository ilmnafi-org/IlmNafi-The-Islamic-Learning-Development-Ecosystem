export interface AlignmentResult {
  matchedWords: number;
  skippedWords: number[];
  insertedWords: number[];
  wrongWords: number[];
  completion: number; // 0-100
  confidence: number;
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

    let matchedCount = 0;
    const skippedWords: number[] = [];
    const insertedWords: number[] = [];
    const wrongWords: number[] = [];

    // Basic dynamic sequence alignment approximation (greedy forward match)
    // A true DP (Levenshtein) is better, but this approximates real-time sequential reading
    let sIdx = 0; // spoken index
    let eIdx = 0; // expected index

    while (sIdx < normSpoken.length && eIdx < normExpected.length) {
      if (normSpoken[sIdx] === normExpected[eIdx]) {
        matchedCount++;
        sIdx++;
        eIdx++;
      } else {
        // Look ahead in expected to see if they skipped a word
        let foundInExpected = false;
        for (let lookahead = 1; lookahead <= 2 && eIdx + lookahead < normExpected.length; lookahead++) {
          if (normSpoken[sIdx] === normExpected[eIdx + lookahead]) {
            // They skipped some words
            for (let i = 0; i < lookahead; i++) {
              skippedWords.push(eIdx + i);
            }
            eIdx += lookahead;
            foundInExpected = true;
            break;
          }
        }

        if (!foundInExpected) {
          // Look ahead in spoken to see if they inserted a word
          let foundInSpoken = false;
          for (let lookahead = 1; lookahead <= 2 && sIdx + lookahead < normSpoken.length; lookahead++) {
            if (normSpoken[sIdx + lookahead] === normExpected[eIdx]) {
              // They inserted some words
              for (let i = 0; i < lookahead; i++) {
                insertedWords.push(sIdx + i);
              }
              sIdx += lookahead;
              foundInSpoken = true;
              break;
            }
          }
          
          if (!foundInSpoken) {
            // Wrong word
            wrongWords.push(sIdx);
            sIdx++;
            eIdx++;
          }
        }
      }
    }

    // Any remaining expected words are skipped (if they just stopped)
    // We don't mark trailing expected words as "skipped" yet if they are still speaking,
    // but for a snapshot evaluation, we can track them.
    for (let i = eIdx; i < normExpected.length; i++) {
      skippedWords.push(i);
    }
    
    for (let i = sIdx; i < normSpoken.length; i++) {
      insertedWords.push(i);
    }

    const completion = normExpected.length > 0 ? (matchedCount / normExpected.length) * 100 : 0;
    
    // Simulate confidence based on match ratio
    const confidence = matchedCount / Math.max(1, (matchedCount + skippedWords.length + wrongWords.length));

    return {
      matchedWords: matchedCount,
      skippedWords,
      insertedWords,
      wrongWords,
      completion,
      confidence
    };
  }
}
