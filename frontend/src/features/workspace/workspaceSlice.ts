import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Workspace } from '@app-types/index';
import { WORKSPACE_STORAGE_KEY } from '@lib/constants';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isLoading: boolean;
}

const loadCurrentId = (): string | null => localStorage.getItem(WORKSPACE_STORAGE_KEY);

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspaceId: loadCurrentId(),
  isLoading: false,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
      if (!state.currentWorkspaceId && action.payload.length > 0) {
        state.currentWorkspaceId = action.payload[0].id;
        localStorage.setItem(WORKSPACE_STORAGE_KEY, action.payload[0].id);
      }
    },
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspaceId = action.payload;
      localStorage.setItem(WORKSPACE_STORAGE_KEY, action.payload);
    },
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.workspaces.push(action.payload);
      state.currentWorkspaceId = action.payload.id;
      localStorage.setItem(WORKSPACE_STORAGE_KEY, action.payload.id);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearWorkspaces: (state) => {
      state.workspaces = [];
      state.currentWorkspaceId = null;
      localStorage.removeItem(WORKSPACE_STORAGE_KEY);
    },
    removeWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
      if (state.currentWorkspaceId === action.payload) {
        state.currentWorkspaceId = state.workspaces[0]?.id ?? null;
        if (state.currentWorkspaceId) {
          localStorage.setItem(WORKSPACE_STORAGE_KEY, state.currentWorkspaceId);
        } else {
          localStorage.removeItem(WORKSPACE_STORAGE_KEY);
        }
      }
    },
  },
});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  setLoading,
  clearWorkspaces,
  removeWorkspace,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
