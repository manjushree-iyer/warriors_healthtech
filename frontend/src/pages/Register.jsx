import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../css/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-form-panel" style={{ gridColumn: "1 / -1" }}>
          <div className="auth-form-box" style={{ textAlign: "center" }}>
            <div className="alert alert-success">
              ✅ Account created successfully! Redirecting to login...
            </div>
            <div className="spinner" style={{ width: "40px", height: "40px", margin: "1rem auto" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* LEFT PROMO */}
      <div className="auth-promo">
        <div className="promo-logo">Medi<span>Care+</span></div>

        <h2 className="promo-heading">
          Join the <br />
          <span className="highlight">Future of Health</span>
        </h2>
        <p className="promo-text">
          Create an account to start your journey towards better healthcare access
          and management.
        </p>
        <ul className="promo-features">
          <li><span className="check">✓</span> Professional doctor network</li>
          <li><span className="check">✓</span> Integrated pharmacy stock</li>
          <li><span className="check">✓</span> AI-powered triage results</li>
          <li><span className="check">✓</span> Secure medical lockers</li>
        </ul>
      </div>

      {/* RIGHT FORM */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2>Create Account</h2>
          <p className="auth-subtitle">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} id="register-form">
            <div className="form-group">
              <label htmlFor="role">I am a...</label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacy">Pharmacy Owner</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                className="form-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

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
                required
              />
            </div>

            <button
              id="btn-register"
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : "Create Account →"}
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
