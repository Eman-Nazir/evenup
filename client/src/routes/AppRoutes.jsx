import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { DashboardChartSkeleton } from '../components/ui/Skeleton';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const GroupsPage = lazy(() => import('../pages/groups/GroupsPage'));
const GroupDetailPage = lazy(() => import('../pages/groups/GroupDetailPage'));
const FriendsPage = lazy(() => import('../pages/friends/FriendsPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-8"><DashboardChartSkeleton /></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}