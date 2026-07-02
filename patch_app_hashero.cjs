const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// We want to replace all occurrences of `activeTab === 'home'` with `['home', 'curriculum', 'quran'].includes(activeTab)` inside the navbar className logic.
const oldCond = "activeTab === 'home' && !isScrolled";
const newCond = "['home', 'curriculum', 'quran'].includes(activeTab) && !isScrolled";

content = content.replace(new RegExp(oldCond.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'g'), newCond);

const oldFiller = "{activeTab !== 'home' && <div className=\"h-20 sm:h-24 pt-4\"></div>}";
const newFiller = "{!['home', 'curriculum', 'quran'].includes(activeTab) && <div className=\"h-20 sm:h-24 pt-4\"></div>}";
content = content.replace(oldFiller, newFiller);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx for hasHero");
