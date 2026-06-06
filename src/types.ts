/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  content: string; // Markdown article content
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

export interface Subject {
  id: string;
  name: string;
  arabicName?: string;
  icon: string; // Lucide icon name
  gradeRange: string;
  description: string;
  lessons: Lesson[];
}

export interface QuranVerse {
  surah: string;
  ayah: number;
  textArabic: string;
  translation: string;
  transliteration?: string;
}

export interface TajweedFeedback {
  verseId: string;
  overallScore: number; // 0-100
  fluencyScore: number; // 0-100
  pronunciationScore: number; // 0-100
  feedbackText: string;
  notes: {
    text: string;
    type: 'success' | 'warning' | 'info';
    word?: string; // The word in Arabic that this feedback points to
  }[];
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  country: string;
  coverage: 'Fully Funded' | 'Partially Funded' | 'Tuition Waiver' | 'Stipend';
  level: ('Undergraduate' | 'Postgraduate' | 'Research Grants')[];
  stipendAmount?: string;
  deadline: string;
  eligibility: string[];
  description: string;
  websiteUrl: string;
}

export interface UserProgress {
  weeklyMinutes: number;
  lessonsCompleted: string[]; // lessonIds
  savedScholarships: string[]; // scholarshipIds
  recentRecitations: {
    date: string;
    verse: string;
    score: number;
  }[];
  username?: string;
  email?: string;
}
