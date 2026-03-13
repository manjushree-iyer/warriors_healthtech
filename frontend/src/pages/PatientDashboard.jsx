import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMySymptomLogs } from "../services/symptomService";
import { getConsultationHistory } from "../services/appointmentService";
import { getMyPrescriptions } from "../services/prescriptionService";
import "../css/Dashboard.css";

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [symptomLogs, setSymptomLogs] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [logsRes, consRes, presRes] = await Promise.all([
          getMySymptomLogs(),
          getConsultationHistory(user.id),
          getMyPrescriptions()
        ]);
        setSymptomLogs(logsRes.logs || []);
        setConsultations(consRes.history || []);
        setPrescriptions(presRes.prescriptions || []);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchData();
  }, [user]);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Medi<span>Care+</span></h2>
          <div className="sidebar-role">Patient Portal</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          <Link to="/patient-dashboard" className="nav-item active">
            <span className="nav-icon">📊</span> Dashboard
          </Link>
          <Link to="/symptom-checker" className="nav-item">
            <span className="nav-icon">🧠</span> AI Symptom Checker
          </Link>
          <Link to="/book-appointment" className="nav-item">
            <span className="nav-icon">📅</span> Book Appointment
          </Link>
          
          <div className="nav-section-label">Health</div>
          <a href="#prescriptions" className="nav-item" onClick={(e) => { e.preventDefault(); document.getElementById('prescriptions')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span className="nav-icon">💊</span> My Prescriptions
          </a>
          <a href="#history" className="nav-item" onClick={(e) => { e.preventDefault(); document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span className="nav-icon">📝</span> Medical History
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name ? user.name[0] : "P"}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role-badge">Online</div>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header className="topbar">
          <h1>Welcome, {user?.name.split(" ")[0]}</h1>
          <div className="topbar-actions">
            <div className="topbar-badge badge-teal">ID: {user?.id}</div>
          </div>
        </header>

        <section className="dashboard-content">
          {/* STATS */}
          <div className="stats-row">
            <div className="stat-tile">
              <div className="stat-tile-icon">🧠</div>
              <div className="stat-tile-value">{symptomLogs.length}</div>
              <div className="stat-tile-label">AI Checks Done</div>
              <div className="stat-tile-accent" style={{ background: "var(--teal-500)" }}></div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-icon">📅</div>
              <div className="stat-tile-value">{consultations.length}</div>
              <div className="stat-tile-label">Consultations</div>
              <div className="stat-tile-accent" style={{ background: "var(--lavender)" }}></div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-icon">💊</div>
              <div className="stat-tile-value">{prescriptions.length}</div>
              <div className="stat-tile-label">Active Prescriptions</div>
              <div className="stat-tile-accent" style={{ background: "var(--amber)" }}></div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.5rem" }}>
            {/* Recent Symptoms */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h3 className="dash-card-title">Recent Symptom Logs</h3>
                <Link to="/symptom-checker" className="dash-card-action">New Check +</Link>
              </div>
              {loading ? (
                <div className="loading-wrap"><div className="spinner-lg"></div></div>
              ) : symptomLogs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🧠</div>
                  <p>No symptom checks recorded yet.</p>
                </div>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Symptoms</th>
                      <th>AI Triage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {symptomLogs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {log.symptoms}
                        </td>
                        <td>
                          <span className={`status-badge ${
                            log.triage_result?.toLowerCase() === "emergency" ? "status-emergency" : 
                            log.triage_result?.toLowerCase() === "home care" ? "status-dispensed" : "status-pending"
                          }`}>
                            {log.triage_result}
                          </span>
                        </td>
                        <td style={{ fontFamily: "JetBrains Mono", fontSize: "0.75rem" }}>
                          {new Date(log.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Medical History / Consultations */}
            <div className="dash-card" id="history">
              <div className="dash-card-header">
                <h3 className="dash-card-title">Medical History</h3>
                <Link to="/book-appointment" className="dash-card-action">Book Now</Link>
              </div>
              {loading ? (
                 <div className="loading-wrap"><div className="spinner-lg"></div></div>
              ) : consultations.length === 0 ? (
                <div className="empty-state">
                   <div className="empty-icon">📅</div>
                  <p>No consultations history.</p>
                </div>
              ) : (
                <div className="history-list">
                  {consultations.map((con) => (
                    <div key={con.id} className="history-row" style={{ padding: "0.8rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{con.call_type} Consultation</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>Dr. {con.doctor_name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", marginTop: "0.2rem" }}>{con.doctor_notes || "No notes yet"}</div>
                      </div>
                      <div className="status-badge status-active" style={{ fontSize: "0.65rem" }}>COMPLETED</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Prescriptions */}
            <div className="dash-card" id="prescriptions" style={{ gridColumn: "span 2" }}>
              <div className="dash-card-header">
                <h3 className="dash-card-title">My Prescriptions</h3>
              </div>
              {prescriptions.length === 0 ? (
                <p style={{ padding: "1rem", color: "var(--slate-500)" }}>No prescriptions found.</p>
              ) : (
                <div className="pres-grid-patient" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", padding: "1rem" }}>
                  {prescriptions.map(p => (
                    <div key={p.id} className="pres-card-patient" style={{ background: "var(--slate-800)", padding: "1.2rem", borderRadius: "12px", border: "1px solid var(--slate-700)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                        <span style={{ color: "var(--emerald)", fontWeight: 700 }}>{p.medicine_name}</span>
                        <span className="status-badge status-dispensed" style={{ fontSize: "0.6rem" }}>{p.status.toUpperCase()}</span>
                      </div>
                      <div style={{ color: "var(--slate-100)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>Dosage: {p.dosage}</div>
                      <div style={{ color: "var(--slate-400)", fontSize: "0.8rem" }}>Inst: {p.instructions}</div>
                      <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid var(--slate-700)", fontSize: "0.7rem", color: "var(--slate-500)" }}>
                        Dr. {p.doctor_name} · {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
