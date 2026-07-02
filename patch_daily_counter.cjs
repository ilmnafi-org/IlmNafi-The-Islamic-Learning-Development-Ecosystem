const fs = require('fs');

let content = fs.readFileSync('src/components/DailyView.tsx', 'utf8');

const oldCounterStart = '                <motion.button \n                  whileTap={{ scale: 0.93 }}\n                  onClick={handleTasbihBeadIncrement}\n                  className="w-56 h-56 rounded-full bg-gradient-to-tr from-[#1b1c1e] via-[#334155] to-slate-900 text-white shadow-2xl flex flex-col items-center justify-center relative cursor-pointer outline-none border-[12px] border-amber-50 shrink-0 select-none group"\n                  id="bead-circle-counter"\n                >';
const oldCounterEnd = '                </motion.button>';

const newCounter = `                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTasbihBeadIncrement}
                  className="w-full max-w-sm aspect-[2/1] rounded-3xl bg-white text-slate-900 shadow-md border border-slate-200 flex flex-col items-center justify-center relative cursor-pointer outline-none select-none hover:shadow-lg transition-all group overflow-hidden"
                  id="bead-circle-counter"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                    <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: \`\${(tasbihCount / (customWirdText ? customTarget : 33)) * 100}%\` }}></div>
                  </div>
                  
                  <span className="text-7xl font-black font-mono text-slate-900 mb-3 tracking-tighter">
                    {tasbihCount.toString().padStart(2, '0')}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                      Target: {customWirdText ? customTarget : 33}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                      {(customWirdText ? customTarget : 33) - tasbihCount} {lang === 'en' ? "Left" : "متبقٍ"}
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors"></div>
                </motion.button>`;

const startIdx = content.indexOf(oldCounterStart);
if (startIdx !== -1) {
  const endIdx = content.indexOf(oldCounterEnd, startIdx) + oldCounterEnd.length;
  content = content.substring(0, startIdx) + newCounter + content.substring(endIdx);
  fs.writeFileSync('src/components/DailyView.tsx', content);
  console.log("Patched DailyView.tsx for counter");
} else {
  console.log("Could not find old counter block");
}
