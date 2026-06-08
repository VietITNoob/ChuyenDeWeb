import type { Product } from '../types';

const CART_STORAGE_KEY = 'cart_items';

export interface CartItem extends Omit<Product, 'reviews' | 'seller' | 'isApproved' | 'sourceCodeFile'> {
    quantity: number;
    // Đảm bảo id luôn có giá trị để dùng làm key
    id: string;
}

/**
 * cartService - Quản lý giỏ hàng qua localStorage
 * (Backend không có Cart API riêng, dùng localStorage để persit dữ liệu)
 */
export const cartService = {
    /**
     * Lấy danh sách sản phẩm trong giỏ hàng từ localStorage
     */
    getCartItems: (): Promise<CartItem[]> => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            const items = stored ? JSON.parse(stored) : [];
            return Promise.resolve(items);
        } catch {
            return Promise.resolve([]);
        }
    },

    /**
     * Lưu danh sách giỏ hàng vào localStorage
     */
    _saveCart: (items: CartItem[]): void => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    },

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    addToCart: async (product: Product): Promise<CartItem> => {
        const items = await cartService.getCartItems();
        const productId = product._id || String(product.id);
        const existing = items.find(item => item.id === productId);

        if (existing) {
            const updated = { ...existing, quantity: existing.quantity + 1 };
            const newItems = items.map(item => item.id === productId ? updated : item);
            cartService._saveCart(newItems);
            return Promise.resolve(updated);
        } else {
            const newItem: CartItem = {
                ...product,
                id: productId,
                quantity: 1,
            };
            cartService._saveCart([...items, newItem]);
            return Promise.resolve(newItem);
        }
    },

    /**
     * Cập nhật số lượng sản phẩm
     */
    updateCartItem: async (item: CartItem): Promise<CartItem> => {
        const items = await cartService.getCartItems();
        const newItems = items.map(i => i.id === item.id ? item : i);
        cartService._saveCart(newItems);
        return Promise.resolve(item);
    },

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    removeFromCart: async (cartItemId: string | number): Promise<void> => {
        const items = await cartService.getCartItems();
        const newItems = items.filter(item => item.id !== String(cartItemId));
        cartService._saveCart(newItems);
        return Promise.resolve();
    },

    /**
     * Xóa toàn bộ giỏ hàng
     */
    clearCart: (): void => {
        localStorage.removeItem(CART_STORAGE_KEY);
    },
};
