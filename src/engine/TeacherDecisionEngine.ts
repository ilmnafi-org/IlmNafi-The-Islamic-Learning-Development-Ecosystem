import { MistakeType } from '../types/murajaah';

export enum TeacherAction {
  Advance,
  Repeat,
  RepeatAgain,
  RepeatFromStart,
  Correct,
  Encourage,
  GoBack,
  Finish,
  PromptContinue
}

export interface DecisionContext {
  mistakeType: MistakeType | null;
  completion: number;
  attempts: number;
  isPerfectStreak: boolean;
  isGoBackTriggered: boolean;
  isEndOfSession: boolean;
  isTestingGoBack: boolean;
}

export class TeacherDecisionEngine {
  static decideNextAction(context: DecisionContext): TeacherAction {
    if (context.mistakeType) {
      if (context.attempts === 1) return TeacherAction.Repeat;
      if (context.attempts === 2) return TeacherAction.RepeatAgain;
      if (context.attempts === 3) return TeacherAction.RepeatFromStart;
      return TeacherAction.Correct;
    }

    if (context.completion > 75) {
      if (context.isEndOfSession) return TeacherAction.Finish;
      if (context.isGoBackTriggered && !context.isTestingGoBack) return TeacherAction.GoBack;
      if (context.isPerfectStreak) return TeacherAction.Encourage;
      return TeacherAction.Advance;
    }

    // Default catch-all
    return TeacherAction.PromptContinue;
  }
}
