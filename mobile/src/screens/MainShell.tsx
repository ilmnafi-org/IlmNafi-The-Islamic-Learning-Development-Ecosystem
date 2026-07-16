import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './HomeScreen';
import AcademyScreen from './AcademyScreen';
import TeacherScreen from './TeacherScreen';
import QuranScreen from './QuranScreen';
import CommunityScreen from './CommunityScreen';
import ProfileScreen from './ProfileScreen';
import FloatingBottomNavbar from '../components/FloatingBottomNavbar';

interface MainShellProps {
  navigation: any;
}

export default function MainShell({ navigation }: MainShellProps) {
  const [activeTab, setActiveTab] = useState('Home');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} onNavigateTab={setActiveTab} />;
      case 'Academy':
        return <AcademyScreen />;
      case 'Teacher':
        return <TeacherScreen />;
      case 'Quran':
        return <QuranScreen />;
      case 'Community':
        return <CommunityScreen />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Active screen content */}
      <View style={styles.screenContent}>
        {renderActiveScreen()}
      </View>

      {/* Persistent Floating Bottom Tab Bar */}
      <FloatingBottomNavbar 
        currentScreen={activeTab} 
        onNavigate={setActiveTab} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  screenContent: {
    flex: 1,
  },
});
