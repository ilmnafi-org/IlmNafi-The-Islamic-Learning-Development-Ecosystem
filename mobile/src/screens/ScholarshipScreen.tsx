import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Database of scholarships matching the web platform
const SCHOLARSHIPS = [
  {
    id: 'sc1',
    title: 'Islamic Development Bank (IsDB) Scholarship',
    provider: 'Islamic Development Bank',
    country: 'Global (Member Countries)',
    coverage: 'Fully Funded',
    level: ['Undergraduate', 'Postgraduate'],
    stipendAmount: '$800 / Month + Flights',
    deadline: '2026-10-15',
    eligibility: [
      'Must be a citizen of an IsDB member country or Muslim community in non-member country',
      'Minimum GPA of 3.0 / 4.0 or equivalent',
      'Committed to returning and developing their local community after graduation'
    ],
    description: 'The IsDB Scholarship Programme is a prominent funding initiative designed to foster expertise and technology transfer among member countries and Muslim communities worldwide by supporting high-achieving students.',
    websiteUrl: 'https://www.isdb.org/scholarships'
  },
  {
    id: 'sc2',
    title: 'King Fahd University of Petroleum & Minerals Fellowship',
    provider: 'KFUPM Graduate School',
    country: 'Saudi Arabia',
    coverage: 'Fully Funded',
    level: ['Postgraduate', 'Research Grants'],
    stipendAmount: 'SR 1,500 / Month + Free Housing',
    deadline: '2026-11-01',
    eligibility: [
      'Outstanding academic records in engineering or science majors',
      'IELTS score of 6.0 or TOEFL equivalent',
      'Three letters of academic recommendation'
    ],
    description: 'KFUPM offers fully-funded fellowships for outstanding international male and female graduate applicants to pursue Master’s and Ph.D. degrees in diverse technical disciplines.',
    websiteUrl: 'https://www.kfupm.edu.sa'
  },
  {
    id: 'sc3',
    title: 'Al-Azhar University Scholarship for International Students',
    provider: 'Al-Azhar Al-Sharif',
    country: 'Egypt',
    coverage: 'Fully Funded',
    level: ['Undergraduate'],
    stipendAmount: 'Full Tuition Waiver + Hostel',
    deadline: '2026-08-30',
    eligibility: [
      'High school certificate approved by Al-Azhar equivalency board',
      'Proficiency in basic Arabic language',
      'Nomination by the official Islamic council in applicant’s home country'
    ],
    description: 'Al-Azhar Al-Sharif awards annual scholarships to outstanding Muslim students globally to study Islamic jurisprudence, Arabic language, theology, and modern scientific fields in Cairo.',
    websiteUrl: 'http://www.azhar.eg'
  }
];

