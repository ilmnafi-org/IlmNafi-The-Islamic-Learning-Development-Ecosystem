export class ReviewPlanner {
  static computePriorities(ayahScores: Record<number, number>): number[] {
    return Object.entries(ayahScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA) // Sort descending
      .filter(([, score]) => score > 0)
      .map(([ayahNum]) => Number(ayahNum));
  }
}
