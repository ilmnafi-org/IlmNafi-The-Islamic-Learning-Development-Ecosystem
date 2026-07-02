const fs = require('fs');

let content = fs.readFileSync('src/components/encyclopedia/HadithLibrary.tsx', 'utf8');

const regex = /<p className="text-sm text-slate-500 font-serif mb-6">\s*Authentic collection of Prophetic traditions.\s*<\/p>/g;

content = content.replace(regex, `<p className="text-sm text-slate-500 font-serif mb-6">
            Authentic collection of Prophetic traditions.
          </p>`);

// Wait, the user wants: "also check online the amount of hadith collections they have"
// The API provides data object, which contains all collections. 
// Inside the component: 
// const [collections, setCollections] = useState<any[]>([]);
// Let's add a count below the title.
const listHeaderRegex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">/;
const newHeader = `<div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-slate-900 mb-2">Hadith Collections</h2>
        <p className="text-slate-600 font-serif italic text-sm">
          Accessing {collections.length} major authenticated collections from our open source database.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">`;

content = content.replace(listHeaderRegex, newHeader);
fs.writeFileSync('src/components/encyclopedia/HadithLibrary.tsx', content);
console.log("Patched HadithLibrary.tsx");
