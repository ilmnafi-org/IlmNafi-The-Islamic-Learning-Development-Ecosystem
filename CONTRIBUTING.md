# Contributing to Nafi 🤝

First of all, thank you for your willingness to help build Nafi! By contributing to this codebase, you are directly assisting in the standardization and accessibility of Quranic scientific education, Tajweed rules, and spiritual aids.

We welcome contributions from **software engineers, web design visual artists, native Arabic linguists, Quranic teachers, and academic researchers**.

---

## 🛠️ Codebase Guidelines & Development Lifecycle

Nafi is managed as a structured React + TypeScript platform.
1.  **Code Syntax**: Clean, functional TypeScript components. Avoid untyped variables (`any`).
2.  **State Management**: Use lightweight hooks.
3.  **Visual Styling**: Direct inline Tailwind utility classes. Maintain the balanced, high-contrast, eye-safe **Gilded Slate Theme**.

### Setting Up Locally
```bash
# Clone the repository (or fork)
git clone https://github.com/nafi-org/nafi-platform.git
cd nafi-platform

# Install dependencies safely
npm install

# Run the local development server (binds automatically to port 3000)
npm run dev
```

---

## 🎙️ The Tajweed Rule Engine (JSON Schemas)

Core parsing algorithms map segments of Arabic Unicode sequences to linguistic outcomes. 

### 1. Unified JSON Rule Schema
To assist in rule validation across the `web`, `mobile`, and `tajweed-engine` apps, here is the standardized JSON record schema. This must be populated by contributors for new letter associations:

```json
{
  "rule_id": "rule_noon_sakinah_ikhfa_01",
  "name_ar": "إخفاء حقيقي",
  "name_en": "Ikhfa' Haqiqi",
  "category": "Noon Sakinah & Tanween",
  "triggers": ["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"],
  "phonetic_description": "Slight hiding of the nasal sound (Noon) inside the following consonant with a 2-radian/beat ghunnah.",
  "examples": [
    {
      "arabic": "مِن دُونِ",
      "transliteration": "Min dooni",
      "surah_ayah": "2:23"
    }
  ]
}
```

---

## 🧪 Testing Guidelines

Safety of Quranic delivery is paramount. We do not merge pull requests that break transcription accuracy.

1.  **Unit Tests**: All spelling/Unicode parsers inside `services/tajweed-engine/` must have associated test matrices.
2.  **Snapshot Testing**: Compare the generated parsed output of standard passages (e.g., *Surah Al-Fatiha*, *Ayat Al-Kursi*) with official verified spelling records.
3.  **Run Tests Locally**:
    ```bash
    npm run test
    ```

---

## 🕌 Scholar Review Process & Lajnah Panel Guidelines

To guard the sanctity of Quranic sciences, Nafi introduces a strict **Lajnah (Scholar Review Panel)** loop for any modification to Tajweed transcription sets or Tajweed Rule JSON definitions:

1.  **Submission**: A contributor submits a Pull Request specifying a JSON rule dataset update or spelling transcription update.
2.  **Linguistic QA**: Continuous integration pipelines execute checking scripts to verify correct character sequences.
3.  **Scholar Verification**: Two or more certified Lajnah board members (teachers with verified Isnaad) must physically review, evaluate, and digitally sign off on the phonetic descriptions and examples under the admin panel.
4.  **Publishing**: The verified JSON artifact is signed and packaged into the core NPM registry package of `@nafi-org/translations`.

---

## 📬 Pull Request Checklist

Before submitting a Pull Request, please ensure you satisfy the following checklist:
- [ ] Your code passes linter audits (`npm run lint` completes green without errors).
- [ ] Code compilers succeed (`npm run build` succeeds cleanly).
- [ ] Any script logic has corresponding tests.
- [ ] You did not commit any sensitive API keys or personal variables (secrets are strictly verified via `.env.example`).
- [ ] For Tajweed rules updates, the formatting strictly adheres to the JSON schema.
