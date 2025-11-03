const API_BASE = 'https://finarix.onrender.com/api';

// Generische Request Funktion
async function apiRequest(path, options = {}) {
  const url = API_BASE + path;

  const res = await fetch(url, {
    method: options.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? options.body : null, // <-- body NICHT doppelt JSON.stringify
    mode: 'cors',
    credentials: 'omit'
  });

  const text = await res.text();
  let data = null;

  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || res.statusText;
    throw new Error(msg);
  }

  return data;
}

// Damit login.html es nutzen kann
window.apiFetch = (path, opts = {}) => {
  return apiRequest(path, opts);
};

console.log('[api.js] ✅ Loaded:', API_BASE);
