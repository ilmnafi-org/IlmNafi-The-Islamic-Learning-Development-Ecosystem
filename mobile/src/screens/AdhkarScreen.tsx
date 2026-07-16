import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Core Adhkar contents
const MORNING_ADHKAR = [
  { id: 'm1', textAr: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', name: 'Ayat al-Kursi', translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence...', countGoal: 1, currentCount: 0 },
  { id: 'm2', textAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ', name: 'Surah Al-Ikhlas', translation: 'Say, "He is Allah, [who is] One..."', countGoal: 3, currentCount: 0 },
  { id: 'm3', textAr: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', name: 'Morning Declaration', translation: 'We have entered the morning and at this very time the whole kingdom belongs to Allah...', countGoal: 1, currentCount: 0 },
  { id: 'm4', textAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', name: 'SubhanAllahi wa Bihamdihi', translation: 'Glory be to Allah and His is the praise (100 times)', countGoal: 100, currentCount: 0 }
];

const EVENING_ADHKAR = [
  { id: 'e1', textAr: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', name: 'Ayat al-Kursi', translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence...', countGoal: 1, currentCount: 0 },
  { id: 'e2', textAr: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', name: 'Evening Declaration', translation: 'We have entered the evening and at this very time the whole kingdom belongs to Allah...', countGoal: 1, currentCount: 0 },
  { id: 'e3', textAr: 'بِاسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ', name: 'Protection Supplication', translation: 'In the Name of Allah with Whose name nothing is harmed on earth nor in heaven...', countGoal: 3, currentCount: 0 }
];

export default function AdhkarScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'tasbih'>('morning');
  const [morningList, setMorningList] = useState(MORNING_ADHKAR);
  const [eveningList, setEveningList] = useState(EVENING_ADHKAR);
  
  // Tasbih counter states
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihLimit, setTasbihLimit] = useState(33);
  const [tasbihPhrase, setTasbihPhrase] = useState('SubhanAllah (سُبْحَانَ اللَّهِ)');

  const incrementAdhkar = (id: string, isMorning: boolean) => {
    if (isMorning) {
      setMorningList(prev => prev.map(item => {
        if (item.id === id && item.currentCount < item.countGoal) {
          return { ...item, currentCount: item.currentCount + 1 };
        }
        return item;
      }));
    } else {
      setEveningList(prev => prev.map(item => {
        if (item.id === id && item.currentCount < item.countGoal) {
          return { ...item, currentCount: item.currentCount + 1 };
        }
        return item;
      }));
    }
  };

  const handleTasbihPress = () => {
    setTasbihCount(prev => {
      const next = prev + 1;
      if (next >= tasbihLimit) {
        // Simple visual loop or alert
        return 0;
      }
      return next;
    });
  };

  const resetTasbih = () => {
    setTasbihCount(0);
  };

  const toggleTasbihPhrase = () => {
    if (tasbihPhrase.startsWith('SubhanAllah')) {
      setTasbihPhrase('Alhamdulillah (الْحَمْدُ لِلَّهِ)');
      setTasbihCount(0);
    } else if (tasbihPhrase.startsWith('Alhamdulillah')) {
      setTasbihPhrase('Allahu Akbar (اللَّهُ أَكْبَرُ)');
      setTasbihCount(0);
    } else {
      setTasbihPhrase('SubhanAllah (سُبْحَانَ اللَّهِ)');
      setTasbihCount(0);
    }
  };

  // Calculations for progress
  const listToUse = activeTab === 'morning' ? morningList : eveningList;
  const totalCompleted = listToUse.filter(item => item.currentCount === item.countGoal).length;
  const progressPercent = listToUse.length > 0 ? (totalCompleted / listToUse.length) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="p-6 pb-2 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.navigate('Home')} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Daily Dhikr</Text>
        <View className="w-8" />
      </View>

      {/* Segmented Tab Controls */}
      <View className="px-6 mb-5">
        <View className="flex-row bg-white border border-slate-200/80 rounded-2xl p-1 shadow-sm">
          <TouchableOpacity 
            onPress={() => setActiveTab('morning')}
            className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'morning' ? 'bg-emerald-600 shadow-sm' : ''}`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'morning' ? 'text-white' : 'text-slate-500'}`}>
              Morning
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('evening')}
            className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'evening' ? 'bg-emerald-600 shadow-sm' : ''}`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'evening' ? 'text-white' : 'text-slate-500'}`}>
              Evening
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('tasbih')}
            className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'tasbih' ? 'bg-emerald-600 shadow-sm' : ''}`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'tasbih' ? 'text-white' : 'text-slate-500'}`}>
              Counter
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab !== 'tasbih' ? (
        // Checklist Reciter Mode
        <View className="flex-1 px-6">
          {/* Progress Widget */}
          <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-5">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-slate-700 font-bold text-xs">Supplication Progress</Text>
              <Text className="text-emerald-700 font-extrabold text-xs">
                {totalCompleted} / {listToUse.length} Completed
              </Text>
            </View>
            <View className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <View 
                className="h-full bg-emerald-600 rounded-full" 
                style={{ width: `${progressPercent}%` }} 
              />
            </View>
          </View>

          {/* Supplications Scroll */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {listToUse.map((item) => {
              const isDone = item.currentCount === item.countGoal;
              return (
                <View 
                  key={item.id}
                  className={`p-5 rounded-2xl bg-white border mb-4 shadow-sm relative ${
                    isDone ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100'
                  }`}
                >
                  <Text className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider mb-2">
                    {item.name}
                  </Text>
                  
                  <Text className="text-right text-emerald-950 font-arabic text-xl leading-loose mb-3">
                    {item.textAr}
                  </Text>
                  
                  <Text className="text-slate-500 text-xs leading-relaxed mb-4">
                    {item.translation}
                  </Text>

                  {/* Counter Action */}
                  <View className="flex-row justify-between items-center border-t border-slate-100 pt-3">
                    <Text className="text-slate-400 text-xs font-semibold">
                      Goal: {item.countGoal}x
                    </Text>

                    <TouchableOpacity
                      onPress={() => incrementAdhkar(item.id, activeTab === 'morning')}
                      disabled={isDone}
                      className={`px-5 py-2 rounded-xl flex-row items-center ${
                        isDone ? 'bg-emerald-100' : 'bg-slate-900'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <Ionicons name="checkmark-circle" size={14} color="#059669" className="mr-1.5" />
                          <Text className="text-emerald-700 font-bold text-xs ml-1">Completed</Text>
                        </>
                      ) : (
                        <Text className="text-white font-bold text-xs">
                          Recite ({item.currentCount}/{item.countGoal})
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        // Interactive Tasbih/Subhah engine
        <View className="flex-1 px-6 justify-center items-center">
          
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 w-full items-center mb-6">
            
            {/* Phrase Switcher */}
            <TouchableOpacity 
              onPress={toggleTasbihPhrase}
              className="bg-emerald-50 px-4 py-2 rounded-full mb-8 flex-row items-center"
            >
              <Text className="text-emerald-800 text-xs font-bold mr-1.5">{tasbihPhrase}</Text>
              <Ionicons name="swap-horizontal" size={12} color="#065f46" />
            </TouchableOpacity>

            {/* Display Counter */}
            <Text className="text-slate-400 font-extrabold text-xs uppercase tracking-widest mb-1">
              SESSION COUNT
            </Text>
            <Text className="text-6xl font-black text-slate-900 mb-2">
              {tasbihCount}
            </Text>
            <Text className="text-slate-400 text-xs font-semibold mb-8">
              Target Cycle: {tasbihLimit}
            </Text>

            {/* Goal selector */}
            <View className="flex-row gap-2 mb-8">
              {[33, 99, 100].map((limit) => (
                <TouchableOpacity
                  key={limit}
                  onPress={() => { setTasbihLimit(limit); setTasbihCount(0); }}
                  className={`px-3 py-1.5 rounded-lg border ${
                    tasbihLimit === limit 
                      ? 'bg-slate-900 border-slate-900' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${
                    tasbihLimit === limit ? 'text-white' : 'text-slate-500'
                  }`}>
                    {limit} Cycles
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Big Clicker Button */}
            <TouchableOpacity
              onPress={handleTasbihPress}
              activeOpacity={0.8}
              className="w-40 h-40 bg-emerald-600 rounded-full border-4 border-emerald-500 items-center justify-center shadow-xl shadow-emerald-600/30 mb-6"
            >
              <Text className="text-white text-3xl font-bold">TAP</Text>
            </TouchableOpacity>

            {/* Reset Button */}
            <TouchableOpacity 
              onPress={resetTasbih}
              className="flex-row items-center py-2"
            >
              <Ionicons name="refresh-outline" size={14} color="#64748b" className="mr-1" />
              <Text className="text-slate-500 text-xs font-semibold ml-1">Reset Session</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
