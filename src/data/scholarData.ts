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

// Seed Scholar Questions (The Scholar Knowledge Network)
export const SEED_SCHOLAR_QUESTIONS: ScholarQuestion[] = [
  {
    id: "sq_1",
    titleEn: "Vocalization margins of Madd Muttasil in Warsh 'an Nafi recitation path",
    titleAr: "مقادير مد المتصل في رواية ورش عن نافع من طريق الأزرق",
    bodyEn: "Assalamu Alaikum, I am studying how Warsh recitation differs from Hafs in elongated vowels (Madd). In Surah Al-Baqarah, does the Madd Muttasil require a constant 6 harakat list, or can it be shortened to 4 under specific reading speeds (Hadr)?",
    bodyAr: "السلام عليكم ورحمة الله، أدرس حالياً أصول رواية ورش عن نافع مقارنة بحفص. هل المد المتصل في طريق الأزرق يتعين فيه المد مشبعاً بمقدار ست حركات قولا واحداً، أم يجوز القصر أو التوسط (4 حركات) تماشياً مع مراتب القراءة السريعة كالحدر؟",
    category: "quran_tajweed",
    studentNameEn: "Kamal Mansouri",
    studentNameAr: "كمال منصوري",
    studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    date: "2026-06-12",
    likesCount: 15,
    scholarAnswers: [
      {
        id: "sa_1_1",
        scholarId: "scholar_maryam",
        bodyEn: "Wa Alaikum Assalam Kamal. In the recitation path of Warsh 'an Nafi via Ash-Shatibiyyah (the Shatiri/Azraq path), there is absolute consensus among the Imams of Recitation that Madd Muttasil (both obligatory connected and allowed separated) is exclusively elongated to 6 Harakat (Ishba'). Shortening it to 4 or 5 counts is not permitted in this specific path, regardless of recitation speed. Whether you read in Tahqeeq (slow), Tawassut (moderate), or Hadr (swift), you must sustain the Elongation to 6 full counts. Shortening is only valid in other specific pathways not commonly taught in North African canonical schools.",
        bodyAr: "وعليكم السلام ورحمة الله وبركاته يا كمال. في أصول رواية ورش عن نافع من طريق الشاطبية (طريق الأزرق)، المد المتصل والمنفصل يمدان إشباعاً بمقدار ست حركات وجوباً ولزوماً. ولا يجوز تخفيضه إلى أربع أو خمس حركات مطلقاً في هذا الطريق، بصرف النظر عن مرتبة القراءة سواءً كانت تحقيقاً أو تدويراً أو حدراً. المحافظة على الحركات الست هي الأداء الصحيح المعتمد في طريق الشاطبية المتداول.",
        quranReferences: [
          {
            surahEn: "Al-Baqarah",
            surahAr: "البقرة",
            verse: "5",
            textEn: "And those are the successful ones.",
            textAr: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ"
          }
        ],
        hadithReferences: [
          {
            sourceEn: "Sahih Al-Bukhari",
            sourceAr: "صحيح البخاري",
            number: "4982",
            textEn: "Qatadah reported: I asked Anas about the recitation of Quran by the Prophet ﷺ. He said: He used to prolong his recitation (Madd).",
            textAr: "سألت أنساً عن قراءة النبي صلى الله عليه وسلم فقال: كان يمد مداً."
          }
        ],
        scholarlyWorksEn: [
          "Imam Ad-Dani (Taysir fi al-Qira'at al-Sab')",
          "Imam Al-Shatibi (Hirz al-Amani wa Wajh al-Tahani)"
        ],
        scholarlyWorksAr: [
          "الإمام الداني (التيسير في القراءات السبع)",
          "الإمام الشاطبي (حرز الأماني ووجه التهاني في القراءات السبع)"
        ],
        date: "2026-06-13",
        supportCount: 4
      }
    ],
    communityComments: [
      {
        id: "scc_1_1",
        author: "Prof. Dr. Yusuf Al-Asim",
        role: "Faculty Qari",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
        date: "2026-06-13",
        bodyEn: "I fully support my colleague Sheikha Maryam's response. Accuracy within the recital chains is a trust that must be guarded meticulously. Jazakumullah Khairan.",
        bodyAr: "أؤيد ما تفضلت به الزميلة الفاضلة الشيخة مريم الصباح تمام التأييد. إن الضبط اللفظي المتوارث في أداء القراءات أمانة كبرى يتعين صيانتها. جزاكم الله خيراً."
      }
    ]
  },
  {
    id: "sq_2",
    titleEn: "Riba-Free Microfinance Models for Student Capital Projects",
    titleAr: "معيار المعاملات الخالية من الربا في القروض المصغرة للمشاريع الطلابية",
    bodyEn: "Assalamu Alaikum. Many student entrepreneurs are accessing modern crowd-lending platforms that offer 'zero interest leverage' but enforce a standard 2.5% administration fee upfront based on the total loan amount. Does this administrative fee conflict with Islamic financial principles (Qard Hasan)?",
    bodyAr: "السلام عليكم ورحمة الله. يتطلع العديد من الطلاب لتمويل مشاريعهم الجامعية عبر منصات قروض مصغرة تدعي الخلو من الفائدة الربوية، لكنها تفرض رسوماً إدارية ثابتة بنسبة 2.5% من إجمالي القرض تسدد مسبقاً. هل تعتبر هذه الرسوم من قبيل الربا الخفي وكيف يوجه فقهياً؟",
    category: "finance",
    studentNameEn: "Bilal Umar",
    studentNameAr: "بلال عمر",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    date: "2026-06-10",
    likesCount: 22,
    scholarAnswers: [
      {
        id: "sa_2_1",
        scholarId: "scholar_yusuf",
        bodyEn: "Wa Alaikum Assalam Bilal. This is a critical question for modern Muslim students. The International Islamic Fiqh Academy (Decision No. 13/1) has specified that administrative service fees on interest-free loans (Qard Hasan) are permissible ONLY if they represent the actual, exact direct expenses of processing the loan, and are NOT structured as a percentage of the loan amount. Charging a percentage fee (e.g., 2.5% of the capital amount) is not allowed because it scales with the size of the loan, which essentially mirrors interest (usury). If the platform charges a true flat cost (such as a constant $20 fee representing actual server/postage overhead) regardless of borrowing $1,000 or $10,000, then it is Shariah-compliant and clean.",
        bodyAr: "وعليكم السلام ورحمة الله وبركاته يا بلال. هذا السؤال يهم قطاعاً واسعاً من المبادرين الشباب. لقد أصدر مجمع الفقه الإسلامي الدولي قراراً شرعياً واضحاً (قرار رقم 13/1) ينص على أن الرسوم الإدارية لقروض الحسن تجوز فقط إذا كانت تعادل التكلفة الفعلية المباشرة لإتمام القرض وتوثيقه، بشرط ألا تكون منسوبة أو مشتقة كنسبة مئوية من حجم القرض نفسه. فرض نسبة مئوية (مثل 2.5% من إجمالي المبلغ) يجعل التكلفة تزداد بزيادة الدين، وهو ما يشابه الربا. أما إذا كانت رسوماً ثابتة مقطوعة (مثلاً 50 ريالاً كقيمة فعلية لأوراق المعاملة وتوثيقها) بصرف النظر عن حجم القرض، فالمعاملة جائزة.",
        quranReferences: [
          {
            surahEn: "Al-Baqarah",
            surahAr: "البقرة",
            verse: "275",
            textEn: "Whereas Allah has permitted transaction and has forbidden interest.",
            textAr: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا"
          }
        ],
        hadithReferences: [
          {
            sourceEn: "Sunan Al-Bayhaqi",
            sourceAr: "سنن البيهقي",
            number: "10935",
            textEn: "Every loan that brings a conditional benefit (to the lender) is usury (Riba).",
            textAr: "كل قرض جر منفعة فهو ربا"
          }
        ],
        scholarlyWorksEn: [
          "International Islamic Fiqh Academy Resolution 13/1",
          "AAOIFI Shariah Standard No. 19 (Qard)"
        ],
        scholarlyWorksAr: [
          "قرار مجمع الفقه الإسلامي الدولي بشأن أجور الخدمات المصرفية",
          "المعايير الشرعية الصادرة عن أيوفي - معيار القرض رقم 19"
        ],
        date: "2026-06-11",
        supportCount: 6
      }
    ],
    communityComments: []
  }
];

