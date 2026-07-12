import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Flame, Award, Sun, X, Mic, BookOpen, Users, ChevronRight, Star, Heart, ArrowRight, Play, BarChart3, Activity, Headphones, Trophy, CheckCircle, ShieldCheck, WifiOff, Globe2, Quote, ExternalLink } from 'lucide-react';

const AppleIcon = () => (
  <svg viewBox="0 0 384 512" fill="currentColor" className="w-6 h-6">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const PlayStoreIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
  </svg>
);

const PhoneFrame = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative w-[260px] md:w-[320px] h-[540px] md:h-[680px] bg-zinc-950 rounded-[3rem] md:rounded-[3.5rem] p-2 md:p-3 shadow-2xl border-4 border-zinc-800 ${className}`}>
    <div className="w-full h-full bg-white rounded-[2.5rem] md:rounded-[2.75rem] overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-5 md:h-6 bg-zinc-950 rounded-b-[1.25rem] md:rounded-b-[1.5rem] z-30 mx-12 md:mx-16" />
      {children}
    </div>
  </div>
);


const TypewriterText = ({ text, className = "" }: { text: string, className?: string }) => {
  const characters = Array.from(text);
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.03 } },
        hidden: {}
      }}
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Is Ilm Nafi completely free?", a: "The core Quran reading and listening features are completely free. We offer premium features for advanced Virtual Murāja'ah analytics." },
    { q: "Does speech recognition require internet?", a: "Yes, currently our AI models require an active internet connection to process Arabic pronunciation accurately." },
    { q: "Can I use it on multiple devices?", a: "Yes! Create an account and your progress, bookmarks, and community circles will sync across all your iOS and Android devices." },
    { q: "How do I join a study circle?", a: "Navigate to the Community tab in the app, where you can discover public circles or join private ones using an invite code." }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-zinc-900 selection:bg-teal-200 overflow-x-hidden">
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-6 pointer-events-none">
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-6xl transition-all duration-500 rounded-full bg-white/90 backdrop-blur-xl shadow-lg shadow-zinc-200/50 border border-zinc-200/50 py-3 px-2"
        >
          <div className="px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl text-white">📖</span>
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-zinc-900">Ilm Nafi</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">Features</a>
              <a href="#murajah" className="text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">Murāja'ah</a>
              <a href="#community" className="text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">Community</a>
              <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-teal-600 transition-colors">
                <span>Quran.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                <span>Use Web Version</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#download" className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-teal-600 transition-all shadow-md hover:-translate-y-0.5">
                Download Now
              </a>
            </nav>

            <button 
              className="md:hidden p-2 text-zinc-600 bg-zinc-100 rounded-full"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-x-4 top-4 z-[60] bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 p-6 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-xl text-white">📖</span>
                </div>
                <span className="text-xl font-display font-bold">Ilm Nafi</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-600">
                <X />
              </button>
            </div>
            <div className="flex flex-col gap-2">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Features</a>
            <a href="#murajah" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Murāja'ah</a>
            <a href="#community" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Community</a>
            <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-2xl font-display font-bold text-zinc-800 p-2 hover:bg-zinc-50 rounded-2xl">Quran.com <ExternalLink className="w-5 h-5 text-zinc-400" /></a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-display font-bold text-teal-600 p-2 hover:bg-teal-50 rounded-2xl">Use Web Version <ArrowRight className="w-5 h-5" /></a>
            </div>
            <div className="mt-4 pt-6 border-t border-zinc-100">
              <a href="#download" onClick={() => setMobileMenuOpen(false)} className="flex justify-center py-4 bg-teal-600 text-white text-lg font-bold rounded-2xl">
                Download the App
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 pb-20 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-teal-50/50 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm text-teal-700 text-sm font-semibold mb-8"
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            Available on iOS & Android
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-display font-extrabold tracking-tight mb-8 text-zinc-900 leading-[1.05]"
          >
            <TypewriterText text="The pocket-sized" /> <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Islamic hub.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-zinc-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Master your recitation with AI, explore the Holy Quran, and join a global community of learners—all from your smartphone.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-5 rounded-full text-lg font-bold hover:bg-zinc-800 transition-all hover:shadow-2xl hover:shadow-zinc-900/20 active:scale-95 group">
              <AppleIcon />
              <div className="text-left leading-tight">
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Download on the</div>
                <div>App Store</div>
              </div>
            </a>
            <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-teal-600 text-white px-8 py-5 rounded-full text-lg font-bold hover:bg-teal-500 transition-all hover:shadow-2xl hover:shadow-teal-600/20 active:scale-95">
              <PlayStoreIcon />
              <div className="text-left leading-tight">
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">GET IT ON</div>
                <div>Google Play</div>
              </div>
            </a>
            <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-zinc-900 border-2 border-zinc-200 px-8 py-5 rounded-full text-lg font-bold hover:border-teal-500 hover:text-teal-600 transition-all hover:shadow-2xl hover:shadow-zinc-200/50 active:scale-95 group">
              <Globe2 className="w-6 h-6 text-zinc-400 group-hover:text-teal-500 transition-colors" />
              <div className="text-left leading-tight">
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80 text-zinc-500">Visit Partner</div>
                <div>Quran.com</div>
              </div>
              <ExternalLink className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>

          {/* Three Phones Showcase - Premium Design */}
          <div className="mt-16 md:mt-24 relative h-[550px] md:h-[800px] w-full max-w-6xl mx-auto flex justify-center perspective-1000 overflow-hidden md:overflow-visible">
            
            {/* Left Phone: Al-Kahf & Live Tracking */}
            <motion.div 
              initial={{ opacity: 0, x: -50, rotateZ: -10 }}
              animate={{ opacity: 1, x: 0, rotateZ: -6 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.3 }}
              className="absolute left-1/2 -translate-x-[85%] md:-translate-x-[110%] top-12 md:top-24 z-10 origin-bottom shadow-2xl rounded-[3rem] scale-[0.85] md:scale-100"
            >
              <PhoneFrame>
                <div className="absolute inset-0 bg-zinc-950 pt-14 md:pt-16 px-5 text-white overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-teal-900 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4" />
                   <div className="relative z-10 h-full flex flex-col">
                     <div className="flex justify-between items-center mb-6 md:mb-8">
                       <div className="font-display font-bold text-lg md:text-xl text-teal-50">Surah Al-Kahf</div>
                       <div className="text-teal-300 text-xs md:text-sm border border-teal-800 bg-teal-900/50 px-3 py-1 rounded-full">Juz 15</div>
                     </div>
                     <div className="text-right font-arabic text-3xl md:text-4xl leading-[2.2] md:leading-[2.5] mb-6 md:mb-8 text-white drop-shadow-md">
                       ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ
                     </div>
                     <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md mb-auto">
                       <div className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                         All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.
                       </div>
                     </div>
                     <div className="mt-6 mb-6">
                       <div className="flex items-center justify-between gap-4 mb-4">
                         <div className="text-xs text-zinc-500 font-mono">0:12</div>
                         <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                           <div className="h-full w-1/3 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                         </div>
                         <div className="text-xs text-zinc-500 font-mono">-4:30</div>
                       </div>
                       <div className="flex justify-center items-center gap-6">
                         <div className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400"><X size={18} /></div>
                         <div className="w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-teal-900/50"><Play className="w-6 h-6 ml-1" /></div>
                         <div className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400"><Heart size={18} /></div>
                       </div>
                     </div>
                   </div>
                </div>
              </PhoneFrame>
            </motion.div>

            {/* Right Phone: Community & Insights */}
            <motion.div 
              initial={{ opacity: 0, x: 50, rotateZ: 10 }}
              animate={{ opacity: 1, x: 0, rotateZ: 6 }}
              transition={{ duration: 1.2, delay: 0.5, type: "spring", bounce: 0.3 }}
              className="absolute left-1/2 -translate-x-[15%] md:translate-x-[10%] top-12 md:top-24 z-10 origin-bottom shadow-2xl rounded-[3rem] scale-[0.85] md:scale-100"
            >
              <PhoneFrame>
                <div className="absolute inset-0 bg-zinc-50 pt-14 md:pt-16 px-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="font-display font-bold text-lg md:text-xl text-zinc-900">Global Halaqas</div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center text-amber-500"><Globe2 size={16} /></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600"><Users size={16} /></div>
                          <div>
                            <div className="font-bold text-sm text-zinc-900">Hifz Circle</div>
                            <div className="text-zinc-500 text-xs">Advanced Memorization</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-50 rounded-xl p-3 text-xs text-zinc-600 border border-zinc-100">
                        <span className="font-semibold text-teal-600">Update:</span> Brother Omar just completed Surah Ya-Sin! 🎉
                      </div>
                    </div>
                    
                    <div className="bg-amber-500 p-4 rounded-2xl shadow-md text-white relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-amber-400 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-amber-400/50 flex items-center justify-center"><Mic size={16} /></div>
                          <div>
                            <div className="font-bold text-sm">Tajweed Masterclass</div>
                            <div className="text-amber-100 text-xs">Shaykh Amin</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold bg-amber-600/30 p-2 rounded-xl">
                          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE NOW</span>
                          <span>1,240 watching</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><BookOpen size={16} /></div>
                        <div>
                          <div className="font-bold text-sm text-zinc-900">Tafsir Al-Jalalayn</div>
                          <div className="text-zinc-500 text-xs">New notes added for Al-Kahf</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PhoneFrame>
            </motion.div>

            {/* Center Phone: Virtual Muraja'ah */}
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.6, type: "spring", bounce: 0.4 }}
              className="absolute left-1/2 -translate-x-1/2 top-0 z-30 shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-[3rem]"
            >
              <PhoneFrame className="border-zinc-300">
                <div className="absolute inset-0 bg-white pt-14 md:pt-16 px-4 flex flex-col">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-50 rounded-full mx-auto mb-3 flex items-center justify-center text-teal-500 relative">
                      <div className="absolute inset-0 rounded-full border border-teal-200 animate-ping opacity-50" />
                      <Mic size={24} />
                    </div>
                    <div className="font-display font-bold text-lg md:text-xl text-zinc-900">Live AI Analysis</div>
                    <div className="text-teal-600 text-xs md:text-sm font-semibold">Listening to Al-Fatihah...</div>
                  </div>
                  
                  <div className="bg-zinc-50 p-5 md:p-6 rounded-3xl border border-zinc-100 flex-1 relative overflow-hidden">
                    <div className="space-y-6 md:space-y-8 mt-2">
                      <div className="text-right font-arabic text-3xl md:text-4xl text-zinc-800 leading-[2.2] md:leading-[2.5]">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                      <div className="text-right font-arabic text-3xl md:text-4xl text-zinc-800 leading-[2.2] md:leading-[2.5] relative">
                        <span className="text-teal-500 bg-teal-50 rounded-lg px-1">الْحَمْدُ</span> لِلَّهِ رَبِّ الْعَالَمِينَ
                      </div>
                      <div className="text-right font-arabic text-3xl md:text-4xl text-zinc-300 leading-[2.2] md:leading-[2.5] blur-[1px]">
                        الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                    </div>
                    
                    {/* Live Waveform Mock */}
                    <div className="absolute bottom-6 inset-x-6 h-12 flex items-center justify-center gap-1 opacity-50">
                       {[40, 70, 45, 90, 65, 100, 80, 50, 85, 40, 60, 30].map((h, i) => (
                         <div key={i} className="w-1.5 bg-teal-400 rounded-full" style={{ height: `${h}%` }} />
                       ))}
                    </div>
                  </div>
                  
                  {/* Floating Action Bar */}
                  <div className="absolute bottom-6 inset-x-6 bg-zinc-900 rounded-full p-2 flex items-center justify-between shadow-2xl">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"><X size={16} className="text-zinc-400" /></div>
                    <div className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Recording
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center"><CheckCircle size={16} className="text-white" /></div>
                  </div>
                </div>
              </PhoneFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curved Stats Section */}
      <section className="relative z-40 -mt-16 md:-mt-32 px-4">
        <div className="bg-teal-900 text-white rounded-[3rem] shadow-2xl max-w-6xl mx-auto py-16 px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <div className="text-4xl md:text-5xl font-display font-extrabold text-teal-300 mb-2">50K+</div>
            <div className="text-sm font-semibold text-teal-100/80 uppercase tracking-wider">Active Users</div>
          </div>
          <div className="relative z-10">
            <div className="text-4xl md:text-5xl font-display font-extrabold text-teal-300 mb-2">1M+</div>
            <div className="text-sm font-semibold text-teal-100/80 uppercase tracking-wider">Ayahs Recited</div>
          </div>
          <div className="relative z-10">
            <div className="text-4xl md:text-5xl font-display font-extrabold text-teal-300 mb-2">4.9/5</div>
            <div className="text-sm font-semibold text-teal-100/80 uppercase tracking-wider">App Store Rating</div>
          </div>
          <div className="relative z-10">
            <div className="text-4xl md:text-5xl font-display font-extrabold text-teal-300 mb-2">120+</div>
            <div className="text-sm font-semibold text-teal-100/80 uppercase tracking-wider">Countries</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-teal-600 tracking-widest uppercase mb-4">Simple Process</h2>
            <h3 className="text-4xl md:text-6xl font-display font-extrabold text-zinc-900 mb-6">Start learning in seconds.</h3>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">A seamless onboarding experience designed to get you reading and reciting immediately.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-teal-100 via-teal-500 to-teal-100 -z-10 -translate-y-1/2 opacity-50" />
            {[
              { step: "01", title: "Create your profile", desc: "Set your daily goals and choose your preferred recitation style and Qari." },
              { step: "02", title: "Start reciting", desc: "Use the Virtual Murāja'ah or read along with the interactive Quran text." },
              { step: "03", title: "Track progress", desc: "Get detailed insights, maintain streaks, and watch your fluency improve." }
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/50 relative z-10 text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-6 shadow-lg shadow-teal-600/30">
                  {s.step}
                </div>
                <h4 className="text-2xl font-display font-bold mb-4">{s.title}</h4>
                <p className="text-zinc-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Comprehensive Features Section */}
      <section id="features" className="py-24 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-bold uppercase tracking-wider text-sm mb-3 block">Comprehensive Toolkit</span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">
               <TypewriterText text="Next-generation Islamic learning." />
            </h2>
            <p className="text-lg md:text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed">Everything you need to study the Deen, powered by advanced technology that understands the context of Qur'an, Hadith, and scholarly lectures.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
  {"title":"Live Qur'an Reference Detection","desc":"Automatically identifies Surah and Ayah during a lecture and displays text, translation, and Tafsir."},
  {"title":"Live Hadith Detection","desc":"Detects Hadith in real-time, displaying source, narrator, grading, and translation."},
  {"title":"Live Mushaf Following","desc":"Mushaf auto-scrolls and highlights the exact word being recited in real time."},
  {"title":"Real-Time Tajweed Visualization","desc":"Highlights rules like Ikhfa and Qalqalah exactly when they occur in recitation."},
  {"title":"Semantic Islamic Search","desc":"Search naturally (e.g., 'Verses about forgiveness') instead of just keywords."},
  {"title":"Smart Lecture Recommendations","desc":"Suggests lectures based on Murāja'ah performance and study history."},
  {"title":"AI-Powered Q&A Search","desc":"Ask questions and get relevant lectures, verses, and authenticated Hadith."},
  {"title":"Unified Knowledge Graph","desc":"The core intelligence linking Qur'an, Hadith, lectures, and Murāja'ah together."}
].map((f, i) => (
              <div key={i} className="bg-zinc-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 hover:border-teal-500/50 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all group flex flex-col items-start text-left">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-100/50 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-teal-500 transition-colors shrink-0">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 mb-1.5 sm:mb-3 leading-tight">{f.title}</h3>
                <p className="text-[11px] sm:text-sm text-zinc-500 leading-relaxed line-clamp-3 sm:line-clamp-none">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* World-Class Reciters */}
      <section className="py-32 bg-zinc-900 text-white px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/40 via-zinc-900 to-zinc-900 -z-10" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 border border-zinc-700">
              <Headphones className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight"><TypewriterText text="Listen to the world's best." /></h2>
            <p className="text-xl text-zinc-400 leading-relaxed mb-8">Immerse yourself in the beautiful voices of renowned Qaris from across the globe. High-quality audio playback synced perfectly with the Uthmani script.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {['Mishary Alafasy', 'Abdul Basit', 'Mahmoud Al-Husary', 'Saud Al-Shuraim', 'Maher Al-Muaiqly', 'Yasser Al-Dosari', 'Nasser Al Qatami', 'Bandar Baleela', 'Abu Bakr Al-Shatri', 'Ali Jaber', 'Muhammad Ayyub', 'Abdullah Basfar'].map((q, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2 bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800 hover:border-teal-500/50 transition-all cursor-pointer group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500/20 rounded-full flex items-center justify-center group-hover:bg-teal-500 transition-colors shrink-0">
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-display font-bold text-[10px] sm:text-xs leading-tight">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-amber-500/20 rounded-full blur-3xl opacity-50" />
            
            {/* Background Mini Player 1 */}
            <div className="hidden md:block absolute top-20 right-10 md:-right-4 w-48 bg-zinc-800/80 backdrop-blur-xl rounded-[2rem] p-4 border border-zinc-700 shadow-2xl rotate-6 hover:rotate-0 transition-transform z-0">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-amber-500" /></div>
                 <div className="min-w-0">
                   <div className="text-sm font-bold truncate">Surah Yaseen</div>
                   <div className="text-[10px] text-zinc-400 truncate">Abdul Basit</div>
                 </div>
               </div>
               <div className="h-1 w-full bg-zinc-700 rounded-full overflow-hidden">
                 <div className="h-full w-2/3 bg-amber-500 rounded-full" />
               </div>
            </div>

            {/* Background Mini Player 2 */}
            <div className="hidden md:block absolute bottom-24 left-10 md:-left-8 w-56 bg-teal-900/80 backdrop-blur-xl rounded-[2rem] p-4 border border-teal-700 shadow-2xl -rotate-6 hover:rotate-0 transition-transform z-20">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-teal-950 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-teal-400" /></div>
                 <div className="min-w-0">
                   <div className="text-sm font-bold text-white truncate">Surah Al-Mulk</div>
                   <div className="text-[10px] text-teal-200 truncate">Maher Al-Muaiqly</div>
                 </div>
               </div>
               <div className="flex items-center justify-between gap-3">
                 <div className="h-1 flex-1 bg-teal-950 rounded-full overflow-hidden">
                   <div className="h-full w-1/4 bg-teal-400 rounded-full" />
                 </div>
                 <Play className="w-4 h-4 text-teal-400" />
               </div>
            </div>

            {/* Background Mini Player 3 */}
            <div className="hidden md:block absolute top-1/2 -right-8 w-52 bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-4 border border-zinc-700 shadow-2xl rotate-3 hover:rotate-0 transition-transform z-10">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-teal-900/50 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-teal-400" /></div>
                 <div className="min-w-0">
                   <div className="text-sm font-bold text-white truncate">Surah Ar-Rahman</div>
                   <div className="text-[10px] text-teal-200 truncate">Mishary Rashid Alafasy</div>
                 </div>
               </div>
               <div className="flex items-center justify-between gap-3">
                 <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full w-1/2 bg-teal-400 rounded-full" />
                 </div>
                 <Play className="w-4 h-4 text-teal-400" />
               </div>
            </div>

            <div className="relative z-10 w-full max-w-sm bg-zinc-950 rounded-[3rem] p-6 border border-zinc-800 shadow-2xl">
               <div className="aspect-square bg-zinc-900 rounded-[2rem] mb-8 border border-zinc-800 flex items-center justify-center p-8 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20" />
                 <BookOpen className="w-24 h-24 text-teal-500/50" />
               </div>
               <div className="text-center mb-8">
                 <h4 className="font-display font-bold text-2xl">Surah Ar-Rahman</h4>
                 <p className="text-zinc-500">Mishary Rashid Alafasy</p>
               </div>
               <div className="flex items-center justify-between gap-4 mb-4">
                 <span className="text-xs text-zinc-500">01:24</span>
                 <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full w-1/3 bg-teal-500 rounded-full" />
                 </div>
                 <span className="text-xs text-zinc-500">04:15</span>
               </div>
               <div className="flex items-center justify-center gap-8">
                 <Play className="w-16 h-16 text-teal-500 fill-teal-500" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="py-24 md:py-32 px-6 bg-zinc-50 overflow-hidden relative border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="flex-1 w-full">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-8 border border-amber-200 shadow-sm">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-900 mb-6 leading-tight">Turn learning into a habit.</h2>
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-8">Stay motivated with daily streaks, achievement badges, and milestone celebrations. Our gamified system makes consistent recitation engaging and rewarding.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { title: "7 Day Streak", icon: <Flame className="w-6 h-6 text-orange-500" />, color: "from-orange-100 to-orange-50", borderColor: "border-orange-200" },
                 { title: "Juz Amma", icon: <Award className="w-6 h-6 text-amber-500" />, color: "from-amber-100 to-amber-50", borderColor: "border-amber-200" },
                 { title: "Early Bird", icon: <Sun className="w-6 h-6 text-blue-500" />, color: "from-blue-100 to-blue-50", borderColor: "border-blue-200" },
                 { title: "100 Ayahs", icon: <Star className="w-6 h-6 text-teal-500" />, color: "from-teal-100 to-teal-50", borderColor: "border-teal-200" }
               ].map((b, i) => (
                 <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                   <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${b.color} border ${b.borderColor} flex items-center justify-center shadow-inner shrink-0`}>
                     {b.icon}
                   </div>
                   <span className="font-bold text-zinc-800">{b.title}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="flex-1 relative w-full h-[400px] md:h-[500px]">
            {/* Detailed Analytics Chart */}
            <div className="absolute inset-0 bg-white rounded-[3rem] p-6 md:p-10 border border-zinc-200 shadow-xl flex flex-col justify-end">
                <div className="absolute top-6 md:top-10 left-6 md:left-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="font-bold text-lg md:text-xl text-zinc-900">Activity</div>
                  </div>
                  <div className="text-sm text-zinc-500">Weekly recitation minutes</div>
                </div>
                <div className="flex items-end justify-between gap-2 md:gap-4 h-48 md:h-64 mt-auto">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <div key={i} className="w-full relative group h-full flex flex-col justify-end">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {h} mins
                      </div>
                      <div className="w-full bg-teal-500 rounded-t-xl hover:bg-teal-400 transition-colors" style={{ height: `${h}%` }} />
                      <div className="text-center mt-3 text-xs md:text-sm text-zinc-400 font-medium">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-32 px-6 bg-teal-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-800 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-30" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-display font-extrabold mb-8 tracking-tight">Begin your journey today.</h2>
          <p className="text-xl md:text-2xl text-teal-100/90 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">Join thousands of users enhancing their Islamic knowledge with Ilm Nafi.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <button className="flex items-center justify-center gap-4 bg-white text-zinc-900 px-10 py-6 rounded-full hover:bg-zinc-50 transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-white/20">
                <AppleIcon />
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Download on the</div>
                  <div className="font-display font-extrabold text-2xl">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center gap-4 bg-zinc-900 text-white px-10 py-6 rounded-full hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-zinc-900/20">
                <PlayStoreIcon />
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">Get it on</div>
                  <div className="font-display font-extrabold text-2xl">Google Play</div>
                </div>
              </button>
          </div>
        </div>
      </section>

      {/* Daily Reflection Section */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-bold uppercase tracking-wider text-sm">Ayah of the Day</span>
            <h2 className="text-4xl font-display font-bold mt-2"><TypewriterText text="Daily Reflection" /></h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            <Quote className="w-12 h-12 text-teal-100 mb-6" />
            <div className="text-right font-arabic text-4xl md:text-5xl text-zinc-900 leading-[2.5] mb-8">
              فَإِنَّ مَعَ الْعُسْرِ يُسْرًا 
            </div>
            <div className="text-lg md:text-xl text-zinc-600 font-serif italic leading-relaxed mb-6">
              <TypewriterText text={'"For indeed, with hardship [will be] ease."'} />
            </div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Surah Ash-Sharh (94:5)
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-50 py-16 px-6 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white">📖</span>
            </div>
            <span className="font-display font-extrabold text-xl text-zinc-900">Ilm Nafi</span>
          </div>
          
          <div className="flex gap-8 text-sm font-bold text-zinc-500">
            <a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Contact</a>
          </div>
          
          <div className="text-sm font-medium text-zinc-400 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-rose-500 mx-1" /> for the Ummah
          </div>
        </div>
      </footer>
    </div>
  );
}
