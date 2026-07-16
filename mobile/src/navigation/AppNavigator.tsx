import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainShell from '../screens/MainShell';
import AuthScreen from '../screens/AuthScreen';
import ScholarshipScreen from '../screens/ScholarshipScreen';
import AdhkarScreen from '../screens/AdhkarScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen 
        name="Main" 
        component={MainShell} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen} 
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="Scholarship" 
        component={ScholarshipScreen} 
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Adhkar" 
        component={AdhkarScreen} 
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
