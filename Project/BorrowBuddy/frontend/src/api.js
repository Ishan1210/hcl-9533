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


export function localDate() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = type => parts.find(part => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
export function addDays(date, count) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + count);
  return d.toISOString().slice(0, 10);
}
export function rentalDays(start, end) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1;
}
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value));
export const rate = value => Number(value) === 0 ? 'Free' : `${money(value)}/day`;
export const dateLabel = date => new Date(date + 'T00:00:00Z').toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'});
export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location is not supported by this browser.'));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: Number(coords.latitude.toFixed(3)), longitude: Number(coords.longitude.toFixed(3)) }),
      () => reject(new Error('Location unavailable. Allow browser location access, or enter coordinates manually.')),
      { timeout: 12000, maximumAge: 60000 }
    );
  });
}
