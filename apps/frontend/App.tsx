import { AuthProvider, ThemeProvider } from '@time-sync/ui';
import AppNavigation from './shared/navigation/AppNavigation';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}