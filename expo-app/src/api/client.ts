import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/auth/tokenStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api/';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(cb: () => void) { onUnauthorized = cb; }

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const access = await tokenStorage.getAccess();
  if (access) config.headers.set('Authorization', `Bearer ${access}`);
  return config;
});

// Single-flight refresh
let refreshPromise: Promise<string | null> | null = null;
async function refreshAccess(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const refresh = await tokenStorage.getRefresh();
      if (!refresh) return null;
      const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh });
      const access = res.data?.access as string | undefined;
      const newRefresh = res.data?.refresh as string | undefined;
      if (!access) return null;
      await tokenStorage.setTokens(access, newRefresh);
      return access;
    } catch {
      return null;
    } finally {
      // allow next refresh cycle after this completes
      setTimeout(() => { refreshPromise = null; }, 0);
    }
  })();
  return refreshPromise;
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('token/')) {
      original._retry = true;
      const newAccess = await refreshAccess();
      if (newAccess) {
        original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${newAccess}` };
        return api.request(original);
      }
      await tokenStorage.clear();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
