/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { analyzeTajweedText } from "./server/tajweedEngine.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side body parsers with sufficient limit for brief audio uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Lazy initializer for Google GenAI client to handle missing key gracefully on dev launch
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST Endpoint: Get Recitation Feedback (Actual Audio or Simulated Recitation)
app.post("/api/ai-coach", async (req, res) => {
  const { verseText, surahName, ayahNumber, audioBase64, mimeType, qiraat } = req.body;

  if (!verseText || !surahName) {
    return res.status(400).json({ error: "Required parameters (verseText, surahName) are missing." });
  }

  // 1. Run standard deterministic rules engine as absolute validation ground truth
  const deterministicAnalysis = analyzeTajweedText(verseText, qiraat || "hafs");
  const parsedRulesText = JSON.stringify(deterministicAnalysis.words.map(w => ({
    word: w.wordText,
    rules: w.occurrences.map(o => ({
      name: o.ruleName,
      cat: o.category,
      desc: o.description,
      makhraj: o.makhrajInteractiveDetails.title,
      beats: o.durationBeats
    }))
  })), null, 2);

  try {
    const ai = getAI();
    let contents: any[] = [];

    // Instruction prompt grounded with Phase 1 engine guidelines
    const basePrompt = `You are Al-Hikmah Academy's elite AI Quran Coach & Tajweed Teacher.
Analyze a student reciting:
Surah: ${surahName}
Ayah / Verse: ${ayahNumber || 1}
Correct Text: "${verseText}"
Qiraat Mode: ${(qiraat || "hafs").toUpperCase()}

Our deterministic Tajweed Rules Engine has analyzed this verse and identified the following rules as ground-truth checkpoints:
${parsedRulesText}

Validate student recitation. Evaluate pronunciation, clarity of throat/consonant letters, and duration accuracy of vowel elongation (Madd counts) or nasalization (Ghunnah beats).
Provide:
1. Overall score (0 to 100)
2. Fluency score (0 to 100)
3. Pronunciation accuracy score (0 to 100)
4. A reassuring, encouraging, yet highly technical feedback paragraph
5. An array of specific corrective notes pointing to words in the verse if possible. Mark each note with a level: 'success' (for excellent Tajweed mastery), 'warning' (for mistakes or parts needing correction), or 'info' (for general training tips). Make sure you highlight specific words from the ground-truth rules!

Provide your response in raw JSON format matching this schema strictly. Don't add backticks or markdown wrapper.`;

    if (audioBase64 && mimeType) {
      // Multimodal audio evaluation (Phase 3)
      contents = [
        {
          inlineData: {
            mimeType,
            data: audioBase64,
          },
        },
        {
          text: `${basePrompt}\n\nPlease evaluate the attached audio recording of the user reciting this verse. Verify it meticulously against the ground-truth rules list above. If the audio is empty, silent, or unrelated, still return a meaningful report with low scores (<50) and a supportive explanation.`,
        },
      ];
    } else {
      // Text guided simulated evaluation / Tutorial mode
      contents = [
        {
          text: `${basePrompt}\n\nSince no microphone capture was provided, formulate a theoretical coaching feedback report as if the student recited it with standard beginner-level errors (e.g. omitting the Ghunnah/nasalization, or under-prolonging the Madd vowel sounds, or mispronouncing throat letters). Ground this realistic feedback strictly in the rules listed above, detailing how the user can improve.`,
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            fluencyScore: { type: Type.INTEGER },
            pronunciationScore: { type: Type.INTEGER },
            feedbackText: { type: Type.STRING },
            notes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "Detailed educational feedback or correction note" },
                  type: { type: Type.STRING, description: "Must be 'success', 'warning', or 'info'" },
                  word: { type: Type.STRING, description: "The specific Arabic word or word phrase in the verse this refers to" },
                },
                required: ["text", "type"],
              },
            },
          },
          required: ["overallScore", "fluencyScore", "pronunciationScore", "feedbackText", "notes"],
        },
      },
    });

    const textOutput = response.text || "{}";
    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error: any) {
    console.error("AI Coach Request Failed:", error);
    res.status(500).json({
      error: "Recitation analysis failed. Make sure your Gemini API key is configured correctly in Secrets.",
      details: error.message,
    });
  }
});

// REST Endpoint: Parse any Quranic verse using the pure deterministic Rules Engine
app.post("/api/tajweed-parse", (req, res) => {
  const { text, qiraat } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Required parameter 'text' is missing." });
  }
  try {
    const analysis = analyzeTajweedText(text, qiraat || "hafs");
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to parse text containing rules.", details: err.message });
  }
});

