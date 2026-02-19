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
  login: (email: string, password: string) => Promise<boolean>; // Keep for compatibility
  loginWithPassword: (phone: string, password: string) => Promise<boolean>;
  registerWithPassword: (phone: string, password: string) => Promise<boolean>;
  resetPassword: (phone: string, newPassword: string) => Promise<boolean>;
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
    // 1. Check active session from Supabase or localStorage
    const checkSession = async () => {
      try {
        // Check for demo user or admin user in localStorage first
        const demoUserStr = localStorage.getItem('demo_user');
        const adminUserStr = localStorage.getItem('admin_user');

        if (demoUserStr) {
          const demoUser = JSON.parse(demoUserStr);
          setUser(demoUser);
          setIsLoading(false);
          return;
        }

        if (adminUserStr) {
          const adminUser = JSON.parse(adminUserStr);
          setUser(adminUser);
          setIsLoading(false);
          return;
        }

        // Check Supabase session
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

  const loginWithPassword = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const email = `${phone}@zerobroker.com`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return !!data.user;
    } catch (err: any) {
      console.error('Login error:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithPassword = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const email = `${phone}@zerobroker.com`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: phone,
          }
        }
      });

      if (error) throw error;
      return !!data.user;
    } catch (err: any) {
      console.error('Registration error:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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

      // OTP-based login (phone number + OTP)
      // Check if email looks like a phone number (10 digits)
      if (/^\d{10}$/.test(email) && password === '123456') {
        const demoUser: User = {
          id: `user-${email}`,
          name: 'Demo User',
          username: email,
          phone: email,
          role: 'user'
        };
        setUser(demoUser);
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        return true;
      }

      // Real Supabase Login (email + password)
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
    // Clear local bypass users
    localStorage.removeItem('admin_user');
    localStorage.removeItem('demo_user');

    // Sign out from Supabase
    await supabase.auth.signOut();

    setUser(null);
    if (window.location.pathname.startsWith('/admin')) {
      navigate('/admin/login');
    } else {
      navigate('/');
    }
  };

  const setUserRole = (role: 'user' | 'seller' | 'admin') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      // Note: We don't persist this role change to Supabase here because that requires DB updates.
      // This is local state only for the session.
    }
  };

  const resetPassword = async (phone: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Note: Real password reset for pseudo-emails in Supabase requires 
      // an SMS gateway or custom backend logic. 
      // For now, we simulate a successful request.
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Password reset requested for ${phone} with new password: ${newPassword}`);
      return true;
    } catch (err: any) {
      console.error('Reset error:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithPassword,
      registerWithPassword,
      resetPassword,
      logout,
      setUserRole,
      isAuthenticated: !!user,
      isLoading
    }}>
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
