const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// The bottom nav block starts with {/* GLOBAL MOBILE BOTTOM NAVIGATION - FLOATING */}
const bottomNavStart = "{/* GLOBAL MOBILE BOTTOM NAVIGATION - FLOATING */}";
const bottomNavEnd = "      )}"; // We need to match the end of that block.

const startIdx = content.indexOf(bottomNavStart);
if (startIdx !== -1) {
  // Find the exact end of the block.
  // We can just use string replacement.
  const regex = /\{\/\* GLOBAL MOBILE BOTTOM NAVIGATION - FLOATING \*\/\}([\s\S]*?)<\/nav>\s*<\/div>\s*\)\}/;
  content = content.replace(regex, "");
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched App.tsx to remove bottom nav");
} else {
  console.log("Could not find bottom nav block");
}
