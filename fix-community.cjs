const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">.*?<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*\}\)\}\s*<\/div>/s;

content = content.replace(regex, '');

const regex2 = /<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">\s*\{\[\s*\{\s*title: 'Public Study Groups'.*?\}\)\}\s*<\/div>/s;

const newCommunityGrid = `<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {[
                { title: 'Public Groups', desc: 'Join halaqas', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Resource Share', desc: 'Docs & audio', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Leaderboards', desc: 'Milestones', icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Voice Notes', desc: 'Direct feedback', icon: <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Live Sessions', desc: 'Real-time', icon: <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Mentors', desc: 'Find a teacher', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 bg-teal-800/50 p-3 sm:p-4 rounded-2xl border border-teal-700 hover:bg-teal-800 hover:border-teal-600 transition-all cursor-pointer group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-teal-900/80 shadow-inner flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[11px] sm:text-sm text-teal-50 mb-0.5">{f.title}</h3>
                    <p className="text-[10px] sm:text-xs text-teal-200/70 leading-tight">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>`;

content = content.replace(regex2, newCommunityGrid);
fs.writeFileSync('src/App.tsx', content);
