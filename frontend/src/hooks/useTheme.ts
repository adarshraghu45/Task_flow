import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setTheme } from '@features/theme/themeSlice';
import type { Theme } from '@app-types/index';

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  return { theme, setTheme: updateTheme };
};
