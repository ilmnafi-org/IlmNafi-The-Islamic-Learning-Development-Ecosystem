/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DhikrItem {
  id: string;
  category: 'morning' | 'evening' | 'after_salah' | 'sleep' | 'daily_life';
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationAr: string;
  translationUr: string;
  translationHa: string;
  targetCount: number;
  source: string;
  virtueEn: string;
  virtueAr: string;
  virtueUr?: string;
  virtueHa?: string;
  grade: 'Sahih' | 'Hasan';
}

export const AUTHENTIC_ADHKAR_DB: DhikrItem[] = [
  // 1. WAKING UP ADHKAR
  {
    id: "wk_01",
    category: "daily_life",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Al-hamdu lillahil-ladhi ahyana ba'da ma amatana wa-ilayhin-nushur.",
    translationEn: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    translationAr: "الحمد لله الذي وهبنا حياة جديدة بعد النوم الذي هو الموتة الصغرى، وإليه وحده البعث يوم القيامة.",
    translationUr: "تمام تعریفیں اس اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا (جگایا) اور اسی کی طرف جمع ہونا ہے۔",
    translationHa: "Godiya ta tabbata ga Allah wanda ya rayar da mu bayan da ya karbi rayuwarmu (bayan muna barci), kuma zuwa gare shi ne tashin matattu.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 1, Hadith 1 / Sahih Al-Bukhari 6314",
    virtueEn: "Expresses gratitude for the blessing of a new day of life and serves as a reminder of the ultimate Resurrection.",
    virtueAr: "شكر على نعمة البقاء وتذكر البعث والنشور فور اليقظة.",
    virtueUr: "نئی زندگی کی نعمت پر شکر گزاری اور آخرت کے جی اٹھنے کی یاددہانی۔",
    virtueHa: "Nuna godiya ga Allah saboda kyautar sabuwar rana ta rayuwa, kuma yana zama tunatarwa game da karshe na Lahira.",
    grade: "Sahih"
  },
  {
    id: "wk_02",
    category: "daily_life",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ",
    transliteration: "Al-hamdu lillahil-ladhi 'afanee fee jasadee, wa-radda 'alayya roohee, wa-adhina lee bi-dhikrih.",
    translationEn: "Praise is to Allah Who gave strength to my body and returned my soul to me and permitted me to remember Him.",
    translationAr: "الحمد لله الذي حفظ جسدي معافى، ورد إلي روحي الطاهرة بعد قبضها في النوم، ويسر لي أن أذكره بلساني وقلبي.",
    translationUr: "تمام تعریفیں اللہ کے لیے ہیں جس نے میرے جسم کو تندرستی دی، اور مجھ پر میری روح لوٹائی، اور مجھے اپنے ذکر کی اجازت دی۔",
    translationHa: "Godiya ta tabbata ga Allah wanda ya ba wa jikina lafiya, ya mayar mini da raina, kuma ya ba ni izinin ambatonsa.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 1, Hadith 3 / At-Tirmidhi 3401",
    virtueEn: "Acknowledge physical health, the return of consciousness, and divine alignment to kickstart worship.",
    virtueAr: "الاعتراف بعافية البدن ورجوع الروح للعمل الصالح والذكر.",
    virtueUr: "جسمانی صحت، ہوش کی واپسی اور عبادت کے سفر کا آغاز۔",
    virtueHa: "Yarda da lafiyar jiki da dawo da hankali domin fara bautar Allah a kullum.",
    grade: "Hasan"
  },

  // 2. GARMENT SUPPLICATIONS
  {
    id: "g_01",
    category: "daily_life",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Al-hamdu lillahil-ladhi kasanee hadha-ath-thawba wa-razaqaneehi min ghayri hawlin minnee wala quwwah.",
    translationEn: "All Praise is for Allah who has clothed me with this garment and provided it for me, with no power nor might from myself.",
    translationAr: "الحمد لله الذي أنعم علي بهذا الكساء وستر عورتي به، ورزقني إياه من غير كسب أو قوة ذاتية مني.",
    translationUr: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ لباس پہنایا اور میری کسی طاقت اور قوت کے بغیر یہ مجھے عطا کیا۔",
    translationHa: "Godiya ta tabbata ga Allah wanda ya tufatar da ni da wannan tufafin, kuma ya azurta ni da shi ba tare da wani iko ko karfi daga gare ni ba.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 2, Hadith 5 / Abu Dawud 4023",
    virtueEn: "Whoever recites this while putting on a garment, his past minor sins will be forgiven.",
    virtueAr: "من قالها عند لبس ثوبه غُفر له ما تقدم من ذنبه.",
    virtueUr: "اس کے پڑھنے سے بندے کے پچھلے صغیرہ گناہ معاف کر دیے جاتے ہیں۔",
    virtueHa: "Wanda duk ya fadi haka lokacin sanya tufa, Allah zai gafarta masa zunubansa da suka gabata.",
    grade: "Hasan"
  },
  {
    id: "g_02",
    category: "daily_life",
    arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
    transliteration: "Allahumma lakal-hamdu Anta kasawtaneeh, as'aluka min khayrihi wa-khayri ma suni'a lah, wa-a'udhu bika min sharrihi wa-sharri ma suni'a lah.",
    translationEn: "O Allah, praise is to You. You have clothed me with it. I ask You for its goodness and the goodness of what it has been made for, and I seek refuge in You from its evil and the evil of what it has been made for.",
    translationAr: "اللهم لك الشكر على هذا الملبس الجديد، أسألك النفع والستر منه ومن الغرض الذي صنع لأجله، وأعوذ بك من الضرر والذنوب فيه.",
    translationUr: "اے اللہ! تیرے ہی لیے تعریف ہے، تو نے ہی مجھے یہ لباس پہنایا، میں تجھ سے اس کی بھلائی اور اس مقصد کی بھلائی مانگتا ہوں جس کے لیے یہ بنایا گیا، اور اس کے شر اور اس مقصد کے شر سے تیری پناہ مانگتا ہوں جس کے لیے یہ بنایا گیا ہے۔",
    translationHa: "Ya Allah, godiya ta tabbata gare ka, kai ne ka tufatar da ni da shi, ina roon ka alherinsa da alherin abin da aka yi shi don shi, kuma ina neman tsari da kai daga sharrinsa da sharrin abin da aka yi shi don shi.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 3, Hadith 6 / Abu Dawud & At-Tirmidhi 1767",
    virtueEn: "Dedicating our daily dress, protection, and display strictly to righteous pursuits under divine shielding.",
    virtueAr: "بركة الملبس الجديد واستعماله في الطاعات ونفع العباد.",
    virtueUr: "نئے لباس کی برکت اور اسے اطاعت الٰہی میں استعمال کرنے کی تڑپ۔",
    virtueHa: "Neman albarka a cikin sabon tufafi da sanya shi ya zama kariya da amfani a ayyukan kwarai.",
    grade: "Sahih"
  },

  // 3. RESTROOM SUPPLICATIONS
  {
    id: "to_01",
    category: "daily_life",
    arabic: "بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    transliteration: "Bismillah. Allahumma innee a'udhu bika minal-khubuthi wal-khaba'ith.",
    translationEn: "In the name of Allah. O Allah, I seek refuge with You from all evil and evil-doers (male and female devils).",
    translationAr: "أستعين بالله، وأناشدك يا رب أن تحفظني من الخبائث وشياطين الجن ذكوراً وإناثاً في هذا الموضع.",
    translationUr: "اللہ کے نام کے ساتھ، اے اللہ! میں خبیث جنوں اور جنیوں (نر اور مادہ شیاطین) کے شر سے تیری پناہ مانگتا ہوں۔",
    translationHa: "Da sunan Allah. Ya Allah, ina neman tsari da kai daga dukkan kazamta da miyagun aljanu maza da mata.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 6, Hadith 10 / Sahih Al-Bukhari 142 & Muslim 375",
    virtueEn: "A shield that stops devils and spiritual harm from gazing upon or harming the human body when naked.",
    virtueAr: "حجاب غيبي يمنع الشياطين من الإضرار بالإنسان أو التطلع لعورته.",
    virtueUr: "شیاطین کی نظروں سے بچنے اور جسمانی و روحانی تحفظ کے لیے ایک مضبوط ڈھال۔",
    virtueHa: "Wani katanga ne da yake hana shaidanu da aljanu kallon al'aurar mutum lokacin tsiraici.",
    grade: "Sahih"
  },
  {
    id: "to_02",
    category: "daily_life",
    arabic: "غُفْرَانَكَ",
    transliteration: "Ghufranak.",
    translationEn: "I ask You (O Allah) for forgiveness.",
    translationAr: "أستغفرك يا رحيم على عجزي وتقصيري في دوام ذكرك بلساني في هذا الموضع المعطل لفظياً.",
    translationUr: "میں تجھ سے بخشش (اور مغفرت) کا طلبگار ہوں۔",
    translationHa: "Ina neman gafararka (ya Allah).",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 7, Hadith 11 / At-Tirmidhi 7 & Ibn Majah 300",
    virtueEn: "Seeking pardon for the temporary period of silence where natural vocal praise was paused.",
    virtueAr: "طلب المغفرة عن تعطل اللسان الاضطراري عن الذكر أثناء قضاء الحاجة.",
    virtueUr: "اس وقت کی کوتاہی اور زبان کی خاموشی پر استغفار جب ذکر الٰہی معطل تھا۔",
    virtueHa: "Neman gafarar Allah saboda lokacin da aka yi shiru ba tare da ambaton Allah ba lokacin biyan bukata.",
    grade: "Sahih"
  },

  // 4. ABLUTION ADHKAR
  {
    id: "ab_01",
    category: "daily_life",
    arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ",
    transliteration: "Ashhadu an la ilaha illallahu wahdahu la sharika lahu, wa-ashhadu anna Muhammadan 'abduhu wa-rasuluh.",
    translationEn: "I bear witness that none has the right to be worshipped except Allah alone, without partner, and I bear witness that Muhammad is His servant and Messenger.",
    translationAr: "أعلن توحيدي الخالص لله بلا شريك، وأقر بنبوة وعبودية نبينا صلى الله عليه وسلم عقب التطهر.",
    translationUr: "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد (صلی اللہ علیہ وسلم) اس کے بندے اور رسول ہیں۔",
    translationHa: "Ina shaida wa cewa babu abin bautawa da gaskiya sai Allah shi kadai ba shi da abokin tarayya, kuma ina shaida wa cewa Muhammadu bawan sa ne kuma Manzonsa ne.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 9, Hadith 13 / Sahih Muslim 234",
    virtueEn: "Whoever recites this after completing ablution correctly, the eight gates of Paradise will be opened for him.",
    virtueAr: "من توضأ فأحسن الوضوء ثم قالها فُتحت له أبواب الجنة الثمانية يدخل من أيها شاء.",
    virtueUr: "جو وضو کے بعد اسے عقیدے کے ساتھ پڑھے، اس کے لیے جنت کے آٹھوں دروازے کھول دیے جاتے ہیں۔",
    virtueHa: "Duk wanda ya yi alwala sannan ya fadi haka, za a bude masa kofofin Aljanna guda takwas ya shiga ta inda ya so.",
    grade: "Sahih"
  },

  // 5. HOME ENTRANCE & EXIT
  {
    id: "hm_01",
    category: "daily_life",
    arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillahi, tawakkaltu 'alal-lahi, wa-la hawla wa-la quwwata illa billah.",
    translationEn: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    translationAr: "باسم الله أبدأ مخرجي، مفوضاً أموري له، معتقداً أنه لا تحول من حال إلى حال ولا قوة إلا بإعانته.",
    translationUr: "اللہ کے نام کے ساتھ، میں نے اللہ پر بھروسہ کیا، اور گناہوں سے بچنے کی طاقت اور نیکی کرنے کی قوت صرف اللہ ہی کی طرف سے ہے۔",
    translationHa: "Da sunan Allah, na dogara ga Allah, babu dabara kuma babu karfi sai tare da taimakon Allah.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 10, Hadith 16 / Abu Dawud 5095 & At-Tirmidhi 3426",
    virtueEn: "On recital, an angel says: 'You are guided, defended, and protected,' and Satan retreats from you.",
    virtueAr: "يُقال للعبد عند خروجه: هُديت وكُفيت ووُقيت؛ ويتنحى عنه الشيطان.",
    virtueUr: "اس کے پڑھنے پر فرشتہ کہتا ہے: 'تمہیں ہدایت دی گئی، تمہاری کفایت کی گئی اور تمہاری حفاظت کی گئی'۔",
    virtueHa: "Idan aka karanta wannan, mala'ika zai ce masa: 'An shiryar da kai, an wadatar da kai, an tsare ka', kuma Shaidan zai kauce masa.",
    grade: "Sahih"
  },
  {
    id: "hm_02",
    category: "daily_life",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillahi walajna, wa-bismillahi kharajna, wa-'ala Rabbina tawakkalna.",
    translationEn: "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust.",
    translationAr: "باسم الله ندخل مسكننا لتنزل البركة، وباسمه نخرج لمعاشنا، وعلى ربنا وحده نعتمد.",
    translationUr: "اللہ کے نام کے ساتھ ہم داخل ہوئے اور اللہ ہی کے نام کے ساتھ ہم نکلے، اور ہم نے اپنے رب ہی پر بھروسہ کیا۔",
    translationHa: "Da sunan Allah muka shiga, kuma da sunan Allah muka fita, kuma ga Ubangijinmu muka dogara.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 11, Hadith 18 / Abu Dawud 5096",
    virtueEn: "Remembrance of Allah's name upon entering stops the devil from finding any place of lodging in your house.",
    virtueAr: "ذكر اسم الله يمنع الشيطان من الدخول والمبيت ومشاركة طعام الدار.",
    virtueUr: "گھر داخل ہوتے وقت اللہ کا نام لینے سے شیطان مایوس ہو جاتا ہے اور گھر میں رات گزارنے کا ٹھکانہ نہیں پا سکتا۔",
    virtueHa: "Ambaton sunan Allah lokacin shiga gida yana hana Shaidan samun wajen kwana a cikin gidan.",
    grade: "Hasan"
  },

  // 6. MOSQUE ADHKAR
  {
    id: "mq_01",
    category: "daily_life",
    arabic: "أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ، بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "A'udhu billahil-'Adheem, wa-bi-wajhihil-kareem, wa-sultanihil-qadeem, minash-shaytanir-rajeem. Bismillah, was-salatu was-salamu 'ala Rasulillah. Allahummaftah lee abwaba rahmatik.",
    translationEn: "I take refuge with Allah, The Supreme, and with His Noble Face, and His eternal authority from the accursed devil. In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, open the gates of Your mercy for me.",
    translationAr: "ألوذ بعظمة الله وجلال وجهه وسلطانه الذي لا يزول من وساوس الشيطان الرجيم، طالباً فتح أبواب الرحمة الإلهية بفضلك.",
    translationUr: "میں عظمت والے اللہ کی، اور اس کے معزز چہرے کی، اور اس کی قدیم سلطنت کی پناہ مانگتا ہوں مردود شیطان سے۔ اللہ کے نام کے ساتھ، اور اللہ کے رسول پر درود و سلام ہو۔ اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔",
    translationHa: "Ina neman tsari da Allah Mai girma, da kyawun fuskarsa, da tsohon mulkinsa, daga Shaidan jifaffe. Da sunan Allah, aminci ya tabbata ga Manzon Allah. Ya Allah, ka bude mini kofofin rahamarka.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 13, Hadith 20 / Abu Dawud & Sahih Muslim 713",
    virtueEn: "If recited upon entry, Satan says: 'He has been protected from me for the rest of his day.' Opens spiritual mercy.",
    virtueAr: "يقول الشيطان دبر الصلاة: عُصم مني هذا العبد سائر يومه بفضل هذا الدعاء.",
    virtueUr: "اس کے پڑھنے سے شیطان کہتا ہے: 'یہ شخص آج کے باقی دن مجھ سے محفوظ ہو گیا'۔ نیکی کی راہیں کھلتی ہیں۔",
    virtueHa: "Idan aka karanta wannan lokacin shiga masallaci, Shaidan zai ce: 'An kare shi daga gare ni sauran ranar'. Yana bude kofofin rahama.",
    grade: "Sahih"
  },
  {
    id: "mq_02",
    category: "daily_life",
    arabic: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ، اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "Bismillahi, was-salatu was-salamu 'ala Rasulillahi, Allahumma innee as-aluka min fadlik, Allahummas-'imnee minash-shaytanir-rajeem.",
    translationEn: "In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, I ask You from Your favour. O Allah, guard me from the accursed devil.",
    translationAr: "باسم الله أخرج مصلياً مسلماً معززاً بالسلام على رسولنا، سائلاً فضل الرزق الحلال والعافية، هائماً بحفظك من وساوس الشيطان.",
    translationUr: "اللہ کے نام کے ساتھ، اور اللہ کے رسول پر درود و سلام ہو۔ اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں، اے اللہ! مجھے شیطان مردود کے فتنے سے محفوظ رکھ۔",
    translationHa: "Da sunan Allah, aminci ya tabbata ga Manzon Allah. Ya Allah, ina rokon Ka daga cikin falalarKa. Ya Allah, ka tsare ni daga Shaidan jifaffe.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 14, Hadith 21 / Abu Dawud & Ibn Majah 773",
    virtueEn: "Seeks divine allocation of clean monetary sustenance (Fadl) upon stepping back into the worldly economic landscape.",
    virtueAr: "سؤال الرزق والبركة من فضل الله تعالى والحفظ من غواية الشيطان خارج المسجد.",
    virtueUr: "مسجد سے نکلتے ہوئے پاکیزہ اور حلال معاش کے حصول کے لیے الٰہی رہنمائی کی التجا۔",
    virtueHa: "Neman samun arziki mai albarka lokacin da za a koma neman abincin duniya bayan an gama sallah.",
    grade: "Sahih"
  },

  // 7. SINCERE MORNING ADHKAR (ATHKAR AL-SABAH)
  {
    id: "m_01",
    category: "morning",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Asbahna wa-asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamdu wa-huwa 'ala kulli shay'in qadir.",
    translationEn: "We have entered the morning and the kingdom belongs to Allah. All praise is due to Allah. There is no deity worthy of worship except Allah alone, without partners. To Him belongs the dominion, to Him belongs all praise, and He is over all things Omnipotent.",
    translationAr: "أصبحنا في حفظ الله وملكوت الله خاضع لله وحده، مخلصين له التوحيد اللساني والقلبي.",
    translationUr: "ہم نے صبح کی اور اللہ کے سارے ملک نے صبح کی، اور سب تعریف اللہ ہی کے لیے ہے، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کے لیے بادشاہت ہے اور اسی کے لیے سب تعریف ہے، اور وہ ہر چیز پر پوری قدرت رکھنے والا ہے۔",
    translationHa: "Mun shiga safiya kuma mulki ya wayi gari na Allah ne, kuma godiya ta tabbata ga Allah, babu abin bautawa da gaskiya sai Allah shi kadai ba shi da abokin tarayya, mulki nasa ne kuma godiya tasa ce, kuma shi mai iko ne a kan kowane abu.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 27, Hadith 75 / Sahih Muslim 2723",
    virtueEn: "Expresses absolute gratitude for entering a new day and surrendering to divine sovereignty.",
    virtueAr: "تجديد التوحيد والاستسلام عهد الصباح والتوكل المطلق.",
    virtueUr: "نئے دن کے توازن، توحید اور حاکمیتِ الٰہی پر پختہ یقین کی تجدید۔",
    virtueHa: "Yana nuna cikakkiyar godiya saboda shiga sabuwar rana da mika wuya ga sarautar Allah.",
    grade: "Sahih"
  },
  {
    id: "m_02",
    category: "morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wabika amsayna, wabika nahya, wabika namut, wa-ilaykan-nushur.",
    translationEn: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the final Resurrection.",
    translationAr: "تفويض حركة الزمان والمصير بيد الله الحي القيوم.",
    translationUr: "اے اللہ! تیری ہی توفیق سے ہم نے صبح کی، اور تیری ہی توفیق سے ہم نے شام کی، اور تیرے ہی حکم سے ہم جیتے ہیں، اور تیرے ہی حکم سے ہم مرتے ہیں، اور تیری ہی طرف دوبارہ اٹھ کھڑے ہونا ہے۔",
    translationHa: "Ya Allah, da kai muka wayi gari, kuma da kai muke shiga yamma, da kai muke rayuwa, kuma da kai muke mutuwa, kuma zuwa gare ka ne tashin karshe.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 27, Hadith 76 / Tirmidhi 3391",
    virtueEn: "Establishes consciousness of the cycle of life, death, and daily rejuvenation.",
    virtueAr: "التذكير اليومي بالبعث والنشور بعد يقظة النوم.",
    virtueUr: "زندگی اور موت کے چکر اور روزانہ کی بیداری کے احساس کو بیدار کرنا۔",
    virtueHa: "Yana kafa tunani game da canjin rayuwa da mutuwa da kuma kashin Lahira.",
    grade: "Sahih"
  },
  {
    id: "m_03",
    category: "morning",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma anta Rabbi la ilaha illa ant, khalaqtani wa-ana 'abduk, wa-ana 'ala 'ahdika wa-wa'dika mas-tata't, a'udhu bika min sharri ma sana't, abu'u laka bi-ni'matika 'alay, wa-abu'u bi-dhanbi faghfir li, fa-innahu la yaghfiru-dhunuba illa ant.",
    translationEn: "O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant, and I remain true to Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your grace upon me, and I acknowledge my sin, so forgive me, for indeed none forgives sins except You.",
    translationAr: "سيد الاستغفار؛ إقرار بربوبية الله وكمال نعمته واعتراف المرء بذنبه وعجزه.",
    translationUr: "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں، میں نے جو برائیاں کیں ان کے شر سے تیری پناہ مانگتا ہوں، میں تیرے سامنے تیرے ان انعامات کا اعتراف کرتا ہوں جو مجھ پر ہیں اور اپنے گناہوں کا بھی اعتراف کرتا ہوں، لہٰذا مجھے معاف فرما کیونکہ تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا۔",
    translationHa: "Ya Allah, kai ne Ubangijina, babu abin bautawa sai kai. Ka halitta ni kuma ni bawan ka ne, kuma ina kan alkawarin ka da kiyaye umarninka iya kokarina. Ina neman tsari da kai daga sharrin abin da na aikata. Ina amsa muku da falalar da kuka yi mini, kuma ina amsa muku da laifina, saboda haka ka gafarta mini, hakika babu mai gafarta zunubai sai kai.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 27, Hadith 77 / Sahih Al-Bukhari 6306",
    virtueEn: "The Master of Forgiveness (Sayyid al-Istighfar). Anyone who recites it with sincerity in the morning and dies before evening enters Paradise.",
    virtueAr: "من قالها موقناً بها في الصباح فمات دخل الجنة بإذن الله.",
    virtueUr: "سید الاستغفار؛ خلوصِ نیت سے صبح کو پڑھنے والا اگر شام تک مر جائے تو اللہ کے فضل سے جنتی ہے۔",
    virtueHa: "Shi ne Sayyidul Istighfar (shugaban neman gafara). Wanda ya fadi haka da safe da gaske idan ya mutu kafin yamma zai shiga Aljanna.",
    grade: "Sahih"
  },
  {
    id: "m_04",
    category: "morning",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wala fis-sama'i wa-huwas-Sami'ul-'Alim.",
    translationEn: "In the name of Allah, with Whose name nothing in the earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    translationAr: "تحصين كامل باسم الله الحفيظ الرقيب.",
    translationUr: "اللہ کے نام کے ساتھ، جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی سب کچھ سننے والا اور جاننے والا ہے۔",
    translationHa: "Da sunan Allah wanda babu wani abu da yake cutarwa tare da sunansa a cikin kasa ko a samaniya, kuma shi ne Mai ji daki-daki, Mai sani.",
    targetCount: 3,
    source: "Hisnul Muslim, Ch. 27, Hadith 85 / Abu Dawud 5088",
    virtueEn: "Protection against sudden afflictions, diseases, harm, or unforeseen disasters throughout the day.",
    virtueAr: "وقاية تامة وحجاب من الآفات والشرور الصباحية والمسائية.",
    virtueUr: "ناگہانی آفات، تکلیف دہ بیماریوں اور مادی و معنوی نقصانات سے مکمل حفاظت کا قلعہ۔",
    virtueHa: "Kariya daga bala'o'i na kwatsam da cututtuka da dukkan sharruka daban-daban a ranar.",
    grade: "Sahih"
  },
  {
    id: "m_05",
    category: "morning",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    transliteration: "Ya Hayyu Ya Qayyumu bi-rahmatika astaghith, aslih li sha'ni kullahu, wala takilni ila nafsi tarfata 'ayn.",
    translationEn: "O Ever-Living, O Self-Sustaining, by Your mercy I call for help; rectify for me all of my affairs, and do not leave me in charge of myself even for a blink of an eye.",
    translationAr: "دعاء الاضطرار والتفويض التام لله الحفيظ لعدم الاتكال على النفس.",
    translationUr: "اے زندہ اور قائم رہنے والے! میں تیری رحمت کے ذریعے فریاد کرتا ہوں، تو میرے تمام احوال درست کر دے، اور مجھے ایک آنکھ جھپکنے کے برابر بھی میرے نفس کے سپرد نہ کرنا۔",
    translationHa: "Ya Rayayye mai tsayuwar kansa, da rahamarka nake neman taimako, ka gyara mini dukkan al'amurana, kuma kada ka bar ni da kaina ko da na fari na ido daya.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 27, Hadith 89 / Al-Bazzar / Al-Silsilah Al-Sahihah 227",
    virtueEn: "Ensures Allah's divine protection and guidance over your intellectual, physical, and study tasks.",
    virtueAr: "التتبرؤ من الحول والقوة الشخصية والالتجاء لحول الله الحكيم.",
    virtueUr: "اپنے نفس کی طاقت پر بھروسے سے پناہ اور الٰہی تحویل و ہدایت پر بھروسہ۔",
    virtueHa: "Siffar dogara ga Allah baki daya ba tare da dogaro da dabarar kai ba.",
    grade: "Hasan"
  },

  // 8. AFTER PRAYER (SALAH) ADHKAR
  {
    id: "s_01",
    category: "after_salah",
    arabic: "أَسْتَغْفِرُ اللَّهَ (ثلاثاً) ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Astaghfirullah (x3). Allahumma Antas-Salamu wa-minkas-salamu, tabarakta ya dhal-jalali wal-ikram.",
    translationEn: "I seek Allah's forgiveness (3 times). O Allah, You are Peace and from You is peace. Blessed are You, Owner of Majesty and Honor.",
    translationAr: "تجاوز عن التقصير في الصلاة والاعتراف بضعف العبادة مع تمجيد السلام الإلهي.",
    translationUr: "میں اللہ سے بخشش مانگتا ہوں (تین بار)۔ اے اللہ! تو ہی سلامتی والا ہے اور تیری ہی طرف سے سلامتی ہے، تو برکت والا ہے، اے عظمت اور بزرگی والے!۔",
    translationHa: "Ina neman gafarar Allah (sau uku). Ya Allah, kai ne Aminci kuma daga gare ka aminci yake, albarka ta tabbata a gare ka, mai matsanancin bukata da girma.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 25, Hadith 66 / Sahih Muslim 591",
    virtueEn: "Expressed immediately after every formal prayer to make up for distractions during prayer.",
    virtueAr: "يُقال فور التسليم تداركاً لسهو الصلاة وانشغال الخاطر.",
    virtueUr: "نماز سے فارغ ہوتے ہی عبادت میں رہ جانے والی کوتاہیوں کا ازالہ و استغفار۔",
    virtueHa: "Ana fadin haka bayan sallama domin cike gurbin ayyukan da ba a yi da kyau ba lokacin sallah.",
    grade: "Sahih"
  },

  // 9. REMEMBRANCE BEFORE SLEEP
  {
    id: "sl_01",
    category: "sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa-ahya.",
    translationEn: "In Your name, O Allah, I live and I die.",
    translationAr: "باسم الله أودع يقظتي ونومي مسلماً الروح لبارئها.",
    translationUr: "اے اللہ! میں تیرے ہی نام کے ساتھ مرتا ہوں (سوتا ہوں) اور جیتا ہوں (جاگتا ہوں)۔",
    translationHa: "Da sunanki Ya Allah nake mutuwa kuma nake rayuwa.",
    targetCount: 1,
    source: "Hisnul Muslim, Ch. 28, Hadith 101 / Sahih Al-Bukhari 6324",
    virtueEn: "The classic bedtime declaration committing your soul to Divine safe keeping.",
    virtueAr: "العهد النبوي الفطري عند وضع الجنب للمبيت.",
    virtueUr: "رات کو سوتے وقت روح کو اللہ کی امانت میں دینے کا اقرار۔",
    virtueHa: "Wannan takaddar tabbatar da barci ce da mika rai ga kariyar Allah.",
    grade: "Sahih"
  }
];

export const DAILY_WIRDS_PRESETS = [
  { name: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", target: 100 },
  { name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", target: 100 },
  { name: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", target: 100 },
  { name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", target: 100 },
  { name: "La ilaha illallah", arabic: "لَا إِلَهَ إِلَّا اللهُ", target: 100 },
  { name: "Salawat (Allahumma Salli)", arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", target: 100 }
];
