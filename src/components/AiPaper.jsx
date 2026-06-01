import React, { useState } from "react";
import * as Icons from "lucide-react";
import { QB, CATEGORY_CONFIG } from "../data/questionBank";

export default function AiPaper({ 
  onStartCustomTest, 
  onNavigate 
}) {
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [topic, setTopic] = useState("Quantitative Aptitude");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");
  const [saveKey, setSaveKey] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(""); // "", "testing", "success", "failed"

  const handleSaveKeyChange = (e) => {
    setSaveKey(e.target.checked);
  };

  const testApiConnection = async () => {
    if (!apiKey.trim()) {
      setError("Please enter a Gemini API Key to test.");
      return;
    }
    setConnectionStatus("testing");
    setError("");
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 2 }
        })
      });
      if (res.ok) {
        setConnectionStatus("success");
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
      setConnectionStatus("failed");
    }
  };

  const fetchBatch = async (count, topicName, key) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate exactly ${count} challenging and realistic exam MCQ questions for the topic: "${topicName}". 
Return ONLY a valid JSON array, no markdown wrappers, no explanations outside the JSON. Format:
[
  {"q": "Question text here. Include code snippet if applicable.", "opts": ["Option A", "Option B", "Option C", "Option D"], "ans": 0, "sol": "Detailed step-by-step solution here."}
]
The "ans" field must be the 0-based index (0, 1, 2, or 3) of the correct option in the "opts" array. Make the questions exam-realistic, covering aptitude syllabus standards.`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      throw new Error("No response candidates returned from Gemini API.");
    }

    const rawText = data.candidates[0].content.parts[0].text.trim();
    const parsed = JSON.parse(rawText);
    
    if (!Array.isArray(parsed)) {
      throw new Error("API did not return a valid list of questions.");
    }
    return parsed;
  };

  const generatePaper = async () => {
    // If no API key is provided, trigger the Local Simulator Fallback
    if (!apiKey || apiKey.trim() === "") {
      triggerLocalSimulator();
      return;
    }

    setLoading(true);
    setError("");
    setProgressText("Initializing API connection...");

    if (saveKey) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
    } else {
      localStorage.removeItem("gemini_api_key");
    }

    try {
      const batchSize = 15; // Safe size to fit inside 8k output token limit
      const numBatches = Math.ceil(numQuestions / batchSize);
      const batchCounts = [];
      let remaining = numQuestions;
      for (let i = 0; i < numBatches; i++) {
        const currentBatch = Math.min(batchSize, remaining);
        batchCounts.push(currentBatch);
        remaining -= currentBatch;
      }

      let allQuestions = [];
      for (let i = 0; i < batchCounts.length; i++) {
        const count = batchCounts[i];
        setProgressText(`Generating batch ${i + 1} of ${numBatches} (${count} questions)...`);
        const batchQuestions = await fetchBatch(count, topic, apiKey.trim());
        allQuestions = allQuestions.concat(batchQuestions);
      }

      if (allQuestions.length === 0) {
        throw new Error("No questions were generated.");
      }

      const enriched = allQuestions.map((q, idx) => ({
        ...q,
        id: `ai_${Date.now()}_${idx}`,
        cat: topic
      }));

      onStartCustomTest(enriched, topic);
    } catch (e) {
      console.error(e);
      setError(`Failed to generate via Gemini API: ${e.message}. Triggering Local Simulator fallback instead.`);
      // Delay slightly then run fallback so user sees what happened
      setTimeout(() => {
        triggerLocalSimulator();
      }, 4000);
    } finally {
      setLoading(false);
      setProgressText("");
    }
  };

  const triggerLocalSimulator = () => {
    setLoading(true);
    setError("");
    setProgressText("Building paper from local database...");
    
    // Simulate generation delay
    setTimeout(() => {
      // Pull random questions from the database for the selected topic
      const pool = QB.filter(q => q.cat === topic);
      if (pool.length === 0) {
        setError(`No questions available for topic: ${topic}`);
        setLoading(false);
        setProgressText("");
        return;
      }
      
      // Shuffle pool
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));
      
      const enriched = selected.map((q, idx) => ({
        ...q,
        id: `local_ai_${Date.now()}_${idx}`,
        cat: topic
      }));
      
      setLoading(false);
      setProgressText("");
      onStartCustomTest(enriched, topic);
    }, 1500);
  };

  return (
    <div className="config-container">
      <button onClick={() => onNavigate("dashboard")} className="back-button">
        <Icons.ChevronLeft size={15} /> Back
      </button>

      <div className="card card-lg">
        <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent-text)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icons.Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.02em" }}>AI Mock Generator</h3>
            <p style={{ color: "var(--t2)", fontSize: 13, marginTop: 3, lineHeight: 1.55 }}>
              Generate a custom paper via Gemini API, or use the local simulator.
            </p>
          </div>
        </div>

        {/* API Key input */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>Gemini API Key</label>
            {apiKey.trim() && (
              <button
                type="button"
                onClick={testApiConnection}
                disabled={connectionStatus === "testing"}
                style={{
                  background: "none",
                  border: "none",
                  color: connectionStatus === "success" ? "var(--green)" : connectionStatus === "failed" ? "var(--red)" : "var(--accent-text)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                {connectionStatus === "testing" && <Icons.RefreshCw size={11} className="animate-spin" />}
                {connectionStatus === "success" && <Icons.CheckCircle size={11} />}
                {connectionStatus === "failed" && <Icons.XCircle size={11} />}
                {connectionStatus === "testing" ? "Testing..." : connectionStatus === "success" ? "Key Validated!" : connectionStatus === "failed" ? "Validation Failed" : "Validate Key"}
              </button>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showKey ? "text" : "password"}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setConnectionStatus("");
              }}
              className="custom-select"
              style={{ paddingLeft: 40, paddingRight: 40 }}
            />
            <Icons.Key size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--t3)" }} />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="input-icon-btn"
              title={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <Icons.EyeOff size={15} /> : <Icons.Eye size={15} />}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <input type="checkbox" id="save-key" checked={saveKey} onChange={handleSaveKeyChange} style={{ accentColor: "var(--accent)" }} />
            <label htmlFor="save-key" style={{ margin: 0, fontSize: 12, cursor: "pointer", color: "var(--t2)" }}>
              Remember key in browser localStorage
            </label>
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "var(--accent-soft)", border: "1px solid var(--accent-line)", fontSize: 12, color: "var(--t2)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--accent-text)" }}>No API key?</strong> Leave blank to use the <strong>Local Simulator</strong> — it builds a paper from the offline database instantly.
          </div>
        </div>

        {/* Topic choice */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>AI Question Topic</label>
          </div>
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            className="custom-select"
          >
            {CATEGORY_CONFIG.slice(1).map(c => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Question count input */}
        <div className="config-form-group">
          <div className="config-label-wrapper">
            <label>Number of Questions</label>
            <span className="config-value">{numQuestions}</span>
          </div>
          <input 
            type="number" 
            min="5" 
            max="150" 
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.max(5, Math.min(150, parseInt(e.target.value) || 10)))}
            className="settings-input"
            style={{ width: "100%" }}
          />
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
            Enter a value between 5 and 150. Large counts (50+) may take up to 30 seconds to generate.
          </div>
        </div>

        {error && (
          <div style={{ margin: "16px 0", padding: "12px 16px", borderRadius: 10, background: "var(--red-soft)", border: "1px solid var(--red-line)", color: "var(--red)", fontSize: 13, lineHeight: 1.5 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Icons.AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <button
          onClick={generatePaper}
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", padding: "13px 20px", borderRadius: 10, fontSize: 15, marginTop: 4 }}
        >
          {loading ? (
            <>
              <Icons.RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} />
              {progressText || `Generating ${numQuestions} questions...`}
            </>
          ) : (
            <>
              <Icons.Sparkles size={15} />
              {apiKey.trim() ? "Generate via Gemini API" : "Start Local Simulator"}
            </>
          )}
        </button>
      </div>

      {/* CSS Spin Keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
