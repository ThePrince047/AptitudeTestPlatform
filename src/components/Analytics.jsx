import React, { useState } from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";
import SolutionRenderer from "./SolutionRenderer";

export default function Analytics({ 
  history = [], 
  bookmarks = [], 
  onToggleBookmark, 
  onStartBookmarkedMock, 
  onNavigate,
  onViewPastResult,
  onDeleteSession,
  onClearHistory
}) {
  const [expandedBookmark, setExpandedBookmark] = useState({});
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const bookmarkedQuestions = QB.filter((q) => bookmarks.includes(q.id));

  // Per-category accuracy
  const catStats = {};
  CATEGORY_CONFIG.slice(1).forEach((c) => { catStats[c.id] = { correct: 0, total: 0 }; });
  history.forEach((h) => {
    h.questions.forEach((q, i) => {
      if (catStats[q.cat]) {
        catStats[q.cat].total += 1;
        if (h.answers[i] === q.ans) catStats[q.cat].correct += 1;
      }
    });
  });
  const getCatConfig = (id) => CATEGORY_CONFIG.find((c) => c.id === id) || CATEGORY_CONFIG[0];

  const categoryAccuracies = Object.entries(catStats)
    .map(([catId, d]) => ({ catId, accuracy: d.total ? Math.round((d.correct / d.total) * 100) : null, ...d }))
    .filter((c) => c.total > 0)
    .sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0));

  // SVG curved spline line chart
  const renderChart = () => {
    if (!history.length) return null;
    const data = history.slice(-10);
    const W = 500, H = 150, P = 24;
    const cW = W - P * 2, cH = H - P * 2;
    const pts = data.map((h, i) => ({
      x: P + (cW / Math.max(1, data.length - 1)) * i,
      y: P + cH - (h.pct / 100) * cH,
      val: h.pct,
    }));

    let lineD = "", areaD = "";
    if (pts.length > 0) {
      lineD = `M ${pts[0].x} ${pts[0].y}`;
      areaD = `M ${pts[0].x} ${P + cH} L ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2;
        const cp1y = pts[i - 1].y;
        const cp2x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2;
        const cp2y = pts[i].y;
        lineD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i].x} ${pts[i].y}`;
        areaD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i].x} ${pts[i].y}`;
      }
      areaD += ` L ${pts[pts.length - 1].x} ${P + cH} Z`;
    }

    return (
      <div className="chart-container">
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
          Score Trend (last {data.length} tests)
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((v) => {
            const y = P + cH - (v / 100) * cH;
            return (
              <g key={v}>
                <line x1={P} y1={y} x2={W - P} y2={y} className="chart-grid" />
                <text x={P - 4} y={y + 4} fill="var(--t3)" fontSize="8" textAnchor="end" fontFamily="var(--font-mono)">{v}%</text>
              </g>
            );
          })}
          {pts.length > 1 && <path d={areaD} className="chart-area" />}
          {pts.length > 1 && <path d={lineD} className="chart-line" />}
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" className="chart-dot" />
              <text x={p.x} y={p.y - 8} fill="var(--t1)" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-mono)">{p.val}%</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "32px 40px" }}>

      {/* Analytics */}
      <div className="card card-lg">
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.02em", marginBottom: 4 }}>
          Progress & Analytics
        </h3>
        <p style={{ color: "var(--t2)", fontSize: 13, marginBottom: 24 }}>
          Track your accuracy by topic and score trends over time.
        </p>

        {history.length > 0 ? (
          <>
            {renderChart()}
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>
                Accuracy by Topic
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {categoryAccuracies.map((c) => {
                  const conf = getCatConfig(c.catId);
                  const col = c.accuracy >= 80 ? "var(--green)" : c.accuracy >= 50 ? "var(--amber)" : "var(--red)";
                  return (
                    <div key={c.catId} className="topic-analytics-row">
                      <div className="topic-analytics-header">
                        <span style={{ color: "var(--t1)", fontSize: 13 }}>{conf.label}</span>
                        <span style={{ color: col, fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                          {c.accuracy}% <span style={{ color: "var(--t3)", fontWeight: 400 }}>({c.correct}/{c.total})</span>
                        </span>
                      </div>
                      <div className="topic-analytics-bar-bg">
                        <div className="topic-analytics-bar-fill" style={{ width: `${c.accuracy}%`, backgroundColor: col }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <Icons.BarChart2 size={40} style={{ color: "var(--t3)", marginBottom: 12, display: "inline-block" }} />
            <p style={{ color: "var(--t2)", fontSize: 13 }}>Complete a test to unlock your progress charts.</p>
          </div>
        )}
      </div>

      {/* Saved Questions */}
      <div className="card card-lg">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.01em" }}>Saved Questions</h3>
            <p style={{ color: "var(--t2)", fontSize: 12, marginTop: 3 }}>
              Questions you bookmarked during tests.
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button onClick={onStartBookmarkedMock} className="btn btn-primary" style={{ fontSize: 12, padding: "8px 14px" }}>
              <Icons.Play size={13} /> Practice ({bookmarks.length})
            </button>
          )}
        </div>

        {bookmarkedQuestions.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {bookmarkedQuestions.map((q) => {
              const open = expandedBookmark[q.id];
              const conf = getCatConfig(q.cat);
              const CatIcon = Icons[conf.icon] || Icons.HelpCircle;

              return (
                <div key={q.id} className="review-question-card">
                  <div className="review-question-header" onClick={() => setExpandedBookmark((p) => ({ ...p, [q.id]: !p[q.id] }))}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="review-badge" style={{ backgroundColor: conf.bg, color: conf.color, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                        <CatIcon size={10} />{q.cat}
                      </span>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {q.q}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleBookmark(q.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: 6 }}
                        title="Remove bookmark"
                      >
                        <Icons.Trash2 size={14} />
                      </button>
                      {open ? <Icons.ChevronUp size={15} style={{ color: "var(--t3)" }} /> : <Icons.ChevronDown size={15} style={{ color: "var(--t3)" }} />}
                    </div>
                  </div>

                  {open && (
                    <div className="review-question-body">
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t1)", lineHeight: 1.65, marginBottom: 16, whiteSpace: "pre-line" }}>
                        {q.q}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                        {q.opts.map((opt, oIdx) => {
                          if (!opt) return null;
                          const corr = oIdx === q.ans;
                          return (
                            <div key={oIdx} style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "10px 14px", borderRadius: 9, fontSize: 13.5,
                              border: `1px solid ${corr ? "var(--green-line)" : "var(--border)"}`,
                              background: corr ? "var(--green-soft)" : "var(--bg-card)",
                              color: corr ? "var(--green)" : "var(--t2)",
                            }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                                background: corr ? "var(--green)" : "var(--bg-raised)",
                                color: corr ? "#fff" : "var(--t3)",
                                border: `1px solid ${corr ? "var(--green)" : "var(--border)"}`,
                              }}>
                                {corr ? <Icons.Check size={12} /> : ["A", "B", "C", "D"][oIdx]}
                              </div>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ padding: "14px 16px", borderRadius: 10, background: "var(--accent-soft)", border: "1px solid var(--accent-line)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-text)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                          <Icons.Sparkles size={12} style={{ color: "var(--accent-text)" }} /> Solution
                        </div>
                        <SolutionRenderer text={q.sol} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Icons.Bookmark size={36} style={{ color: "var(--t3)", marginBottom: 10, display: "inline-block" }} />
            <p style={{ color: "var(--t2)", fontSize: 13 }}>No saved questions yet.</p>
          </div>
        )}
      </div>

      {/* Session History Card */}
      <div className="card card-lg">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.01em" }}>Session History</h3>
            <p style={{ color: "var(--t2)", fontSize: 12, marginTop: 3 }}>
              Your completed mock exams and practice runs.
            </p>
          </div>
          {history.length > 0 && (
            <button 
              onClick={() => setShowConfirmClear(true)} 
              className="btn btn-danger" 
              style={{ fontSize: 12, padding: "8px 14px" }}
            >
              <Icons.Trash2 size={13} /> Clear All History
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="history-list">
            {history.slice().reverse().map((h) => {
              const conf = getCatConfig(h.cat);
              const CatIcon = Icons[conf.icon] || Icons.HelpCircle;
              const pct = h.pct || 0;
              const scoreColor = pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)";
              const timeFormatted = h.timeSpent ? `${Math.floor(h.timeSpent / 60)}m ${h.timeSpent % 60}s` : "Untimed";
              
              return (
                <div key={h.id} className="history-card-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center",
                      justifyContent: "center", background: conf.bg, color: conf.color, flexShrink: 0
                    }}>
                      <CatIcon size={15} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="history-card-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {h.cat === "all" ? "Full Syllabus Mixed Mock" : h.cat}
                      </div>
                      <div className="history-card-meta">
                        {h.date} · {h.mode === "practice" ? "Practice" : "Exam"} · {h.totalQuestions} Questions · {timeFormatted}
                      </div>
                    </div>
                  </div>

                  <div className="history-actions">
                    <span className="history-card-score" style={{ color: scoreColor, marginRight: 12 }}>
                      {pct}%
                    </span>
                    <button 
                      onClick={() => onViewPastResult(h)} 
                      className="btn btn-ghost" 
                      style={{ fontSize: 12, padding: "6px 12px", height: "auto" }}
                    >
                      Review
                    </button>
                    <button 
                      onClick={() => onDeleteSession(h.id)} 
                      className="btn-icon-danger"
                      title="Delete session"
                    >
                      <Icons.Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Icons.ClipboardList size={36} style={{ color: "var(--t3)", marginBottom: 10, display: "inline-block" }} />
            <p style={{ color: "var(--t2)", fontSize: 13 }}>No completed sessions found.</p>
          </div>
        )}
      </div>

      {/* Clear History Confirmation Modal */}
      {showConfirmClear && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--red-soft)", color: "var(--red)" }}>
                <Icons.AlertTriangle size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF" }}>Clear All Test History?</h4>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.5" }}>
                  This will permanently delete all your completed test sessions, statistics, and historical performance tracking. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowConfirmClear(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: "var(--red)" }}
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
