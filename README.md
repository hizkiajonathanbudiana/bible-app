# 📖 Bible Reader App (Mandarin Learning Tool)

A modern, full-featured Bible reading application designed to help users learn Traditional Chinese (Taiwan) through scripture. This application bridges the gap between language learning and spiritual study by integrating real-time Pinyin generation, native text-to-speech audio, and an interactive dictionary.

## ✨ Key Features

### 📚 Reading Experience
-   **Multi-Language Support:** Seamlessly read verses in Traditional Chinese (Taiwan) alongside English and Indonesian translations.
-   **Smart Layout:** "Flowing text" design that mimics natural reading while keeping interactive elements accessible.
-   **Visual Aids:** Toggleable Pinyin guides above Chinese characters to assist with pronunciation.

### 🎧 Audio & Accessibility
-   **Granular Playback Control:**
    -   **Chapter Level:** Listen to the entire chapter continuously.
    -   **Verse Level:** Play audio for specific verses.
    -   **Word Level:** Click any word to hear its individual pronunciation.
-   **Speed Control:** Adjustable playback speed (0.1x - 2.0x) for language learners.
-   **Voice Selection:** Choose between available browser voices (e.g., Taiwan/Mainland accents).

### 🧠 Interactive Learning
-   **Smart Popup:** Click any Chinese word to view:
    -   Pinyin (with tone marks).
    -   Main translation.
    -   Detailed definitions (Noun, Verb, Adjective) fetched via Dictionary API.
-   **Vocabulary Management:** Save words to a personal "Favorites" list.
-   **Review System:** Users can edit definitions manually or auto-fetch updated meanings for their saved words.

### 🛡️ Admin CMS
-   **Content Management:** Secure admin dashboard for uploading Bible chapters.
-   **Smart Parsing:** Auto-detects verse numbers and splits text automatically (no manual formatting required).
-   **Auto-Pinyin Titles:** Automatically generates Pinyin for book titles upon upload.
-   **Database Management:** Ability to delete books and clear related data cleanly.

## 🛠 Tech Stack

-   **Frontend:** [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore NoSQL & Authentication)
-   **Authentication:** Firebase Auth (Google & Email/Password)
-   **Audio Engine:** Web Speech API (Native Browser TTS)
-   **Linguistics:** `pinyin` library & `Intl.Segmenter` for Chinese word segmentation.

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/bible-reader-app.git](https://github.com/your-username/bible-reader-app.git)
cd bible-reader-app