import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout, AuthLayout } from '@components/layout';
import { DashboardLayout } from '@components/layout/dashboard/DashboardLayout';
import { AdminLayout } from '@components/admin/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  DashboardPage,
  ProjectsPage,
  ProjectBoardPage,
  KanbanPage,
  CalendarPage,
  AnalyticsPage,
  TeamPage,
  ChatPage,
  SettingsPage,
  NotFoundPage,
} from '@pages/index';
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminWorkspacesPage,
  AdminTasksPage,
  AdminReportsPage,
  AdminRevenuePage,
  AdminMonitoringPage,
  AdminAuditPage,
  AdminSettingsPage,
} from '@pages/admin';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:workspaceId" element={<ProjectBoardPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route element={<RoleRoute roles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/workspaces" element={<AdminWorkspacesPage />} />
            <Route path="/admin/tasks" element={<AdminTasksPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/revenue" element={<AdminRevenuePage />} />
            <Route path="/admin/monitoring" element={<AdminMonitoringPage />} />
            <Route path="/admin/audit" element={<AdminAuditPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
