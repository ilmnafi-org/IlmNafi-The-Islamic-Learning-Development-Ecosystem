import React, { useState } from 'react';
import { ShieldCheck, Scale, FileText, Landmark, UserCheck } from 'lucide-react';

interface LegalDocsProps {
  lang: 'ar' | 'en';
  initialDoc?: 'privacy' | 'terms' | 'academic';
  onBackToHome: () => void;
}

export default function LegalDocsView({ lang, initialDoc = 'privacy', onBackToHome }: LegalDocsProps) {
  const [activeDoc, setActiveDoc] = useState<'privacy' | 'terms' | 'academic'>(initialDoc);

  const sidebarItems = [
    {
      id: 'privacy' as const,
      en: 'Privacy Protection Rules',
      ar: 'سياسة حماية البيانات والمعلومات',
      icon: ShieldCheck,
    },
    {
      id: 'terms' as const,
      en: 'Academic Service Terms',
      ar: 'شروط الاستخدام والخدمة',
      icon: Scale,
    },
    {
      id: 'academic' as const,
      en: 'Honor Code & Integrity',
      ar: 'ميثاق الأمانة العلمية والنزاهة',
      icon: UserCheck,
    },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 py-8 font-sans text-right" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* SIDE NAV FOR LEGAL PAGES */}
        <div className="w-full md:w-1/4 bg-[#FAF9F5]/60 border border-slate-200 rounded-3xl p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800">
              {lang === 'en' ? 'Platform Charters' : 'مواثيق المنصة القانونية'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {lang === 'en' ? 'Last revised: June 2026' : 'آخر تحديث: ذو الحجة ١٤٤٧ هـ'}
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeDoc === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDoc(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-150 text-slate-600 hover:bg-slate-50'
                  }`}
                  id={`btn-legal-${item.id}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{lang === 'en' ? item.en : item.ar}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onBackToHome}
            className="w-full text-center text-[10px] font-extrabold text-slate-500 hover:text-slate-800 pt-2 block border-t border-slate-150 transition-colors"
          >
            {lang === 'en' ? '← Back to Sanctuary' : '← العودة لبوابة الأكاديمية'}
          </button>
        </div>

        {/* MAIN DOCUMENT TEXT AREA */}
        <div className="w-full md:w-3/4 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
          {activeDoc === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] bg-emerald-50 text-emerald-800 rounded font-black px-2 py-0.5 uppercase tracking-wide">
                  {lang === 'en' ? 'GDPR-Compliant & Secure' : 'حماية قصوى وحفظ الأسرار'}
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 mt-2">
                  {lang === 'en' ? 'Data and Personal Information Privacy Policy' : 'وثيقة الالتزام بسياسة الخصوصية وحماية بيانات الدارسين'}
                </h1>
              </div>

              <div className="text-xs md:text-sm text-slate-600 space-y-4 leading-relaxed font-sans text-right">
                <p>
                  {lang === 'en'
                    ? 'At Ilm Naafi Academy, we treat learning data with structural sacredness and high protection layers. Your progress tracks (including Tajweed audio waveforms, and weekly memorization records) are processed locally where feasible and secured with secure HttpOnly cookies.'
                    : 'في أكاديمية العلم النافع الرقمية، نعتبر بيانات المتعلم أمانة بالغة السرية. نحن نلتزم بحماية كافة ملفاتكم (سواء تسجيلات التلاوة الصوتية، إحصاءات الحفظ الأسبوعية، أو البريد الإلكتروني) عبر تقنيات تشفير الخادم واستخدام الجلسات المقفلة برمجياً.'}
                </p>

                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {lang === 'en' ? '1. Information We Collect' : '١. البيانات التي يتم إرسالها وإدارتها'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 pr-4">
                    <li>{lang === 'en' ? 'Educational user profiles (username and email address)' : 'معلومات الحساب العام للدارس (الاسم المستعار وعنوان البريد الإلكتروني)'}</li>
                    <li>{lang === 'en' ? 'Tajweed pronunciation speech inputs solely for immediate translation analysis' : 'التسجيلات الصوتية ومقاطع التدريب على أحكام النطق ومخارج الحروف'}</li>
                    <li>{lang === 'en' ? 'Academic progression logs, daily minutes, quizzes, and certificates earned' : 'سجلات الإنجاز المنهجي، ودرجات التحصيل، وعدد شهادات الإتقان الصادرة'}</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {lang === 'en' ? '2. Securing Academic Integrity' : '٢. حماية وتشفير الاتصال'}
                  </h3>
                  <p>
                    {lang === 'en'
                      ? 'No sensitive records are sold or exposed to advertising engines. Our database utilizes robust cryptography on raw pins/passwords with salted secure-hashing to protect files and prevent database leaks.'
                      : 'لا يتم إشراك أو بيع هذه البيانات لأي جهة إعلانية أو استخباراتية خارجية على الإطلاق. معيار الأمان في خادم الأكاديمية يعتمد علىSalted Hash لتخزين الرموز السرية من أجل حظر القرصنة وحفظ الخصائص الشخصية.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {lang === 'en' ? '3. User Access and Deletion' : '٣. أحقية الدارس في تعديل وحذف البيانات'}
                  </h3>
                  <p>
                    {lang === 'en'
                      ? 'You hold full control of your academic identity. You may purge your local cache data or request complete account erasure by contacting our focal registrar: apatirasulayman@gmail.com.'
                      : 'يمتلك الدارس في أي وقت الصلاحية الكاملة لتحديث هويته أو حذف حسابه النهائي من سجلات الخادم عبر توجيه طلب رسمي مباشر لمسؤول التسجيل بالمنصة على البريد الإلكتروني: apatirasulayman@gmail.com.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] bg-amber-55 text-amber-900 rounded font-black px-2 py-0.5 uppercase tracking-wide">
                  {lang === 'en' ? 'Official Terms' : 'المستند التنظيمي للخدمة'}
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 mt-2">
                  {lang === 'en' ? 'Academic Terms of Service' : 'شروط اتفاقية الاستخدام وخدمات المنصة الأكاديمية'}
                </h1>
              </div>

              <div className="text-xs md:text-sm text-slate-600 space-y-4 leading-relaxed font-sans text-right">
                <p>
                  {lang === 'en'
                    ? 'By entering Ilm Naafi web portal, you pledge to respect the classical methods of Quranic studies and digital educational conduct. Access is granted globally to anyone seeking authentic knowledge (Ilm Naafi).'
                    : 'بدخولك إلى مجالس منصة أكاديمية العلم النافع الرقمية، فإنك تعاهد الله والمنصة على الالتزام بحرمة علوم الوحيين وآداب الطلب وقرارات الهيئة العلمية العامة.'}
                </p>

                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {lang === 'en' ? '1. No Abuse Policy' : '١. مكافحة الاستغلال والعبث التقني'}
                  </h3>
                  <p>
                    {lang === 'en'
                      ? 'Users are strictly forbidden from abusing scholarly coaching integrations, flooding discussions with non-academic inquiries, or bypassing security controls on API routes.'
                      : 'يُحظر منعاً باتاً استغلال منصة الاختبارات أو برمجيات التدريب الصوتي بالذكاء الاصطناعي لإنشاء طلبات مكررة أو تتبع ثغرات خفية بهدف تعطيل موارد الأكاديمية.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {lang === 'en' ? '2. Right to Terminate' : '٢. الحق في إيقاف رخص الاستفادة'}
                  </h3>
                  <p>
                    {lang === 'en'
                      ? 'Administrators hold the right to revoke student access cards in case of continuous academic misbehavior or explicit breach of intellectual integrity.'
                      : 'تحتفظ اللجنة العلمية بكامل الحق لتعطيل بطاقات المتعلمين أو سحب الشهادات الممنوحة مؤقتاً في حالات الافتراء أو الغش المنهجي.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'academic' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] bg-red-50 text-red-800 rounded font-black px-2 py-0.5 uppercase tracking-wide">
                  {lang === 'en' ? 'Prerequisites of study' : 'آداب وسلوك الدارس'}
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 mt-2">
                  {lang === 'en' ? 'Academic Integrity & Scholarship Ethics' : 'ميثاق النزاهة العلمية وضوابط المنح الدراسية'}
                </h1>
              </div>

              <div className="text-xs md:text-sm text-slate-600 space-y-4 leading-relaxed font-sans text-right">
                <p>
                  {lang === 'en'
                    ? 'Islamic studies have historically depended on robust "Isnad" (chains of verification) and strict honesty. We hold scholars to the highest degree of respect for intellectual ownership.'
                    : 'لقد قام صرح الشريعة والعلوم الإسلامية على مبدأ الإسناد والتوثق التام. إن الأمانة والنسبة الدقيقة هما أساس النزاهة العلمية وبناء رصيد الثقة الأكاديمية.'}
                </p>

                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {lang === 'en' ? '1. Verification of Work' : '١. نسبة النتاج الفكري لأصحابه'}
                  </h3>
                  <p>
                    {lang === 'en'
                      ? 'Whenever publishing summaries, translated manuscripts, or legal rulings in the discussion circles, please supply detailed references referencing classical books.'
                      : 'عند مناقشة تحقيق أو تلخيص المخطوطات في حلقات التداول، نأمر الدارسين بأهمية توثيق النقل بالإحالات الدقيقة والمصادر المحققة بآداب البحث العلمي.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {lang === 'en' ? '2. Original Submissions' : '٢. مراجعة التلاوات الفردية'}
                  </h3>
                  <p>
                    {lang === 'en'
                      ? 'Your memorization and recitations must occur realistically from memory. Mock recordings or generative outputs submitted to deceive the AI Tajweed coach bypass the purpose of persistent spiritual transformation.'
                      : 'يجب أن يقدم المتعلم تلاوته بنفسه مخلصاً في طلب المعرفة والتصحيح، ويُذم استخدام أصوات آلية لغرض خداع المحلل الذكي لتخطي الاختبارات دون تدريب حقيقي.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
