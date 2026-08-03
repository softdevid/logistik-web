import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, apiRequest, loginRequest, logoutRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (username, password) => {
    const data = await loginRequest(username, password);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!api.hasTokens()) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiRequest("/auth/me");
        if (res.ok) {
          const me = await res.json();
          if (active) setUser(me);
        } else {
          if (active) setUser(null);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
