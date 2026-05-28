import React from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";

export default function Dashboard({ 
  onStartTest, 
  onNavigate, 
  history = [], 
  bookmarks = [] 
}) {
  // Calculate aggregate stats
  const totalTests = history.length;
  const avgScore = totalTests 
    ? Math.round(history.reduce((sum, h) => sum + h.pct, 0) / totalTests) 
    : 0;
  
  // Total correct vs total questions answered in history
  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const accuracy = totalQuestions 
    ? Math.round((totalCorrect / totalQuestions) * 100) 
    : 0;
  
  const bookmarkedCount = bookmarks.length;

  const stats = [
    { label: "Tests Attempted", value: totalTests, icon: "Trophy", color: "#6366F1", bg: "rgba(99, 102, 241, 0.1)" },
    { label: "Average Score", value: `${avgScore}%`, icon: "Target", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
    { label: "Overall Accuracy", value: `${accuracy}%`, icon: "Activity", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
    { label: "Saved Questions", value: bookmarkedCount, icon: "Bookmark", color: "#EC4899", bg: "rgba(236, 72, 153, 0.1)" }
  ];

  const getIcon = (name) => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent size={20} />;
  };

  return (
    <div>
      <div className="dashboard-hero">
        <h2>TCS NQT Preparation Portal</h2>
        <p>Master Quantitative Aptitude, Logical Reasoning, Coding Concepts, and technical topics with 1,530+ official practice questions.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s, idx) => {
          const Icon = Icons[s.icon] || Icons.HelpCircle;
          return (
            <div key={idx} className="glass-card stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: s.bg, color: s.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Mixed Mock Test */}
      <div className="glass-card quick-start-banner" style={{ marginBottom: "40px" }}>
        <div className="quick-start-info">
          <h4>Full Mixed Syllabus Mock Test</h4>
          <p>Practice a real exam simulation containing random questions from all 16 categories under actual timed conditions.</p>
        </div>
        <button 
          onClick={() => { onStartTest("all"); }}
          className="btn btn-primary"
        >
          <Icons.Play size={16} /> Start Full Mock
        </button>
      </div>

      {/* Topics Section */}
      <div className="categories-section">
        <div className="section-header">
          <h3>Practice by Topic</h3>
        </div>
        <div className="categories-grid">
          {CATEGORY_CONFIG.slice(1).map((cat) => {
            const count = QB.filter(q => q.cat === cat.id).length;
            const IconComponent = Icons[cat.icon] || Icons.HelpCircle;
            
            return (
              <div 
                key={cat.id} 
                className="glass-card category-card"
                style={{ "--accent-color": cat.color }}
                onClick={() => onStartTest(cat.id)}
              >
                <div className="category-icon-wrapper" style={{ backgroundColor: cat.bg, color: cat.color }}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <div className="category-name">{cat.label}</div>
                  <div className="category-count">{count} available questions</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="glass-card" style={{ marginTop: "32px" }}>
          <div className="section-header" style={{ marginBottom: "16px" }}>
            <h3>Recent Test Activity</h3>
            <button className="nav-item active" style={{ width: "auto", padding: "6px 12px", fontSize: "12px" }} onClick={() => onNavigate("analytics")}>
              View All History
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {history.slice(-3).reverse().map((h, idx) => {
              const catConfig = CATEGORY_CONFIG.find(c => c.id === h.cat) || CATEGORY_CONFIG[0];
              const Icon = Icons[catConfig.icon] || Icons.HelpCircle;
              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: catConfig.bg, color: catConfig.color, display: "flex", alignItems: "center", justifyCenter: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600" }}>
                        {h.cat === "all" ? "Full Syllabus Mixed Mock" : h.cat}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {h.date} · {h.mode === "practice" ? "Practice Mode" : "Exam Mode"}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: h.pct >= 80 ? "var(--success)" : h.pct >= 50 ? "var(--warning)" : "var(--error)" }}>
                      {h.pct}%
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {h.score}/{h.totalQuestions} Correct
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
