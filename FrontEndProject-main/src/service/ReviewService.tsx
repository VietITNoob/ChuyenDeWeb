import type { Review } from '../types';
import axiosClient from '../api/axiosClient';

export interface AddReviewData {
    rating: number;
    comment: string;
}

/**
 * ReviewService - Kết nối với review được nhúng trong Product
 * Backend: review là sub-document trong Product model
 * Chú ý: Backend hiện chưa có route riêng cho review,
 * reviews được lấy cùng với product từ /api/products/:id
 */
export const ReviewService = {
    /**
     * Lấy reviews của một sản phẩm
     * Reviews được nhúng trong Product, lấy từ /api/products/:productId
     */
    getByProductId: async (productId: string | number): Promise<Review[]> => {
        const product = await axiosClient.get(`/products/${productId}`);
        return product.reviews || [];
    },

    /**
     * Thêm review cho sản phẩm
     * Nếu backend có route POST /api/products/:id/review thì dùng đây
     * Hiện tại placeholder - cần backend thêm route này
     */
    addReview: async (productId: string | number, review: AddReviewData): Promise<Review> => {
        return axiosClient.post(`/products/${productId}/reviews`, review);
    },
};
