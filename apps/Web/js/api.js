<script>
  window.API_URL = 'https://finarix.onrender.com/api';
  async function apiFetch(path, options = {}) {
    const headers = options.headers || {};
    if (localStorage.getItem('token')) {
      headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }
    headers['Content-Type'] = 'application/json';
    const res = await fetch(${window.API_URL}${path}, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  }
</script>
