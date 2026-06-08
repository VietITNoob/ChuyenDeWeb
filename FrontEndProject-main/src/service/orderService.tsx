import type { Order, OrderItem } from '../types';
import axiosClient from '../api/axiosClient';

export interface CreateOrderData {
    orderItems: OrderItem[];
    paymentMethod: string;  // "VNPay" | "COD"
    totalPrice: number;
}

export interface SellerStats {
    totalSold: number;
    totalRevenue: number;
    details: {
        orderId: string;
        productName: string;
        price: number;
        date: string;
    }[];
}

/**
 * orderService - Kết nối với /api/orders/* trên backend
 * Tất cả đều cần đăng nhập (token tự động gắn bởi axiosClient interceptor)
 */
export const orderService = {
    /**
     * Tạo đơn hàng mới → POST /api/orders
     * Cần đăng nhập (buyer)
     */
    createOrder: (data: CreateOrderData): Promise<Order> => {
        return axiosClient.post('/orders', data);
    },

    /**
     * Lấy danh sách đơn hàng của user hiện tại (đã thanh toán) → GET /api/orders/myorders
     * Trả về danh sách order có isPaid: true, populate sourceCodeFile để tải xuống
     */
    getMyOrders: (): Promise<Order[]> => {
        return axiosClient.get('/orders/myorders');
    },

    /**
     * Lấy thống kê bán hàng của Seller → GET /api/orders/seller-stats
     * Cần role "seller"
     */
    getSellerStats: (): Promise<SellerStats> => {
        return axiosClient.get('/orders/seller-stats');
    },
};
