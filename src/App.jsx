import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { QB } from "./data/questionBank";
import { API_BASE } from "./config";
import { CODING_BANK } from "./data/codingBank";

import Dashboard from "./components/Dashboard";
import TestConfig from "./components/TestConfig";
import TestEngine from "./components/TestEngine";
import ResultsView from "./components/ResultsView";
import AiPaper from "./components/AiPaper";
import Analytics from "./components/Analytics";
import CodingPrep from "./components/CodingPrep";
import Auth from "./components/Auth";

const NAV = [
  { id: "dashboard", label: "Dashboard",      icon: "LayoutDashboard" },
  { id: "coding",    label: "Programming Prep", icon: "Code2" },
  { id: "analytics", label: "Progress",       icon: "BarChart2" },
  { id: "ai",        label: "AI Generator",   icon: "Sparkles" },
];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("nqt_auth_token") || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("nqt_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [screen, setScreen] = useState("dashboard");
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [testQuestions, setTestQuestions] = useState([]);
  const [testConfig, setTestConfig] = useState({});
  const [latestResult, setLatestResult] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getAuthHeaders = (additional = {}) => {
    const headers = { ...additional };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("nqt_auth_token");
    localStorage.removeItem("nqt_auth_user");
    setToken(null);
    setUser(null);
    setHistory([]);
    setBookmarks([]);
    setHasApiKey(false);
    setScreen("dashboard");
  };

  const compressHistory = (historyList) => {
    return historyList.map(session => {
      return {
        ...session,
        questions: (session.questions || []).map(q => {
          const isAi = q && typeof q.id === "string" && (q.id.startsWith("ai_") || q.id.startsWith("local_ai_"));
          if (isAi) {
            return {
              id: q.id,
              q: q.q,
              opts: q.opts,
              ans: q.ans,
              sol: q.sol,
              cat: q.cat
            };
          }
          return { id: q.id };
        })
      };
    }).slice(-30); // Cap history at last 30 test runs to protect MongoDB storage (512MB limit)
  };

  useEffect(() => {
    if (!token) return;

    const findQuestionById = (id) => {
      if (typeof id === "number" || !isNaN(id)) {
        return QB.find(q => q.id === Number(id));
      }
      if (typeof id === "string" && id.startsWith("code_")) {
        return CODING_BANK.find(q => q.id === id);
      }
      return null;
    };

    const reconstructHistory = (historyData) => {
      if (!Array.isArray(historyData)) return [];
      return historyData.map(session => {
        const reconstructedQuestions = (session.questions || []).map(q => {
          if (q && q.id && !q.q) {
            const original = findQuestionById(q.id);
            return original ? original : q;
          }
          return q;
        });
        return { ...session, questions: reconstructedQuestions };
      });
    };

    const migrateAndLoadData = async () => {
      // 1. Check for legacy localStorage data
      const legacyHistory = localStorage.getItem("nqt_history");
      const legacyBookmarks = localStorage.getItem("nqt_bookmarks");
      const legacySolvedIds = localStorage.getItem("coding_solved_ids");
      const legacyApiKey = localStorage.getItem("gemini_api_key");

      const hasLegacyData = legacyHistory || legacyBookmarks || legacySolvedIds || legacyApiKey;

      if (hasLegacyData) {
        const migrationPayload = {};
        if (legacyHistory) {
          try { migrationPayload.nqt_history = JSON.parse(legacyHistory); } catch (e) {}
        }
        if (legacyBookmarks) {
          try { migrationPayload.nqt_bookmarks = JSON.parse(legacyBookmarks); } catch (e) {}
        }
        if (legacySolvedIds) {
          try { migrationPayload.coding_solved_ids = JSON.parse(legacySolvedIds); } catch (e) {}
        }
        if (legacyApiKey) {
          migrationPayload.gemini_api_key = legacyApiKey;
        }

        try {
          const migrateRes = await fetch(`${API_BASE}/api/storage/migrate`, {
            method: "POST",
            headers: getAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(migrationPayload)
          });
          if (migrateRes.ok) {
            localStorage.removeItem("nqt_history");
            localStorage.removeItem("nqt_bookmarks");
            localStorage.removeItem("coding_solved_ids");
            localStorage.removeItem("gemini_api_key");
            console.log("Successfully migrated localStorage state to Express backend server.");
          }
        } catch (err) {
          console.error("Failed to migrate legacy localStorage data", err);
        }
      }

      // 2. Load data from Server
      try {
        const historyRes = await fetch(`${API_BASE}/api/storage/nqt_history`, {
          headers: getAuthHeaders()
        });
        if (historyRes.ok) {
          const data = await historyRes.json();
          if (data && data.value) {
            const healed = data.value.map(h => {
              let score = h.score;
              let pct = h.pct;
              if (score === undefined || score === null || isNaN(pct) || pct === null) {
                score = h.questions && h.answers ? h.questions.filter((q, idx) => h.answers && h.answers[idx] === q.ans).length : 0;
                pct = h.questions && h.questions.length ? Math.round((score / h.questions.length) * 100) : 0;
              }
              return { ...h, score, pct };
            });
            setHistory(reconstructHistory(healed));
          }
        }
      } catch (e) {
        console.error("Failed to load history from server", e);
      }

      try {
        const bookmarksRes = await fetch(`${API_BASE}/api/storage/nqt_bookmarks`, {
          headers: getAuthHeaders()
        });
        if (bookmarksRes.ok) {
          const data = await bookmarksRes.json();
          if (data && data.value) {
            setBookmarks(data.value);
          }
        }
      } catch (e) {
        console.error("Failed to load bookmarks from server", e);
      }

      try {
        const keyRes = await fetch(`${API_BASE}/api/storage/gemini_api_key`, {
          headers: getAuthHeaders()
        });
        if (keyRes.ok) {
          const data = await keyRes.json();
          setHasApiKey(!!(data && data.value));
        }
      } catch (e) {
        console.error("Failed to load gemini key status from server", e);
      }
    };

    migrateAndLoadData();
  }, [screen, token]);

  const handleToggleBookmark = (qId) => {
    setBookmarks(prev => {
      const next = prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId];
      fetch(`${API_BASE}/api/storage/nqt_bookmarks`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ value: next })
      }).catch(err => console.error("Failed to save bookmarks to server", err));
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
    fetch(`${API_BASE}/api/storage/nqt_history`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ value: compressHistory(nextHistory) })
    }).catch(err => console.error("Failed to save history to server", err));

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
    fetch(`${API_BASE}/api/storage/nqt_history`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ value: compressHistory(nextHistory) })
    }).catch(err => console.error("Failed to save history to server", err));
  };

  const handleClearHistory = () => {
    setHistory([]);
    fetch(`${API_BASE}/api/storage/nqt_history`, {
      method: "DELETE",
      headers: getAuthHeaders()
    }).catch(err => console.error("Failed to clear history on server", err));
  };

  // Block rendering with premium Auth screen if user is not authenticated
  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

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

        {/* Sidebar Footer with Logged in user info & logout */}
        <div className="sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {user && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "4px 0", borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent-text)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, textTransform: "uppercase", flexShrink: 0
                }}>
                  {user.username ? user.username.charAt(0) : "U"}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.username}
                </span>
              </div>
              <button 
                onClick={handleLogout} 
                title="Log Out"
                style={{
                  background: "none", border: "none", color: "var(--t3)", cursor: "pointer", 
                  padding: 4, borderRadius: 4, display: "flex", alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--t3)"}
              >
                <Icons.LogOut size={14} />
              </button>
            </div>
          )}

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
