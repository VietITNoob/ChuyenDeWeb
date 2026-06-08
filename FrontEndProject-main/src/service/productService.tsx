import type { Product, ProductParams } from '../types';
import axiosClient from '../api/axiosClient';

export interface CreateProductData {
    title: string;
    description: string;
    price: number;
    language: string;
    platform: string;
    image: string;
    sourceCodeFile: string;
}

/**
 * productService - Kết nối với /api/products/* trên backend
 */
export const productService = {
    /**
     * Lấy tất cả sản phẩm đã duyệt → GET /api/products?keyword=...
     * Backend hỗ trợ query: keyword (tìm theo title, case-insensitive)
     */
    getAll: (params?: ProductParams): Promise<Product[]> => {
        const backendParams: Record<string, string> = {};

        // Chuyển đổi params từ format cũ sang format backend
        if (params?.keyword) {
            backendParams.keyword = params.keyword;
        } else if (params?.title_like) {
            backendParams.keyword = params.title_like;
        } else if (params?.q) {
            backendParams.keyword = params.q;
        }

        return axiosClient.get('/products', { params: backendParams });
    },

    /**
     * Lấy sản phẩm theo ID → GET /api/products/:id
     */
    getById: (id: number | string): Promise<Product> => {
        return axiosClient.get(`/products/${id}`);
    },

    /**
     * Lấy sản phẩm theo ngôn ngữ lập trình (thay thế getBycategory)
     * Backend không có categoryId, dùng keyword tìm theo language
     */
    getByLanguage: (language: string): Promise<Product[]> => {
        return axiosClient.get('/products', { params: { keyword: language } });
    },

    /**
     * Lấy sản phẩm theo platform (Web, Mobile, ...)
     */
    getByPlatform: (platform: string): Promise<Product[]> => {
        return axiosClient.get('/products', { params: { keyword: platform } });
    },

    /**
     * Lấy sản phẩm bán chạy nhất (sort client-side theo rating)
     * Backend không hỗ trợ _sort/_order, sắp xếp sau khi fetch
     */
    getBestsale: async (): Promise<Product[]> => {
        const products = await axiosClient.get<Product[], Product[]>('/products');
        return products
            .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
            .slice(0, 8);
    },

    /**
     * Lấy sản phẩm mới nhất (sort theo createdAt)
     */
    getNewProduct: async (): Promise<Product[]> => {
        const products = await axiosClient.get<Product[], Product[]>('/products');
        return products
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 8);
    },

    /**
     * Lấy sản phẩm đánh giá cao nhất (sort theo rating)
     */
    getRatingProduct: async (): Promise<Product[]> => {
        const products = await axiosClient.get<Product[], Product[]>('/products');
        return products
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8);
    },

    /**
     * Tạo sản phẩm mới (Seller only) → POST /api/products
     * Cần đăng nhập với role "seller" (token tự động gắn bởi interceptor)
     */
    createProduct: (data: CreateProductData): Promise<Product> => {
        return axiosClient.post('/products', data);
    },

    /**
     * Lấy sản phẩm chờ duyệt (Admin only) → GET /api/products/unapproved
     */
    getUnapproved: (): Promise<Product[]> => {
        return axiosClient.get('/products/unapproved');
    },

    /**
     * Duyệt sản phẩm (Admin only) → PUT /api/products/:id/approve
     */
    approveProduct: (id: string): Promise<{ message: string; product: Product }> => {
        return axiosClient.put(`/products/${id}/approve`);
    },
};
