// Pengelola token login:
// - access token (mysmk_token)  : umur pendek (±30 menit), dikirim di header X-Authorization
// - refresh token (mysmk_refresh): umur panjang (7 hari), ditukar ke /refresh-token saat access token habis
import axios from "axios";
import Cookies from "js-cookie";

export const ACCESS_COOKIE = "mysmk_token";
export const REFRESH_COOKIE = "mysmk_refresh";
const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8085/").replace(/\/?$/, "/");

export function setTokens(token, refreshToken) {
  if (token) Cookies.set(ACCESS_COOKIE, token, { expires: 7 });
  if (refreshToken) Cookies.set(REFRESH_COOKIE, refreshToken, { expires: 7 });
}

export const getRefreshToken = () => Cookies.get(REFRESH_COOKIE);

// Satu proses refresh untuk semua request yang gagal bersamaan
let refreshing = null;
export function refreshAccessToken() {
  if (!refreshing) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.reject(new Error("Tidak ada refresh token"));
    refreshing = axios
      .post(`${API_URL}refresh-token`, { refreshToken })
      .then((res) => {
        setTokens(res.data.token, res.data.refreshToken);
        return res.data.token;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export function clearSession({ redirect = true } = {}) {
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
  localStorage.clear();
  if (redirect) window.location.replace("/login");
}

/** Logout: cabut refresh token di server (best effort), lalu hapus sesi lokal. */
export async function logout() {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await axios.post(`${API_URL}logout`, { refreshToken }, { timeout: 5000 });
    }
  } catch (e) {
    // tetap logout lokal walau server tidak terjangkau
  }
  clearSession();
}

const isAuthUrl = (url = "") => /(refresh-token|\/login|logout)$/.test(url.split("?")[0]);

/**
 * Pasang penanganan 401 pada instance axios:
 * 401 -> tukar refresh token -> ulangi request sekali. Gagal -> keluar ke /login.
 */
export function attachRefreshInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const config = error?.config;

      if (status === 401 && config && !config._retry && !isAuthUrl(config.url) && getRefreshToken()) {
        config._retry = true;
        try {
          const token = await refreshAccessToken();
          config.headers = { ...(config.headers || {}), "X-Authorization": `Bearer ${token}` };
          return instance(config);
        } catch (e) {
          clearSession();
          return Promise.reject(error);
        }
      }

      if (status === 401) {
        clearSession();
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
}
