/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, QuranVerse, Scholarship } from './types';

export const RECITATION_PRESETS: QuranVerse[] = [
  {
    surah: "Al-Fatihah",
    ayah: 1,
    textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    transliteration: "Bismillaahir-Rahmaanir-Raheem"
  },
  {
    surah: "Al-Ikhlas",
    ayah: 1,
    textArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Say, 'He is Allah, [who is] One.'",
    transliteration: "Qul huwal-laahu ahad"
  },
  {
    surah: "Al-Kawthar",
    ayah: 1,
    textArabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    translation: "Indeed, We have granted you, [O Muhammad], Al-Kawthar (the fountain).",
    transliteration: "Innaaa a'tainaa kal kauthar"
  },
  {
    surah: "An-Nas",
    ayah: 1,
    textArabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    translation: "Say, 'I seek refuge in the Lord of mankind.'",
    transliteration: "Qul a'oozu bi rabbin-naas"
  },
  {
    surah: "Al-Asr",
    ayah: 1,
    textArabic: "وَالْعَصْرِ",
    translation: "By time,",
    transliteration: "Wal-'asr"
  }
];

export const CURRICULUM_DATA: Subject[] = [
  {
    id: "sub-quran",
    name: "Quranic Sciences & Tajweed",
    arabicName: "علوم القرآن والتجويد",
    icon: "BookOpen",
    gradeRange: "K-12 & Adult",
    description: "Learn the rules of correct recitation (Tajweed), pronunciation (Makharij), and study the historical collection and context of the Quran.",
    lessons: [
      {
        id: "les-taj-1",
        title: "Introduction to Tajweed & Makhārij",
        duration: "15 min",
        summary: "Discover the physical articulation points of Arabic letters and the historical origins of recitation rules.",
        content: `### Understanding Tajweed

**Tajweed** (تجويد) literally means "beautification" or "doing something well." In the context of the Quran, it refers to the set of rules governing how the words of the holy book should be pronounced during recitation.

Reciting the Quran with Tajweed is not just an aesthetic embellishment; it is an essential science to preserve the integrity of the divine speech. Altering a letter or a vowel could completely change the meaning of a verse.

#### The Core Pillar: Makhārij al-Hurūf (Articulation Points)

Every Arabic letter comes from a highly specific point of articulation in the throat, tongue, or lips. Grammarians and scholars of recitation identify **17 major articulation points**, grouped into five general regions:

1. **The Throat (Al-Halq - الحلق):** Divides into the deepest, middle, and closest parts of the throat.
   * *Deepest throat:* Hamzah (ء) and Ha (هـ).
   * *Middle throat:* 'Ayn (ع) and Haa (ح).
   * *Closest throat:* Ghayn (غ) and Khaa (خ).
2. **The Tongue (Al-Lisān - اللسان):** Governs 18 letters using different areas of the tongue (sides, tip, middle, and back) touching the teeth or palate.
3. **The Lips (Al-Shafatān - الشفتان):** Fa (ف), Meem (م), Ba (ب), and Waw (و).
4. **The Nasal Passage (Al-Khayshūm - الخيشوم):** The source of the nasal sound (*Ghunnah*), especially used with Nun and Meem.
5. **The Empty Space of the Mouth and Throat (Al-Jawf - الجوف):** The source of the three long vowel sounds (Madd).

#### Why Makhārij Matter

Proper articulation is critical. For instance, confusing the deep whisper of **Haa (ح)** with the light breathy **Ha (هـ)** can completely alter basic meanings (e.g., Al-Hamdu vs Al-Hamdu). Paying attention to the physical shape of the mouth and tongue placement creates a grounded, precise, and spiritual recitation.`,
        quiz: [
          {
            question: "What does the linguistic word 'Tajweed' mean?",
            options: [
              "Memorization and preservation",
              "Beautification or doing something well",
              "Grammatical construction",
              "Historical verification"
            ],
            answerIndex: 1,
            explanation: "Tajweed comes from the Arabic root j-w-d, meaning to make well, beautify, or perfect."
          },
          {
            question: "Which region of articulation produces the nasal sound (Ghunnah)?",
            options: [
              "The Lips (Al-Shafatān)",
              "The Throat (Al-Halq)",
              "The Nasal Passage (Al-Khayshūm)",
              "The Tongue (Al-Lisān)"
            ],
            answerIndex: 2,
            explanation: "The Khayshūm is the nasal cavity from which the Ghunnah (nasalization) flows during Nun and Meem properties."
          }
        ]
      },
      {
        id: "les-taj-2",
        title: "Rules of Nūn Sākinah and Tanwīn",
        duration: "25 min",
        summary: "Master the four fundamental rules of reciting silent Nūn and double vowels: Izhar, Idgham, Iqlab, and Ikhfa.",
        content: `### Rules of Nūn Sākinah and Tanwīn

One of the most frequent structural patterns in Tajweed is the encounter of a **Nūn Sākinah** (a silent Nun with no vowel) or a **Tanwīn** (double vowel ending representing an unwritten Nūn sound) with subsequent letters.

There are **four core rules** that must be applied depending on the letter that immediately follows:

#### 1. Izhār (إظهار - Clarification)
If a Nūn Sākinah or Tanwīn is followed by any of the six throat letters (ء, هـ, ع, ح, غ, خ), the Nūn must be pronounced clearly from its articulation point without any extra nasalization (Ghunnah).
* *Example:* "man 'amila" (مَنْ عَمِلَ) must be pronounced with a sharp, clean 'n' sound.

#### 2. Idghām (إدغام - Assimilation/Merging)
If followed by one of the letters in the mnemonic word **Yarmalūn** (ي, ر, م, ل, و, ن), the Nūn is merged into the succeeding letter.
Idghām is split into two categories:
* **Idghām with Ghunnah (Nasalization):** Merging occurs with a 2-beat nasal sound. Letters are (ي, ن, م, و).
* **Idghām without Ghunnah:** Merging occurs without any nasal sound. Letters are (ل, ر).

#### 3. Iqlāb (إقلاب - Conversion)
If followed by the letter **Ba (ب)**, the Nūn sound is converted entirely into a Meem (م) sound, accompanied by a 2-beat Ghunnah.
* *Example:* "min ba'di" is recited as "mim-ba'di" with closed lips.

#### 4. Ikhfā' (إخفاء - Concealment/Hiding)
If followed by any of the remaining 15 letters, the Nūn sound is concealed or masked. You position your mouth and tongue close to the articulation point of the next letter and pronounce a half-nasalized sound for 2 beats.`,
        quiz: [
          {
            question: "Which of the following describes the rule 'Iqlāb'?",
            options: [
              "Concealing the Nūn sound",
              "Converting the Nūn sound into a Meem sound when followed by 'Ba'",
              "Merging the Nūn sound clearly with the throat letters",
              "Pronouncing the Nūn with maximum clarity"
            ],
            answerIndex: 1,
            explanation: "Iqlāb literally means transformation or conversion—converting Nun into Meem when followed by Ba."
          }
        ]
      }
    ]
  },
  {
    id: "sub-hadith",
    name: "Hadith Studies & Preservations",
    arabicName: "الحديث الشريف وعلومه",
    icon: "Compass",
    gradeRange: "Grade 6 - 12",
    description: "Explore the methodology of verifying oral traditions, and study the foundational compilations like Al-Arba'in An-Nawawiyyah.",
    lessons: [
      {
        id: "les-had-1",
        title: "The Architecture of a Hadith: Sanad and Matn",
        duration: "18 min",
        summary: "Understand how the chain of narrators and text body compose a prophetic tradition and how they are authenticated.",
        content: `### Core Components of Hadith Science

A **Hadith** (حديث) is a report of the statements, actions, silent approvals, or physical descriptions of Prophet Muhammad (peace be upon him). In order to determine the authenticity of these reports, scholars developed a rigorous scientific methodology.

Every single Hadith record consists of two distinct components:

#### 1. The Sanad (سند - The Chain of Transmission)
The *Sanad* is the chronological chain of people who narrated the report, stretching from the final compiler (e.g., Al-Bukhari) back to the Prophet's companions.
When verifying a Sanad, scholars look at:
* **Attasul as-Sanad (Continuity of the Chain):** Did every narrator in the chain actually meet or live at the same time as the person they are reporting from?
* **Adalah (Moral Character):** Was the narrator truthful, pious, and free from public sins?
* **Dabt (Precision and Memory):** Did the narrator have a perfect memory or document their reports accurately?

#### 2. The Matn (متن - The Core Text)
The *Matn* is the actual statement, action, or approved behavior reported at the end of the chain.
A Matn is authenticated by ensuring:
* **No Shudhudh (Anomaly):** The text does not contradict other, more established and reliable narrations of the same nature.
* **No 'Illah (Hidden Defect):** There are no subtle logical or historical flaws that invalidate the narration.

#### The Classification Levels
Based on the integrity of the Sanad and Matn, Hadiths are categorized into three main grades:
* **Sahih (صحيح - Authentic):** Flawless chain, perfect memory, moral transmitters.
* **Hasan (حسن - Good/Reliable):** Similar to Sahih, but with minor variances in narrator memory capacity.
* **Da'if (ضعيف - Weak):** Points of discontinuity, weak memory, or unidentifiable narrators in the chain.`,
        quiz: [
          {
            question: "What is the chronological chain of transmitters in a Hadith called?",
            options: [
              "Matn",
              "Sanad",
              "Tafsir",
              "Ijma"
            ],
            answerIndex: 1,
            explanation: "The Sanad is the chain of narrators, while the Matn is the actual textual content."
          }
        ]
      }
    ]
  },
  {
    id: "sub-history",
    name: "Seerah & Golden Age History",
    arabicName: "السيرة والتاريخ الإسلامي",
    icon: "History",
    gradeRange: "Grade 4 - 12",
    description: "Study the biography of Prophet Muhammad and the dynamic contributions of scholars who pioneered medicine, optics, and algebra.",
    lessons: [
      {
        id: "les-hist-1",
        title: "The House of Wisdom & Scientific Method",
        duration: "20 min",
        summary: "Examine Baghdad's House of Wisdom and the integration of scientific pursuit with spiritual curiosity during the Golden Age.",
        content: `### The Golden Age & The House of Wisdom (Bayt al-Hikmah)

During the Abbasid Caliphate (8th to 14th centuries CE), the Islamic world became the preeminent global center for science, philosophy, medicine, and education. This intellectual flourish is often referred to as the **Islamic Golden Age**.

At the heart of this movement was Baghdad's **Bayt al-Hikmah** (بيت الحكمة), or the House of Wisdom.

#### Bridging Faith and Reason

To Golden Age scholars, pursuing scientific knowledge was not separate from spiritual devotion. It was seen as a way to fulfill Quranic injunctions to look, reflect, and seek truth.

* **Al-Khwarizmi (780–850 CE):** Working at the House of Wisdom, he synthesized Greek and Indian mathematics, founding **Algebra** (from his book *Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala*).
* **Ibn al-Haytham (965–1040 CE):** Often called the father of modern optics. He proved that vision occurs when light reflects off objects into the eye, establishing the foundational principles of the modern **Scientific Method** through rigorous experimentation.
* **Ibn Sina (Avicenna) (980–1037 CE):** Authored *The Canon of Medicine*, which remained the standard medical textbook in Europe and the Islamic world for over five centuries.

#### Legacy of Open Exchange
The House of Wisdom was remarkable for its cosmopolitan inclusivity. Christian, Jewish, Persian, and Muslim scholars collaborated under royal patronage, translating works from Greek, Sanskrit, Persian, and Syriac into Arabic, paving the way for the European Renaissance.`,
        quiz: [
          {
            question: "Who is credited with codifying Algebra and worked at the House of Wisdom?",
            options: [
              "Ibn al-Haytham",
              "Al-Khwarizmi",
              "Ibn Sina",
              "Al-Ghazali"
            ],
            answerIndex: 1,
            explanation: "Muhammad ibn Musa al-Khwarizmi's treatises on calculation introduced Algebra (al-jabr) as a systematic mathematical discipline."
          }
        ]
      }
    ]
  }
];

