# 🚀 CodeFix - Ultimate Developer Toolbox & Community Platform

CodeFix is a high-performance, all-in-one platform designed for developers. It combines essential developer utilities, high-fidelity file converters (PDF/Word/Images), and a vibrant Q&A community with an integrated AI assistant.

![CodeFix Banner](https://via.placeholder.com/1200x400?text=CodeFix+Platform)

## ✨ Key Features

### 🛠️ Developer Tools (Dev Tools)
A suite of modular, high-speed utilities for daily development tasks:
- **JSON Formatter:** Prettify, minify, and validate JSON with live sync.
- **Base64 Converter:** Secure encode/decode for text and images.
- **Regex Tester:** Real-time regular expression testing with highlighting.
- **API Tester:** Send HTTP requests (GET, POST, etc.) and inspect responses directly from the browser.

### 📄 Converter Tools
Premium file processing and conversion utilities:
- **PDF to Word:** High-fidelity conversion preserving layouts.
- **Word to PDF:** Fast and accurate document transformation.
- **Merge/Split PDF:** Combine multiple PDFs or extract specific pages.
- **Image to PDF:** Convert various image formats into a single PDF document.
- **Compress PDF:** Optimized compression to reduce file size without losing quality.

### 🌐 Global Features
- **Global Search:** Unified search bar indexed across all tools, community questions, and platform pages.
- **Q&A Community:** Robust platform for developers to ask questions, share answers, and build a collective knowledge base.
- **AI Assistant:** Integrated AI chatbot to help debug code and answer technical queries.
- **Smart Dashboard:** Personalized area to track activity, manage profile settings, and access tools quickly.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion (Animations).
- **Backend/Database:** Supabase (PostgreSQL, Auth, Real-time).
- **Storage:** Supabase Storage (for avatars and temporary files).
- **Icons:** React Icons (FontAwesome 6, Lucide, Hippo).
- **Notifications:** React Hot Toast.

---

## 🏗️ Supabase Database Schema

The platform relies on the following PostgreSQL table structure in Supabase:

### 1. `profiles`
Stores extended user information linked to Supabase Auth.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Reference to `auth.users` |
| `full_name` | text | User's display name |
| `avatar_url` | text | URL to profile picture in storage |
| `bio` | text | Short user description |
| `website` | text | Personal website link |
| `github_username` | text | Github profile reference |
| `created_at` | timestamp | Registration date |

### 2. `questions`
Stores community Q&A posts.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Unique question ID |
| `user_id` | uuid (FK) | Reference to `profiles.id` |
| `title` | text | Question heading |
| `content` | text | Detailed description / Code snippets |
| `tags` | text[] | Array of related technology tags |
| `created_at` | timestamp | Time of posting |

### 3. `answers`
Stores replies to community questions.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Unique answer ID |
| `question_id` | uuid (FK) | Reference to `questions.id` |
| `user_id` | uuid (FK) | Reference to `profiles.id` |
| `content` | text | Answer detail |
| `created_at` | timestamp | Time of posting |

### 4. `chats`
Stores AI Assistant conversation history.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Unique chat ID |
| `user_id` | uuid (FK) | Reference to `profiles.id` |
| `title` | text | Chat session name |
| `history` | jsonb | Full conversation array |
| `created_at` | timestamp | Session start time |

---

## 🚀 Installation & Setup

Follow these steps to run CodeFix locally:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/codefix.git
cd codefix
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
codefix/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Dev Tools/    # Modular developer utilities
│   │   └── LandingPage/  # Global Navbar/Footer/Home
│   ├── pages/            # Page-level components
│   │   ├── Dev Tools/    # Tool processing pages
│   │   ├── Coonverter tools/ # Conversion pages
│   │   └── Dashboard/    # User management
│   ├── layouts/          # Dashboard & Landing layouts
│   ├── lib/              # Supabase configuration
│   └── utils/            # Core processing logic & AI services
├── public/               # Static assets (logo, etc.)
└── README.md
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for the Developer Community.**
