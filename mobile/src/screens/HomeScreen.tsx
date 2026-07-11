import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="p-6 pt-12 items-center">
        <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4">
          <Text className="text-3xl">📖</Text>
        </View>
        <Text className="text-3xl font-bold mb-2 text-slate-800 text-center">
          Ilm Nafi
        </Text>
        <Text className="text-slate-500 text-center mb-10 px-4">
          Islamic ed-tech platform. Recite, learn, and share with your community.
        </Text>
        
        <View className="w-full space-y-4">
          <TouchableOpacity 
            className="w-full bg-white p-6 rounded-3xl mb-4 shadow-sm border border-slate-100 flex-row items-center justify-between"
            onPress={() => navigation.navigate('Teacher')}
          >
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-lg mb-1">
                Virtual Murāja'ah
              </Text>
              <Text className="text-slate-500 text-sm">
                Practice recitation with Arabic speech recognition
              </Text>
            </View>
            <Text className="text-emerald-500 text-2xl ml-4">→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full bg-white p-6 rounded-3xl mb-4 shadow-sm border border-slate-100 flex-row items-center justify-between"
            onPress={() => navigation.navigate('Quran')}
          >
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-lg mb-1">
                Listen & Read Quran
              </Text>
              <Text className="text-slate-500 text-sm">
                High-quality audio playback and text
              </Text>
            </View>
            <Text className="text-emerald-500 text-2xl ml-4">→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-row items-center justify-between"
            onPress={() => navigation.navigate('Community')}
          >
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-lg mb-1">
                Community Hub
              </Text>
              <Text className="text-slate-500 text-sm">
                Share resources and connect with your learning circle
              </Text>
            </View>
            <Text className="text-slate-400 text-2xl ml-4">→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
