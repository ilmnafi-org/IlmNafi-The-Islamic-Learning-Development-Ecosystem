/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Volume2, 
  Info, 
  Sparkles, 
  Activity, 
  HelpCircle, 
  ChevronRight, 
  VolumeX, 
  RefreshCw,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface LetterDetail {
  char: string;
  nameEn: string;
  nameAr: string;
  makhrajRegion: 'halq' | 'lisan' | 'shafatan' | 'jawf' | 'khayshum';
  makhrajNameEn: string;
  makhrajNameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  sifaatEn: string[];
  sifaatAr: string[];
  tongueState: 'neutral' | 'tip-teeth' | 'tip-interdental' | 'back-velar' | 'mid-palatal' | 'retroflex-apical' | 'throat-pharyngeal' | 'tip-dental-close' | 'side-pressing';
  lipsState: 'neutral' | 'open' | 'closed' | 'rounded' | 'lip-teeth';
  soundTipEn: string;
  soundTipAr: string;
}

export const ARABIC_LETTERS_DB: LetterDetail[] = [
  {
    char: "أ",
    nameEn: "Hamzah",
    nameAr: "همزة",
    makhrajRegion: "halq",
    makhrajNameEn: "Deep Throat (Aqsa al-Halq)",
    makhrajNameAr: "أقصى الحلق",
    descriptionEn: "Pronounced from the deepest part of the throat, near the vocal cords. Requires clear vocal cord contraction without straining.",
    descriptionAr: "يخرج من منطقة أقصى الحلق (عند الأوتار الصوتية)، وينطق بجهر واستفال تلافياً للإفراط في الضغط المقيت.",
    sifaatEn: ["Vocal-stop", "Whispered", "Stable"],
    sifaatAr: ["الجهر", "الشدة", "الاستفال", "الانفتاح"],
    tongueState: "neutral",
    lipsState: "open",
    soundTipEn: "Sharp release of air, like 'u' in 'up'.",
    soundTipAr: "انقطاع الصوت والنفس معاً بصورة محكمة."
  },
  {
    char: "ب",
    nameEn: "Ba'",
    nameAr: "باء",
    makhrajRegion: "shafatan",
    makhrajNameEn: "Both Lips (Al-Shafatan)",
    makhrajNameAr: "الشفتان",
    descriptionEn: "Pronounced by closing the upper and lower lips firmly together, producing a strong bouncy rebound (Qalqalah) when saakin.",
    descriptionAr: "يخرج بانطباق الشفتين انطباقاً تاماً محكماً، ويصاحبها اهتزاز الحبلين الصوتيين، وتتصف بالقلقلة عند السكون.",
    sifaatEn: ["Bouncy", "Explosive", "Loud"],
    sifaatAr: ["الجهر", "الشدة", "الاستفال", "القلقلة", "الانفتاح"],
    tongueState: "neutral",
    lipsState: "closed",
    soundTipEn: "Clear explosive release like 'b' in 'boat'. When silent, bounce it.",
    soundTipAr: "انطباق قوي للشفتين ينتهي بنبرة ارتدادية (قلقلةُ باء)."
  },
  {
    char: "ت",
    nameEn: "Ta'",
    nameAr: "تاء",
    makhrajRegion: "lisan",
    makhrajNameEn: "Tongue Tip to Upper Gums",
    makhrajNameAr: "طرف اللسان مع أصول الثنايا",
    descriptionEn: "Pronounced from the tip of the tongue hitting the roots/gums of the upper front teeth. Requires a slight release of breath (Hams).",
    descriptionAr: "يخرج من طرف اللسان مع أصول الثنايا العليا صعوداً، ويصاحبه جريان خفي للنفس (الهمس) لإظهار سكونها بالوجه الفصيح.",
    sifaatEn: ["Whispered", "Soft air release", "Lowered"],
    sifaatAr: ["الهمس", "الشدة", "الاستفال", "الانفتاح"],
    tongueState: "tip-teeth",
    lipsState: "open",
    soundTipEn: "Like 't' in 'table', accompanied by a soft, controlled gust of wind.",
    soundTipAr: "قرع طرف اللسان لأصول الأسنان مع تسرّب هواء يسير."
  },
  {
    char: "ث",
    nameEn: "Thaa'",
    nameAr: "ثاء",
    makhrajRegion: "lisan",
    makhrajNameEn: "Tongue Tip to Upper Teeth Edges",
    makhrajNameAr: "طرف اللسان مع أطراف الثنايا العليا",
    descriptionEn: "Pronounced by placing the tip of the tongue flat against the bottom edges of the upper front teeth. Soft and flowing.",
    descriptionAr: "يخرج من طرف اللسان مع أطراف الثنايا العليا (خارج من الفم قليلاً). يتصف بلين الجريان وكثرة تدفق الهواء.",
    sifaatEn: ["Flowing air", "Soft", "Protruded"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستفال", "الانفتاح"],
    tongueState: "tip-interdental",
    lipsState: "open",
    soundTipEn: "Like 'th' in 'think'. Ensure the tongue is flat under the tooth line.",
    soundTipAr: "ملامسة طرف اللسان لأطراف الأسنان العلوية بلطف شديد."
  },
  {
    char: "ج",
    nameEn: "Jeem",
    nameAr: "جيم",
    makhrajRegion: "lisan",
    makhrajNameEn: "Middle Tongue to Hard Palate",
    makhrajNameAr: "وسط اللسان",
    descriptionEn: "Pronounced from the middle of the tongue pressing strongly against the center roof of the mouth (hard palate).",
    descriptionAr: "يخرج من وسط اللسان مع ما يحاذيه من الحنك الأعلى الصلب، وينحبس معه الصوت والنفس انحباساً تاماً.",
    sifaatEn: ["Explosive", "Bouncy", "Centralized"],
    sifaatAr: ["الجهر", "الشدة", "الاستفال", "الانفتاح", "القلقلة"],
    tongueState: "mid-palatal",
    lipsState: "open",
    soundTipEn: "Rigid sound like 'g' in 'gem' (not soft 'j' or sh-like). Closes the central airway.",
    soundTipAr: "الضغط الشديد في وسط الحنك لمنع تسرب الهواء، مما يصنع قلقلة جهرية."
  },
  {
    char: "ح",
    nameEn: "Haa'",
    nameAr: "حاء",
    makhrajRegion: "halq",
    makhrajNameEn: "Middle Throat (Wast al-Halq)",
    makhrajNameAr: "وسط الحلق",
    descriptionEn: "Pronounced from the middle throat (pharynx) by contracting the epiglottis. It has a beautiful, clean, clear whispered flow.",
    descriptionAr: "يخرج من وسط الحلق (لسان المزمار)، بالضغط العضلي المتوسط لتضييق مجرى الهواء، مما يصدر بحة ناعمة وصافية.",
    sifaatEn: ["Whispered", "Fricative", "Deep clean wind"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستفال", "الانفتاح"],
    tongueState: "throat-pharyngeal",
    lipsState: "open",
    soundTipEn: "A deep, dry, whispered sigh. Imagine breathing on cold glass to fog it.",
    soundTipAr: "بحّة صافية عميقة تنشأ بتضييق وسط الحلق دون حشرجة."
  },
  {
    char: "خ",
    nameEn: "Khaa'",
    nameAr: "خاء",
    makhrajRegion: "halq",
    makhrajNameEn: "Upper Throat (Adna al-Halq)",
    makhrajNameAr: "أدنى الحلق",
    descriptionEn: "Pronounced from the top of the throat (closest to the mouth). Emphatic/heavy sound, with a scraping sound.",
    descriptionAr: "يخرج من أدنى الحلق (أقرب مما يتصل بالفم)، وهو حرف مفخم مستعلٍ يصدر صوتاً خشناً بسبب اهتزاز المجرى.",
    sifaatEn: ["Heavy", "Scraping", "Flowing"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستعلاء", "الانفتاح"],
    tongueState: "back-velar",
    lipsState: "open",
    soundTipEn: "Scraping sound, like 'ch' in Scottish 'loch' or Spanish 'j'. Elevated back tongue.",
    soundTipAr: "صوت حشرجة ناعم يقع في مدخل الحلق مع تفخيم ورفع أقصى اللسان."
  },
  {
    char: "د",
    nameEn: "Dal",
    nameAr: "دال",
    makhrajRegion: "lisan",
    makhrajNameEn: "Tongue Tip to Upper Gums",
    makhrajNameAr: "طرف اللسان مع أصول الثنايا",
    descriptionEn: "Pronounced from the tip of the tongue hitting the roots of the upper front teeth. Has a crisp bounce (Qalqalah) when silent.",
    descriptionAr: "يخرج من طرف اللسان مع أصول الثنايا العليا، وهو حرف مجهر صلب شديد يرتد كالمطرقة عند السكون.",
    sifaatEn: ["Solid", "Bouncy", "Lowered"],
    sifaatAr: ["الجهر", "الشدة", "الاستفال", "الانفتاح", "القلقلة"],
    tongueState: "tip-teeth",
    lipsState: "open",
    soundTipEn: "Clear rigid 'd' in 'day'. Release with a strong, elastic rebound.",
    soundTipAr: "نقر حاد محكم لطرف اللسان ينطلق مرتدّاً بوضوح."
  },
  {
    char: "ذ",
    nameEn: "Thal",
    nameAr: "ذال",
    makhrajRegion: "lisan",
    makhrajNameEn: "Tongue Tip to Upper Teeth Edges",
    makhrajNameAr: "طرف اللسان مع أطراف الثنايا",
    descriptionEn: "Pronounced from the tip of the tongue touching the inner edge of upper front teeth. Flat, light, and voiced.",
    descriptionAr: "يخرج من طرف اللسان مع أطراف الثنايا العليا، يتصف بلين صوتي مجهور جريء دون صفير.",
    sifaatEn: ["Voiced flow", "Soft", "Lowered"],
    sifaatAr: ["الجهر", "الرخاوة", "الاستفال", "الانفتاح"],
    tongueState: "tip-interdental",
    lipsState: "open",
    soundTipEn: "Soft voiced sound like 'th' in 'this' or 'father'. Keep vocal cord vibration active.",
    soundTipAr: "تلامس طرفي اللسان والأسنان مع إبقاء اهتزاز مجرى الصوت جلياً."
  },
  {
    char: "ر",
    nameEn: "Ra'",
    nameAr: "راء",
    makhrajRegion: "lisan",
    makhrajNameEn: "Tip of Tongue with slight roll",
    makhrajNameAr: "طرف اللسان الدقيق مع اللثة",
    descriptionEn: "Pronounced from the tip of the tongue touching the hard gums on the roof of mouth, with light vibration but no excessive rolling.",
    descriptionAr: "يخرج من طرف اللسان أدخل قليلاً لظهره مع لثة الثنايا العليا، ويتصف بالتكرار اللطيف والانحراف لجانبي مجرى اللسان.",
    sifaatEn: ["Rolling", "Flexible", "Voiced"],
    sifaatAr: ["الجهر", "البينية", "الاستفال", "الانفتاح", "الانحراف", "التكرير"],
    tongueState: "retroflex-apical",
    lipsState: "neutral",
    soundTipEn: "Spanish-like tapped 'r' (like 'tt' in 'butter'). Do not roll it multiple times.",
    soundTipAr: "نقرة واحدة مرنة لظهر اللسان مع منع ارتعاشات الحرف المتعددة."
  },
  {
    char: "ز",
    nameEn: "Zay",
    nameAr: "زاي",
    makhrajRegion: "lisan",
    makhrajNameEn: "Tongue Tip close to lower teeth",
    makhrajNameAr: "طرف اللسان مع فوق الثنايا السفلى",
    descriptionEn: "Pronounced by positioning the tip of the tongue close to the inner plates of the lower front teeth, producing a buzzing whistle (Safeer).",
    descriptionAr: "يخرج من رأس طرف اللسان موازياً لصفحة الثنايا السفلى فينفد الصوت بقوة صفييرية مجهورة كالنحل.",
    sifaatEn: ["Buzzing Whistle", "Fricative", "Light"],
    sifaatAr: ["الجهر", "الرخاوة", "الاستفال", "الانفتاح", "الصفير"],
    tongueState: "tip-dental-close",
    lipsState: "open",
    soundTipEn: "Sibilant buzzing sound like 'z' in 'zebra'. High frequency sound.",
    soundTipAr: "حصر مجرى الريح بين الأسنان ليخرج رنين حاد مثل أزيز النحل."
  },
  {
    char: "س",
    nameEn: "Seen",
    nameAr: "سين",
    makhrajRegion: "lisan",
    makhrajNameEn: "Tongue Tip close to lower teeth",
    makhrajNameAr: "طرف اللسان مع صفائح الثنايا السفلى",
    descriptionEn: "Pronounced with tongue tip near lower teeth plates. Soft, whispered whistling sound with plenty of airflow.",
    descriptionAr: "يخرج من رأس طرف اللسان مع صفائح الثنايا السفلى، وهو حرف مهموس يسري معه النفس بكثرة.",
    sifaatEn: ["Soft Whistle", "Fricative", "Whispered"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستفال", "الانفتاح", "الصفير"],
    tongueState: "tip-dental-close",
    lipsState: "open",
    soundTipEn: "Sharp whistling hiss like 's' in 'sand' or 'sister'. Ensure no throat restriction.",
    soundTipAr: "جريان عريض للنفس والصوت في مقدمة الفم مخلّفاً هسيساً حاداً."
  },
  {
    char: "ش",
    nameEn: "Sheen",
    nameAr: "شين",
    makhrajRegion: "lisan",
    makhrajNameEn: "Middle Tongue (Tafash-shi)",
    makhrajNameAr: "وسط اللسان (التفشي)",
    descriptionEn: "Pronounced from the middle of the tongue raising towards the palate. Its unique trait is Tafash-shi: the spreading of air inside the mouth.",
    descriptionAr: "يخرج من وسط اللسان مع الحنك الأعلى، وينفرد بصفة التَّفَشِّي وهو انتشار ريح الحرف وانتشار صوته في الفم.",
    sifaatEn: ["Spreading Air (Tafash-shi)", "Sibilant", "Whispered"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستفال", "الانفتاح", "التفشي"],
    tongueState: "mid-palatal",
    lipsState: "open",
    soundTipEn: "Like 'sh' in 'sheep'. Feel the air expanding in your cheeks and palate.",
    soundTipAr: "انتشار الهواء بانسجام وامتلاء عبر فضاء الحنك بأكمله."
  },
  {
    char: "ص",
    nameEn: "Sad",
    nameAr: "صاد",
    makhrajRegion: "lisan",
    makhrajNameEn: "Emphatic Tongue Tip Whistle",
    makhrajNameAr: "طرف اللسان مع الثنايا السفلى (تفخيم)",
    descriptionEn: "Pronounced like 'Seen' but with the back of the tongue raised high (Isti'la) and throat contracted (Itbaq), creating a heavy, deep whistle.",
    descriptionAr: "يخرج مثل السين ولكنه مستعلٍ مطبق؛ يرتفع أقصى اللسان مع إلصاق جزء كبير منه بالحنك لإضفاء قوة تفخيمية.",
    sifaatEn: ["Heaviest Whistle", "Emphatic", "Whispered"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستعلاء", "الإطباق", "الصفير"],
    tongueState: "tip-dental-close",
    lipsState: "open",
    soundTipEn: "Thick sibilant sound, like an emphatic heavy 'S'. Imagine a heavy 'sw' in 'swollen'.",
    soundTipAr: "توجيه نبرة الصفير نحو قبة الحنك الأعلى لإحداث رنين مفخم غليظ."
  },
  {
    char: "ض",
    nameEn: "Dhad",
    nameAr: "ضاد",
    makhrajRegion: "lisan",
    makhrajNameEn: "Side of Tongue to Molars (Istitalah)",
    makhrajNameAr: "حافة اللسان مع الأضراس العليا الأدخل",
    descriptionEn: "The hardest Arabic letter. Pronounced by pressing the side edge of the tongue against the upper molars. Characterized by Istitalah (prolonged sound drift).",
    descriptionAr: "يخرج من إحدى حافتي اللسان أو كلتيهما مع ما يحاذيهما من الأضراس العليا. يتميز بالاستطالة وهي امتداد مجرى الصوت.",
    sifaatEn: ["Side Pressure", "Velarized Extension", "Heavy"],
    sifaatAr: ["الجهر", "الرخاوة", "الاستعلاء", "الإطباق", "الاستطالة"],
    tongueState: "side-pressing",
    lipsState: "open",
    soundTipEn: "Heavy, dark, extended sound. The side edge seals and expands along the teeth like 'dld'.",
    soundTipAr: "حصر وضغط الصوت على طول حافة اللسان مسبباً زحفاً ممتداً للداخل."
  },
  {
    char: "ط",
    nameEn: "Taa'",
    nameAr: "طاء",
    makhrajRegion: "lisan",
    makhrajNameEn: "Emphatic Tongue Tip to Gums",
    makhrajNameAr: "طرف اللسان مع الأصول (تفخيم)",
    descriptionEn: "Pronounced like Dal but with extreme elevation of the tongue back and suction (Itbaq). Strongest, heaviest consonant in Arabic.",
    descriptionAr: "أقوى الحروف الهجائية، يخرج من طرف اللسان وأصول الثنايا مع إطباق تام للسان وتفخيم غليظ.",
    sifaatEn: ["Strongest Congruent", "Suction-heavy", "Bouncy"],
    sifaatAr: ["الجهر", "الشدة", "الاستعلاء", "الإطباق", "القلقلة"],
    tongueState: "tip-teeth",
    lipsState: "open",
    soundTipEn: "Thick explosive 'T' sound with massive rebound. No breathy air release.",
    soundTipAr: "اصطدام عنيف بدون همس ينطلق منه قلقلة كبرى ذات جهارة عظيمة."
  },
  {
    char: "ظ",
    nameEn: "Dhaa'",
    nameAr: "ظاء",
    makhrajRegion: "lisan",
    makhrajNameEn: "Emphatic Tongue Tip to Teeth Edges",
    makhrajNameAr: "طرف اللسان مع الثنايا العليا (مفخم)",
    descriptionEn: "The emphatic counterpart of 'Thal'. Pronounced with the tongue tip at upper tooth edges while the back of tongue is raised high.",
    descriptionAr: "يخرج من طرف اللسان وأطراف الثنايا العليا، مع طي ظهر اللسان وملء تجويف الفم بصوت الحرف الغليظ.",
    sifaatEn: ["Emphatic Voiced Fricative", "Suction", "Thick"],
    sifaatAr: ["الجهر", "الرخاوة", "الاستعلاء", "الإطباق"],
    tongueState: "tip-interdental",
    lipsState: "open",
    soundTipEn: "Heavy voiced 'th' (like heavy 'th' in 'thy' with inflated cheeks). Flat tip on bite point.",
    soundTipAr: "إخراج رأس اللسان لملامسة أطراف الأسنان أثناء رفع أقصى اللسان."
  },
  {
    char: "ع",
    nameEn: "Ayn",
    nameAr: "عين",
    makhrajRegion: "halq",
    makhrajNameEn: "Middle Throat (Wast al-Halq)",
    makhrajNameAr: "وسط الحلق",
    descriptionEn: "Pronounced from the middle throat by squeezing the epiglottis back. Voiced, solid, but sliding flow (Biniyyah).",
    descriptionAr: "يخرج من وسط الحلق (لسان المزمار) برجوع المزمار للخلف قليلاً ليضيق المعبر ضيقاً متوسطاً.",
    sifaatEn: ["Voiced Squeeze", "Semi-vocalic flow", "Centric"],
    sifaatAr: ["الجهر", "التوسط", "الاستفال", "الانفتاح"],
    tongueState: "throat-pharyngeal",
    lipsState: "open",
    soundTipEn: "Voiced throat contraction. Imagine hum-like groaning from high-tension neck.",
    soundTipAr: "اعتصار عضلي ناعم في تجويف الحلق يفرز صوتاً متوسط الجريان."
  },
  {
    char: "غ",
    nameEn: "Ghayn",
    nameAr: "غين",
    makhrajRegion: "halq",
    makhrajNameEn: "Upper Throat (Adna al-Halq)",
    makhrajNameAr: "أدنى الحلق",
    descriptionEn: "Pronounced from the upper throat (closest to uvula). Rolling/gurgling sound. Voiced and heavy.",
    descriptionAr: "يخرج من أدنى الحلق (المنطقة القريبة من اللهاة). صوت مفخم رخو، يقع فيه جريان وافر للصوت.",
    sifaatEn: ["Gurgling", "Voiced Fricative", "Heavy"],
    sifaatAr: ["الجهر", "الرخاوة", "الاستعلاء", "الانفتاح"],
    tongueState: "back-velar",
    lipsState: "open",
    soundTipEn: "Like gargling with liquids. Or French 'r'. Keep the sound flowing smoothly.",
    soundTipAr: "رنين غرغرة اهتزازي رطب في أقصى الحنك الرخو مع تفخيم الصوت."
  },
  {
    char: "ف",
    nameEn: "Fa'",
    nameAr: "فاء",
    makhrajRegion: "shafatan",
    makhrajNameEn: "Lower Lip & Upper Teeth",
    makhrajNameAr: "بطن الشفة السفلى مع الثنايا العليا",
    descriptionEn: "Pronounced by touching the wet inner part of the lower lip cleanly to the flat edges of the upper front teeth.",
    descriptionAr: "يخرج من بطن الشفة السفلى ملامساً لأطراف الأسنان الثنايا العليا، ويتدفق منه هواء خفيف ناعم.",
    sifaatEn: ["Lip-to-teeth", "Soft airflow", "Whispered"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستفال", "الانفتاح"],
    tongueState: "neutral",
    lipsState: "lip-teeth",
    soundTipEn: "Like 'f' in 'father'. Gently tap the upper teeth on the inside of your bottom lip.",
    soundTipAr: "جريان ناعم للنفس يسري بمجرد التقاء أطراف الأسنان ببطن الشفة."
  },
  {
    char: "ق",
    nameEn: "Qaf",
    nameAr: "قاف",
    makhrajRegion: "lisan",
    makhrajNameEn: "Extreme Back Tongue to Soft Palate",
    makhrajNameAr: "أقصى اللسان مع الحنك اللحمي",
    descriptionEn: "Pronounced by snapping the backmost part of the tongue against the soft palate (uvula). Heavy, explosive, bouncing (Qalqalah).",
    descriptionAr: "يخرج من أقصى اللسان مع الحنك اللحمي الرخو فوق الهاة، حرف صلب شديد ينخلع ارتدادياً بقوة.",
    sifaatEn: ["Extreme Back Snap", "Solid Heavy", "Qalqalah"],
    sifaatAr: ["الجهر", "الشدة", "الاستعلاء", "الانفتاح", "القلقلة"],
    tongueState: "back-velar",
    lipsState: "open",
    soundTipEn: "Deep explosive 'Q' throat snap (unlike French/German k). Releases with a crisp heavy click.",
    soundTipAr: "اندفاع حاد من أقصى اللسان ينحبس حبساً كلياً ثم ينطق بقلقلة هائلة."
  },
  {
    char: "ك",
    nameEn: "Kaf",
    nameAr: "كاف",
    makhrajRegion: "lisan",
    makhrajNameEn: "Back Tongue to Junction Palate",
    makhrajNameAr: "أقصى اللسان مع الحنك العظمي",
    descriptionEn: "Pronounced slightly forward from Qaf (junction of hard and soft palates). Whispered (Hams) when silent, flat and light.",
    descriptionAr: "يخرج من أقصى اللسان أسفل مخرج القاف قليلاً (بين اللحمي والعظمي)، يسري معه ريح خفيف عند تفريده.",
    sifaatEn: ["Whispered snap", "Dry release", "Light"],
    sifaatAr: ["الهمس", "الشدة", "الاستفال", "الانفتاح"],
    tongueState: "back-velar",
    lipsState: "open",
    soundTipEn: "Like 'k' in 'keep'. Releases with a soft whispery tail (never heavy).",
    soundTipAr: "قرع جاف لظهر الحنك ينتهي بنضح هوائي خفيف (همس مسموع)."
  },
  {
    char: "ل",
    nameEn: "Lam",
    nameAr: "لام",
    makhrajRegion: "lisan",
    makhrajNameEn: "Sides of Tongue Tip to Gums",
    makhrajNameAr: "أدنى حافة اللسان إلى منتهى طرفه",
    descriptionEn: "Pronounced from the expansive edge of the tongue tip touching upper front gums. Flat, flowing and soft.",
    descriptionAr: "يخرج من أدنى حافة اللسان الأمامية إلى منتهى طرفه مع لثة الأسنان العليا، وينحرف صوته يمنة ويسرة.",
    sifaatEn: ["Tongue Side Flow", "Lateral Side Bend", "Voiced"],
    sifaatAr: ["الجهر", "التوسط", "الاستفال", "الانفتاح", "الانحراف"],
    tongueState: "tip-teeth",
    lipsState: "neutral",
    soundTipEn: "Like light 'l' in 'love' (not heavy English 'l' in 'ball'). Dynamic forward seal.",
    soundTipAr: "مساحة التفاف واسعة للسان تلامس اللثة العليا بانحراف صوتي لطيف."
  },
  {
    char: "م",
    nameEn: "Meem",
    nameAr: "ميم",
    makhrajRegion: "shafatan",
    makhrajNameEn: "Both Lips with nasal flow",
    makhrajNameAr: "الشفتان مع الغنة للخيشوم",
    descriptionEn: "Pronounced by closing both lips lightly, accompanied by a natural resonance flowing through the nasal cavity (Ghunnah).",
    descriptionAr: "يخرج بانطباق الشفتين انطباقاً هيناً سهلاً، ويتحول نصفه الآخر ليخرج من الخياشيم بالرنين الغني (الغنة).",
    sifaatEn: ["Double-Chambered", "Nasal Resonance", "Voiced half-flow"],
    sifaatAr: ["الجهر", "التوسط", "الاستفال", "الانفتاح", "الغنة"],
    tongueState: "neutral",
    lipsState: "closed",
    soundTipEn: "Like 'm' in 'moon'. Ensure sound shifts to the nose if doubled.",
    soundTipAr: "تلاقي الشفاه اللطيف يتبعه جريان الغنة الطبيعية من سقف الأنف."
  },
  {
    char: "ن",
    nameEn: "Noon",
    nameAr: "نون",
    makhrajRegion: "khayshum",
    makhrajNameEn: "Tongue Tip with Nasal flow",
    makhrajNameAr: "طرف اللسان مع الغنة للخيشوم",
    descriptionEn: "Pronounced by sealing the tongue tip on the upper gums, completely channeling the voice stream out of the nasal cavity.",
    descriptionAr: "يخرج بقرع طرف اللسان للثة الثنايا العليا، ويتنقل صوته مباشرة ليخرج كغنة دافئة عبر تجويف الخيشوم.",
    sifaatEn: ["Nasal flow (Ghunnah)", "Front-gums seal", "Light"],
    sifaatAr: ["الجهر", "التوسط", "الاستفال", "الانفتاح", "الغنة"],
    tongueState: "tip-teeth",
    lipsState: "open",
    soundTipEn: "Like 'n' in 'noon'. Part of the sound is oral, but the soul is nasal.",
    soundTipAr: "حصر كلي لطرف اللسان ينفد معه الهواء نغماً شجياً من الأنف."
  },
  {
    char: "هـ",
    nameEn: "Haa'",
    nameAr: "هاء",
    makhrajRegion: "halq",
    makhrajNameEn: "Deep Throat (Aqsa al-Halq)",
    makhrajNameAr: "أقصى الحلق",
    descriptionEn: "Pronounced from the deepest throat with minimal pressure. Very light, whispered, and flowing breath.",
    descriptionAr: "يخرج من أقصى الحلق، أضعف الحروف وأشدها خفاءً، يتطلب دفعاً مرناً للنفس دون زيادة تشنج.",
    sifaatEn: ["Whispered sigh", "Weakest airflow", "Open free"],
    sifaatAr: ["الهمس", "الرخاوة", "الاستفال", "الانفتاح", "الخفاء"],
    tongueState: "neutral",
    lipsState: "open",
    soundTipEn: "Light, breathy 'h' in 'hello'. Relaxed sighing motion of vocal tracts.",
    soundTipAr: "هواء زفير مرن لطيف يسير بسلاسة دون اهتزاز أو ضغط للوزتين."
  },
  {
    char: "و",
    nameEn: "Waw",
    nameAr: "واو",
    makhrajRegion: "shafatan",
    makhrajNameEn: "Lips Rounded (Al-Shafatan)",
    makhrajNameAr: "الشفتان باستدارة",
    descriptionEn: "Pronounced as a consonant by rounding the lips into a tight circle without them touching. (When a vowel, it resonance from al-Jawf).",
    descriptionAr: "تخرج بضم الشفتين إلى الأمام مع إبقاء فتحة دائرية يسيرة دون تلاقيهما تفادياً للهمس.",
    sifaatEn: ["Lip Rounding", "Voiced glide", "Lowered"],
    sifaatAr: ["الجهر", "الرخاوة", "الاستفال", "الانفتاح"],
    tongueState: "neutral",
    lipsState: "rounded",
    soundTipEn: "Like 'w' in 'water'. Lips form a round tube, back of tongue raises slightly.",
    soundTipAr: "تكوير الشفاه مع فجوة واضحة يمر بها الهواء بنعومة."
  },
  {
    char: "ي",
    nameEn: "Ya'",
    nameAr: "ياء",
    makhrajRegion: "lisan",
    makhrajNameEn: "Middle Tongue (Voiced glide)",
    makhrajNameAr: "وسط اللسان",
    descriptionEn: "Pronounced as a consonant by raising the middle of the tongue to the hard palate. Smooth, non-fricative glide.",
    descriptionAr: "تخرج كحرف علة أو ساكنة بارتفاع وسط اللسان نحو الحنك الأعلى بحرية وسلاسة دون عرقلة تنفسية.",
    sifaatEn: ["Palatal Glide", "Voiced", "Soft Ease"],
    sifaatAr: ["الجهر", "الرخاوة", "الاستفال", "الانفتاح", "اللين"],
    tongueState: "mid-palatal",
    lipsState: "open",
    soundTipEn: "Like 'y' in 'yellow' or 'yes'. Smooth elevation of middle tongue without touch.",
    soundTipAr: "ارتفاع وسط المسار مسبباً انزلاقاً غنائياً سهلاً لمرور الهواء."
  }
];

interface MakhrajVisualizerProps {
  initialLetter?: string;
  onLetterSelected?: (char: string) => void;
  lang?: 'ar' | 'en';
}

export default function MakhrajVisualizer({
  initialLetter = "ت",
  onLetterSelected,
  lang = "ar"
}: MakhrajVisualizerProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>(initialLetter);
  const [isPlayingGuide, setIsPlayingGuide] = useState<boolean>(false);
  const [drillFeedback, setDrillFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (initialLetter) {
      setSelectedLetter(initialLetter);
    }
  }, [initialLetter]);

  const letterData = ARABIC_LETTERS_DB.find(l => l.char === selectedLetter) || ARABIC_LETTERS_DB[2]; // Default to Ta'

  // Dynamic Tongue path d-attribute based on active letter state
  const getTonguePath = (state: string): string => {
    switch (state) {
      case 'tip-teeth':
        // Tongue curls up touching the upper teeth root area (near 35,46)
        return "M 42,75 C 44,68 40,54 36,46 C 42,49 54,58 64,57 C 62,68 52,74 42,75";
      case 'tip-interdental':
        // Tongue tip protudes between the teeth layers (near 32,53)
        return "M 42,75 C 44,68 38,55 31,52 C 37,53 52,58 64,57 C 62,68 52,74 42,75";
      case 'back-velar':
        // Back of tongue elevates significantly to uvula (near 65,47)
        return "M 42,75 C 44,68 52,57 65,46 C 63,56 54,64 64,57 Q 48,78 42,75";
      case 'mid-palatal':
        // Middle tongue raises to hard palate (near 48,46)
        return "M 42,75 C 43,62 48,46 54,49 C 51,58 54,64 64,57 C 62,68 52,74 42,75";
      case 'retroflex-apical':
        // Curled tongue retroflex shape
        return "M 42,75 C 44,68 48,53 44,48 C 47,52 55,59 64,57 C 62,68 52,74 42,75";
      case 'throat-pharyngeal':
        // Tongue body drops and epiglottis region contracts (retracting backward)
        return "M 42,75 C 48,73 66,72 65,65 C 55,59 50,56 64,57 C 62,68 52,74 42,75";
      case 'tip-dental-close':
        // Tongue tip comes close to lower teeth plates (near 36,56)
        return "M 42,75 C 43,68 39,58 35,55 C 40,56 53,58 64,57 C 62,68 52,74 42,75";
      case 'side-pressing':
        // Sides of tongue puffing up touching sides
        return "M 42,75 C 42,62 49,49 58,51 C 55,59 56,64 64,57 C 62,68 52,74 42,75";
      case 'neutral':
      default:
        // Soft neutral tongue
        return "M 42,75 Q 46,65 52,60 Q 58,58 64,57 C 62,68 52,74 42,75";
    }
  };

  // Dynamic Lips shape or color highlight configurations
  const getLipsHighlightColor = (state: string): string => {
    switch (state) {
      case 'closed':
        return '#ea580c'; // Warm orange closed lips
      case 'rounded':
        return '#ea580c'; // Vibrant rounded highlight
      case 'lip-teeth':
        return '#047857'; // Deep emerald teeth-to-lip highlight
      case 'open':
      default:
        return '#475569'; // Standard slate
    }
  };

  const handlePlayLetterAudio = () => {
    setIsPlayingGuide(true);
    setDrillFeedback(null);
    
    // Synthesize simple audio cue depending on browser support
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Speak phonetics or english letter
      const msg = new SpeechSynthesisUtterance(letterData.char);
      msg.lang = 'ar-SA';
      msg.rate = 0.55;
      msg.volume = 1.0;
      msg.onend = () => setIsPlayingGuide(false);
      window.speechSynthesis.speak(msg);
    } else {
      setTimeout(() => setIsPlayingGuide(false), 800);
    }
  };

  const handleSelectLetter = (char: string) => {
    setSelectedLetter(char);
    if (onLetterSelected) {
      onLetterSelected(char);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-205 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col space-y-6" id="makhraj-lab-visualizer-card">
      
      {/* Top Bar Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#503020]">Laboratory</span>
            <span className="text-slate-300 font-bold">|</span>
            <span className="text-[10px] text-emerald-800 bg-emerald-55/10 px-2.5 py-0.5 rounded-full border border-emerald-200/50 font-bold">Makhārij Interactive Core</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-905 font-sans leading-none">
            {lang === 'ar' ? 'معمل مخارج الحروف العربية التفاعلي' : 'Interactive Arabic Makhārij Lab'}
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 font-sans">
            {lang === 'ar' ? 'انقر على أي حرف هجائي لدراسة ديناميكية اللسان، وحركة الشفاه، ومسار سريان الهواء.' : 'Click on any Arabic letter below to observe animated tongue morphing, lip positions, and airstream routes.'}
          </p>
        </div>

        {/* Listen dynamic indicator */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button 
            onClick={handlePlayLetterAudio}
            disabled={isPlayingGuide}
            className={`px-4.5 py-2.5 rounded-2xl border text-xs font-black tracking-wide flex items-center gap-2 cursor-pointer transition shadow-sm ${
              isPlayingGuide 
                ? 'bg-amber-600 border-amber-500 text-white animate-pulse' 
                : 'bg-amber-50 border-amber-205 hover:bg-amber-100 text-amber-900'
            }`}
            title="Listen to letters articulation reference pronunciation"
          >
            {isPlayingGuide ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
            <span>{lang === 'ar' ? 'استمع للحرف' : 'Listen Letter'}</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL ALPHABET GOLD SCROLL BAR */}
      <div className="bg-[#FAF8F5] border border-amber-900/10 rounded-2xl p-4 shadow-inner">
        <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400 block mb-2 text-right">
          {lang === 'ar' ? 'سجل الحروف الهجائية الثمانية والعشرين' : 'The 28 Alphabet scroll'}
        </span>
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent select-none">
          {ARABIC_LETTERS_DB.map((lt) => {
            const isSelected = lt.char === selectedLetter;
            return (
              <button
                key={lt.char}
                onClick={() => handleSelectLetter(lt.char)}
                className={`w-11 h-11 shrink-0 rounded-xl font-serif text-xl font-black flex items-center justify-center transition border cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-805 border-amber-850 text-white shadow' 
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-350'
                }`}
              >
                {lt.char}
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE SPLIT SCREEN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COMPONENT: SVG ANATOMICAL ANIMATION FIELD */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-950 rounded-2.5rem p-6 flex flex-col justify-between items-center relative overflow-hidden min-h-[330px] shadow-2xl">
          
          {/* Subtle diagnostic grids background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }}></div>
          
          {/* Diagnostic status tag floating */}
          <div className="absolute top-4 right-4 bg-black/50 border border-white/5 rounded-xl px-3 py-1 text-[9px] font-mono text-emerald-300 flex items-center gap-1.5 backdrop-blur-sm z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>TONGUE: {letterData.tongueState.toUpperCase()}</span>
          </div>

          <div className="absolute top-4 left-4 bg-black/50 border border-white/5 rounded-xl px-3 py-1 text-[9px] font-mono text-amber-300 flex items-center gap-1.5 backdrop-blur-sm z-10">
            <span>REGION: {letterData.makhrajRegion.toUpperCase()}</span>
          </div>

          {/* MASTER SVG LAYOUT VIEWBOX */}
          <div className="w-full h-56 flex items-center justify-center relative mt-4">
            <svg viewBox="0 0 100 100" className="w-52 h-52 transition-all duration-300">
              
              {/* Profile Background Guide */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,5" />
              
              {/* Back Vocal Path Silhouette */}
              {/* Pharynx/Back Wall */}
              <path d="M 75,18 C 75,45 77,65 77,90" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Nasal Cavity Path Floor & Roof */}
              {/* Nasal Floor - Hard Palate (Top mouth) */}
              <path d="M 12,31 C 28,31 46,36 62,36 C 68,36 71,42 70,52 C 69,57 71,62 72,70" fill="none" stroke="#334155" strokeWidth="2" />
              {/* Nasal Roof */}
              <path d="M 15,18 C 26,16 38,18 48,22 C 55,25 61,16 71,18" fill="none" stroke="#1e293b" strokeWidth="1.5" />
              
              {/* Uvula (Hanging down area near 65,48) */}
              <path d="M 62,36 Q 66,35 66,41 Q 65,46 63,45 Q 61,42 62,36" fill="#1e293b" opacity="0.6" stroke="#475569" strokeWidth="1" />

              {/* Lower Throat Outline (Epiglottis bed) */}
              <path d="M 58,82 C 58,85 59,88 60,90" fill="none" stroke="#334155" strokeWidth="2" />

              {/* TEETH RENDER */}
              {/* Upper teeth block */}
              <rect x="33" y="31.8" width="3" height="4.5" rx="0.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.75" />
              {/* Lower teeth block */}
              <rect x="32.5" y="49.5" width="3.2" height="4.5" rx="0.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.75" />

              {/* TONGUE ACTIVE VECTOR PATH */}
              <motion.path 
                initial={false}
                animate={{ d: getTonguePath(letterData.tongueState) }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                fill="url(#tongueGradient)" 
                stroke="#fda4af" 
                strokeWidth="1.75" 
              />

              {/* LIPS DYNAMIC VECTOR PATHS */}
              {/* Upper Lip */}
              <path 
                d={
                  letterData.lipsState === 'closed' 
                    ? "M 27,29.5 Q 23,29.5 24,32.5 Q 25,35.5 32,32.5" 
                    : letterData.lipsState === 'rounded'
                    ? "M 26,27.5 Q 21,27.5 22,30.5 Q 23,34.5 30,31.5"
                    : "M 27,29.5 Q 23,29.5 24,31.5 Q 25,33.5 31,31.5"
                }
                fill="none" 
                stroke={getLipsHighlightColor(letterData.lipsState)} 
                strokeWidth={letterData.lipsState === 'closed' ? "3" : "2.2"} 
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {/* Lower Lip */}
              <path 
                d={
                  letterData.lipsState === 'closed' 
                    ? "M 28,49.5 Q 22,49.5 23,46.5 Q 24,43.5 31.5,46.5" 
                    : letterData.lipsState === 'rounded'
                    ? "M 25,51.5 Q 20,51.5 21,48.5 Q 22,44.5 30,47.5"
                    : "M 28,50.5 Q 23,50.5 24,48.5 Q 25,46.5 31,48.5"
                }
                fill="none" 
                stroke={getLipsHighlightColor(letterData.lipsState)} 
                strokeWidth={letterData.lipsState === 'closed' ? "3" : "2.2"} 
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* DYNAMIC ACOUSTIC FLOW PARTICLES AND PULSES */}
              <AnimatePresence>
                {/* Nose Flow Glow (Khayshum - Nasal Passage) */}
                {letterData.makhrajRegion === 'khayshum' && (
                  <motion.g 
                    key="nasal-airflow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Glowing Air Waves exiting nose */}
                    <motion.path 
                      d="M 64,32 C 45,28 30,19 12,23" 
                      fill="none" 
                      stroke="#d97706" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                      animate={{ strokeDashoffset: [-15, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    />
                    {/* Pulsating hot spot */}
                    <motion.circle 
                      cx="42" cy="27" r="8" 
                      fill="#d97706" 
                      opacity="0.18"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    />
                    <circle cx="42" cy="27" r="3" fill="#ea580c" />
                  </motion.g>
                )}

                {/* Deep Throat Glow (Hamzah, Ha) */}
                {letterData.makhrajRegion === 'halq' && (
                  <motion.g 
                    key="throat-airflow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Air pathway guide */}
                    <motion.path 
                      d="M 75,85 Q 70,72 65,49"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="5 3"
                      animate={{ strokeDashoffset: [15, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    {/* Throat Hotspots */}
                    {letterData.makhrajNameEn.includes("Deep") && (
                      <motion.circle 
                        cx="73" cy="80" r="10" 
                        fill="#06b6d4" 
                        opacity="0.25"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.3 }}
                      />
                    )}
                    {letterData.makhrajNameEn.includes("Middle") && (
                      <motion.circle 
                        cx="70" cy="65" r="9" 
                        fill="#059669" 
                        opacity="0.28"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.3 }}
                      />
                    )}
                    {letterData.makhrajNameEn.includes("Upper") && (
                      <motion.circle 
                        cx="66" cy="48" r="8" 
                        fill="#d97706" 
                        opacity="0.27"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.3 }}
                      />
                    )}
                  </motion.g>
                )}

                {/* Mouth Empty Space Resonance (Al-Jawf) */}
                {letterData.makhrajRegion === 'jawf' && (
                  <motion.g key="jawf-airflow">
                    <motion.ellipse 
                      cx="50" cy="48" rx="14" ry="10" 
                      fill="#a78bfa" 
                      opacity="0.18"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                    />
                    <motion.path 
                      d="M 70,75 Q 50,45 28,45" 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="2.5" 
                      strokeDasharray="4 6"
                      animate={{ strokeDashoffset: [-20, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                    />
                  </motion.g>
                )}

                {/* Tongue Focus Hotspots */}
                {letterData.makhrajRegion === 'lisan' && (
                  <motion.g key="tongue-points" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    {letterData.tongueState === 'tip-teeth' && (
                      <>
                        <motion.circle cx="34.5" cy="45" r="6" fill="#10b981" opacity="0.32" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} />
                        <circle cx="34.5" cy="45" r="2.5" fill="#047857" />
                      </>
                    )}
                    {letterData.tongueState === 'tip-interdental' && (
                      <>
                        <motion.circle cx="31.5" cy="47.5" r="5.5" fill="#059669" opacity="0.3" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.3 }} />
                        <circle cx="31.5" cy="47.5" r="2" fill="#047857" />
                      </>
                    )}
                    {letterData.tongueState === 'back-velar' && (
                      <>
                        <motion.circle cx="58" cy="49" r="7.5" fill="#e11d48" opacity="0.25" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                        <circle cx="58" cy="49" r="2.5" fill="#be123c" />
                      </>
                    )}
                    {letterData.tongueState === 'mid-palatal' && (
                      <>
                        <motion.circle cx="48" cy="46" r="7" fill="#6366f1" opacity="0.26" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} />
                        <circle cx="48" cy="46" r="2" fill="#4f46e5" />
                      </>
                    )}
                    {letterData.tongueState === 'retroflex-apical' && (
                      <>
                        <motion.circle cx="44" cy="49" r="6.5" fill="#f59e0b" opacity="0.28" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.3 }} />
                        <circle cx="44" cy="49" r="2" fill="#b45309" />
                      </>
                    )}
                  </motion.g>
                )}

                {/* Lips focus spot */}
                {letterData.makhrajRegion === 'shafatan' && (
                  <motion.g key="lips-focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.circle 
                      cx="26" cy="40" r="7.5" 
                      fill="#f97316" 
                      opacity="0.3"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    />
                    <circle cx="26" cy="40" r="2.5" fill="#c2410c" />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Definitions Definitions for gradients */}
              <defs>
                <linearGradient id="tongueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#fda4af" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Guide Overlay label */}
          <div className="w-full text-center p-3.5 bg-white/5 border border-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-wider block mb-1">
              {lang === 'ar' ? 'آلية النطق التوليدية' : 'MECHANICAL PRONUNCIATION MODEL'}
            </span>
            <p className="text-[11px] text-emerald-300 font-sans tracking-wide">
              {lang === 'ar' ? letterData.makhrajNameAr : letterData.makhrajNameEn}
            </p>
          </div>
        </div>

        {/* RIGHT COMPONENT: COMPLETE DETAILS CARD & INTERACTIVE PRACTICE DRIVER */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Main info tile */}
          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-205 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-amber-805 text-white flex items-center justify-center font-serif text-3xl font-black shadow-md">
                  {letterData.char}
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">{lang === 'ar' ? `حرف ال${letterData.nameAr}` : `${letterData.nameEn} Character`}</h3>
                  <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">{letterData.makhrajRegion.toUpperCase()} REGION</span>
                </div>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-slate-200/60 text-[10px] text-slate-700 font-mono font-bold uppercase tracking-wider border border-slate-300/40">
                {lang === 'ar' ? 'طبيعي' : 'VERIFIED MANUSCRIPT ROOT'}
              </span>
            </div>

            {/* Scientific anatomy instructions */}
            <div className="space-y-3 font-sans">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                {lang === 'ar' ? 'التشريح الأكاديمي للمخرج' : 'Anatomical Mechanism & Gird'}
              </span>
              <p className="text-slate-700 text-xs leading-relaxed font-sans" style={{ textAlign: 'justify' }}>
                {lang === 'ar' ? letterData.descriptionAr : letterData.descriptionEn}
              </p>
            </div>

            {/* Characeristics - Sifaat badges */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                {lang === 'ar' ? 'صفات الحرف الملازمة' : 'Inherent Scholarly Characteristics (Sifāt)'}
              </span>
              <div className="flex flex-wrap gap-2">
                {(lang === 'ar' ? letterData.sifaatAr : letterData.sifaatEn).map((sf, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-100 text-[10px] font-sans font-bold uppercase tracking-wider"
                  >
                    ✦ {sf}
                  </span>
                ))}
              </div>
            </div>

            {/* Vocal training sound tip */}
            <div className="bg-amber-500/5 border border-amber-900/10 rounded-xl p-4 space-y-1.5 font-sans">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block">
                {lang === 'ar' ? 'توجيه التدريب والنطق الفصيح' : 'Classic Auditory Tip'}
              </span>
              <p className="text-slate-650 text-xs italic leading-relaxed">
                "{lang === 'ar' ? letterData.soundTipAr : letterData.soundTipEn}"
              </p>
            </div>
          </div>

          {/* PRONUNCIATION MICRO-DRILL LAB */}
          <div className="bg-[#FAF8F5] border-2 border-[#503020]/10 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-900/5 pb-2.5">
              <Activity className="w-4 h-4 text-amber-805" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{lang === 'ar' ? 'معايرة تلفظ ومحاكاة النطق الذاتي' : 'Vocal Pronunciation Practice Drill'}</h4>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              {lang === 'ar' 
                ? 'انطق الحرف بصوت مسموع وواضح بالقرب من المحيط الصوتي لجهازك، وسلّط الضغط على النقاط التشريحية الظاهرة في الشكل التوضيحي.'
                : 'Pronounce the letter aloud clearly and target the specific anatomical highlighted node.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={() => {
                  setDrillFeedback(lang === 'ar' ? 'أصلت النطق بنجاح! جرى التثبت من موضع الصوت.' : 'Excellent articulation alignment verified!');
                }}
                className="w-full sm:w-auto bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm border border-amber-850"
              >
                <span>{lang === 'ar' ? 'اضغط للمحاكاة وتأكيد النطق الصحيح' : 'Simulate & Articulate'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {drillFeedback && (
                <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-xs text-emerald-950 font-sans font-medium flex items-center gap-2 animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{drillFeedback}</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
