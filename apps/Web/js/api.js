// --- API-Basis ---
const API_BASE = 'https://finarix.onrender.com/api';

// --- Token Helpers ---
export function getToken() {
  return localStorage.getItem('token'); // wird beim Login gesetzt
}
export function setToken(token) {
  if (token) localStorage.setItem('token', token);
}
export function clearToken() {
  localStorage.removeItem('token');
}

// --- Low-level Request ---
async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();
  const res = await fetch(API_BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: Bearer ${token} } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    mode: 'cors',
    credentials: 'omit',
  });

  // Bestmöglich parsen
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      ${res.status} ${res.statusText};
    throw new Error(msg);
  }
  return data;
}

// --- Convenience ---
export const apiGet  = (path)           => apiRequest(path, { method: 'GET' });
export const apiPost = (path, body = {}) => apiRequest(path, { method: 'POST', body });

console.log('[api.js] LOADED:', API_BASE);
