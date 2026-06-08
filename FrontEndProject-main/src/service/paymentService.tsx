import axiosClient from '../api/axiosClient';

export interface CreatePaymentUrlData {
    orderId: string;
    orderInfo: string;
    amount: number;
    returnUrl?: string;
}

export interface PaymentUrlResponse {
    paymentUrl: string;
}

/**
 * paymentService - Kết nối với /api/payment/* trên backend (VNPay)
 */
export const paymentService = {
    /**
     * Tạo URL thanh toán VNPay → POST /api/payment/create_payment_url
     * Backend trả về: { url: '...' }
     */
    createPaymentUrl: async (data: CreatePaymentUrlData): Promise<PaymentUrlResponse> => {
        const res = await axiosClient.post('/payment/create_payment_url', {
            orderId: data.orderId,
            amount: data.amount,
            bankCode: '',
        }) as any;
        return { paymentUrl: res.url || res.paymentUrl };
    },

    /**
     * Kiểm tra kết quả thanh toán VNPay sau khi redirect về
     * URL: GET /api/payment/vnpay_return?vnp_... (query params từ VNPay)
     * Thường được gọi tự động khi VNPay redirect về returnUrl
     * Hàm này dùng để lấy trạng thái từ server sau redirect
     */
    verifyReturn: (queryParams: Record<string, string>): Promise<{ success: boolean; message: string; orderId?: string }> => {
        const searchParams = new URLSearchParams(queryParams).toString();
        return axiosClient.get(`/payment/vnpay_return?${searchParams}`);
    },
};
