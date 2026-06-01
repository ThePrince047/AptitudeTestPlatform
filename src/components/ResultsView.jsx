import React, { useState } from "react";
import * as Icons from "lucide-react";
import { CATEGORY_CONFIG } from "../data/questionBank";
import SolutionRenderer from "./SolutionRenderer";

export default function ResultsView({ result = {}, bookmarks = [], onToggleBookmark, onNavigate }) {
  const { answers = {}, timeSpent = 0, timeSpentPerQuestion = {}, questions = [], config = {} } = result;

  const totalQs = questions.length;
  const score = questions.filter((q, i) => answers[i] === q.ans).length;
  const wrong = Object.keys(answers).length - score;
  const skipped = totalQs - Object.keys(answers).length;
  const pct = totalQs ? Math.round((score / totalQs) * 100) : 0;

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;
  const formatQTime = (sec) => {
    if (sec < 60) return `${sec}s`;
    return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };

  const grade = pct >= 85 ? "Excellent" : pct >= 70 ? "Good" : pct >= 50 ? "Average" : "Needs Work";
  const gradeColor = pct >= 85 ? "var(--green)" : pct >= 70 ? "var(--accent-text)" : pct >= 50 ? "var(--amber)" : "var(--red)";

  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (i) => setExpanded((p) => ({ ...p, [i]: !p[i] }));

  const getCatConfig = (id) => CATEGORY_CONFIG.find((c) => c.id === id) || CATEGORY_CONFIG[0];

  const filtered = questions
    .map((q, i) => ({ q, i }))
    .filter(({ i }) => {
      const correct = answers[i] === questions[i].ans;
      const skipped = answers[i] === undefined;
      if (filter === "correct") return correct && !skipped;
      if (filter === "incorrect") return !correct && !skipped;
      if (filter === "skipped") return skipped;
      return true;
    });

  // SVG gauge
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const STAT_BOXES = [
    { val: score, label: "Correct", color: "var(--green)", bg: "var(--green-soft)", border: "var(--green-line)" },
    { val: wrong, label: "Incorrect", color: "var(--red)", bg: "var(--red-soft)", border: "var(--red-line)" },
    { val: skipped, label: "Skipped", color: "var(--amber)", bg: "var(--amber-soft)", border: "var(--amber-line)" },
  ];

  return (
    <div className="results-card">
      {/* Hero */}
      <div className="results-hero">
        <div className="score-circle-wrapper">
          <svg className="score-circle-svg" viewBox="0 0 160 160">
            <defs>
              <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle className="score-circle-bg" cx="80" cy="80" r={r} />
            <circle
              className="score-circle-fill"
              cx="80" cy="80" r={r}
              stroke={gradeColor}
              strokeDasharray={circ}
              strokeDashoffset={offset}
              filter="url(#gauge-glow)"
            />
          </svg>
          <div className="score-circle-text">
            <div className="score-circle-percentage">{pct}%</div>
            <div className="score-circle-fraction">{score}/{totalQs}</div>
          </div>
        </div>

        <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.02em", marginBottom: 4 }}>
          Performance: <span style={{ color: gradeColor }}>{grade}</span>
        </h3>
        <p style={{ color: "var(--t2)", fontSize: 13 }}>
          {config.mode === "exam" ? `Time spent: ${formatTime(timeSpent)}` : "Practice session completed"}
        </p>

        <div className="results-stats-row">
          {STAT_BOXES.map((s) => (
            <div
              key={s.label}
              className="results-stat-box"
              style={{ backgroundColor: s.bg, borderColor: s.border, color: s.color }}
            >
              <div className="results-stat-val">{s.val}</div>
              <div className="results-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, width: "100%" }}>
          <button onClick={() => onNavigate("dashboard")} className="btn btn-ghost" style={{ flex: 1 }}>
            <Icons.Home size={15} /> Dashboard
          </button>
          <button onClick={() => onNavigate("config")} className="btn btn-primary" style={{ flex: 1 }}>
            <Icons.RotateCcw size={15} /> Retake
          </button>
        </div>
      </div>

      {/* Review */}
      <div style={{ marginTop: 28 }}>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)" }}>Review Answers</h3>
          {/* Filters */}
          <div className="segmented-control">
            {["all", "correct", "incorrect", "skipped"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`segmented-btn ${filter === f ? "active" : ""}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(({ q, i }) => {
            const correct = answers[i] === q.ans;
            const skipped = answers[i] === undefined;
            const bookmarked = bookmarks.includes(q.id);
            const open = expanded[i];
            const cfg = getCatConfig(q.cat);
            const CatIcon = Icons[cfg.icon] || Icons.HelpCircle;
            const qTime = timeSpentPerQuestion[i] || 0;

            const status = skipped ? { label: "Skipped", color: "var(--amber)", bg: "var(--amber-soft)" }
              : correct ? { label: "Correct", color: "var(--green)", bg: "var(--green-soft)" }
              : { label: "Wrong", color: "var(--red)", bg: "var(--red-soft)" };

            return (
              <div key={i} className="review-question-card">
                <div className="review-question-header" onClick={() => toggleExpand(i)}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        className="review-badge"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        {status.label}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--t3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        Q{i + 1} · {q.cat}
                        {qTime > 0 && (
                          <span className="time-tag">
                            <Icons.Clock size={10} /> {formatQTime(qTime)}
                          </span>
                        )}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 13.5, fontWeight: 600, color: "var(--t1)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      {q.q}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleBookmark(q.id); }}
                      style={{
                        background: "none", border: "none", cursor: "pointer", padding: 6,
                        color: bookmarked ? "var(--pink)" : "var(--t3)"
                      }}
                    >
                      <Icons.Bookmark size={15} fill={bookmarked ? "var(--pink)" : "none"} />
                    </button>
                    {open
                      ? <Icons.ChevronUp size={16} style={{ color: "var(--t3)" }} />
                      : <Icons.ChevronDown size={16} style={{ color: "var(--t3)" }} />}
                  </div>
                </div>

                {open && (
                  <div className="review-question-body">
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--t1)", lineHeight: 1.65, marginBottom: 18, whiteSpace: "pre-line" }}>
                      {q.q}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                      {q.opts.map((opt, oIdx) => {
                        if (!opt) return null;
                        const sel = answers[i] === oIdx;
                        const corr = oIdx === q.ans;
                        let border = "var(--border)";
                        let bg = "var(--bg-card)";
                        let color = "var(--t2)";
                        if (corr) { border = "var(--green-line)"; bg = "var(--green-soft)"; color = "var(--green)"; }
                        else if (sel) { border = "var(--red-line)"; bg = "var(--red-soft)"; color = "var(--red)"; }
                        return (
                          <div key={oIdx} style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "11px 14px", borderRadius: 9,
                            border: `1px solid ${border}`, background: bg, fontSize: 13.5, color
                          }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center",
                              justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                              background: corr ? "var(--green)" : sel ? "var(--red)" : "var(--bg-raised)",
                              color: (corr || sel) ? "#fff" : "var(--t3)",
                              border: `1px solid ${border}`
                            }}>
                              {corr ? <Icons.Check size={13} /> : sel ? <Icons.X size={13} /> : ["A","B","C","D"][oIdx]}
                            </div>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div style={{
                      padding: "16px 18px", borderRadius: 10,
                      background: "var(--accent-soft)", border: "1px solid var(--accent-line)"
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 7,
                        fontSize: 11, fontWeight: 700, color: "var(--accent-text)",
                        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12
                      }}>
                        <Icons.Sparkles size={13} style={{ color: "var(--accent-text)" }} />
                        Solution
                      </div>
                      <SolutionRenderer text={q.sol} />
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
