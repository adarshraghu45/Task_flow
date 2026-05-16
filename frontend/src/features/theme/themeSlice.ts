import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '@app-types/index';
import { THEME_STORAGE_KEY } from '@lib/constants';
import { storage } from '@utils/storage';

interface ThemeState {
  theme: Theme;
}

const getInitialTheme = (): Theme => {
  return storage.get<Theme>(THEME_STORAGE_KEY) ?? 'dark';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { theme: getInitialTheme() } satisfies ThemeState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      storage.set(THEME_STORAGE_KEY, action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
