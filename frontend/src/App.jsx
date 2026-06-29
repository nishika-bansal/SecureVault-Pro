import { useEffect, useState } from 'react';
import AuthScreen from './components/AuthScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function AppContent() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('svp-theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('svp-theme', theme);
  }, [theme]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
          <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
          Loading vault
        </div>
      </div>
    );
  }

  return user ? (
    <Dashboard theme={theme} setTheme={setTheme} />
  ) : (
    <AuthScreen theme={theme} setTheme={setTheme} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