// Seed Scholar Announcements
export const SEED_ANNOUNCEMENTS: ScholarAnnouncement[] = [
  {
    id: "ann_1",
    scholarId: "scholar_yusuf",
    titleEn: "Release of Comparative Fiqh Lecture Slides - Chapter 4",
    titleAr: "طرح الشرائح التعليمية لمادة الفقه المقارن - الباب الرابع",
    bodyEn: "Dear students, I have uploaded the complete PDF study notes detailing the difference in legal definitions of ownership (Milkiyyah) across the Hanafi and Maliki schools. Please review before Saturday webinar.",
    bodyAr: "أعزائي الطلاب، تم رفع الشرائح والملخص الدراسي الكامل بصيغة PDF الذي يعالج الفروق الاصطلاحية في مفهوم الملكية بين السادة الحنفية والمالكية. يرجى الاطلاع والمراجعة قبل ندوة السبت.",
    date: "2026-06-15",
    likes: 42
  },
  {
    id: "ann_2",
    scholarId: "scholar_tariq",
    titleEn: "Manuscript Verification Group Project Launch",
    titleAr: "إطلاق ورش العمل التطبيقية لتحقيق المخطوطات الحديثية",
    bodyEn: "I will select 5 outstanding student researchers based on their performance on our Hadith taxonomy course to participate in digitizing and verifying rare Bukhari margins in Damascus library archives.",
    bodyAr: "أعتزم ترشيح 5 طلاب متميزين من المجموعات البحثية الحالية للانضمام لفريق العمل التطبيقي المعني بتحقيق هوامش نادرة لمخطوطات صحيح البخاري المحفوظة في مكتبات دمشق الأثرية.",
    date: "2026-06-14",
    likes: 85
  }
];

