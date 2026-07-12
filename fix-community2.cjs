const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">.*?<\/section>/s;

const newSection = `<div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 mt-8">
              {[
                { title: 'Public Groups', desc: 'Join halaqas', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Resources', desc: 'Docs & notes', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Rankings', desc: 'Milestones', icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Voice Notes', desc: 'Feedback', icon: <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Live', desc: 'Real-time', icon: <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> },
                { title: 'Mentors', desc: 'Find teacher', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" /> }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 bg-teal-800/50 p-2 sm:p-4 rounded-2xl border border-teal-700 hover:bg-teal-800 hover:border-teal-600 transition-all cursor-pointer group">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-teal-900/80 shadow-inner flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[10px] sm:text-sm text-teal-50 mb-0.5">{f.title}</h3>
                    <p className="text-[9px] sm:text-xs text-teal-200/70 leading-tight hidden sm:block">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>`;

content = content.replace(regex, newSection);
fs.writeFileSync('src/App.tsx', content);
