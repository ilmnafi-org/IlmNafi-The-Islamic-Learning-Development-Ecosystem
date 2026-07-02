const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const navTransparentStr = `(activeTab === 'home' && !isScrolled)`;

const langToggleStart = `            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 bg-slate-50 hover:bg-amber-50 hover:text-amber-900 text-slate-700 rounded-xl px-3 py-1.5 border border-slate-200 transition-colors text-xs font-semibold"
              id="lang-toggle-nav"
            >`;

const langToggleEnd = `            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className={\`flex items-center gap-1 rounded-xl px-3 py-1.5 border transition-colors text-xs font-semibold \${${navTransparentStr} ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-slate-50 hover:bg-amber-50 hover:text-amber-900 text-slate-700 border-slate-200'}\`}
              id="lang-toggle-nav"
            >`;

content = content.replace(langToggleStart, langToggleEnd);

const profileBtnStart = `              <button
                onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); }}
                className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2 font-bold text-xs text-slate-800 transition shadow-sm outline-none"
                id="btn-profile-dropdown"
              >
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>{progress.username}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>`;

const profileBtnEnd = `              <button
                onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); }}
                className={\`flex items-center gap-1.5 border rounded-xl px-4 py-2 font-bold text-xs transition shadow-sm outline-none \${${navTransparentStr} ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'}\`}
                id="btn-profile-dropdown"
              >
                <User className={\`w-3.5 h-3.5 \${${navTransparentStr} ? 'text-emerald-300' : 'text-emerald-800'}\`} />
                <span>{progress.username}</span>
                <ChevronDown className={\`w-3 h-3 \${${navTransparentStr} ? 'text-emerald-200/70' : 'text-slate-400'}\`} />
              </button>`;

content = content.replace(profileBtnStart, profileBtnEnd);

const hamburgerStart = `            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -mr-1.5 text-slate-700 hover:text-emerald-900 bg-transparent rounded-lg border border-transparent hover:bg-slate-50 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>`;

const hamburgerEnd = `            <button
              onClick={() => setMobileMenuOpen(true)}
              className={\`p-1.5 -mr-1.5 rounded-lg border border-transparent cursor-pointer transition-colors \${${navTransparentStr} ? 'text-white hover:bg-white/20' : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-50'}\`}
            >
              <Menu className="w-5 h-5" />
            </button>`;

content = content.replace(hamburgerStart, hamburgerEnd);

fs.writeFileSync('src/App.tsx', content);
