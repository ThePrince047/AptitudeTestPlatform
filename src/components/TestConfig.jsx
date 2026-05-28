import React, { useState } from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";

export default function TestConfig({ 
  initialCategory, 
  onBack, 
  onStart 
}) {
  const [selCat, setSelCat] = useState(initialCategory || "all");
  const [mode, setMode] = useState("exam"); // "exam" or "practice"
  
  // Available questions for selected category
  const availableCount = selCat === "all" 
    ? QB.length 
    : QB.filter(q => q.cat === selCat).length;
    
  // Default values
  const [qCount, setQCount] = useState(Math.min(20, availableCount));
  const [timeLim, setTimeLim] = useState(30); // in minutes

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setSelCat(newCat);
    const newMax = newCat === "all" 
      ? QB.length 
      : QB.filter(q => q.cat === newCat).length;
    setQCount(prev => Math.min(prev, newMax));
  };

  const handleStart = () => {
    onStart({
      category: selCat,
      questionCount: Math.min(qCount, availableCount),
      timeLimit: timeLim,
      mode: mode
    });
  };

  return (
    <div className="config-container">
      <button onClick={onBack} className="back-button">
        <Icons.ChevronLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-card">
        <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#FFF", marginBottom: "6px" }}>Configure Mock Session</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "28px" }}>Set up the conditions for your practice or simulation.</p>

        {/* Category Choice */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>Topic / Subject</label>
          </div>
          <select 
            value={selCat} 
            onChange={handleCategoryChange}
            className="custom-select"
          >
            <option value="all">Mixed Syllabus (All {QB.length} questions)</option>
            {CATEGORY_CONFIG.slice(1).map(c => {
              const count = QB.filter(q => q.cat === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.label} ({count} questions)
                </option>
              );
            })}
          </select>
        </div>

        {/* Question Count Slider */}
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
            <span>5</span>
            <span>{Math.min(100, availableCount)} (Max Available)</span>
          </div>
        </div>

        {/* Time Limit Slider */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>Time Limit</label>
            <span className="config-value">{timeLim} Minutes</span>
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
            <span>5 min</span>
            <span>120 min (2 hours)</span>
          </div>
        </div>

        {/* Mode Select Grid */}
        <div className="config-form-group" style={{ marginBottom: "32px" }}>
          <div className="config-label-wrapper">
            <label>Session Mode</label>
          </div>
          <div className="mode-grid">
            <div 
              className={`mode-option-card ${mode === "exam" ? "selected" : ""}`}
              onClick={() => setMode("exam")}
            >
              <div className="mode-header">
                <Icons.Clock size={18} color="var(--primary)" />
                Exam Mode
              </div>
              <div className="mode-description">
                Strict timed mock test with no immediate answers or explanations. Simulates the actual exam environment.
              </div>
            </div>

            <div 
              className={`mode-option-card ${mode === "practice" ? "selected" : ""}`}
              onClick={() => setMode("practice")}
            >
              <div className="mode-header">
                <Icons.BookOpen size={18} color="var(--success)" />
                Practice Mode
              </div>
              <div className="mode-description">
                Learn as you go. View immediate checkmarks on option selection, read full step-by-step solutions per question, untimed option.
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="btn btn-primary"
          style={{ width: "100%", padding: "16px", borderRadius: "12px", fontSize: "16px" }}
        >
          <Icons.Play size={16} /> Begin Test Environment
        </button>
      </div>
    </div>
  );
}
