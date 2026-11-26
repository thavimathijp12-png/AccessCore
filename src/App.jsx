import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth, getRoleDashboardPath } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { RequestsProvider } from './context/RequestsContext'
import { TasksProvider } from './context/TasksContext'
import { BugsProvider } from './context/BugsContext'
import { ApprovalsProvider } from './context/ApprovalsContext'
import { TeamProvider } from './context/TeamContext'
import { NotificationsProvider } from './context/NotificationsContext'

import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleBasedRoute from './components/auth/RoleBasedRoute'
import AdminLayout from './components/layout/AdminLayout'
import LeadLayout from './components/layout/LeadLayout'
import EmployeeLayout from './components/layout/EmployeeLayout'
import { PageSkeleton } from './components/ui/Skeleton'

// Public Auth Pages
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

// Role-Based Dashboards
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const LeadDashboard = lazy(() => import('./pages/lead/LeadDashboard'))
const EmployeeDashboard = lazy(() => import('./pages/employee/EmployeeDashboard'))

// Core Enterprise Modules
const RequestsPage = lazy(() => import('./pages/RequestsPage'))
const TasksPage = lazy(() => import('./pages/TasksPage'))
const BugsPage = lazy(() => import('./pages/BugsPage'))
const ApprovalsPage = lazy(() => import('./pages/ApprovalsPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function RequireGuest({ children }) {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />
  }
  return children
}

function RootRedirect() {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to={getRoleDashboardPath(user.role)} replace />
}

function LegacyModuleRedirect({ module }) {
  const { user } = useAuth()
  const location = useLocation()
  const prefix = (user?.role || '').toUpperCase() === 'ADMIN'
    ? '/admin'
    : (user?.role || '').toUpperCase().includes('LEAD')
    ? '/lead'
    : '/employee'
  const subPath = location.pathname.replace(new RegExp(`^/${module}`), '')
  return <Navigate to={`${prefix}/${module}${subPath}`} replace />
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <RequireGuest>
              <LoginPage />
            </RequireGuest>
          }
        />
        <Route
          path="/login/:roleId"
          element={
            <RequireGuest>
              <LoginPage />
            </RequireGuest>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RequireGuest>
              <ForgotPasswordPage />
            </RequireGuest>
          }
        />
        <Route
          path="/reset-password"
          element={
            <RequireGuest>
              <ResetPasswordPage />
            </RequireGuest>
          }
        />

        {/* ── 1. ADMIN PORTAL (Governance & Full Oversight) ─────────────────── */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<TeamPage />} />
          <Route path="roles" element={<TeamPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="bugs" element={<BugsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<SettingsPage />} />
        </Route>

        {/* ── 2. LEAD PORTAL (Supervision & Resource Operations) ────────────── */}
        <Route
          path="/lead"
          element={
            <RoleBasedRoute allowedRoles={['LEAD', 'TEAM_LEAD']}>
              <LeadLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="/lead/dashboard" replace />} />
          <Route path="dashboard" element={<LeadDashboard />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="members" element={<TeamPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="assign-task" element={<TasksPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestsPage />} />
          <Route path="bugs" element={<BugsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="performance" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<SettingsPage />} />
        </Route>

        {/* ── 3. EMPLOYEE PORTAL (Personal Queue & Self-Service) ────────────── */}
        <Route
          path="/employee"
          element={
            <RoleBasedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestsPage />} />
          <Route path="new-request" element={<RequestsPage />} />
          <Route path="new-bug" element={<BugsPage />} />
          <Route path="progress" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<SettingsPage />} />
        </Route>

        {/* Root Redirect based on authenticated user's role */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootRedirect />
            </ProtectedRoute>
          }
        />

        {/* Legacy Module Route Redirects */}
        <Route path="/requests" element={<ProtectedRoute><LegacyModuleRedirect module="requests" /></ProtectedRoute>} />
        <Route path="/requests/:id" element={<ProtectedRoute><LegacyModuleRedirect module="requests" /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><LegacyModuleRedirect module="tasks" /></ProtectedRoute>} />
        <Route path="/bugs" element={<ProtectedRoute><LegacyModuleRedirect module="bugs" /></ProtectedRoute>} />
        <Route path="/approvals" element={<ProtectedRoute><LegacyModuleRedirect module="approvals" /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><LegacyModuleRedirect module="team" /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><LegacyModuleRedirect module="reports" /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><LegacyModuleRedirect module="notifications" /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><LegacyModuleRedirect module="settings" /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RequestsProvider>
            <TasksProvider>
              <BugsProvider>
                <ApprovalsProvider>
                  <TeamProvider>
                    <NotificationsProvider>
                      <AppRoutes />
                    </NotificationsProvider>
                  </TeamProvider>
                </ApprovalsProvider>
              </BugsProvider>
            </TasksProvider>
          </RequestsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
