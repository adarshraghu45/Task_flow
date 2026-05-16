import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@app-types/index';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@lib/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUser(),
  token: localStorage.getItem(AUTH_TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(AUTH_TOKEN_KEY),
  isLoading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isInitialized = true;
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user));
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload));
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setCredentials, updateToken, logout, setLoading, setUser, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
