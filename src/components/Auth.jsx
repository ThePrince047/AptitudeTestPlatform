import React, { useState } from "react";
import * as Icons from "lucide-react";
import { API_BASE } from "../config";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin 
        ? { username, password }
        : { username, password, geminiApiKey };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please try again.");
      }

      if (data.token && data.user) {
        localStorage.setItem("nqt_auth_token", data.token);
        localStorage.setItem("nqt_auth_user", JSON.stringify(data.user));
        onAuthSuccess(data.token, data.user);
      } else {
        throw new Error("Invalid response payload from server.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card card card-lg">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <Icons.GraduationCap size={24} color="#fff" />
          </div>
          <h2>MockTest Portal</h2>
          <p>{isLogin ? "Welcome back! Log in to continue your preparation." : "Create an account to start tracking your progress."}</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <Icons.AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Field */}
          <div className="config-form-group">
            <label className="auth-label">Username</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="custom-input auth-input"
                required
                disabled={loading}
              />
              <Icons.User size={15} className="auth-input-icon" />
            </div>
          </div>

          {/* Password Field */}
          <div className="config-form-group">
            <label className="auth-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input auth-input"
                required
                disabled={loading}
              />
              <Icons.Lock size={15} className="auth-input-icon" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-btn"
                title={showPassword ? "Hide password" : "Show password"}
                style={{ right: 12 }}
              >
                {showPassword ? <Icons.EyeOff size={15} /> : <Icons.Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Register Only) */}
          {!isLogin && (
            <div className="config-form-group">
              <label className="auth-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="custom-input auth-input"
                  required
                  disabled={loading}
                />
                <Icons.CheckSquare size={15} className="auth-input-icon" />
              </div>
            </div>
          )}

          {/* Gemini API Key Field (Register Only, Optional) */}
          {!isLogin && (
            <div className="config-form-group">
              <div className="config-label-wrapper">
                <label className="auth-label">Gemini API Key <span style={{ color: "var(--t3)", fontWeight: 400 }}>(Optional)</span></label>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  placeholder="AIzaSy... (Will be stored securely in DB)"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="custom-input auth-input"
                  disabled={loading}
                />
                <Icons.Key size={15} className="auth-input-icon" />
              </div>
              <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 6, lineHeight: 1.4 }}>
                If provided, we will automatically set this key for your custom AI Paper generation so you don't need to configure it later.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px 20px", borderRadius: 8, fontSize: 14.5, marginTop: 12 }}
          >
            {loading ? (
              <>
                <Icons.Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
                Connecting...
              </>
            ) : (
              <>
                {isLogin ? <Icons.LogIn size={16} /> : <Icons.UserPlus size={16} />}
                {isLogin ? "Sign In" : "Create Account"}
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle-container">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="auth-toggle-btn"
            disabled={loading}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>

      <style>{`
        .auth-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(circle at center, #181024 0%, var(--bg) 70%);
          padding: 24px;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          border-color: var(--accent-line);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 100px rgba(124, 58, 237, 0.05);
          backdrop-filter: blur(12px);
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-brand {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-logo-icon {
          width: 48px;
          height: 48px;
          background: var(--accent);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          box-shadow: 0 8px 16px rgba(124, 58, 237, 0.3);
        }
        .auth-brand h2 {
          font-size: 22px;
          font-weight: 800;
          color: var(--t1);
          letter-spacing: -0.03em;
        }
        .auth-brand p {
          font-size: 13px;
          color: var(--t2);
          margin-top: 6px;
          line-height: 1.5;
        }
        .auth-form {
          margin-top: 8px;
        }
        .auth-label {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--t2);
          margin-bottom: 8px;
          display: block;
        }
        .auth-input {
          padding-left: 40px !important;
          background: var(--bg-hover) !important;
        }
        .auth-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--t3);
          pointer-events: none;
        }
        .auth-error-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: var(--red-soft);
          border: 1px solid var(--red-line);
          border-radius: 8px;
          color: var(--red);
          font-size: 13px;
          line-height: 1.45;
          margin-bottom: 18px;
          animation: shake 0.3s ease;
        }
        .auth-toggle-container {
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          font-size: 13px;
          color: var(--t2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .auth-toggle-btn {
          background: none;
          border: none;
          color: var(--accent-text);
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          padding: 2px 4px;
        }
        .auth-toggle-btn:hover {
          text-decoration: underline;
        }
        @keyframes slide-up {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
