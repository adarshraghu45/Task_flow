import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@components/ui';
import { APP_NAME } from '@lib/constants';
import { useAuth } from '@hooks/useAuth';

export const Header = () => {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md"
    >
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            TF
          </span>
          <span className="text-lg font-semibold text-content">{APP_NAME}</span>
        </Link>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};
