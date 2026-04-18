import { createContext, useState, useEffect, useContext } from 'react';
import { userProfileApi, authApi } from '../api/authApi';
import { axiosInstance } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'GUEST' or 'HOTEL_MANAGER'
  const [isLoading, setIsLoading] = useState(true);

  // Decoupled profile fetching
  const resolveProfile = async (currentRole) => {
    try {
       // Based on FRONTEND_helper.md architecture:
       if (currentRole === 'HOTEL_MANAGER') {
          const response = await axiosInstance.get('/api/v1/admin/profile');
          setUser(response.data.data || response.data); 
          setRole('HOTEL_MANAGER');
       } else {
          const response = await userProfileApi.getProfile();
          setUser(response.data.data || response.data); 
          setRole('GUEST');
       }
    } catch (err) {
       console.error('Failed to load active profile', err);
       logout();
    }
  };

  // Re-hydrate state on startup
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const cachedRole = localStorage.getItem('activeRole');
    
    if (!token || !cachedRole) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    resolveProfile(cachedRole).finally(() => setIsLoading(false));
  }, []);

  const loginUser = (token, roleOverride) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('activeRole', roleOverride);
    
    // Instead of forcing page reload, resolve profile cleanly and update state
    setIsLoading(true);
    resolveProfile(roleOverride).then(() => {
       setIsLoading(false);
    });
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setRole(null);
    localStorage.removeItem('activeRole');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, loginUser, logout, resolveProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
