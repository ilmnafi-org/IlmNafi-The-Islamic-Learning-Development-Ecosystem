/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TajweedRuleOccurrence {
  ruleId: string;
  ruleName: string; // Traditional Arabic-transliterated name (e.g., Ikhfā' Haqīqī)
  category: 'noon-saakin' | 'meem-saakin' | 'madd' | 'laam' | 'raa' | 'qalqalah' | 'ghunnah' | 'sifaat';
  letters: string[];
  description: string;
  audioInstruction: string;
  makhrajRegion: 'halq' | 'lisan' | 'shafatan' | 'khayshum' | 'jawf';
  makhrajInteractiveDetails: {
    title: string;
    description: string;
    mouthOpenness: number; // 0 (closed) to 1 (very wide)
    activeAirstreamHighlightEmoji: string;
    anatomicalHotspots: string[]; // ["vocal-cords", "throat-mid", "tongue-back", "tongue-tip", "lips", "nasal"]
  };
  durationBeats: number;
}

export interface WordAnalysis {
  wordIndex: number;
  wordText: string;
  phoneticTranscription: string;
  occurrences: TajweedRuleOccurrence[];
}

export interface TajweedEngineAnalysis {
  verseText: string;
  qiraat: 'hafs' | 'warsh' | 'qaloon';
  words: WordAnalysis[];
  summaryFeedback: string;
}

// Articulation mapping details for pristine clarity based on standard Tajweed texts
const REGION_MAP = {
  halq: { title: "Throat (Al-Halq - الحلق)", desc: "Sound originates from deep inside the throat (vocal cords), middle throat (epiglottis), or nearest throat (uvula)." },
  lisan: { title: "Tongue (Al-Lisān - اللسان)", desc: "Sound is shaped by contact between specific parts of the tongue (tip, edges, back, middle) and the teeth or hard palate." },
  shafatan: { title: "Lips (Al-Shafatān - الشفتان)", desc: "Sound requires movement, rounding, or full articulation of the upper and lower lips together." },
  khayshum: { title: "Nasal Passage (Al-Khayshūm - الخيشوم)", desc: "The breath flows entirely or partially through the nasal cavity, producing the iconic nasalization (Ghunnah)." },
  jawf: { title: "Vocal Cavity (Al-Jawf - الجوف)", desc: "Vowels and elongations flow freely from the open space of the throat and mouth with no physical friction." }
};

/**
 * Deterministic Tajweed Rules Engine
 * Processes Arabic text (with or without diacritics) and matches phonetic-rules for Hafs.
 */
