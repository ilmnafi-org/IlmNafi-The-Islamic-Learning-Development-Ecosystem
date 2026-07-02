
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Clock, HelpCircle, Mic, RefreshCw, Layers, Zap, Heart, Shield, Globe } from 'lucide-react';

const HERO_TEMPLATES = [
  {
    titleEn: "Beneficial Knowledge.",
    titleAr: "طلبُ العِلْمِ فَرِيضَةٌ",
    subtitleEn: "Discover a unified scholarly platform combining K-12 open-source Islamic curriculum, advanced AI recitation guidance, and a global scholarships database.",
    subtitleAr: "اكتشف منصة علمية موحدة تجمع بين المناهج الإسلامية مفتوحة المصدر، وتصحيح التلاوة بالذكاء الاصطناعي، وقاعدة بيانات المنح العالمية.",
    ctaStartEn: "AI Reciter Coach",
    ctaStartAr: "مصحح التلاوة الذكي",
    ctaCurriculumEn: "Explore Curriculum",
    ctaCurriculumAr: "تصفح المناهج"
  },
  {
    titleEn: "Read in the Name of your Lord.",
    titleAr: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    subtitleEn: "Refine your Tajweed and memorize classical texts with real-time audio alignment designed by traditional scholars and expert educators.",
    subtitleAr: "صقّل تجويدك واحفظ المتون التفصيلية مع تقييم صوتي فوري مصمم لتيسير طلب العلم وحفظ كتاب الله العزيز.",
    ctaStartEn: "Check Tajweed Now",
    ctaStartAr: "افحص تجويدك الآن",
    ctaCurriculumEn: "Study Classical Texts",
    ctaCurriculumAr: "دراسة المتون الأصيلة"
  },
  {
    titleEn: "An Inheritance of Prophets.",
    titleAr: "العُلَمَاءُ وَرَثَةُ الأَنْبِيَاءِ",
    subtitleEn: "Engage with live webinars, class forums, and a dedicated academic community keeping the pristine chains of classical Islamic traditions alive.",
    subtitleAr: "شارك في الحلقات المباشرة، والمنتديات الدراسية، والندوات العلمية لحفظ وبث التراث الشرعي الأصيل والتواصل السليم.",
    ctaStartEn: "Join Live Seminars",
    ctaStartAr: "حضور الحلقات الحية",
    ctaCurriculumEn: "Meet Our Faculty",
    ctaCurriculumAr: "أعضاء المجمع العلمي"
  },
  {
    titleEn: "And say: My Lord, increase me in knowledge.",
    titleAr: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    subtitleEn: "Access curated scholarship tracks, academic directories, and authentic open education resources completely free from barriers.",
    subtitleAr: "احصل على بوابات المنح الدراسية المنسقة، والمصادر الأكاديمية الأصيلة، ومسارات السلوك المعرفي بيسر وسهولة للجميع بالهوية الإسلامية.",
    ctaStartEn: "Discover Grants",
    ctaStartAr: "اكتشف المنح الدراسية",
    ctaCurriculumEn: "Browse Materials",
    ctaCurriculumAr: "تصفح الكتب والمذكرات"
  }
];

export interface HomeViewProps {
  lang: 'en' | 'ar';
  setActiveTab: (tab: string) => void;
}

