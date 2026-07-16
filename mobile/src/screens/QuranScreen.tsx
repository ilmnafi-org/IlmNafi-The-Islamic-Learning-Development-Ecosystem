import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Modal, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SURAHS = [
  { 
    id: 1, 
    name: "Al-Fatihah", 
    ar: "الفاتحة", 
    translation: "The Opening",
    verses: [
      { num: 1, ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { num: 2, ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "[All] praise is [due] to Allah, Lord of the worlds -" },
      { num: 3, ar: "الرَّحْمَٰنِ الرَّحِيمِ", en: "The Entirely Merciful, the Especially Merciful," },
      { num: 4, ar: "مَالِكِ يَوْمِ الدِّينِ", en: "Sovereign of the Day of Recompense." },
      { num: 5, ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "It is You we worship and You we ask for help." },
      { num: 6, ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", en: "Guide us to the straight path -" },
      { num: 7, ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", en: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray." }
    ]
  },
  { 
    id: 94, 
    name: "Ash-Sharh", 
    ar: "الشرح", 
    translation: "The Relief",
    verses: [
      { num: 1, ar: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", en: "Did We not expand for you, [O Muhammad], your breast?" },
      { num: 2, ar: "وَوَضَعْنَا عَنكَ وِزْرَكَ", en: "And We removed from you your burden" },
      { num: 3, ar: "الَّذِي أَنقَضَ ظَهْرَكَ", en: "Which weighed upon your back" },
      { num: 4, ar: "وَرَفَعْنَا لَكَ ذِكْرَكَ", en: "And raised high for you your repute." },
      { num: 5, ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "For indeed, with hardship [will be] ease." },
      { num: 6, ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship [will be] ease." },
      { num: 7, ar: "فَإِذَا فَرَغْتَ فَانصَبْ", en: "So when you have finished [your duties], labor to fatigue [in worship]," },
      { num: 8, ar: "وَإِلَىٰ رَبِّكَ فَارْغَب", en: "And to your Lord direct [your] longing." }
    ]
  },
  {
    id: 108,
    name: "Al-Kawthar",
    ar: "الكوثر",
    translation: "The Abundance",
    verses: [
      { num: 1, ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", en: "Indeed, We have granted you, [O Muhammad], al-Kawthar." },
      { num: 2, ar: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", en: "So pray to your Lord and sacrifice [to Him alone]." },
      { num: 3, ar: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", en: "Indeed, your enemy is the one cut off." }
    ]
  }
];

export default function QuranScreen() {
  const [activeSurah, setActiveSurah] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVerseNum, setActiveVerseNum] = useState<number>(1);
  const [showReader, setShowReader] = useState(false);

  // Verse highlighting simulation logic as audio "plays"
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeSurah) {
      timer = setInterval(() => {
        setActiveVerseNum(prev => {
          if (prev >= activeSurah.verses.length) {
            setIsPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 4500); // Highlight next verse every 4.5 seconds
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeSurah]);

  const selectAndPlaySurah = (surah: any) => {
    setIsLoading(true);
    setActiveSurah(surah);
    setActiveVerseNum(1);
    setIsPlaying(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 800);
  };

  const handleTogglePlay = () => {
    if (!activeSurah) {
      // Default to Al-Fatihah
      selectAndPlaySurah(SURAHS[0]);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      
      {/* Page Header */}
      <View className="p-6 pb-2">
        <Text className="text-3xl font-black text-slate-950 tracking-tight text-center mb-1">
          Holy Quran
        </Text>
        <Text className="text-xs text-slate-400 text-center mb-6 font-bold uppercase tracking-widest">
          Listen & Learn the Eternal Word
        </Text>
      </View>

      {/* Surah Deck */}
      <ScrollView className="flex-1 px-6 mb-24" showsVerticalScrollIndicator={false}>
        {SURAHS.map((surah) => {
          const isSelected = activeSurah?.id === surah.id;
          return (
            <TouchableOpacity 
              key={surah.id}
              onPress={() => {
                setActiveSurah(surah);
                setActiveVerseNum(1);
                setShowReader(true);
              }}
              className={`bg-white p-5 rounded-2xl mb-4 shadow-sm border flex-row items-center justify-between ${
                isSelected ? 'border-emerald-500' : 'border-slate-100'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-4">
                  <Text className="text-emerald-700 font-extrabold text-sm">{surah.id}</Text>
                </View>
                <View>
                  <Text className="text-slate-800 font-extrabold text-base">{surah.name}</Text>
                  <Text className="text-slate-400 text-[11px] font-bold uppercase mt-0.5">
                    {surah.translation} • {surah.verses.length} Verses
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center gap-3">
                <Text className="text-xl font-bold text-emerald-800 font-arabic mr-2">{surah.ar}</Text>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    selectAndPlaySurah(surah);
                  }}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isSelected && isPlaying ? 'bg-amber-100' : 'bg-slate-50'
                  }`}
                >
                  {isSelected && isLoading ? (
                    <ActivityIndicator color="#059669" size="small" />
                  ) : isSelected && isPlaying ? (
                    <Ionicons name="pause" size={16} color="#d97706" />
                  ) : (
                    <Ionicons name="play" size={16} color="#059669" className="ml-0.5" />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Persistent Audio Player Bar */}
      {activeSurah && (
        <View 
          className="absolute bottom-28 left-4 right-4 bg-slate-900 rounded-3xl p-4 shadow-xl flex-row items-center justify-between z-20 border border-slate-800"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8
          }}
        >
          <TouchableOpacity 
            onPress={() => setShowReader(true)}
            className="flex-row items-center flex-1 mr-4"
          >
            <View className="w-10 h-10 bg-slate-800 rounded-xl items-center justify-center mr-3">
              <Text className="text-xl">📖</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-sm" numberOfLines={1}>
                {activeSurah.name}
              </Text>
              <Text className="text-slate-400 text-[10px] font-semibold">
                {isPlaying ? `Reciting Verse ${activeVerseNum}` : 'Audio Paused'}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              onPress={() => setShowReader(true)}
              className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center"
            >
              <Ionicons name="book" size={16} color="#94a3b8" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleTogglePlay}
              className="w-11 h-11 bg-emerald-500 rounded-full items-center justify-center"
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#ffffff" className={!isPlaying ? "ml-0.5" : ""} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Immersive Quran Reader Modal */}
      {activeSurah && (
        <Modal
          animationType="slide"
          visible={showReader}
          onRequestClose={() => setShowReader(false)}
        >
          <SafeAreaView className="flex-1 bg-white">
            
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
              <TouchableOpacity onPress={() => setShowReader(false)} className="p-1">
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-slate-900 font-extrabold text-base">Surah {activeSurah.name}</Text>
                <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">{activeSurah.translation}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => selectAndPlaySurah(activeSurah)}
                className="w-8 h-8 bg-emerald-50 rounded-full items-center justify-center"
              >
                <Ionicons name={isPlaying ? "pause" : "play"} size={14} color="#059669" />
              </TouchableOpacity>
            </View>

            {/* Verses Scroll view */}
            <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
              {activeSurah.verses.map((v: any) => {
                const isVerseActive = activeVerseNum === v.num;
                return (
                  <View 
                    key={v.num}
                    className={`py-5 border-b border-slate-100 rounded-2xl px-4 mb-3 ${
                      isVerseActive ? 'bg-emerald-50/40 border-l-4 border-l-emerald-600' : ''
                    }`}
                  >
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
                        <Text className="text-slate-500 text-[10px] font-bold">{v.num}</Text>
                      </View>
                      {isVerseActive && (
                        <Text className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">
                          🔊 Active Recitation
                        </Text>
                      )}
                    </View>

                    <Text className="text-right text-slate-900 text-2xl font-semibold font-arabic leading-loose mb-3">
                      {v.ar}
                    </Text>
                    
                    <Text className="text-slate-500 text-xs leading-relaxed font-sans mt-1">
                      {v.en}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Audio Control deck */}
            <View className="bg-slate-900 px-6 py-6 border-t border-slate-800">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-xs font-bold">Mishary Alafasy</Text>
                <Text className="text-slate-400 text-[10px] font-semibold">
                  Verse {activeVerseNum} of {activeSurah.verses.length}
                </Text>
              </View>
              
              {/* Progress Slider Mock */}
              <View className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
                <View 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${(activeVerseNum / activeSurah.verses.length) * 100}%` }} 
                />
              </View>

              <View className="flex-row items-center justify-center gap-6">
                <TouchableOpacity 
                  onPress={() => setActiveVerseNum(prev => Math.max(1, prev - 1))}
                  className="p-1"
                >
                  <Ionicons name="play-skip-back" size={20} color="#94a3b8" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleTogglePlay}
                  className="w-14 h-14 bg-emerald-500 rounded-full items-center justify-center shadow-lg"
                >
                  <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#ffffff" className={!isPlaying ? "ml-1" : ""} />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setActiveVerseNum(prev => Math.min(activeSurah.verses.length, prev + 1))}
                  className="p-1"
                >
                  <Ionicons name="play-skip-forward" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

          </SafeAreaView>
        </Modal>
      )}

    </SafeAreaView>
  );
}
