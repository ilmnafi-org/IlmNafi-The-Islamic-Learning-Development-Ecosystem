import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TeacherScreen from '../screens/TeacherScreen';
import CommunityScreen from '../screens/CommunityScreen';
import QuranScreen from '../screens/QuranScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Ilm Nafi' }}
      />
      <Stack.Screen 
        name="Teacher" 
        component={TeacherScreen} 
        options={{ title: 'Virtual Murāja\'ah' }}
      />
      <Stack.Screen 
        name="Community" 
        component={CommunityScreen} 
        options={{ title: 'Community Hub' }}
      />
      <Stack.Screen 
        name="Quran" 
        component={QuranScreen} 
        options={{ title: 'Holy Quran' }}
      />
    </Stack.Navigator>
  );
}
