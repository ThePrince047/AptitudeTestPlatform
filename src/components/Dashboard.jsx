import React from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";

export default function Dashboard({ 
  onStartTest, 
  onNavigate, 
  history = [], 
  bookmarks = [] 
}) {
  // Group the 16 subjects into 4 premium learning tracks
  const tracks = [
    {
      id: "aptitude",
      title: "Aptitude Foundations",
      desc: "Master mathematical, logical, and verbal problem-solving tracks.",
      topics: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"],
      accent: "var(--primary)"
    },
    {
      id: "core-cs",
      title: "Core Computer Science",
      desc: "DSA, kernel concepts, database structures, and network foundations.",
      topics: ["DSA", "Operating Systems", "DBMS & SQL", "Computer Networks", "Computer Fundamentals"],
      accent: "#10B981"
    },
    {
      id: "engineering",
      title: "Advanced Engineering",
      desc: "Software methodologies, system designs, and security algorithms.",
      topics: ["Software Engineering", "System Design", "Cybersecurity", "Technical Concepts"],
      accent: "#F59E0B"
    },
    {
      id: "emerging",
      title: "Emerging Tech & Mixed",
      desc: "Cloud, web stacks, artificial intelligence, and general aptitude papers.",
      topics: ["AI & ML", "Web Technologies", "Cloud Computing", "General / Mixed"],
      accent: "#EC4899"
    }
  ];

  // Calculate stats
  const totalTests = history.length;
  const avgScore = totalTests 
    ? Math.round(history.reduce((sum, h) => sum + h.pct, 0) / totalTests) 
    : 0;
  
  const totalCorrect = history.reduce((sum, h) => sum + (h.score || 0), 0);
  const totalQuestions = history.reduce((sum, h) => sum + (h.totalQuestions || 0), 0);
  const accuracy = totalQuestions 
    ? Math.round((totalCorrect / totalQuestions) * 100) 
    : 0;
  
  const bookmarkedCount = bookmarks.length;

  const getIcon = (name, size = 16) => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent size={size} />;
  };

  return (
    <div className="dashboard-layout">
      {/* Main Track Curriculum Column (Left) */}
      <div className="dashboard-main-col">
        <div className="dashboard-hero">
          <h2>Aptitude Mock Test Environment</h2>
          <p>
            An immersive preparation environment. Develop and validate your skills across {QB.length} challenging, NQT-standard questions categorized in 17 sections.
          </p>
        </div>

        {tracks.map((track) => (
          <div key={track.id} className="track-container">
            <div className="track-header" style={{ borderLeft: `4px solid ${track.accent}` }}>
              <h4>{track.title}</h4>
              <p>{track.desc}</p>
            </div>
            
            <div className="track-grid">
              {track.topics.map((topicId) => {
                const topicQB = QB.filter(q => q.cat === topicId);
                const count = topicQB.length;
                const topicCnf = CATEGORY_CONFIG.find(c => c.id === topicId) || CATEGORY_CONFIG[0];
                
                return (
                  <div 
                    key={topicId} 
                    className="glass-card topic-card-new"
                    onClick={() => onStartTest(topicId)}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", width: "100%", gap: "12px" }}>
                      <div className="topic-icon-circle" style={{ backgroundColor: topicCnf.bg, color: topicCnf.color }}>
                        {getIcon(topicCnf.icon, 18)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="topic-title-new">{topicCnf.label}</div>
                        <div className="topic-meta-new">{count} questions</div>
                      </div>
                      <Icons.ChevronRight size={16} className="topic-arrow-new" color="var(--text-muted)" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostics & Activity Column (Right Sidebar) */}
      <div className="dashboard-side-col">
        {/* Performance Statistics Widget */}
        <div className="glass-card side-widget">
          <h4 className="side-widget-title">Performance Report</h4>
          <div className="side-stats-list">
            <div className="side-stat-row">
              <div className="side-stat-icon-wrapper" style={{ backgroundColor: "rgba(99, 102, 241, 0.08)", color: "var(--primary)" }}>
                <Icons.Trophy size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span className="side-stat-label">Tests Attempted</span>
                <span className="side-stat-value">{totalTests}</span>
              </div>
            </div>

            <div className="side-stat-row">
              <div className="side-stat-icon-wrapper" style={{ backgroundColor: "rgba(16, 185, 129, 0.08)", color: "var(--success-emerald)" }}>
                <Icons.Target size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span className="side-stat-label">Average Score</span>
                <span className="side-stat-value">{avgScore}%</span>
              </div>
            </div>

            <div className="side-stat-row">
              <div className="side-stat-icon-wrapper" style={{ backgroundColor: "rgba(245, 158, 11, 0.08)", color: "var(--warning)" }}>
                <Icons.Activity size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span className="side-stat-label">Overall Accuracy</span>
                <span className="side-stat-value">{accuracy}%</span>
              </div>
            </div>

            <div className="side-stat-row">
              <div className="side-stat-icon-wrapper" style={{ backgroundColor: "rgba(236, 72, 153, 0.08)", color: "#EC4899" }}>
                <Icons.Bookmark size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <span className="side-stat-label">Saved Questions</span>
                <span className="side-stat-value">{bookmarkedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus-Wide Mock Launcher */}
        <div className="glass-card side-widget banner-widget" style={{ 
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.01) 100%)",
          border: "1px solid rgba(99, 102, 245, 0.15)"
        }}>
          <h4 className="side-widget-title" style={{ color: "#FFF" }}>Mixed Syllabus Simulation</h4>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", margin: "10px 0 16px 0" }}>
            Challenge yourself with a full syllabus mock test containing randomized questions from all 17 topics under actual exam conditions.
          </p>
          <button 
            onClick={() => onStartTest("all")} 
            className="btn btn-primary"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", fontSize: "12px" }}
          >
            <Icons.Play size={14} /> Start Full Syllabus Mock
          </button>
        </div>

        {/* Recent Session Logs Timeline */}
        <div className="glass-card side-widget">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h4 className="side-widget-title" style={{ margin: 0 }}>Recent Activities</h4>
            {history.length > 0 && (
              <button 
                onClick={() => onNavigate("analytics")}
                style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
              >
                View History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px 0", color: "var(--text-muted)", fontSize: "12px" }}>
              No recent session logs recorded.
            </div>
          ) : (
            <div className="side-timeline">
              {history.slice(-3).reverse().map((h, idx) => {
                const topicCnf = CATEGORY_CONFIG.find(c => c.id === h.cat) || CATEGORY_CONFIG[0];
                const pctVal = h.pct !== undefined && h.pct !== null && !isNaN(h.pct) ? h.pct : 0;
                
                return (
                  <div key={idx} className="side-timeline-item">
                    <div className="side-timeline-dot" style={{ backgroundColor: topicCnf.color }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="side-timeline-name">
                        {h.cat === "all" ? "Syllabus Mixed Mock" : h.cat}
                      </div>
                      <div className="side-timeline-meta">
                        {h.date} · {h.mode === "practice" ? "Practice" : "Exam"}
                      </div>
                    </div>
                    <div className="side-timeline-score" style={{ color: pctVal >= 80 ? "var(--success-emerald)" : pctVal >= 50 ? "var(--warning)" : "var(--error)" }}>
                      {pctVal}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
