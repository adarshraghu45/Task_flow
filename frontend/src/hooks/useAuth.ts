import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, setCredentials, setLoading } from '@features/auth/authSlice';
import { clearWorkspaces } from '@features/workspace/workspaceSlice';
import { authApi } from '@services/auth.service';
import { getErrorMessage } from '@services/api';
import { connectSocket, disconnectSocket, resetSocket } from '@services/socket';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  const handleAuthSuccess = (data: Awaited<ReturnType<typeof authApi.login>>) => {
    dispatch(setCredentials({ user: data.user, token: data.tokens.accessToken }));
    resetSocket();
    connectSocket();
    toast.success(`Welcome, ${data.user.name}!`);
    navigate('/dashboard');
  };

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const data = await authApi.login({ email, password });
      handleAuthSuccess(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const data = await authApi.register({ name, email, password });
      dispatch(setCredentials({ user: data.user, token: data.tokens.accessToken }));
      resetSocket();
      connectSocket();
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    disconnectSocket();
    resetSocket();
    dispatch(logout());
    dispatch(clearWorkspaces());
    toast.info('Signed out');
    navigate('/login');
  };

  const forgotPassword = async (email: string) => {
    dispatch(setLoading(true));
    try {
      const message = await authApi.forgotPassword(email);
      toast.success(message);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resetPassword = async (token: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const message = await authApi.resetPassword(token, password);
      toast.success(message);
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    ...auth,
    login,
    register,
    signOut,
    forgotPassword,
    resetPassword,
    isAdmin: auth.user?.role === 'admin',
  };
};
