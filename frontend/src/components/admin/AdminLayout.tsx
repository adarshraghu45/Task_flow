import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { CommandPalette } from './CommandPalette';
import { useAppSelector } from '@store/hooks';

export const AdminLayout = () => {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-[#0a0814] text-white">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
};
