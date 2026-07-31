import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { DashboardChartSkeleton } from '../components/ui/Skeleton';
import AdminRoute from './AdminRoute';



const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const GroupsPage = lazy(() => import('../pages/groups/GroupsPage'));
const GroupDetailPage = lazy(() => import('../pages/groups/GroupDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const FriendsPage = lazy(() => import('../pages/friends/FriendsPage'));


export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-8"><DashboardChartSkeleton /></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendsPage />} />
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