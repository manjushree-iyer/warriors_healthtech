import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../css/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login: ctxLogin } = useAuth();

  // Two tabs: email (doctor/pharmacy) or ABHA ID (patient)
  const [loginMode, setLoginMode] = useState("email"); // "email" | "abha"
  const [form, setForm] = useState({ email: "", abha_id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.password) {
      setError("Password is required.");
      return;
    }
    if (loginMode === "email" && !form.email) {
      setError("Email is required.");
      return;
    }
    if (loginMode === "abha" && !form.abha_id) {
      setError("ABHA ID is required.");
      return;
    }

    setLoading(true);
    try {
      const payload =
        loginMode === "abha"
          ? { abha_id: form.abha_id, password: form.password }
          : { email: form.email, password: form.password };

      const data = await login(payload);
      ctxLogin(data.user);

      // Role-based redirect
      const role = data.user.role;
      if (role === "doctor") navigate("/doctor-dashboard");
      else if (role === "pharmacy") navigate("/pharmacy-dashboard");
      else navigate("/patient-dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT PROMO */}
      <div className="auth-promo">
        <div className="promo-logo">Medi<span>Care+</span></div>

        <h2 className="promo-heading">
          Your Health,<br />
          <span className="highlight">Our Priority</span>
        </h2>
        <p className="promo-text">
          Sign in to access your personalized dashboard — whether you're a patient,
          doctor, or pharmacy partner.
        </p>
        <ul className="promo-features">
          <li><span className="check">✓</span> Real-time AI symptom triage</li>
          <li><span className="check">✓</span> Secure video consultations</li>
          <li><span className="check">✓</span> ABHA-ID patient login</li>
          <li><span className="check">✓</span> Prescription & pharmacy network</li>
        </ul>
      </div>

      {/* RIGHT FORM */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">
            New here? <Link to="/register">Create an account</Link>
          </p>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              id="tab-email"
              className={`tab-btn ${loginMode === "email" ? "active" : ""}`}
              onClick={() => { setLoginMode("email"); setError(""); }}
              type="button"
            >
              📧 Email Login
            </button>
            <button
              id="tab-abha"
              className={`tab-btn ${loginMode === "abha" ? "active" : ""}`}
              onClick={() => { setLoginMode("abha"); setError(""); }}
              type="button"
            >
              🪪 ABHA ID Login
            </button>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} id="login-form" noValidate>
            {loginMode === "email" ? (
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="doctor@careconnect.in"
                  autoComplete="email"
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="abha_id">ABHA ID (14-digit)</label>
                <input
                  id="abha_id"
                  className="form-input"
                  type="text"
                  name="abha_id"
                  value={form.abha_id}
                  onChange={handleChange}
                  placeholder="12-3456-7890-1234"
                  maxLength={17}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              id="btn-login"
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : "Sign In →"}
            </button>
          </form>

          <div className="auth-divider">or</div>
          <p style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--slate-500)" }}>
            <Link to="/" style={{ color: "var(--teal-400)", fontWeight: 600, textDecoration: "none" }}>
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
