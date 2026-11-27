import React, { useEffect, useState } from 'react';
import DashboardAccess from './components/DashboardAccess.jsx';
import { getCurrentUser } from './services/auth.js';
import Home from './pages/home.jsx';
import Dashboard from './pages/dashboard.jsx';

const TOKEN_KEY = 'codearena.access_token';

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const isDashboardRoute = window.location.pathname.replace(/\/$/, '') === '/dashboard';

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuthReady(true);
      return;
    }

    getCurrentUser(token)
      .then(setUser)
      .catch(() => window.localStorage.removeItem(TOKEN_KEY))
      .finally(() => setAuthReady(true));
  }, []);

  const handleAuthenticated = async (token) => {
    const currentUser = await getCurrentUser(token);
    window.localStorage.setItem(TOKEN_KEY, token);
    setUser(currentUser);
    setAuthReady(true);

    if (!isDashboardRoute) window.location.assign('/dashboard');
  };

  if (isDashboardRoute) {
    if (!authReady) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#08090D] text-sm text-zinc-400">
          Checking your CodeArena session…
        </main>
      );
    }

    return user ? <Dashboard /> : <DashboardAccess onAuthenticated={handleAuthenticated} />;
  }

  return <Home onAuthenticated={handleAuthenticated} />;
}

export default App;
