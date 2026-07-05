import type { User } from '../types';
import axiosClient from '../api/axiosClient';

/**
 * userService - Kết nối với /api/users/* trên backend
 */
export const userService = {
    /**
     * Lấy thông tin profile user đang đăng nhập → GET /api/users/profile
     * Cần token (tự động gắn bởi axiosClient interceptor)
     */
    getProfile: (): Promise<User> => {
        return axiosClient.get('/users/profile');
    },

    /**
     * Lấy danh sách tất cả user (Admin only) → GET /api/users
     * Cần token và role "admin"
     */
    getAll: (): Promise<User[]> => {
        return axiosClient.get('/users');
    },

    /**
     * Lấy user theo ID (Admin only) → GET /api/users/:id
     */
    getById: (id: string): Promise<User> => {
        return axiosClient.get(`/users/${id}`);
    },
};
