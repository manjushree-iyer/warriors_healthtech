import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import SymptomChecker from "./pages/SymptomChecker";
import AppointmentBooking from "./pages/AppointmentBooking";

// CSS
import "./App.css";

// Protection Wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, role } = useAuth();
  
  if (loading) return <div className="loading-wrap"><div className="spinner-lg"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Patient Routes */}
      <Route path="/patient-dashboard" element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/symptom-checker" element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <SymptomChecker />
        </ProtectedRoute>
      } />
      <Route path="/book-appointment" element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <AppointmentBooking />
        </ProtectedRoute>
      } />

      {/* Doctor Routes */}
      <Route path="/doctor-dashboard" element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />

      {/* Pharmacy Routes */}
      <Route path="/pharmacy-dashboard" element={
        <ProtectedRoute allowedRoles={["pharmacy"]}>
          <PharmacyDashboard />
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
