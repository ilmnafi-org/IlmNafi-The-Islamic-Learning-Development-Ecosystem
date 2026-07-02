const fs = require('fs');

let content = fs.readFileSync('src/components/CurriculumView.tsx', 'utf8');
content = content.replace(/    <\/div>\n  \);\n}\s*$/, '    </div>\n    </div>\n  );\n}\n');

fs.writeFileSync('src/components/CurriculumView.tsx', content);
console.log("Fixed end");
