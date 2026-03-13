import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkSymptoms, getMySymptomLogs } from "../services/symptomService";
import Layout from "../components/Layout";
import "../css/Symptom.css";

const PRESETS = ["Fever", "Cough", "Headache", "Chest Pain", "Dizziness", "Nausea", "Fatigue"];

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await getMySymptomLogs();
      setHistory(res.logs || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAddSymptom = (s) => {
    const sym = s.trim();
    if (sym && !symptoms.includes(sym)) {
      setSymptoms([...symptoms, sym]);
      setInputValue("");
    }
  };

  const removeSymptom = (sym) => {
    setSymptoms(symptoms.filter(s => s !== sym));
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) return;
    setAnalyzing(true);
    setResult(null);
    setError("");

    try {
      const res = await checkSymptoms(symptoms);
      setResult(res.result);
      fetchHistory(); // Refresh history
    } catch (err) {
      setError("AI analysis failed. Please try again later.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="symptom-page pt-24">
        <Link to="/patient-dashboard" className="symptom-back">← Back to Dashboard</Link>

        <div className="symptom-header">
          <h1>AI Symptom Checker</h1>
          <p>Using Groq Llama-3 Reasoning Engine to provide instant medical triage and advice.</p>
        </div>

        <div className="symptom-input-card">
          <h3>What are you feeling today?</h3>
          
          <div className="chip-input-wrapper">
            {symptoms.map(s => (
              <div key={s} className="symptom-chip">
                {s} <button className="chip-remove" onClick={() => removeSymptom(s)}>×</button>
              </div>
            ))}
            <input 
              className="chip-field"
              placeholder={symptoms.length === 0 ? "Type a symptom (e.g. Fever)..." : "Add another..."}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSymptom(inputValue)}
            />
          </div>

          <div className="quick-symptoms-label">Suggestions</div>
          <div className="quick-symptoms-list">
            {PRESETS.map(p => (
              <button key={p} className="quick-chip" onClick={() => handleAddSymptom(p)}>+ {p}</button>
            ))}
          </div>

          {error && <div className="symptom-alert error">{error}</div>}

          <button 
            className="btn-analyze" 
            disabled={symptoms.length === 0 || analyzing}
            onClick={handleAnalyze}
          >
            {analyzing ? <span className="spinner-sm" /> : "Analyze with AI Engine ⚡"}
          </button>
        </div>

        {analyzing && (
          <div className="analyzing-stage">
            <div className="pulse-ring">🧠</div>
            <h3>AI Reasoning Active...</h3>
            <p>Processing symptoms through our clinical intelligence layer.</p>
          </div>
        )}

        {result && (
          <div className={`result-card ${
            result.triage === 'Emergency' ? 'emergency' : 
            result.triage === 'Consult Doctor' ? 'consult' : 'homecare'
          }`}>
            <div className={`result-triage-badge ${
              result.triage === 'Emergency' ? 'triage-emergency' : 
              result.triage === 'Consult Doctor' ? 'triage-consult' : 'triage-homecare'
            }`}>
              {result.triage || 'Assessment'}
            </div>
            
            <h3>Possible Conditions</h3>
            <div className="conditions-list">
              {result.possible_conditions?.map(c => (
                <span key={c} className="condition-pill">{c}</span>
              ))}
            </div>

            <h3>Medical Advice</h3>
            <div className="result-advice">{result.advice}</div>

            <div className="result-confidence">
              <span className="confidence-label">AI Confidence</span>
              <div className="confidence-bar-wrap">
                <div className="confidence-bar" style={{ width: `${(result.confidence || 0.5) * 100}%` }}></div>
              </div>
              <span className="confidence-pct">{Math.round((result.confidence || 0.5) * 100)}%</span>
            </div>

            <div className="result-reasoning">
              <strong>AI Reasoning:</strong> {result.reasoning}
            </div>
          </div>
        )}

        <div className="history-card">
          <h3>Recent Checks</h3>
          {history.length === 0 ? (
            <p style={{ color: "var(--slate-500)", fontSize: "0.88rem" }}>No history found.</p>
          ) : (
            history.slice(0, 5).map(h => (
              <div key={h.id} className="history-row">
                <div className="history-symptoms">{h.symptoms}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className={`status-badge ${h.triage_result === 'Emergency' ? 'status-emergency' : 'status-active'}`}>
                     {h.triage_result}
                  </span>
                  <span className="history-date">{new Date(h.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>

  );
}
