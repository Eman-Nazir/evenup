import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/useAuthStore';

export default function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) return null; 

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}