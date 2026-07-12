const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldGridStart = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">`;
const newGridStart = `<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">`;
content = content.replace(oldGridStart, newGridStart);

const oldItem = `              <div key={i} className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 hover:border-teal-500/50 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all group flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-2xl bg-teal-100/50 flex items-center justify-center mb-5 group-hover:bg-teal-500 transition-colors shrink-0">
                  <Star className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-zinc-900 mb-3 leading-tight">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>`;

const newItem = `              <div key={i} className="bg-zinc-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 hover:border-teal-500/50 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all group flex flex-col items-start text-left">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-100/50 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-teal-500 transition-colors shrink-0">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 mb-1.5 sm:mb-3 leading-tight">{f.title}</h3>
                <p className="text-[11px] sm:text-sm text-zinc-500 leading-relaxed line-clamp-3 sm:line-clamp-none">{f.desc}</p>
              </div>`;

content = content.replace(oldItem, newItem);
fs.writeFileSync('src/App.tsx', content);

