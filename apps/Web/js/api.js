// /apps/Web/js/api.js
(function () {
  // >>>> Falls nötig hier anpassen
  const API_BASE = (window.API_BASE || 'https://finarix.onrender.com/api');

  function getToken() {
    return localStorage.getItem('token') || '';
  }

  async function apiFetch(path, opts = {}) {
    const url = API_BASE + path;
    const method = (opts.method || 'GET').toUpperCase();

    const headers = {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    };

    const token = getToken();
    if (token) headers['Authorization'] = Bearer ${token};

    const fetchOpts = {
      method,
      headers,
      mode: 'cors',
      credentials: 'omit',
    };

    if (opts.body != null) {
      fetchOpts.body = typeof opts.body === 'string'
        ? opts.body
        : JSON.stringify(opts.body);
    }

    const res = await fetch(url, fetchOpts);
    const text = await res.text();

    let data;
    try { data = text ? JSON.parse(text) : null; }
    catch { data = text; }

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || ${res.status} ${res.statusText};
      throw new Error(msg);
    }
    return data;
  }

  function logout() {
    localStorage.removeItem('token');
    location.href = './login.html';
  }

  // global machen
  window.API_BASE = API_BASE;
  window.apiFetch = apiFetch;
  window.logout = logout;

  console.log('[api.js] LOADED:', API_BASE);
})();
