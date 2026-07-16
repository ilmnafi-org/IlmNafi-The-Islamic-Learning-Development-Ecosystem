import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal, SafeAreaView } from 'react-native';
import { useResourceUpload } from '../hooks/useResourceUpload';
import { Ionicons } from '@expo/vector-icons';

// Database of forum categories and threads mimicking the web full-stack forum
const INITIAL_THREADS = [
  {
    id: 't1',
    category: 'Tajweed',
    title: 'How to perfect the Ikhfa sound on light vs dark letters?',
    author: 'Ahmed_Hifz',
    body: 'I am struggling to find the balance for the nasalization (Ghunnah) when followed by letters like Qaaf (ق) versus Sheen (ش). Any tips or recordings?',
    replies: [
      { id: 'r1', author: 'Sheikh_Yusuf', body: 'The rule of thumb: If the following letter is heavy (Mufakhham like ق, ص, ض, ط, ظ), the Ghunnah should also sound heavy. If the following letter is light (Tarqeeq like ش, س), keep your tongue relaxed and the nasal sound thin.', date: '2026-07-15' },
      { id: 'r2', author: 'Fatima_K', body: 'JazakAllah Sheikh! This explanation makes perfect sense. I was always pronouncing them with the same mouth shape.', date: '2026-07-15' }
    ],
    likes: 12,
    date: '2026-07-14'
  },
  {
    id: 't2',
    category: 'Hifz tips',
    title: 'Effective revision schedules for Juz Amma',
    author: 'Mariam_Quran',
    body: 'How many times should I repeat completed Surahs in Juz 30 to retain them perfectly while memorizing new ones?',
    replies: [
      { id: 'r3', author: 'Hafidh_Yaseen', body: 'Aim for the "5-times-rule". Repeat what you memorized today 5 times. Re-read the entire Juz once a week minimum.', date: '2026-07-13' }
    ],
    likes: 8,
    date: '2026-07-12'
  }
];

const SHARED_RESOURCES = [
  { name: 'Tajweed-Foundation-Guide.pdf', size: '1.4 MB', type: 'PDF' },
  { name: 'Juz-Amma-Pronunciation-Audio.mp3', size: '8.2 MB', type: 'Audio' }
];

