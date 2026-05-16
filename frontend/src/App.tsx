import { AppRouter } from '@routes/AppRouter';
import { AppProviders } from '@/app/providers';
import { AuthBootstrap } from '@/app/AuthBootstrap';
import { useTheme } from '@hooks/useTheme';

const ThemeInitializer = () => {
  useTheme();
  return null;
};

function App() {
  return (
    <AppProviders>
      <ThemeInitializer />
      <AuthBootstrap />
      <AppRouter />
    </AppProviders>
  );
}

export default App;
