import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUserData = localStorage.getItem('userData');
        
        if (storedToken) {
          // Verify token with backend
          try {
            const userData = await apiService.getProfile();
            setToken(storedToken);
            setUser(userData);
            
            // Update localStorage with fresh data from backend
            localStorage.setItem('userData', JSON.stringify(userData));
          } catch (error) {
            // Token is invalid, try to use stored user data as fallback
            if (storedUserData) {
              try {
                const parsedUserData = JSON.parse(storedUserData);
                setUser(parsedUserData);
                setToken(storedToken);
              } catch (parseError) {
                // Clear corrupted data
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
              }
            } else {
              localStorage.removeItem('token');
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password);
      
      setToken(response.token);
      setUser(response.user);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.register(name, email, password);
      
      // Don't auto-login after signup, just return success
      // The user will need to login manually
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Clear state
    setToken(null);
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        await apiService.updateProfile(userData);
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        
        // Store user data in localStorage for persistence across sessions
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
