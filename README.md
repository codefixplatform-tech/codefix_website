# CodeFix: The Ultimate Neural Utility Ecosystem

**CodeFix** is a high-fidelity, all-in-one platform engineered for modern developers and power users. It seamlessly integrates professional file conversion engines, an elite developer utility suite, a community-driven Q&A hub, and a Gemini-powered AI co-pilot into a single, high-performance workspace.

---

## 🌟 Comprehensive Feature Suite

### 1. 📄 Hybrid File Conversion Engine
An advanced, dual-layer conversion architecture engineered for both privacy and enterprise-grade fidelity.

- **Cloud-Powered Engine (Google Drive API v4)**: For complex Office formats, CodeFix securely routes files to a custom **Google Apps Script API**.
  - **High-Fidelity**: Perfect layout preservation for `Word ↔ PDF`, `Excel ↔ PDF`, `PPTX ↔ PDF`, and `PDF ↔ Excel`.
  - **CORS-Safe Architecture**: Uses a robust `URLSearchParams` payload to bypass strict browser preflight (`OPTIONS`) limitations, ensuring a 100% stable connection.
  - **Auto-Cleanup**: Temporary conversion assets are instantly purged from the cloud, ensuring data sovereignty.
- **Local Processing Engine (Zero-Server Architecture)**: Processes files entirely within your browser ensuring absolute data privacy.
  - **Merge PDF**: Combine multiple PDF files seamlessly with drag-and-drop reordering.
  - **Split PDF**: Extract specific pages or divide a PDF into multiple documents.
  - **Compress PDF**: Aggressive yet intelligent size reduction while preserving visual quality.
  - **Image to PDF**: Convert various image formats into high-quality PDF documents.

### 2. 💻 Developer Neural Suite
A state-of-the-art toolkit designed to streamline day-to-day coding and network tasks.
- **JSON Formatter & Validator**: Instantly prettify, minify, and validate complex JSON payloads with syntax highlighting.
- **Base64 Engine**: Fast, secure text and binary data encoding/decoding without sending data to external servers.
- **Regex Engine**: Real-time regular expression pattern testing and matching.
- **API Terminal**: Integrated HTTP client to test API endpoints (GET, POST, PUT, DELETE) directly from the browser.
- **Unit & Value Converter**: Developer-centric mathematical conversions including PX to REM, HEX to RGB, and HSL manipulation.
- **Secret & Key Generator**: Cryptographically secure local generation of high-entropy Passwords, API Keys, and UUIDs.

### 3. 🤖 DevIntel AI Engine
Your personal technical architect, powered by the latest Generative AI models.
- **Context-Aware Assistance**: Ask complex programming questions, debug snippets, or explore documentation.
- **Seamless Integration**: Operates as a responsive sidebar module with persistent chat history across your workflow.
- **Code Highlighting & Formatting**: Understands markdown and renders complex code blocks flawlessly.

### 4. 🤝 Community QA Hub
A dedicated ecosystem for developers to collaborate and solve problems.
- **Interactive Forum**: Post technical challenges, share solutions, and engage in deeply threaded discussions.
- **Knowledge Sharing**: Verified answers, community voting, and real-time interaction.
- **Unified Activity Tracking**: Monitor your questions, answers, and platform contributions through a personalized dashboard.

### 5. 📊 Personalized Dashboard & Secure Auth
A unified command center for authenticated users.
- **Enterprise-Grade Security**: Password and session management handled by secure backend providers like Supabase.
- **Profile Management**: Customize account preferences, avatars, and application themes.
- **Activity Monitoring**: Keep track of your conversion history, recent tools used, and community engagement.

---

## 🎨 Premium Design Language
CodeFix is built with a **Premium Glassmorphic UI** to deliver a visually stunning experience:
- **Immersive Aesthetics**: Deep backdrop blurs, subtle glowing gradients, and polished glassmorphism.
- **Fluid Neural Motion**: Silky smooth page transitions, hover effects, and layout animations powered by Framer Motion.
- **Responsive Adaptive Grid**: Flawless functionality across desktops, tablets, and mobile devices.
- **Dark Mode Optimization**: Carefully curated dark-mode palettes that reduce eye strain while maintaining vibrant neural accents.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite |
| **Styling & Animation**| Tailwind CSS 4, Framer Motion, Lucide Icons, React Icons |
| **Routing** | React Router DOM v7 |
| **Backend & Database** | Supabase (PostgreSQL, Authentication, Storage) |
| **AI Integration** | Google Generative AI SDK |
| **Document Processing**| pdf-lib, pdfjs-dist, docx, jspdf, xlsx, pptxgenjs, html2canvas |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Step-by-Step Installation

#### Step 1: Clone & Install
Clone the project repository and install the required dependencies.
```bash
git clone https://github.com/your-username/codefix.git
cd codefix
npm install
```

#### Step 2: Database Setup (Supabase)
CodeFix relies on Supabase for Authentication, User Dashboards, and Community Q&A.
1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open the `schema.sql` file provided in the supabse folder of this project.
4. Copy the entire contents of `schema.sql` and run it in the Supabase SQL Editor. This will automatically create all necessary tables (`profiles`, `posts`, `answers`, etc.), set up Row Level Security (RLS) policies, and initialize database functions.

#### Step 3: Environment Configuration
Create a `.env` file in the root directory and add your specific API keys:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Integration
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

#### Step 4: Cloud Conversion Engine Setup (Google Apps Script)
To enable high-fidelity Office document conversions (Word, Excel, PPTX):
1. Go to [Google Apps Script](https://script.google.com/) and create a new project.
2. In the left sidebar, click `+` next to **Services** and add the **Drive API** (v3).
3. Open the `google-apps-script` folder in this repository.
4. Replace the default `Code.gs` and `appsscript.json` in your Google project with the ones provided in that folder.
5. Deploy as a **Web App** (Execute as: Me, Access: Anyone).
6. Copy the generated Web App URL and update the `CONVERSION_API_URL` variable in `src/pages/Coonverter tools/FileUpload.jsx`.

#### Step 5: Launch the Application
Start the Vite development server.
```bash
npm run dev
```

---

## 📂 System Architecture Overview

- `src/components/` : Reusable UI components, AI Chat layouts, and protected route wrappers.
- `src/pages/` : Core application pages separated by domain (Auth, Dashboard, Dev Tools, Converter Tools, QA).
- `src/layouts/` : Structural layout wrappers (LandingLayout, DashboardLayout) managing navbars and sidebars.
- `src/lib/` : Third-party service initializations (e.g., Supabase client).
- `src/utils/` : Heavy-lifting utility functions and local PDF processing scripts.
- `google-apps-script/` : Backend code for the Cloud Conversion Engine (API).

---

## 🛡️ Privacy & Security Architecture

- **Data Sovereignty**: Tools marked as "Local Processing" execute entirely within your browser's memory. No files are transmitted.
- **Cloud API Security**: External conversion APIs process files ephemerally. 
- **Authentication**: End-to-end encrypted sessions and secure token management.
- **State Isolation**: User activities and generated secrets are not persistently logged unless explicitly saved to the database.

---

**Engineered with Precision and Excellence**
