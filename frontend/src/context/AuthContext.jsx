import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('svp-token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const saveSession = useCallback((session) => {
    localStorage.setItem('svp-token', session.token);
    setToken(session.token);
    setUser(session.user);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('svp-token');
    setToken(null);
    setUser(null);
  }, []);

  const authFetch = useCallback(
    (path, options = {}) => apiFetch(path, { ...options, token }),
    [token]
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    apiFetch('/auth/me', { token })
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) clearSession();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clearSession, token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      authFetch,
      register: async (payload) => {
        const session = await apiFetch('/auth/register', { method: 'POST', body: payload });
        saveSession(session);
        return session;
      },
      login: async (payload) => {
        const session = await apiFetch('/auth/login', { method: 'POST', body: payload });
        saveSession(session);
        return session;
      },
      logout: async () => {
        if (token) {
          await apiFetch('/auth/logout', { method: 'POST', token }).catch(() => {});
        }
        clearSession();
      }
    }),
    [authFetch, clearSession, loading, saveSession, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
