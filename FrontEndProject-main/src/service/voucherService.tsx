import axiosClient from '../api/axiosClient';
import type { Voucher } from '../types';

export interface VoucherPayload {
    code: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    applicableProducts: string[];
    startDate: string;
    endDate: string;
    usageLimit: number;
    isActive: boolean;
}

export const voucherService = {
    getMyVouchers: (): Promise<Voucher[]> => {
        return axiosClient.get('/vouchers/my');
    },

    getAllVouchers: (): Promise<Voucher[]> => {
        return axiosClient.get('/vouchers/admin');
    },

    createVoucher: (data: VoucherPayload): Promise<Voucher> => {
        return axiosClient.post('/vouchers', data);
    },

    updateVoucher: (id: string, data: VoucherPayload): Promise<Voucher> => {
        return axiosClient.put(`/vouchers/${id}`, data);
    },

    toggleVoucher: (id: string, isActive?: boolean): Promise<{ message: string; voucher: Voucher }> => {
        return axiosClient.patch(`/vouchers/${id}/toggle`, { isActive });
    },

    approveVoucher: (id: string): Promise<{ message: string; voucher: Voucher }> => {
        return axiosClient.patch(`/vouchers/${id}/approve`);
    },

    rejectVoucher: (id: string, reason: string): Promise<{ message: string; voucher: Voucher }> => {
        return axiosClient.patch(`/vouchers/${id}/reject`, { reason });
    },

    validateVoucher: (code: string, productIds: string[]): Promise<{ voucher: Voucher; matchedProducts: string[] }> => {
        return axiosClient.post('/vouchers/validate', { code, productIds });
    },

    deleteVoucher: (id: string): Promise<{ message: string }> => {
        return axiosClient.delete(`/vouchers/${id}`);
    },
};
