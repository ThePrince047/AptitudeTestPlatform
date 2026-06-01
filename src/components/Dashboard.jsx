import React from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";

const TRACKS = [
  {
    id: "aptitude",
    label: "Aptitude Foundations",
    color: "#7C3AED",
    topics: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"],
  },
  {
    id: "core-cs",
    label: "Core Computer Science",
    color: "#22C55E",
    topics: ["DSA", "Operating Systems", "DBMS & SQL", "Computer Networks", "Computer Fundamentals"],
  },
  {
    id: "engineering",
    label: "Advanced Engineering",
    color: "#F59E0B",
    topics: ["Software Engineering", "System Design", "Cybersecurity", "Technical Concepts"],
  },
  {
    id: "emerging",
    label: "Emerging Technologies",
    color: "#EC4899",
    topics: ["AI & ML", "Web Technologies", "Cloud Computing", "General / Mixed"],
  },
];

export default function Dashboard({ onStartTest, onNavigate, history = [], bookmarks = [], onViewPastResult }) {
  const totalTests = history.length;
  const avgScore = totalTests
    ? Math.round(history.reduce((s, h) => s + h.pct, 0) / totalTests)
    : 0;
  const totalCorrect = history.reduce((s, h) => s + (h.score || 0), 0);
  const totalQs = history.reduce((s, h) => s + (h.totalQuestions || 0), 0);
  const accuracy = totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0;

  const STATS = [
    { label: "Tests Taken",      value: totalTests, icon: "ClipboardList", color: "var(--accent)",  bg: "var(--accent-soft)" },
    { label: "Avg Score",        value: `${avgScore}%`, icon: "TrendingUp", color: "var(--green)", bg: "var(--green-soft)" },
    { label: "Accuracy",         value: `${accuracy}%`, icon: "Target",    color: "var(--amber)", bg: "var(--amber-soft)" },
    { label: "Bookmarks",        value: bookmarks.length, icon: "Bookmark", color: "var(--pink)",  bg: "var(--pink-soft)" },
  ];

  return (
    <div className="dashboard-layout">
      {/* ── Left: Curriculum ─────────────────────────────── */}
      <div className="dashboard-main-col">
        <div className="dashboard-hero">
          <h2>Aptitude Mock Test Environment</h2>
          <p>
            {QB.length.toLocaleString()} questions across 17 topics. Pick a subject or launch a
            full syllabus mock.
          </p>
        </div>

        {TRACKS.map((track) => (
          <div key={track.id} className="track-container">
            <div className="track-header" style={{ borderLeft: `3px solid ${track.color}` }}>
              <h4>{track.label}</h4>
            </div>
            <div className="track-grid">
              {track.topics.map((topicId) => {
                const cnt = QB.filter((q) => q.cat === topicId).length;
                const cfg = CATEGORY_CONFIG.find((c) => c.id === topicId) || CATEGORY_CONFIG[0];
                const Icon = Icons[cfg.icon] || Icons.HelpCircle;
                return (
                  <div
                    key={topicId}
                    className="topic-card-new"
                    onClick={() => onStartTest(topicId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onStartTest(topicId)}
                  >
                    <div
                      className="topic-icon-circle"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      <Icon size={17} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="topic-title-new">{cfg.label}</div>
                      <div className="topic-meta-new">{cnt} questions</div>
                    </div>
                    <Icons.ChevronRight size={15} className="topic-arrow-new" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Right: Stats sidebar ──────────────────────────── */}
      <div className="dashboard-side-col">
        {/* Stats grid */}
        <div className="side-widget">
          <p className="side-widget-title">Your Performance</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {STATS.map((s) => {
              const Icon = Icons[s.icon] || Icons.Circle;
              return (
                <div
                  key={s.label}
                  style={{
                    background: s.bg,
                    borderRadius: 10,
                    padding: "14px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Icon size={15} style={{ color: s.color }} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.02em" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--t3)", fontWeight: 600 }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full syllabus launcher */}
        <div className="side-widget banner-widget">
          <p className="side-widget-title" style={{ color: "var(--accent-text)" }}>Full Mock</p>
          <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6, marginBottom: 14 }}>
            Randomized questions from all 17 topics under exam conditions.
          </p>
          <button
            onClick={() => onStartTest("all")}
            className="btn btn-primary"
            style={{ width: "100%", borderRadius: 9 }}
          >
            <Icons.Play size={14} />
            Start Full Syllabus Mock
          </button>
        </div>

        {/* Recent activity */}
        <div className="side-widget">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p className="side-widget-title" style={{ margin: 0 }}>Recent Activity</p>
            {history.length > 0 && (
              <button
                onClick={() => onNavigate("analytics")}
                style={{ background: "none", border: "none", color: "var(--accent-text)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
              >
                View all →
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--t3)", textAlign: "center", padding: "12px 0" }}>
              No sessions yet. Start a test!
            </p>
          ) : (
            <div className="side-timeline">
              {history
                .slice(-4)
                .reverse()
                .map((h, i) => {
                  const cfg = CATEGORY_CONFIG.find((c) => c.id === h.cat) || CATEGORY_CONFIG[0];
                  const pct = isNaN(h.pct) ? 0 : h.pct;
                  const scoreColor = pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)";
                  return (
                    <div 
                      key={h.id || i} 
                      className="side-timeline-item"
                      onClick={() => onViewPastResult && onViewPastResult(h)}
                      style={{ cursor: "pointer" }}
                      title="Review session details"
                    >
                      <div className="side-timeline-dot" style={{ backgroundColor: cfg.color }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="side-timeline-name">
                          {h.cat === "all" ? "Full Syllabus" : h.cat}
                        </div>
                        <div className="side-timeline-meta">
                          {h.date} · {h.mode === "practice" ? "Practice" : "Exam"}
                        </div>
                      </div>
                      <div className="side-timeline-score" style={{ color: scoreColor }}>
                        {pct}%
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
