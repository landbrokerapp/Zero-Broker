import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { auth, setupRecaptcha, sendOtp } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
  login: (phone: string) => Promise<any>;
  verifyOtp: (confirmationResult: any, otp: string) => Promise<boolean>;
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
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user to our User interface
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          username: firebaseUser.phoneNumber || '',
          phone: firebaseUser.phoneNumber || '',
          role: 'user' // Default role
        };

        // Check if role is stored in localStorage
        const savedRole = localStorage.getItem(`role_${firebaseUser.uid}`);
        if (savedRole) {
          userData.role = savedRole as any;
        }

        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (phone: string): Promise<any> => {
    setIsLoading(true);
    try {
      // Setup Recaptcha
      const verifier = setupRecaptcha('recaptcha-container');

      // Send OTP
      const confirmationResult = await sendOtp(`+91${phone}`, verifier);
      return confirmationResult;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (confirmationResult: any, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      return !!result.user;
    } catch (err) {
      console.error('OTP Verification error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('demo_user');
    setUser(null);
    navigate('/auth');
  };

  const setUserRole = (role: 'user' | 'seller' | 'admin') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem(`role_${user.id}`, role);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOtp, logout, setUserRole, isAuthenticated: !!user, isLoading }}>
      {children}
      <div id="recaptcha-container"></div>
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
