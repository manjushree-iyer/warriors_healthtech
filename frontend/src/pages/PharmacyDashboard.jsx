import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPharmacyPrescriptions, updatePrescriptionStatus, searchMedicine, updateStock } from "../services/pharmacyService";
import "../css/Dashboard.css";

export default function PharmacyDashboard() {
  const { user, logout } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pharmacyId, setPharmacyId] = useState("1"); // Default for demo

  const fetchData = async () => {
    try {
      setLoading(true);
      const presRes = await getPharmacyPrescriptions(pharmacyId);
      setPrescriptions(presRes.prescriptions || []);
      
      // Fetch default inventory (searching something common)
      const invRes = await searchMedicine("");
      setInventory(invRes.medicines || []);
    } catch (err) {
      console.error("Pharmacy data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleDispense = async (pid) => {
    try {
      await updatePrescriptionStatus(pid, "dispensed");
      alert("Medicine marked as dispensed!");
      fetchData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Medi<span>Care+</span></h2>
          <div className="sidebar-role">Pharmacy Portal</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Inventory</div>
          <div className="nav-item active">
            <span className="nav-icon">💊</span> Prescriptions
          </div>
          <div className="nav-item">
            <span className="nav-icon">📦</span> Stock Management
          </div>
          <div className="nav-item">
            <span className="nav-icon">📊</span> Sales Report
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name ? user.name[0] : "P"}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role-badge">Pharmacy #{pharmacyId}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header className="topbar">
          <h1>Pharmacy Dashboard</h1>
          <div className="topbar-actions">
            <div className="topbar-badge badge-amber">STORE OPEN</div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="stats-row">
            <div className="stat-tile">
              <div className="stat-tile-icon">📜</div>
              <div className="stat-tile-value">{prescriptions.filter(p => p.status !== 'dispensed').length}</div>
              <div className="stat-tile-label">Pending Orders</div>
              <div className="stat-tile-accent" style={{ background: "var(--amber)" }}></div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-icon">✅</div>
              <div className="stat-tile-value">{prescriptions.filter(p => p.status === 'dispensed').length}</div>
              <div className="stat-tile-label">Dispensed Today</div>
              <div className="stat-tile-accent" style={{ background: "var(--teal-500)" }}></div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Assigned Prescriptions</h3>
              <button className="dash-card-action" onClick={fetchData}>Refresh List</button>
            </div>
            {loading ? (
              <div className="loading-wrap"><div className="spinner-lg"></div></div>
            ) : prescriptions.length === 0 ? (
              <div className="empty-state">
                 <div className="empty-icon">📜</div>
                <p>No prescriptions assigned to your pharmacy yet.</p>
              </div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((p) => (
                    <tr key={p.id}>
                      <td>Patient #{p.patient_id}</td>
                      <td style={{ fontWeight: 600 }}>{p.medicine_name}</td>
                      <td>{p.dosage}</td>
                      <td>
                        <span className={`status-badge ${p.status === 'dispensed' ? 'status-dispensed' : 'status-pending'}`}>
                          {p.status || 'pending'}
                        </span>
                      </td>
                      <td>
                        {p.status !== 'dispensed' && (
                          <button 
                            className="btn-sm btn-teal"
                            onClick={() => handleDispense(p.id)}
                          >
                            Dispense
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title" style={{ marginBottom: "1rem" }}>Inventory Status</h3>
            <table className="dash-table">
               <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Stock Level</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((inv, idx) => (
                    <tr key={idx}>
                      <td>{inv.name}</td>
                      <td>
                        <span style={{ color: inv.stock < 10 ? 'var(--rose)' : 'inherit' }}>
                          {inv.stock} units
                        </span>
                      </td>
                      <td style={{ fontFamily: "JetBrains Mono" }}>₹{inv.price}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
