import { AlignmentResult } from './QuranAlignment';
import { MistakeType } from '../types/murajaah';

export class MistakeClassifier {
  static classify(alignment: AlignmentResult): MistakeType | null {
    if (alignment.completion < 40 && alignment.wrongWords.length > 0) return MistakeType.WrongAyah;
    if (alignment.skippedWords.length >= 3) return MistakeType.SkippedAyah;
    if (alignment.skippedWords.length > 0) return MistakeType.SkippedWord;
    if (alignment.wrongWords.length > 0) return MistakeType.WrongWord;
    if (alignment.insertedWords.length > 0) return MistakeType.ExtraWord;
    return null; // no major mistake
  }
}
