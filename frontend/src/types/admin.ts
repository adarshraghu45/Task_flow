export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support_staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  adminRole?: AdminRole | null;
  isActive: boolean;
  isEmailVerified: boolean;
  suspendedAt?: string;
  lastSeenAt?: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminDashboard {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsersWeek: number;
    totalWorkspaces: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    pendingReports: number;
    adminCount: number;
    activeSessions: number;
  };
  revenue: {
    monthly: number;
    yearly: number;
    activeSubscriptions: number;
    failedPayments: number;
    churnRate: number;
  };
  charts: {
    userGrowth: { date: string; users: number }[];
    taskActivity: { date: string; tasks: number }[];
    workspaceGrowth: { date: string; workspaces: number }[];
    statusBreakdown: { _id: string; count: number }[];
    priorityBreakdown: { _id: string; count: number }[];
  };
  aiUsage: {
    openai: { requests: number; tokens: number; cost: number };
    gemini: { requests: number; tokens: number; cost: number };
    claude: { requests: number; tokens: number; cost: number };
    dailyRequests: { date: string; count: number }[];
  };
}

export interface AdminWorkspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  isSuspended: boolean;
  memberCount: number;
  taskCount: number;
  createdAt: string;
}

export interface AdminTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  workspaceId: string;
  assigneeId: string | null;
  dueDate?: string;
  createdAt: string;
}

export interface AdminReport {
  id: string;
  type: string;
  status: string;
  reason: string;
  description?: string;
  reporter?: { name?: string; email?: string };
  reportedUser?: { name?: string; email?: string };
  createdAt: string;
}

export interface SystemHealth {
  status: string;
  uptime: number;
  services: Record<string, string>;
  system: Record<string, unknown>;
  metrics: Record<string, number>;
}
