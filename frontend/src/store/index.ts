import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import themeReducer from '@features/theme/themeSlice';
import uiReducer from '@features/ui/uiSlice';
import workspaceReducer from '@features/workspace/workspaceSlice';
import adminReducer from '@features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    workspace: workspaceReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
