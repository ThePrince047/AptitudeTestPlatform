import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { QB } from "./data/questionBank";

import Dashboard from "./components/Dashboard";
import TestConfig from "./components/TestConfig";
import TestEngine from "./components/TestEngine";
import ResultsView from "./components/ResultsView";
import AiPaper from "./components/AiPaper";
import Analytics from "./components/Analytics";
import CodingPrep from "./components/CodingPrep";

const NAV = [
  { id: "dashboard", label: "Dashboard",      icon: "LayoutDashboard" },
  { id: "coding",    label: "Programming Prep", icon: "Code2" },
  { id: "analytics", label: "Progress",       icon: "BarChart2" },
  { id: "ai",        label: "AI Generator",   icon: "Sparkles" },
];

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [testQuestions, setTestQuestions] = useState([]);
  const [testConfig, setTestConfig] = useState({});
  const [latestResult, setLatestResult] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("nqt_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const healed = parsed.map(h => {
          let score = h.score;
          let pct = h.pct;
          if (score === undefined || score === null || isNaN(pct) || pct === null) {
            score = h.questions && h.answers ? h.questions.filter((q, idx) => h.answers && h.answers[idx] === q.ans).length : 0;
            pct = h.questions && h.questions.length ? Math.round((score / h.questions.length) * 100) : 0;
          }
          return { ...h, score, pct };
        });
        setHistory(healed);
        localStorage.setItem("nqt_history", JSON.stringify(healed));
      } catch (e) { console.error("Failed to parse history", e); }
    }

    const savedBookmarks = localStorage.getItem("nqt_bookmarks");
    if (savedBookmarks) {
      try { setBookmarks(JSON.parse(savedBookmarks)); } catch (e) {}
    }

    setHasApiKey(!!localStorage.getItem("gemini_api_key"));
  }, [screen]);

  const handleToggleBookmark = (qId) => {
    setBookmarks(prev => {
      const next = prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId];
      localStorage.setItem("nqt_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const navigateTo = (scrName) => {
    setScreen(scrName);
    setMobileMenuOpen(false);
  };

  const shuffleQuestionOptions = (q) => {
    if (!q || !q.opts) return q;
    const correctText = q.opts[q.ans];
    const shuffled = [...q.opts].sort(() => Math.random() - 0.5);
    return { ...q, opts: shuffled, ans: shuffled.indexOf(correctText) };
  };

  const handleStartTestConfig = (catId) => {
    setActiveCategory(catId);
    navigateTo("config");
  };

  const handleStartTest = (setup) => {
    const pool = setup.category === "all" ? QB : QB.filter(q => q.cat === setup.category);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(setup.questionCount, pool.length));
    setTestQuestions(selected.map(shuffleQuestionOptions));
    setTestConfig(setup);
    setScreen("test");
  };

  const handleStartCustomTest = (customQs, topicName) => {
    setTestQuestions(customQs.map(shuffleQuestionOptions));
    setTestConfig({
      category: topicName,
      questionCount: customQs.length,
      timeLimit: Math.max(10, Math.ceil(customQs.length * 1.5)),
      mode: "exam"
    });
    setScreen("test");
  };

  const handleStartBookmarkedMock = () => {
    const pool = QB.filter(q => bookmarks.includes(q.id));
    if (!pool.length) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setTestQuestions(shuffled.map(shuffleQuestionOptions));
    setTestConfig({ category: "all", questionCount: shuffled.length, timeLimit: 30, mode: "practice" });
    setScreen("test");
  };

  const handleSubmitTest = (resultPayload) => {
    const { questions, answers, config, timeSpent = 0, timeSpentPerQuestion = {} } = resultPayload;
    const score = questions.filter((q, idx) => answers[idx] === q.ans).length;
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

    const newSession = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      score,
      totalQuestions: questions.length,
      pct,
      cat: config.category,
      mode: config.mode,
      answers,
      questions,
      timeSpent,
      timeSpentPerQuestion
    };

    const nextHistory = [...history, newSession];
    setHistory(nextHistory);
    localStorage.setItem("nqt_history", JSON.stringify(nextHistory));
    setLatestResult({ ...resultPayload, score, pct });
    setScreen("result");
  };

  const handleViewPastResult = (session) => {
    setLatestResult({
      questions: session.questions,
      answers: session.answers,
      config: {
        category: session.cat,
        mode: session.mode,
      },
      timeSpent: session.timeSpent || 0,
      timeSpentPerQuestion: session.timeSpentPerQuestion || {},
      score: session.score,
      pct: session.pct
    });
    setScreen("result");
  };

  const handleDeleteSession = (id) => {
    const nextHistory = history.filter(h => h.id !== id);
    setHistory(nextHistory);
    localStorage.setItem("nqt_history", JSON.stringify(nextHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("nqt_history");
  };

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
      {/* Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="logo-section">
          <div className="logo-icon">
            <Icons.GraduationCap size={17} color="#fff" />
          </div>
          <h1>MockTest</h1>
          <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close">
            <Icons.X size={18} />
          </button>
        </div>

        <ul className="nav-links">
          {NAV.map(item => {
            const Icon = Icons[item.icon] || Icons.Circle;
            const isActive = screen === item.id || (item.id === "dashboard" && screen === "config");
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <div className="api-key-indicator">
            <span style={{
              width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
              backgroundColor: hasApiKey ? "var(--green)" : "var(--amber)",
              display: "inline-block"
            }} />
            <span>{hasApiKey ? "Gemini API active" : "Local mode"}</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-header-bar">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
            <Icons.Menu size={18} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.GraduationCap size={16} style={{ color: "var(--accent-text)" }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>MockTest</span>
          </div>
          <div style={{ width: 34 }} />
        </div>

        {screen === "dashboard" && (
          <Dashboard onStartTest={handleStartTestConfig} onNavigate={navigateTo} history={history} bookmarks={bookmarks} onViewPastResult={handleViewPastResult} />
        )}
        {screen === "config" && (
          <TestConfig initialCategory={activeCategory} onBack={() => navigateTo("dashboard")} onStart={handleStartTest} />
        )}
        {screen === "result" && (
          <ResultsView result={latestResult} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} onNavigate={navigateTo} />
        )}
        {screen === "ai" && (
          <AiPaper onStartCustomTest={handleStartCustomTest} onNavigate={navigateTo} />
        )}
        {screen === "analytics" && (
          <Analytics history={history} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} onStartBookmarkedMock={handleStartBookmarkedMock} onNavigate={navigateTo} onViewPastResult={handleViewPastResult} onDeleteSession={handleDeleteSession} onClearHistory={handleClearHistory} />
        )}
        {screen === "coding" && (
          <CodingPrep onNavigate={navigateTo} />
        )}
      </div>
    </div>
  );
}
