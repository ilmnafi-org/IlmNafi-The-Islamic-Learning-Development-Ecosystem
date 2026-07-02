const fs = require('fs');

let content = fs.readFileSync('src/components/DailyView.tsx', 'utf8');

// I need to find where I broke it.
// The broken part starts at:
// {/* REDESIGNED COUNTER ZONE - Centered, Prominent */}
//                             <div className="flex justify-center items-center py-4">
//                               <motion.button 
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleTasbihBeadIncrement}

// And goes down to:
//                       <input

const searchStart = '{/* REDESIGNED COUNTER ZONE - Centered, Prominent */}';
const searchEnd = '                        type="checkbox"';

const startIdx = content.indexOf(searchStart);
const endIdx = content.indexOf(searchEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `{/* REDESIGNED COUNTER ZONE - Centered, Prominent */}
                            <div className="flex justify-center items-center py-4">
                              <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  triggerSynthClick(800, 'sine', 0.05);
                                  handleAdhkarIncrement(activeStep);
                                }}
                                disabled={(adhkarCompletedStates[activeStep.id] || 0) >= activeStep.targetCount}
                                className={\`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center border-4 shadow-xl cursor-pointer transition-all \${
                                  (adhkarCompletedStates[activeStep.id] || 0) >= activeStep.targetCount
                                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/30'
                                    : 'bg-white border-amber-100 text-slate-800 hover:border-amber-200'
                                }\`}
                              >
                                {((adhkarCompletedStates[activeStep.id] || 0) >= activeStep.targetCount) ? (
                                  <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 mb-1" />
                                ) : (
                                  <span className="text-4xl md:text-5xl font-black font-mono">
                                    {activeStep.targetCount - (adhkarCompletedStates[activeStep.id] || 0)}
                                  </span>
                                )}
                                <span className="text-[9px] uppercase tracking-widest font-bold opacity-80 mt-1">
                                  {lang === 'en' ? "Count" : "العدد"}: {adhkarCompletedStates[activeStep.id] || 0} / {activeStep.targetCount}
                                </span>
                              </motion.button>
                            </div>
                          </div>
                          
                          <p className="text-slate-600 text-sm md:text-base font-serif italic max-w-lg mx-auto mt-4">
                            {lang === 'en' ? activeStep.translationEn : activeStep.translationAr}
                          </p>
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 inline-block w-full max-w-lg text-left">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              {lang === 'en' ? "Transliteration" : "اللفظ"}
                            </span>
                            <p className="text-xs text-slate-700 font-mono leading-relaxed">
                              {activeStep.transliteration}
                            </p>
                          </div>
                        </div>

                        {/* Navigation Actions */}
                        <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => setAdhkarIndex(prev => Math.max(0, prev - 1))}
                            disabled={adhkarIndex === 0}
                            className={\`p-3 rounded-xl transition-all \${adhkarIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-700 bg-slate-50 hover:bg-slate-100'}\`}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={() => setAdhkarIndex(prev => Math.min(filteredAdhkar.length - 1, prev + 1))}
                            disabled={adhkarIndex === filteredAdhkar.length - 1}
                            className={\`p-3 rounded-xl transition-all \${adhkarIndex === filteredAdhkar.length - 1 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-700 bg-slate-50 hover:bg-slate-100'}\`}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* ADHKAR BOTTOM DRAWERS */}
      <AnimatePresence>
        {activeAdhkarDrawer === 'tasbih' && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => handleSetAdhkarDrawer(null)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-3xl shadow-2xl h-[85vh] md:h-[75vh] flex flex-col overflow-hidden"
            >
              <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex flex-col">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">{t.tasbih}</h3>
                  <p className="text-xs text-slate-500 font-medium">Digital Dhikr Counter</p>
                </div>
                <button 
                  onClick={() => handleSetAdhkarDrawer(null)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center pb-24 space-y-8">
                
                {/* Custom Wird Header */}
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.tasbihHeader}</span>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                      <button onClick={() => handleTargetChange(33)} className={\`px-3 py-1.5 text-[10px] font-bold transition-colors cursor-pointer \${customTarget === 33 ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}\`}>33</button>
                      <div className="w-[1px] h-4 bg-slate-200"></div>
                      <button onClick={() => handleTargetChange(100)} className={\`px-3 py-1.5 text-[10px] font-bold transition-colors cursor-pointer \${customTarget === 100 ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}\`}>100</button>
                      <div className="w-[1px] h-4 bg-slate-200"></div>
                      <button onClick={() => handleTargetChange(999)} className={\`px-3 py-1.5 text-[10px] font-bold transition-colors cursor-pointer \${customTarget === 999 ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}\`}>∞</button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="E.g., Subhanallah, Alhamdulillah..." 
                    value={customWirdText}
                    onChange={(e) => setCustomWirdText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-800"
                  />
                </div>

                <div className="flex justify-center items-center py-4 w-full">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTasbihBeadIncrement}
                    className="w-full max-w-sm aspect-[2/1] rounded-3xl bg-white text-slate-900 shadow-md border border-slate-200 flex flex-col items-center justify-center relative cursor-pointer outline-none select-none hover:shadow-lg transition-all group overflow-hidden"
                    id="bead-circle-counter"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                      <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: \`\${(tasbihCount / (customTarget || 33)) * 100}%\` }}></div>
                    </div>
                    
                    <span className="text-7xl font-black font-mono text-slate-900 mb-3 tracking-tighter">
                      {tasbihCount.toString().padStart(2, '0')}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                        Target: {customTarget || 33}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                        {(customTarget || 33) - tasbihCount} {lang === 'en' ? "Left" : "متبقٍ"}
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors"></div>
                  </motion.button>
                </div>
                
                {/* Haptic / Synth sound controls */}
                <div className="w-full max-w-md bg-slate-50 border border-slate-200/60 rounded-2xl p-4.5 flex flex-col gap-3 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                      <input
                        type="checkbox"`;

  content = content.substring(0, startIdx) + replacement + content.substring(endIdx + searchEnd.length);
  fs.writeFileSync('src/components/DailyView.tsx', content);
  console.log("Recovered DailyView.tsx");
} else {
  console.log("Could not find start/end.");
}
