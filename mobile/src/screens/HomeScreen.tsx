import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, useWindowDimensions, Share } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation: any;
  onNavigateTab: (screenName: string) => void;
}

export default function HomeScreen({ navigation, onNavigateTab }: HomeScreenProps) {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Join me on Ilm Nafi! Learn Quran, practice recitation with AI speech coaching, and access global Islamic scholarships. 📖✨',
      });
    } catch (e) {
      console.log('Error sharing:', e);
    }
  };

  const dailyTasks = [
    { text: 'Complete "Introduction to Nun Sakinah"', category: 'Academy', screen: 'Academy' },
    { text: 'Recite morning Adhkar checklist', category: 'Adhkar', screen: 'Adhkar' },
    { text: 'Practice 1 round of Virtual Murāja\'ah', category: 'Teacher', screen: 'Teacher' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* Top Minimal Navigation Bar */}
        <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-slate-100 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-emerald-600 rounded-lg items-center justify-center mr-2.5">
              <Ionicons name="book" size={16} color="#ffffff" />
            </View>
            <Text className="text-lg font-black text-slate-900 tracking-tight">Ilm Nafi</Text>
          </View>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={handleShareApp}
              className="p-1.5 bg-slate-50 border border-slate-100 rounded-full"
            >
              <Ionicons name="share-social-outline" size={18} color="#475569" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => onNavigateTab('Profile')}
              className="p-1.5 bg-slate-50 border border-slate-100 rounded-full"
            >
              <Ionicons name="person-circle-outline" size={18} color="#059669" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome / Authentication Card */}
        <View className="p-6">
          <View className="bg-slate-900 p-6 rounded-[32px] border border-slate-800 shadow-xl shadow-slate-900/10 relative overflow-hidden">
            <View className="absolute right-[-20] top-[-20] opacity-10">
              <Ionicons name="planet" size={140} color="#10b981" />
            </View>

            <View className="flex-row justify-between items-start z-10">
              <View className="flex-1">
                <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">
                  LEARNING COMPANION
                </Text>
                <Text className="text-white font-extrabold text-2xl tracking-tight mb-2">
                  Assalamu Alaikum,
                </Text>
                <Text className="text-emerald-50 font-black text-xl leading-snug">
                  {user ? user.name : 'Learner'}!
                </Text>
              </View>

              {user ? (
                <View className="bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30 flex-row items-center">
                  <Ionicons name="flame" size={14} color="#f97316" />
                  <Text className="text-orange-400 font-extrabold text-xs ml-1">{user.streak} Day Streak</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Auth')}
                  className="bg-emerald-600 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white text-xs font-bold">Sign In</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="mt-6 pt-6 border-t border-slate-800 flex-row justify-between items-center z-10">
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">TOTAL SCORE</Text>
                <Text className="text-emerald-400 font-extrabold text-base mt-0.5">{user ? user.xp : '340'} XP</Text>
              </View>
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">COMPLETED CHAPTERS</Text>
                <Text className="text-emerald-400 font-extrabold text-base mt-0.5">{user ? user.completedChapters : '4'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Core Quick Navigation Bento Deck */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
            Learning Pathways
          </Text>

          <View className={`flex-row flex-wrap gap-4 ${isTablet ? 'flex-row' : 'flex-col'}`}>
            
            {/* Virtual Murāja'ah */}
            <TouchableOpacity
              onPress={() => onNavigateTab('Teacher')}
              className="flex-1 min-w-[45%] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-row items-center gap-4"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-emerald-50 rounded-full items-center justify-center">
                <Ionicons name="mic" size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-extrabold text-sm">Virtual Murāja'ah</Text>
                <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">Recite with AI coaching</Text>
              </View>
            </TouchableOpacity>

            {/* Academy Syllabus */}
            <TouchableOpacity
              onPress={() => onNavigateTab('Academy')}
              className="flex-1 min-w-[45%] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-row items-center gap-4"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center">
                <Ionicons name="school" size={20} color="#4f46e5" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-extrabold text-sm">Academy Courses</Text>
                <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">Lessons & Quizzes</Text>
              </View>
            </TouchableOpacity>

            {/* Listen & Read */}
            <TouchableOpacity
              onPress={() => onNavigateTab('Quran')}
              className="flex-1 min-w-[45%] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-row items-center gap-4"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-amber-50 rounded-full items-center justify-center">
                <Ionicons name="book" size={20} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-extrabold text-sm">Read & Play Quran</Text>
                <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">High quality recitations</Text>
              </View>
            </TouchableOpacity>

            {/* Forum boards */}
            <TouchableOpacity
              onPress={() => onNavigateTab('Community')}
              className="flex-1 min-w-[45%] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-row items-center gap-4"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center">
                <Ionicons name="people" size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-extrabold text-sm">Community Forum</Text>
                <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">Share resources & chat</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* Opportunities and Dhikr Grid Cards */}
        <View className="px-6 flex-row gap-4 mb-6">
          {/* Opportunities Card */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Scholarship')}
            className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm items-center justify-center"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 bg-amber-50 rounded-full items-center justify-center mb-2.5">
              <Ionicons name="compass" size={18} color="#d97706" />
            </View>
            <Text className="text-slate-900 font-black text-xs text-center">Scholarship Finder</Text>
            <Text className="text-slate-400 text-[9px] font-semibold text-center mt-0.5">Apply globally</Text>
          </TouchableOpacity>

          {/* Daily Adhkar Card */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Adhkar')}
            className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm items-center justify-center"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mb-2.5">
              <Ionicons name="time" size={18} color="#059669" />
            </View>
            <Text className="text-slate-900 font-black text-xs text-center">Daily Dhikr</Text>
            <Text className="text-slate-400 text-[9px] font-semibold text-center mt-0.5">Morning & Evening</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Tasks Checklists */}
        <View className="px-6">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
            Your Daily Planner
          </Text>

          <View className="space-y-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            {dailyTasks.map((task, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  if (task.screen === 'Academy' || task.screen === 'Teacher' || task.screen === 'Adhkar') {
                    if (task.screen === 'Adhkar') {
                      navigation.navigate('Adhkar');
                    } else {
                      onNavigateTab(task.screen);
                    }
                  }
                }}
                className="flex-row items-center justify-between py-3.5 border-b border-slate-50 mb-1"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center flex-1 mr-4">
                  <View className="w-5 h-5 border border-slate-200 rounded-md items-center justify-center mr-3">
                    <View className="w-2.5 h-2.5 bg-emerald-500 rounded-sm opacity-20" />
                  </View>
                  <Text className="text-slate-700 text-xs font-semibold flex-1 leading-snug">
                    {task.text}
                  </Text>
                </View>
                
                <View className="bg-slate-50 px-2 py-1 rounded-md flex-row items-center">
                  <Text className="text-slate-400 text-[9px] font-extrabold uppercase">
                    {task.category}
                  </Text>
                  <Ionicons name="arrow-forward" size={10} color="#94a3b8" className="ml-1" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
