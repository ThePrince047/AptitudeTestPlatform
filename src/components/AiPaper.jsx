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
  const [error, setError] = useState("");
  const [saveKey, setSaveKey] = useState(true);

  const handleSaveKeyChange = (e) => {
    setSaveKey(e.target.checked);
  };

  const generatePaper = async () => {
    // If no API key is provided, trigger the Local Simulator Fallback
    if (!apiKey || apiKey.trim() === "") {
      triggerLocalSimulator();
      return;
    }

    setLoading(true);
    setError("");

    if (saveKey) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
    } else {
      localStorage.removeItem("gemini_api_key");
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate exactly ${numQuestions} challenging and realistic TCS NQT exam MCQ questions for the topic: "${topic}". 
Return ONLY a valid JSON array, no markdown wrappers, no explanations outside the JSON. Format:
[
  {"q": "Question text here. Include code snippet if applicable.", "opts": ["Option A", "Option B", "Option C", "Option D"], "ans": 0, "sol": "Detailed step-by-step solution here."}
]
The "ans" field must be the 0-based index (0, 1, 2, or 3) of the correct option in the "opts" array. Make the questions exam-realistic, covering NQT syllabus standards.`
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
        throw new Error("No response candidates returned from Gemini API. Check your key and parameters.");
      }

      const rawText = data.candidates[0].content.parts[0].text.trim();
      const parsed = JSON.parse(rawText);
      
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("API did not return a valid list of questions.");
      }

      const enriched = parsed.map((q, idx) => ({
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
    }
  };

  const triggerLocalSimulator = () => {
    setLoading(true);
    setError("");
    
    // Simulate generation delay
    setTimeout(() => {
      // Pull random questions from the database for the selected topic
      const pool = QB.filter(q => q.cat === topic);
      if (pool.length === 0) {
        setError(`No questions available for topic: ${topic}`);
        setLoading(false);
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
      onStartCustomTest(enriched, topic);
    }, 1500);
  };

  return (
    <div className="config-container">
      <button onClick={() => onNavigate("dashboard")} className="back-button">
        <Icons.ChevronLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-card">
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "var(--primary)" }}>
            <Icons.Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#FFF" }}>AI Mock Test Generator</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px", lineHeight: "1.5" }}>
              Generate a custom mock paper powered by Google Gemini. Enter your Gemini API Key below to fetch fresh, dynamically generated questions.
            </p>
          </div>
        </div>

        {/* API Key input */}
        <div className="settings-input-group">
          <label>Gemini API Key</label>
          <div style={{ position: "relative" }}>
            <input 
              type="password" 
              placeholder="AIzaSy..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="settings-input"
              style={{ paddingLeft: "40px" }}
            />
            <Icons.Key size={16} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "16px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
            <input 
              type="checkbox" 
              id="save-key" 
              checked={saveKey}
              onChange={handleSaveKeyChange}
              style={{ accentColor: "var(--primary)" }}
            />
            <label htmlFor="save-key" style={{ margin: 0, fontSize: "12px", cursor: "pointer", userSelect: "none" }}>
              Remember Key locally (saves in browser localStorage)
            </label>
          </div>
          
          <div 
            style={{ 
              marginTop: "12px", 
              padding: "10px 14px", 
              borderRadius: "8px", 
              backgroundColor: "rgba(99, 102, 241, 0.04)", 
              border: "1px solid rgba(99, 102, 241, 0.1)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              lineHeight: "1.5"
            }}
          >
            <strong>Note on Fallback:</strong> If no API key is supplied, the portal will run in <strong>Local Simulator Mode</strong>. It will automatically build a realistic NQT paper from the offline questions database immediately!
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
          <div 
            style={{ 
              margin: "20px 0", 
              padding: "12px 16px", 
              borderRadius: "10px", 
              backgroundColor: "rgba(239, 68, 68, 0.05)", 
              border: "1px solid var(--error-border)",
              color: "var(--error)",
              fontSize: "13px",
              lineHeight: "1.5"
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <Icons.AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <button 
          onClick={generatePaper}
          disabled={loading}
          className="btn btn-accent"
          style={{ width: "100%", padding: "16px", borderRadius: "12px", fontSize: "16px", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <Icons.RefreshCw size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
              Generating {numQuestions} NQT Questions...
            </>
          ) : (
            <>
              <Icons.Sparkles size={16} />
              {apiKey.trim() ? "Generate via Gemini API" : "Start Local NQT Simulator"}
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
