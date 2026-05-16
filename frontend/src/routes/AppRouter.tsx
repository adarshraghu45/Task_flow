import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout, AuthLayout } from '@components/layout';
import { DashboardLayout } from '@components/layout/dashboard/DashboardLayout';
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
  AdminPage,
  NotFoundPage,
} from '@pages/index';

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
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
