const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /\{\/\* Three Phones Showcase - Premium Design \*\/}.*?\{\/\* Curved Stats Section \*\/\}/s;

const newPhones = `{/* Three Phones Showcase - Premium Design */}
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
                         <div key={i} className="w-1.5 bg-teal-400 rounded-full" style={{ height: \`\${h}%\` }} />
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

      {/* Curved Stats Section */}`;

content = content.replace(regex, newPhones);
fs.writeFileSync('src/App.tsx', content);

