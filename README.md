# 🚀 CodePath (CodeKaro) — Full-Stack Interactive Coding Platform & Security Sandbox

Welcome to **CodePath**! This is a modern, gamified web application designed to help developers master Data Structures & Algorithms (DSA), practice coding in an interactive sandbox, test their knowledge with quizzes, and learn real-world web security with a live **Web Application Firewall (WAF)** dashboard.

---

## 📁 Complete File & Folder Structure

```text
codekaro/
├── 📁 api/
│   └── index.js             # Vercel serverless API entry point
├── 📁 public/
│   ├── favicon.svg          # Browser tab icon
│   └── icons.svg            # SVG icon sprite sheet for UI graphics
├── 📁 src/
│   ├── 📁 assets/
│   │   ├── hero.png         # Main dashboard hero illustration
│   │   ├── react.svg        # React logo
│   │   └── vite.svg         # Vite logo
│   ├── App.css              # Custom styling, dark mode theme & animations
│   ├── App.jsx              # Main frontend application (all views & UI logic)
│   ├── data.js              # Knowledge base: DSA topics, questions, quizzes & packs
│   ├── index.css            # Global typography, CSS variables & reset styles
│   └── main.jsx             # React DOM root entry point
├── 📁 dist/                 # Production-ready compiled build output
├── .gitignore               # Files and folders to exclude from Git (e.g., node_modules)
├── .oxlintrc.json           # Linter configuration for clean code quality
├── index.html               # Main HTML entry file for the browser
├── package.json             # Project metadata, dependencies and run scripts
├── package-lock.json        # Exact dependency version lockfile
├── server.js                # Express backend server with security firewall & code runner
├── vercel.json              # Vercel cloud deployment & API routing rules
├── vite.config.js           # Vite development server, port, host & proxy configuration
└── README.md                # Project documentation and guide (this file)
```

---

## 📖 What Each File & Folder Does (Humanized Explanation)

### 🧠 Backend & Security Core

* **`server.js` (The Backend Brain & Security Guard)**
  * Runs an **Express** web server on port `8000`.
  * **Built-in Web Application Firewall (WAF):** Automatically inspects incoming network traffic, blocks dangerous SQL injection and XSS patterns, limits requests to prevent spam (120 req/min rate limiter), and logs security events in real-time.
  * **Secure Code Execution Sandbox:** Runs submitted JavaScript code inside a sandboxed `Node.js vm` container with an execution timeout to safely capture output without risking server crashes.
  * **User Authentication & Progress Sync:** Handles user registration, login, and syncs XP, coins, and solved questions.

* **`api/index.js` (The Cloud Bridge for Vercel)**
  * Imports the Express server from `server.js` and exports it as a **Vercel Serverless Function**.
  * This allows the entire backend API (`/api/compile`, `/api/firewall/*`, `/api/auth/*`) to run in the cloud without needing a dedicated 24/7 server.

* **`vercel.json` (Cloud Routing Instructions)**
  * Tells Vercel how to route network traffic: any request starting with `/api/` is sent straight to the serverless backend, while all other requests serve the React frontend SPA.

---

### 🎨 Frontend & User Experience (`src/`)

* **`src/App.jsx` (The Main Interactive Interface)**
  * The heart of the frontend application. It manages all tabs and features:
    1. **Dashboard:** Displays user level, streak, XP progress, daily problem, and quick stats.
    2. **Learn DSA:** Topic-by-topic breakdowns (Arrays, Linked Lists, Trees, Dynamic Programming, Graphs) with theory, visual diagrams, and code snippets.
    3. **Code Playground:** A live in-browser code editor where users can write, run, and test code across multiple languages.
    4. **Quiz Arena:** Interactive multiple-choice tests with instant scoring and explanations.
    5. **Gamified Store:** Redeem earned coins for profile badges, editor themes, and company interview packs.
    6. **Live Firewall Monitor:** A real-time visual dashboard showing active WAF rules, total requests, blocked attacks, and live security audit logs.
    7. **Settings & Profile:** Customize username, preferences, and view earned badges.

* **`src/data.js` (The Curriculum & Knowledge Base)**
  * Stores all educational content in structured JSON:
    * Detailed DSA topics and theory notes.
    * 50+ curated coding problems categorized by difficulty (Easy, Medium, Hard).
    * Interview quiz questions with explanations.
    * Company-specific question packs (Google, Amazon, Microsoft, Meta).

* **`src/App.css` & `src/index.css` (Visual Design & Theme)**
  * Provides a modern **dark-mode cyberpunk aesthetic**.
  * Contains styling for code editors, glowing status badges, cards, buttons, modals, and responsive mobile layouts.

* **`src/main.jsx` & `index.html` (Application Launchers)**
  * `index.html` is the foundational web page loaded by the browser.
  * `main.jsx` mounts the React application into the DOM root element.

* **`src/assets/` & `public/` (Graphics & Icons)**
  * Contains hero illustrations, SVGs, favicon, and graphical icons used across the navigation bar and buttons.

---

### ⚙️ Build & Configuration Files

* **`vite.config.js` (Development Server Config)**
  * Configures Vite to run on **port 3000**.
  * Enables `--host` so you can test the app on your mobile phone over Wi-Fi.
  * Proxies `/api` requests directly to `http://localhost:8000` during local development to avoid CORS issues.

* **`package.json` (Project Manifest & Scripts)**
  * Defines project libraries:
    * `react` & `react-dom` — Frontend UI framework.
    * `lucide-react` — Clean, modern iconography.
    * `express` & `cors` — Backend web framework and Cross-Origin Resource Sharing.
    * `vite` — Lightning-fast development server and production bundler.

* **`dist/` (Production Build Output)**
  * The optimized, minified JavaScript and CSS files created when you run `npm run build`, ready for static hosting.

---

## ⚡ How to Run Locally

### 1. Start the Backend Server (Port 8000):
```powershell
node server.js
```

### 2. Start the Frontend Dev Server (Port 3000):
```powershell
npm run dev
```

### 3. Open in Your Browser:
* **Local Machine:** `http://localhost:3000/`
* **Mobile / Other Devices on Same Wi-Fi:** `http://<your-local-ip>:3000/`

---

## ☁️ How to Deploy to Vercel (1-Click)

1. Push the code to your GitHub repository.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. Keep default settings and click **"Deploy"**.
4. Both the React frontend and serverless backend will go live instantly on a free `.vercel.app` URL!

---

*Crafted with ❤️ for developers learning DSA, coding, and web security.*
