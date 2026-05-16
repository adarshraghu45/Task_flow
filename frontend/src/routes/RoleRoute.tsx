import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import type { UserRole } from '@app-types/index';

interface RoleRouteProps {
  roles: UserRole[];
}

export const RoleRoute = ({ roles }: RoleRouteProps) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
