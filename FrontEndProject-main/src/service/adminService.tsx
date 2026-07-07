import axiosClient from '../api/axiosClient';
import type { Product, User } from '../types';

export interface AdminOverview {
    totalUsers: number;
    totalBuyers: number;
    totalSellers: number;
    totalAdmins: number;
    totalProducts: number;
    approvedProducts: number;
    pendingProducts: number;
    rejectedProducts: number;
    totalVouchers: number;
    activeVouchers: number;
    totalOrders: number;
    totalRevenue: number;
}

export const adminService = {
    getOverview: (): Promise<AdminOverview> => {
        return axiosClient.get('/admin/overview');
    },

    getProducts: (): Promise<Product[]> => {
        return axiosClient.get('/admin/products');
    },

    getUsers: (): Promise<User[]> => {
        return axiosClient.get('/admin/users');
    },

    createUser: (data: { name: string; email: string; password: string; role: 'buyer' | 'seller' | 'admin' }): Promise<User> => {
        return axiosClient.post('/admin/users', data);
    },

    updateUser: (id: string, data: Partial<User> & { password?: string }): Promise<User> => {
        return axiosClient.put(`/admin/users/${id}`, data);
    },

    toggleUserBlock: (id: string, isBlocked?: boolean): Promise<{ message: string; user: User }> => {
        return axiosClient.patch(`/admin/users/${id}/block`, { isBlocked });
    },

    deleteUser: (id: string): Promise<{ message: string }> => {
        return axiosClient.delete(`/admin/users/${id}`);
    },

    toggleProductLock: (id: string, isLocked?: boolean): Promise<{ message: string; product: Product }> => {
        return axiosClient.patch(`/admin/products/${id}/lock`, { isLocked });
    },

    getReviews: (): Promise<Array<{
        _id: string;
        productId: string;
        productTitle: string;
        name: string;
        rating: number;
        comment: string;
        createdAt: string;
    }>> => {
        return axiosClient.get('/admin/reviews');
    },

    deleteReview: (productId: string, reviewId: string): Promise<{ message: string }> => {
        return axiosClient.delete(`/admin/reviews/${productId}/${reviewId}`);
    },
};
