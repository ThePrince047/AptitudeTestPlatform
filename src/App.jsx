import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { QB } from "./data/questionBank";

// Import modular components
import Dashboard from "./components/Dashboard";
import TestConfig from "./components/TestConfig";
import TestEngine from "./components/TestEngine";
import ResultsView from "./components/ResultsView";
import AiPaper from "./components/AiPaper";
import Analytics from "./components/Analytics";

export default function App() {
  const [screen, setScreen] = useState("dashboard"); // "dashboard", "config", "test", "result", "ai", "analytics"
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [testQuestions, setTestQuestions] = useState([]);
  const [testConfig, setTestConfig] = useState({});
  const [latestResult, setLatestResult] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const savedHistory = localStorage.getItem("nqt_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Self-healing migration to correct any NaN percentages or scores
        const healed = parsed.map(h => {
          let score = h.score;
          let pct = h.pct;
          if (score === undefined || score === null || isNaN(pct) || pct === null) {
            score = h.questions ? h.questions.filter((q, idx) => h.answers[idx] === q.ans).length : 0;
            pct = h.questions && h.questions.length ? Math.round((score / h.questions.length) * 100) : 0;
          }
          return { ...h, score, pct };
        });
        setHistory(healed);
        localStorage.setItem("nqt_history", JSON.stringify(healed));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const savedBookmarks = localStorage.getItem("nqt_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }

    const key = localStorage.getItem("gemini_api_key");
    setHasApiKey(!!key);
  }, [screen]);

  const handleToggleBookmark = (qId) => {
    setBookmarks(prev => {
      const idx = prev.indexOf(qId);
      let next;
      if (idx !== -1) {
        next = prev.filter(id => id !== qId);
      } else {
        next = [...prev, qId];
      }
      localStorage.setItem("nqt_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const navigateTo = (scrName) => {
    setScreen(scrName);
    setMobileMenuOpen(false);
  };

  // Dynamic option shuffler that shifts correct answer index ans
  const shuffleQuestionOptions = (q) => {
    if (!q || !q.opts) return q;
    const correctOptionText = q.opts[q.ans];
    const shuffledOpts = [...q.opts].sort(() => Math.random() - 0.5);
    const newAnsIndex = shuffledOpts.indexOf(correctOptionText);
    return {
      ...q,
      opts: shuffledOpts,
      ans: newAnsIndex
    };
  };

  const handleStartTestConfig = (catId) => {
    setActiveCategory(catId);
    navigateTo("config");
  };

  const handleStartTest = (setup) => {
    // Filter questions
    const pool = setup.category === "all" 
      ? QB 
      : QB.filter(q => q.cat === setup.category);
    
    // Shuffle and slice
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(setup.questionCount, pool.length));
    const prepared = selected.map(shuffleQuestionOptions);
    
    setTestQuestions(prepared);
    setTestConfig(setup);
    setScreen("test");
  };

  const handleStartCustomTest = (customQs, topicName) => {
    const prepared = customQs.map(shuffleQuestionOptions);
    setTestQuestions(prepared);
    setTestConfig({
      category: topicName,
      questionCount: customQs.length,
      timeLimit: Math.max(10, Math.ceil(customQs.length * 1.5)), // Dynamic time limit
      mode: "exam"
    });
    setScreen("test");
  };

  const handleStartBookmarkedMock = () => {
    const pool = QB.filter(q => bookmarks.includes(q.id));
    if (pool.length === 0) return;
    
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const prepared = shuffled.map(shuffleQuestionOptions);
    
    setTestQuestions(prepared);
    setTestConfig({
      category: "all",
      questionCount: shuffled.length,
      timeLimit: 30,
      mode: "practice" // Bookmarked practice is untimed practice by default
    });
    setScreen("test");
  };

  const handleSubmitTest = (resultPayload) => {
    const { questions, answers, config } = resultPayload;
    
    // Calculate correct score and percentage directly to avoid undefined/NaN bugs
    const score = questions.filter((q, idx) => answers[idx] === q.ans).length;
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    
    const newSession = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      score: score,
      totalQuestions: questions.length,
      pct: pct,
      cat: config.category,
      mode: config.mode,
      answers: answers,
      questions: questions
    };

    const nextHistory = [...history, newSession];
    setHistory(nextHistory);
    localStorage.setItem("nqt_history", JSON.stringify(nextHistory));
    
    setLatestResult({
      ...resultPayload,
      score: score,
      pct: pct
    });
    setScreen("result");
  };

  // If in active test, hide sidebar for full screen concentration
  if (screen === "test") {
    return (
      <TestEngine 
        questions={testQuestions}
        config={testConfig}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        onSubmitTest={handleSubmitTest}
        onExitTest={() => setScreen("dashboard")}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-sidebar-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <div className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="logo-section">
          <div className="logo-icon">
            <Icons.Layers size={18} color="#FFF" />
          </div>
          <h1>Aptitude Portal</h1>
          <button 
            className="mobile-close-btn" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <Icons.X size={20} />
          </button>
        </div>

        <ul className="nav-links">
          <button 
            onClick={() => navigateTo("dashboard")} 
            className={`nav-item ${screen === "dashboard" || screen === "config" ? "active" : ""}`}
          >
            <Icons.Home size={18} />
            Dashboard
          </button>
          
          <button 
            onClick={() => navigateTo("analytics")} 
            className={`nav-item ${screen === "analytics" ? "active" : ""}`}
          >
            <Icons.Trophy size={18} />
            Progress & Saved
          </button>

          <button 
            onClick={() => navigateTo("ai")} 
            className={`nav-item ${screen === "ai" ? "active" : ""}`}
          >
            <Icons.Sparkles size={18} />
            AI Paper Gen
          </button>
        </ul>

        <div className="sidebar-footer">
          <div className="api-key-indicator">
            <span style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              backgroundColor: hasApiKey ? "var(--success)" : "var(--warning)",
              display: "inline-block" 
            }}></span>
            <span>
              {hasApiKey ? "Gemini Connected" : "Local Simulator"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Workspace */}
      <div className="main-content">
        {/* Mobile Header Bar */}
        <div className="mobile-header-bar">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="mobile-menu-btn"
            aria-label="Open Menu"
          >
            <Icons.Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.Layers size={16} color="var(--primary)" />
            <span style={{ fontWeight: "700", fontSize: "14px", color: "#FFF" }}>Aptitude Prep</span>
          </div>
          <div style={{ width: "20px" }}></div>
        </div>

        {screen === "dashboard" && (
          <Dashboard 
            onStartTest={handleStartTestConfig}
            onNavigate={navigateTo}
            history={history}
            bookmarks={bookmarks}
          />
        )}

        {screen === "config" && (
          <TestConfig 
            initialCategory={activeCategory}
            onBack={() => navigateTo("dashboard")}
            onStart={handleStartTest}
          />
        )}

        {screen === "result" && (
          <ResultsView 
            result={latestResult}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onNavigate={navigateTo}
          />
        )}

        {screen === "ai" && (
          <AiPaper 
            onStartCustomTest={handleStartCustomTest}
            onNavigate={navigateTo}
          />
        )}

        {screen === "analytics" && (
          <Analytics 
            history={history}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onStartBookmarkedMock={handleStartBookmarkedMock}
            onNavigate={navigateTo}
          />
        )}
      </div>
    </div>
  );
}
