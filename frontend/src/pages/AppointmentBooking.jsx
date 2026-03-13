import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAppointment } from "../services/appointmentService";
import { getAllDoctors } from "../services/doctorService";
import Layout from "../components/Layout";
import "../css/Appointment.css";

export default function AppointmentBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [formData, setFormData] = useState({
    scheduled_time: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await getAllDoctors();
        setDoctors(res.doctors || []);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };
    fetchDocs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoc || !formData.scheduled_time) {
      setError("Please select a doctor and appointment time.");
      return;
    }

    setLoading(true);
    try {
      await createAppointment({
        doctor_id: selectedDoc.id,
        scheduled_time: formData.scheduled_time,
        notes: formData.notes
      });
      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="appointment-page pt-24">
        <Link to="/patient-dashboard" className="appt-back">← Back to Dashboard</Link>
        
        <div className="appt-header">
          <h1>Book Consult</h1>
          <p>Schedule a secure video or audio consultation with our top-rated specialists in clicks.</p>
        </div>

        <div className="appt-steps">
          <div className={`step-item ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
            <div className="step-num">{step > 1 ? '✓' : '1'}</div>
            <span className="step-label">Doctor</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
            <div className="step-num">{step > 2 ? '✓' : '2'}</div>
            <span className="step-label">Schedule</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 3 ? 'done active' : ''}`}>
            <div className="step-num">{step === 3 ? '✓' : '3'}</div>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        <div className="appt-form-card">
          {step === 1 && (
            <div className="doctor-selection">
              <h3>Choose a Specialist</h3>
              <div className="doctor-cards-grid">
                {doctors.map((doc) => (
                  <div 
                    key={doc.id} 
                    className={`doctor-selector-card ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="doctor-card-name">{doc.name}</div>
                    <div className="doctor-card-spec">{doc.specialization}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--teal-400)", marginTop: "0.4rem" }}>{doc.hospital}</div>
                  </div>
                ))}
              </div>
              <button 
                className="appt-submit-btn" 
                style={{ marginTop: "2rem" }}
                disabled={!selectedDoc}
                onClick={() => setStep(2)}
              >
                Continue to Schedule →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="appt-form-section">
                <label>Selected Doctor</label>
                <div style={{ color: "var(--teal-400)", fontWeight: 700, marginBottom: "1rem" }}>{selectedDoc.name} ({selectedDoc.specialization})</div>
              </div>

              <div className="appt-form-section">
                <label htmlFor="scheduled_time">Preferred Date & Time</label>
                <input 
                  id="scheduled_time"
                  type="datetime-local" 
                  className="appt-input"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                  required
                />
              </div>

              <div className="appt-form-section">
                <label htmlFor="notes">Reason for Visit (Optional)</label>
                <textarea 
                  id="notes"
                  className="appt-textarea" 
                  placeholder="Briefly describe your symptoms..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              {error && <div className="appt-alert error">⚠️ {error}</div>}

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" className="appt-submit-btn" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "none" }} onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="appt-submit-btn" disabled={loading}>
                  {loading ? <span className="spinner-sm" /> : "Confirm Appointment"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="appt-success">
              <div className="success-icon">🎉</div>
              <h2>Appointment Confirmed!</h2>
              <p>Your consultation with <strong>{selectedDoc?.name}</strong> has been scheduled for {new Date(formData.scheduled_time).toLocaleString()}. Don't forget to join the call 5 minutes early.</p>
              <button className="appt-submit-btn" onClick={() => navigate("/patient-dashboard")}>
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>

  );
}
