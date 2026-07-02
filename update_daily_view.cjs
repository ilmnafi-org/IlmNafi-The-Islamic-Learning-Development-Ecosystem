const fs = require('fs');
let content = fs.readFileSync('src/components/DailyView.tsx', 'utf8');

const targetStart = `                            {/* Audio Pronunciation & Copy Actions Overlay bar */}`;
const targetEnd = `                    {/* Metadata on Virtue Context */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[11px] leading-relaxed">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="font-extrabold text-[#503020] uppercase tracking-wider block mb-1">
                          📖 {t.sourceLabel}
                        </span>
                        <p className="text-slate-650 italic select-all font-mono">{activeStep.source}</p>
                      </div>
                      <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/60">
                        <span className="font-extrabold text-amber-905 uppercase tracking-wider block mb-1">
                          ✨ {t.virtueLabel}
                        </span>
                        <p className="text-slate-600 text-justify">
                          {lang === 'en' ? activeStep.virtueEn : activeStep.virtueAr}
                        </p>
                      </div>
                    </div>`;

const startIndex = content.indexOf(targetStart);
if (startIndex === -1) {
  console.log("Start not found");
  process.exit(1);
}

const endIndex = content.indexOf(targetEnd, startIndex);
if (endIndex === -1) {
  console.log("End not found");
  process.exit(1);
}

const newContent = `                            {/* Audio Pronunciation & Copy Actions Overlay bar */}
                            <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                              <button
                                onClick={() => handleTTS(activeStep.arabic, 'ar', activeStep.id + '-ar')}
                                className={\`p-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border \${
                                  isCurrentlyReading === activeStep.id + '-ar'
                                    ? 'bg-amber-800 text-white border-amber-600 shadow-sm'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                                }\`}
                                title={lang === 'en' ? "Pronounce Arabic text" : "الاستماع للنطق العربي"}
                              >
                                {isCurrentlyReading === activeStep.id + '-ar' ? <VolumeX className="w-4 h-4 animate-pulse text-amber-300" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
                                <span>{lang === 'en' ? "Arabic Audio" : "نطق الذكر"}</span>
                              </button>

                              <button
                                onClick={() => handleCopy(activeStep.arabic, activeStep.id)}
                                className={\`p-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border \${
                                  copiedId === activeStep.id
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                                }\`}
                                title={lang === 'en' ? "Copy Arabic to clipboard" : "نسخ النص العربي"}
                              >
                                <Check className={\`w-4 h-4 text-emerald-600 transition \${copiedId === activeStep.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0 hidden'}\`} />
                                {copiedId !== activeStep.id && <Bookmark className="w-4 h-4 text-slate-400" />}
                                <span>{copiedId === activeStep.id ? (lang === 'en' ? "Copied" : "تم النسخ") : (lang === 'en' ? "Copy" : "نسخ")}</span>
                              </button>

                              <button
                                onClick={() => handleShare(activeStep)}
                                className="p-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                                title={lang === 'en' ? "Share this Adhkar" : "مشاركة هذا الذكر"}
                              >
                                <Share2 className="w-4 h-4 text-slate-500" />
                                <span>{lang === 'en' ? "Share" : "مشاركة"}</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Translation & Transliteration Box */}
                          <div className="bg-slate-50 rounded-2xl p-4 md:p-6 space-y-4 border border-slate-100 text-left">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                              <div className="flex flex-wrap items-center gap-1">
                                {[
                                  { code: 'en', label: 'English' },
                                  { code: 'ar', label: 'العربية' },
                                  { code: 'ur', label: 'اردو' },
                                  { code: 'ha', label: 'Hausa' }
                                ].map((item) => (
                                  <button
                                    key={item.code}
                                    onClick={() => setTranslationLang(item.code as any)}
                                    className={\`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition cursor-pointer select-none \${
                                      translationLang === item.code
                                        ? 'bg-amber-900 text-white shadow-xs'
                                        : 'bg-slate-200/50 text-slate-600 hover:text-slate-800'
                                    }\`}
                                  >
                                    {item.label}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => {
                                  const textToRead = 
                                    translationLang === 'en' ? activeStep.translationEn :
                                    translationLang === 'ar' ? activeStep.translationAr :
                                    translationLang === 'ur' ? activeStep.translationUr :
                                    activeStep.translationHa;
                                  handleTTS(textToRead, translationLang, activeStep.id + '-tr');
                                }}
                                className={\`p-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer border \${
                                  isCurrentlyReading === activeStep.id + '-tr'
                                    ? 'bg-indigo-800 text-white border-indigo-600 shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                                }\`}
                                title={lang === 'en' ? "Read translation out loud" : "قراءة الترجمة"}
                              >
                                {isCurrentlyReading === activeStep.id + '-tr' ? <VolumeX className="w-3.5 h-3.5 animate-pulse text-indigo-300" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                                <span className="hidden sm:inline">{lang === 'en' ? "Listen" : "استماع"}</span>
                              </button>
                            </div>
                            
                            <div className="text-sm md:text-base text-slate-800 font-medium leading-relaxed">
                              {translationLang === 'en' && activeStep.translationEn}
                              {translationLang === 'ar' && activeStep.translationAr}
                              {translationLang === 'ur' && activeStep.translationUr}
                              {translationLang === 'ha' && activeStep.translationHa}
                            </div>
                            
                            <div className="pt-3 mt-3 border-t border-slate-200/60">
                              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Transliteration</p>
                              <div className="text-xs text-slate-600 italic leading-relaxed">
                                {activeStep.transliteration}
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Metadata on Virtue Context */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-left">
                            <span className="font-extrabold text-[#503020] uppercase tracking-wider block mb-1">
                              📖 {t.sourceLabel}
                            </span>
                            <p className="text-slate-600 italic select-all font-mono">{activeStep.source}</p>
                          </div>
                          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100/60 text-left">
                            <span className="font-extrabold text-amber-900 uppercase tracking-wider block mb-1">
                              ✨ {t.virtueLabel}
                            </span>
                            <p className="text-slate-600 text-justify">
                              {lang === 'en' ? activeStep.virtueEn : activeStep.virtueAr}
                            </p>
                          </div>
                        </div>`;

fs.writeFileSync('src/components/DailyView.tsx', content.substring(0, startIndex) + newContent + content.substring(endIndex + targetEnd.length));
console.log("Replaced successfully!");
