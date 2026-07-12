const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /\{\[\{"title":"Live Qur'an Reference Detection".*?\}\]\.map/s;

const newFeatures = `{[
  {"title":"Live Qur'an Reference Detection","desc":"Automatically identifies Surah and Ayah during a lecture and displays text, translation, and Tafsir."},
  {"title":"Live Hadith Detection","desc":"Detects Hadith in real-time, displaying source, narrator, grading, and translation."},
  {"title":"Live Mushaf Following","desc":"Mushaf auto-scrolls and highlights the exact word being recited in real time."},
  {"title":"Real-Time Tajweed Visualization","desc":"Highlights rules like Ikhfa and Qalqalah exactly when they occur in recitation."},
  {"title":"Semantic Islamic Search","desc":"Search naturally (e.g., 'Verses about forgiveness') instead of just keywords."},
  {"title":"Smart Lecture Recommendations","desc":"Suggests lectures based on Murāja'ah performance and study history."},
  {"title":"AI-Powered Q&A Search","desc":"Ask questions and get relevant lectures, verses, and authenticated Hadith."},
  {"title":"Unified Knowledge Graph","desc":"The core intelligence linking Qur'an, Hadith, lectures, and Murāja'ah together."}
].map`;

content = content.replace(regex, newFeatures);
fs.writeFileSync('src/App.tsx', content);
