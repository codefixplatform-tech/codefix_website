# 🚀 CodeFix - Ultimate Developer Toolbox & Community Platform

CodeFix is a premium, high-performance ecosystem designed for modern developers. It seamlessly integrates a robust suite of developer utilities, high-fidelity file converters, a vibrant Q&A community, and a Gemini-powered AI assistant into a single, sleek dashboard.

🌐 **Live Demo:** [https://codefix-website-iota.vercel.app/](https://codefix-website-iota.vercel.app/)

![CodeFix Banner](https://via.placeholder.com/1200x400?text=CodeFix+Platform+Dashboard)

## ✨ Core Ecosystem

### 🛠️ 1. Developer Utilities (Dev Tools)
A collection of essential tools optimized for speed and accuracy:
- **JSON Formatter & Validator:** Instantly prettify, minify, and validate JSON data with real-time syntax checking.
- **Base64 Master:** Securely encode and decode text or images to/from Base64 strings.
- **Regex Lab:** Advanced regular expression testing with live matches and group highlighting.
- **API Playground:** A lightweight browser-based client to test GET, POST, PUT, and DELETE requests with header inspection.

### 📄 2. Premium Converter Suite
Enterprise-grade document processing utilities:
- **High-Fidelity PDF ↔ Word:** Convert documents while maintaining complex layouts and formatting.
- **Smart PDF Compression:** Reduce file sizes significantly without compromising visual clarity.
- **Excel to PDF:** Professional multi-sheet Excel conversion with automatic page adjustments.
- **PDF Power Tools:** Merge multiple documents, split specific page ranges, or convert batches of images into a single PDF.

### 🌐 3. Community Q&A Hub
A knowledge-sharing platform built for growth:
- **Smart Posting:** Ask questions using a rich Markdown editor with full code snippet support.
- **Reputation System:** Earn points through verified answers and community upvotes.
- **Interactive Voting:** Upvote or downvote solutions to highlight the most helpful content.
- **Global Discovery:** Find solutions instantly using the integrated cross-platform search engine.

### 🤖 4. AI Assistant (Gemini Powered)
Your personal 24/7 technical co-pilot:
- **Code Debugging:** Paste your bugs and get instant refactoring suggestions and fixes.
- **Persistent Memory:** Your chat history is saved securely in Supabase for future reference.
- **AI Credits:** Integrated credit system to manage high-performance model usage.

### 📊 5. Developer Dashboard
Personalized command center to manage your developer identity:
- **Activity Tracking:** Monitor your posted questions, replies, and reputation growth.
- **Account Security:** Full profile management, including avatar uploads, location settings, and password encryption.
- **Quick Launch:** One-click access to your most-used utilities.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS 4.0, Framer Motion
- **Backend:** Supabase (Auth, PostgreSQL, Storage, Real-time)
- **AI Engine:** Google Gemini API
- **Document Logic:** pdf-lib, jsPDF, mammoth.js, ExcelJS
- **State Management:** React Context API, React Router 7

---

## 🏗️ Supabase Database Setup

CodeFix uses a centralized PostgreSQL schema. All table definitions, indexes, and constraints are documented here:

👉 **[supabase/schema.sql](./supabase/schema.sql)**

### Key Tables:
1. `profiles`: Extended user data and developer stats.
2. `questions`: Community posts and metadata.
3. `answers`: Solutions linked to questions.
4. `votes`: User interactions and quality control.
5. `chats`: AI session persistence.

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- A Supabase project
- A Google AI (Gemini) API Key

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/codefix.git
cd codefix
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root and add your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to see the platform in action.

---

## 📁 Project Architecture

```text
codefix/
├── src/
│   ├── components/       # Atomic UI components (AI, Dashboard, Search)
│   ├── layouts/          # Dashboard (Sidebar/Topbar) & Public Layouts
│   ├── pages/            # Feature-rich pages (Dev Tools, Converters, QA)
│   ├── lib/              # SDK Initializations (Supabase, etc.)
│   ├── utils/            # Core logic (AI services, File converters)
│   └── main.jsx          # Entry point
├── supabase/             # SQL Schema & Migrations
└── public/               # Global static assets
```

---

## 📜 License & Contribution

Distributed under the MIT License. Contributions are welcome to help make CodeFix the best tool for the community.

**Built with ❤️ by Developers, for Developers.**
