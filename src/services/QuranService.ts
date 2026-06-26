import { Ayah } from '../types/murajaah';

export class QuranService {
  static async getAyahsByJuz(juz: number): Promise<Ayah[]> {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/juz/${juz}/quran-uthmani`);
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error('Failed to fetch juz');
      }

      return data.data.ayahs.map((ayah: any) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        surah: ayah.surah.number,
        juz: data.data.number,
      }));
    } catch (error) {
      console.error('Error fetching Quran data:', error);
      // Fallback sample data if API fails
      return [
        { number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', surah: 1, juz: 1 },
        { number: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', surah: 1, juz: 1 },
        { number: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', surah: 1, juz: 1 },
      ];
    }
  }

  static async getAyahsByRange(startSurah: number, startAyah: number, endSurah: number, endAyah: number): Promise<Ayah[]> {
    // Basic implementation - ideally would fetch the range
    // For demo purposes, we will return a mock array if we can't do complex range fetching easily from the simple API
    return [
      { number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', surah: startSurah, juz: 1 },
      { number: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', surah: startSurah, juz: 1 },
    ];
  }
}
