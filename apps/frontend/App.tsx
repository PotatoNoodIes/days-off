import { AuthProvider, ThemeProvider } from '@time-sync/ui';
import AppNavigation from './shared/navigation/AppNavigation';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </AuthProvider>
  );
}