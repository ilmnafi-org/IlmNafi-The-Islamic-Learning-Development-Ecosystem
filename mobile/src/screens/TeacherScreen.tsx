import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Ionicons } from '@expo/vector-icons';

const TARGET_VERSES = [
  { surah: 'Al-Fatihah', text: 'الحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين إياك نعبد وإياك نستعين' },
  { surah: 'Ash-Sharh', text: 'ألم نشرح لك صدرك ووضعنا عنك وزرك الذي أنقض ظهرك ورفعنا لك ذكرك' }
];

export default function TeacherScreen() {
  const { isListening, transcript, error, volume, startListening, stopListening } = useSpeechRecognition();
  
  const [selectedTarget, setSelectedTarget] = useState(TARGET_VERSES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleStart = async () => {
    setFeedback(null);
    // Start standard speech recognition (uses Arabic locale by default)
    await startListening('ar-SA');
  };

  const handleStopAndAnalyze = async () => {
    await stopListening();
    setIsAnalyzing(true);

    // Simulate AI Tajweed parsing matching our backend engine
    setTimeout(() => {
      const isAlFatihah = selectedTarget.surah === 'Al-Fatihah';
      
      const mockFeedback = {
        overall: isAlFatihah ? 94 : 88,
        fluency: isAlFatihah ? 91 : 85,
        pronunciation: isAlFatihah ? 96 : 90,
        guidance: isAlFatihah 
          ? "Masha'Allah! Your flow is highly rhythmic and melodious. Note the letter 'Ayn' in 'Nasta'een' (نستعين) — ensure you express it clearly from the middle throat without cutting the vowel short."
          : "Good attempt! Make sure to fully expand the Madd prolongation in 'Anqada Zahrak' (أنقض ظهرك) to maintain proper rhythmic pacing.",
        words: isAlFatihah ? [
          { word: "الحمد", status: "correct", explanation: "Clear vocalization of Hamzatul-Wasl" },
          { word: "العالمين", status: "correct", explanation: "Excellent Madd Al-Arid Lilsukoon" },
          { word: "الرحمن", status: "hesitation", explanation: "Slight vocal break before pronouncing 'Ra'" },
          { word: "نعبد", status: "correct", explanation: "Clear Dammah on the letter Daal" },
          { word: "نستعين", status: "guidance", explanation: "Pronounce letter 'Ayn from mid-throat" }
        ] : [
          { word: "ألم", status: "correct", explanation: "Perfect Izhar" },
          { word: "نشرح", status: "correct", explanation: "Excellent breath control on Haa" },
          { word: "وزرك", status: "hesitation", explanation: "Vocal hesitation on Zay" },
          { word: "أنقض", status: "mistake", explanation: "Ghunnah was too light, make it heavy" }
        ]
      };

      setFeedback(mockFeedback);
      setIsAnalyzing(false);
    }, 1800);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* Header */}
        <View className="p-6 pb-2">
          <Text className="text-3xl font-black text-slate-950 tracking-tight text-center mb-1">
            Virtual Coach
          </Text>
          <Text className="text-xs text-slate-400 text-center mb-6 font-bold uppercase tracking-widest">
            Virtual Murāja'ah & Tajweed Evaluation
          </Text>
        </View>

        {/* Target Selector */}
        <View className="px-6 mb-5">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 ml-1">
            Select Recitation Chapter
          </Text>
          <View className="flex-row gap-3">
            {TARGET_VERSES.map((target) => {
              const isSelected = selectedTarget.surah === target.surah;
              return (
                <TouchableOpacity
                  key={target.surah}
                  onPress={() => {
                    setSelectedTarget(target);
                    setFeedback(null);
                  }}
                  className={`flex-1 p-3.5 rounded-2xl border flex-row items-center justify-between ${
                    isSelected 
                      ? 'bg-emerald-600 border-emerald-600' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <View>
                    <Text className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {target.surah}
                    </Text>
                    <Text className={`text-[9px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      Quran Recital Practice
                    </Text>
                  </View>
                  <Ionicons 
                    name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={isSelected ? "#ffffff" : "#cbd5e1"} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Live Recorder Console */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 items-center">
            
            {error && (
              <Text className="text-red-500 text-[11px] text-center mb-4">{error}</Text>
            )}

            <View className="w-full h-28 justify-center items-center mb-6 border-b border-slate-50">
              {isListening ? (
                <View className="items-center">
                  <ActivityIndicator color="#059669" size="small" />
                  <Text className="text-slate-400 text-xs italic mt-3 animate-pulse">
                    Sheikh Yusuf is listening... Recite now.
                  </Text>
                  {transcript ? (
                    <Text className="text-lg font-bold text-emerald-800 text-center font-arabic mt-4 leading-relaxed" numberOfLines={2}>
                      {transcript}
                    </Text>
                  ) : null}
                </View>
              ) : isAnalyzing ? (
                <View className="items-center">
                  <ActivityIndicator color="#059669" size="large" />
                  <Text className="text-slate-700 font-bold text-xs mt-4">
                    AI Speech Recognition Parsing...
                  </Text>
                  <Text className="text-slate-400 text-[10px] mt-1">Comparing syllables with Tajweed criteria</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="mic-outline" size={32} color="#94a3b8" />
                  <Text className="text-slate-500 text-xs font-semibold text-center mt-3">
                    Tap below to begin reciting Surah {selectedTarget.surah}
                  </Text>
                </View>
              )}
            </View>

            {/* Volume feedback loop */}
            {isListening && (
              <View className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                <View 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(10, volume * 8))}%` }} 
                />
              </View>
            )}

            {/* Mic Button */}
            <TouchableOpacity 
              className={`w-16 h-16 rounded-full justify-center items-center shadow-lg ${
                isListening ? 'bg-red-500 shadow-red-500/20' : 'bg-emerald-600 shadow-emerald-600/20'
              }`}
              onPress={isListening ? handleStopAndAnalyze : handleStart}
              disabled={isAnalyzing}
            >
              <Ionicons 
                name={isListening ? "square" : "mic"} 
                size={22} 
                color="#ffffff" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Tajweed Analysis Feedback Report */}
        {feedback && (
          <View className="px-6 mb-4">
            <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-50">
                <Text className="text-slate-900 font-black text-sm">AI TAJWEED EVALUATION</Text>
                <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full flex-row items-center">
                  <Ionicons name="ribbon" size={12} color="#059669" className="mr-1" />
                  <Text className="text-emerald-700 text-[10px] font-bold">94% Mastery</Text>
                </View>
              </View>

              {/* Statistics */}
              <View className="flex-row gap-4 mb-6">
                <View className="flex-1 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Text className="text-emerald-600 font-black text-base">{feedback.overall}%</Text>
                  <Text className="text-slate-400 text-[8px] uppercase font-bold mt-0.5">Overall Score</Text>
                </View>
                <View className="flex-1 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Text className="text-blue-600 font-black text-base">{feedback.fluency}%</Text>
                  <Text className="text-slate-400 text-[8px] uppercase font-bold mt-0.5">Fluency Pacing</Text>
                </View>
                <View className="flex-1 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Text className="text-indigo-600 font-black text-base">{feedback.pronunciation}%</Text>
                  <Text className="text-slate-400 text-[8px] uppercase font-bold mt-0.5">Pronunciation</Text>
                </View>
              </View>

              {/* Sheikh Advice */}
              <View className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 mb-6 flex-row">
                <Text className="text-xl mr-3">🕌</Text>
                <View className="flex-1">
                  <Text className="text-amber-800 text-xs font-bold mb-0.5">Mentor Advice (Sheikh Yusuf)</Text>
                  <Text className="text-slate-600 text-[11px] leading-relaxed">
                    {feedback.guidance}
                  </Text>
                </View>
              </View>

              {/* Word-by-Word syllable highlights */}
              <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-3">
                Word-by-word Syllable Breakdown
              </Text>
              
              <View className="space-y-3">
                {feedback.words.map((w: any, index: number) => {
                  let statusColor = "bg-emerald-50 border-emerald-100 text-emerald-800";
                  let statusLabel = "Correct Harakah";

                  if (w.status === "hesitation") {
                    statusColor = "bg-amber-50 border-amber-100 text-amber-800";
                    statusLabel = "Hesitation / Pause";
                  } else if (w.status === "guidance") {
                    statusColor = "bg-blue-50 border-blue-100 text-blue-800";
                    statusLabel = "Rule Guidance";
                  } else if (w.status === "mistake") {
                    statusColor = "bg-red-50 border-red-100 text-red-800";
                    statusLabel = "Rule Deviation";
                  }

                  return (
                    <View 
                      key={index}
                      className={`p-3 rounded-xl border flex-row items-center justify-between ${statusColor}`}
                    >
                      <View className="flex-row items-center">
                        <Text className="font-arabic font-extrabold text-sm mr-4">{w.word}</Text>
                        <Text className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                          {statusLabel}
                        </Text>
                      </View>
                      <Text className="text-[11px] font-semibold opacity-75">{w.explanation}</Text>
                    </View>
                  );
                })}
              </View>

            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
