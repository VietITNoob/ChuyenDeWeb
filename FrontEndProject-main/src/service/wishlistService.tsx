import type { Product } from '../types';

const WISHLIST_STORAGE_KEY = 'wishlist_items';

export interface WishlistItem {
    id: string;
    title: string;
    price: number;
    image: string;
    description?: string;
    language?: string;
    platform?: string;
    dateAdded: string;
    // Các field cũ giữ tương thích
    category?: string;
}

/**
 * wishlistService - Quản lý danh sách yêu thích qua localStorage
 * (Chuyển từ localhost:3001 sang localStorage để không phụ thuộc json-server)
 */
class WishlistService {
    private getItems(): WishlistItem[] {
        try {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    private saveItems(items: WishlistItem[]): void {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }

    // Lấy tất cả các mặt hàng trong danh sách yêu thích
    async getWishlistItems(): Promise<WishlistItem[]> {
        return Promise.resolve(this.getItems());
    }

    // Thêm sản phẩm vào danh sách yêu thích
    async addToWishlist(product: Product): Promise<WishlistItem> {
        const items = this.getItems();
        const productId = product._id || String(product.id);

        // Kiểm tra đã có chưa
        if (items.some(item => item.id === productId)) {
            return Promise.resolve(items.find(item => item.id === productId)!);
        }

        const newItem: WishlistItem = {
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image || '',
            description: product.description,
            language: product.language,
            platform: product.platform,
            category: product.categoryId,
            dateAdded: new Date().toISOString(),
        };

        this.saveItems([...items, newItem]);
        return Promise.resolve(newItem);
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    async removeFromWishlist(itemId: string | number): Promise<void> {
        const items = this.getItems();
        this.saveItems(items.filter(item => item.id !== String(itemId)));
        return Promise.resolve();
    }

    // Xóa tất cả các mục trong danh sách yêu thích
    async clearWishlist(): Promise<void> {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
        return Promise.resolve();
    }

    // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
    async isInWishlist(productId: string | number): Promise<boolean> {
        const items = this.getItems();
        return Promise.resolve(items.some(item => item.id === String(productId)));
    }
}

export const wishlistService = new WishlistService();
