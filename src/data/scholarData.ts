/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Scholar {
  id: string;
  nameEn: string;
  nameAr: string;
  avatar: string;
  institutionEn: string;
  institutionAr: string;
  qualificationsEn: string[];
  qualificationsAr: string[];
  ijazahEn: string[];
  ijazahAr: string[];
  badgeEn: string;
  badgeAr: string;
  followersCount: number;
}

export interface ScholarQuestion {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  category: 'aqeedah' | 'fiqh' | 'hadith' | 'quran_tajweed' | 'family' | 'finance' | 'contemporary';
  studentNameEn: string;
  studentNameAr: string;
  studentAvatar: string;
  date: string;
  likesCount: number;
  scholarAnswers: ScholarAnswer[];
  communityComments: CommunityComment[];
}

export interface ScholarAnswer {
  id: string;
  scholarId: string;
  bodyEn: string;
  bodyAr: string;
  quranReferences: {
    surahEn: string;
    surahAr: string;
    verse: string;
    textEn: string;
    textAr: string;
  }[];
  hadithReferences: {
    sourceEn: string;
    sourceAr: string;
    number: string;
    textEn: string;
    textAr: string;
  }[];
  scholarlyWorksEn: string[];
  scholarlyWorksAr: string[];
  date: string;
  supportCount: number;
}

export interface CommunityComment {
  id: string;
  author: string;
  role: string;
  avatar: string;
  date: string;
  bodyEn: string;
  bodyAr: string;
}

export interface Webinar {
  id: string;
  titleEn: string;
  titleAr: string;
  topicEn: string;
  topicAr: string;
  scholarId: string;
  dateEn: string;
  dateAr: string;
  timeEn: string;
  timeAr: string;
  status: 'live' | 'upcoming' | 'recorded';
  descriptionEn: string;
  descriptionAr: string;
  handouts: {
    nameEn: string;
    nameAr: string;
    size: string;
    type: 'pdf' | 'mp3' | 'notes';
  }[];
  isRegistered?: boolean;
}

export interface ScholarAnnouncement {
  id: string;
  scholarId: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  date: string;
  likes: number;
}

