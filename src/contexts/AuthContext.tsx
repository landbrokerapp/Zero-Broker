import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  username: string; // We'll map email to username for now
  phone: string;
  role: 'admin' | 'user' | 'seller';
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUserRole: (role: 'user' | 'seller' | 'admin') => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check active session from Supabase
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            username: session.user.email || '',
            phone: session.user.phone || '',
            email: session.user.email,
            // Simple robust role check: if email is admin's, make them admin. 
            // In a real app, you'd fetch this from a 'profiles' table.
            role: session.user.email === 'admin@zerobroker.com' ? 'admin' : 'user'
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          username: session.user.email || '',
          phone: session.user.phone || '',
          email: session.user.email,
          role: session.user.email === 'admin@zerobroker.com' ? 'admin' : 'user'
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Hardcoded admin bypass for "Shanmu" (Backward Compatibility)
      if (email === 'Shanmu' && password === '123456') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Shanmu',
          username: 'Shanmu',
          phone: '1234567890',
          role: 'admin'
        };
        setUser(adminUser);
        // We still use localStorage for the bypass user so they don't lose session on reload
        // (This logic mirrors the previous manual persistence)
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        return true;
      }

      // Real Supabase Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error.message);
        return false;
      }

      if (data.user) {
        // onAuthStateChange will handle setting the user state
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login exception:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Clear local bypass
    localStorage.removeItem('admin_user');

    // Sign out from Supabase
    await supabase.auth.signOut();

    setUser(null);
    navigate('/admin/login');
  };

  const setUserRole = (role: 'user' | 'seller' | 'admin') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      // Note: We don't persist this role change to Supabase here because that requires DB updates.
      // This is local state only for the session.
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUserRole, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
