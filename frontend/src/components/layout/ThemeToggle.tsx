import { Button } from '@components/ui';
import { useTheme } from '@hooks/useTheme';
import type { Theme } from '@app-types/index';

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
];

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length].value;
    setTheme(nextTheme);
  };

  const current = themes.find((t) => t.value === theme);

  return (
    <Button variant="ghost" size="sm" onClick={cycleTheme} aria-label="Toggle theme">
      <span>{current?.icon}</span>
      <span className="hidden sm:inline">{current?.label}</span>
    </Button>
  );
};
