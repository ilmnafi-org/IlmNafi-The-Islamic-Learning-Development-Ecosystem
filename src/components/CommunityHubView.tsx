/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GitBranch, 
  Github, 
  CheckCircle2, 
  Sparkles, 
  Code, 
  Share2, 
  Terminal, 
  Users, 
  Copy, 
  Check, 
  ListTodo,
  Package,
  Heart,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

interface CommunityHubViewProps {
  lang: 'en' | 'ar';
}

export default function CommunityHubView({ lang }: CommunityHubViewProps) {
  const [copied, setCopied] = useState(false);

  // The paragraphised announcement message they can share with their community/friends
  const shareMessage = lang === 'en' 
    ? `Alhamdulillah! 🌟 I have just launched the first open-source release of the Universal Scholarly Platform & Tajweed Academy! 🎓✨

It is a fully-featured, unified React web application combining:
1. 🗣️ Interactive Makhraj Visualizer for mouth/throat pronunciation corrector simulation.
2. 📚 Complete Multi-Subject Curriculums (Structured Tajweed, Jurisprudence & Islamic History).
3. ⏳ Dynamic Study Focus Planner dividing curriculum modules based on student availability.
4. 💼 Global Scholarships & Fellowship Registry with in-memory application step tracking and custom draft notes.
5. 🛡️ Secure Student ID Badging with fully spring-loaded state transitions.

💻 Check out our live application, review our clean TypeScript architecture, and contribute to our roadmap. Feel free to clone or submit pull requests! Join us in preserving and teaching the noble sciences of the Quran and academic excellence. 

#Alhamdulillah #OpenSource #Reactjs #TailwindCSS #Tailwind #TypeScript`
    : `الحمد لله رب العالمين! 🌟 أطلقت بحمد الله الإصدار المفتوح المصدر الأول لمنصّة الأكاديمية العالمية ومجمع الحصافة العلمية لعلوم التجويد والمنح الدراسية! 🎓✨

تطبيق ويب متكامل ومميز جداً بأرقى المعايير التقنية:
١. 🗣️ معمل مخارج الحروف التفاعلي: لتوضيح مخارج النطق الصوتي بدقة التشريح الشفهي والحلقي.
٢. 📚 المقررات المنهجية الموحدة: مسارات تعليمية كاملة من المستوى الابتدائي للدبلوم العلمي.
٣. ⏳ المخطط الدراسي اليومي: يوزّع دقائق دراستك الذاتية بذكاء على المباحث المختلفة.
٤. 💼 بوابة رعاية الموهوبين والمنح: قاعدة بيانات حية للمنح العالمية مع مفكرة وبطاقة رصد التقدم.
٥. 🛡️ بوابات التوثيق والأمان: تسجيل سلس ببطاقة الطالب الأكاديمية وحركات متحركة غاية في الأناقة وبدعم ثنائي اللغة.

💻 شاركونا في المراجعة، التطوير وتوسيع ديوان المقررات الفقهية والمأثورات العلمية عبر المساهمة المباشرة في مستودع الشفرات وتنزيل الكود.

#الحمد_لله #مفتوح_المصدر #تطوير_ويب #رياكت #تايلوند`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // List of completed features
  const completedFeatures = [
    {
      title: lang === 'en' ? "Interactive Makhraj Visualizer" : "معمل مخارج الحروف التفاعلي",
      desc: lang === 'en' ? "Simulates speech articulation zones (tongue, teeth, throat) with interactive canvas controllers to guide correct consonant vocalization." : "محاكاة واقعية لنقاط النطق (الحلق، الشفتان، اللسان) بطريقة تفاعلية لتعزيز الفهم السليم لمخارج الحروف العربية."
    },
    {
      title: lang === 'en' ? "Structured Curriculum Syllabus" : "منهج المسارات الأكاديمية الموحدة",
      desc: lang === 'en' ? "Graded lesson plans, reading nodes, and in-app interactive quizzes for Tajweed Rules, Islamic Jurisprudence, and Historical Sciences." : "خطط دراسية متدرجة للطلاب مزودة باختبارات استيعاب لحظية لتنمية المعرفة الشرعية والتاريخية من الكُتّاب للمراحل المتقدمة."
    },
    {
      title: lang === 'en' ? "Weekly Study Focus Planner" : "المجدول المخطط للحضور اليومي",
      desc: lang === 'en' ? "Generates randomized study schedules tailored dynamically to how many minutes the student registers per week." : "يولّد تلقائياً خطط دراسية ميسرة ومكثفة بناءً على الوقت الذي خصصه الطالب للدراسة الذاتية أسبوعياً."
    },
    {
      title: lang === 'en' ? "Scholarship Opportunities Tracker" : "بوابة المنح وديوان حفظ الفرص",
      desc: lang === 'en' ? "Curates verified financial undergraduate, graduate and research fellowships with custom application states and in-memory drafting note panels." : "يجمع المنح الأكاديمية الحقيقية والممولة بالكامل مع توفير طاولة تحرير للمسودات ومتابعة حالة التقديم (مقبول، تم التقديم) بذاكرة حية."
    },
    {
      title: lang === 'en' ? "Auth Page Smooth Transitions" : "حركات انتقالية متقنة لبوابات العضوية",
      desc: lang === 'en' ? "Spring-loaded expandable text fields, dynamic role toggling, responsive layouts using high speed React AnimatePresence and layout layouts." : "تفاعلات تبديل سلسة ومتجاوبة لتبويب تسجيل الدخول وتوثيق بطاقة الطالب مع ارتفاع حركي مرن وتضمين سلس لحقول الإدخال."
    }
  ];

  // List of upcoming features (Roadmap)
  const roadmapFeatures = [
    {
      title: lang === 'en' ? "Real-Time Audio Recognition Engine" : "محرك المعالجة والتحليل الصوتي المباشر",
      desc: lang === 'en' ? "Integrating the HTML Web Audio API to capture student voice and compare waveforms with native Qari recordings for scoring pronunciation." : "دمج ملتقط المسرع الصوتي في المتصفح لقياس جودة النبرة وتطابق نطق الحلق مع تلاوات الشيوخ المتقنين لإعطاء درجة تقييم آلية."
    },
    {
      title: lang === 'en' ? "Multi-Player Discussion Hub & Firestore Sync" : "غرف النقاش الجماعية ومزامنة قواعد البيانات",
      desc: lang === 'en' ? "Replacing local storage with scalable Google Cloud Firestore backends to let scholars post homework questions and reply to peer peer circles." : "ترقية الحفظ الحالي ليعمل بمزامنة حية تفاعلية تمكّن جموع الباحثين من التراسل التشاركي وطرح المسائل ومناقشتها تحت رقابة المعلمين."
    },
    {
      title: lang === 'en' ? "Automatic Reminder Notification Cron" : "منبه الإشعارات والتنبيه الفوري التلقائي",
      desc: lang === 'en' ? "In-app system notifications reminding students to review their recitation list to maintain high memory retention streaks." : "نظام تنبيهات متكامل يدفع للمتصفح إشعارات بالتذكير بالمراجعة الدورية للحفاظ على سلاسل الانضباط والاستمرارية بدون انقطاع الدراسي."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12" id="community-hub-container">
      {/* HERO HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl border border-emerald-900/40 p-8 md:p-12 text-white mb-12 shadow-xl">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_40%)]" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 text-[10px] px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-widest border border-emerald-500/35">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> {lang === 'en' ? "First Open-Source Release" : "الإطلاق الأول مفتوح المصدر ✦ ركن المطورين"}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {lang === 'en' 
              ? "Alhamdulillah! Join Our Community and Shape the Future of Learning" 
              : "الحمد لله أولاً وآخراً! شاركنا الرحلة في بناء مستقبل العلم النافع"}
          </h1>
          <p className="text-emerald-100/70 text-xs md:text-sm max-w-2xl leading-relaxed">
            {lang === 'en'
              ? "This application is fully open-source and built to make elite Quranic recitation instruction and comprehensive global academic scholarship tracking accessible to everyone. Browse our modular codebase, test our features, and help us scale."
              : "هذا التطبيق مجاني بالكامل ومفتوح المصدر لوجه الله تعالى لتيسير التمسك بعلوم اللغة العربية ومخارج التنزيل، ومتابعة الفرص الأكاديمية العالمية بدقة. استكشف شفرتك، جرب أدواتنا، وساهم في الترقية."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: ANNOUNCEMENT BOX & HOW TO CONTRIBUTE */}
        <div className="col-span-1 space-y-8">
          
          {/* THE SHAREABLE PARAGRAPH MESSAGE CARD */}
          <div className="bg-[#fdfcf9] border border-amber-900/15 rounded-3xl p-6 md:p-8 shadow-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-mono">
                <Share2 className="w-4 h-4 text-amber-700" />
                {lang === 'en' ? "SHARE WITH PEOPLE" : "انشر الخبر وشارك الأجر"}
              </span>
              <button
                onClick={copyToClipboard}
                className="bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'en' ? "Copied!" : "تم النسخ!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "Copy Text" : "نسخ الرسالة"}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-medium leading-relaxed pb-3 border-b border-amber-900/5">
              {lang === 'en'
                ? "This is a beautifully structured, paragraphised announcement message detailing all features. Click the copy button to share this directly on WhatsApp, Twitter, or Discord!"
                : "رسالة إعلان مرتبة ومبنية على هيئة فقرات متكاملة توضّح أهداف المجمع وخصائصه. اضغط على زر النسخ لنشرها مباشرة في منصات التواصل أو مجموعات الطلاب!"
              }
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-4 h-64 overflow-y-auto text-xs text-slate-750 font-normal leading-relaxed whitespace-pre-wrap select-all font-sans relative">
              {shareMessage}
            </div>
          </div>

          {/* CONTRIBUTOR QUICKSTART GUIDE */}
          <div className="bg-white border border-slate-205 rounded-3xl p-6 md:p-8 shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-800" />
              {lang === 'en' ? "Technical Quickstart" : "دليل المطورين للمساهمة"}
            </h3>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              {lang === 'en'
                ? "Keen to add lessons, refine code structures, or enhance visual animations? Follow these standard project workflows to run local development:"
                : "هل تود إضافة مسائل علمية، مراجعة الكود، أو ترقية واجهات الأنيميشن؟ اتبع الخطوات العامة لتشغيل الكود محلياً والمساهمة:"
              }
            </p>

            <div className="bg-slate-950 font-mono text-[10px] text-emerald-400 p-4 rounded-xl space-y-2.5 overflow-x-auto shadow-inner">
              <p># Clone the Repository</p>
              <p className="text-white">git clone https://github.com/tajweed/academy.git</p>
              <p># Install Base Packages</p>
              <p className="text-white">npm install</p>
              <p># Fire Up High-Performance Dev Server</p>
              <p className="text-white">npm run dev</p>
              <p># Compile Production Assets</p>
              <p className="text-white">npm run build</p>
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-100">
              <p className="font-bold flex items-center gap-1.5 text-slate-800">
                <Heart className="w-3.5 h-3.5 text-red-650 fill-red-50" />
                {lang === 'en' ? "Contribution Standards:" : "ضوابط وسياسة المساهمة:"}
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-550 leading-relaxed">
                <li>{lang === 'en' ? "Keep API keys secure. Use server-side proxies." : "حافظ على سرية المفاتيح التقنية وعالجها خلف خوادم وسيطة."}</li>
                <li>{lang === 'en' ? "Provide complete TypeScript interfaces." : "وفر صياغة متسقة وتامة للأنواع وعرّفها بدقة."}</li>
                <li>{lang === 'en' ? "Write descriptive modular React code." : "قسّم واجهتك إلى وحدات وظيفية مستقلة وسهلة الفهم."}</li>
              </ul>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ROADMAPS & CURRENT IMPLEMENTED FEATURES */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* INSTALLED AND LIVE FEATURES (COMPLETED) */}
          <div className="bg-white border border-slate-205 rounded-3xl p-6 md:p-8 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-650" />
              <h2 className="text-lg font-extrabold text-slate-900 select-none">
                {lang === 'en' ? "What We Handcrafted (Active Features)" : "أبرز الخصائص والمنجزات الفعالة"}
              </h2>
            </div>

            <div className="space-y-6">
              {completedFeatures.map((feat, idx) => (
                <div key={idx} className="flex gap-4 items-start pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/5 text-emerald-800 border border-emerald-500/20 shrink-0 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-905 text-sm">{feat.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PLANNED FUTURE UPDATES (ROADMAP) */}
          <div className="bg-white border border-slate-205 rounded-3xl p-6 md:p-8 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <ListTodo className="w-5 h-5 text-amber-700" />
              <h2 className="text-lg font-extrabold text-slate-900 select-none">
                {lang === 'en' ? "Current Work in Progress (Open Roadmap)" : "مسار العمل المستقبلي وتطلعات التطوير"}
              </h2>
            </div>

            <div className="space-y-6">
              {roadmapFeatures.map((feat, idx) => (
                <div key={idx} className="flex gap-4 items-start pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/5 text-amber-800 border border-amber-500/20 shrink-0 flex items-center justify-center text-xs">
                    ✦
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-905 text-sm flex items-center gap-2">
                      {feat.title}
                      <span className="bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase font-mono">ROADMAP</span>
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
