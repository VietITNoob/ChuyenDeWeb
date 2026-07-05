import type { Product, ProductParams } from '../types';
import axiosClient from '../api/axiosClient';

// Response dạng phân trang từ GET /api/products
export interface PaginatedProducts {
    products: Product[];
    page: number;
    pages: number;
    totalProducts: number;
}

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
     * Lấy tất cả sản phẩm đã duyệt với pagination → GET /api/products?keyword=...&page=1&limit=12
     * Trả về { products, page, pages, totalProducts }
     */
    getAll: (params?: ProductParams & { page?: number; limit?: number }): Promise<PaginatedProducts> => {
        const backendParams: Record<string, string | number> = {};

        // Chuyển đổi params từ format cũ sang format backend
        if (params?.keyword) {
            backendParams.keyword = params.keyword;
        } else if (params?.title_like) {
            backendParams.keyword = params.title_like;
        } else if (params?.q) {
            backendParams.keyword = params.q;
        }

        if (params?.page) backendParams.page = params.page;
        if (params?.limit) backendParams.limit = params.limit;

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
    getByLanguage: async (language: string): Promise<Product[]> => {
        const data = await axiosClient.get<any, any>('/products', { params: { keyword: language } });
        return data.products || data;
    },

    /**
     * Lấy sản phẩm theo platform (Web, Mobile, ...)
     */
    getByPlatform: async (platform: string): Promise<Product[]> => {
        const data = await axiosClient.get<any, any>('/products', { params: { keyword: platform } });
        return data.products || data;
    },

    /**
     * Lấy sản phẩm bán chạy nhất (sort client-side theo rating)
     * Dùng limit=100 để lấy đủ data
     */
    getBestsale: async (): Promise<Product[]> => {
        const data = await axiosClient.get<any, any>('/products', { params: { limit: 100 } });
        const products: Product[] = data.products || data;
        return products
            .sort((a: Product, b: Product) => (b.numReviews || 0) - (a.numReviews || 0))
            .slice(0, 8);
    },

    /**
     * Lấy sản phẩm mới nhất (sort theo createdAt)
     */
    getNewProduct: async (): Promise<Product[]> => {
        const data = await axiosClient.get<any, any>('/products', { params: { limit: 100 } });
        const products: Product[] = data.products || data;
        return products
            .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 8);
    },

    /**
     * Lấy sản phẩm đánh giá cao nhất (sort theo rating)
     */
    getRatingProduct: async (): Promise<Product[]> => {
        const data = await axiosClient.get<any, any>('/products', { params: { limit: 100 } });
        const products: Product[] = data.products || data;
        return products
            .sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0))
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

    /**
     * Từ chối sản phẩm kèm lý do (Admin only) → PUT /api/products/:id/reject
     */
    rejectProduct: (id: string, reason: string): Promise<{ message: string; rejectionReason: string }> => {
        return axiosClient.put(`/products/${id}/reject`, { reason });
    },

    /**
     * Thêm review cho sản phẩm (Buyer, đã mua) → POST /api/products/:id/reviews
     */
    addReview: (id: string, data: { rating: number; comment: string }): Promise<{ message: string }> => {
        return axiosClient.post(`/products/${id}/reviews`, data);
    },
};
