import axios from 'axios';

export interface UploadResponse {
    message: string;
    url: string;    // URL file trên Cloudinary
}

/**
 * uploadService - Kết nối với /api/upload trên backend (Cloudinary)
 * Dùng axios trực tiếp với multipart/form-data (không dùng axiosClient vì cần Content-Type khác)
 */
export const uploadService = {
    /**
     * Upload file (ảnh hoặc source code zip) → POST /api/upload
     * Cần đăng nhập (token lấy từ localStorage)
     * Trả về URL của file trên Cloudinary
     */
    uploadFile: async (file: File): Promise<UploadResponse> => {
        const token = localStorage.getItem('accessToken');

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            timeout: 30000, // Upload có thể mất thời gian hơn
        });

        return response.data;
    },

    /**
     * Upload ảnh sản phẩm
     * Tách riêng để dễ gọi và hiểu ý nghĩa
     */
    uploadImage: async (file: File): Promise<string> => {
        const result = await uploadService.uploadFile(file);
        return result.url;
    },

    /**
     * Upload file source code (zip)
     */
    uploadSourceCode: async (file: File): Promise<string> => {
        const result = await uploadService.uploadFile(file);
        return result.url;
    },
};
