const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace sticky with fixed and add dynamic background
const navStart = `      {/* FULL WIDTH STICKY TOP NAVBAR */}
      <nav 
        className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm z-[80] transition-all min-h-[4rem] h-auto lg:h-16 py-2.5 lg:py-0 px-4 md:px-6 lg:px-8 flex flex-row flex-nowrap items-center justify-between gap-1.5 overflow-visible" 
        id="app-top-navbar"
      >`;

const navEnd = `      {/* FULL WIDTH STICKY TOP NAVBAR */}
      <nav 
        className={\`fixed top-0 left-0 w-full z-[80] transition-all duration-300 min-h-[4rem] h-auto lg:h-16 py-2.5 lg:py-0 px-4 md:px-6 lg:px-8 flex flex-row flex-nowrap items-center justify-between gap-1.5 overflow-visible \${
          activeTab === 'home' && !isScrolled
            ? 'bg-transparent border-transparent text-white' 
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-900'
        }\`}
        id="app-top-navbar"
      >`;

let newContent = content.replace(navStart, navEnd);

// For the logo text colors:
// We need to pass down the navTransparent state or just use global CSS maybe?
// Let's just do it directly.

const logoStart = `        <button 
          onClick={() => { setActiveTab('home'); setShowMoreNav(false); }} 
          className="font-extrabold text-[#004d3d] tracking-tight cursor-pointer py-1 text-left flex items-center gap-1.5 md:gap-2 outline-none focus:outline-none shrink-0"
          id="brand-logo"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-700/10 flex items-center justify-center text-amber-800 font-extrabold border border-amber-850/15 shrink-0 select-none">
            ع
          </span>
          <div className="flex flex-col items-start leading-none whitespace-nowrap">
            <span className="text-xs sm:text-sm font-extrabold">{labels.brand}</span>
            <span className="text-[8px] sm:text-[9px] text-amber-800 font-semibold mt-0.5">{labels.desc}</span>
          </div>
        </button>`;

const navTransparentStr = `(activeTab === 'home' && !isScrolled)`;

const logoEnd = `        <button 
          onClick={() => { setActiveTab('home'); setShowMoreNav(false); }} 
          className={\`font-extrabold tracking-tight cursor-pointer py-1 text-left flex items-center gap-1.5 md:gap-2 outline-none focus:outline-none shrink-0 \${${navTransparentStr} ? 'text-white' : 'text-[#004d3d]'}\`}
          id="brand-logo"
        >
          <span className={\`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold border shrink-0 select-none \${${navTransparentStr} ? 'bg-white/20 text-white border-white/30' : 'bg-amber-700/10 text-amber-800 border-amber-850/15'}\`}>
            ع
          </span>
          <div className="flex flex-col items-start leading-none whitespace-nowrap">
            <span className="text-xs sm:text-sm font-extrabold">{labels.brand}</span>
            <span className={\`text-[8px] sm:text-[9px] font-semibold mt-0.5 \${${navTransparentStr} ? 'text-emerald-100' : 'text-amber-800'}\`}>{labels.desc}</span>
          </div>
        </button>`;

newContent = newContent.replace(logoStart, logoEnd);


// Fix nav buttons
const linksStart = `          <div className="flex items-center justify-center gap-1 xl:gap-1.5 font-medium text-[10px] xl:text-[12px] whitespace-nowrap py-1 px-1.5 xl:px-3 overflow-x-auto scroller-hidden select-none flex-nowrap scroll-smooth" id="desktop-nav-links-center">
            <button 
              onClick={() => { setActiveTab('curriculum'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'curriculum' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

const linksEnd = `          <div className="flex items-center justify-center gap-1 xl:gap-1.5 font-medium text-[10px] xl:text-[12px] whitespace-nowrap py-1 px-1.5 xl:px-3 overflow-x-auto scroller-hidden select-none flex-nowrap scroll-smooth" id="desktop-nav-links-center">
            <button 
              onClick={() => { setActiveTab('curriculum'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'curriculum' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : ${navTransparentStr} ? 'text-slate-100 hover:text-white hover:bg-white/10 border border-transparent' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

newContent = newContent.replace(linksStart, linksEnd);

const coachLinkStart = `            <button 
              onClick={() => { setActiveTab('coach'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'coach' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

const coachLinkEnd = `            <button 
              onClick={() => { setActiveTab('coach'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'coach' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : ${navTransparentStr} ? 'text-slate-100 hover:text-white hover:bg-white/10 border border-transparent' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

newContent = newContent.replace(coachLinkStart, coachLinkEnd);

const quranLinkStart = `            <button 
              onClick={() => { setActiveTab('quran'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'quran' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-550/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

const quranLinkEnd = `            <button 
              onClick={() => { setActiveTab('quran'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'quran' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-550/15' 
                  : ${navTransparentStr} ? 'text-slate-100 hover:text-white hover:bg-white/10 border border-transparent' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

newContent = newContent.replace(quranLinkStart, quranLinkEnd);

const dailyLinkStart = `            <button 
              onClick={() => { setActiveTab('daily'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'daily' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;
              
const dailyLinkEnd = `            <button 
              onClick={() => { setActiveTab('daily'); setShowMoreNav(false); }}
              className={\`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 \${
                activeTab === 'daily' 
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15' 
                  : ${navTransparentStr} ? 'text-slate-100 hover:text-white hover:bg-white/10 border border-transparent' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

newContent = newContent.replace(dailyLinkStart, dailyLinkEnd);

const hubLinkStart = `            <button 
              onClick={(e) => { e.stopPropagation(); setShowMoreNav(!showMoreNav); }}
              className={\`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 relative \${
                ['community', 'dashboard', 'settings', 'issue-tracker', 'privacy', 'terms', 'academic'].includes(activeTab)
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15'
                  : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

const hubLinkEnd = `            <button 
              onClick={(e) => { e.stopPropagation(); setShowMoreNav(!showMoreNav); }}
              className={\`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 relative \${
                ['community', 'dashboard', 'settings', 'issue-tracker', 'privacy', 'terms', 'academic'].includes(activeTab)
                  ? 'text-amber-900 bg-amber-500/10 font-extrabold border border-amber-500/15'
                  : ${navTransparentStr} ? 'text-slate-100 hover:text-white hover:bg-white/10 border border-transparent' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-50 border border-transparent'
              }\`}`;

newContent = newContent.replace(hubLinkStart, hubLinkEnd);


// Update space filler
const fillerStart = `      {/* SPACE FILLER FOR NAV BAR */}
      <div className="h-20 sm:h-24"></div>`;

const fillerEnd = `      {/* SPACE FILLER FOR NAV BAR */}
      {activeTab !== 'home' && <div className="h-20 sm:h-24 pt-4"></div>}`;

newContent = newContent.replace(fillerStart, fillerEnd);

fs.writeFileSync('src/App.tsx', newContent);