// Seed Webinars & Live Scholar Sessions
export const SEED_WEBINARS: Webinar[] = [
  {
    id: "web_1",
    titleEn: "Usool al-Fiqh: Decoding Modern Electronic Contracts",
    titleAr: "أصول الفقه: تأصيل عقود التجارة الإلكترونية المعاصرة والأصول الرقمية",
    topicEn: "Islamic Finance",
    topicAr: "المعاملات المالية الإسلامية",
    scholarId: "scholar_yusuf",
    dateEn: "Next Saturday",
    dateAr: "السبت القادم",
    timeEn: "8:00 PM (GMT+3)",
    timeAr: "8:00 مساءً بتوقيت مكة",
    status: "upcoming",
    descriptionEn: "Join Professor Yusuf Al-Asim in an interactive examination of crowdfunding, modern tokenized investments, and contract requirements under Classical Shariah principles.",
    descriptionAr: "انضموا للأستاذ الدكتور يوسف العاصم في ندوة تفاعلية لتأصيل بيوع التمويل الجماعي، والعملات المرمّزة، والضوابط الحاكمة للعقود الإلكترونية وفقاً للقواعد الكلية والجزئية.",
    handouts: [
      { nameEn: "Syllabus_Contemporary_Fiqh.pdf", nameAr: "مفردات_الفقه_المعاصر.pdf", size: "1.4 MB", type: "pdf" },
      { nameEn: "Lecture_Notes_Session_1.pdf", nameAr: "ملخص_المحاضرة_الأولى.pdf", size: "850 KB", type: "notes" }
    ],
    isRegistered: false
  },
  {
    id: "web_2",
    titleEn: "LIVE WORKSHOP: Advanced Tajweed - Intonations of the Ten Qira'at",
    titleAr: "ورشة عمل تفاعلية مباشرة: الأداء التجويدي المتقدم لفرش الحروف في القراءات العشر",
    topicEn: "Quranic Phonology",
    topicAr: "الأداء الصوتي القرآني",
    scholarId: "scholar_maryam",
    dateEn: "Today",
    dateAr: "اليوم",
    timeEn: "Live Now",
    timeAr: "مباشر الآن",
    status: "live",
    descriptionEn: "Sheikha Maryam is hosting an interactive session. Master reciters can listen live, preview linguistic overlays, and submit recitation audio samples for instant scholar annotation.",
    descriptionAr: "الشيخة مريم الصباح تستضيف الآن ورشة متقدمة لضبط نطق المد والفرش. استمع للتوجيهات مباشرة، واستعرض قواعد التجويد المفصلة مع إمكانية طرح أسئلة.",
    handouts: [
      { nameEn: "Al_Jazariyyah_Tajweed_Vocalization_Map.pdf", nameAr: "خريطة_مخارج_منظومة_الجزرية.pdf", size: "3.1 MB", type: "pdf" },
      { nameEn: "Practical_Elongations_Warsh.mp3", nameAr: "تسجيل_أمثلة_المد_رواية_ورش.mp3", size: "5.4 MB", type: "mp3" }
    ],
    isRegistered: true
  },
  {
    id: "web_3",
    titleEn: "The Golden Age of Hadith Compilation: The Musnad Studies",
    titleAr: "عصر التأسيس لتدوين المسانيد في القرون الثلاثة الأولى بالمدينة وبغداد",
    topicEn: "Hadith History",
    topicAr: "تاريخ علوم الحديث",
    scholarId: "scholar_tariq",
    dateEn: "Yesterday",
    dateAr: "أمس (مسجل)",
    timeEn: "Recorded (1h 45m)",
    timeAr: "تسجيل كامل (ساعة و٤٥ دقيقة)",
    status: "recorded",
    descriptionEn: "A comprehensive dive by Dr. Tariq Al-Mansoor on the early preservation campaigns that preceded Imam Al-Bukhari, examining the role of early memorization scripts (Suhuf).",
    descriptionAr: "محاضرة علمية مفصلة للدكتور طارق المنصور في استعراض حركة تدوين المسانيد والمدونات قبل عصر الصحيحين، واستجلاء دور الصحائف المكتوبة المبكرة.",
    handouts: [
      { nameEn: "Early_Hadith_Suhuf_Compilation_Matrix.pdf", nameAr: "مصفوفة_الصحف_الحديثية_المبكرة.pdf", size: "2.1 MB", type: "pdf" }
    ],
    isRegistered: false
  }
];