export default function CommunityScreen() {
  const { isUploading, error, pickAndUploadFile } = useResourceUpload();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [sharedFiles, setSharedFiles] = useState(SHARED_RESOURCES);

  // Modals / Actions state
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [newReplyText, setNewReplyText] = useState('');
  
  const [createThreadModal, setCreateThreadModal] = useState(false);
  const [newThreadCategory, setNewThreadCategory] = useState('Tajweed');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');

  const handleUpload = async () => {
    const mockGetUploadUrl = async () => {
      return new Promise<{uploadUrl: string; authorizationToken: string}>((resolve) => {
        setTimeout(() => {
          resolve({ uploadUrl: 'https://mock-b2-upload-url', authorizationToken: 'mock-token' });
        }, 500);
      });
    };

    const result = await pickAndUploadFile({ getUploadUrl: mockGetUploadUrl });
    if (result) {
      // Add mock uploaded file to the local explorer
      const mockFile = {
        name: result.fileName || 'Uploaded-Voice-Recording.mp3',
        size: '1.1 MB',
        type: 'Recording'
      };
      setSharedFiles([mockFile, ...sharedFiles]);
      alert('File uploaded to Backblaze B2 repository successfully!');
    }
  };

  const handleAddReply = () => {
    if (!newReplyText.trim()) return;

    const newReply = {
      id: 'r_new_' + Math.random().toString(36).substring(2, 9),
      author: 'You (Student)',
      body: newReplyText.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedThread = {
      ...selectedThread,
      replies: [...selectedThread.replies, newReply]
    };

    setThreads(prev => prev.map(t => t.id === selectedThread.id ? updatedThread : t));
    setSelectedThread(updatedThread);
    setNewReplyText('');
  };

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadBody.trim()) {
      alert('Please fill out the thread title and body.');
      return;
    }

    const newThread = {
      id: 't_new_' + Math.random().toString(36).substring(2, 9),
      category: newThreadCategory,
      title: newThreadTitle.trim(),
      author: 'You (Student)',
      body: newThreadBody.trim(),
      replies: [],
      likes: 1,
      date: new Date().toISOString().split('T')[0]
    };

    setThreads([newThread, ...threads]);
    setNewThreadTitle('');
    setNewThreadBody('');
    setCreateThreadModal(false);
  };

  const handleLikeThread = (id: string, e: any) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  };

  const filteredThreads = threads.filter(t => 
    activeCategory === 'All' || t.category.toLowerCase().includes(activeCategory.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* Header Title */}
        <View className="p-6 pb-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-3xl font-black text-slate-950 tracking-tight">
              Community Hub
            </Text>
            <TouchableOpacity 
              onPress={() => setCreateThreadModal(true)}
              className="bg-emerald-600 px-3 py-1.5 rounded-full flex-row items-center"
            >
              <Ionicons name="add" size={14} color="#ffffff" />
              <Text className="text-white text-[11px] font-bold ml-1">New Thread</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-slate-500 text-sm">
            Discuss recite rules, seek hifz tips, and share learning materials.
          </Text>
        </View>

        {/* Categories Tab */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-6 mb-5 flex-row"
          contentContainerStyle={{ gap: 8 }}
        >
          {['All', 'Tajweed', 'Hifz tips'].map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border ${
                  isActive 
                    ? 'bg-emerald-600 border-emerald-600' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-600'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Discussion Forum Feed */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Active Forum Board
          </Text>

          <View className="space-y-4">
            {filteredThreads.map((thread) => (
              <TouchableOpacity
                key={thread.id}
                onPress={() => setSelectedThread(thread)}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-4"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <Text className="text-emerald-700 text-[9px] font-bold uppercase">
                      {thread.category}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-slate-400 font-semibold">
                    {thread.date}
                  </Text>
                </View>

                <Text className="text-slate-900 font-extrabold text-base mb-1.5 leading-snug">
                  {thread.title}
                </Text>
                <Text className="text-slate-500 text-xs mb-4" numberOfLines={2}>
                  {thread.body}
                </Text>

                <View className="flex-row items-center justify-between border-t border-slate-100 pt-3">
                  <Text className="text-[10px] text-slate-400 font-bold">
                    By @{thread.author}
                  </Text>
                  
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity 
                      onPress={(e) => handleLikeThread(thread.id, e)}
                      className="flex-row items-center"
                    >
                      <Ionicons name="heart-outline" size={14} color="#64748b" />
                      <Text className="text-[11px] text-slate-500 font-semibold ml-1">{thread.likes}</Text>
                    </TouchableOpacity>
                    
                    <View className="flex-row items-center">
                      <Ionicons name="chatbubble-outline" size={14} color="#64748b" />
                      <Text className="text-[11px] text-slate-500 font-semibold ml-1">{thread.replies.length}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resources Uploader & Shared Library */}
        <View className="px-6">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Shared Study Resources
          </Text>

          <View className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-3.5 mb-4">
              <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center">
                <Ionicons name="cloud-upload-outline" size={18} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-sm">Upload to Classroom Repository</Text>
                <Text className="text-slate-500 text-[10px]">Supports PDFs, recordings, and images</Text>
              </View>
            </View>

            {error && (
              <Text className="text-red-500 text-[11px] mb-3">{error}</Text>
            )}

            <TouchableOpacity
              onPress={handleUpload}
              disabled={isUploading}
              className={`w-full py-3 rounded-xl items-center justify-center flex-row ${
                isUploading ? 'bg-slate-200' : 'bg-emerald-600'
              }`}
            >
              {isUploading ? (
                <ActivityIndicator color="#64748b" size="small" />
              ) : (
                <>
                  <Ionicons name="document-attach" size={16} color="#ffffff" className="mr-1.5" />
                  <Text className="text-white font-bold text-xs ml-1.5">Pick & Upload File</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Files Shared List */}
          <View className="space-y-3">
            {sharedFiles.map((file, idx) => (
              <View 
                key={idx}
                className="bg-white px-4 py-3 rounded-xl border border-slate-100 flex-row items-center justify-between shadow-sm mb-2"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 bg-slate-50 rounded-lg items-center justify-center mr-3">
                    <Ionicons 
                      name={file.type === 'PDF' ? 'document-text' : 'musical-note'} 
                      size={16} 
                      color="#059669" 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-semibold text-xs" numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text className="text-slate-400 text-[9px] font-bold uppercase mt-0.5">
                      {file.type} • {file.size}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity className="p-1">
                  <Ionicons name="download-outline" size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Individual Thread Detail Modal */}
      {selectedThread && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={selectedThread !== null}
          onRequestClose={() => setSelectedThread(null)}
        >
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
              <TouchableOpacity onPress={() => setSelectedThread(null)} className="p-1">
                <Ionicons name="arrow-back" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                {selectedThread.category} Discussions
              </Text>
              <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
              
              {/* Main Post */}
              <View className="mb-6 pb-6 border-b border-slate-100">
                <Text className="text-xs text-slate-400 font-bold mb-2">
                  Posted on {selectedThread.date} by @{selectedThread.author}
                </Text>
                <Text className="text-xl font-extrabold text-slate-900 mb-3 leading-snug">
                  {selectedThread.title}
                </Text>
                <Text className="text-slate-600 text-sm leading-relaxed">
                  {selectedThread.body}
                </Text>
              </View>

              {/* Replies Header */}
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Replies ({selectedThread.replies.length})
              </Text>

              {/* Replies Feed */}
              {selectedThread.replies.length === 0 ? (
                <Text className="text-slate-400 italic text-xs mb-6">No replies yet. Be the first to reply!</Text>
              ) : (
                selectedThread.replies.map((reply: any) => (
                  <View 
                    key={reply.id}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4"
                  >
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-emerald-800 text-xs font-extrabold">
                        @{reply.author}
                      </Text>
                      <Text className="text-[10px] text-slate-400 font-semibold">
                        {reply.date}
                      </Text>
                    </View>
                    <Text className="text-slate-600 text-xs leading-relaxed">
                      {reply.body}
                    </Text>
                  </View>
                ))
              )}

              {/* Add Reply Input Form */}
              <View className="mt-4 pt-4 border-t border-slate-100">
                <Text className="text-xs font-semibold text-slate-700 mb-2">Compose Reply</Text>
                <View className="flex-row bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 items-end mb-4">
                  <TextInput
                    placeholder="Write a helpful response..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={3}
                    className="flex-1 text-slate-800 text-xs text-left"
                    style={{ minHeight: 60 }}
                    value={newReplyText}
                    onChangeText={setNewReplyText}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleAddReply}
                  className="bg-slate-900 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-xs">Post Reply</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Create New Thread Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={createThreadModal}
        onRequestClose={() => setCreateThreadModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
            <TouchableOpacity onPress={() => setCreateThreadModal(false)} className="p-1">
              <Ionicons name="close" size={24} color="#334155" />
            </TouchableOpacity>
            <Text className="text-base font-bold text-slate-800">Launch New Discussion</Text>
            <View className="w-8" />
          </View>

          <ScrollView className="p-6 space-y-5 flex-grow" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Category selection */}
            <View className="mb-4">
              <Text className="text-slate-700 text-xs font-semibold mb-2 ml-1">Select Topic Board</Text>
              <View className="flex-row gap-2">
                {['Tajweed', 'Hifz tips', 'General'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setNewThreadCategory(cat)}
                    className={`px-4 py-2 rounded-xl border ${
                      newThreadCategory === cat 
                        ? 'bg-emerald-50 border-emerald-500' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${
                      newThreadCategory === cat ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Title field */}
            <View className="mb-4">
              <Text className="text-slate-700 text-xs font-semibold mb-1.5 ml-1">Discussion Title</Text>
              <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <TextInput
                  placeholder="What is your question or topic?"
                  placeholderTextColor="#94a3b8"
                  className="text-slate-800 text-sm"
                  value={newThreadTitle}
                  onChangeText={setNewThreadTitle}
                />
              </View>
            </View>

            {/* Body text */}
            <View className="mb-6">
              <Text className="text-slate-700 text-xs font-semibold mb-1.5 ml-1">Details / Context</Text>
              <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <TextInput
                  placeholder="Provide details so other students or mentors can assist you..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={6}
                  className="text-slate-800 text-sm text-left"
                  style={{ minHeight: 120 }}
                  value={newThreadBody}
                  onChangeText={setNewThreadBody}
                />
              </View>
            </View>

            {/* Launch action */}
            <TouchableOpacity
              onPress={handleCreateThread}
              className="bg-emerald-600 py-3.5 rounded-xl items-center shadow-md shadow-emerald-600/10"
            >
              <Text className="text-white font-bold text-sm">Launch Thread</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}
