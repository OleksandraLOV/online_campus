import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/shared/DashboardPage';
import SchedulePage from './pages/shared/SchedulePage';
import CoursesPage from './pages/course/CoursesPage';
import CourseDetailPage from './pages/course/CourseDetailPage';
import AssignmentsPage from './pages/student/AssignmentsPage';
import GradesPage from './pages/student/GradesPage';
import NotificationsPage from './pages/shared/NotificationsPage';
import UsersPage from './pages/admin/UsersPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import { Role } from './types';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProfilePage from './pages/shared/ProfilePage';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="grades" element={<GradesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                allowedRoles={[
                  Role.ADMIN,
                  Role.PRESIDENT,
                  Role.RECTOR,
                  Role.DEAN,
                ]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit-log"
            element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <AuditLogPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
