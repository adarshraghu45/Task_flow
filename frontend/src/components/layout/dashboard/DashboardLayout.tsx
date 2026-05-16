import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { useWorkspaceInit } from '@hooks/useWorkspace';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  useWorkspaceInit();

  return (
    <div className="flex min-h-screen bg-surface">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center border-b border-border/50 px-4 py-3 md:hidden">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-surface-muted"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-2 font-bold text-content">TaskFlow</span>
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-surface-elevated md:hidden"
            >
              <AppSidebar mobile onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
