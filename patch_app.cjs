const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!content.includes("import { HomeView } from './components/HomeView';")) {
  content = content.replace("import { EncyclopediaView } from './components/EncyclopediaView';", "import { HomeView } from './components/HomeView';\nimport { EncyclopediaView } from './components/EncyclopediaView';");
}

// 2. Remove HERO_TEMPLATES
const heroTemplatesStart = 'const HERO_TEMPLATES = [';
const heroTemplatesEnd = '];\n\n// Scientific Golden Age Timeline Database';
if (content.includes(heroTemplatesStart)) {
  const startIdx = content.indexOf(heroTemplatesStart);
  const endIdx = content.indexOf(heroTemplatesEnd, startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + '// Scientific Golden Age Timeline Database' + content.substring(endIdx + heroTemplatesEnd.length);
  }
}

// 3. Remove heroIndex
const heroStateStart = '  const [heroIndex, setHeroIndex]';
const heroStateEnd = '  }, [activeTab]);';
if (content.includes(heroStateStart)) {
  const startIdx = content.indexOf(heroStateStart);
  const endIdx = content.indexOf(heroStateEnd, startIdx) + heroStateEnd.length;
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
  }
}

// 4. Replace home tab block
const homeBlockStart = "{activeTab === 'home' && (";
const homeBlockEnd = "        {/* CURRICULUM SCREEN */}";

if (content.includes(homeBlockStart)) {
  const startIdx = content.indexOf(homeBlockStart);
  const endIdx = content.indexOf(homeBlockEnd, startIdx);
  
  if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `{activeTab === 'home' && (
          <HomeView lang={lang} setActiveTab={setActiveTab} />
        )}

        {/* CURRICULUM SCREEN */}`;
        
    content = content.substring(0, startIdx) + replacement + content.substring(endIdx + homeBlockEnd.length);
  }
}

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");
