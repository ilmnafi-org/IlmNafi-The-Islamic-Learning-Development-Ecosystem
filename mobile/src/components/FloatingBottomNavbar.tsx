import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingBottomNavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function FloatingBottomNavbar({ currentScreen, onNavigate }: FloatingBottomNavbarProps) {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const tabs = [
    { name: 'Home', icon: 'home-outline', iconActive: 'home', label: 'Home' },
    { name: 'Academy', icon: 'school-outline', iconActive: 'school', label: 'Academy' },
    { name: 'Teacher', icon: 'mic-outline', iconActive: 'mic', label: 'Recite' },
    { name: 'Quran', icon: 'book-outline', iconActive: 'book', label: 'Quran' },
    { name: 'Community', icon: 'people-outline', iconActive: 'people', label: 'Hub' },
  ];

  return (
    <View 
      className="absolute bottom-6 left-4 right-4 bg-white/95 rounded-full py-3 px-4 shadow-xl border border-slate-100/80 flex-row justify-around items-center"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
        maxWidth: isTablet ? 600 : undefined,
        alignSelf: isTablet ? 'center' : 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onNavigate(tab.name)}
            className="items-center justify-center py-1"
            style={{ width: isTablet ? 100 : `${100 / tabs.length}%` }}
            activeOpacity={0.7}
          >
            <View className={`p-2 rounded-full items-center justify-center ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Ionicons 
                name={(isActive ? tab.iconActive : tab.icon) as any} 
                size={isActive ? 22 : 20} 
                color={isActive ? '#059669' : '#64748b'} 
              />
            </View>
            <Text 
              className={`text-[10px] mt-0.5 font-medium tracking-tight ${
                isActive ? 'text-emerald-700 font-bold font-sans' : 'text-slate-400 font-sans'
              }`}
            >
              {tab.label}
            </Text>
            {isActive && (
              <View className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5 absolute bottom-0" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
