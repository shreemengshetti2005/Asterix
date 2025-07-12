import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { apiService } from "../services/api";
import type { ApiResponse, User as ApiUser } from "../services/api";

interface User {
  id: number;
  email: string;
  username: string;
  isAdmin?: boolean;
  reputation: number;
  joinDate: string;
  badges: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, onSuccess?: (isAdmin: boolean) => void) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    username: string,
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage on component mount
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string, onSuccess?: (isAdmin: boolean) => void): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response: ApiResponse<ApiUser> = await apiService.login({ email, password });
      
      if (response.status === 200 && response.data) {
        const userData: User = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
          isAdmin: response.data.isAdmin || false,
          reputation: 1, // Default reputation for new users
          joinDate: new Date().toISOString().split("T")[0],
          badges: {
            gold: 0,
            silver: 0,
            bronze: 0,
          },
        };
        setUser(userData);
        setIsLoading(false);
        
        // Call success callback with admin status
        if (onSuccess) {
          onSuccess(userData.isAdmin || false);
        }
        
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response: ApiResponse<ApiUser> = await apiService.signup({ email, password, username });
      
      if (response.status === 200 && response.data) {
        const userData: User = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
          reputation: 1,
          joinDate: new Date().toISOString().split("T")[0],
          badges: {
            gold: 0,
            silver: 0,
            bronze: 0,
          },
        };
        setUser(userData);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Since there's no logout endpoint in the API, we'll just clear local state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local user state
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
