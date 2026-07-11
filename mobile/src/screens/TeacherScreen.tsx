import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function TeacherScreen() {
  const { isListening, transcript, error, volume, startListening, stopListening } = useSpeechRecognition();

  return (
    <View className="flex-1 bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
        Virtual Murāja'ah
      </Text>
      <Text className="text-sm text-slate-500 text-center mb-8">
        Recite to the virtual teacher.
      </Text>

      <View className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 justify-center items-center">
        {error ? (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        ) : null}

        <View className="h-40 justify-center items-center w-full mb-6">
          {transcript ? (
            <ScrollView className="w-full">
              <Text className="text-2xl text-slate-800 text-right leading-loose font-arabic">
                {transcript}
              </Text>
            </ScrollView>
          ) : (
            <Text className="text-slate-400 italic text-center">
              Waiting for recitation...
            </Text>
          )}
        </View>

        {isListening && (
          <View className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <View 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${Math.min(100, Math.max(0, volume * 10))}%` }} 
            />
          </View>
        )}

        <TouchableOpacity 
          className={`w-20 h-20 rounded-full justify-center items-center shadow-md ${
            isListening ? 'bg-red-500' : 'bg-emerald-600'
          }`}
          onPress={() => isListening ? stopListening() : startListening()}
        >
          <Text className="text-white font-bold text-sm">
            {isListening ? 'Stop' : 'Recite'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
