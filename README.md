# 🚀 CodeFix: The Neural Developer Ecosystem

**CodeFix** is a high-fidelity, premium platform engineered for modern developers. It combines elite developer utilities, enterprise-grade file converters, a vibrant community Q&A hub, and a Gemini-powered AI co-pilot into one seamless, glassmorphic experience.

---

## 💎 Premium Design Language
CodeFix isn't just a tool; it's a visual experience.
- **Glassmorphic UI**: Ultra-modern interface using `backdrop-blur-xl` and deep shadows for a high-end feel.
- **Framer Motion Orchestration**: Silky smooth transitions and layout animations across every interaction.
- **Neural Workspace**: Responsive workspaces for PDF management (Merge/Split) optimized for touch and desktop.
- **ChatGPT-style AI Sidebar**: Intelligent responsive behavior—defaults to open on desktop, collapses on mobile.

---

## 🔥 Core Modules

### 🤖 1. DevIntel AI Engine (Gemini 1.5)
Your 24/7 technical architect.
- **Context-Aware Debugging**: Direct integration with Community Q&A to provide instant solutions to posted bugs.
- **Persistent Memory**: Chat sessions are encrypted and stored in Supabase for cross-device continuity.
- **Neural Core**: Powered by Google Gemini 1.5 for state-of-the-art code generation and logic analysis.

### 📄 2. Enterprise Converter Suite
100% Client-side processing. Your files never leave your browser.
- **PDF Powerhouse**: High-fidelity PDF to Word, Excel, PPTX, and Image conversions.
- **Advanced PDF Logic**: Merge multiple files with draggable reordering and split documents with live thumbnail previews.
- **Lossless Compression**: Aggressive size reduction using intelligent re-distillation without losing visual quality.

### 🛠️ 3. Developer Productivity Hub
Essential utilities for the modern workflow:
- **JSON & Base64 Labs**: High-performance formatting and encoding engines.
- **Regex Neural Tester**: Real-time pattern matching with group isolation.
- **API Playground**: Lightweight client for RESTful interaction testing.

### 🌐 4. Community Knowledge Engine
A decentralized knowledge hub with advanced data integrity.
- **Auto-Sync Voting**: Real-time reputation and vote tracking powered by PostgreSQL triggers and RPCs.
- **Markdown Mastery**: Rich text editing with integrated syntax highlighting for code sharing.
- **Global Search**: Platform-wide index for tools, discussions, and documentation.

---

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 18 (Vite) + Tailwind CSS 4.0
- **Animation**: Framer Motion
- **Database/Auth**: Supabase (PostgreSQL + RLS + Storage)
- **AI Integration**: Gemini SDK
- **File Processing**: PDF.js, PDF-Lib, ExcelJS, Mammoth.js

### Database Schema Highlights
CodeFix uses a robust PostgreSQL schema with advanced logic:
- **`profiles`**: Manages developer identity and reputation stats.
- **`questions` & `answers`**: Core community data with full RLS protection.
- **`votes`**: Integrated with a `sync_votes_count` trigger to ensure zero-latency data integrity.
- **`ai_chats`**: JSONB session persistence for AI interactions.

👉 See the full schema: [supabase/schema.sql](./supabase/schema.sql)

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/yourusername/codefix.git
cd codefix
npm install
```

### 2. Environment Variables
Create a `.env` file in the root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-api-key
```

### 3. Local Execution
```bash
npm run dev
```

---

## 🔐 Security & Privacy
- **Client-Side Processing**: PDF and file conversions happen entirely in the browser. No server-side file storage for temporary files.
- **Row Level Security (RLS)**: Every database interaction is validated against the user's authenticated session.
- **Privacy First**: Sensitive AI conversations are stored securely and accessible only to the session owner.

---

## 🤝 Contribution
CodeFix is built by the community. Feel free to submit PRs for new tools or UI enhancements.

**Built with ❤️ for the next generation of developers.**
