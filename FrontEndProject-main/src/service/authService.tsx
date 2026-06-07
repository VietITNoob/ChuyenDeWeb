import axiosClient from '../api/axiosClient';
import type { AuthResponse } from '../types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: 'buyer' | 'seller';
}

/**
 * authService - Kết nối với /api/auth/* trên backend Express.js
 */
export const authService = {
    /**
     * Đăng nhập → POST /api/auth/login
     * Trả về: { _id, name, email, role, token }
     */
    login: (credentials: LoginCredentials): Promise<AuthResponse> => {
        return axiosClient.post('/auth/login', credentials);
    },

    /**
     * Đăng ký tài khoản mới → POST /api/auth/register
     * Trả về: { _id, name, email, role, token }
     */
    register: (credentials: RegisterCredentials): Promise<AuthResponse> => {
        return axiosClient.post('/auth/register', credentials);
    },

    /**
     * Lấy thông tin user hiện tại từ token → GET /api/users/profile
     * Cần đăng nhập (token tự động gắn bởi axiosClient interceptor)
     */
    getProfile: (): Promise<{ _id: string; name: string; email: string; role: string }> => {
        return axiosClient.get('/users/profile');
    },
};
