// Datei: apps/Web/js/api.js
const API_BASE = 'https://finarix.onrender.com/api';

function getToken() {
  return localStorage.getItem('token') || '';
}
function setToken(t) {
  if (t) localStorage.setItem('token', t);
}

async function apiFetch(path, opts = {}) {
  const method = opts.method || (opts.body ? 'POST' : 'GET');
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    mode: 'cors',
    credentials: 'omit',
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || res.statusText;
    throw new Error(msg);
  }
  return data;
}

// global verfügbar machen
window.apiFetch = apiFetch;
window.apiToken = { get: getToken, set: setToken };

function logout() {
  localStorage.removeItem('token');
  location.href = './login.html';
}
window.logout = logout;

console.log('[api.js] LOADED', API_BASE);