export default function ScholarshipScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);

  const toggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter(item => item !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  const filteredScholarships = SCHOLARSHIPS.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = 
      selectedLevel === 'All' || 
      item.level.includes(selectedLevel);

    const matchesSaved = !filterSavedOnly || savedIds.includes(item.id);

    return matchesSearch && matchesLevel && matchesSaved;
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="p-6 pb-2 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.navigate('Home')} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Scholarship Finder</Text>
        <TouchableOpacity 
          onPress={() => setFilterSavedOnly(!filterSavedOnly)}
          className="p-1"
        >
          <Ionicons 
            name={filterSavedOnly ? "bookmark" : "bookmark-outline"} 
            size={22} 
            color={filterSavedOnly ? "#059669" : "#64748b"} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View className="px-6 mb-4">
        <View className="flex-row items-center bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 shadow-sm">
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search provider, country, or title..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-2.5 text-slate-800 text-sm py-0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Level Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-6 mb-6 flex-row"
        contentContainerStyle={{ gap: 8 }}
      >
        {['All', 'Undergraduate', 'Postgraduate', 'Research Grants'].map((lvl) => {
          const isActive = selectedLevel === lvl;
          return (
            <TouchableOpacity
              key={lvl}
              onPress={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 rounded-full border ${
                isActive 
                  ? 'bg-emerald-600 border-emerald-600' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {lvl}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {filteredScholarships.length === 0 ? (
          <View className="items-center justify-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
            <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-800 font-bold text-base mt-4">No Opportunities Found</Text>
            <Text className="text-slate-500 text-center text-xs mt-1.5 leading-relaxed">
              Try modifying your search text, clearing filters, or saving scholarships to this list first.
            </Text>
          </View>
        ) : (
          filteredScholarships.map((scholarship) => {
            const isSaved = savedIds.includes(scholarship.id);
            return (
              <View 
                key={scholarship.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-4 relative"
              >
                <TouchableOpacity 
                  onPress={() => toggleSave(scholarship.id)}
                  className="absolute right-4 top-4 p-1 z-10"
                >
                  <Ionicons 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={20} 
                    color={isSaved ? "#059669" : "#94a3b8"} 
                  />
                </TouchableOpacity>

                <View className="pr-8">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <Text className="text-emerald-700 text-[10px] font-bold">
                        {scholarship.coverage}
                      </Text>
                    </View>
                    <Text className="text-[10px] text-slate-400 font-bold uppercase">
                      {scholarship.country}
                    </Text>
                  </View>

                  <Text className="text-slate-800 font-extrabold text-base mb-1.5 leading-snug">
                    {scholarship.title}
                  </Text>
                  
                  <Text className="text-slate-500 text-xs font-semibold mb-3">
                    {scholarship.provider}
                  </Text>

                  <View className="flex-row items-center justify-between border-t border-slate-100 pt-3 mt-1">
                    <View className="flex-row items-center">
                      <Ionicons name="cash-outline" size={14} color="#64748b" className="mr-1" />
                      <Text className="text-slate-500 text-[11px] ml-1">
                        {scholarship.stipendAmount}
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => setSelectedScholarship(scholarship)}
                      className="bg-slate-900 px-4 py-2 rounded-xl"
                    >
                      <Text className="text-white text-xs font-bold">Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Detail Slide Up Modal */}
      {selectedScholarship && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedScholarship !== null}
          onRequestClose={() => setSelectedScholarship(null)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView className="bg-white rounded-t-[32px] p-6 max-h-[85%] border-t border-slate-100">
              
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                  SCHOLARSHIP DETAILS
                </Text>
                <TouchableOpacity onPress={() => setSelectedScholarship(null)} className="p-1">
                  <Ionicons name="close-circle" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                <Text className="text-slate-950 font-extrabold text-lg mb-2">
                  {selectedScholarship.title}
                </Text>

                <Text className="text-slate-600 text-sm font-medium mb-4">
                  Provided by: {selectedScholarship.provider}
                </Text>

                {/* Grid stats */}
                <View className="flex-row gap-3 mb-6">
                  <View className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <Text className="text-[10px] text-slate-400 font-bold mb-0.5">LOCATION</Text>
                    <Text className="text-slate-800 text-xs font-bold">{selectedScholarship.country}</Text>
                  </View>
                  <View className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <Text className="text-[10px] text-slate-400 font-bold mb-0.5">DEADLINE</Text>
                    <Text className="text-slate-800 text-xs font-bold">{selectedScholarship.deadline}</Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-slate-800 text-sm font-bold mb-2">Description</Text>
                <Text className="text-slate-500 text-xs leading-relaxed mb-6">
                  {selectedScholarship.description}
                </Text>

                {/* Eligibility requirements */}
                <Text className="text-slate-800 text-sm font-bold mb-2">Eligibility Criteria</Text>
                {selectedScholarship.eligibility.map((rule: string, i: number) => (
                  <View key={i} className="flex-row mb-2 ml-1">
                    <Text className="text-emerald-600 text-xs font-bold mr-2">•</Text>
                    <Text className="text-slate-500 text-xs leading-relaxed flex-1">
                      {rule}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Launcher */}
              <TouchableOpacity
                onPress={() => Linking.openURL(selectedScholarship.websiteUrl).catch(() => {})}
                className="w-full bg-emerald-600 py-4 rounded-2xl items-center flex-row justify-center shadow-md shadow-emerald-600/10"
              >
                <Ionicons name="earth" size={18} color="#ffffff" className="mr-2" />
                <Text className="text-white font-bold text-sm ml-2">Visit Scholarship Website</Text>
              </TouchableOpacity>

            </SafeAreaView>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}
