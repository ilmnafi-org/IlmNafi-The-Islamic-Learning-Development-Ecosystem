import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Code, 
  ExternalLink, 
  Cpu, 
  Globe, 
  Key, 
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ApiDocsViewProps {
  lang: 'ar' | 'en';
}

export default function ApiDocsView({ lang }: ApiDocsViewProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const [docTab, setDocTab] = useState<'opensource' | 'paid'>('opensource');

  const endpoints = [
    {
      id: 'health',
      method: 'GET',
      path: '/api/health',
      desc: lang === 'en' 
        ? 'Retrieve server node status, system resource allocations, and DB availability state.' 
        : 'التحقق من حالة اتصال الخادم وتوفر قواعد البيانات وقنوات الذكاء الاصطناعي.',
      headers: {
        'Content-Type': 'application/json'
      },
      curl: 'curl -X GET https://ilmnaafi.com/api/health',
      response: `{
  "status": "ok",
  "timestamp": "2026-06-11T16:52:00.000Z",
  "version": "1.4.0",
  "uptimeSeconds": 142095
}`
    },
    {
      id: 'audio-proxy',
      method: 'GET',
      path: '/api/audio-proxy?url=:audioUrl',
      desc: lang === 'en'
        ? 'Proxies audio files securely from external archives (everyayah.com) over CORS-enabled endpoints.'
        : 'بروكسي آمن ومحمي لتشغيل تدفق الصوت للقراء من الأرشيف الخارجي دون حظر CORS.',
      headers: {
        'Accept': 'audio/mpeg'
      },
      curl: 'curl -G "https://ilmnaafi.com/api/audio-proxy" --data-urlencode "url=https://everyayah.com/data/Ghamadi_40kbps/001001.mp3"',
      response: `[Binary MP3 Audio Stream Payload]
Content-Type: audio/mpeg
Cache-Control: public, max-age=31536000`
    },
    {
      id: 'ai-coach',
      method: 'POST',
      path: '/api/ai-coach',
      desc: lang === 'en'
        ? 'Submits Base64 recorded user audio with the target verse for detailed pronunciation, Tajweed correction, and scoring analysis powered by Gemini.'
        : 'إرسال التلاوة المسجلة بصيغة Base64 مع معلومات الآية لتدقيق نطق الطلاقة والتاجويد عبر نموذج الذكاء الاصطناعي.',
      headers: {
        'Content-Type': 'application/json'
      },
      curl: 'curl -X POST https://ilmnaafi.com/api/ai-coach \\\n  -H "Content-Type: application/json" \\\n  -d \'{"audioBase64": "GkXfo69...", "verseText": "بسم الله الرحمن الرحيم", "surahNum": 1, "ayahNum": 1}\'',
      response: `{
  "accuracyRating": 94,
  "detectedDiscrepancies": "No critical phonetic deviances. Fluent and resonant vocalization.",
  "phonemesAnalysis": [
    { "token": "بِسْمِ", "status": "correct", "score": 96 }
  ],
  "tajweedEvaluation": "Perfect Madd and Ghunnah timings detected."
}`
    },
    {
      id: 'tajweed-parse',
      method: 'POST',
      path: '/api/tajweed-parse',
      desc: lang === 'en'
        ? 'Parses Arabic scripture and maps Tajweed rules dynamically, identifying rules like Ikhfa, Idgham, and Iqlab.'
        : 'تحليل وتلوين أحرف التجويد آلياً وتصنيف أحكام النون الساكنة والتنوين والمدود.',
      headers: {
        'Content-Type': 'application/json'
      },
      curl: 'curl -X POST https://ilmnaafi.com/api/tajweed-parse \\\n  -H "Content-Type: application/json" \\\n  -d \'{"text": "أَنْعَمْتَ عَلَيْهِمْ"}\'',
      response: `{
  "parsedTokens": [
    { "text": "أَنْعَمْتَ", "rule": "Izhar Halqi", "color": "#059669" }
  ]
}`
    },
    {
      id: 'scholarly',
      method: 'POST',
      path: '/api/scholarly',
      desc: lang === 'en'
        ? 'Analyzes theological queries, academic issues, and consensus sources using deep research groundings.'
        : 'التحقق والمقارنة المنهجية والاستدلال من كتب الأحكام الشرعية وقواعد التفسير المعتمدة.',
      headers: {
        'Content-Type': 'application/json'
      },
      curl: 'curl -X POST https://ilmnaafi.com/api/scholarly \\\n  -H "Content-Type: application/json" \\\n  -d \'{"query": "Is swallowing water drops from wudu accidentally breaking fast?"}\'',
      response: `{
  "answer": "Accidentally swallowing water drops during wudu without exaggeration does not invalidate the fast according to consensus...",
  "sources": ["Sahih al-Bukhari", "Fath al-Bari"],
  "refutationDetails": "It is excused due to lack of intent (Niyyah)."
}`
    },
    {
      id: 'get-threads',
      method: 'GET',
      path: '/api/forum/threads',
      desc: lang === 'en'
        ? 'Fetch the list of latest student discussions, lessons, questions, and replies from the academic community boards.'
        : 'استخراج أحدث المنشورات والنقاشات الأكاديمية والأسئلة الشائعة من مجالس الطلاب.',
      headers: {
        'Content-Type': 'application/json'
      },
      curl: 'curl -X GET https://ilmnaafi.com/api/forum/threads',
      response: `[
  {
    "id": "thread-101",
    "title": "Anatomical analysis of Al-Hamdulillah throat letters",
    "author": "Sheikh Al-Azhari",
    "createdAt": "2026-06-10T12:00:00Z",
    "likes": 24,
    "repliesCount": 3
  }
]`
    },
    {
      id: 'adhkar-collection',
      method: 'GET',
      path: '/api/adhkar?category=:categoryName',
      desc: lang === 'en'
        ? 'Retrieve an itemized collection of authenticated daily remembrances filtered by category (morning, evening, sleep, after_salah, travel, anxiety, food).'
        : 'استرجاع قائمة الأذكار المحققة المأثورة مصفاة حسب التصنيف (الصباح، المساء، النوم، بعد الصلاة، السفر، الكرب، الطعام).',
      headers: {
        'Content-Type': 'application/json'
      },
      curl: 'curl -X GET https://ilmnaafi.com/api/adhkar?category=anxiety',
      response: `[
  {
    "id": "ax_01",
    "category": "anxiety",
    "arabic": "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ...",
    "transliteration": "La ilaha illallahul-Adheemul-Haleem...",
    "translationEn": "There is no deity except Allah, the All-Great, the Forbearing...",
    "targetCount": 1,
    "source": "Bukhari 6346 / Muslim 2730",
    "grade": "Sahih"
  }
]`
    }
  ];

  const paidEndpoints = [
    {
      id: 'tajweed-voice-heavy',
      method: 'POST',
      path: '/api/v1/enterprise/tajweed-heavy',
      desc: lang === 'en'
        ? 'Advanced 3D oral acoustic vocal positioning model. Leverages high-fidelity neural network pipelines to analyze voice timber raw recordings for deep articulation deviances.'
        : 'التحليل الصوتي اللغوي المتكامل والمطابقة العصبية العميقة للترميز المخارج والحوارك الصوتية ثلاثية الأبعاد بدقة استثنائية.',
      headers: {
        'Authorization': 'Bearer YOUR_ENTERPRISE_KEY',
        'Content-Type': 'application/json'
      },
      curl: 'curl -X POST https://ilmnaafi.com/api/v1/enterprise/tajweed-heavy \\\n  -H "Authorization: Bearer <token>" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"audioUrl": "https://secure.ilmnaafi.com/recitations/student_08.wav"}\'',
      response: `{
  "success": true,
  "makhrajAccuracy": 98.4,
  "vocalFormantMatch": 94.1,
  "articulationIssues": [
    {
      "phoneme": "ق",
      "timestamp": 1.24,
      "severity": "medium",
      "issue": "Insufficient Qalqalah resonance",
      "remedy": "Ensure a robust rebounding vibration on the sound when stopping."
    }
  ]
}`
    },
    {
      id: 'scholar-arbitrage',
      method: 'POST',
      path: '/api/v1/enterprise/scholar-arbitrage',
      desc: lang === 'en'
        ? 'Query high-concurrency vector databases indexing 44 canonical historic jurisprudence and tafsir works with dynamic multilingual synthesis and auto-generated academic PDF dossiers.'
        : 'البحث والاستعلام عالي الدقة والتحقق المتفوق في كتب الأحكام والتفاسير المعيارية مع دعم النطق والتوليد التلقائي لملفات PDF الأكاديمية.',
      headers: {
        'Authorization': 'Bearer YOUR_ENTERPRISE_KEY',
        'Content-Type': 'application/json'
      },
      curl: 'curl -X POST https://ilmnaafi.com/api/v1/enterprise/scholar-arbitrage \\\n  -H "Authorization: Bearer <token>" \\\n  -d \'{"query": "Islamic jurisprudential analysis of automated smart contracts in transactions", "generateReport": true}\'',
      response: `{
  "consensusSummary": "Smart contracts are permissible under covenant integrity principles, provided gharar and riba variables are completely neutralized...",
  "schoolsAnalysis": {
    "Hanafi": "Validated if digital transfer equivalent mimics instant physical posession...",
    "Hanbali": "Fully permitted under general contract liberty clauses except where explicitly forbidden"
  },
  "dossierDownloadUrl": "https://secure.ilmnaafi.com/reports/gen_8849.pdf"
}`
    },
    {
      id: 'high-fi-synthesis',
      method: 'POST',
      path: '/api/v1/enterprise/high-fi-synthesis',
      desc: lang === 'en'
        ? 'Synthesizes ultra-realistic, emotionally-resonant Arabic voice models mimicking veteran Quran reciters, utilizing advanced speech tags for breath punctuation and tajweed pause markers.'
        : 'توليد الصوت المنطوق المرتل الفائق محاكي المهارات البشرية للقرّاء المحترفين لأغراض التلقين والمطابقة الموضعية للآيات.',
      headers: {
        'Authorization': 'Bearer YOUR_ENTERPRISE_KEY',
        'Content-Type': 'application/json'
      },
      curl: 'curl -X POST https://ilmnaafi.com/api/v1/enterprise/high-fi-synthesis \\\n  -H "Authorization: Bearer <token>" \\\n  -d \'{"text": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "style": "murattal_husary", "sampleRate": 48000}\'',
      response: `{
  "audioUrl": "https://secure.ilmnaafi.com/synthesized/output_7714.mp3",
  "durationSeconds": 4.52,
  "breathingMarkers": [2.14]
}`
    }
  ];

  const activeEndpoints = docTab === 'opensource' ? endpoints : paidEndpoints;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10" id="api-docs-viewport">
      {/* Editorial Header */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-emerald-900/40 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10 text-left">
          <div className="inline-flex items-center gap-1 bg-emerald-900/60 border border-emerald-850 px-3 py-1 rounded-full text-xs text-emerald-300 font-bold tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? "Open Consensus Developer Portal" : "بوابة المطورين المفتوحة"}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-serif leading-tight text-white">
            {lang === 'en'
              ? "Alhamdulillah! We're building a free Open source API that empowers Islamic education worldwide."
              : "الحمد لله! نحن نبني واجهة برمجية مفتوحة المصدر لتمكين وبث تكنولوجيا تلاوة الذكر الحكيم مجاناً."
            }
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
            {lang === 'en'
              ? "This developer platform exposes pristine interfaces mapping authentic Quran scripts, recitation streams from Husary & Al-Ghamidi, and interactive correcting models securely to anyone seeking beneficial knowledge."
              : "توفر هذه الواجهة وصولاً مجانياً آمناً لخطوط المصحف المدققة، وتلاوات الحصري والغامدي مدمجة، وخدمات تسجيل المراجعة والمطابقة الفورية تيسيراً وتجاوباً مع متعلمي ومعلمي الأكاديمية."
            }
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white/90 font-mono">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Base URL: /</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white/90 font-mono">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Platform Version: 1.4.0</span>
            </span>
          </div>
        </div>
      </div>

      {/* Modern Open Source and Premium Tab Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto border border-slate-205/80 shadow-xs relative z-20">
        <button
          onClick={() => setDocTab('opensource')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
            docTab === 'opensource'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className={`w-3.5 h-3.5 ${docTab === 'opensource' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>{lang === 'en' ? "Open Source API" : "الواجهة المجانية"}</span>
        </button>
        <button
          onClick={() => setDocTab('paid')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
            docTab === 'paid'
              ? 'bg-gradient-to-r from-emerald-800 to-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${docTab === 'paid' ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>{lang === 'en' ? "Premium / Paid Enterprise" : "المدفوعة للمؤسسات"}</span>
        </button>
      </div>

      {/* Grid: Instructions Side + Interactive Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core Quickstart Card */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-sans">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'en' ? "Authentication Protocol" : "بروتوكول التحقق والأمان"}</span>
            </h3>

            <div className="space-y-4 mt-3 text-xs text-slate-650 leading-relaxed font-normal">
              <p>
                {lang === 'en'
                  ? "Standard user authentication runs securely through secure HttpOnly cookies set automatically on successful sign-in. For external developer integrations, set session payloads explicitly."
                  : "يتم التحقق من هوية طالب العلم تلقائياً عبر ملفات ارتباط مشفرة آمنة تماماً عند تسجيل الدخول من البطاقة الأكاديمية."
                }
              </p>
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 font-mono text-[10px] space-y-1">
                <span className="text-emerald-700 font-bold">Cookie Name:</span>
                <p className="text-slate-800 font-medium">ilm_session</p>
                <span className="text-emerald-700 font-bold">Security headers:</span>
                <p className="text-slate-800 font-medium">HttpOnly, SameSite=Strict</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-sans">
              <Database className="w-4 h-4 text-amber-600" />
              <span>{lang === 'en' ? "Consensus Repositories" : "مستودعات المصدر والبيانات"}</span>
            </h3>

            <div className="space-y-4 mt-3 text-xs text-slate-650 leading-relaxed font-normal">
              <p>
                {lang === 'en'
                  ? "We are fully dedicated to digital sovereignty and open educational access. All data stores are hosted directly under server structures for absolute auditing."
                  : "منصة العلم النافع مفتوحة وحرة المصدر لضمان التميز والأمان الأكاديمي الرقمي والسيادة لجميع الدارسين."
                }
              </p>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-800 font-bold hover:underline"
              >
                <span>{lang === 'en' ? "Browse GitHub Repository" : "تصفح الكود على مستودع جيت هاب"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Detailed API Reference */}
        <div className="lg:col-span-8 space-y-6 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-extrabold text-slate-900 font-sans">
                  {lang === 'en' ? "Endpoint Documentation" : "توثيق نقاط الاتصال البرمجية"}
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
                JSON API / SECURE CORS
              </span>
            </div>

            <div className="space-y-8">
              {activeEndpoints.map((ep) => (
                <div key={ep.id} className="border-b border-slate-100 pb-8 last:border-b-0 last:pb-0" id={`endpoint-${ep.id}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black font-mono tracking-wider px-2 py-1 rounded ${
                      ep.method === 'GET' ? 'bg-emerald-100 text-emerald-850' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                      {ep.path}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">
                    {ep.desc}
                  </p>

                  {/* Copyable cURL request */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pr-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1">
                        <Code className="w-3 h-3 text-emerald-600" />
                        <span>{lang === 'en' ? "Example Request (cURL)" : "طلب تجريبي بواسطة cURL"}</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(ep.curl, ep.id)}
                        className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200/60 px-2 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition"
                      >
                        {copiedEndpoint === ep.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 animate-scale" />
                            <span>{lang === 'en' ? "Copied!" : "تم النسخ!"}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{lang === 'en' ? "Copy Code" : "حرر والخص"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 overflow-x-auto font-mono text-xs border border-slate-800 select-all leading-relaxed whitespace-nowrap md:whitespace-normal">
                      <code>{ep.curl}</code>
                    </div>

                    {/* Example response */}
                    <div className="space-y-1 mt-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1 leading-snug">
                        <span>{lang === 'en' ? "Example Response Body (JSON)" : "جسم الاستجابة التجريبية (JSON)"}</span>
                      </span>
                      <pre className="bg-slate-950 text-[#a7f3d0] rounded-xl p-3.5 overflow-x-auto font-mono text-[11px] leading-relaxed border border-slate-850">
                        <code>{ep.response}</code>
                      </pre>
                    </div>
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
