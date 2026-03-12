import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user, login, register, logout, loading } = useAuthContext();

  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isPatient: user?.role === 'patient',
    isPharmacy: user?.role === 'pharmacy',
  };
};
