// Basis-URL deiner API (Nest hat globalen Prefix /api)
const API_BASE = 'https://finarix-api.onrender.com/api';

/**
 * Kleiner Fetch-Wrapper:
 * - hängt automatisch API_BASE an (wenn path nicht absolut ist)
 * - sendet JSON-Header
 * - hängt vorhandenes JWT aus localStorage an (Authorization: Bearer …)
 * - wirft bei HTTP-Fehlern eine verständliche Fehlermeldung
 */
async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : ${API_BASE}${path};

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Token automatisch mitschicken (falls vorhanden)
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = Bearer ${token};

  const res = await fetch(url, { ...options, headers, credentials: 'omit' });

  // Antwort als Text lesen und sicher JSON-parsen
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || HTTP ${res.status};
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
