import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCredentials, setInitialized, setUser, logout } from '@features/auth/authSlice';
import { authApi } from '@services/auth.service';
import { connectSocket } from '@services/socket';
import { AUTH_TOKEN_KEY } from '@lib/constants';

export const AuthBootstrap = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const init = async () => {
      if (!token && !localStorage.getItem(AUTH_TOKEN_KEY)) {
        dispatch(setInitialized(true));
        return;
      }

      try {
        if (!token) {
          const refreshed = await authApi.refresh();
          dispatch(
            setCredentials({
              user: refreshed.user,
              token: refreshed.tokens.accessToken,
            }),
          );
        } else if (!user) {
          const profile = await authApi.getMe();
          dispatch(setUser(profile));
        }

        connectSocket();
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setInitialized(true));
      }
    };

    if (!isInitialized) {
      void init();
    } else if (isAuthenticated) {
      connectSocket();
    }
  }, [dispatch, isAuthenticated, token, user, isInitialized]);

  return null;
};
