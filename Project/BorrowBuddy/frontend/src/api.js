const base = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export async function api(path, { token, method = 'GET', body, signal } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  let response;
  try {
    response = await fetch(base + path, {
      method, headers, signal, body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Cannot reach BorrowBuddy. Check that the backend is running.');
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const details = data?.errors ? Object.values(data.errors).filter(Boolean).join('. ') : '';
    const error = new Error(details || data?.message || data?.detail || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return data;
}

