import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI } from '@/api/endpoints';
import { api, setOnUnauthorized } from '@/api/client';
import { tokenStorage } from '@/auth/tokenStorage';
import type { User } from '@/types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (p: { email: string; password: string; first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    await tokenStorage.clear();
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    try { setUser(await AuthAPI.me()); } catch { setUser(null); }
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => { setUser(null); });
    (async () => {
      const access = await tokenStorage.getAccess();
      if (access) await refreshMe();
      setLoading(false);
    })();
  }, [refreshMe]);

  const signIn = useCallback(async (email: string, password: string) => {
    const tokens = await AuthAPI.login(email, password);
    await tokenStorage.setTokens(tokens.access, tokens.refresh);
    await refreshMe();
  }, [refreshMe]);

  const signUp = useCallback(async (p: { email: string; password: string; first_name?: string; last_name?: string }) => {
    await AuthAPI.register(p);
    await signIn(p.email, p.password);
  }, [signIn]);

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut, refreshMe }), [user, loading, signIn, signUp, signOut, refreshMe]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
