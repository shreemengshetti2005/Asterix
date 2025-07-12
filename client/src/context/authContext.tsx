import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  username: string;
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
  login: (email: string, password: string) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation - in real app, this would be API call
    if (email && password.length >= 6) {
      const userData: User = {
        id: "1",
        email,
        username: email.split("@")[0],
        reputation: 1247,
        joinDate: new Date().toISOString().split("T")[0],
        badges: {
          gold: 2,
          silver: 15,
          bronze: 43,
        },
      };
      setUser(userData);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation - in real app, this would be API call
    if (email && password.length >= 6 && username.length >= 3) {
      const userData: User = {
        id: "1",
        email,
        username,
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
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
