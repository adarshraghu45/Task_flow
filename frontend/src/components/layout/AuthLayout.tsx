import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './Header';

export const AuthLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 items-center justify-center p-6"
    >
      <Outlet />
    </motion.main>
  </div>
);
