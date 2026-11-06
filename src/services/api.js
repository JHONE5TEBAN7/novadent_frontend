const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('Configura VITE_API_URL para conectar con el backend.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('novadent:token') ? { Authorization: `Bearer ${localStorage.getItem('novadent:token')}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiRequest(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => apiRequest(path, { method: 'DELETE' }),
};

export const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';