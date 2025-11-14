import apiClient from './apiClient';

// --- Auth ---
export const login = (username, password) =>
  apiClient.post('/login', { username, password });

export const register = (username, password) =>
  apiClient.post('/register', { username, password });

// --- User (Profile & Billing) ---
export const getProfile = () =>
  apiClient.get('/user/profile');

export const getPlans = () =>
  apiClient.get('/billing/plans');

export const subscribeToPlan = (planId) =>
  apiClient.post('/billing/subscribe', { planId });

// --- Files (Upload, View, Download) ---
export const getFiles = () =>
  apiClient.get('/files');

export const getDownloadUrl = (fileId) =>
  apiClient.get(`/download-url?file_id=${fileId}`);

export const getViewUrl = (fileId) =>
  apiClient.get(`/view-url?file_id=${fileId}`);

export const deleteFile = (fileId) =>
  apiClient.delete(`/file?file_id=${fileId}`);

export const uploadFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append('myFile', file); // 'myFile' phải khớp với BE

  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      // Chuyển đổi event sang %
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percent); // Gọi callback (nếu có)
    },
  });
};