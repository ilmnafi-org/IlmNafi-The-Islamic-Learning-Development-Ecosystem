const fs = require('fs');

const appContent = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = appContent.indexOf("{activeTab === 'home' && (");
const endIdx = appContent.indexOf("{/* CURRICULUM SCREEN */}");

const homeSection = appContent.substring(startIdx, endIdx);
fs.writeFileSync('home_section.txt', homeSection);
console.log("Extracted");
