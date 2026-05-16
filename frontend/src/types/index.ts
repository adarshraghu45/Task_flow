export type Theme = 'light' | 'dark' | 'system';
export type UserRole = 'user' | 'admin';
export type WorkspaceRole = 'owner' | 'admin' | 'manager' | 'member';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  role?: WorkspaceRole;
  settings?: { defaultView: string; allowGuestInvites: boolean };
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface Subtask {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  assigneeId?: string;
  assignee?: { id: string; name: string; email: string; avatar?: string };
  createdBy: string;
  dueDate?: string;
  startDate?: string;
  subtasks: Subtask[];
  attachments: { name: string; url: string; size: number }[];
  dependencies: string[];
  recurring?: { enabled: boolean; rule?: string };
  kanbanOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type KanbanBoard = Record<TaskStatus, Task[]>;

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}

export interface DashboardData {
  summary: {
    projects: number;
    myTasks: number;
    completed: number;
    overdue: number;
    dueToday: number;
    members: number;
    total: number;
    todo: number;
    in_progress: number;
    review: number;
    done: number;
  };
  statusBreakdown: { _id: string; count: number }[];
  priorityBreakdown: { _id: string; count: number }[];
  overdueTasks: Pick<Task, 'id' | 'title' | 'status' | 'priority' | 'dueDate'>[];
  recentTasks: Pick<Task, 'id' | 'title' | 'status' | 'priority' | 'dueDate'>[];
}

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData {
  user: User;
  tokens: AuthTokens;
}
