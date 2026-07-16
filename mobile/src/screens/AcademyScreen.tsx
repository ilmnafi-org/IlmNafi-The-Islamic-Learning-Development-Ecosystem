import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Hardcoded core academy syllabus matching the web experience
const SUBJECTS = [
  {
    id: 's1',
    name: 'Tajweed Rules',
    arabicName: 'قواعد التجويد',
    icon: 'mic-circle-outline',
    lessons: [
      {
        id: 'l1',
        title: 'Introduction to Nun Sakinah & Tanween',
        summary: 'Learn the primary foundation of vowel-less Nun and double vowel endings.',
        content: `Tajweed (تجويد) literally means to make well, beautify, or perfect. It refers to the rules governing pronunciation during Qur’anic recitation.

The Nun Sakinah (نْ) is a Nun with no harakah (vowel), and Tanween (ً  ٍ  ٌ) is a double vowel that produces a Nun sound.

There are four core rules for pronouncing Nun Sakinah and Tanween:
1. **Izhar (إظهار)** - Clear pronunciation.
2. **Idghaam (إدغام)** - Merging into the next letter.
3. **Iqlab (إقلاب)** - Changing the sound into a 'Meem'.
4. **Ikhfa (إخفاء)** - Hiding or concealing the Nun sound.`,
        quiz: [
          {
            question: 'How many letters cause Izhar (clear pronunciation)?',
            options: ['4 Letters', '6 Throat Letters', '8 Letters', '15 Letters'],
            answerIndex: 1,
            explanation: 'Izhar occurs when the Nun Sakinah is followed by one of the six throat letters: Hamzah (أ), Haa (هـ), ‘Ayn (ع), Haa (ح), Ghayn (غ), and Khaa (خ).'
          },
          {
            question: 'What does Iqlab literally mean?',
            options: ['To merge', 'To hide', 'To convert/flip', 'To clarify'],
            answerIndex: 2,
            explanation: 'Iqlab means to convert or flip. It turns the Nun Sakinah or Tanween sound into a Meem when followed by the letter Baa (ب).'
          }
        ]
      },
      {
        id: 'l2',
        title: 'Madd Rules (Prolongation)',
        summary: 'The science of stretching vowels to enhance beautiful flow.',
        content: `Madd (مد) means lengthening or prolongation.

The letters of Madd are three:
1. **Alif (أ)** preceded by a Fathah.
2. **Waw (و)** preceded by a Dhammah.
3. **Yaa (ي)** preceded by a Kasrah.

Primary types of Madd:
- **Madd Al-Tabee\'ee (Natural Prolongation)**: Lengthened for 2 counts.
- **Madd Al-Wajib Al-Muttasil (Obligatory Connected)**: 4 to 5 counts when a Hamzah follows a Madd letter in the same word.
- **Madd Al-Ja\'iz Al-Munfasil (Permissible Disconnected)**: 4 to 5 counts when a Hamzah follows in the next word.`,
        quiz: [
          {
            question: 'What is the standard duration for Madd Al-Tabee\'ee?',
            options: ['1 count', '2 counts', '4 counts', '6 counts'],
            answerIndex: 1,
            explanation: 'Madd Al-Tabee\'ee is the natural prolongation and is strictly lengthened for 2 harakah (counts).'
          }
        ]
      }
    ]
  },
  {
    id: 's2',
    name: 'Tafseer Al-Quran',
    arabicName: 'تفسير القرآن',
    icon: 'compass-outline',
    lessons: [
      {
        id: 'l3',
        title: 'Tafseer of Surah Al-Fatihah',
        summary: 'Deep dive into the Seven Oft-Repeated Verses and the Mother of the Book.',
        content: `Surah Al-Fatihah (The Opening) is the greatest Surah in the Quran. It is recited in every unit of prayer (Rakah).

Key names of Al-Fatihah:
- **Umm al-Kitab** (Mother of the Book)
- **As-Sab\'ul-Mathani** (The Seven Oft-Repeated Verses)
- **Ash-Shifa** (The Cure)

Its verse "You alone we worship and You alone we ask for help" is the perfect summary of Islamic Monotheism (Tawheed). It outlines the relationship between the Creator and the slave, combining praise, dedication, and supplication.`,
        quiz: [
          {
            question: 'Which of the following is NOT a name of Surah Al-Fatihah?',
            options: ['Umm al-Kitab', 'Ash-Shifa', 'Al-Mulk', 'As-Sab\'ul-Mathani'],
            answerIndex: 2,
            explanation: 'Al-Mulk (The Sovereignty) is a separate Surah (Chapter 67) and not an alias for Al-Fatihah.'
          }
        ]
      }
    ]
  }
];

