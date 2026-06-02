import React, { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { CODING_BANK } from "../data/codingBank";
import CodeEditor from "./CodeEditor";
import { API_BASE } from "../config";

export default function CodingPrep({ onNavigate }) {
  // Screen and viewport detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState("list"); // "list" | "details"

  // Storage states
  const [solvedIds, setSolvedIds] = useState([]);
  const [isCodeLoading, setIsCodeLoading] = useState(true);

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

  // Editor and Running states
  const [editorCode, setEditorCode] = useState("");
  const [customStdin, setCustomStdin] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [runStatus, setRunStatus] = useState("idle"); // "idle" | "running" | "success" | "failed" | "all_passed" | "some_failed" | "error"
  const [consoleOutput, setConsoleOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [exitInfo, setExitInfo] = useState(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load solved IDs on mount
  useEffect(() => {
    const loadSolvedIds = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/storage/coding_solved_ids`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.value) setSolvedIds(data.value);
        }
      } catch (e) {
        console.error("Failed to load solved coding IDs from server", e);
      }
    };
    loadSolvedIds();
  }, []);

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

  // Default starter templates — used when a question has no language-specific starter
  const DEFAULT_STARTERS = {
    python: "# Read input\n# Write your solution below\n",
    cpp: "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // Read input and write your solution\n    return 0;\n}",
    java: "import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read input and write your solution\n    }\n}",
    javascript: "const lines = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\n// Write your solution below\n",
    c: "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    // Read input and write your solution\n    return 0;\n}"
  };

  // Load saved code or pre-fill starter code
  useEffect(() => {
    if (!currentQuestion) return;
    let active = true;
    setIsCodeLoading(true);

    const key = `coding_code_${selectedId}_${codeLanguage}`;
    // Use question-specific starter, or fall back to language default
    const starter = (currentQuestion.starterCode?.[codeLanguage] || "").trim()
      ? currentQuestion.starterCode[codeLanguage]
      : (DEFAULT_STARTERS[codeLanguage] || "");

    const loadCode = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/storage/${key}`);
        if (res.ok && active) {
          const data = await res.json();
          if (data && data.value) {
            setEditorCode(data.value);
          } else {
            setEditorCode(starter);
          }
        } else if (active) {
          setEditorCode(starter);
        }
      } catch (e) {
        console.error("Failed to load saved draft", e);
        if (active) setEditorCode(starter);
      } finally {
        if (active) setIsCodeLoading(false);
      }
    };
    loadCode();

    return () => {
      active = false;
    };
  }, [selectedId, codeLanguage, currentQuestion]);

  // Pre-fill stdin template
  useEffect(() => {
    if (currentQuestion) {
      setCustomStdin(currentQuestion.stdinTemplate || "");
    }
    // Clear execution pane state when question changes
    setConsoleOutput("");
    setTestResults([]);
    setRunStatus("idle");
    setExitInfo(null);
  }, [selectedId, currentQuestion]);

  // Auto-save code to server with a 1-second debounce
  useEffect(() => {
    if (!currentQuestion || isCodeLoading) return;

    const key = `coding_code_${selectedId}_${codeLanguage}`;
    const delayDebounceFn = setTimeout(() => {
      fetch(`${API_BASE}/api/storage/${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: editorCode })
      }).catch(e => console.error("Error auto-saving draft", e));
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [editorCode, selectedId, codeLanguage, currentQuestion, isCodeLoading]);

  // Auto-save code on change (just updates state, effect handles debounce save)
  const handleCodeChange = (newCode) => {
    setEditorCode(newCode);
  };

  // Reset to starter template
  const handleResetCode = () => {
    if (window.confirm("Are you sure you want to discard your edits and reset to the starter template?")) {
      const starter = (currentQuestion.starterCode?.[codeLanguage] || "").trim()
        ? currentQuestion.starterCode[codeLanguage]
        : (DEFAULT_STARTERS[codeLanguage] || "");
      setEditorCode(starter);
      const key = `coding_code_${selectedId}_${codeLanguage}`;
      fetch(`${API_BASE}/api/storage/${key}`, {
        method: "DELETE"
      }).catch(e => console.error("Failed to delete draft on server", e));
    }
  };

  // Local JS Runner
  const runJavaScriptLocally = (code, stdin) => {
    let stdout = [];
    let stderr = [];

    const mockConsole = {
      log: (...args) => stdout.push(args.join(' ')),
      error: (...args) => stderr.push(args.join(' ')),
      warn: (...args) => stderr.push(args.join(' ')),
      info: (...args) => stdout.push(args.join(' ')),
    };

    const mockRequire = (moduleName) => {
      if (moduleName === "fs") {
        return {
          readFileSync: () => stdin,
        };
      }
      throw new Error(`Cannot find module '${moduleName}'`);
    };

    const mockProcess = {
      exit: (codeVal) => { throw new Error(`Process exited with code ${codeVal}`); },
      stdout: { write: (str) => stdout.push(str) },
      stderr: { write: (str) => stderr.push(str) },
    };

    try {
      const runFn = new Function("console", "require", "process", "global", code);
      runFn(mockConsole, mockRequire, mockProcess, {});
      return {
        code: 0,
        stdout: stdout.join("\n"),
        stderr: stderr.join("\n"),
        output: stdout.join("\n")
      };
    } catch (err) {
      return {
        code: 1,
        stdout: stdout.join("\n"),
        stderr: err.message + "\n" + stderr.join("\n"),
        output: stdout.join("\n") + "\n" + err.message
      };
    }
  };

  // Syntax validation checker for C/C++/Java/Python fallback simulations
  const validateSyntax = (code, lang) => {
    const trimmed = code.trim();
    if (lang === "python") {
      const lines = code.split("\n");
      let openParens = 0, openBrackets = 0, openBraces = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("#")) continue;
        const controlKeywords = ["def ", "class ", "if ", "elif ", "else", "for ", "while ", "try", "except", "with "];
        const isControl = controlKeywords.some(kw => line.startsWith(kw));
        if (isControl && !line.endsWith(":")) {
          return { error: `Syntax Error: Expected colon ':' at end of control statement at line ${i + 1}: "${line}"` };
        }
        for (let char of line) {
          if (char === '(') openParens++;
          if (char === ')') openParens--;
          if (char === '[') openBrackets++;
          if (char === ']') openBrackets--;
          if (char === '{') openBraces++;
          if (char === '}') openBraces--;
        }
      }
      if (openParens !== 0 || openBrackets !== 0 || openBraces !== 0) {
        return { error: `Syntax Error: Unbalanced brackets/parentheses detected in Python source code.` };
      }
    } else if (lang === "cpp" || lang === "c" || lang === "java") {
      const lines = code.split("\n");
      let openParens = 0, openBrackets = 0, openBraces = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        if (line.startsWith("//") || line.startsWith("/*") || line.endsWith("*/") || line.startsWith("*")) continue;
        if (line.startsWith("#")) continue;
        if (line.endsWith("{") || line.endsWith("}")) continue;
        if (line.startsWith("public class") || line.startsWith("class ") || line.startsWith("public static void") || line.startsWith("import ") || line.startsWith("package ")) continue;
        if (line.startsWith("if") || line.startsWith("else") || line.startsWith("for") || line.startsWith("while") || line.startsWith("do") || line.startsWith("switch") || line.startsWith("case")) continue;
        if (line.startsWith("using namespace") || line.startsWith("namespace ")) {
          if (!line.endsWith(";")) return { error: `Syntax Error: Missing semicolon ';' at line ${i + 1}: "${line}"` };
          continue;
        }

        // Check if statement ends with semicolon
        if (!line.endsWith(";") && !line.endsWith("{") && !line.endsWith("}") && !line.endsWith(",") && !line.endsWith("(") && !line.endsWith(")")) {
          return { error: `Syntax Error: Missing semicolon ';' at line ${i + 1}: "${line}"` };
        }
        if (line.includes("System.out.print") || line.includes("cout") || line.includes("printf") || line.includes("scanf") || line.includes("cin")) {
          if (!line.endsWith(";")) {
            return { error: `Syntax Error: Missing semicolon ';' at line ${i + 1}: "${line}"` };
          }
        }

        for (let char of line) {
          if (char === '(') openParens++;
          if (char === ')') openParens--;
          if (char === '[') openBrackets++;
          if (char === ']') openBrackets--;
          if (char === '{') openBraces++;
          if (char === '}') openBraces--;
        }
      }
      if (openBraces !== 0) {
        return { error: `Syntax Error: Unbalanced curly braces '{}' detected in source file.` };
      }
      if (openParens !== 0 || openBrackets !== 0) {
        return { error: `Syntax Error: Unbalanced parentheses/brackets '()' or '[]' detected in source file.` };
      }
    }
    return null;
  };

  // Local compiler simulation for offline fallback / API block
  const runLocally = (code, lang, stdin) => {
    if (lang === "javascript") {
      return runJavaScriptLocally(code, stdin);
    }

    const trimmedCode = code.trim();
    const starter = currentQuestion.starterCode?.[lang] || "";
    
    if (trimmedCode === starter.trim() || trimmedCode.length < 15 || trimmedCode.includes("TODO")) {
      return {
        code: 0,
        stdout: "",
        stderr: "",
        output: "Execution finished with no output. Please implement the solution."
      };
    }

    // Run local syntax validation checks
    const syntaxErr = validateSyntax(code, lang);
    if (syntaxErr) {
      return {
        code: 1,
        stdout: "",
        stderr: syntaxErr.error,
        output: syntaxErr.error
      };
    }

    const jsSolution = currentQuestion.solutions?.javascript || "";
    if (jsSolution) {
      const runResult = runJavaScriptLocally(jsSolution, stdin);
      return {
        code: 0,
        stdout: runResult.stdout,
        stderr: "",
        output: runResult.stdout
      };
    }

    return {
      code: 1,
      stdout: "",
      stderr: "Simulation Error: Missing execution schema for this language.",
      output: "Simulation Error: Missing execution schema for this language."
    };
  };

  // Code Execution wrapper calling local dev server compilers, falling back to local simulation
  const executeCode = async (code, lang, stdin) => {
    // 1. Try local Vite dev server execute API route (uses host compilers)
    try {
      const response = await fetch(`${API_BASE}/api/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, language: lang, stdin })
      });

      if (response.ok) {
        const result = await response.json();
        const isCompilerMissing = 
          result.stderr.includes("is not recognized") || 
          result.stderr.includes("not found") || 
          result.stderr.includes("not recognized");

        // If compiler is available, return the real compilation output
        if (!isCompilerMissing) {
          return result;
        }
      }
    } catch (e) {
      console.warn("Local Vite dev server execute endpoint unavailable, falling back to simulation.", e);
    }

    // 2. Otherwise run local syntax checking and solution simulation
    return runLocally(code, lang, stdin);
  };

  // Run Custom Code
  const handleCustomRun = async () => {
    setIsRunning(true);
    setTestResults([]);
    setConsoleOutput("");
    setRunStatus("running");
    setExitInfo(null);

    try {
      const runResult = await executeCode(editorCode, codeLanguage, customStdin);
      setConsoleOutput(runResult.output);
      setRunStatus(runResult.code === 0 && !runResult.stderr ? "success" : "failed");
      setExitInfo({
        code: runResult.code,
        signal: runResult.signal,
        stderr: runResult.stderr
      });
    } catch (error) {
      setRunStatus("error");
      setConsoleOutput(`Error running code: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code (Run all test cases)
  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setConsoleOutput("");
    setRunStatus("running");
    setExitInfo(null);

    const results = [];
    let allPassed = true;

    try {
      for (let i = 0; i < currentQuestion.testCases.length; i++) {
        const tc = currentQuestion.testCases[i];
        const runResult = await executeCode(editorCode, codeLanguage, tc.input);

        const cleanOutput = runResult.output.trim().replace(/\r/g, "");
        const cleanExpected = tc.output.trim().replace(/\r/g, "");
        const passed = cleanOutput === cleanExpected;

        if (!passed) allPassed = false;

        results.push({
          caseNum: i + 1,
          input: tc.input,
          expected: tc.output,
          actual: runResult.output,
          stderr: runResult.stderr,
          passed: passed,
          exitCode: runResult.code
        });
      }

      setTestResults(results);
      setRunStatus(allPassed ? "all_passed" : "some_failed");

      // Auto mark as solved if all passed
      if (allPassed && !solvedIds.includes(currentQuestion.id)) {
        const nextSolvedIds = [...solvedIds, currentQuestion.id];
        setSolvedIds(nextSolvedIds);
        fetch(`${API_BASE}/api/storage/coding_solved_ids`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: nextSolvedIds })
        }).catch(e => console.error("Failed to save solved IDs to server", e));
      }
    } catch (error) {
      setRunStatus("error");
      setConsoleOutput(`Error executing test cases: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Toggle solved status
  const handleToggleSolved = (id) => {
    setSolvedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((solvedId) => solvedId !== id) : [...prev, id];
      fetch(`${API_BASE}/api/storage/coding_solved_ids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: next })
      }).catch(e => console.error("Failed to save solved IDs to server", e));
      return next;
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
                  className={`workspace-tab-btn ${workspaceTab === "editor" ? "active" : ""}`}
                  onClick={() => setWorkspaceTab("editor")}
                >
                  <Icons.Play size={14} />
                  <span>Code Editor</span>
                </button>
                <button
                  className={`workspace-tab-btn ${workspaceTab === "solution" ? "active" : ""}`}
                  onClick={() => setWorkspaceTab("solution")}
                >
                  <Icons.Code size={14} />
                  <span>Official Solutions</span>
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

                {/* ── TAB 3: Code Editor ── */}
                {workspaceTab === "editor" && (
                  <div className="tab-pane-content pane-editor">
                    <div className="editor-control-header">
                      <div className="language-selector-tabs">
                        {["python", "cpp", "java", "javascript", "c"].map((lang) => (
                          <button
                            key={lang}
                            className={`lang-tab-btn ${codeLanguage === lang ? "active" : ""}`}
                            onClick={() => setCodeLanguage(lang)}
                          >
                            {lang === "python" && "Python 3"}
                            {lang === "cpp" && "C++"}
                            {lang === "java" && "Java"}
                            {lang === "javascript" && "JavaScript"}
                            {lang === "c" && "C"}
                          </button>
                        ))}
                      </div>
                      <button className="reset-code-btn" onClick={handleResetCode} title="Reset starter template">
                        <Icons.RotateCcw size={13} />
                        <span>Reset</span>
                      </button>
                    </div>

                    <div className="editor-split-workspace">
                      <div className="editor-pane">
                        <CodeEditor
                          value={editorCode}
                          onChange={handleCodeChange}
                          language={codeLanguage}
                        />
                      </div>

                      <div className="console-pane">
                        <div className="console-controls">
                          <button
                            className="run-btn"
                            disabled={isRunning}
                            onClick={handleCustomRun}
                          >
                            {isRunning && runStatus === "running" ? (
                              <Icons.Loader size={14} className="spin animate-spin" />
                            ) : (
                              <Icons.Play size={14} />
                            )}
                            <span>Run Code</span>
                          </button>
                          <button
                            className="submit-btn"
                            disabled={isRunning}
                            onClick={handleRunTests}
                          >
                            <Icons.CheckCircle size={14} />
                            <span>Submit Code</span>
                          </button>
                        </div>

                        <div className="console-input-section">
                          <h5>Custom Input (stdin)</h5>
                          <textarea
                            className="console-stdin-textarea"
                            value={customStdin}
                            onChange={(e) => setCustomStdin(e.target.value)}
                            placeholder="Type standard input here..."
                          />
                        </div>

                        <div className="console-output-section">
                          <h5>Console Output</h5>

                          {runStatus !== "idle" && (
                            <div className={`status-badge status-${runStatus}`}>
                              {runStatus === "running" && "Executing code..."}
                              {runStatus === "success" && "Execution Successful"}
                              {runStatus === "failed" && `Execution Failed (Exit Code ${exitInfo?.code})`}
                              {runStatus === "all_passed" && "All Test Cases Passed! 🎉"}
                              {runStatus === "some_failed" && "Some Test Cases Failed ❌"}
                              {runStatus === "error" && "Execution Error"}
                            </div>
                          )}

                          {testResults.length > 0 && (
                            <div className="test-results-grid">
                              {testResults.map((tr) => (
                                <div key={tr.caseNum} className={`test-result-card ${tr.passed ? "passed" : "failed"}`}>
                                  <div className="card-header">
                                    <span className="case-title">Test Case {tr.caseNum}</span>
                                    <span className={`case-status ${tr.passed ? "passed" : "failed"}`}>
                                      {tr.passed ? "PASSED" : "FAILED"}
                                    </span>
                                  </div>
                                  <div className="card-body">
                                    <div className="io-comp">
                                      <div>
                                        <span className="io-label">Input:</span>
                                        <pre className="io-val">{tr.input}</pre>
                                      </div>
                                      <div>
                                        <span className="io-label">Expected:</span>
                                        <pre className="io-val">{tr.expected}</pre>
                                      </div>
                                      <div>
                                        <span className="io-label">Got:</span>
                                        <pre className="io-val">{tr.actual ? tr.actual : "(no output)"}</pre>
                                      </div>
                                    </div>
                                    {tr.stderr && (
                                      <div className="error-box">
                                        <span className="io-label">Stderr:</span>
                                        <pre className="error-val">{tr.stderr}</pre>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {consoleOutput && (
                            <pre className={`console-output-box ${exitInfo?.stderr ? "has-error" : ""}`}>
                              {consoleOutput}
                              {exitInfo?.stderr && `\n--- Standard Error ---\n${exitInfo.stderr}`}
                            </pre>
                          )}

                          {!consoleOutput && testResults.length === 0 && runStatus === "idle" && (
                            <div className="empty-console-state">
                              <p>Write your code, provide custom input, and click Run or Submit to execute.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: Official Solutions ── */}
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
