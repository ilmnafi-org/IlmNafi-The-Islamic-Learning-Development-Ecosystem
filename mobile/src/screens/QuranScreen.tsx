import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';

const SURAHS = [
  { id: 1, name: "Al-Fatihah", ar: "الفاتحة", verses: 7 },
  { id: 2, name: "Al-Baqarah", ar: "البقرة", verses: 286 },
  { id: 3, name: "Al Imran", ar: "آل عمران", verses: 200 },
  { id: 18, name: "Al-Kahf", ar: "الكهف", verses: 110 },
  { id: 36, name: "Ya-Sin", ar: "يس", verses: 83 },
  { id: 55, name: "Ar-Rahman", ar: "الرحمن", verses: 78 },
  { id: 67, name: "Al-Mulk", ar: "الملك", verses: 30 },
];

export default function QuranScreen() {
  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlay = (id: number) => {
    if (activeSurah === id && isPlaying) {
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setActiveSurah(id);
      setIsPlaying(false);
      // Simulate loading audio
      setTimeout(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }, 1000);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="p-6 pb-2">
        <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
          Holy Quran
        </Text>
        <Text className="text-sm text-slate-500 text-center mb-6">
          Listen and read the Book of Allah
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {SURAHS.map((surah) => (
          <View 
            key={surah.id}
            className={`bg-white p-4 rounded-2xl mb-3 shadow-sm border ${activeSurah === surah.id ? 'border-emerald-500' : 'border-slate-100'} flex-row items-center justify-between`}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-4">
                <Text className="text-emerald-700 font-bold">{surah.id}</Text>
              </View>
              <View>
                <Text className="text-slate-800 font-bold text-lg">{surah.name}</Text>
                <Text className="text-slate-500 text-xs">{surah.verses} Verses</Text>
              </View>
            </View>
            
            <View className="flex-row items-center gap-4">
              <Text className="text-2xl font-arabic text-emerald-800">{surah.ar}</Text>
              
              <TouchableOpacity 
                className={`w-12 h-12 rounded-full items-center justify-center ${activeSurah === surah.id && isPlaying ? 'bg-amber-100' : 'bg-slate-100'}`}
                onPress={() => togglePlay(surah.id)}
              >
                {activeSurah === surah.id && isLoading ? (
                  <ActivityIndicator color="#059669" size="small" />
                ) : activeSurah === surah.id && isPlaying ? (
                  <Text className="text-amber-600 text-xl font-bold">||</Text>
                ) : (
                  <Text className="text-emerald-600 text-xl font-bold">▶</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Player (mock) */}
      {activeSurah && (
        <View className="absolute bottom-6 left-4 right-4 bg-slate-900 rounded-3xl p-4 shadow-2xl flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-slate-800 rounded-xl items-center justify-center mr-4">
              <Text className="text-2xl">📖</Text>
            </View>
            <View>
              <Text className="text-white font-bold">
                {SURAHS.find(s => s.id === activeSurah)?.name}
              </Text>
              <Text className="text-slate-400 text-xs">
                Mishary Rashid Alafasy
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            className="w-12 h-12 bg-emerald-500 rounded-full items-center justify-center"
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Text className="text-white text-lg font-bold">||</Text>
            ) : (
              <Text className="text-white text-lg ml-1 font-bold">▶</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
