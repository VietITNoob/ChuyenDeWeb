import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import { wishlistService, type WishlistItem } from '../service/wishlistService.tsx';
import type { Product } from '../types';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (wishlistItemId: string | number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  itemCount: number;
  lastAddedItem: WishlistItem | null;
  clearLastAddedItem: () => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<WishlistItem | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const items = await wishlistService.getWishlistItems();
        setWishlistItems(items);
      } catch (error) {
        console.error("Failed to fetch wishlist items:", error);
      }
    };
    fetchWishlist();
  }, []);

  const addToWishlist = async (product: Product) => {
    try {
      // Kiểm tra xem mặt hàng đã có trong danh sách yêu thích chưa.
      const productId = product._id || product.id;
      const existingItem = wishlistItems.find(item => (item._id || item.id) === productId);
      if (existingItem) {
        console.log("Item already in wishlist");
        return;
      }

      const newItem = await wishlistService.addToWishlist(product);
      setWishlistItems(prevItems => [...prevItems, newItem]);
      setLastAddedItem(newItem);
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
    }
  };

  const removeFromWishlist = async (wishlistItemId: string | number) => {
    try {
      await wishlistService.removeFromWishlist(wishlistItemId);
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== wishlistItemId));
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
    }
  };

  const clearWishlist = async () => {
    try {
      await wishlistService.clearWishlist();
      setWishlistItems([]);
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
    }
  };

  const clearLastAddedItem = () => {
    setLastAddedItem(null);
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const itemCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist, 
      itemCount, 
      lastAddedItem, 
      clearLastAddedItem,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng ngữ cảnh danh sách mong muốn
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
