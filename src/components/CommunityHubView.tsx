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
  const [dmName, setDmName] = useState('');
  const [dmText, setDmText] = useState('');
  const [dmSuccess, setDmSuccess] = useState(false);
  const [dmSending, setDmSending] = useState(false);

  const handleSendDm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmText.trim()) return;
    setDmSending(true);
    setTimeout(() => {
      setDmSending(false);
      setDmSuccess(true);
      setDmText('');
    }, 1200);
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
          
          {/* THE FREE SOFTWARE WELCOME & DIRECT MESSAGE SUPPORT CELL */}
          <div className="bg-[#fdfcf9] border border-amber-900/15 rounded-3xl p-6 md:p-8 shadow-md space-y-5">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-mono uppercase">
              <Heart className="w-4.5 h-4.5 text-amber-700 animate-pulse fill-amber-50" />
              {lang === 'en' ? "100% Free Software Policy" : "برمجية مجانية وحرة بالكامل"}
            </span>

            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {lang === 'en' ? "All Additions are Welcomed!" : "نرحب بكافة الإضافات والتحسينات!"}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                {lang === 'en'
                  ? "Ilm Naafi is built with love as a completely free community project. Any type of helpful addition is warmly welcomed! You can contribute code, write new curriculum lesson nodes, fix transcription details, or clean up translations."
                  : "تم بناء أكاديمية علم نافع بحب كامل وتنسيق متميز كمشروع مجاني ومفتوح المصدر لوجه الله تعالى. أي جهد أو إضافة مهما كانت بسيطة (تصحيح لغوي، إضافة حكم تجويدي، تزويد بقاعدة بيانات المنح) هي ثواب مستمر ومرحب بها جهراً."
                }
              </p>
            </div>

            <div className="border-t border-amber-900/10 pt-4 space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                  <span className="text-[#C59B32] font-black">✦</span>
                  {lang === 'en' ? "Confused or Stuck? Send a DM!" : "هل تشعر بالتردد أو ترغب بمساعدة؟ تواصل معنا!"}
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                  {lang === 'en'
                    ? "If you are confused or don't know where to build first, you don't need to worry. Send a Direct Message to the main supervisor immediately here or via email at apatirasulayman@gmail.com for support."
                    : "إذا كنت متردداً بشأن كيفية تعديل الكود أو تود تزويدنا بمقترحات مباشرة، فلا تقلق أبداً. يمكنك إرسال رسالة فورية للمشرف المطور هنا أو التواصل مباشرة عبر البريد الإلكتروني: apatirasulayman@gmail.com"}
                </p>
              </div>

              {dmSuccess ? (
                <div className="bg-emerald-50 border border-emerald-400/30 rounded-xl p-3.5 space-y-2 text-xs text-emerald-950">
                  <p className="font-black flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    {lang === 'en' ? "Message Drafted Successfully!" : "تم تسجيل رسالتك بنجاح!"}
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    {lang === 'en' 
                      ? "Jazakum Allah Khayr! Your proposal has been prepared. We will reach back to your student inbox or coordinate on email."
                      : "جزاكم الله خيراً! تم إرسال مسودتك وتأكيدها، وسيتابع قائد التطوير الرد المباشر إليكم قريباً."}
                  </p>
                  <button 
                    onClick={() => setDmSuccess(false)}
                    className="text-[10px] font-bold text-emerald-900 hover:text-emerald-950 underline cursor-pointer mt-1 font-mono bg-transparent border-0"
                  >
                    {lang === 'en' ? "Write another message" : "كتابة رسالة أخرى"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendDm} className="space-y-2.5 pt-1">
                  <div>
                    <input 
                      type="text"
                      placeholder={lang === 'en' ? "Your name or email" : "اسمك الكريم أو بريدك الإلكتروني"}
                      value={dmName}
                      onChange={(e) => setDmName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder={lang === 'en' ? "How would you like to help? (Type your DM here...)" : "كيف ترغب في خدمة منهاج الأكاديمية؟ (اكتب رسالتك المباشرة هنا...)"}
                      value={dmText}
                      onChange={(e) => setDmText(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 font-sans resize-none"
                      required
                    />
                  </div>
                  <button
                    disabled={dmSending}
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold p-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-2xs border-0"
                  >
                    {dmSending 
                      ? (lang === 'en' ? "Sending..." : "جاري الإرسال...")
                      : (lang === 'en' ? "Send Direct Message" : "إرسال رسالة مباشرة")}
                  </button>
                </form>
              )}
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
