import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LayoutDashboard, Users, BarChart3 } from 'lucide-react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@hooks/useTheme';

const highlights = [
  { icon: LayoutDashboard, text: 'Dashboard & analytics at a glance' },
  { icon: Users, text: 'Team workspaces & Kanban boards' },
  { icon: BarChart3, text: 'Real-time updates via Socket.IO' },
];

export const AuthLayout = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex min-h-screen bg-[#0a0814]">
      <div className="relative hidden w-[48%] overflow-hidden lg:flex lg:flex-col">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#1a1035] to-[#0a0814]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
        <motion.div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-900/50">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TaskFlow</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight text-white">
              Manage work
              <br />
              <span className="bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
                beautifully.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-violet-200/70">
              Projects, tasks, and teams — all in one modern workspace built for speed.
            </p>
            <ul className="mt-10 space-y-4">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-violet-100/80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4 text-violet-300" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-violet-300/50">© TaskFlow Manager</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <motion.div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
              <Zap className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-bold text-white">TaskFlow</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-violet-200/80 hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to={isRegister ? '/login' : '/register'}
              className="text-sm font-medium text-violet-300 hover:text-violet-200"
            >
              {isRegister ? 'Sign in' : 'Create account'}
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-10 lg:px-12">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