export function analyzeTajweedText(
  text: string,
  qiraat: 'hafs' | 'warsh' | 'qaloon' = 'hafs'
): TajweedEngineAnalysis {
  const wordsRaw = text.split(/\s+/).filter(Boolean);
  const wordsAnalysis: WordAnalysis[] = [];

  for (let wIndex = 0; wIndex < wordsRaw.length; wIndex++) {
    const rawWord = wordsRaw[wIndex];
    // Clean word for search matches
    const cleanWord = rawWord.replace(/[^\u0621-\u064A]/g, '');
    const occurrences: TajweedRuleOccurrence[] = [];

    // 1. QALQALAH letters: ق ط ب ج د (The echo letters)
    // Qalqalah occurs when these letters are Saakin (have sukoon ْ or are positioned at the end of a word/recitation breath)
    const qalqalahLetters = ['ق', 'ط', 'ب', 'ج', 'د'];
    for (let charIndex = 0; charIndex < rawWord.length; charIndex++) {
      const char = rawWord[charIndex];
      if (qalqalahLetters.includes(char)) {
        const nextCharRef = rawWord[charIndex + 1];
        const isEnd = charIndex === rawWord.length - 1;
        const isSaakin = nextCharRef === 'ْ' || isEnd;

        if (isSaakin) {
          const isFinalWord = wIndex === wordsRaw.length - 1;
          const isShaddah = charIndex > 0 && rawWord[charIndex - 1] === 'ّ';
          
          let intensityTitle = 'Al-Qalqalah Sughra (قلقلة صغرى)';
          let intensityDesc = "Subtle, quick echo sound because the Qalqalah letter is in the middle of a word or continuous text (e.g., Iqra, Qad).";
          let duration = 0.5;

          if (isEnd && isFinalWord) {
            if (isShaddah) {
              intensityTitle = 'Al-Qalqalah Kubra (قلقلة كبرى - Shaddah Stop)';
              intensityDesc = "Strongest echo sound because the Qalqalah letter has a Shaddah at the active stopping point (e.g., Al-Hajj, Watabb). Keep mouth firmly committed before releasing the sound.";
              duration = 1.0;
            } else {
              intensityTitle = 'Al-Qalqalah Wusta (قلقلة وسطى - Standard Stop)';
              intensityDesc = "Medium echo sound because we are stopping on this Qalqalah letter without a Shaddah (e.g., Muheet, Al-Falaq). The release is prominent and clear.";
              duration = 0.75;
            }
          } else {
            intensityTitle = 'Al-Qalqalah Sughra (قلقلة صغرى - Subtle Middle)';
            intensityDesc = "Subtle, quick echo sound because the Qalqalah letter is in the middle of a word or continuous text. The pronunciation should bounce lightly without stalling.";
            duration = 0.5;
          }

          let makhrajTitle = "";
          let makhrajDesc = "";
          let hotspots: string[] = [];

          if (char === 'ق') {
            makhrajTitle = "Deepest Tongue (Aqṣal-Lisān)";
            makhrajDesc = "Touch the very back of the tongue against the soft palate in the mouth, forcing a thick recoil.";
            hotspots = ["tongue-back", "throat-mid"];
          } else if (char === 'ط') {
            makhrajTitle = "Tongue tip & Gums (Ṭaraful-Lisān)";
            makhrajDesc = "Press the top of the tongue tip firmly against the roots of the upper two front teeth, forming a strong, sealed air block.";
            hotspots = ["tongue-tip"];
          } else if (char === 'ب') {
            makhrajTitle = "Lips Union (Al-Shafatān)";
            makhrajDesc = "Fully close the wet parts of the upper and lower lips together, then release with a sharp visual puff.";
            hotspots = ["lips"];
          } else if (char === 'ج') {
            makhrajTitle = "Middle Tongue Press (Wasaṭul-Lisān)";
            makhrajDesc = "Squeeze the central body of the tongue against the roof of the hard palate, preventing air leakage.";
            hotspots = ["tongue-mid"];
          } else if (char === 'د') {
            makhrajTitle = "Tongue tip & Upper teeth (Ṭaraful-Lisān)";
            makhrajDesc = "Briefly tap the tip of the tongue against the gum line of the upper two front teeth, keeping it light and non-vibrant.";
            hotspots = ["tongue-tip"];
          }

          occurrences.push({
            ruleId: `qalqalah-${char}`,
            ruleName: `Qalqalah ${intensityTitle}`,
            category: 'qalqalah',
            letters: [char],
            description: `${intensityDesc} Bounce the pronunciation of '${char}' with a clean, vibrant shaking sound.`,
            audioInstruction: `Release the lock with a crisp, audible, vibrant recoil sound without adding a trailing vowel count (e.g. do not say "Al-Falaqa").`,
            makhrajRegion: char === 'ب' ? 'shafatan' : 'lisan',
            makhrajInteractiveDetails: {
              title: `${char} - ${makhrajTitle}`,
              description: makhrajDesc,
              mouthOpenness: char === 'ب' ? 0.1 : 0.35,
              activeAirstreamHighlightEmoji: "💨",
              anatomicalHotspots: hotspots
            },
            durationBeats: duration
          });
        }
      }
    }

    // 2. GHUNNAH (Nasalization on Shaddah) on Nun Mashaddadah or Meem Mashaddadah
    for (let i = 0; i < rawWord.length; i++) {
      const c = rawWord[i];
      const next = rawWord[i + 1];
      if ((c === 'ن' || c === 'م') && next === 'ّ') {
        const letterName = c === 'ن' ? 'Nūn' : 'Mīm';
        const traditionalName = c === 'ن' 
          ? "Al-Ghunnah Mushaddadah (غنة نون مشددة)" 
          : "Al-Ghunnah Mushaddadah (غنة ميم مشددة)";
        occurrences.push({
          ruleId: `ghunnah-${c}`,
          ruleName: traditionalName,
          category: 'ghunnah',
          letters: [c],
          description: `Hold the nasal resonance of the double '${letterName}' entirely inside the nasal passage. This rule is highly mandatory and must be applied for 2 full beats.`,
          audioInstruction: `Prolong the nasalization sound strictly for 2 beats or counts. Avoid opening the lips early or leaking the breath.`,
          makhrajRegion: 'khayshum',
          makhrajInteractiveDetails: {
            title: `Nasal Passage (Al-Khayshūm)`,
            description: "Emit the sound completely through the nose. If you pinch your nostrils while saying this, the recitation sound should stop immediately.",
            mouthOpenness: 0.2,
            activeAirstreamHighlightEmoji: "👃",
            anatomicalHotspots: ["nasal", "throat-mid"]
          },
          durationBeats: 2
        });
      }
    }

    // 3. NOON SAAKIN & TANWEEN (Vocal rules of Nunation)
    const hasFathatan = rawWord.includes('ً');
    const hasKasratan = rawWord.includes('ٍ');
    const hasDammatan = rawWord.includes('ٌ');
    const isTanween = hasFathatan || hasKasratan || hasDammatan;
    const hasNunSaakin = rawWord.includes('نْ') || (rawWord.includes('ن') && !rawWord.match(/ن[\u064E\u064F\u0650\u0651]/));

    if (isTanween || hasNunSaakin) {
      // Izhaar Mutlaq Exception (Dunya, Bunyan, Sinwan, Qinwan) before considering Idgham
      const cleanWordOnly = rawWord.replace(/[^\u0621-\u064A]/g, '');
      const isIzharMutlaq = ['دنيا', 'بنيان', 'صنوان', 'قنوان'].some(term => cleanWordOnly.includes(term));

      if (isIzharMutlaq) {
        occurrences.push({
          ruleId: 'izhar-mutlaq',
          ruleName: 'Al-Izhar Mutlaq (إظهار مطلق)',
          category: 'noon-saakin',
          letters: ['ن'],
          description: "An absolute exception in Hafs Quran. When Nūn Saakin is followed by Yā or Wāw in a SINGLE word, it must be pronounced clearly with no merging to preserve the word's baseline meaning.",
          audioInstruction: "Recite the Nūn sound clearly from the tongue tip with no nasalization, delay, or merging.",
          makhrajRegion: 'lisan',
          makhrajInteractiveDetails: {
            title: "Tongue Tip to Upper Gums (Makhraj an-Nūn)",
            description: "Touch the tip of your tongue to the gums of the upper front teeth clearly for the Nun, releasing it normally.",
            mouthOpenness: 0.4,
            activeAirstreamHighlightEmoji: "🗣️",
            anatomicalHotspots: ["tongue-tip"]
          },
          durationBeats: 1
        });
      } else {
        // Look ahead to next word
        const nextWordRaw = wordsRaw[wIndex + 1];
        if (nextWordRaw) {
          const firstLetterOfNextWord = nextWordRaw.replace(/[^\u0621-\u064A]/g, '')[0];
          
          if (firstLetterOfNextWord) {
            // A: Izhār (Throat letters: ء, هـ, ع, ح, غ, خ)
            const izharLetters = ['ء', 'أ', 'إ', 'ؤ', 'ئ', 'ه', 'ع', 'ح', 'غ', 'خ', 'آ'];
            // B: Idghaam (ي, ر, م, ل, و, ن)
            const idghamWithGhunnah = ['ي', 'ن', 'م', 'و'];
            const idghamWithoutGhunnah = ['ل', 'ر'];
            // C: Iqlaab (ب)
            const iqlabLetter = 'ب';

            if (izharLetters.includes(firstLetterOfNextWord)) {
              occurrences.push({
                ruleId: 'izhar',
                ruleName: 'Al-Izhar Halqi (إظهار حلقي)',
                category: 'noon-saakin',
                letters: ['ن', firstLetterOfNextWord],
                description: `Clear pronunciation of Nūn with no extra nasal extension, because it is followed by the throat letter '${firstLetterOfNextWord}'.`,
                audioInstruction: `Recite the Nūn sound clearly and briefly from the tongue tip, shifting directly to the deep throat letter.`,
                makhrajRegion: 'lisan',
                makhrajInteractiveDetails: {
                  title: "Tongue Tip to Upper Gums & Throat",
                  description: "Touch the tip of your tongue to the gums of the upper front teeth clearly for the Nun, then speak the throat letter.",
                  mouthOpenness: 0.45,
                  activeAirstreamHighlightEmoji: "🗣️",
                  anatomicalHotspots: ["tongue-tip", "throat-mid"]
                },
                durationBeats: 1
              });
            } else if (idghamWithGhunnah.includes(firstLetterOfNextWord)) {
              occurrences.push({
                ruleId: 'idgham-ghunnah',
                ruleName: 'Al-Idghaam bi-Ghunnah (إدغام بغنة)',
                category: 'noon-saakin',
                letters: ['ن', firstLetterOfNextWord],
                description: `Merge the silent Nūn sound into the articulation of the next letter '${firstLetterOfNextWord}' with a full 2-beat nasal hold (Ghunnah).`,
                audioInstruction: `Blend the two letters seamlessly. Sustain the nasalized merging sound through the nose for two full beats before release.`,
                makhrajRegion: 'khayshum',
                makhrajInteractiveDetails: {
                  title: "Nasal Fusion (Merging)",
                  description: `Merge the Nūn and '${firstLetterOfNextWord}', using your nasal passage to project the cumulative 2-beat sound.`,
                  mouthOpenness: 0.3,
                  activeAirstreamHighlightEmoji: "👃",
                  anatomicalHotspots: ["nasal", "tongue-back"]
                },
                durationBeats: 2
              });
            } else if (idghamWithoutGhunnah.includes(firstLetterOfNextWord)) {
              occurrences.push({
                ruleId: 'idgham-no-ghunnah',
                ruleName: 'Al-Idghaam bila Ghunnah (إدغام بلا غنة)',
                category: 'noon-saakin',
                letters: ['ن', firstLetterOfNextWord],
                description: `Merge the Nūn completely into the subsequent letter '${firstLetterOfNextWord}' with absolutely no nasal hum remaining (Idgham Kamil).`,
                audioInstruction: `Jump directly from the preceding vowel into a doubled '${firstLetterOfNextWord}'. Ensure no nasalization escapes.`,
                makhrajRegion: 'lisan',
                makhrajInteractiveDetails: {
                  title: "Direct Physical Merge (Complete)",
                  description: `Completely bypass the Nūn sound and press into the articulation of '${firstLetterOfNextWord}'.`,
                  mouthOpenness: 0.35,
                  activeAirstreamHighlightEmoji: "💨",
                  anatomicalHotspots: firstLetterOfNextWord === 'ر' ? ["tongue-tip", "vocal-cords"] : ["tongue-tip"]
                },
                durationBeats: 1
              });
            } else if (firstLetterOfNextWord === iqlabLetter) {
              occurrences.push({
                ruleId: 'iqlab',
                ruleName: 'Al-Iqlab (إقلاب)',
                category: 'noon-saakin',
                letters: ['ن', 'ب'],
                description: `Convert the Nūn or Tanwīn sound into a light, soft Mīm (م) accompanied by facial nasalisation (2 beats) prior to reciting the 'Ba' letter.`,
                audioInstruction: `Close the lips lightly without squeezing them hard. Let the nasal sound drift while transitioning to the Ba.`,
                makhrajRegion: 'shafatan',
                makhrajInteractiveDetails: {
                  title: "Soft Lips Close (Al-Shafatān)",
                  description: "Touch the lips together loosely to produce a soft 'm' sound, then sound the following 'b'.",
                  mouthOpenness: 0.1,
                  activeAirstreamHighlightEmoji: "👄",
                  anatomicalHotspots: ["lips", "nasal"]
                },
                durationBeats: 2
              });
            } else {
              // The remaining 15 letters form Ikhfa
              occurrences.push({
                ruleId: 'ikhfa',
                ruleName: "Al-Ikhfaa Haqiqi (إخفاء حقيقي)",
                category: 'noon-saakin',
                letters: ['ن', firstLetterOfNextWord],
                description: `Conceal the Nūn sound from being fully articulated. Recite a nasal sigh with the tongue placed close to, but NOT touching, the articulation point of '${firstLetterOfNextWord}'.`,
                audioInstruction: `Keep the mouth in position for the upcoming '${firstLetterOfNextWord}' while letting the sound escape through the nasal cavity for exactly 2 beats.`,
                makhrajRegion: 'khayshum',
                makhrajInteractiveDetails: {
                  title: "Preparatory Nasal Suspension",
                  description: `Hover the tongue near the '${firstLetterOfNextWord}' position so you are ready to speak it, but run the resonance through your nose for 2 counts.`,
                  mouthOpenness: 0.25,
                  activeAirstreamHighlightEmoji: "👃",
                  anatomicalHotspots: ["nasal", "tongue-mid"]
                },
                durationBeats: 2
              });
            }
          }
        }
      }
    }

    // 4. MEEM SAAKIN (Meem with a sukoon)
    const endsWithMeemSaakin = rawWord.endsWith('مْ') || (rawWord.endsWith('م') && !rawWord.endsWith('مَ') && !rawWord.endsWith('مُ') && !rawWord.endsWith('مِ') && !rawWord.endsWith('مَّ'));
    if (endsWithMeemSaakin) {
      const nextWordRaw = wordsRaw[wIndex + 1];
      if (nextWordRaw) {
        const nextLetter = nextWordRaw.replace(/[^\u0621-\u064A]/g, '')[0];
        if (nextLetter === 'ب') {
          occurrences.push({
            ruleId: 'ikhfa-shafawi',
            ruleName: "Al-Ikhfaa Shafawi (إخفاء شفوي)",
            category: 'meem-saakin',
            letters: ['م', 'ب'],
            description: "Hide the Meem sound lightly by closing the lips gently, adding a nasal hum of 2 counts before sounding the Ba.",
            audioInstruction: "Close lips loosely as if a thin sheet of paper could pass between them. Form a 2 beat nasalization.",
            makhrajRegion: 'shafatan',
            makhrajInteractiveDetails: {
              title: "Lips Gently Close (Al-Shafatān)",
              description: "Light lip closure without squeezing hard, combined with nasal resonance.",
              mouthOpenness: 0.1,
              activeAirstreamHighlightEmoji: "👄",
              anatomicalHotspots: ["lips", "nasal"]
            },
            durationBeats: 2
          });
        } else if (nextLetter === 'م') {
          occurrences.push({
            ruleId: 'idgham-shafawi',
            ruleName: "Al-Idghaam Mithlayn (إدغام مثلين بغنة)",
            category: 'meem-saakin',
            letters: ['م', 'م'],
            description: "Merge the ending silent Meem perfectly with the next starting Meem, resulting in a single reinforced Meem with a beautiful 2-beat nasal hold.",
            audioInstruction: "Sustain the lip close with a strong nasal ghunnah for two full beats.",
            makhrajRegion: 'shafatan',
            makhrajInteractiveDetails: {
              title: "Firm Lips Union (Merged Labials)",
              description: "Join both Meem characters firmly together at the lips, and route the timing entirely through the nasal passage.",
              mouthOpenness: 0.1,
              activeAirstreamHighlightEmoji: "👃",
              anatomicalHotspots: ["lips", "nasal"]
            },
            durationBeats: 2
          });
        } else {
          occurrences.push({
            ruleId: 'izhar-shafawi',
            ruleName: "Al-Izhar Shafawi (إظهار شفوي)",
            category: 'meem-saakin',
            letters: ['م'],
            description: "Pronounce the Meem clearly and swiftly at the lips with no prolonged nasal delay, as it is followed by a standard letter.",
            audioInstruction: "Release the Meem cleanly by touching the lips together and releasing promptly. Avoid any elongation of the nasal sound.",
            makhrajRegion: 'shafatan',
            makhrajInteractiveDetails: {
              title: "Lips Tap & Release",
              description: "Normal tap-and-release of the lips for the clear 'm' sound.",
              mouthOpenness: 0.3,
              activeAirstreamHighlightEmoji: "🗣️",
              anatomicalHotspots: ["lips"]
            },
            durationBeats: 1
          });
        }
      }
    }

    // 5. MADD (Elongation Vowels) - Hafs Standards (The wave rules)
    const alifMadd = rawWord.includes('ا') || rawWord.includes('ـا') || rawWord.includes('ٰ');
    const wawMadd = rawWord.includes('و') && (rawWord.includes('ُ') || wIndex > 0);
    const yaMadd = rawWord.includes('ي') && rawWord.includes('ِ');

    if (rawWord.includes('آ') || rawWord.includes('ۤ') || rawWord.includes('~')) {
      const hasHamzaInWord = rawWord.includes('ء') || rawWord.includes('أ') || rawWord.includes('إ');
      let ruleName = hasHamzaInWord 
        ? "Al-Madd Al-Wajib Al-Muttasil (مد واجب متصل)" 
        : "Al-Madd Al-Ja'iz Al-Munfasil (مد جائز منفصل)";
      let duration = 4; // 4 to 5 beats in Hafs
      let description = `High prolonging vowel over the letters of elongation. Indicated by the horizontal curved wave above the script. Muttasil is connected; Munfasil is detached.`;
      let audioInstruction = `Sustain the vowel cleanly from the vocal cavity (Jawf) for a count of 4 to 5 beats. Align with the visual metronome.`;

      occurrences.push({
        ruleId: 'madd-heavy',
        ruleName: ruleName,
        category: 'madd',
        letters: ['ا'],
        description,
        audioInstruction,
        makhrajRegion: 'jawf',
        makhrajInteractiveDetails: {
          title: "The Open Vocal Core (Al-Jawf)",
          description: "Let the sound flow naturally through the wide open passage of the throat and mouth with no tongue friction.",
          mouthOpenness: 0.7,
          activeAirstreamHighlightEmoji: "🎐",
          anatomicalHotspots: ["throat-mid", "vocal-cords"]
        },
        durationBeats: duration
      });
    } else if (alifMadd || wawMadd || yaMadd) {
      // Natural 2 beat Madd Asli
      occurrences.push({
        ruleId: 'madd-asli',
        ruleName: "Al-Madd Al-Asli (مد أصلي / طبيعي)",
        category: 'madd',
        letters: [alifMadd ? 'ا' : wawMadd ? 'و' : 'ي'],
        description: "Natural basic elongation of standard vowels (Alif after Fatha, Waw after Dammah, Ya after Kasrah) lasting 2 counts.",
        audioInstruction: "Sustain the vowel exactly for 2 beats (standard pace of folding a single finger).",
        makhrajRegion: 'jawf',
        makhrajInteractiveDetails: {
          title: "Vocal Vowel Elongation",
          description: "Open the mouth comfortably and sound the vocal vibration for double the duration of a normal fast vowel.",
          mouthOpenness: 0.5,
          activeAirstreamHighlightEmoji: "🎵",
          anatomicalHotspots: ["throat-mid"]
        },
        durationBeats: 2
      });
    }

    // 6. RAA RULES (Tafkheem or Tarqeeq)
    if (rawWord.includes('ر')) {
      const hasFathaOrDamma = rawWord.includes('رَ') || rawWord.includes('رُ') || rawWord.includes('رَّ') || rawWord.includes('رُّ');
      const hasKasra = rawWord.includes('رِ') || rawWord.includes('رِّ');
      
      if (hasFathaOrDamma) {
        occurrences.push({
          ruleId: 'raa-heavy',
          ruleName: "Al-Raa Tafkheem (راء تفخيم)",
          category: 'raa',
          letters: ['ر'],
          description: "Vibrate the letter Raa with a full-mouth heavy resonance because it carries a fatha or damma vowel.",
          audioInstruction: "Elevate the back of the tongue toward your upper palate to engulf the sound with thick energy.",
          makhrajRegion: 'lisan',
          makhrajInteractiveDetails: {
            title: "Elevated Tongue Crown (Tafkhīm)",
            description: "Press the crown tip of the tongue in a full sound, raising the rear of the tongue.",
            mouthOpenness: 0.45,
            activeAirstreamHighlightEmoji: "🔊",
            anatomicalHotspots: ["tongue-back", "tongue-tip"]
          },
          durationBeats: 1
        });
      } else if (hasKasra) {
        occurrences.push({
          ruleId: 'raa-light',
          ruleName: "Al-Raa Tarqeeq (راء ترقيق)",
          category: 'raa',
          letters: ['ر'],
          description: "Recite the letter Raa flatly and thinly because it carries a kasrah vowel.",
          audioInstruction: "Flatten the body of the tongue and let the sound slip forward with dry, thin air.",
          makhrajRegion: 'lisan',
          makhrajInteractiveDetails: {
            title: "Flattened Tongue (Tarqīq)",
            description: "Keep the back of the tongue low and touch the crown tip lightly for a soft, light 'R'.",
            mouthOpenness: 0.35,
            activeAirstreamHighlightEmoji: "🔇",
            anatomicalHotspots: ["tongue-tip"]
          },
          durationBeats: 1
        });
      }
    }

    // 7. LAAM OF LAFDHIL JALALI (ALLAH)
    if (rawWord.includes('اللَّه') || rawWord.includes('لِلَّه')) {
      const isWordBeforeKasra = wIndex > 0 && (wordsRaw[wIndex - 1].includes('ِ') || wordsRaw[wIndex - 1].includes('ٍ'));
      const isLillah = rawWord.includes('لِلَّه');
      const isHeavy = !isWordBeforeKasra && !isLillah;
      
      occurrences.push({
        ruleId: isHeavy ? 'laam-jalalah-heavy' : 'laam-jalalah-light',
        ruleName: isHeavy ? "Al-Laam Lafdh al-Jalalah: Tafkheem (لام لفظ الجلالة - تفخيم)" : "Al-Laam Lafdh al-Jalalah: Tarqeeq (لام لفظ الجلالة - ترقيق)",
        category: 'laam',
        letters: ['ل'],
        description: isHeavy
          ? "Pronounce the Name of Allah with a thick, heavy, round sound because it is preceded by a Fatha or Dammah vowel (or starts the phrase)."
          : "Pronounce the Name of Allah with a light, thin, flat sound because it is preceded by a Kasrah vowel (e.g., Bismillah).",
        audioInstruction: isHeavy
          ? "Raise the back of your tongue to fill your mouth with a deep heavy resonance on the double Laam."
          : "Keep your tongue flat and relaxed, letting the Laam sound thin, light, and clean.",
        makhrajRegion: 'lisan',
        makhrajInteractiveDetails: {
          title: isHeavy ? "Thickened Laam (Al-Lafdhil Jalali)" : "Thin Laam (Al-Lafdhil Jalali)",
          description: isHeavy
            ? "Elevate the rear of the tongue during the 'L' sound to create full-mouth echo."
            : "Keep the rear of the tongue low and sound the 'L' cleanly with a flat tongue.",
          mouthOpenness: 0.5,
          activeAirstreamHighlightEmoji: isHeavy ? "🔊" : "🔇",
          anatomicalHotspots: isHeavy ? ["tongue-back", "tongue-tip"] : ["tongue-tip"]
        },
        durationBeats: 1
      });
    }

    // Dynamic phonetic transcription presets
    let pTranscription = "Bism";
    if (rawWord.includes("بِسْمِ")) pTranscription = "Bis-mi";
    else if (rawWord.includes("اللَّهِ")) pTranscription = "Al-laa-hi";
    else if (rawWord.includes("الرَّحْمَٰنِ")) pTranscription = "Ar-Rah-maa-ni";
    else if (rawWord.includes("الرَّحِيمِ")) pTranscription = "Ar-Ra-heem";
    else if (rawWord.includes("قُلْ")) pTranscription = "Qul";
    else if (rawWord.includes("هُوَ")) pTranscription = "hu-wa";
    else if (rawWord.includes("أَحَدٌ")) pTranscription = "a-had";
    else if (rawWord.includes("إِنَّا")) pTranscription = "In-naaa";
    else if (rawWord.includes("أَعْطَيْنَاكَ")) pTranscription = "a'-tay-naa-ka";
    else if (rawWord.includes("الْكَوْثَرَ")) pTranscription = "al-Kau-thar";
    else if (rawWord.includes("أَعُوذُ")) pTranscription = "a-'oo-zhu";
    else if (rawWord.includes("بِرَبِّ")) pTranscription = "bi-Rab-bi";
    else if (rawWord.includes("النَّاسِ")) pTranscription = "an-Naas";
    else {
      // Basic fallback transliterator
      pTranscription = rawWord
        .replace(/ب/g, 'b').replace(/ت/g, 't').replace(/ث/g, 'th')
        .replace(/ج/g, 'j').replace(/ح/g, 'H').replace(/خ/g, 'kh')
        .replace(/د/g, 'd').replace(/ذ/g, 'zh').replace(/ر/g, 'r')
        .replace(/ز/g, 'z').replace(/س/g, 's').replace(/ش/g, 'sh')
        .replace(/ص/g, 'S').replace(/ض/g, 'D').replace(/ط/g, 'T')
        .replace(/ظ/g, 'Z').replace(/ع/g, 'a\'').replace(/غ/g, 'gh')
        .replace(/ف/g, 'f').replace(/ق/g, 'q').replace(/ك/g, 'k')
        .replace(/ل/g, 'l').replace(/م/g, 'm').replace(/ن/g, 'n')
        .replace(/ه/g, 'h').replace(/و/g, 'w').replace(/ي/g, 'y')
        .replace(/[\u064E\u064F\u0650\u0651\u0652]/g, ''); // strip vowels for baseline
    }

    wordsAnalysis.push({
      wordIndex: wIndex,
      wordText: rawWord,
      phoneticTranscription: pTranscription,
      occurrences
    });
  }

  // Construct dynamic technical summary statement
  let ruleCount = 0;
  const activatedCategories = new Set<string>();
  wordsAnalysis.forEach(w => {
    ruleCount += w.occurrences.length;
    w.occurrences.forEach(o => activatedCategories.add(o.ruleName));
  });

  const summary = `Detected ${wordsAnalysis.length} speech tokens. Mapped ${ruleCount} dynamic Tajweed rules successfully. Select words below for interactive oral alignment of mouth position, duration count, and active lung airflow.`;

  return {
    verseText: text,
    qiraat,
    words: wordsAnalysis,
    summaryFeedback: summary
  };
}
