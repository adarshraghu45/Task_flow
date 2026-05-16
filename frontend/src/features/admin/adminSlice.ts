import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AdminFilters {
  search: string;
  status: string;
  role: string;
  page: number;
  limit: number;
}

interface AdminState {
  commandPaletteOpen: boolean;
  userFilters: AdminFilters;
  workspaceFilters: Omit<AdminFilters, 'role'>;
  taskFilters: Omit<AdminFilters, 'role'>;
  reportFilters: { status: string; page: number; limit: number };
}

const defaultFilters: AdminFilters = {
  search: '',
  status: '',
  role: '',
  page: 1,
  limit: 10,
};

const initialState: AdminState = {
  commandPaletteOpen: false,
  userFilters: { ...defaultFilters },
  workspaceFilters: { search: '', status: '', page: 1, limit: 10 },
  taskFilters: { search: '', status: '', page: 1, limit: 10 },
  reportFilters: { status: 'pending', page: 1, limit: 10 },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.commandPaletteOpen = action.payload;
    },
    setUserFilters: (state, action: PayloadAction<Partial<AdminFilters>>) => {
      state.userFilters = { ...state.userFilters, ...action.payload };
    },
    setWorkspaceFilters: (state, action: PayloadAction<Partial<AdminState['workspaceFilters']>>) => {
      state.workspaceFilters = { ...state.workspaceFilters, ...action.payload };
    },
    setTaskFilters: (state, action: PayloadAction<Partial<AdminState['taskFilters']>>) => {
      state.taskFilters = { ...state.taskFilters, ...action.payload };
    },
    setReportFilters: (state, action: PayloadAction<Partial<AdminState['reportFilters']>>) => {
      state.reportFilters = { ...state.reportFilters, ...action.payload };
    },
  },
});

export const {
  setCommandPaletteOpen,
  setUserFilters,
  setWorkspaceFilters,
  setTaskFilters,
  setReportFilters,
} = adminSlice.actions;
export default adminSlice.reducer;
