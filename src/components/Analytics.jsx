import React, { useState } from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";

export default function Analytics({ 
  history = [], 
  bookmarks = [], 
  onToggleBookmark,
  onStartBookmarkedMock,
  onNavigate 
}) {
  const [expandedBookmark, setExpandedBookmark] = useState({});

  const handleToggleExpand = (qId) => {
    setExpandedBookmark(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Get bookmarked questions objects
  const bookmarkedQuestions = QB.filter(q => bookmarks.includes(q.id));

  // Compute category-wise accuracy
  // We check history and group correct/total questions by category
  const catStats = {};
  CATEGORY_CONFIG.slice(1).forEach(c => {
    catStats[c.id] = { correct: 0, total: 0 };
  });

  history.forEach(h => {
    // If it was a mixed test, it had questions from various categories
    h.questions.forEach((q, idx) => {
      const cat = q.cat;
      const isCorrect = h.answers[idx] === q.ans;
      if (catStats[cat]) {
        catStats[cat].total += 1;
        if (isCorrect) catStats[cat].correct += 1;
      }
    });
  });

  const getCatConfig = (id) => {
    return CATEGORY_CONFIG.find(c => c.id === id) || CATEGORY_CONFIG[0];
  };

  const categoryAccuracies = Object.entries(catStats)
    .map(([catId, data]) => {
      const accuracy = data.total ? Math.round((data.correct / data.total) * 100) : null;
      return { catId, accuracy, ...data };
    })
    .filter(c => c.total > 0) // only show categories the user has actually attempted
    .sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0));

  // Render SVG Chart for History Scores
  const renderHistoryChart = () => {
    if (history.length === 0) return null;
    
    // We only show up to 10 recent tests
    const chartData = history.slice(-10);
    const width = 500;
    const height = 150;
    const padding = 20;
    
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = chartData.map((h, i) => {
      const x = padding + (chartWidth / Math.max(1, chartData.length - 1)) * i;
      const y = padding + chartHeight - (h.pct / 100) * chartHeight;
      return { x, y, val: h.pct, date: h.date };
    });
    
    // Build path line
    let pathD = "";
    let areaD = "";
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      areaD = `M ${points[0].x} ${padding + chartHeight} L ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x} ${points[i].y}`;
        areaD += ` L ${points[i].x} ${points[i].y}`;
      }
      areaD += ` L ${points[points.length-1].x} ${padding + chartHeight} Z`;
    }

    return (
      <div className="chart-container">
        <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#FFF", marginBottom: "16px" }}>Score Progression Trend</h4>
        <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          
          {/* Horizontal lines */}
          {[0, 25, 50, 75, 100].map(yVal => {
            const y = padding + chartHeight - (yVal / 100) * chartHeight;
            return (
              <g key={yVal}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} className="chart-grid" />
                <text x={padding - 5} y={y + 4} fill="var(--text-muted)" fontSize="8" textAnchor="end" fontFamily="monospace">
                  {yVal}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {points.length > 1 && <path d={areaD} className="chart-area" />}

          {/* Trend Line */}
          {points.length > 1 && <path d={pathD} className="chart-line" />}
          
          {/* Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="5" className="chart-dot" />
              <text x={p.x} y={p.y - 10} fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {p.val}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* Analytics Summary */}
      <div className="glass-card">
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#FFF", marginBottom: "6px" }}>Analytics & Progress</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          Monitor your strength areas and review saved questions.
        </p>

        {history.length > 0 ? (
          <div>
            {/* SVG Trend Chart */}
            {renderHistoryChart()}

            {/* Topic Strengths Progress List */}
            <div style={{ marginTop: "32px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#FFF", marginBottom: "16px" }}>Accuracy by Topic</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {categoryAccuracies.map((c, idx) => {
                  const conf = getCatConfig(c.catId);
                  return (
                    <div key={idx} className="topic-analytics-row">
                      <div className="topic-analytics-header">
                        <span style={{ color: "#FFF" }}>{conf.label}</span>
                        <span style={{ color: c.accuracy >= 80 ? "var(--success)" : c.accuracy >= 50 ? "var(--warning)" : "var(--error)" }}>
                          {c.accuracy}% ({c.correct}/{c.total})
                        </span>
                      </div>
                      <div className="topic-analytics-bar-bg">
                        <div 
                          className="topic-analytics-bar-fill" 
                          style={{ 
                            width: `${c.accuracy}%`, 
                            backgroundColor: c.accuracy >= 80 ? "var(--success)" : c.accuracy >= 50 ? "var(--warning)" : "var(--error)" 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Icons.Trophy size={48} color="var(--text-muted)" style={{ marginBottom: "12px", display: "inline-block" }} />
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>No test sessions completed yet. Attempt a test to unlock progress charts!</p>
          </div>
        )}
      </div>

      {/* Bookmarked Questions */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF" }}>Saved Questions</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "2px" }}>
              Bookmarks created during results review for offline study.
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button 
              onClick={onStartBookmarkedMock}
              className="btn btn-primary"
              style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "12px" }}
            >
              <Icons.Play size={14} /> Practice Bookmarks ({bookmarks.length})
            </button>
          )}
        </div>

        {bookmarkedQuestions.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {bookmarkedQuestions.map((q, idx) => {
              const isOpen = expandedBookmark[q.id];
              const conf = getCatConfig(q.cat);
              const CatIcon = Icons[conf.icon] || Icons.HelpCircle;

              return (
                <div key={q.id} className="review-question-card">
                  <div 
                    className="review-question-header"
                    onClick={() => handleToggleExpand(q.id)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
                      <div className="review-badge-wrapper">
                        <span className="review-badge" style={{ backgroundColor: conf.bg, color: conf.color, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CatIcon size={10} />
                          {q.cat}
                        </span>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#FFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {q.q}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(q.id);
                        }}
                        className="btn btn-secondary"
                        style={{ 
                          padding: "6px", 
                          borderRadius: "8px", 
                          border: "none", 
                          color: "var(--error)" 
                        }}
                        title="Delete Bookmark"
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                      {isOpen ? <Icons.ChevronUp size={20} color="var(--text-muted)" /> : <Icons.ChevronDown size={20} color="var(--text-muted)" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="review-question-body">
                      {/* Full question */}
                      <div style={{ fontSize: "14px", lineHeight: "1.6", fontWeight: "500", marginBottom: "16px", color: "#FFF", whiteSpace: "pre-line" }}>
                        {q.q}
                      </div>

                      {/* Options */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                        {q.opts.map((opt, oIdx) => {
                          if (!opt) return null;
                          const isCorrectOpt = oIdx === q.ans;
                          
                          let cardStyle = {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            backgroundColor: "rgba(255,255,255,0.01)",
                            border: "1px solid var(--border-color)"
                          };

                          if (isCorrectOpt) {
                            cardStyle.borderColor = "var(--success)";
                            cardStyle.backgroundColor = "rgba(16, 185, 129, 0.05)";
                            cardStyle.color = "var(--success)";
                          }

                          return (
                            <div key={oIdx} style={cardStyle}>
                              <div style={{ 
                                width: "20px", 
                                height: "20px", 
                                borderRadius: "50%", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: "700",
                                backgroundColor: isCorrectOpt ? "var(--success)" : "rgba(255,255,255,0.03)",
                                color: isCorrectOpt ? "#FFF" : "var(--text-secondary)",
                                border: "1px solid var(--border-color)"
                              }}>
                                {["A", "B", "C", "D"][oIdx]}
                              </div>
                              <span>{opt}</span>
                              {isCorrectOpt && <Icons.Check size={14} style={{ marginLeft: "auto" }} />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Solution */}
                      <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", color: "#FFF", marginBottom: "8px" }}>
                          <Icons.Sparkles size={12} color="var(--primary)" />
                          Solution Details
                        </div>
                        <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
                          {q.sol || "No explanation provided for this question."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Icons.Bookmark size={48} color="var(--text-muted)" style={{ marginBottom: "12px", display: "inline-block" }} />
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>No saved questions yet. Bookmark questions during results review to view them here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
