const fs = require('fs');
let content = fs.readFileSync('src/components/DailyView.tsx', 'utf8');

const targetStr = `translationLang === 'en' ? activeStep.translation :`;
const replacementStr = `translationLang === 'en' ? activeStep.translationEn :`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/DailyView.tsx', content);
