// LoginPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ──────────────────────────────────────────────────────────
   Central brand palette (kept in-file for convenience)
   You can move this object to /src/theme.js and import it.
   ────────────────────────────────────────────────────────── */
const colors = {
  brandDark:  "#2C5F5F",   // main teal
  brandLight: "#F8F9FA",   // page background
  accent:     "#FF8C42",   // primary action (orange)
  text:       "#1F2937",
  muted:      "#6B7280",
  errorBg:    "#FEE2E2",
  errorText:  "#DC2626"
};

/* ──────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────── */
const LoginPage = ({ onLoginSuccess }) => {
  const [student_id, setStudentId]   = useState("");
  const [password, setPassword]      = useState("");
  const [showPassword, setShowPass]  = useState(false);
  const [isLoading, setIsLoading]    = useState(false);
  const [error, setError]            = useState("");

  const navigate = useNavigate();

  /* form submit handler */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!student_id || !password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
  student_id,
  password
});

      localStorage.setItem("token",       res.data.token);
      localStorage.setItem("student_id",  res.data.user.student_id);

      onLoginSuccess?.();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* allow Enter-key submission */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin(e);
  };

  /* inject keyframe + hover / focus helpers only once */
  useEffect(() => {
    const css = `
      @keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
      .login-btn:hover:not([disabled]){background:#E07B39}
      input:focus{border-color:${colors.brandDark};outline:none}
    `;
    const tag = document.createElement("style");
    tag.appendChild(document.createTextNode(css));
    document.head.appendChild(tag);
    return () => tag.remove();            // cleanup on unmount
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* ── header ─────────────────────────────── */}
        <header style={styles.header}>
          <div style={styles.logo}>🎓</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your student account</p>
        </header>

        {/* ── form ──────────────────────────────── */}
        <form onSubmit={handleLogin} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {/* student id */}
          <div style={styles.group}>
            <label style={styles.label}>Student ID</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                placeholder="Enter your student ID"
                value={student_id}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* password */}
          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPassword)}
                style={styles.toggleBtn}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* action button */}
          <button
            type="submit"
            className="login-btn"
            style={{
              ...styles.loginBtn,
              ...(isLoading ? styles.btnLoading : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={styles.spinner}></span>
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* ── footer ─────────────────────────────── */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Need help? <span style={styles.link}>Contact Support</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Inline-style sheet
   ────────────────────────────────────────────────────────── */
const styles = {
  /* page wrapper */
  container: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors.brandLight,
    // padding: "0 1rem",
    fontFamily: "'Inter', sans-serif"
  },

  /* card */
  loginCard: {
    width: "100%",
    maxWidth: 420,
    padding: "2.5rem 2.25rem",
    background: "#FFF",
    borderRadius: 16,
    border: `1px solid ${colors.brandDark}1A`,
    boxShadow: "0 10px 24px rgba(0,0,0,.05)"
  },

  /* header */
  header: { textAlign: "center", marginBottom: 28 },
  logo: {
    fontSize: 46,
    color: colors.accent,
    display: "inline-block"
  },
  title: {
    margin: "1rem 0 .25rem",
    fontSize: 26,
    fontWeight: 700,
    color: colors.brandDark
  },
  subtitle: { fontSize: 15, color: colors.muted },

  /* form */
  form: { display: "flex", flexDirection: "column", gap: 18 },

  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: colors.text },

  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    fontSize: 18,
    color: colors.muted
  },
  input: {
    width: "100%",
    padding: "11px 12px 11px 44px",
    fontSize: 15,
    border: `2px solid ${colors.brandDark}26`,
    borderRadius: 10,
    background: "#FFF",
    color: colors.text,
    transition: "border .25s"
  },
  toggleBtn: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    color: colors.muted
  },

  /* error */
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: colors.errorBg,
    border: `1px solid ${colors.errorText}66`,
    borderRadius: 8,
    padding: "10px 14px"
  },
  errorIcon: { fontSize: 16 },
  errorText: { color: colors.errorText, fontSize: 14, fontWeight: 500 },

  /* button */
  loginBtn: {
    marginTop: 8,
    padding: "12px 20px",
    fontSize: 16,
    fontWeight: 600,
    color: "#FFF",
    background: colors.accent,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background .25s",
    boxShadow: "0 4px 12px rgba(255,140,66,.3)"
  },
  btnLoading: { opacity: .6, cursor: "not-allowed" },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid transparent",
    borderTopColor: "#FFF",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  /* footer */
  footer: {
    marginTop: 32,
    paddingTop: 18,
    textAlign: "center",
    borderTop: `1px solid ${colors.brandDark}1A`
  },
  footerText: { fontSize: 14, color: colors.muted },
  link:       { color: colors.accent, fontWeight: 600, cursor: "pointer" }
};

export default LoginPage;