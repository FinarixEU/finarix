<!-- Datei: apps/Web/js/api.js -->
<script>
// Basis-URL deiner API auf Render
const API_BASE = 'https://finarix.onrender.com/api';

// Universeller Fetch-Helper
async function apiRequest(path, options = {}) {
  const url = API_BASE + path;

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : null,
    mode: 'cors',
    credentials: 'omit' // keine Cookies nötig
  });

  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

// Für Debugging – siehst du in der Konsole, ob das Script geladen wurde
console.log('[api.js] geladen, API_BASE =', API_BASE);
</script>
