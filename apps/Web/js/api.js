const API_BASE = 'https://finarix.onrender.com/api';

async function apiFetch(path, options = {}) {
  const url = API_BASE + path;

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    body: options.body || null,
    mode: 'cors',          // 💥 Wichtig für CORS!
    credentials: 'omit',   // Keine Cookies senden (Render braucht das so)
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText };
    }
    throw new Error(err.message || res.statusText);
  }

  return res.json();
}