export const SCHOLARSHIPS_DATA: Scholarship[] = [
  {
    id: "sch-isdb",
    title: "IsDB Undergraduate & Postgraduate Scholarship Program",
    provider: "Islamic Development Bank (IsDB)",
    country: "Global (Varies by member country and host university)",
    coverage: "Fully Funded",
    level: ["Undergraduate", "Postgraduate"],
    stipendAmount: "$1,200/month + Tuition + Travel + Insurance",
    deadline: "2026-09-15",
    eligibility: [
      "Citizen of an IsDB member country or Muslim community in non-member countries",
      "High school graduate with high academic standing (GPA 3.0+ equivalent) for Undergraduate",
      "Accepted or holds admission in top-ranked public universities",
      "Committed to return to home country to support community development"
    ],
    description: "The Islamic Development Bank's premier scholarship scheme promotes human capital development in science, technology, agriculture, and healthcare to address sustainable development challenges in home societies.",
    websiteUrl: "https://www.isdb.org/scholarships"
  },
  {
    id: "sch-kau",
    title: "King Abdulaziz University postgraduate Scholarship",
    provider: "Ministry of Higher Education, Kingdom of Saudi Arabia",
    country: "Saudi Arabia (Jeddah)",
    coverage: "Fully Funded",
    level: ["Postgraduate", "Research Grants"],
    stipendAmount: "SR 1,900/month + Full Tuition + Housing + Annual Ticket",
    deadline: "2026-12-01",
    eligibility: [
      "Non-Saudi international student under the age of 30 for Master's, 35 for Ph.D.",
      "Excellent academic record with high moral conduct",
      "Meets English language proficiency scores (TOEFL or IELTS) and department specific requirements"
    ],
    description: "Fully funded Master's and Doctoral study tracks in Engineering, Computing, Islamic Sciences, Medicine, and Humanities, emphasizing global research collaboration.",
    websiteUrl: "https://gradstud.kau.edu.sa"
  },
  {
    id: "sch-chevening-ox",
    title: "Chevening Oxford Centre for Islamic Studies (OCIS) Grant",
    provider: "UK Foreign, Commonwealth & Development Office",
    country: "United Kingdom (Oxford)",
    coverage: "Fully Funded",
    level: ["Postgraduate"],
    stipendAmount: "£1,450/month + Oxford Tuition + Travel costs",
    deadline: "2026-11-05",
    eligibility: [
      "Citizen of a Chevening-eligible country",
      "Holds an undergraduate degree that qualifies for Oxford postgraduate entry",
      "Minimum of two years (2,800 hours) of work experience",
      "Intention to study a course relevant to Islamic society, culture, or history"
    ],
    description: "A prestigious partnership scholarship enabling future leaders to pursue graduate studies at the University of Oxford under the guidance of the Oxford Centre for Islamic Studies.",
    websiteUrl: "https://www.chevening.org/scholarship/ocis/"
  },
  {
    id: "sch-turkiye",
    title: "Türkiye Bursları Government Scholarships",
    provider: "YTB - Presidency for Turks Abroad and Related Communities",
    country: "Turkey",
    coverage: "Fully Funded",
    level: ["Undergraduate", "Postgraduate", "Research Grants"],
    stipendAmount: "TL 3,500 - 6,000/month + Tuition + Accommodation + Health Insurance",
    deadline: "2026-08-20",
    eligibility: [
      "International applicants outside of Turkey",
      "Academic achievements minimum of 70% for undergraduate, 75% for graduate, and 90% for health sciences",
      "Must undergo 1 year of Turkish Language Preparatory School (fully covered)"
    ],
    description: "A comprehensive state-funded program inviting students worldwide to study at leading universities in Turkey across practically any discipline of interest.",
    websiteUrl: "https://www.turkiyeburslari.gov.tr"
  },
  {
    id: "sch-qatar",
    title: "Qatar University Postgraduate Scholarship Program",
    provider: "Qatar University Graduate Studies Office",
    country: "Qatar",
    coverage: "Fully Funded",
    level: ["Postgraduate", "Research Grants"],
    stipendAmount: "QR 2,000/month + Full tuition waiver + Student Housing",
    deadline: "2026-10-10",
    eligibility: [
      "International graduate students pursuing academic master's or PhD streams",
      "Excellent Bachelor's/Master's GPA (Minimum 3.2 on a 4.0 scale)",
      "High scores in GRE/GMAT and standardized tests where required"
    ],
    description: "Designed for outstanding international scholars wanting to carry out advanced scientific research and academic pursuits in Doha.",
    websiteUrl: "http://www.qu.edu.qa/students/admission/graduate"
  },
  {
    id: "sch-madinah",
    title: "Islamic University of Madinah International Scholarships",
    provider: "The Deanship of Admission and Registration, IUM",
    country: "Saudi Arabia (Madinah)",
    coverage: "Fully Funded",
    level: ["Undergraduate", "Postgraduate"],
    stipendAmount: "SR 840/month + Free Housing + Air Tickets + Free Medical Care",
    deadline: "2026-11-30",
    eligibility: [
      "Muslim male applicants with excellent high school standing (GPA 3.0+ minimum)",
      "Be under 25 years old at the beginning of the academic year",
      "Accredited secondary school certificate or equivalent with good behavior history"
    ],
    description: "The official, world-famous scholarship scheme enabling students globally to study Islamic Jurisprudence, Quranic Studies, Arabic Language, Engineering, Computer Science, and Science in the blessed city of Madinah.",
    websiteUrl: "https://admission.iu.edu.sa"
  },
  {
    id: "sch-hbku",
    title: "Hamad Bin Khalifa University Graduate Fellowships",
    provider: "Qatar Foundation",
    country: "Qatar (Education City, Doha)",
    coverage: "Fully Funded",
    level: ["Postgraduate", "Research Grants"],
    stipendAmount: "QR 5,000/month (M.Sc.) or QR 7,500/month (Ph.D.) + Accommodation + Annual Air Ticket",
    deadline: "2026-09-01",
    eligibility: [
      "Applicants with excellent undergraduate or Master's degrees from accredited universities",
      "Meets the language requirement (IELTS/TOEFL) for english-taught programs",
      "Research proposal required for doctoral/research programs"
    ],
    description: "Highly competitive, fully-funded educational grants for international scholars who wish to pursue cutting-edge research in Islamic Studies, Humanities, Sustainability, Health, and Science at HBKU in Doha.",
    websiteUrl: "https://www.hbku.edu.qa/en/admissions"
  },
  {
    id: "sch-ksu",
    title: "King Saud University External Scholarship Program",
    provider: "Ministry of Education / King Saud University",
    country: "Saudi Arabia (Riyadh)",
    coverage: "Fully Funded",
    level: ["Undergraduate", "Postgraduate"],
    stipendAmount: "SR 1,000/month + Full Tuition Waiver + Free Double Room Housing + Subsidized Meals",
    deadline: "2026-10-15",
    eligibility: [
      "Excellent secondary school grade or standard cumulative college GPA",
      "Age constraints apply (under 25 for Undergraduate; under 30 for MSc; under 35 for PhD)",
      "Not having been awarded another scholarship from a Saudi educational institution"
    ],
    description: "The flagship scholarship program for Saudi Arabia's premier non-sectarian university, offering robust education tracks in modern Sciences, Engineering, Pharmacy, Quranic Linguistics, and Arabic literature.",
    websiteUrl: "https://dar.ksu.edu.sa"
  },
  {
    id: "sch-brunei",
    title: "Brunei Darussalam Government Scholarship",
    provider: "Ministry of Foreign Affairs, Brunei Darussalam",
    country: "Brunei",
    coverage: "Fully Funded",
    level: ["Undergraduate", "Postgraduate"],
    stipendAmount: "BND 500/month + Airfare + Accommodation + Full Tuition + Health Insurance",
    deadline: "2026-10-31",
    eligibility: [
      "International applicants from ASEAN, OIC, and Commonwealth member countries",
      "Age must not be more than 25 for undergraduate, or 35 for post-graduate",
      "Excellent high school or university academic records"
    ],
    description: "A complete government-funded scholarship offering candidates the opportunity to study at leading universities in Brunei, including Universiti Brunei Darussalam (UBD) and Universiti Islam Sultan Sharif Ali (UNISSA).",
    websiteUrl: "http://www.mfa.gov.bn/pages/online-bdgs.aspx"
  },
  {
    id: "sch-alazhar",
    title: "Al-Azhar Al-Sharif Islamic Scholarship Exchange",
    provider: "The Grand Imamate of Al-Azhar Al-Sharif",
    country: "Egypt (Cairo)",
    coverage: "Fully Funded",
    level: ["Undergraduate", "Postgraduate"],
    stipendAmount: "EGP 4,500/month + Free Lodging in Al-Azhar Hostels + Exemption from Tuition Fees",
    deadline: "2026-09-30",
    eligibility: [
      "Excellent baseline recommendation from trusted native Islamic bodies in your home country",
      "Excluding Egyptian citizens",
      "Passing the general Arabic language compatibility test"
    ],
    description: "The grand classical learning scholarship by Al-Azhar Al-Sharif, welcoming thousands of international students to deepen their understanding of Islamic theology, Arabic grammar, and secondary sciences.",
    websiteUrl: "http://www.azhar.eg"
  }
];
