import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Upload,
  Send,
  RefreshCw,
  Mail,
  User,
  AlertCircle,
  FileText,
  BadgeAlert,
  Clock,
  CheckSquare,
  FileCode,
  Sparkles,
  Trash2,
  Lock,
  ChevronDown
} from 'lucide-react';

interface Issue {
  id: string;
  name: string;
  email: string;
  issueType: 'Bug' | 'Feature Request' | 'Content Error' | 'Scholar Verification Issue' | 'Quran/Tajweed Error' | 'Other';
  description: string;
  screenshot?: string;
  status: 'Pending' | 'Reviewing' | 'Fixed';
  adminMemo?: string;
  created_at: string;
  updated_at: string;
}

interface IssueTrackerViewProps {
  lang: 'ar' | 'en';
}

export default function IssueTrackerView({ lang }: IssueTrackerViewProps) {
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issueType, setIssueType] = useState<Issue['issueType']>('Bug');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Administrative States
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [adminMemo, setAdminMemo] = useState('');
  const [updatingIssueId, setUpdatingIssueId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Translations
  const t = {
    en: {
      title: "Consensus Feedback & Issue Hub",
      subtitle: "Our absolute priority is preservation of educational integrity. Help us review errors, suggest features, or report Tajweed script issues.",
      formHeading: "Submit Feedback / Issue Dossier",
      placeholderName: "Enter your full name",
      placeholderEmail: "Enter your academic email address",
      placeholderDesc: "Provide granular details, step-by-step reproduction guidelines, or source references.",
      labelName: "Your Full Name",
      labelEmail: "Your Email Address",
      labelType: "Classification / Issue Type",
      labelDesc: "Bug & Issue Description",
      labelScreenshot: "Screenshot Documentation (Optional)",
      uploadStatusReady: "Select or drag file here (JPEG/PNG up to 2MB)",
      uploadStatusLoaded: "Screenshot loaded successfully!",
      btnSubmit: "Escalate Issue",
      submittingText: "Dispatching Secure Payload...",
      successTitle: "MashaAllah! Issue Stored In Database",
      successText: "Your issue has been recorded. The review board has been notified and dispatched. An automated receipt has been logged to your inbox.",
      btnAnother: "Report Another Issue",
      ledgerHeading: "Academic Redundancy & Issues Ledger",
      ledgerSubtitle: "Live platform monitoring and administrative verification timeline.",
      statusPending: "Pending Review",
      statusReviewing: "Under Investigation",
      statusFixed: "Resolved / Fixed",
      badgeBug: "Software Bug",
      badgeFeature: "Feature Request",
      badgeContent: "Content Error",
      badgeVerification: "Scholar Verification Issue",
      badgeTajweed: "Quran/Tajweed Error",
      badgeOther: "General Support",
      emptyIssues: "No open reports cataloged. Perfect educational uptime verified.",
      actionResolve: "Submit Resolution & Update Status",
      resolutionPlaceholder: "State corrective steps, fixed codes, or academic reasoning...",
      memoLabel: "Administrative Verdict Memoir",
      statusSelectLabel: "Assign Status",
      resolvedAt: "Resolved at:",
      deleteAudit: "Purge",
      statusTrackerHeading: "Granular Issue Life Cycle"
    },
    ar: {
      title: "ديوان التدقيق والملاحظات الأكاديمية",
      subtitle: "أولويتنا القاطعة هي حفظ صحة وسلامة التوثيق والتعلم الشريف. ساعدنا بتقديم البلاغات وتدقيق الآيات أو طلب الميزات.",
      formHeading: "تقييد بلاغ أو مقترح جديد",
      placeholderName: "اكتب اسمك الثلاثي الكامل",
      placeholderEmail: "اكتب بريدك الأكاديمي المعتمد",
      placeholderDesc: "يرجى تقديم تفاصيل الخطوة، السورة والآية، أو الرمز البرمجي والحديث لإرشاد المحقق العاجل.",
      labelName: "اسم طالب العلم",
      labelEmail: "البريد الإلكتروني المعتمد",
      labelType: "تصنيف البلاغ / الملاحظة",
      labelDesc: "تفاصيل البلاغ والأثر المعياري",
      labelScreenshot: "مرفق البلاغ أو لقطة شاشة توضيحية (اختياري)",
      uploadStatusReady: "اسحب الصورة أو حددها يدوياً (JPEG/PNG حتى 2 ميجابايت)",
      uploadStatusLoaded: "تم تحميل الصورة المرفقة بنجاح!",
      btnSubmit: "إرسال البلاغ وتصعيده",
      submittingText: "يتم فحص وتخزين البيانات بآمان...",
      successTitle: "الحمد لله! تم تقييد البلاغ في قاعدة البيانات",
      successText: "تم تسجيل الحالة بنجاح. تم إرسال تنبيه عاجل لمجلس المحققين، وصدر كود استلام تلقائي إلى بريدك الأكاديمي.",
      btnAnother: "تصدير بلاغ آخر",
      ledgerHeading: "سجل التدقيق والحالات تحت المراجعة",
      ledgerSubtitle: "شاشة استعلام التدفق المباشر للحالات ومجلس المعالجة الفورية.",
      statusPending: "في انتظار المراجعة",
      statusReviewing: "قيد التحقيق والبحث",
      statusFixed: "تم الإصلاح والحل",
      badgeBug: "خلل برمجيات",
      badgeFeature: "طلب ميزة مضافة",
      badgeContent: "خطأ بالمتن والدروس",
      badgeVerification: "تحقيق هوية شيخ أزهري",
      badgeTajweed: "تصويب تلاوة / مصحف",
      badgeOther: "استفسار عام",
      emptyIssues: "لا توجد بلاغات مسجلة حالياً. تم التحقق من تماسك المنصة المطلق.",
      actionResolve: "تقييد قرار التدقيق وإصلاح الحالة",
      resolutionPlaceholder: "اكتب تفاصيل التحديث، الرأي الفقهي، أو الرمز البرمجي الذي تم تصحيحه...",
      memoLabel: "بيان المحقق الأكاديمي والقرار",
      statusSelectLabel: "ترقية الحالة",
      resolvedAt: "تاريخ القرار:",
      deleteAudit: "حذف",
      statusTrackerHeading: "جلسة المتابعة التفصيلية للبلاغ"
    }
  };

  const curr = lang === 'en' ? t.en : t.ar;

  // Load issues on mount
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoadingIssues(true);
    try {
      const res = await fetch('/api/issues');
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error("Failed to load issues:", err);
    } finally {
      setLoadingIssues(false);
    }
  };

  // Convert File to Base64 helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'en' ? "Maximum file size is 2MB" : "الحد الأقصى لحجم الملف هو 2 ميجابايت");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'en' ? "Maximum file size is 2MB" : "الحد الأقصى لحجم الملف هو 2 ميجابايت");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new issue
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          issueType,
          description,
          screenshot
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        // Clear inputs
        setName('');
        setEmail('');
        setDescription('');
        setScreenshot(undefined);
        fetchIssues();
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || "Submission failed");
      }
    } catch (err) {
      setSubmitError("Failed to connect to university server database.");
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve issue
  const handleResolve = async (id: string, targetStatus: Issue['status']) => {
    setUpdatingIssueId(id);
    try {
      const res = await fetch(`/api/issues/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminMemo,
          status: targetStatus
        })
      });

      if (res.ok) {
        const updatedIssue = await res.json();
        setSelectedIssue(updatedIssue.issue);
        setAdminMemo('');
        fetchIssues();
      }
    } catch (err) {
      console.error("Resolve error:", err);
    } finally {
      setUpdatingIssueId(null);
    }
  };

  // Delete issue
  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'en' ? "Are you sure you want to purge this record?" : "هل أنت متأكد من رغبتك في حذف هذا الملف نهائياً؟")) return;
    try {
      const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedIssue?.id === id) {
          setSelectedIssue(null);
        }
        fetchIssues();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Render classification badges
  const renderTypeBadge = (type: Issue['issueType']) => {
    switch (type) {
      case 'Bug':
        return <span className="bg-red-50 text-red-700 border border-red-200/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-sans uppercase">{curr.badgeBug}</span>;
      case 'Feature Request':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-sans uppercase">{curr.badgeFeature}</span>;
      case 'Content Error':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-sans uppercase">{curr.badgeContent}</span>;
      case 'Scholar Verification Issue':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-sans uppercase">{curr.badgeVerification}</span>;
      case 'Quran/Tajweed Error':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-serif uppercase">{curr.badgeTajweed}</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-sans uppercase">{curr.badgeOther}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10" id="issue-tracker-portal">
      {/* Editorial Header Card */}
      <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-amber-900/30 relative overflow-hidden text-left">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />

        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-900/60 border border-amber-850 px-3.5 py-1 rounded-full text-xs text-amber-300 font-bold tracking-wider uppercase font-mono">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? "ACADEMIC VERILOGUE NETWORK" : "شبكة التدقيق الأكاديمي المباشر"}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black font-serif leading-tight">
            {curr.title}
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">
            {curr.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Register Form (lg:col-span-4) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm text-left">
            <h2 className="text-base font-extrabold text-slate-900 font-sans border-b border-sidebar-divider pb-3 mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" />
              <span>{curr.formHeading}</span>
            </h2>

            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-5 text-center py-6"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-850 mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950 font-sans">{curr.successTitle}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{curr.successText}</p>
                  </div>

                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{curr.btnAnother}</span>
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold tracking-wide uppercase text-slate-450 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{curr.labelName}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={curr.placeholderName}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-slate-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold tracking-wide uppercase text-slate-450 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{curr.labelEmail}</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={curr.placeholderEmail}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-slate-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-extrabold tracking-wide uppercase text-slate-450 flex items-center gap-1">
                      <BadgeAlert className="w-3.5 h-3.5 text-slate-400" />
                      <span>{curr.labelType}</span>
                    </label>
                    <div className="relative">
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value as any)}
                        className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-slate-800 font-bold cursor-pointer pr-10"
                      >
                        <option value="Bug">{lang === 'en' ? "🐞 Software Bug / Interface Crash" : "🐞 خلل برمجي في الواجهات"}</option>
                        <option value="Feature Request">{lang === 'en' ? "💡 Feature / Optimization Suggestion" : "💡 اقتراح تزويد ميزة جديدة"}</option>
                        <option value="Content Error">{lang === 'en' ? "📘 Lesson & Curriculum Content Typo" : "📘 خطأ لغوي في المواد المكتوبة"}</option>
                        <option value="Scholar Verification Issue">{lang === 'en' ? "🎓 Scholar Profile Credentials Audits" : "🎓 مراجعة مستندات وهويات المعلمين"}</option>
                        <option value="Quran/Tajweed Error">{lang === 'en' ? "📖 Quranic Script or Tajweed Scoring Issue" : "📖 تصويب كتابة رسم المصحف والتجويد"}</option>
                        <option value="Other">{lang === 'en' ? "⚙️ Other System support issue" : "⚙️ استفسارات وملاحظات أخرى"}</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold tracking-wide uppercase text-slate-450 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{curr.labelDesc}</span>
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={curr.placeholderDesc}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-slate-800 font-normal leading-relaxed"
                    />
                  </div>

                  {/* Screenshot Upload with Drag & Drop */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold tracking-wide uppercase text-slate-450 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>{curr.labelScreenshot}</span>
                    </label>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition ${
                        dragOver 
                          ? 'border-amber-550 bg-amber-50/40' 
                          : screenshot 
                            ? 'border-emerald-500 bg-emerald-50/20' 
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="screenshot-pick-file"
                      />
                      <label htmlFor="screenshot-pick-file" className="w-full h-full cursor-pointer flex flex-col items-center">
                        {screenshot ? (
                          <div className="space-y-2">
                            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                            <p className="text-[10px] font-extrabold text-emerald-800">{curr.uploadStatusLoaded}</p>
                            <img src={screenshot} alt="Screenshot Load Preview" className="max-h-24 object-contain rounded border border-emerald-200/50 mx-auto" />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                            <p className="text-[10.5px] font-bold text-slate-600">{curr.uploadStatusReady}</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{curr.submittingText}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{curr.btnSubmit}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Ledger Timeline & Update Terminal (lg:col-span-8) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-sans flex items-center gap-2">
                  <BadgeAlert className="w-5 h-5 text-emerald-700" />
                  <span>{curr.ledgerHeading}</span>
                </h2>
                <p className="text-[10px] text-slate-405 mt-1">{curr.ledgerSubtitle}</p>
              </div>

              <button
                onClick={fetchIssues}
                disabled={loadingIssues}
                className="self-start sm:self-center bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loadingIssues ? 'animate-spin' : ''}`} />
                <span>{lang === 'en' ? "Sync" : "تحديث"}</span>
              </button>
            </div>

            {loadingIssues ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
                <p className="text-xs text-slate-450 font-bold">{lang === 'en' ? "Syncing issues database..." : "يتم مزامنة البيانات حالياً..."}</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="border border-slate-200/60 border-dashed rounded-2xl py-14 p-6 text-center text-slate-400 space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-500/20 mx-auto" />
                <span className="text-xs font-bold block">{curr.emptyIssues}</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
                {issues.map((iss) => (
                  <div
                    key={iss.id}
                    onClick={() => setSelectedIssue(iss)}
                    className={`p-3.5 hover:bg-slate-50/75 rounded-xl transition-all cursor-pointer flex items-center gap-3 border ${
                      selectedIssue?.id === iss.id 
                        ? 'border-amber-450 bg-amber-50/10 shadow-3xs' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold font-mono text-slate-450 bg-slate-150 px-2 py-0.5 rounded">
                          #{iss.id}
                        </span>
                        {renderTypeBadge(iss.issueType)}

                        {iss.status === 'Fixed' ? (
                          <span className="bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase">
                            {curr.statusFixed}
                          </span>
                        ) : iss.status === 'Reviewing' ? (
                          <span className="bg-blue-150 text-blue-800 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase">
                            {curr.statusReviewing}
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase">
                            {curr.statusPending}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {iss.description}
                      </h3>

                      <div className="flex items-center gap-2 text-[10px] text-slate-450">
                        <span className="font-extrabold max-w-[150px] truncate">{iss.name}</span>
                        <span>•</span>
                        <span>{new Date(iss.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(iss.id);
                      }}
                      className="p-1 px-2 hover:bg-red-50 hover:text-red-700 text-slate-400 rounded-lg cursor-pointer transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-extrabold uppercase font-mono">{curr.deleteAudit}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Granular Update Control Screen */}
          {selectedIssue && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative text-left space-y-6"
            >
              <button
                onClick={() => setSelectedIssue(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 bg-white hover:bg-slate-100 border border-slate-200/50 rounded-lg cursor-pointer text-xs"
              >
                X
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <h3 className="text-sm font-extrabold font-sans text-slate-900">{curr.statusTrackerHeading}</h3>
                  <span className="text-[10px] font-mono text-slate-450 ml-auto">ID: {selectedIssue.id}</span>
                </div>

                {/* Sender card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-150 p-4 rounded-xl text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-extrabold block uppercase tracking-wide text-[9.5px]">{curr.labelName}</span>
                    <span className="font-bold text-slate-800">{selectedIssue.name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-extrabold block uppercase tracking-wide text-[9.5px]">{curr.labelEmail}</span>
                    <span className="font-bold text-slate-800">{selectedIssue.email}</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-white border border-slate-150 p-4 rounded-xl text-xs">
                  <span className="text-slate-400 font-extrabold block uppercase tracking-wide text-[9.5px]">{curr.labelDesc}</span>
                  <p className="text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">{selectedIssue.description}</p>

                  {selectedIssue.screenshot && (
                    <div className="mt-3 space-y-1.5">
                      <span className="text-slate-400 font-extrabold block uppercase tracking-wide text-[9.5px]">{lang === 'en' ? "Visual Annex" : "الملف المرئي الملحق"}</span>
                      <a href={selectedIssue.screenshot} target="_blank" rel="noreferrer" className="inline-block">
                        <img src={selectedIssue.screenshot} alt="Visual Attachment" className="max-h-48 rounded border border-slate-200" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Output Admin Statement if resolved */}
                {selectedIssue.status === 'Fixed' && (
                  <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-850">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'en' ? "Approved Correction Verdict" : "قرار التدقيق النهائي المعتمد"}</span>
                    </div>
                    <p className="text-slate-700 italic leading-relaxed">{selectedIssue.adminMemo}</p>
                    <div className="text-[10px] text-slate-400 font-mono text-right">
                      {curr.resolvedAt} {new Date(selectedIssue.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Resolution update panel */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-4">
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-[10px] text-slate-600 font-bold tracking-wider uppercase font-mono max-w-max">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>{lang === 'en' ? "Review Board Command Line" : "محطة اتخاذ القرار والموافقة"}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold tracking-wide uppercase text-slate-450 block">
                      {curr.memoLabel}
                    </label>
                    <textarea
                      value={adminMemo}
                      onChange={(e) => setAdminMemo(e.target.value)}
                      placeholder={curr.resolutionPlaceholder}
                      rows={2}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 focus:border-amber-500 font-normal"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      onClick={() => handleResolve(selectedIssue.id, 'Reviewing')}
                      disabled={updatingIssueId === selectedIssue.id}
                      className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-extrabold tracking-wide rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${updatingIssueId === selectedIssue.id ? 'animate-spin' : ''}`} />
                      <span>{lang === 'en' ? "Mark Under Investigation" : "بدء التحقيق وبحث المسألة"}</span>
                    </button>

                    <button
                      onClick={() => handleResolve(selectedIssue.id, 'Fixed')}
                      disabled={updatingIssueId === selectedIssue.id}
                      className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-extrabold tracking-wide rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{lang === 'en' ? "Approve Resolution & Dispatch Email" : "الموافقة تامة وإصلاح الحالة آلياً"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
