const fs = require('fs');

let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// The hero section pb-32 md:pb-40 -> pb-16 md:pb-24
content = content.replace("pb-32 md:pb-40", "pb-16 md:pb-24");

fs.writeFileSync('src/components/HomeView.tsx', content);
console.log("Patched HomeView.tsx for spacing");
