import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './hooks/useAuth';

import AppointmentBooking from './pages/AppointmentBooking';
import SymptomChecker from './pages/SymptomChecker';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route path="patient-dashboard" element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="doctor-dashboard" element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="pharmacy-dashboard" element={
          <ProtectedRoute role="pharmacy">
            <PharmacyDashboard />
          </ProtectedRoute>
        } />
        <Route path="book-appointment" element={
          <ProtectedRoute role="patient">
            <AppointmentBooking />
          </ProtectedRoute>
        } />
        <Route path="symptom-checker" element={
          <ProtectedRoute role="patient">
            <SymptomChecker />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
