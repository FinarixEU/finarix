const API_BASE = 'https://finarix-api.onrender.com/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
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
