import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getDoctorQueue, startConsultation, addDoctorNotes } from "../services/appointmentService";
import { createPrescription } from "../services/prescriptionService";
import { getDoctorSchedule, getTreatedPatients, getPatientHistory } from "../services/doctorService";
import "../css/Dashboard.css";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [view, setView] = useState("queue"); // queue | schedule | records
  const [schedule, setSchedule] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Prescription Form
  const [presForm, setPresForm] = useState({
    medicine_name: "",
    dosage: "",
    instructions: "",
    pharmacy_id: "1" // Default for demo
  });

  const fetchQueue = async () => {
    try {
      const res = await getDoctorQueue();
      setQueue(res.queue || []);
    } catch (err) {
      console.error("Failed to fetch doctor queue", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await getDoctorSchedule();
      setSchedule(res.appointments || []);
    } catch (err) { console.error(err); }
  };

  const fetchPatients = async () => {
    try {
      const res = await getTreatedPatients();
      setPatients(res.patients || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (user) {
       if (view === "queue") fetchQueue();
       if (view === "schedule") fetchSchedule();
       if (view === "records") fetchPatients();
    }
  }, [user, view]);

  const handleViewHistory = async (patientId) => {
    try {
      const res = await getPatientHistory(patientId);
      setSelectedHistory(res.history);
      setShowHistoryModal(true);
    } catch (err) {
      alert("Failed to load history: " + err.message);
    }
  };

  const handleStartConsultation = async (appt) => {
    try {
      const res = await startConsultation({
        appointment_id: appt.appointment_id,
        call_type: "Video"
      });
      setActiveConsultation(res.consultation);
      setShowPrescriptionModal(true);
      fetchQueue();
    } catch (err) {
      alert("Failed to start consultation: " + err.message);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPrescription({
        consultation_id: activeConsultation.id,
        patient_id: activeConsultation.patient_id || 1, // Fallback if not returned directly
        pharmacy_id: presForm.pharmacy_id,
        medicine_name: presForm.medicine_name,
        dosage: presForm.dosage,
        instructions: presForm.instructions
      });
      
      // Also add doctor notes
      await addDoctorNotes({
        consultation_id: activeConsultation.id,
        doctor_notes: `Prescribed ${presForm.medicine_name}. ${presForm.instructions}`
      });

      alert("Prescription sent successfully!");
      setShowPrescriptionModal(false);
      setActiveConsultation(null);
    } catch (err) {
      alert("Failed to create prescription: " + err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Medi<span>Care+</span></h2>
          <div className="sidebar-role">Doctor Portal</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          <div className={`nav-item ${view === 'queue' ? 'active' : ''}`} onClick={() => setView('queue')}>
            <span className="nav-icon">🩺</span> Patient Queue
          </div>
          <div className={`nav-item ${view === 'schedule' ? 'active' : ''}`} onClick={() => setView('schedule')}>
            <span className="nav-icon">📅</span> Schedule
          </div>
          <div className={`nav-item ${view === 'records' ? 'active' : ''}`} onClick={() => setView('records')}>
            <span className="nav-icon">📁</span> Patient Records
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name ? user.name[0] : "D"}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role-badge">Active · In Clinic</div>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header className="topbar">
          <h1>Doctor Dashboard</h1>
          <div className="topbar-actions">
            <div className={`topbar-badge ${view === 'queue' ? 'badge-rose' : 'badge-teal'}`}>
              {view.toUpperCase()}
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="stats-row">
            <div className="stat-tile">
              <div className="stat-tile-icon">👥</div>
              <div className="stat-tile-value">{queue.length}</div>
              <div className="stat-tile-label">Pending Patients</div>
              <div className="stat-tile-accent" style={{ background: "var(--rose)" }}></div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-icon">✅</div>
              <div className="stat-tile-value">12</div>
              <div className="stat-tile-label">Completed Today</div>
              <div className="stat-tile-accent" style={{ background: "var(--emerald)" }}></div>
            </div>
          </div>

          <div className="dash-card">
            {view === "queue" && (
              <>
                <div className="dash-card-header">
                  <h3 className="dash-card-title">Patient Queue</h3>
                  <button className="dash-card-action" onClick={fetchQueue}>Refresh</button>
                </div>
                {loading ? (
                  <div className="loading-wrap"><div className="spinner-lg"></div></div>
                ) : queue.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🪑</div>
                    <p>No patients in queue.</p>
                  </div>
                ) : (
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Appointment</th>
                        <th>Patient Name</th>
                        <th>ABHA ID</th>
                        <th>Reason/Notes</th>
                        <th>Latest Symptoms</th>
                        <th>Triage</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queue.map((appt) => (
                        <tr key={appt.appointment_id}>
                          <td style={{ fontFamily: "JetBrains Mono" }}>#{appt.appointment_id}</td>
                          <td>{appt.patient_name}</td>
                          <td>{appt.abha_id}</td>
                          <td style={{ maxWidth: "150px", fontSize: "0.85rem", color: "var(--teal-400)" }}>
                            {appt.notes || "No extra notes"}
                          </td>
                          <td style={{ maxWidth: "200px", fontSize: "0.85rem", color: "var(--slate-400)" }}>
                            {appt.latest_symptoms || "N/A"}
                          </td>
                          <td>
                            <span className={`status-badge ${
                              appt.latest_triage === 'Emergency' ? 'status-emergency' : 
                              appt.latest_triage === 'Consult Doctor' ? 'status-active' : 'status-pending'
                            }`}>
                              {appt.latest_triage || "Logged"}
                            </span>
                          </td>
                          <td>{new Date(appt.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td>
                            <button className="btn-sm btn-teal" onClick={() => handleStartConsultation(appt)}>Start Call</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {view === "schedule" && (
              <>
                <div className="dash-card-header">
                  <h3 className="dash-card-title">Full Schedule</h3>
                </div>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map(appt => (
                      <tr key={appt.id}>
                        <td>{new Date(appt.scheduled_time).toLocaleString()}</td>
                        <td>{appt.patient_name}</td>
                        <td><span className="status-badge status-active">{appt.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {view === "records" && (
              <>
                <div className="dash-card-header">
                  <h3 className="dash-card-title">Treated Patients</h3>
                </div>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>ABHA ID</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(p => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.email}</td>
                        <td>{p.abha_id}</td>
                        <td><button className="btn-sm btn-teal" onClick={() => handleViewHistory(p.id)}>View History</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </section>
      </main>

      {/* PRESCRIPTION MODAL */}
      {showPrescriptionModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Consultation Wrap-up</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--slate-500)", marginBottom: "1.5rem" }}>
              Consultation # {activeConsultation?.id} is active. Please write the prescription.
            </p>
            <form onSubmit={handlePrescriptionSubmit} className="form-grid">
              <div className="form-group-dash">
                <label>Medicine Name</label>
                <input 
                  className="form-input-dash" 
                  placeholder="e.g. Paracetamol 500mg" 
                  value={presForm.medicine_name}
                  onChange={e => setPresForm({...presForm, medicine_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group-dash">
                <label>Dosage</label>
                <input 
                  className="form-input-dash" 
                  placeholder="e.g. 1-0-1 (After food)" 
                  value={presForm.dosage}
                  onChange={e => setPresForm({...presForm, dosage: e.target.value})}
                  required
                />
              </div>
              <div className="form-group-dash">
                <label>Instructions</label>
                <textarea 
                  className="form-input-dash" 
                  placeholder="Additional advice for the patient..."
                  value={presForm.instructions}
                  onChange={e => setPresForm({...presForm, instructions: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-sm btn-rose" onClick={() => setShowPrescriptionModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-dash">Send Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "800px", width: "90%" }}>
            <div className="dash-card-header">
              <h3>Patient Medical History</h3>
              <button onClick={() => setShowHistoryModal(false)} style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
            </div>
            
            <div className="history-content" style={{ maxHeight: "60vh", overflowY: "auto", padding: "1rem", color: "var(--slate-300)" }}>
              <section style={{ marginBottom: "2rem" }}>
                <h4 style={{ color: "var(--teal-400)", borderBottom: "1px solid var(--slate-700)", paddingBottom: "0.5rem" }}>Previous Consultations</h4>
                {selectedHistory?.consultations.length === 0 ? <p style={{ marginTop: "1rem" }}>No records found.</p> : (
                  <div style={{ marginTop: "1rem" }}>
                    {selectedHistory?.consultations.map(c => (
                      <div key={c.id} style={{ marginBottom: "1rem", background: "var(--slate-800)", padding: "1rem", borderRadius: "8px" }}>
                        <strong>{new Date(c.created_at).toLocaleDateString()}</strong> - Dr. {c.doctor_name}
                        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{c.doctor_notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section style={{ marginBottom: "2rem" }}>
                <h4 style={{ color: "var(--teal-400)", borderBottom: "1px solid var(--slate-700)", paddingBottom: "0.5rem" }}>Prescriptions</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                  {selectedHistory?.prescriptions.map(p => (
                    <div key={p.id} style={{ background: "var(--slate-800)", padding: "1rem", borderRadius: "8px" }}>
                      <div style={{ fontWeight: 700, color: "var(--emerald)" }}>{p.medicine_name}</div>
                      <div style={{ fontSize: "0.85rem" }}>{p.dosage}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--slate-400)" }}>{p.instructions}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 style={{ color: "var(--teal-400)", borderBottom: "1px solid var(--slate-700)", paddingBottom: "0.5rem" }}>AI Symptom Logs</h4>
                <div style={{ marginTop: "1rem" }}>
                  {selectedHistory?.symptomLogs.map(s => (
                    <div key={s.id} style={{ marginBottom: "0.5rem", fontSize: "0.85rem", background: "var(--slate-800)", padding: "0.5rem", borderRadius: "4px" }}>
                      <span style={{ color: "var(--teal-500)" }}>{new Date(s.created_at).toLocaleDateString()}</span>: {s.symptoms} 
                      <span style={{ float: "right", color: "var(--rose)" }}>{s.triage_result}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
