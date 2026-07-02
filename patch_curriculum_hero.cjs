const fs = require('fs');

let content = fs.readFileSync('src/components/CurriculumView.tsx', 'utf8');

const returnStart = '  return (\n    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="curriculum-container">';

const heroBlock = `  return (
    <div className="w-full">
      {!selectedLesson && (
        <section 
          className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32 text-center px-4 w-full bg-cover bg-center text-white shadow-md mb-12"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(5, 23, 19, 0.9), rgba(9, 15, 14, 0.95)), url('https://images.unsplash.com/photo-1584227361834-8c887ba53ff2?auto=format&fit=crop&q=80&w=1600')"
          }}
        >
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4 border border-emerald-500/30">
              <BookMarked className="w-3 h-3" />
              {lang === 'en' ? "Academic Open Repository" : "مستودع المناهج المفتوحة"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6">
              {lang === 'en' ? "Islamic Studies Curriculum" : "مناهج التربية الإسلامية"}
            </h1>
            <p className="text-emerald-100/80 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
              {lang === 'en' 
                ? "Structured lesson plans, foundational texts, and academic resources curated by verified educators."
                : "خطط دراسية منظمة، ومتون تأسيسية، ومصادر أكاديمية معتمدة من قبل خبراء ومربين ثقات."}
            </p>
          </div>
        </section>
      )}
      
      <div className="w-full max-w-7xl mx-auto px-4 md:px-12 pb-12" id="curriculum-container">
`;

// Remove the old header block!
const oldHeaderStart = `      {/* HEADER SECTION */}
      {!selectedLesson && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-200/80"
          id="curriculum-header-block"
        >`;

const oldHeaderEnd = `          </div>
        </motion.div>
      )}`;

const startIdx = content.indexOf(oldHeaderStart);
const endIdx = content.indexOf(oldHeaderEnd, startIdx) + oldHeaderEnd.length;

if (startIdx !== -1 && endIdx !== -1) {
  const headerContent = content.substring(startIdx, endIdx);
  content = content.replace(returnStart, heroBlock);
  content = content.replace(headerContent, '');
  
  // also need to close the wrapping div at the very end
  const finalDiv = '\n    </div>\n  );\n}';
  content = content.replace(/\n  \);\n}$/, finalDiv);

  fs.writeFileSync('src/components/CurriculumView.tsx', content);
  console.log("Patched CurriculumView.tsx");
} else {
  console.log("Could not find old header block!");
}
