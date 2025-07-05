'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('adminToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('adminToken');
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    // Super admin has all permissions
    if (user.role === 'SUPER_ADMIN') return true;
    
    // Check if user has specific permission
    return user.permissions && user.permissions.includes(permission);
  };

  const value = {
    user,
    loading,
    initialized,
    login,
    logout,
    checkAuth,
    hasPermission,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isAdmin: user?.role === 'ADMIN',
    userRole: user?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
