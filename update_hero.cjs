const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const heroStart = `            {/* PRESTIGE DESIGN HERO HERO SECTION WITH PICTURE OVERLAY LAYER */}
            <section 
              className="relative overflow-hidden py-24 md:py-36 text-center px-4 rounded-[2.5rem] w-[94%] max-w-7xl mx-auto bg-cover bg-center text-white shadow-[0_25px_60px_rgba(7,28,23,0.12)] border border-emerald-950/20"`;

const heroEnd = `            {/* PRESTIGE DESIGN HERO HERO SECTION WITH PICTURE OVERLAY LAYER */}
            <section 
              className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-36 text-center px-4 w-full mx-auto bg-cover bg-center text-white shadow-[0_25px_60px_rgba(7,28,23,0.12)] border border-emerald-950/20"`;

newContent = content.replace(heroStart, heroEnd);
fs.writeFileSync('src/App.tsx', newContent);
