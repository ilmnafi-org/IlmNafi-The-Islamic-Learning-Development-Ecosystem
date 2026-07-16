import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface AuthScreenProps {
  navigation: any;
  route?: any;
}

export default function AuthScreen({ navigation, route }: AuthScreenProps) {
  const { login, signup, resetPassword } = useAuth();
  
  // Modes: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(
    route?.params?.initialMode || 'login'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMessage(res.message || 'Password reset link sent!');
          setTimeout(() => setMode('login'), 3500);
        } else {
          setErrorMessage(res.error || 'Failed to dispatch reset link.');
        }
      } else if (mode === 'login') {
        if (!password) {
          setErrorMessage('Please enter your password.');
          setIsLoading(false);
          return;
        }
        const res = await login(email, password);
        if (res.success) {
          navigation.navigate('Home');
        } else {
          setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
        }
      } else {
        // Signup
        if (!name) {
          setErrorMessage('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        if (!password || password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }
        const res = await signup(name, email, password, role);
        if (res.success) {
          navigation.navigate('Home');
        } else {
          setErrorMessage(res.error || 'Registration failed. Try a different email address.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="p-6 md:p-12 max-w-md w-full mx-auto justify-center">
        
        {/* App Logo & Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-emerald-600 rounded-2xl items-center justify-center mb-4 shadow-md">
            <Ionicons name="book" size={32} color="#ffffff" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 tracking-tight text-center">
            Ilm Nafi
          </Text>
          <Text className="text-slate-500 text-sm text-center mt-1">
            {mode === 'login' && 'Welcome back! Please sign in to your learning circle.'}
            {mode === 'signup' && 'Create your learning profile to begin your journey.'}
            {mode === 'forgot' && 'Reset your password to resume reciting.'}
          </Text>
        </View>

        {/* Card Form */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          
          {/* Messages */}
          {errorMessage && (
            <View className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100 flex-row items-center">
              <Ionicons name="alert-circle-outline" size={20} color="#dc2626" className="mr-2" />
              <Text className="text-red-700 text-xs flex-1 ml-1">{errorMessage}</Text>
            </View>
          )}

          {successMessage && (
            <View className="bg-emerald-50 p-4 rounded-xl mb-4 border border-emerald-100 flex-row items-center">
              <Ionicons name="checkmark-circle-outline" size={20} color="#059669" className="mr-2" />
              <Text className="text-emerald-700 text-xs flex-1 ml-1">{successMessage}</Text>
            </View>
          )}

          {/* Mode Selector Tab (only for login/signup) */}
          {mode !== 'forgot' && (
            <View className="flex-row bg-slate-100 rounded-xl p-1 mb-6">
              <TouchableOpacity 
                className={`flex-1 py-2.5 rounded-lg items-center ${mode === 'login' ? 'bg-white shadow-sm' : ''}`}
                onPress={() => { setMode('login'); setErrorMessage(null); }}
              >
                <Text className={`font-bold text-sm ${mode === 'login' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`flex-1 py-2.5 rounded-lg items-center ${mode === 'signup' ? 'bg-white shadow-sm' : ''}`}
                onPress={() => { setMode('signup'); setErrorMessage(null); }}
              >
                <Text className={`font-bold text-sm ${mode === 'signup' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sign Up Name Field */}
          {mode === 'signup' && (
            <View className="mb-4">
              <Text className="text-slate-700 text-xs font-semibold mb-1.5 ml-1">Full Name</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <Ionicons name="person-outline" size={18} color="#94a3b8" />
                <TextInput
                  placeholder="Enter full name"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 ml-2.5 text-slate-800 text-sm py-0"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          )}

          {/* Email Address Field */}
          <View className="mb-4">
            <Text className="text-slate-700 text-xs font-semibold mb-1.5 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Ionicons name="mail-outline" size={18} color="#94a3b8" />
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 ml-2.5 text-slate-800 text-sm py-0"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Field (except forgot password) */}
          {mode !== 'forgot' && (
            <View className="mb-5">
              <View className="flex-row justify-between mb-1.5 ml-1">
                <Text className="text-slate-700 text-xs font-semibold">Password</Text>
                {mode === 'login' && (
                  <TouchableOpacity onPress={() => setMode('forgot')}>
                    <Text className="text-emerald-600 text-xs font-medium">Forgot Password?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry
                  autoCapitalize="none"
                  className="flex-1 ml-2.5 text-slate-800 text-sm py-0"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
          )}

          {/* Signup Role Selector */}
          {mode === 'signup' && (
            <View className="mb-6">
              <Text className="text-slate-700 text-xs font-semibold mb-2 ml-1">I am a...</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                    role === 'student' 
                      ? 'bg-emerald-50 border-emerald-500' 
                      : 'bg-white border-slate-200'
                  }`}
                  onPress={() => setRole('student')}
                >
                  <Ionicons 
                    name="school-outline" 
                    size={16} 
                    color={role === 'student' ? '#059669' : '#64748b'} 
                  />
                  <Text className={`font-semibold text-xs ml-2 ${
                    role === 'student' ? 'text-emerald-800' : 'text-slate-600'
                  }`}>
                    Student
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                    role === 'teacher' 
                      ? 'bg-emerald-50 border-emerald-500' 
                      : 'bg-white border-slate-200'
                  }`}
                  onPress={() => setRole('teacher')}
                >
                  <Ionicons 
                    name="ribbon-outline" 
                    size={16} 
                    color={role === 'teacher' ? '#059669' : '#64748b'} 
                  />
                  <Text className={`font-semibold text-xs ml-2 ${
                    role === 'teacher' ? 'text-emerald-800' : 'text-slate-600'
                  }`}>
                    Mentor / Teacher
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            className="w-full bg-emerald-600 py-3.5 rounded-xl shadow-sm items-center justify-center"
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white font-bold text-sm">
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Password Reset'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back button for Forgot Password */}
          {mode === 'forgot' && (
            <TouchableOpacity 
              className="items-center mt-4 py-2"
              onPress={() => { setMode('login'); setErrorMessage(null); }}
            >
              <Text className="text-slate-500 text-xs font-semibold">
                ← Back to Login
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Continue as Guest action */}
        <TouchableOpacity 
          className="items-center mt-6 py-2"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-slate-500 text-xs font-semibold">
            Continue as Guest / Enter Sandbox Mode
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
