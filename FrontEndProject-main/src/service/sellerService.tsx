import axiosClient from '../api/axiosClient';
import type { Product } from '../types';

export interface SellerOverview {
    totalProducts: number;
    approvedProducts: number;
    pendingProducts: number;
    rejectedProducts: number;
    totalVouchers: number;
    activeVouchers: number;
    totalRevenue: number;
    totalSold: number;
}

export interface MonthlyRevenueItem {
    month: number;
    revenue: number;
    sold: number;
}

export const sellerService = {
    getOverview: (): Promise<SellerOverview> => {
        return axiosClient.get('/seller/overview');
    },

    getMyProducts: (): Promise<Product[]> => {
        return axiosClient.get('/seller/products');
    },

    getMonthlyRevenue: (year: number): Promise<{ year: number; months: MonthlyRevenueItem[] }> => {
        return axiosClient.get('/seller/stats/monthly', { params: { year } });
    },

    getWithdrawRequests: (): Promise<any[]> => {
        return axiosClient.get('/seller/withdrawals');
    },

    createWithdrawRequest: (data: { amount: number; bankName: string; accountNumber: string; accountName: string }): Promise<any> => {
        return axiosClient.post('/seller/withdrawals', data);
    },
};
