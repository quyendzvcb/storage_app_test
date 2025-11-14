import * as realService from './realApiService';
import * as mockService from './mockApiService';

// Đọc file .env
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Quyết định dùng service nào và export ra
const apiService = USE_MOCK ? mockService : realService;

export default apiService;