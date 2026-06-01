import React, { useState } from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";

export default function TestConfig({ initialCategory, onBack, onStart }) {
  const [selCat, setSelCat] = useState(initialCategory || "all");
  const [mode, setMode] = useState("exam");

  const availableCount = selCat === "all"
    ? QB.length
    : QB.filter((q) => q.cat === selCat).length;

  const [qCount, setQCount] = useState(Math.min(20, availableCount));
  const [timeLim, setTimeLim] = useState(30);

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setSelCat(newCat);
    const max = newCat === "all" ? QB.length : QB.filter((q) => q.cat === newCat).length;
    setQCount((prev) => Math.min(prev, max));
  };

  const handleStart = () => {
    onStart({
      category: selCat,
      questionCount: Math.min(qCount, availableCount),
      timeLimit: timeLim,
      mode,
    });
  };

  const selCfg = selCat === "all" ? CATEGORY_CONFIG[0] : CATEGORY_CONFIG.find((c) => c.id === selCat) || CATEGORY_CONFIG[0];

  return (
    <div className="config-container">
      <button onClick={onBack} className="back-button">
        <Icons.ChevronLeft size={15} /> Back
      </button>

      <div className="card card-lg" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.02em", marginBottom: 4 }}>
          Configure Session
        </h3>
        <p style={{ color: "var(--t2)", fontSize: 13, marginBottom: 28 }}>
          Customise your mock or practice session before starting.
        </p>

        {/* Category */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>Topic / Subject</label>
            <span style={{ fontSize: 11, color: "var(--t3)", fontFamily: "var(--font-mono)" }}>
              {availableCount} available
            </span>
          </div>
          <select value={selCat} onChange={handleCategoryChange} className="custom-select">
            <option value="all">Mixed Syllabus — All {QB.length} questions</option>
            {CATEGORY_CONFIG.slice(1).map((c) => {
              const count = QB.filter((q) => q.cat === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.label} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Question count */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>Number of Questions</label>
            <span className="config-value">{Math.min(qCount, availableCount)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={Math.min(100, availableCount)}
            step={5}
            value={qCount}
            onChange={(e) => setQCount(parseInt(e.target.value))}
            className="custom-range"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--t3)", marginTop: 8 }}>
            <span>5</span>
            <span>{Math.min(100, availableCount)} max</span>
          </div>
        </div>

        {/* Time limit */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>Time Limit</label>
            <span className="config-value">{timeLim} min</span>
          </div>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={timeLim}
            onChange={(e) => setTimeLim(parseInt(e.target.value))}
            className="custom-range"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--t3)", marginTop: 8 }}>
            <span>5 min</span>
            <span>2 hours</span>
          </div>
        </div>

        {/* Mode */}
        <div className="config-form-group" style={{ marginBottom: 28 }}>
          <div className="config-label-wrapper" style={{ marginBottom: 12 }}>
            <label>Session Mode</label>
          </div>
          <div className="mode-grid">
            <div
              className={`mode-option-card ${mode === "exam" ? "selected" : ""}`}
              onClick={() => setMode("exam")}
            >
              <div className="mode-header">
                <Icons.Clock size={15} style={{ color: mode === "exam" ? "var(--accent-text)" : "var(--t3)" }} />
                Exam Mode
              </div>
              <div className="mode-description">
                Timed simulation. No hints or answers until submission.
              </div>
            </div>
            <div
              className={`mode-option-card ${mode === "practice" ? "selected" : ""}`}
              onClick={() => setMode("practice")}
            >
              <div className="mode-header">
                <Icons.BookOpen size={15} style={{ color: mode === "practice" ? "var(--green)" : "var(--t3)" }} />
                Practice Mode
              </div>
              <div className="mode-description">
                Instant feedback per question with full solutions. Untimed.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="btn btn-primary"
          style={{ width: "100%", padding: "13px 20px", borderRadius: 10, fontSize: 15 }}
        >
          <Icons.Play size={15} />
          Begin Session
        </button>
      </div>
    </div>
  );
}
