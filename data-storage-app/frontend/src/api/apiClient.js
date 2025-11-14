import axios from 'axios';

// API Thật của em sẽ chạy ở cổng 5000
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// "Bí thuật": Tự động gắn Token vào MỌI request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// "Bí thuật 2": Nếu API thật trả về lỗi 401 (Token hết hạn), tự động logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login'; // "Đá" về trang login
    }
    return Promise.reject(error);
  }
);

export default apiClient;