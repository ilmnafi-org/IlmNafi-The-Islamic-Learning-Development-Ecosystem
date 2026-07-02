const fs = require('fs');

let content = fs.readFileSync('src/components/encyclopedia/HadithLibrary.tsx', 'utf8');

content = content.replace(
  /return \(\s*<div className="text-center mb-10">/,
  'return (\n    <>\n      <div className="text-center mb-10">'
);

content = content.replace(
  /        <\/button>\n      \)\)}\n    <\/div>\n  \);\n}/,
  '        </button>\n      ))}\n    </div>\n    </>\n  );\n}'
);

fs.writeFileSync('src/components/encyclopedia/HadithLibrary.tsx', content);
console.log("Patched HadithLibrary.tsx fragment");
