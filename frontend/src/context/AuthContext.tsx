import { createContext, useContext, useState, ReactNode, } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
  token: string | null;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // Mock login - in real app would call auth service API
    setUser({
      id: 1,
      email: email,
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
      token: 'mock-jwt-token',
    });
    localStorage.setItem('shopSphereToken', 'mock-jwt-token');
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopSphereToken');
    window.location.href = '/login';
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    // Mock registration
    setUser({
      id: 2,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'CUSTOMER',
      token: 'mock-jwt-token',
    });
    localStorage.setItem('shopSphereToken', 'mock-jwt-token');
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('shopSphereToken');
    if (token) {
      setUser({
        id: 1,
        email: 'test@shopsphere.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'CUSTOMER',
        token,
      });
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};