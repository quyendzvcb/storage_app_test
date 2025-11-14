import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api'; // <-- CHỈ IMPORT TỪ "CẦU DAO"

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [userProfile, setUserProfile] = useState(null); // { username, plan, usage, quota }
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProfile(); // Dùng "cầu dao"
      setUserProfile(response.data);
    } catch (error) {
      console.error("Lỗi tải profile, đang logout:", error);
      logout(); // Logout nếu token hỏng
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false); // Không có token, không cần load
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await apiService.login(username, password); // Dùng "cầu dao"
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    setToken(access_token);
    // Tự động chuyển hướng sẽ do ProtectedRoute xử lý
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUserProfile(null);
    navigate('/login');
  };

  const value = {
    token,
    userProfile,
    isLoading,
    login,
    logout,
    fetchUserProfile, // Cần hàm này để refresh quota sau khi upload
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook tùy chỉnh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};