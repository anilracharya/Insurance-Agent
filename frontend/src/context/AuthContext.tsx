import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import client from '../api/client';
import type { AuthResponse, LoginRequest, RegisterRequest, ApiResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await client.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const auth = res.data.data!;
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify(auth));
    setUser(auth);
  };

  const register = async (data: RegisterRequest) => {
    const res = await client.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const auth = res.data.data!;
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify(auth));
    setUser(auth);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
