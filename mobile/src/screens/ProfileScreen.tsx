import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const handleShareCert = async (certName: string) => {
    try {
      await Share.share({
        message: `I just earned the "${certName}" certificate on Ilm Nafi! Join me to recite, study, and share Quranic sciences. 📖✨`,
      });
    } catch (error) {
      console.log('Error sharing certificate:', error);
    }
  };

  const mockCertificates = [
    { title: 'Nun Sakinah Master', grade: 'Grade A (100%)', date: '2026-07-15', key: 'CERT-NUN-489A' },
    { title: 'Surah Al-Fatihah Tafseer', grade: 'Grade A (100%)', date: '2026-07-10', key: 'CERT-FAT-772C' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* Profile Card Header */}
        <View className="bg-white p-6 rounded-b-[32px] border-b border-slate-100 shadow-sm items-center mb-6 pt-8">
          <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4 border border-emerald-200">
            <Text className="text-3xl">👤</Text>
          </View>
          <Text className="text-2xl font-black text-slate-900 tracking-tight text-center">
            {user?.name || 'Sulayman Student'}
          </Text>
          <Text className="text-slate-400 text-sm text-center mb-5 font-semibold">
            {user?.email || 'apatirasulayman@gmail.com'}
          </Text>

          <View className="bg-emerald-50 px-4 py-1.5 rounded-full flex-row items-center">
            <Ionicons name="ribbon-outline" size={14} color="#047857" />
            <Text className="text-emerald-800 text-xs font-extrabold uppercase tracking-wider ml-1.5">
              Verified {user?.role || 'student'}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 flex-row gap-4 mb-6">
          <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm items-center">
            <Ionicons name="flame" size={24} color="#f97316" className="mb-1" />
            <Text className="text-slate-900 font-extrabold text-base">{user?.streak ?? 7} Days</Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">STREAK</Text>
          </View>

          <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm items-center">
            <Ionicons name="shield-checkmark" size={24} color="#059669" className="mb-1" />
            <Text className="text-slate-900 font-extrabold text-base">{user?.xp ?? 340}</Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">LEARNING XP</Text>
          </View>

          <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm items-center">
            <Ionicons name="book" size={24} color="#6366f1" className="mb-1" />
            <Text className="text-slate-900 font-extrabold text-base">{user?.completedChapters ?? 4}</Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">COURSES</Text>
          </View>
        </View>

        {/* Certificates Earned */}
        <View className="px-6 mb-6">
          <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-3 ml-1">
            Earned Credentials
          </Text>

          <View className="space-y-4">
            {mockCertificates.map((cert, index) => (
              <View 
                key={index}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-row items-center justify-between mb-3"
              >
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Ionicons name="checkmark-circle" size={14} color="#059669" />
                    <Text className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                      VERIFIED ACADEMIC CREDENTIAL
                    </Text>
                  </View>
                  <Text className="text-slate-800 font-bold text-base leading-tight">
                    {cert.title}
                  </Text>
                  <Text className="text-slate-400 text-[11px] mt-1 font-semibold">
                    Completed on {cert.date} • {cert.key}
                  </Text>
                </View>

                <TouchableOpacity 
                  onPress={() => handleShareCert(cert.title)}
                  className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full items-center justify-center"
                >
                  <Ionicons name="share-social" size={18} color="#475569" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Support Actions */}
        <View className="px-6 space-y-3">
          <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-3 ml-1">
            Account Actions
          </Text>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Scholarship')}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex-row items-center justify-between mb-3"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-amber-50 rounded-lg items-center justify-center mr-3">
                <Ionicons name="bookmark" size={16} color="#d97706" />
              </View>
              <Text className="text-slate-700 font-bold text-sm">Saved Scholarships</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Adhkar')}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex-row items-center justify-between mb-3"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-blue-50 rounded-lg items-center justify-center mr-3">
                <Ionicons name="timer" size={16} color="#2563eb" />
              </View>
              <Text className="text-slate-700 font-bold text-sm">Daily Supplications Tracker</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Log out */}
          <TouchableOpacity 
            onPress={logout}
            className="bg-red-50/50 border border-red-100 p-4 rounded-xl flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={18} color="#dc2626" className="mr-2" />
            <Text className="text-red-700 font-extrabold text-sm ml-2">Log Out from Session</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
