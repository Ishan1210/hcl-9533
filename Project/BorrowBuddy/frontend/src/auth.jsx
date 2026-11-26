import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Access token stays in memory; a page reload requires signing in again.
  const [session, setSession] = useState(null);
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => setSession(null), Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [session]);
  const login = async credentials => {
    const result = await api('/auth/login', { method: 'POST', body: credentials });
    setSession({ ...result, expiresAt: Date.now() + 29.8 * 60 * 1000 });
  };
  const logout = () => setSession(null);
  const updateUser = user => setSession(previous => previous ? { ...previous, user } : null);
  return <AuthContext.Provider value={{ user: session?.user, token: session?.token, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}
