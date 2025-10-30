const API_BASE = 'https://finarix.onrender.com/api';

async function apiRequest(path, options = {}) {
  const url = API_BASE + path;

  const res = await fetch(url, {
    method: options.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : null,
    mode: 'cors',
    credentials: 'omit'
  });

  // Handle text/JSON safely
  const txt = await res.text();
  let data;
  try { data = JSON.parse(txt); } catch { data = txt; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || res.statusText || 'Fehler';
    throw new Error(msg);
  }

  return data;
}

console.log('[api.js] ✅ geladen:', API_BASE');
