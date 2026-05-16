import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCommandPaletteOpen } from '@features/admin/adminSlice';

const links = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Workspaces', path: '/admin/workspaces' },
  { label: 'Tasks', path: '/admin/tasks' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Revenue', path: '/admin/revenue' },
  { label: 'Monitoring', path: '/admin/monitoring' },
  { label: 'Audit Logs', path: '/admin/audit' },
  { label: 'Settings', path: '/admin/settings' },
];

export const CommandPalette = () => {
  const open = useAppSelector((s) => s.admin.commandPaletteOpen);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    dispatch(setCommandPaletteOpen(false));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[15vh] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setCommandPaletteOpen(false))}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#141022] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="border-b border-white/10 px-4 py-3 text-sm text-violet-300/60">Quick navigation</p>
            <ul className="max-h-80 overflow-auto p-2">
              {links.map((l) => (
                <li key={l.path}>
                  <button
                    type="button"
                    onClick={() => go(l.path)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-violet-600/20"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
