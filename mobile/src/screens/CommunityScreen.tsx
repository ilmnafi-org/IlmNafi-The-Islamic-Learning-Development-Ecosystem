import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useResourceUpload } from '../hooks/useResourceUpload';

export default function CommunityScreen() {
  const { isUploading, error, pickAndUploadFile } = useResourceUpload();

  const handleUpload = async () => {
    // Mock getUploadUrl for scaffolding
    const mockGetUploadUrl = async () => {
      return new Promise<{uploadUrl: string; authorizationToken: string}>((resolve) => {
        setTimeout(() => {
          resolve({ uploadUrl: 'https://mock-b2-upload-url', authorizationToken: 'mock-token' });
        }, 500);
      });
    };

    const result = await pickAndUploadFile({ getUploadUrl: mockGetUploadUrl });
    if (result) {
      alert('Upload successful!');
    }
  };

  return (
    <View className="flex-1 bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
        Community Hub
      </Text>
      <Text className="text-sm text-slate-500 text-center mb-8">
        Share resources with your community.
      </Text>

      <View className="flex-1 justify-center items-center">
        {error ? (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        ) : null}

        <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full items-center">
          <View className="w-16 h-16 bg-emerald-50 rounded-full items-center justify-center mb-4">
            <Text className="text-emerald-600 text-2xl">📁</Text>
          </View>
          <Text className="text-lg font-semibold text-slate-800 mb-2">
            Upload Resource
          </Text>
          <Text className="text-slate-500 text-center mb-6 text-sm">
            Select a document, image, or audio file to share with the community.
          </Text>

          <TouchableOpacity 
            className={`w-full py-4 rounded-xl items-center ${isUploading ? 'bg-slate-300' : 'bg-emerald-600'}`}
            onPress={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold">Select File</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
