const fs = require('fs');

let content = fs.readFileSync('src/components/QuranIndexHub.tsx', 'utf8');

const oldHeaderStart = `      {/* HEADER BAR */}`;
const oldHeaderEnd = `      </div>\n\n      {/* DYNAMIC ERROR MESSAGE */}`;

const heroBlock = `      {/* HERO SECTION */}
      <section 
        className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32 text-center px-4 w-full bg-cover bg-center text-white shadow-md mb-8"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(5, 23, 19, 0.9), rgba(9, 15, 14, 0.95)), url('https://images.unsplash.com/photo-1608249826359-5b7fb5f8e5ee?auto=format&fit=crop&q=80&w=1600')"
        }}
      >
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-200 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4 border border-amber-500/30">
            <BookOpen className="w-3 h-3" />
            {lang === 'en' ? "Modular Divine Revelation Hub" : "تصفح ميسر مع التلاوة والتجويد"}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6 font-sans">
            {lang === 'en' ? "AL-QUR'AN" : "القرآن الكريم"}
          </h1>
          <p className="text-emerald-100/80 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
            {lang === 'en' 
              ? "Read, search, and listen to the Holy Quran with integrated offline audio engine and Tajweed visualization."
              : "قراءة وبحث واستماع للقرآن الكريم مع مزامنة صوتية ذكية وتصور مرئي لأحكام التجويد."}
          </p>
        </div>
      </section>

      {/* DYNAMIC ERROR MESSAGE */}`;

const startIdx = content.indexOf(oldHeaderStart);
const endIdx = content.indexOf(oldHeaderEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + heroBlock + content.substring(endIdx + oldHeaderEnd.length);
  fs.writeFileSync('src/components/QuranIndexHub.tsx', content);
  console.log("Patched QuranIndexHub.tsx");
} else {
  console.log("Could not find old header block!");
}
