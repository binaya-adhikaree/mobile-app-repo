import * as SecureStore from 'expo-secure-store';

const ACCESS = 'auth.access';
const REFRESH = 'auth.refresh';

export const tokenStorage = {
  async getAccess() { return SecureStore.getItemAsync(ACCESS); },
  async getRefresh() { return SecureStore.getItemAsync(REFRESH); },
  async setTokens(access: string, refresh?: string) {
    await SecureStore.setItemAsync(ACCESS, access);
    if (refresh) await SecureStore.setItemAsync(REFRESH, refresh);
  },
  async clear() {
    await SecureStore.deleteItemAsync(ACCESS).catch(() => {});
    await SecureStore.deleteItemAsync(REFRESH).catch(() => {});
  },
};
