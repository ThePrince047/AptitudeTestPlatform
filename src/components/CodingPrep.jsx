import React, { useState, useEffect, useMemo, useRef } from "react";
import * as Icons from "lucide-react";
import { CODING_BANK } from "../data/codingBank";

export default function CodingPrep({ onNavigate }) {
  // Screen and viewport detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState("list"); // "list" | "details"

  // Storage states
  const [solvedIds, setSolvedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("coding_solved_ids");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("coding_notes");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [solvedFilter, setSolvedFilter] = useState("All");

  // Selection states
  const [selectedId, setSelectedId] = useState("code_1");
  const [workspaceTab, setWorkspaceTab] = useState("description");
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [copySuccess, setCopySuccess] = useState(false);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save solved IDs to localStorage
  useEffect(() => {
    localStorage.setItem("coding_solved_ids", JSON.stringify(solvedIds));
  }, [solvedIds]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("coding_notes", JSON.stringify(notes));
  }, [notes]);

  // List of all unique categories in CODING_BANK
  const categories = useMemo(() => {
    const cats = new Set(CODING_BANK.map((q) => q.category));
    return ["All", ...Array.from(cats)].sort();
  }, []);

  // Filtered questions list
  const filteredQuestions = useMemo(() => {
    return CODING_BANK.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || q.category === categoryFilter;

      const matchesDifficulty =
        difficultyFilter === "All" || q.difficulty === difficultyFilter;

      const isSolved = solvedIds.includes(q.id);
      const matchesSolved =
        solvedFilter === "All" ||
        (solvedFilter === "Solved" && isSolved) ||
        (solvedFilter === "Unsolved" && !isSolved);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesSolved;
    });
  }, [searchTerm, categoryFilter, difficultyFilter, solvedFilter, solvedIds]);

  // Get currently selected question
  const currentQuestion = useMemo(() => {
    return CODING_BANK.find((q) => q.id === selectedId) || CODING_BANK[0];
  }, [selectedId]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = CODING_BANK.length;
    const solved = solvedIds.length;
    const pct = total ? Math.round((solved / total) * 100) : 0;

    const easyTotal = CODING_BANK.filter((q) => q.difficulty === "Easy").length;
    const easySolved = CODING_BANK.filter(
      (q) => q.difficulty === "Easy" && solvedIds.includes(q.id)
    ).length;

    const medTotal = CODING_BANK.filter((q) => q.difficulty === "Medium").length;
    const medSolved = CODING_BANK.filter(
      (q) => q.difficulty === "Medium" && solvedIds.includes(q.id)
    ).length;

    const hardTotal = CODING_BANK.filter((q) => q.difficulty === "Hard").length;
    const hardSolved = CODING_BANK.filter(
      (q) => q.difficulty === "Hard" && solvedIds.includes(q.id)
    ).length;

    return {
      total,
      solved,
      pct,
      easyTotal,
      easySolved,
      medTotal,
      medSolved,
      hardTotal,
      hardSolved,
    };
  }, [solvedIds]);

  // Toggle solved status
  const handleToggleSolved = (id) => {
    setSolvedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((solvedId) => solvedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Select question handler
  const handleSelectQuestion = (id) => {
    setSelectedId(id);
    if (isMobile) {
      setViewMode("details");
    }
  };

  // Pick random question
  const handlePickRandom = () => {
    const pool = filteredQuestions.length > 0 ? filteredQuestions : CODING_BANK;
    const randomIndex = Math.floor(Math.random() * pool.length);
    handleSelectQuestion(pool[randomIndex].id);
  };

  // Copy code handler
  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Update scratchpad notes
  const handleNotesChange = (text) => {
    setNotes((prev) => ({
      ...prev,
      [selectedId]: text,
    }));
  };

  const currentNotesValue = notes[selectedId] || "";

  return (
    <div className="coding-layout">
      {/* ── Sidebar Component (Shown on Desktop, or when viewMode is "list" on Mobile) ── */}
      {(!isMobile || viewMode === "list") && (
        <div className="coding-sidebar">
          {/* Sidebar Title / Back Button */}
          <div className="coding-sidebar-header">
            <div className="title-row">
              <div className="logo-group">
                <Icons.Code2 size={18} className="sidebar-icon" />
                <h3>Programming Prep</h3>
              </div>
              <button className="random-btn" onClick={handlePickRandom} title="Pick Random Question">
                <Icons.Shuffle size={14} />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Premium Progress Card */}
            <div className="coding-progress-card">
              <div className="progress-info">
                <div className="percentage">{stats.pct}%</div>
                <div className="fraction">
                  <span>{stats.solved}</span> / {stats.total} Solved
                </div>
              </div>
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${stats.pct}%` }}
                />
              </div>
              <div className="difficulty-breakdown">
                <div className="diff-stat easy">
                  <span className="dot"></span>
                  <span className="label">Easy:</span>
                  <span className="val">{stats.easySolved}/{stats.easyTotal}</span>
                </div>
                <div className="diff-stat medium">
                  <span className="dot"></span>
                  <span className="label">Med:</span>
                  <span className="val">{stats.medSolved}/{stats.medTotal}</span>
                </div>
                <div className="diff-stat hard">
                  <span className="dot"></span>
                  <span className="label">Hard:</span>
                  <span className="val">{stats.hardSolved}/{stats.hardTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="coding-filters">
            {/* Search Bar */}
            <div className="search-box-wrapper">
              <Icons.Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
                  <Icons.X size={12} />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="filters-grid">
              {/* Category Filter */}
              <div className="filter-item">
                <label>Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Solved Status Filter */}
              <div className="filter-item">
                <label>Status</label>
                <select
                  value={solvedFilter}
                  onChange={(e) => setSolvedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All</option>
                  <option value="Solved">Solved</option>
                  <option value="Unsolved">Unsolved</option>
                </select>
              </div>
            </div>

            {/* Difficulty Tabs */}
            <div className="difficulty-tabs">
              {["All", "Easy", "Medium", "Hard"].map((diff) => {
                const isActive = difficultyFilter === diff;
                let count = 0;
                if (diff === "All") count = CODING_BANK.length;
                else count = CODING_BANK.filter((q) => q.difficulty === diff).length;

                return (
                  <button
                    key={diff}
                    className={`diff-tab-btn ${isActive ? "active" : ""} diff-${diff.toLowerCase()}`}
                    onClick={() => setDifficultyFilter(diff)}
                  >
                    {diff}
                    <span className="count-badge">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Scrollable List */}
          <div className="coding-questions-list-wrapper">
            {filteredQuestions.length === 0 ? (
              <div className="empty-results">
                <Icons.AlertCircle size={24} style={{ color: "var(--text-muted)", marginBottom: 8 }} />
                <p>No matching questions found.</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("All");
                    setDifficultyFilter("All");
                    setSolvedFilter("All");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="coding-questions-list">
                {filteredQuestions.map((q) => {
                  const isSelected = q.id === selectedId;
                  const isSolved = solvedIds.includes(q.id);
                  let diffClass = "diff-easy";
                  if (q.difficulty === "Medium") diffClass = "diff-medium";
                  else if (q.difficulty === "Hard") diffClass = "diff-hard";

                  return (
                    <div
                      key={q.id}
                      className={`question-list-item ${isSelected ? "selected" : ""} ${
                        isSolved ? "solved" : ""
                      }`}
                      onClick={() => handleSelectQuestion(q.id)}
                    >
                      <button
                        className="solve-checkbox-wrapper"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSolved(q.id);
                        }}
                        aria-label={isSolved ? "Mark as unsolved" : "Mark as solved"}
                      >
                        <div className={`solve-checkbox ${isSolved ? "checked" : ""}`}>
                          {isSolved && <Icons.Check size={10} strokeWidth={3} />}
                        </div>
                      </button>

                      <div className="question-info">
                        <div className="title-row">
                          <span className="question-title">{q.title}</span>
                        </div>
                        <div className="meta-row">
                          <span className={`difficulty-dot-badge ${diffClass}`}>
                            <span className="dot"></span>
                            {q.difficulty}
                          </span>
                          <span className="category-label">{q.category}</span>
                        </div>
                      </div>

                      <Icons.ChevronRight size={14} className="list-arrow" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Workspace Component (Shown on Desktop, or when viewMode is "details" on Mobile) ── */}
      {(!isMobile || viewMode === "details") && (
        <div className="coding-workspace">
          {/* Mobile Back Header */}
          {isMobile && (
            <button className="workspace-back-btn" onClick={() => setViewMode("list")}>
              <Icons.ArrowLeft size={16} />
              <span>Back to Problems</span>
            </button>
          )}

          {currentQuestion ? (
            <div className="workspace-container">
              {/* Question Header Card */}
              <div className="workspace-header">
                <div className="header-left">
                  <div className="category-meta">{currentQuestion.category}</div>
                  <h2>{currentQuestion.title}</h2>
                  <div className="header-badges">
                    <span
                      className={`difficulty-pill diff-${currentQuestion.difficulty.toLowerCase()}`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                    <span className="complexity-badge" title="Optimal Time Complexity">
                      <Icons.Clock size={11} />
                      Time: {currentQuestion.timeComplexity}
                    </span>
                    <span className="complexity-badge" title="Optimal Space Complexity">
                      <Icons.Cpu size={11} />
                      Space: {currentQuestion.spaceComplexity}
                    </span>
                  </div>
                </div>

                <div className="header-right">
                  <button
                    className={`mark-solved-toggle-btn ${
                      solvedIds.includes(currentQuestion.id) ? "is-solved" : ""
                    }`}
                    onClick={() => handleToggleSolved(currentQuestion.id)}
                  >
                    {solvedIds.includes(currentQuestion.id) ? (
                      <>
                        <Icons.CheckCircle size={15} />
                        <span>Solved!</span>
                      </>
                    ) : (
                      <>
                        <Icons.Circle size={15} />
                        <span>Mark as Solved</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="workspace-tabs">
                <button
                  className={`workspace-tab-btn ${workspaceTab === "description" ? "active" : ""}`}
                  onClick={() => setWorkspaceTab("description")}
                >
                  <Icons.FileText size={14} />
                  <span>Problem Description</span>
                </button>
                <button
                  className={`workspace-tab-btn ${workspaceTab === "testcases" ? "active" : ""}`}
                  onClick={() => setWorkspaceTab("testcases")}
                >
                  <Icons.Terminal size={14} />
                  <span>Test Cases</span>
                </button>
                <button
                  className={`workspace-tab-btn ${workspaceTab === "solution" ? "active" : ""}`}
                  onClick={() => setWorkspaceTab("solution")}
                >
                  <Icons.Code size={14} />
                  <span>Official Solutions</span>
                </button>
                <button
                  className={`workspace-tab-btn ${workspaceTab === "notes" ? "active" : ""}`}
                  onClick={() => setWorkspaceTab("notes")}
                >
                  <Icons.Edit3 size={14} />
                  <span>My Scratchpad</span>
                </button>
              </div>

              {/* Scrollable Tab Content Container */}
              <div className="workspace-content-body">
                {/* ── TAB 1: Problem Description ── */}
                {workspaceTab === "description" && (
                  <div className="tab-pane-content pane-description">
                    <div className="description-section">
                      <h4>Problem Statement</h4>
                      <p className="problem-text">{currentQuestion.description}</p>
                    </div>

                    <div className="constraints-section">
                      <h4>
                        <Icons.ShieldAlert size={14} style={{ marginRight: 6, color: "var(--pink)" }} />
                        Constraints
                      </h4>
                      <pre className="constraints-code">{currentQuestion.constraints}</pre>
                    </div>

                    <div className="explanation-section">
                      <h4>
                        <Icons.BookOpen size={14} style={{ marginRight: 6, color: "var(--accent)" }} />
                        Algorithmic Strategy
                      </h4>
                      <p className="explanation-text">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: Test Cases ── */}
                {workspaceTab === "testcases" && (
                  <div className="tab-pane-content pane-testcases">
                    <h4>Example Test Cases</h4>
                    <p className="subtitle-text">Review sample inputs and their corresponding output formats.</p>

                    <div className="testcases-list">
                      {currentQuestion.testCases.map((tc, index) => (
                        <div key={index} className="testcase-card">
                          <div className="testcase-card-header">
                            <span className="case-badge">Example {index + 1}</span>
                          </div>
                          <div className="testcase-io-grid">
                            <div className="io-block input-block">
                              <span className="label">Input</span>
                              <pre className="io-code">{tc.input}</pre>
                            </div>
                            <div className="io-block output-block">
                              <span className="label">Output</span>
                              <pre className="io-code">{tc.output}</pre>
                            </div>
                          </div>
                          {tc.explanation && (
                            <div className="tc-explanation">
                              <span className="label">Explanation:</span>
                              <span className="text">{tc.explanation}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── TAB 3: Code Solution ── */}
                {workspaceTab === "solution" && (
                  <div className="tab-pane-content pane-solution">
                    <div className="solution-header-row">
                      <div className="language-selector-tabs">
                        {["python", "cpp", "java", "javascript"].map((lang) => (
                          <button
                            key={lang}
                            className={`lang-tab-btn ${codeLanguage === lang ? "active" : ""}`}
                            onClick={() => setCodeLanguage(lang)}
                          >
                            {lang === "python" && "Python 3"}
                            {lang === "cpp" && "C++"}
                            {lang === "java" && "Java"}
                            {lang === "javascript" && "JavaScript"}
                          </button>
                        ))}
                      </div>

                      <button
                        className={`copy-code-btn ${copySuccess ? "copied" : ""}`}
                        onClick={() =>
                          handleCopyCode(
                            currentQuestion.solutions[codeLanguage] || "// No solution found."
                          )
                        }
                      >
                        {copySuccess ? (
                          <>
                            <Icons.Check size={13} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Icons.Copy size={13} />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="solution-code-block-wrapper">
                      <pre className="solution-code-block">
                        <code>{currentQuestion.solutions[codeLanguage]}</code>
                      </pre>
                    </div>

                    <div className="solution-complexities-card">
                      <div className="card-item">
                        <Icons.Clock size={16} className="item-icon time-icon" />
                        <div>
                          <h5>Time Complexity</h5>
                          <p className="complexity-text">
                            <code>{currentQuestion.timeComplexity}</code> — optimal processing boundary.
                          </p>
                        </div>
                      </div>
                      <div className="card-item">
                        <Icons.Cpu size={16} className="item-icon space-icon" />
                        <div>
                          <h5>Space Complexity</h5>
                          <p className="complexity-text">
                            <code>{currentQuestion.spaceComplexity}</code> — optimal memory allocation limit.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: Scratchpad Notes ── */}
                {workspaceTab === "notes" && (
                  <div className="tab-pane-content pane-notes">
                    <div className="notes-header">
                      <h4>Interactive Scratchpad</h4>
                      <p className="subtitle-text">
                        Draft your thoughts, trace operations, or sketch your personal implementation here. Progress is auto-saved locally.
                      </p>
                    </div>

                    <textarea
                      className="scratchpad-textarea"
                      placeholder="Write your pseudo-code, notes, or scratch logic here..."
                      value={currentNotesValue}
                      onChange={(e) => handleNotesChange(e.target.value)}
                    />

                    <div className="notes-footer-row">
                      <span className="autosaved-indicator">
                        <span className="pulse-dot"></span>
                        Auto-saved in browser
                      </span>
                      {currentNotesValue && (
                        <button
                          className="reset-notes-btn"
                          onClick={() => handleNotesChange("")}
                        >
                          Clear Scratchpad
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-workspace-state">
              <Icons.Code2 size={48} style={{ color: "var(--accent-soft)", marginBottom: 16 }} />
              <h3>Select a Coding Problem</h3>
              <p>Choose a question from the sidebar list to view its description, cases, and solutions.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