// REST Endpoint: Ask the Mufti (Academic & Scholarly Q&A)
app.post("/api/scholarly", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question was provided." });
  }

  // Pre-configured elegant fallback for offline/development mode
  const offlineFallbacks: { [key: string]: any } = {
    "prayer": {
      answer: "Prayer (Salah) is the second pillar of Islam and serves as the daily spiritual connection between a servant and the Creator. It teaches discipline, mindfulness (Khushu), and constant remembrance of the Divine, purifying the soul five times daily.",
      scholars: "Hanafi, Shafi'i, Maliki, and Hanbali schools all agree on the absolute obligation of the five daily prayers, differing mainly in minor physical postures and supplementary supplications. Classic jurists like Imam Al-Ghazali stress that the absolute soul of Salah is mindfulness (Khushu).",
      verses: [
        { text: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ", translation: "And establish prayer and give Zakah and bow with those who bow [in worship]." }
      ],
      actionItems: ["Focus on breathing slowly before entering Takbir", "Review the literal meaning of Tashahhud to heighten focus", "Pace your recitation of verses during individual cycles"]
    },
    "default": {
      answer: "Searching for beneficial and authentic knowledge (Ilm Naafi) is designated as a spiritual duty for every single student. Understanding history, foundational classical jurisprudences, and beautiful character values empowers a balanced life.",
      scholars: "Classic scholars like Imam Al-Shafi'i emphasized that knowledge is not merely what is memorized, but that which benefits. Scholars throughout Damascus, Baghdad, and Cordoba built massive review chains to verify the authenticity of all teachings.",
      verses: [
        { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", translation: "And say: 'O my Lord! Increase me in knowledge.'" }
      ],
      actionItems: ["Set aside consistent study windows daily", "Verify citations back to pristine primary sources", "Teach what you have mastered to family and peers"]
    }
  };

  try {
    const ai = getAI();
    const prompt = `You are a distinguished classical Islamic academic scholar and mufti.
Answer this student's theological, philosophical, linguistic or historical inquiry in a highly intellectual, comprehensive, and reassuring scholastic tone:
Student Inquiry: "${question}"

Formulate a response structuring:
1. "answer": A detailed explanation of the question's answers, addressing historical or contextual relevance.
2. "scholars": Highlights or synthesis of perspectives from major classical scholarly authorities (e.g. Al-Ghazali, Ibn Sina, or the dynamic classic schools of thought Hanafi, Maliki, Shafi'i, Hanbali).
3. "verses": An array containing a relevant Quranic verse or Hadith citation with its Arabic text and English translation.
4. "actionItems": An array of 3 practical, actionable tips for the student to integrate into their daily habit or learning journey.

Provide your response in raw JSON format matching this schema strictly. Don't add backticks or markdown wrapper.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            scholars: { type: Type.STRING },
            verses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  translation: { type: Type.STRING }
                },
                required: ["text", "translation"]
              }
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["answer", "scholars", "verses", "actionItems"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.warn("Using offline scholastic fallback:", error.message);
    const trigger = question.toLowerCase();
    let selected = offlineFallbacks.default;
    if (trigger.includes("prayer") || trigger.includes("salah") || trigger.includes("namaz")) {
      selected = offlineFallbacks.prayer;
    }
    res.json(selected);
  }
});

// REST Endpoint: Dynamic custom Supplication (Dua) creator
app.post("/api/dua-planner", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Please submit a topic for your Dua planner." });
  }

  // Purely dynamic simulated response fallback
  const fallbackDuas: { [key: string]: any } = {
    "studies": {
      topic: "Academic Concentration & beneficial studies",
      arabicText: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا",
      transliteration: "Allahumma-nfa'ni bima 'allamtani wal-'allimni ma yanfa'uni wa zidni 'ilman",
      translation: "O Allah, benefit me with that which You have taught me, and teach me that which will benefit me, and increase me in robust knowledge.",
      context: "This prayer is sourced from the certified traditions of Prophet Muhammad (peace be upon him). It teaches students to prioritize knowledge that converts into beneficial, practical works (Ilm Naafi) rather than merely prideful or idle theories."
    },
    "default": {
      topic: topic,
      arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
      translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
      context: "Known as the most comprehensive supplication from Surah Al-Baqarah (verse 201), seeking balanced spiritual nourishment, academic excellence, fine character, and eternal safety."
    }
  };

  try {
    const ai = getAI();
    const prompt = `Compose an authentic custom Quranic/prophetic style Supplication (Dua) for a student seeking divine guidance regarding this specific intention: "${topic}".
Create:
1. "topic": A title of this intention
2. "arabicText": The beautiful Arabic script of the supplication WITH complete vowels (tashkeel/harakat)
3. "transliteration": Pronunciation transcriptor in English
4. "translation": Precise translation in English
5. "context": The spiritual significance and advice on when this supplication is best made.

Provide your response in raw JSON format matching this schema strictly. Don't add backticks or markdown wrapper.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            arabicText: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            translation: { type: Type.STRING },
            context: { type: Type.STRING }
          },
          required: ["topic", "arabicText", "transliteration", "translation", "context"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (err: any) {
    console.warn("Using offline Dua fallback:", err.message);
    const trigger = topic.toLowerCase();
    let selected = fallbackDuas.default;
    if (trigger.includes("study") || trigger.includes("exam") || trigger.includes("knowledge") || trigger.includes("class")) {
      selected = fallbackDuas.studies;
    }
    res.json(selected);
  }
});

// Serve API check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date() });
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app._router.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ilm Naafi full-stack app running on http://localhost:${PORT}`);
  });
}

startServer();
