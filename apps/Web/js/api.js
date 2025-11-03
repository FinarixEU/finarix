// apps/Web/js/api.js
const API_BASE = 'https://finarix.onrender.com/api';
const TOKEN_KEY = 'token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

function authHeader() {
  const t = getToken();
  return t ? { Authorization: Bearer ${t} } : {};
}

async function apiFetch(path, opts = {}) {
  const url = API_BASE + path;

  const method = opts.method || (opts.body ? 'POST' : 'GET');
  const isJsonBody = opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData);

  const res = await fetch(url, {
    method,
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...authHeader(),
      ...(opts.headers || {})
    },
    body: isJsonBody ? JSON.stringify(opts.body) : opts.body ?? null,
    mode: 'cors',
    credentials: 'omit',
  });

  const raw = await res.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = raw; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || res.statusText || 'Fehler';
    throw new Error(msg);
  }
  return data;
}

function saveToken(accessToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  location.href = './login.html';
}

console.log('[api.js] LOADED', API_BASE);
