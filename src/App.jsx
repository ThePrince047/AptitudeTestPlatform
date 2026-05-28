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

  // Load initial data
  useEffect(() => {
    const savedHistory = localStorage.getItem("nqt_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
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

    const key = localStorage.getItem("anthropic_api_key");
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

  const handleStartTestConfig = (catId) => {
    setActiveCategory(catId);
    setScreen("config");
  };

  const handleStartTest = (setup) => {
    // Filter questions
    const pool = setup.category === "all" 
      ? QB 
      : QB.filter(q => q.cat === setup.category);
    
    // Shuffle and slice
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(setup.questionCount, pool.length));
    
    setTestQuestions(selected);
    setTestConfig(setup);
    setScreen("test");
  };

  const handleStartCustomTest = (customQs, topicName) => {
    setTestQuestions(customQs);
    setTestConfig({
      category: topicName,
      questionCount: customQs.length,
      timeLimit: 30, // 30 minutes for AI papers
      mode: "exam"
    });
    setScreen("test");
  };

  const handleStartBookmarkedMock = () => {
    const pool = QB.filter(q => bookmarks.includes(q.id));
    if (pool.length === 0) return;
    
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    
    setTestQuestions(shuffled);
    setTestConfig({
      category: "all",
      questionCount: shuffled.length,
      timeLimit: 30,
      mode: "practice" // Bookmarked practice is untimed practice by default
    });
    setScreen("test");
  };

  const handleSubmitTest = (resultPayload) => {
    const { score, questions, answers, config } = resultPayload;
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
    
    setLatestResult(resultPayload);
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
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <Icons.Layers size={18} color="#FFF" />
          </div>
          <h1>NQT Prep Portal</h1>
        </div>

        <ul className="nav-links">
          <button 
            onClick={() => setScreen("dashboard")} 
            className={`nav-item ${screen === "dashboard" || screen === "config" ? "active" : ""}`}
          >
            <Icons.Home size={18} />
            Dashboard
          </button>
          
          <button 
            onClick={() => setScreen("analytics")} 
            className={`nav-item ${screen === "analytics" ? "active" : ""}`}
          >
            <Icons.Trophy size={18} />
            Progress & Saved
          </button>

          <button 
            onClick={() => setScreen("ai")} 
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
              {hasApiKey ? "AI API Connected" : "Local Simulator"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Workspace */}
      <div className="main-content">
        {screen === "dashboard" && (
          <Dashboard 
            onStartTest={handleStartTestConfig}
            onNavigate={setScreen}
            history={history}
            bookmarks={bookmarks}
          />
        )}

        {screen === "config" && (
          <TestConfig 
            initialCategory={activeCategory}
            onBack={() => setScreen("dashboard")}
            onStart={handleStartTest}
          />
        )}

        {screen === "result" && (
          <ResultsView 
            result={latestResult}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onNavigate={setScreen}
          />
        )}

        {screen === "ai" && (
          <AiPaper 
            onStartCustomTest={handleStartCustomTest}
            onNavigate={setScreen}
          />
        )}

        {screen === "analytics" && (
          <Analytics 
            history={history}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onStartBookmarkedMock={handleStartBookmarkedMock}
            onNavigate={setScreen}
          />
        )}
      </div>
    </div>
  );
}