export function HomeView({ lang, setActiveTab }: HomeViewProps) {
  const [heroIndex, setHeroIndex] = useState(() => Math.floor(Math.random() * HERO_TEMPLATES.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_TEMPLATES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      id="home-view"
      className="space-y-24"
    >
      {/* EXTENDED HERO SECTION */}
      <section 
        className="relative overflow-hidden pt-40 pb-12 md:pt-56 md:pb-16 text-center px-4 w-full mx-auto bg-cover bg-center text-white shadow-[0_25px_60px_rgba(7,28,23,0.12)]"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(5, 23, 19, 0.95), rgba(9, 15, 14, 0.9)), url('https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1600')"
        }}
        id="hero-majestic-block"
      >
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
          
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="font-bold text-[10px] text-amber-200 uppercase tracking-widest font-sans">
              {lang === 'en' ? "Inspired Quranic Verses & Wisdoms" : "من وحي آيات الذكر الحكيم والحكم الشرعية"} • {heroIndex + 1}/{HERO_TEMPLATES.length}
            </span>
            <button 
              onClick={() => setHeroIndex(prev => (prev + 1) % HERO_TEMPLATES.length)}
              className="ml-2 pl-2 border-l border-amber-500/30 text-amber-300 hover:text-white cursor-pointer transition text-[10px] font-black flex items-center gap-1.5 focus:outline-none"
              title="Cycle Wisdom"
            >
              <RefreshCw className="w-3 h-3 animate-spin-slow inline text-amber-400" />
              <span>{lang === 'en' ? "Inspire Me" : "آية وحكمة أخرى"}</span>
            </button>
          </div>
          
          <motion.h1 
            key={`title-${heroIndex}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-extrabold text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none font-sans drop-shadow-sm max-w-4xl"
          >
            {lang === 'en' ? HERO_TEMPLATES[heroIndex].titleEn : HERO_TEMPLATES[heroIndex].titleAr}
          </motion.h1>
          
          <motion.p 
            key={`subtitle-${heroIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-emerald-100/80 font-medium text-base md:text-xl lg:text-2xl max-w-3xl mt-8 leading-relaxed font-sans"
          >
            {lang === 'en' ? HERO_TEMPLATES[heroIndex].subtitleEn : HERO_TEMPLATES[heroIndex].subtitleAr}
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full sm:w-auto">
            <motion.button 
              key={`cta1-${heroIndex}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              onClick={() => { setActiveTab('coach'); }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-2xl font-bold text-sm md:text-base tracking-wide transition shadow-lg shadow-amber-950/20 cursor-pointer border border-amber-600 scale-[1.02] hover:scale-[1.05]"
            >
              {lang === 'en' ? HERO_TEMPLATES[heroIndex].ctaStartEn : HERO_TEMPLATES[heroIndex].ctaStartAr}
            </motion.button>
            <motion.button
              key={`cta2-${heroIndex}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => { setActiveTab('curriculum'); }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-10 py-4 rounded-2xl font-bold text-sm md:text-base tracking-wide transition cursor-pointer"
            >
              {lang === 'en' ? HERO_TEMPLATES[heroIndex].ctaCurriculumEn : HERO_TEMPLATES[heroIndex].ctaCurriculumAr}
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-12 pt-6 border-t border-white/10 w-full text-center"
          >
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">50+</p>
              <p className="text-emerald-100/70 text-xs md:text-sm font-medium uppercase tracking-wider">{lang === 'en' ? 'Open Courses' : 'دورة مجانية'}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">24/7</p>
              <p className="text-emerald-100/70 text-xs md:text-sm font-medium uppercase tracking-wider">{lang === 'en' ? 'AI Coach' : 'مصحح آلي'}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">100k</p>
              <p className="text-emerald-100/70 text-xs md:text-sm font-medium uppercase tracking-wider">{lang === 'en' ? 'Active Students' : 'طالب علم'}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">12+</p>
              <p className="text-emerald-100/70 text-xs md:text-sm font-medium uppercase tracking-wider">{lang === 'en' ? 'Scholarly Tracks' : 'مساراً علمياً'}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: ECOSYSTEM FEATURES */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-8" id="ecosystem-features">
        <div className="text-center mb-16">
          <span className="text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-4">
            {lang === 'en' ? 'Complete Ecosystem' : 'منظومة متكاملة'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            {lang === 'en' ? 'Everything you need to master the Deen' : 'كل ما تحتاجه لإتقان علوم الدين'}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
            {lang === 'en' ? 'From foundational curriculum to advanced scholarly networks and daily adhkar, integrated seamlessly.' : 'من المناهج الأساسية إلى الشبكات العلمية المتقدمة والأذكار اليومية، مدمجة بسلاسة.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg hover:border-emerald-500/30 transition-all group">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{lang === 'en' ? 'Structured Pathways' : 'مسارات منظمة'}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {lang === 'en' ? 'Carefully curated paths for all age groups and proficiency levels, ensuring steady academic progression.' : 'مسارات منسقة بعناية لجميع الفئات العمرية ومستويات الكفاءة لضمان تقدم أكاديمي مطرد.'}
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg hover:border-amber-500/30 transition-all group">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{lang === 'en' ? 'AI-Powered Practice' : 'تطبيقات مدعومة بالذكاء الاصطناعي'}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {lang === 'en' ? 'Real-time phonetics correction and interactive tools that adapt to your personal pace and challenges.' : 'تصحيح صوتي فوري وأدوات تفاعلية تتكيف مع وتيرتك الشخصية والتحديات التي تواجهك.'}
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg hover:border-indigo-500/30 transition-all group">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{lang === 'en' ? 'Global Community' : 'مجتمع عالمي'}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {lang === 'en' ? 'Connect with scholars and peers worldwide through active forums, webinars, and study groups.' : 'تواصل مع العلماء والأقران حول العالم من خلال المنتديات النشطة والندوات ومجموعات الدراسة.'}
            </p>
          </div>
        </div>
      </section>

      {/* PLATFORM VALUE PILLARS & FEATURES MATRIX */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12" id="platform-value-pillars">
        <div className="mt-12 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-[#0a2e24] font-sans tracking-tight">
              {lang === 'en' ? "Platform Core Portals" : "بوابات العلم والهدى"}
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              {lang === 'en' ? "Choose a specialized academic segment to begin learning classical traditions with no friction." : "اختر المحضن المعرفي المناسب للبدء برحلة العلم النافع والترتيل القويم."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            
            <div 
              onClick={() => setActiveTab('quran')}
              className="premium-card hover:border-amber-600 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#0a2e24] text-sm mb-1">{lang === 'en' ? "Holy Quran" : "القرآن الكريم"}</h4>
              <p className="text-[10px] text-slate-500 font-medium px-2">{lang === 'en' ? "Read, search & explore" : "تلاوة وبحث وتدبر"}</p>
            </div>

            <div 
              onClick={() => setActiveTab('coach')}
              className="premium-card hover:border-emerald-600 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#0a2e24] text-sm mb-1">{lang === 'en' ? "AI Coach" : "المصحح الآلي"}</h4>
              <p className="text-[10px] text-slate-500 font-medium px-2">{lang === 'en' ? "Correct your Tajweed" : "صوّب تلاوتك وتجويدك"}</p>
            </div>

            <div 
              onClick={() => setActiveTab('daily')}
              className="premium-card hover:border-indigo-600 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-indigo-100 text-indigo-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#0a2e24] text-sm mb-1">{lang === 'en' ? "Daily Adhkar" : "أذكار اليوم"}</h4>
              <p className="text-[10px] text-slate-500 font-medium px-2">{lang === 'en' ? "Morning & evening" : "الصباح والمساء"}</p>
            </div>

            <div 
              onClick={() => setActiveTab('encyclopedia')}
              className="premium-card hover:border-rose-600 p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#0a2e24] text-sm mb-1">{lang === 'en' ? "Encyclopedia" : "الموسوعة"}</h4>
              <p className="text-[10px] text-slate-500 font-medium px-2">{lang === 'en' ? "Islamic heritage" : "التراث الإسلامي"}</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* IN-DEPTH BENTO GRID */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12-custom mt-16" id="bento-grid-section">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TILE 1: CURRICULUM */}
            <div 
              onClick={() => { setActiveTab('curriculum'); }}
              className="bg-white rounded-3xl border border-slate-200/80 p-8 hover:border-amber-600 hover:shadow-lg transition relative overflow-hidden group cursor-pointer shadow-sm flex flex-col justify-between"
            >
              <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition translate-x-1/4 translate-y-1/4">
                <BookOpen className="w-64 h-64 text-amber-800" />
              </div>
              <div>
                <span className="bg-amber-50 text-amber-850 border border-amber-100 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-6 inline-block">
                  {lang === 'en' ? "Open Wiki Curriculum" : "موسوعة المناهج الحرة"}
                </span>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                  {lang === 'en' ? "K-12 Islamic Studies Repository" : "مستودع المناهج الإسلامية الشامل"}
                </h4>
                <p className="text-sm text-slate-600 max-w-md leading-relaxed font-medium">
                  {lang === 'en' ? "Access structured lesson plans, workbooks, and academic outlines crowdsourced by traditional educators globally." : "الوصول إلى خطط دروس منظمة ومذكرات ومصادر أكاديمية حرة من تأليف معلمين ومربين ثقات حول العالم."}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between z-10">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-900">A</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-900">B</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-900">C</div>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* TILE 2: AI TAJWEED */}
            <div 
              onClick={() => { setActiveTab('coach'); }}
              className="bg-[#051410] rounded-3xl border border-emerald-900/50 p-8 hover:border-emerald-500 hover:shadow-xl transition relative overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:opacity-20 transition">
                <Mic className="w-64 h-64 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-6 inline-block">
                  {lang === 'en' ? "Neural Recitation Assessment" : "التقييم الصوتي العصبي"}
                </span>
                <h4 className="text-2xl font-black text-white tracking-tight leading-snug mb-3">
                  {lang === 'en' ? "AI Tajweed Coach" : "المصحح الآلي الذكي"}
                </h4>
                <p className="text-sm text-emerald-100/70 max-w-md leading-relaxed font-medium">
                  {lang === 'en' ? "Experience real-time phonetic analysis. The neural engine highlights precise articulation errors and provides visual Makhraj correction." : "تحليل النطق الفوري وتصحيح التلاوة. يحدد المحرك العصبي أخطاء المخارج بدقة ويقدم تقويماً بصرياً مباشراً."}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between z-10">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-emerald-900/50 border border-emerald-800 rounded text-[9px] font-bold text-emerald-400">Ghunna</span>
                  <span className="px-2 py-1 bg-emerald-900/50 border border-emerald-800 rounded text-[9px] font-bold text-emerald-400">Madd</span>
                  <span className="px-2 py-1 bg-emerald-900/50 border border-emerald-800 rounded text-[9px] font-bold text-emerald-400">Ikhfa</span>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ACADEMY FELLOWS & TESTIMONIALS */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12 mt-16" id="fellows-testimonials">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-[#0a2e24] font-sans tracking-tight">
              {lang === 'en' ? "Academy Scholar Voices" : "أصوات وبحوث قادة التغيير الفكري"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fellow Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-slate-700 italic text-xs leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                  {lang === 'en'
                    ? "\"The interactive Makhraj Visualizer changed everything for me. Watching my tongue position move dynamically on the anatomical tracker helped me correct my throat consonants (Ayn, Haa). The feedback notes are so detailed they feel like a private Sheikh sitting with me.\""
                    : "\"غيّر معمل المخارج التفاعلي طريقتي في الفهم تماماً. رؤية حركة اللسان والشفاه تنقبض وتنبسط بالتوجيه الآني ساعدتني في تصحيح مخرجي حرفي العين والحاء المغبونين. نقد تفكيك الحروف دقيق بدرجة لا تتوفر حتى في الدروس الفردية التقليدية.\""
                  }
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" alt="Student" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{lang === 'en' ? "Ahmed Mansour" : "أحمد منصور"}</h5>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{lang === 'en' ? "Tajweed Student, UK" : "طالب تجويد - بريطانيا"}</span>
                </div>
              </div>
            </div>

            {/* Fellow Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-slate-700 italic text-xs leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                  {lang === 'en'
                    ? "\"As an Islamic Studies teacher, the Open Wiki Curriculum has been a lifesaver. The ability to pull authenticated, structured lesson plans and directly share them with my 4th graders has elevated our school's standard immensely.\""
                    : "\"بصفتي معلمة تربية إسلامية، موسوعة المناهج كانت طوق النجاة. القدرة على سحب خطط دراسية موثوقة ومنظمة ومشاركتها مع طلاب الصف الرابع رفعت من مستوى مدرستنا الأكاديمي بشكل ملحوظ.\""
                  }
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" alt="Teacher" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{lang === 'en' ? "Sarah Rahman" : "سارة عبد الرحمن"}</h5>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{lang === 'en' ? "Educator, Canada" : "معلمة - كندا"}</span>
                </div>
              </div>
            </div>

            {/* Fellow Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-slate-700 italic text-xs leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                  {lang === 'en'
                    ? "\"The Scholarship Database connected me to a fully-funded track at Al-Azhar University. The community forums helped me prep for the entrance interviews. This platform builds bridges that change lives.\""
                    : "\"قاعدة المنح الدراسية أوصلتني لفرصة دراسية ممولة بالكامل في جامعة الأزهر. المنتديات الأكاديمية ساعدتني في التحضير للمقابلات. هذه المنصة تبني جسوراً تغير مجرى الحياة للمسلمين حول العالم.\""
                  }
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" alt="Scholar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{lang === 'en' ? "Omar Diallo" : "عمر ديالو"}</h5>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{lang === 'en' ? "Theology Scholar, Senegal" : "باحث شرعي - السنغال"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM ORIENTATION INTERACTIVE FAQ */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-12" id="faq-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-4">
            <span className="inline-block text-[10px] font-bold text-amber-805 bg-amber-100 rounded-full py-1 px-3">
              {lang === 'en' ? "Institutional FAQs" : "التوجيه الأكاديمي"}
            </span>
            <h3 className="text-2xl font-black text-slate-800 font-sans tracking-tight">
              {lang === 'en' ? "Guidance & Scholarly Integrity" : "أسئلة شائعة ودليل طالب العلم"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {lang === 'en' 
                 ? "If you have questions about academic credentials, the artificial intelligence recitation coach, or how list information is verified, read our protocol."
                : "نصحب مراجعي المقررات وحفاظ التلاوة ورياض الباحثين بدليل مبسط لشرح ميكانيكية عمل مصحح الأخطاء الصوتي ودورة المناهج والمنح الشريانية."}
            </p>
            
            <div className="pt-6 border-t border-slate-200 mt-6">
              <a href="#" className="flex items-center gap-2 text-xs font-bold text-amber-905 hover:text-amber-700 transition">
                <HelpCircle className="w-4 h-4" />
                <span>{lang === 'en' ? "View full knowledge base" : "عرض قاعدة المعرفة الكاملة"}</span>
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-400 transition cursor-pointer">
              <h4 className="font-bold text-sm text-slate-800 mb-2">
                {lang === 'en' ? "Is the AI Reciter Coach meant to replace a real Sheikh/Teacher?" : "هل يعوض المصحح الآلي (الذكاء الاصطناعي) عن التلقي من المشايخ القراء؟"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {lang === 'en'
                  ? "Absolutely not. The AI Coach acts as a supplementary laboratory tool for self-practice, phonetic isolation, and preliminary mistake detection (Lahn Jali & Khafi). Classical transmission (Talaqqi) requires human authentication (Ijazah) which machines cannot provide."
                  : "قطعاً لا. المصحح الآلي هو أداة معملية مساعدة للتدريب الذاتي، وعزل المخارج الصوتية، واكتشاف اللحون الجلية والخفية مبدئياً. أما التلقي والأخذ والمشافهة فلا بد فيها من الشيخ المجاز المتصل السند."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-400 transition cursor-pointer">
              <h4 className="font-bold text-sm text-slate-800 mb-2">
                {lang === 'en' ? "How do you verify the K-12 Curriculum content?" : "كيف يتم توثيق المحتوى المنهجي لمقررات التربية الإسلامية؟"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {lang === 'en'
                  ? "Our curriculum is maintained like an academic Wiki, supervised by a council of verified educators and traditional scholars. Content is cross-referenced with established academic frameworks globally before being merged into the primary branch."
                  : "تُدار المناهج بآلية التوثيق التعاوني (Wiki) تحت إشراف مجلس من المعلمين المعتمدين والباحثين الشرعيين. يتم مقابلة المحتوى ومراجعته مع المعايير الأكاديمية الراسخة قبل دمجه في الفروع التعليمية الرسمية."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-400 transition cursor-pointer">
              <h4 className="font-bold text-sm text-slate-800 mb-2">
                {lang === 'en' ? "Can anyone add to the Scholarship Database?" : "هل يمكن لأي جهة إضافة المنح الدراسية للقاعدة؟"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {lang === 'en'
                  ? "We accept submissions from universities, institutions, and community scouts. However, all links are manually vetted by our team to ensure the scholarship is authentic, active, and accessible to students without exploitative conditions."
                  : "نقبل الإحالات من الجامعات والمؤسسات الكفيلة وكشافي المنح. ولكن تخضع جميع الروابط لتدقيق يدوي من فريقنا للتأكد من موثوقية المنحة وفعاليتها وخلوها من الشروط التعسفية."}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SPACER AT THE END TO ENSURE SCROLLING */}
      <div className="h-12 w-full"></div>
    </motion.div>
  );
}
