const API_URL = "http://localhost:8080/api";

let accessToken = localStorage.getItem("access_token") || null;
let refreshToken = localStorage.getItem("refresh_token") || null;
let refreshPromise = null;

export const api = {
  setTokens(access, refresh) {
    accessToken = access;
    refreshToken = refresh;
    if (access) localStorage.setItem("access_token", access);
    else localStorage.removeItem("access_token");
    if (refresh) localStorage.setItem("refresh_token", refresh);
    else localStorage.removeItem("refresh_token");
  },
  clearTokens() {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  getAccessToken() {
    return accessToken;
  },
  hasTokens() {
    return !!refreshToken;
  },
};

// refresh otomatis: semua request yang 401 akan mencoba refresh sekali
// (single-flight, tidak dobel-dobel request refresh)
async function tryRefresh() {
  if (!refreshToken) return false;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) {
        api.clearTokens();
        return false;
      }
      const data = await res.json();
      api.setTokens(data.access_token, data.refresh_token);
      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && refreshToken) {
    const ok = await tryRefresh();
    if (ok) {
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }
  return res;
}

export async function loginRequest(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login gagal");
  api.setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function logoutRequest() {
  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch {
      // token lokal tetap dibersihkan walau request logout gagal
    }
  }
  api.clearTokens();
}
