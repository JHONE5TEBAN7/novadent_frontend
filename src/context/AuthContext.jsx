import { createContext, useContext, useState } from 'react';
import { getCurrentUser, login as loginService, logout as logoutService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);

  async function login(credentials) {
    const nextUser = await loginService(credentials);
    setUser(nextUser);
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}