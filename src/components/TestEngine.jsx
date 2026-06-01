import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { CATEGORY_CONFIG } from "../data/questionBank";
import SolutionRenderer from "./SolutionRenderer";

export default function TestEngine({ 
  questions = [], 
  config = {}, 
  bookmarks = [], 
  onToggleBookmark,
  onSubmitTest,
  onExitTest
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(config.timeLimit * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [practiceRevealed, setPracticeRevealed] = useState({}); // Track which practice questions are revealed
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState({});
  const [showShortcutsDrawer, setShowShortcutsDrawer] = useState(false);
  const timerRef = useRef(null);

  const currentIdxRef = useRef(idx);
  useEffect(() => {
    currentIdxRef.current = idx;
  }, [idx]);

  const handleSubmit = (isAuto = false) => {
    clearInterval(timerRef.current);
    setShowSubmitModal(false);
    
    const totalTimeSecs = config.mode === "exam"
      ? (config.timeLimit * 60 - timeLeft)
      : Object.values(timeSpentPerQuestion).reduce((sum, val) => sum + val, 0);

    onSubmitTest({
      answers: answers,
      flagged: flagged,
      timeSpent: totalTimeSecs,
      timeSpentPerQuestion: timeSpentPerQuestion,
      questions: questions,
      config: config
    });
  };

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  // Timer Effect (Tracks total exam time and per-question time)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (config.mode === "exam") {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleSubmitRef.current(true);
            return 0;
          }
          return t - 1;
        });
      }
      setTimeSpentPerQuestion(prev => {
        const curIdx = currentIdxRef.current;
        return { ...prev, [curIdx]: (prev[curIdx] || 0) + 1 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const currentQ = questions[idx];
  if (!currentQ) return null;

  const userAns = answers[idx];
  const isFlagged = flagged.has(idx);
  const isBookmarked = bookmarks.includes(currentQ.id);
  
  const answeredCount = Object.keys(answers).length;
  const pctDone = Math.round((answeredCount / questions.length) * 100);
  const isLowTime = config.mode === "exam" && timeLeft < 300; // under 5 min

  const handleSelectOption = (optIndex) => {
    if (config.mode === "practice" && practiceRevealed[idx]) {
      // Don't allow changing answers in practice mode once checked
      return;
    }
    setAnswers(prev => ({ ...prev, [idx]: optIndex }));
    
    // In practice mode, check automatically on select
    if (config.mode === "practice") {
      setPracticeRevealed(prev => ({ ...prev, [idx]: true }));
    }
  };

  const handleToggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Keyboard Shortcuts Listener Effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT" || activeEl.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === "1" || key === "a") {
        handleSelectOption(0);
      } else if (key === "2" || key === "b") {
        handleSelectOption(1);
      } else if (key === "3" || key === "c") {
        handleSelectOption(2);
      } else if (key === "4" || key === "d") {
        handleSelectOption(3);
      } else if (e.key === "ArrowLeft") {
        setIdx(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        if (idx < questions.length - 1) {
          setIdx(prev => prev + 1);
        }
      } else if (key === "f") {
        handleToggleFlag();
      } else if (key === "s") {
        onToggleBookmark(currentQ.id);
      } else if (e.key === "?") {
        setShowShortcutsDrawer(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [idx, currentQ, answers, practiceRevealed, questions.length]);

  const getCatConfig = (id) => {
    return CATEGORY_CONFIG.find(c => c.id === id) || CATEGORY_CONFIG[0];
  };

  const catConfig = getCatConfig(currentQ.cat);
  const CatIcon = Icons[catConfig.icon] || Icons.HelpCircle;

  return (
    <div className="test-layout">
      {/* Workspace Panel (Left) */}
      <div className="test-workspace">
        {/* Test Header */}
        <div className="test-header">
          <div className="test-progress-container">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="test-progress-text">
                Question {idx + 1} of {questions.length} · {answeredCount} Answered
              </span>
              <span className="test-progress-text" style={{ fontWeight: "bold" }}>
                {pctDone}% Complete
              </span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${pctDone}%` }}></div>
            </div>
          </div>

          <div className="test-header-actions">
            {onExitTest && (
              <button 
                onClick={() => setShowExitModal(true)}
                className="btn btn-secondary"
                style={{ 
                  padding: "10px 14px", 
                  borderRadius: "10px", 
                  borderColor: "var(--error-border)",
                  backgroundColor: "transparent",
                  color: "var(--error)"
                }}
                title="Leave Session"
              >
                <Icons.LogOut size={16} style={{ marginRight: "6px" }} />
                <span>Leave</span>
              </button>
            )}

            {config.mode === "exam" ? (
              <div className={`timer-badge ${isLowTime ? "warning-time" : ""}`}>
                <Icons.Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="timer-badge" style={{ color: "var(--success)" }}>
                <Icons.BookOpen size={16} />
                <span>Practice Mode</span>
              </div>
            )}

            {/* Mobile Question Palette Toggle */}
            <button 
              onClick={() => setMobileDrawerOpen(true)}
              className="btn btn-secondary mobile-only-btn"
              style={{ 
                padding: "10px", 
                borderRadius: "10px"
              }}
              title="Question Navigator"
            >
              <Icons.Grid size={16} />
            </button>

            {/* Keyboard Shortcuts Guide */}
            <button 
              onClick={() => setShowShortcutsDrawer(true)}
              className="shortcuts-toggle-btn"
              title="Keyboard Shortcuts Guide"
            >
              <Icons.Keyboard size={16} />
            </button>

            {/* Flag Question */}
            <button 
              onClick={handleToggleFlag}
              className="btn btn-secondary"
              style={{ 
                padding: "10px", 
                borderRadius: "10px", 
                borderColor: isFlagged ? "var(--warning)" : "var(--border-color)",
                backgroundColor: isFlagged ? "var(--warning-bg)" : "transparent",
                color: isFlagged ? "var(--warning)" : "var(--text-secondary)"
              }}
              title="Flag for Review"
            >
              <Icons.Flag size={16} fill={isFlagged ? "var(--warning)" : "none"} />
            </button>

            {/* Bookmark Question */}
            <button 
              onClick={() => onToggleBookmark(currentQ.id)}
              className="btn btn-secondary"
              style={{ 
                padding: "10px", 
                borderRadius: "10px",
                borderColor: isBookmarked ? "#EC4899" : "var(--border-color)",
                backgroundColor: isBookmarked ? "rgba(236, 72, 153, 0.1)" : "transparent",
                color: isBookmarked ? "#EC4899" : "var(--text-secondary)"
              }}
              title="Save Question"
            >
              <Icons.Bookmark size={16} fill={isBookmarked ? "#EC4899" : "none"} />
            </button>
          </div>
        </div>

        {/* Test Body */}
        <div className="test-body">
          <div className="question-workspace-card">
            {/* Category */}
            <div 
              className="topic-badge" 
              style={{ backgroundColor: catConfig.bg, color: catConfig.color }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <CatIcon size={12} />
                {currentQ.cat}
              </span>
            </div>

            {/* Question Description */}
            <div className="question-text">
              {currentQ.q.includes("\n") ? (
                <div style={{ whiteSpace: "pre-line" }}>{currentQ.q}</div>
              ) : (
                currentQ.q
              )}
            </div>

            {/* Option Cards */}
            <div className="options-container">
              {currentQ.opts.map((opt, oIdx) => {
                if (!opt) return null;
                const isSelected = userAns === oIdx;
                const isRevealed = config.mode === "practice" && practiceRevealed[idx];
                const isCorrectOpt = oIdx === currentQ.ans;

                let cardClass = "option-button";
                if (isSelected) cardClass += " selected";
                if (isRevealed) {
                  if (isCorrectOpt) cardClass += " correct";
                  else if (isSelected) cardClass += " incorrect";
                }

                return (
                  <button 
                    key={oIdx} 
                    onClick={() => handleSelectOption(oIdx)}
                    className={cardClass}
                  >
                    <div className="option-marker">
                      {isRevealed && isCorrectOpt ? (
                        <Icons.Check size={14} />
                      ) : isRevealed && isSelected && !isCorrectOpt ? (
                        <Icons.X size={14} />
                      ) : (
                        ["A", "B", "C", "D"][oIdx]
                      )}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box in Practice Mode */}
            {config.mode === "practice" && practiceRevealed[idx] && (
              <div className="explanation-card">
                <h5>
                  <Icons.Sparkles size={16} />
                  Explanation &amp; Solution
                </h5>
                <SolutionRenderer text={currentQ.sol} />
              </div>
            )}
          </div>
        </div>

        {/* Test Footer navigation */}
        <div className="test-footer">
          <button 
            onClick={() => setIdx(prev => Math.max(0, prev - 1))}
            disabled={idx === 0}
            className="btn btn-secondary"
            style={{ opacity: idx === 0 ? 0.3 : 1 }}
          >
            <Icons.ChevronLeft size={16} /> Previous
          </button>

          <div style={{ display: "flex", gap: "12px" }}>
            {idx < questions.length - 1 ? (
              <button 
                onClick={() => setIdx(prev => prev + 1)}
                className="btn btn-secondary"
              >
                Next <Icons.ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={() => setShowSubmitModal(true)}
                className="btn btn-primary"
                style={{ backgroundColor: "var(--success)" }}
              >
                <Icons.CheckCircle2 size={16} /> Submit Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay when Palette is open */}
      {mobileDrawerOpen && (
        <div 
          className="mobile-sidebar-overlay"
          style={{ zIndex: 1090 }}
          onClick={() => setMobileDrawerOpen(false)}
        ></div>
      )}

      {/* Grid Navigation Panel (Right / Drawer) */}
      <div className={`test-navigation-sidebar ${mobileDrawerOpen ? "mobile-open" : ""}`}>
        <div className="mobile-only" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "20px", width: "100%" }}>
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#FFF", textTransform: "uppercase" }}>Question Palette</span>
          <button 
            onClick={() => setMobileDrawerOpen(false)}
            style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "bold" }}
          >
            <Icons.X size={16} /> Close
          </button>
        </div>
        <h4 className="nav-sidebar-title desktop-only-title">Question Palette</h4>
        <div className="question-nav-grid">
          {questions.map((_, qIdx) => {
            const isCurrent = qIdx === idx;
            const isAns = answers[qIdx] !== undefined;
            const isFlg = flagged.has(qIdx);
            const isDense = questions.length > 25;

            let pillClass = "nav-grid-pill";
            if (isCurrent) pillClass += " current";
            if (isAns) pillClass += " answered";
            if (isFlg) pillClass += " flagged";

            return (
              <button 
                key={qIdx} 
                className={pillClass}
                style={{ 
                  fontSize: isDense ? "11px" : "13px",
                  borderRadius: isDense ? "4px" : "8px"
                }}
                onClick={() => {
                  setIdx(qIdx);
                  setMobileDrawerOpen(false);
                }}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>

        <div className="nav-sidebar-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "var(--primary-glow)", border: "1px solid var(--primary)" }}></div>
            <span>Current</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "var(--success-bg)", border: "1px solid var(--success)" }}></div>
            <span>Answered</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "var(--warning-bg)", border: "1px solid var(--warning)" }}></div>
            <span>Flagged</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)" }}></div>
            <span>Unvisited</span>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
                <Icons.AlertTriangle size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF" }}>Submit Mock Test?</h4>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.5" }}>
                  Are you sure you want to complete the test? You have answered {answeredCount} out of {questions.length} questions.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Continue Test
              </button>
              <button 
                onClick={() => handleSubmit()}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: "var(--success)" }}
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
                <Icons.LogOut size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF" }}>Leave Mock Session?</h4>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.5" }}>
                  Are you sure you want to leave this mock session? Your answers and progress will be discarded.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowExitModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={onExitTest}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: "var(--error)" }}
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Drawer */}
      {showShortcutsDrawer && (
        <div className="shortcuts-drawer-overlay" onClick={() => setShowShortcutsDrawer(false)}>
          <div className="shortcuts-drawer" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, color: "var(--t1)" }}>
                <Icons.Keyboard size={18} style={{ color: "var(--accent-text)" }} />
                Keyboard Guide
              </h4>
              <button 
                onClick={() => setShowShortcutsDrawer(false)}
                style={{ background: "none", border: "none", color: "var(--t3)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <Icons.X size={18} />
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Select Option A</span>
                <span className="shortcut-key">A / 1</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Select Option B</span>
                <span className="shortcut-key">B / 2</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Select Option C</span>
                <span className="shortcut-key">C / 3</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Select Option D</span>
                <span className="shortcut-key">D / 4</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Next Question</span>
                <span className="shortcut-key">→</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Previous Question</span>
                <span className="shortcut-key">←</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Flag for Review</span>
                <span className="shortcut-key">F</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Bookmark Question</span>
                <span className="shortcut-key">S</span>
              </div>
              <div className="shortcut-item">
                <span style={{ color: "var(--t2)", fontSize: 13 }}>Toggle Guide</span>
                <span className="shortcut-key">?</span>
              </div>
            </div>
            
            <div style={{ marginTop: "auto", fontSize: 11, color: "var(--t3)", lineHeight: 1.5, textAlign: "center" }}>
              Press <kbd className="shortcut-key">?</kbd> at any time to toggle this panel.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
