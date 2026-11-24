import { api, useMocks } from './api.js';

const AUTH_KEY = 'novadent:user';
const TOKEN_KEY = 'novadent:token';
const USERS_KEY = 'novadent:users';

const demoUsers = [
  { id: 'u-admin', name: 'Administrador NovaDent', email: 'admin@novadent.co', password: 'novadent2026', role: 'ADMINISTRADOR' },
  { id: 'u-dentist', name: 'Dra. Laura Gómez', email: 'odontologo@novadent.co', password: 'odontologo2026', role: 'ODONTOLOGO', dentistId: 'd-2001', patientIds: ['p-1001', 'p-1006'] },
  { id: 'u-reception', name: 'Recepcionista NovaDent', email: 'recepcion@novadent.co', password: 'recepcion2026', role: 'RECEPCIONISTA' },
  { id: 'u-patient', name: 'Valentina Rojas', email: 'paciente@novadent.co', password: 'paciente2026', role: 'PACIENTE', patientId: 'p-1001' },
];

function users() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY) || 'null');
    if (stored) return stored;
  } catch {}
  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  return demoUsers;
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function login(credentials) {
  let response;
  if (useMocks) {
    const found = users().find((item) => item.email.toLowerCase() === credentials.email.trim().toLowerCase());
    if (!found || found.password !== credentials.password) throw new Error('Correo o contraseña incorrectos.');
    response = { user: publicUser(found) };
  } else {
    response = await api.post('/auth/login', credentials);
  }
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

export async function registerPatient(data) {
  if (!useMocks) return api.post('/auth/register', { ...data, role: 'PACIENTE' });

  const existing = users().find((item) => item.email.toLowerCase() === data.email.trim().toLowerCase());
  if (existing) throw new Error('Ya existe una cuenta registrada con este correo.');

  const patientId = `p-${Date.now()}`;
  const account = {
    id: `u-${Date.now()}`,
    name: data.name,
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: 'PACIENTE',
    patientId,
  };
  const nextUsers = [...users(), account];
  localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

  const patientData = {
    id: patientId,
    name: data.name,
    documentType: data.documentType,
    document: data.document,
    birthDate: data.birthDate,
    phone: data.phone,
    countryCode: data.countryCode,
    email: account.email,
  };
  const patientsKey = 'novadent:patients';
  const stored = JSON.parse(localStorage.getItem(patientsKey) || '[]');
  localStorage.setItem(patientsKey, JSON.stringify([patientData, ...stored]));

  return publicUser(account);
}

export function listUsers() {
  if (!useMocks) return api.get('/users');
  return Promise.resolve(users().map(publicUser));
}

export function updateUserRole(id, role) {
  if (!useMocks) return api.put(`/users/${id}/role`, { role });
  const allowed = ['ADMINISTRADOR', 'ODONTOLOGO', 'RECEPCIONISTA', 'PACIENTE'];
  if (!allowed.includes(role)) throw new Error('Rol no válido.');
  const nextUsers = users().map((item) => item.id === id ? { ...item, role } : item);
  localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  const current = getCurrentUser();
  if (current?.id === id) localStorage.setItem(AUTH_KEY, JSON.stringify(publicUser(nextUsers.find((item) => item.id === id))));
  return Promise.resolve(publicUser(nextUsers.find((item) => item.id === id)));
}