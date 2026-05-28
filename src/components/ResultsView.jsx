import React, { useState } from "react";
import * as Icons from "lucide-react";
import { CATEGORY_CONFIG } from "../data/questionBank";

export default function ResultsView({ 
  result = {}, 
  bookmarks = [], 
  onToggleBookmark,
  onNavigate 
}) {
  const { answers = {}, flagged = new Set(), timeSpent = 0, questions = [], config = {} } = result;

  // Calculate score details
  const totalQuestions = questions.length;
  const score = questions.filter((q, idx) => answers[idx] === q.ans).length;
  const wrong = totalQuestions - score - (totalQuestions - Object.keys(answers).length);
  const skipped = totalQuestions - Object.keys(answers).length;
  const pct = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
  
  // Format time spent
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const grade = pct >= 85 ? "Excellent" : pct >= 70 ? "Good" : pct >= 50 ? "Average" : "Needs Work";
  const gradeColor = pct >= 85 ? "var(--success)" : pct >= 70 ? "var(--primary)" : pct >= 50 ? "var(--warning)" : "var(--error)";

  // Filter reviews
  const [filter, setFilter] = useState("all"); // "all", "correct", "incorrect", "skipped"
  const [expanded, setExpanded] = useState({}); // Expanded solutions

  const handleToggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getCatConfig = (id) => {
    return CATEGORY_CONFIG.find(c => c.id === id) || CATEGORY_CONFIG[0];
  };

  // Filtered list
  const filteredIndices = questions.map((q, idx) => ({ q, idx })).filter(({ q, idx }) => {
    const isCorrect = answers[idx] === q.ans;
    const isSkipped = answers[idx] === undefined;
    if (filter === "correct") return isCorrect && !isSkipped;
    if (filter === "incorrect") return !isCorrect && !isSkipped;
    if (filter === "skipped") return isSkipped;
    return true;
  });

  // SVG Gauge details
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="results-card">
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <div className="results-hero">
          {/* Circular Score Gauge */}
          <div className="score-circle-wrapper">
            <svg className="score-circle-svg">
              <circle className="score-circle-bg" cx="80" cy="80" r={radius} />
              <circle 
                className="score-circle-fill" 
                cx="80" 
                cy="80" 
                r={radius} 
                stroke={gradeColor}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="score-circle-text">
              <div className="score-circle-percentage">{pct}%</div>
              <div className="score-circle-fraction">{score} / {totalQuestions} Qs</div>
            </div>
          </div>

          <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#FFF", marginBottom: "4px" }}>
            Performance Level: <span style={{ color: gradeColor }}>{grade}</span>
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {config.mode === "exam" ? `Time Spent: ${formatTime(timeSpent)}` : "Practice Session Completed"}
          </p>

          <div className="results-stats-row">
            <div className="results-stat-box" style={{ backgroundColor: "var(--success-bg)", border: "1px solid var(--success-border)", color: "var(--success)" }}>
              <div className="results-stat-val">{score}</div>
              <div className="results-stat-lbl">Correct</div>
            </div>
            <div className="results-stat-box" style={{ backgroundColor: "var(--error-bg)", border: "1px solid var(--error-border)", color: "var(--error)" }}>
              <div className="results-stat-val">{wrong}</div>
              <div className="results-stat-lbl">Incorrect</div>
            </div>
            <div className="results-stat-box" style={{ backgroundColor: "var(--warning-bg)", border: "1px solid var(--warning-border)", color: "var(--warning)" }}>
              <div className="results-stat-val">{skipped}</div>
              <div className="results-stat-lbl">Skipped</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
          <button onClick={() => onNavigate("dashboard")} className="btn btn-secondary" style={{ flex: 1 }}>
            <Icons.Home size={16} /> Dashboard
          </button>
          <button onClick={() => onNavigate("config")} className="btn btn-primary" style={{ flex: 1 }}>
            <Icons.RotateCcw size={16} /> Retake / Configure New
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div>
        <div className="section-header" style={{ marginBottom: "20px" }}>
          <h3>Review Answers</h3>
          
          {/* Review Filters */}
          <div style={{ display: "flex", gap: "6px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "4px", borderRadius: "10px" }}>
            {["all", "correct", "incorrect", "skipped"].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className="btn btn-secondary"
                style={{ 
                  padding: "6px 12px", 
                  borderRadius: "8px", 
                  fontSize: "12px",
                  border: "none",
                  backgroundColor: filter === f ? "rgba(255,255,255,0.06)" : "transparent",
                  color: filter === f ? "#FFF" : "var(--text-secondary)"
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Question Review Cards List */}
        <div>
          {filteredIndices.map(({ q, idx }) => {
            const isCorrect = answers[idx] === q.ans;
            const isSkipped = answers[idx] === undefined;
            const isBookmarked = bookmarks.includes(q.id);
            const isOpen = expanded[idx];
            const catCnf = getCatConfig(q.cat);

            let badgeText = "Correct";
            let badgeBg = "var(--success-bg)";
            let badgeColor = "var(--success)";
            if (isSkipped) {
              badgeText = "Skipped";
              badgeBg = "var(--warning-bg)";
              badgeColor = "var(--warning)";
            } else if (!isCorrect) {
              badgeText = "Incorrect";
              badgeBg = "var(--error-bg)";
              badgeColor = "var(--error)";
            }

            return (
              <div key={idx} className="review-question-card">
                <div 
                  className="review-question-header"
                  onClick={() => handleToggleExpand(idx)}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
                    <div className="review-badge-wrapper">
                      <span className="review-badge" style={{ backgroundColor: badgeBg, color: badgeColor }}>
                        {badgeText}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Q{idx + 1} · {q.cat}
                      </span>
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "#FFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                        color: isBookmarked ? "#EC4899" : "var(--text-muted)" 
                      }}
                    >
                      <Icons.Bookmark size={16} fill={isBookmarked ? "#EC4899" : "none"} />
                    </button>
                    {isOpen ? <Icons.ChevronUp size={20} color="var(--text-muted)" /> : <Icons.ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="review-question-body">
                    {/* Full question */}
                    <div style={{ fontSize: "15px", lineHeight: "1.6", fontWeight: "500", marginBottom: "20px", color: "#FFF", whiteSpace: "pre-line" }}>
                      {q.q}
                    </div>

                    {/* Options list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                      {q.opts.map((opt, oIdx) => {
                        if (!opt) return null;
                        const isSelected = answers[idx] === oIdx;
                        const isCorrectOpt = oIdx === q.ans;
                        
                        let cardStyle = {
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          backgroundColor: "rgba(255,255,255,0.01)",
                          border: "1px solid var(--border-color)"
                        };

                        if (isCorrectOpt) {
                          cardStyle.borderColor = "var(--success)";
                          cardStyle.backgroundColor = "rgba(16, 185, 129, 0.05)";
                          cardStyle.color = "var(--success)";
                        } else if (isSelected && !isCorrectOpt) {
                          cardStyle.borderColor = "var(--error)";
                          cardStyle.backgroundColor = "rgba(239, 68, 68, 0.05)";
                          cardStyle.color = "var(--error)";
                        }

                        return (
                          <div key={oIdx} style={cardStyle}>
                            <div style={{ 
                              width: "24px", 
                              height: "24px", 
                              borderRadius: "50%", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "700",
                              backgroundColor: isCorrectOpt ? "var(--success)" : isSelected ? "var(--error)" : "rgba(255,255,255,0.03)",
                              color: isCorrectOpt || isSelected ? "#FFF" : "var(--text-secondary)",
                              border: "1px solid var(--border-color)"
                            }}>
                              {["A", "B", "C", "D"][oIdx]}
                            </div>
                            <span>{opt}</span>
                            {isCorrectOpt && <Icons.Check size={16} style={{ marginLeft: "auto" }} />}
                            {isSelected && !isCorrectOpt && <Icons.X size={16} style={{ marginLeft: "auto" }} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", color: "#FFF", marginBottom: "8px" }}>
                        <Icons.Sparkles size={14} color="var(--primary)" />
                        Solution Explanation
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
      </div>
    </div>
  );
}
