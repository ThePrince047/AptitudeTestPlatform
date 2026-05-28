# TCS NQT Preparation Portal & Mock Test Engine

A premium, state-of-the-art, dark-themed practice and mock exam portal for candidates preparing for the **TCS National Qualifier Test (NQT)**. Built with Vite, React, Vanilla CSS, and Lucide Icons, this single-page web application is fully self-contained, offline-compatible, and ready for deployment to platforms like Netlify.

---

## 🚀 Key Features

*   📊 **Interactive Dashboard**: Track your study progress, average test scores, overall accuracy, and saved bookmark counts.
*   📚 **Offline Question Bank**: **1,535 unique questions** compiled, structured, and deduplicated from official prep resources. Includes detailed step-by-step mathematical explanations.
*   ⚙️ **Mock Configurator**: Customize your mocks by selecting a specific topic or mixed syllabus, modifying question count and time limits, and toggling session modes.
*   🧠 **Two Practice Modes**:
    *   **Exam Mode**: Strict timed mock simulation. Answers are hidden until submission, progress is tracked, and a red countdown warning activates when under 5 minutes.
    *   **Practice Mode**: Learn as you go. View immediate checkmarks on option selection, read full step-by-step solutions per question, and proceed without a timer.
*   🎯 **Results Analytics**:
    *   Dynamic circular SVG progress indicator.
    *   Accordion-based review list filtering correct, incorrect, and skipped responses.
    *   "Bookmark" buttons to save challenging questions for future review.
*   📉 **History & Performance**: Visual SVG line charts representing score progression over time, alongside vertical progress meters representing topic strengths.
*   💾 **Saved Questions revision**: Browse bookmarked questions, review solutions, delete saved items, or launch a quick custom mock containing *only* your bookmarks.
*   🔮 **AI Mock Generator**:
    *   **API Mode**: Enter your Anthropic Claude API Key (securely saved in browser `localStorage`) to generate fresh, custom papers on any topic using Claude 3.5 Sonnet.
    *   **Local Simulator Fallback**: If no API key is supplied, a simulator dynamically shuffles and builds a realistic mock paper from the 1,535 offline questions immediately.
*   🚪 **Mid-Test Exit & Navigation**: Safely exit tests in progress using a styled confirmation modal to return to the dashboard.
*   📱 **High-Density Question Palette**: Sidebar navigation grid dynamically transitions from 5-columns to 8-columns or 10-columns for large question sets to prevent layout overflows.

---

## 📁 Project Structure

```
NQTMcq/
├── dist/                  # Production build output
├── public/                # Static assets
├── src/
│   ├── assets/            # SVG logos
│   ├── components/        # Modular UI components
│   │   ├── Dashboard.jsx  # Main hero stats and topic grid
│   │   ├── TestConfig.jsx # Test sliders and mode selection
│   │   ├── TestEngine.jsx # Test workspace (timer, sidebar grid, modals)
│   │   ├── ResultsView.jsx# Score SVG gauge and solution accordions
│   │   ├── AiPaper.jsx    # Claude API key input and NQT simulator
│   │   └── Analytics.jsx  # SVG trend charts and bookmarks manager
│   ├── data/
│   │   └── questionBank.js# The merged database of 1,535 NQT questions
│   ├── App.jsx            # Main app shell and state coordinator
│   ├── index.css          # Design system, glassmorphism, and color variables
│   └── main.jsx           # ReactDOM client mount point
├── index.html             # HTML5 template (optimized for SEO)
├── package.json           # Node configuration and script actions
└── vite.config.js         # Vite compiler configuration
```

---

## 📈 Question Bank Topics

The offline question bank contains **1,535 unique questions** categorized under 17 topics:

*   **Quantitative Aptitude**: 313 questions
*   **Logical Reasoning**: 79 questions
*   **Computer Networks**: 78 questions
*   **Verbal Ability**: 77 questions
*   **Programming Concepts**: 76 questions
*   **DBMS & SQL**: 76 questions
*   **Operating Systems**: 76 questions
*   **Data Structures & Algorithms (DSA)**: 76 questions
*   **Computer Fundamentals**: 76 questions
*   **Software Engineering**: 76 questions
*   **Web Technologies**: 76 questions
*   **Cloud Computing**: 76 questions
*   **Cybersecurity**: 76 questions
*   **AI & ML**: 76 questions
*   **Technical Concepts**: 76 questions
*   **System Design**: 76 questions
*   **General / Mixed**: 76 questions

---

## 🛠️ Local Installation & Development

To run this project locally, ensure you have [Node.js](https://nodejs.org/) installed:

1.  **Clone or navigate** to the project directory:
    ```bash
    cd d:/Projects/NQTMcq
    ```
2.  **Install dependencies** (Vite, React, Lucide Icons):
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  Open the local address in your browser (usually `http://localhost:5173/`).

---

## 🌐 Netlify Deployment

This website is a Single Page Application (SPA) with **no runtime server dependencies**. The 580 questions are compiled directly into the client-side JavaScript bundle, making it 100% compatible with static hosting platforms like Netlify.

### Option A: Manual Drag-and-Drop
1.  Compile the production build:
    ```bash
    npm run build
    ```
2.  Vite will generate a `dist/` folder.
3.  Drag and drop the `dist/` folder directly into the Netlify Dashboard.

### Option B: Git Integration (Continuous Deployment)
If you connect your repository to Netlify, set the following configuration values:
*   **Build Command**: `npm run build`
*   **Publish Directory**: `dist`
*   **Node Version**: `18+` or `20+`

---

## 💻 Technology Stack

*   **Compiler/Bundler**: Vite
*   **Library**: React (Functional components & hooks)
*   **Styling**: Vanilla CSS (CSS Variables, Grid Layouts, Glassmorphism, Animations)
*   **Icons**: Lucide React
*   **Deduplication & Extraction**: Python 3.14 + `pypdf`
