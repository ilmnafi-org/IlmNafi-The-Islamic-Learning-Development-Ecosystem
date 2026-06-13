# Nafi Platform 📖

> **A Unified Traditional & AI-Supported Open-Source Academy for Quranic Science**

Nafi Platform is an open-source, global academic ecosystem engineered to make traditional Quranic sciences, authentic Adhkar recitation, Pronunciation (Makharij), and Tajweed education dynamically accessible and verifiable using cutting-edge audio processing, rule engines, and community-driven verification.

Nafi leverages an interactive frontend, smart linguistic analysis, and a structured database of authentic texts to produce a masterfully crafted, eye-safe learning companion.

---

## 🏛️ Open-Source Path & Organization

To foster a vibrant community of **developers, Arabic linguists, Quran teachers, and researchers**, the Nafi project is structured as a dedicated decentralized github organization: **[github.com/nafi-org](https://github.com/nafi-org)**. 

### Core Repositories
*   **`nafi-platform`**: The central monorepo hosting the student portal, course administrator suite, and core API connectors.
*   **`tajweed-engine`**: A specialized linguistic processing library and rule validator that parses Arabic texts to flag specific Tajweed characteristics (Madd, Ghunnah, Ikhfa, etc.).
*   **`adhkar-service`**: Microservice hosting the authentic step-through daily protective remembrances database, complete with audio pronunciations, counters, and translations (English, Arabic, Urdu, Hausa) based on *Hisnul Muslim*.

---

## 📁 Recommended Codebase Structure

We employ a robust, production-grade monorepo structure for maximum component sharing and consistent deployment:

```text
nafi/
├── apps/
│   ├── web/                    # Next.js / Vite React Interactive Student Portal
│   ├── mobile/                 # React Native / Flutter Cross-Platform Study App
│   └── admin/                  # Scholarship, User Registry, and Scholar Review Dashboard
│
├── services/
│   ├── tajweed-engine/         # Rust/TypeScript core Tajweed linguistic validator & rule output
│   ├── scholarship-service/    # Academic registry & sponsorship matching engine
│   ├── adhkar-service/         # Audio delivery, step-through remembrance tracking microservice
│   └── auth-service/           # Decentralized OAuth & secure user roles verification
│
├── packages/
│   ├── ui/                     # Shared polished Tailwind component catalog (Gilded Theme)
│   ├── shared/                 # Core domain models, TypeScript interfaces, and schemas
│   └── translations/           # Central localization registry (Arabic, English, Urdu, Hausa)
│
└── docs/                       # High-level architecture, research papers, and guides
```

---

## 🎙️ The Tajweed & Pronunciation Engine

The heart of Nafi's educational credibility is the **Tajweed Engine**. Rather than relying completely on black-box neural networks, the platform combines deterministic spelling parser algorithms with standard speech-path modeling:

```mermaid
[Spelling / Unicode Parser] ➔ [Tajweed Grapheme Rule Matcher] ➔ [Scholar Review Dashboard] ➔ [Verified Master JSON]
```

### 1. Unified Rule Definitions
Rules are written in structured, language-independent configurations:
*   **Noon Sakinah & Tanween**: (Ith-har, Idghaam, Iqlab, Ikhfa').
*   **Meem Sakinah**: (Ikhfa' Shafawi, Idghaam Shafawi, Ith-har Shafawi).
*   **Madd (Lengthening)**: (Madd Tabi'ee, Muttasil, Munfasil, Laazim, 'Arid).

### 2. Scholar Review Process (Isnaad & Verification)
To preserve the sacred trust of Quranic transmission, every rule change or parsed transcription undergoes a strict **Scholar Review Loop**:
1.  **Linguistic Parsing**: Automated scripts parse rule sets or phonemes.
2.  **QA Evaluation**: Unit test batteries check phonetic constraints.
3.  **Lajnah Panel Auditing**: Certified scholars view pending updates through the `/admin` portal, verifying and officially signing off on rules.
4.  **Cryptographic Seal**: Verified datasets are compiled into production-ready JSON and distributed.

---

## 🚀 Launch Strategy & Roadmap

Join us on our journey to democratize Quranic knowledge. Our complete launch sequence consists of:

1.  **Launch the GitHub Organization**: Mapping out the repository boundaries on `github.com/nafi-org`.
2.  **Open Source the Tajweed Engine**: Releasing the parser along with initial test scripts.
3.  **Publish the Documentation Site**: Detailing makhraj articulation guides and scholarship guidelines.
4.  **Vercel & Cloud Run Stable Deployment**: Continuous delivery pipelines for student testing environments.
5.  **GitHub Student Developer Pack**: Applying for resources to support student development challenges and hackathons.
6.  **Community Discord Server**: Launching a server to connect scholars, teachers, linguists, and developers.
7.  **Public Project Board / Roadmap**: Tracking tasks and milestones transparently.
8.  **Contributor Onboarding Guide**: Making first-time contributions simple and welcoming.

---

## 🔒 Production Security, Idempotency, and Metrics

Nafi Platform values robust data integrity and user identity defenses. The following items have been configured for production:
*   **Secure API Rate Limiting**: Our zero-dependency, in-memory rate-limiting middleware blocks excessive or fast-repeating request spikes on sensitive interfaces (signup, login, and Gemini AI Coach).
*   **Idempotency Guards**: Support for standard `x-idempotency-key` requests has been implemented in student forums, ensuring duplicative forum posts or replies never bypass the parser.
*   **Credential Hashing & JWT Scope**: Stored passwords undergo custom salt key cryptographic encoding, and authenticated sessions are handled using secure, client-scope `HttpOnly` cookie stores.
*   **Privacy & Legal Charters**: Full interactive charters for GDPR-compliant Privacy Policies, Terms of Service, and Academic Integrity codes are accessible via the platform footer, in both English and Arabic.
*   **Performance Monitoring & Insights**: Fully integrated lightweight CDN tracking hooks for **Vercel Web Analytics** and **Vercel Speed Insights** are injected inside `index.html`.
*   **Focal Security Enquiries Contact**: For safety or deletion inquiries, contact our chief security engineer at **apatirasulayman@gmail.com**.

---

## 🤝 Contribution Documents

Please review our supplementary files to start contributing:
*   See **`CONTRIBUTING.md`** for developer guidelines, rule schema setups, and pull request testing.
*   See **`CODE_OF_CONDUCT.md`** for our community standard covenants.
*   See **`ROADMAP.md`** for the full step-by-step active release plan.
*   See **`LICENSE`** for terms of usage (Apache License 2.0).

---

*“Whoever treads a path in search of knowledge, Allah will make easy for him the path to Paradise.”* (Sahih Muslim 2699)*
