// Database "giả"
let mockProfile = {
  username: 'user.mock',
  plan: 'Free',
  usage: 8589934592, // 8.5GB
  quota: 10737418240, // 10GB
};
let mockFiles = [
  { id: 1, original_filename: 'BaoCaoMock.pdf', size: 1234567, created_at: '2025-11-10' },
  { id: 2, original_filename: 'HinhAnhGia.jpg', size: 4567890, created_at: '2025-11-11' },
  { id: 3, original_filename: 'VideoDemo.mp4', size: 58203993, created_at: '2025-11-12' },
];
const mockPlans = [
  { id: 'free', name: 'Gói Free', price: 0, description: '10GB Dung lượng' },
  { id: 'pro', name: 'Gói Pro', price: 50000, description: '100GB Dung lượng' },
];

const networkDelay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// --- Tên hàm giống hệt file realApiService.js ---

export const login = async (username, password) => {
  await networkDelay(300);
  if (username === 'admin' && password === 'admin') {
    return { data: { access_token: 'fake-jwt-token-cho-mock-service' } };
  }
  throw new Error('Sai tên đăng nhập hoặc mật khẩu (mock)');
};

export const register = async (username, password) => {
  await networkDelay(500);
  return { data: { message: 'Đăng ký (mock) thành công!' } };
};

export const getProfile = async () => {
  await networkDelay(200);
  return { data: { ...mockProfile } }; // Trả về bản sao
};

export const getPlans = async () => {
  await networkDelay(100);
  return { data: [...mockPlans] };
};

export const subscribeToPlan = async (planId) => {
  await networkDelay(1000);
  alert(`(Mock) Bạn vừa chọn đăng ký gói ${planId}. API thật sẽ chuyển bạn đến trang thanh toán.`);
  return { data: { paymentUrl: '#' } }; // Giả lập link
};

export const getFiles = async () => {
  await networkDelay(700);
  return { data: [...mockFiles] };
};

export const getDownloadUrl = async (fileId) => {
  await networkDelay(100);
  return { data: { url: 'https://google.com' } }; // Giả lập link download
};

export const getViewUrl = async (fileId) => {
  await networkDelay(100);
  const file = mockFiles.find(f => f.id === fileId);
  if (file?.original_filename.endsWith('.jpg')) {
    return { data: { url: 'https://picsum.photos/800/600' } }; // Trả ảnh ngẫu nhiên
  }
  return { data: { url: 'https://via.placeholder.com/800x600.png?text=File+khong+ho+tro+View+(Mock)' } };
};

export const deleteFile = async (fileId) => {
  await networkDelay(400);
  mockFiles = mockFiles.filter(f => f.id !== fileId);
  return { data: { message: 'Xóa (mock) thành công' } };
};

export const uploadFile = async (file, onProgress) => {
  for (let p = 0; p <= 100; p += 20) {
    await networkDelay(200);
    onProgress(p);
  }
  const newFile = {
    id: Math.max(0, ...mockFiles.map(f => f.id)) + 1,
    original_filename: file.name,
    size: file.size,
    created_at: new Date().toISOString(),
  };
  mockFiles.push(newFile);
  mockProfile.usage += file.size;
  return { data: { message: 'Upload (mock) thành công!' } };
};