// Pre-seeded Verified Scholars DB
export const VERIFIED_SCHOLARS: Scholar[] = [
  {
    id: "scholar_yusuf",
    nameEn: "Prof. Dr. Yusuf Al-Asim",
    nameAr: "أ.د. يوسف العاصم",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    institutionEn: "Professor of Comparative Fiqh, Al-Azhar University",
    institutionAr: "أستاذ الفقه المقارن، جامعة الأزهر الشريف",
    qualificationsEn: [
      "Ph.D. in Islamic Jurisprudence & Usul Al-Fiqh with Honor Medal",
      "Advisor to regional Islamic Finance Supervisory Boards",
      "Author of 'Decisions in Classical Transactions' (3 Volumes)"
    ],
    qualificationsAr: [
      "دكتوراه بمرتبة الشرف الأولى في الفقه المقارن وأصوله",
      "مستشار لعدد من الهيئات الشرعية الرقابية للمصارف الإسلامية",
      "مؤلف كتاب 'النوازل في المعاملات المالية المعاصرة' (3 مجلدات)"
    ],
    ijazahEn: [
      "Ijazah in Hafs 'an 'Asim with an unbroken chain directly to the Messenger ﷺ",
      "Ijazah in Al-Muwatta of Imam Malik",
      "Ijazah in Sahih Al-Bukhari and Sahih Muslim compilation chains"
    ],
    ijazahAr: [
      "إجازة برواية حفص عن عاصم بسند متصل إلى النبي ﷺ",
      "إجازة في كتاب الموطأ للإمام مالك بن أنس",
      "إجازة في رواية الصحيحين البخاري ومسلم"
    ],
    badgeEn: "Senior Jurist (Mufti)",
    badgeAr: "مفتي ومستشار فقهي",
    followersCount: 1420
  },
  {
    id: "scholar_tariq",
    nameEn: "Dr. Tariq Al-Mansoor",
    nameAr: "د. طارق المنصور",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    institutionEn: "Dean of Hadith Sciences, Islamic University of Madinah",
    institutionAr: "عميد كلية علوم الحديث والشريعة، الجامعة الإسلامية بالمدينة",
    qualificationsEn: [
      "Ph.D. in Hadith Critical Methodologies (Ilm Ar-Rijal)",
      "Senior Member of the International Hadith Verification Assembly",
      "Frequent Lecturer inside the Prophet's Masjid (Al-Masjid an-Nabawi)"
    ],
    qualificationsAr: [
      "دكتوراه في مناهج نقد الحديث وعلم الجرح والتعديل",
      "عضو الهيئة العالمية لتدقيق الحديث النبوي الشريف",
      "مدرس معتمد في المسجد النبوي الشريف بالمدينة المنورة"
    ],
    ijazahEn: [
      "Ijazah in Al-Kutub al-Sittah (The Six Authentic Hadith Books)",
      "Transmitted chain of narration (Sanad) of Imam Al-Nawawi’s works",
      "Ijazah in Al-Shatibiyyah for Quranic Recitations"
    ],
    ijazahAr: [
      "إجازة في الكتب الستة الصحاح والمسانيد النبوية",
      "سند رواية متصل لمصنفات الإمام النووي الشريفة",
      "إجازة في الشاطبية للقراءات السبع"
    ],
    badgeEn: "Hadith Specialist (Muhaddith)",
    badgeAr: "محدث ومحقق أسانيد",
    followersCount: 2280
  },
  {
    id: "scholar_maryam",
    nameEn: "Sheikha Maryam Al-Sabah",
    nameAr: "الشيخة مريم الصباح",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    institutionEn: "Director of Tajweed Studies, Umm Al-Qura University",
    institutionAr: "مديرة دراسات التجويد والقراءات، جامعة أم القرى بمكة المكرمة",
    qualificationsEn: [
      "Ph.D. in Qur'anic Linguistics & Phonology",
      "Board Chair of Female Quranic Memorization Alliances in Makkah",
      "Expert evaluator of real-time phonetic recitation algorithms"
    ],
    qualificationsAr: [
      "دكتوراه في اللسانيات القرآنية ومخارج وأصوات الحروف",
      "رئيسة لجان الإشراف على حلقات التحفيظ النسائية والحفاظ بمكة",
      "مستشارة مراجعة هندسة الصوتيات وتطبيقات القراءات الرقمية"
    ],
    ijazahEn: [
      "High Ijazah in the Ten Mutawatir Qira'at (both Shath and Tayyibah paths)",
      "Ijazah in Matn Al-Jazariyyah with complete vocalization recitation",
      "Ijazah in Matn Tuhfat Al-Atfal"
    ],
    ijazahAr: [
      "إجازة بالقراءات العشر المتواترة من طريقي الشاطبية والدرة",
      "إجازة في منظومة الجزرية بشرحها اللفظي والعملي",
      "إجازة في متن تحفة الأطفال للمسهم والقرّاء"
    ],
    badgeEn: "Master Reciter (Muqri'ah)",
    badgeAr: "مقرئة بالقراءات العشر",
    followersCount: 1850
  },
  {
    id: "scholar_ahmed",
    nameEn: "Sheikh Ahmed Al-Mubarak",
    nameAr: "الشيخ أحمد المبارك",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    institutionEn: "Chairperson of Contemporary Issues, King Abdulaziz University",
    institutionAr: "رئيس قسم القضايا الفقهية المعاصرة، جامعة الملك عبد العزيز",
    qualificationsEn: [
      "Master's in Islamic Finance & Ethical Economics",
      "Advisor on Bioethics and Contemporary Medical Research",
      "Shariah Compliance Auditor for Global Islamic Venture Capitals"
    ],
    qualificationsAr: [
      "ماجستير الاقتصاد الإسلامي والتمويل الأخلاقي المعاصر",
      "عضو مجلس البحوث الطبية والبيولوجية المعاصرة من الناحية الشرعية",
      "مدقق شرعي معتمد لصناديق رأس المال الجريء العالمية"
    ],
    ijazahEn: [
      "Ijazah in Fiqh and Usul from Al-Masjid al-Haram scholars",
      "Ijazah in Al-Risalah of Imam Al-Shafi'i"
    ],
    ijazahAr: [
      "إجازة في الفقه وأصوله من علماء ومدرسي المسجد الحرام",
      "إجازة في كتاب الرسالة للإمام الشافعي"
    ],
    badgeEn: "Contemporary Expert",
    badgeAr: "خبير النوازل والقضايا المعاصرة",
    followersCount: 950
  }
];