export default function AcademyScreen() {
  const { user, updateStreak } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  // Certificate popup state
  const [showCertificate, setShowCertificate] = useState(false);

  const startLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setQuizMode(false);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    const isCorrect = selectedOption === selectedLesson.quiz[currentQuestionIdx].answerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    
    if (currentQuestionIdx + 1 < selectedLesson.quiz.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // If scored 100%, reward a certificate!
      const finalScore = score + (selectedOption === selectedLesson.quiz[currentQuestionIdx].answerIndex ? 1 : 0);
      if (finalScore === selectedLesson.quiz.length) {
        setShowCertificate(true);
        // Boost user streak and XP via mock action
        if (user) {
          updateStreak(user.streak + 1);
        }
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* Header */}
        <View className="p-6">
          <Text className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Knowledge Academy
          </Text>
          <Text className="text-slate-500 mt-1 text-sm">
            Master Quranic sciences, Tajweed rules, and Tafseer step-by-step.
          </Text>
        </View>

        {/* Subjects Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-6 mb-6 flex-row"
          contentContainerStyle={{ gap: 12 }}
        >
          {SUBJECTS.map((sub) => {
            const isActive = activeSubject.id === sub.id;
            return (
              <TouchableOpacity
                key={sub.id}
                onPress={() => setActiveSubject(sub)}
                className={`px-5 py-3 rounded-full flex-row items-center border ${
                  isActive 
                    ? 'bg-emerald-600 border-emerald-600' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <Ionicons 
                  name={sub.icon as any} 
                  size={18} 
                  color={isActive ? '#ffffff' : '#64748b'} 
                  className="mr-2" 
                />
                <View className="ml-1.5">
                  <Text className={`font-bold text-xs ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {sub.name}
                  </Text>
                  <Text className={`text-[9px] mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {sub.arabicName}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Lessons List */}
        <View className="px-6">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Syllabus Core Courses
          </Text>
          
          <View className="space-y-4">
            {activeSubject.lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => startLesson(lesson)}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-row items-center justify-between"
                activeOpacity={0.7}
              >
                <View className="flex-1 pr-4">
                  <Text className="text-emerald-600 text-xs font-bold mb-1">
                    COURSE LESSON
                  </Text>
                  <Text className="text-slate-800 font-extrabold text-base mb-1.5">
                    {lesson.title}
                  </Text>
                  <Text className="text-slate-500 text-xs leading-relaxed" numberOfLines={2}>
                    {lesson.summary}
                  </Text>
                </View>
                <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center">
                  <Ionicons name="arrow-forward" size={18} color="#059669" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Lesson Reader Modal */}
      {selectedLesson && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={selectedLesson !== null}
          onRequestClose={() => setSelectedLesson(null)}
        >
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
              <TouchableOpacity onPress={() => setSelectedLesson(null)} className="p-1">
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {activeSubject.name}
              </Text>
              <View className="w-8" />
            </View>

            {!quizMode ? (
              // Immersive Lesson Reader
              <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className="text-emerald-600 text-xs font-bold tracking-widest mb-1">
                  MODULE TEXTBOOK
                </Text>
                <Text className="text-2xl font-extrabold text-slate-900 mb-4">
                  {selectedLesson.title}
                </Text>
                
                <View className="w-full h-px bg-slate-100 mb-6" />

                <Text className="text-slate-700 text-sm leading-relaxed mb-8 font-sans">
                  {selectedLesson.content}
                </Text>

                {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setQuizMode(true)}
                    className="w-full bg-emerald-600 py-4 rounded-xl items-center flex-row justify-center shadow-md shadow-emerald-600/10"
                  >
                    <Ionicons name="help-circle-outline" size={20} color="#ffffff" className="mr-2" />
                    <Text className="text-white font-bold text-sm ml-2">Take Practice Quiz</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            ) : (
              // Quiz Mode Interactive Console
              <View className="flex-1 p-6 justify-between">
                {!quizFinished ? (
                  <View className="flex-1">
                    {/* Header Progress */}
                    <View className="flex-row justify-between items-center mb-6">
                      <Text className="text-slate-400 text-xs font-bold">
                        Question {currentQuestionIdx + 1} of {selectedLesson.quiz.length}
                      </Text>
                      <View className="bg-emerald-50 px-2.5 py-1 rounded-full">
                        <Text className="text-emerald-700 text-[10px] font-bold">
                          Score: {score} / {selectedLesson.quiz.length}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="w-full h-1 bg-slate-100 rounded-full mb-6">
                      <View 
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${((currentQuestionIdx + 1) / selectedLesson.quiz.length) * 100}%` }}
                      />
                    </View>

                    {/* Question Text */}
                    <Text className="text-lg font-bold text-slate-950 mb-6">
                      {selectedLesson.quiz[currentQuestionIdx].question}
                    </Text>

                    {/* Options */}
                    <View className="space-y-3">
                      {selectedLesson.quiz[currentQuestionIdx].options.map((opt: string, idx: number) => {
                        const isSelected = selectedOption === idx;
                        const isCorrectAnswer = idx === selectedLesson.quiz[currentQuestionIdx].answerIndex;
                        
                        let cardStyle = "border-slate-200 bg-white";
                        let textStyle = "text-slate-800";
                        let checkIcon = null;

                        if (isAnswerChecked) {
                          if (isSelected) {
                            if (isCorrectAnswer) {
                              cardStyle = "border-emerald-500 bg-emerald-50";
                              textStyle = "text-emerald-800 font-bold";
                              checkIcon = <Ionicons name="checkmark-circle" size={18} color="#10b981" />;
                            } else {
                              cardStyle = "border-red-400 bg-red-50";
                              textStyle = "text-red-800 font-bold";
                              checkIcon = <Ionicons name="close-circle" size={18} color="#ef4444" />;
                            }
                          } else if (isCorrectAnswer) {
                            cardStyle = "border-emerald-200 bg-emerald-50/50";
                          }
                        } else if (isSelected) {
                          cardStyle = "border-emerald-600 bg-emerald-50/20";
                          textStyle = "text-emerald-700 font-bold";
                        }

                        return (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => handleOptionSelect(idx)}
                            className={`p-4 rounded-xl border flex-row items-center justify-between mb-3 ${cardStyle}`}
                            disabled={isAnswerChecked}
                          >
                            <Text className={`text-sm flex-1 ${textStyle}`}>
                              {opt}
                            </Text>
                            {checkIcon}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Explanation */}
                    {isAnswerChecked && (
                      <View className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <Text className="text-slate-700 text-xs font-semibold mb-1">
                          EXPLANATION
                        </Text>
                        <Text className="text-slate-500 text-xs leading-relaxed">
                          {selectedLesson.quiz[currentQuestionIdx].explanation}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  // Quiz Complete Screen
                  <View className="flex-1 justify-center items-center px-4">
                    <View className="w-16 h-16 bg-emerald-100 rounded-full items-center justify-center mb-6">
                      <Ionicons name="trophy" size={32} color="#059669" />
                    </View>
                    <Text className="text-2xl font-extrabold text-slate-950 text-center mb-2">
                      Quiz Completed!
                    </Text>
                    <Text className="text-slate-500 text-center text-sm mb-6 leading-relaxed">
                      You scored {score} out of {selectedLesson.quiz.length} correctly. 
                      {score === selectedLesson.quiz.length 
                        ? ' Mashallah! You have mastered this chapter perfectly.' 
                        : ' Retake the module to aim for a perfect score and receive your cert.'}
                    </Text>

                    <View className="bg-slate-50 p-4 rounded-2xl w-full border border-slate-100 mb-8 items-center">
                      <Text className="text-xs text-slate-400 font-bold mb-1">SCORE REPORT</Text>
                      <Text className="text-3xl font-extrabold text-emerald-600">
                        {Math.round((score / selectedLesson.quiz.length) * 100)}%
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setQuizMode(false);
                        setSelectedLesson(null);
                      }}
                      className="w-full bg-slate-900 py-3.5 rounded-xl items-center"
                    >
                      <Text className="text-white font-bold text-sm">Return to Syllabus</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Question Action Button */}
                {!quizFinished && (
                  <View className="mt-4">
                    {!isAnswerChecked ? (
                      <TouchableOpacity
                        onPress={checkAnswer}
                        disabled={selectedOption === null}
                        className={`w-full py-3.5 rounded-xl items-center ${
                          selectedOption === null ? 'bg-slate-200' : 'bg-emerald-600'
                        }`}
                      >
                        <Text className="text-white font-bold text-sm">Check Answer</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={handleNextQuestion}
                        className="w-full bg-slate-900 py-3.5 rounded-xl items-center flex-row justify-center"
                      >
                        <Text className="text-white font-bold text-sm mr-2">
                          {currentQuestionIdx + 1 === selectedLesson.quiz.length ? 'Finish Quiz' : 'Next Question'}
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="#ffffff" className="ml-2" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}
          </SafeAreaView>
        </Modal>
      )}

      {/* Certificate Congratulations Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCertificate}
        onRequestClose={() => setShowCertificate(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <View className="bg-white p-6 rounded-3xl w-full max-w-sm items-center shadow-2xl relative border-4 border-amber-200">
            <View className="absolute top-[-30px] bg-amber-400 p-3 rounded-full border-4 border-white shadow-md">
              <Ionicons name="ribbon" size={32} color="#ffffff" />
            </View>
            
            <View className="mt-8 items-center">
              <Text className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
                CERTIFICATE OF COMPLETION
              </Text>
              <Text className="text-lg font-bold text-slate-800 text-center mb-4">
                Chapter Mastered!
              </Text>

              <View className="border-t border-b border-slate-100 py-4 px-2 w-full items-center mb-6">
                <Text className="text-xs text-slate-400">Awarded to:</Text>
                <Text className="text-base font-bold text-slate-800 mt-1">{user?.name || 'Sulayman Student'}</Text>
                <Text className="text-[10px] text-slate-400 mt-3 text-center">For successfully answering 100% correctly in:</Text>
                <Text className="text-xs font-bold text-emerald-700 mt-1 text-center">{selectedLesson?.title}</Text>
              </View>

              <Text className="text-slate-500 text-center text-xs mb-6 px-2">
                Your profile has been credited with an XP boost! Keep going to earn more certificates.
              </Text>

              <TouchableOpacity
                onPress={() => setShowCertificate(false)}
                className="bg-emerald-600 px-8 py-3 rounded-full shadow-md"
              >
                <Text className="text-white font-bold text-xs">JazakAllah Khair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
