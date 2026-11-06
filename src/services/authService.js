import { api, useMocks } from './api.js';

const AUTH_KEY = 'novadent:user';
const TOKEN_KEY = 'novadent:token';

export async function login(credentials) {
  const response = useMocks
    ? { user: { name: credentials.email.split('@')[0].replace(/[._-]/g, ' '), email: credentials.email } }
    : await api.post('/auth/login', credentials);
  const user = response.user ?? response;
  if (response.accessToken) localStorage.setItem(TOKEN_KEY, response.accessToken);
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}