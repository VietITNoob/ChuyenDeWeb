import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import { cartService, type CartItem } from '../service/cartService';
import type { Product } from '../types';


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (cartItemId: string | number) => Promise<void>;
  updateQuantity: (cartItemId: string | number, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  lastAddedItem: CartItem | null;
  clearLastAddedItem: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await cartService.getCartItems();
        setCartItems(items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product: Product) => {
    try {
      // Sử dụng _id (MongoDB) hoặc id
      const productId = product._id || product.id;
      const existingItem = cartItems.find(item => (item._id || item.id) === productId);
      if (existingItem) {
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        const returnedItem = await cartService.updateCartItem(updatedItem);
        const productId = product._id || product.id;
        setCartItems(prevItems => prevItems.map(item => (item._id || item.id) === productId ? returnedItem : item));
        setLastAddedItem(returnedItem);
      } else {
        const newItem = await cartService.addToCart(product);
        setCartItems(prevItems => [...prevItems, newItem]);
        setLastAddedItem(newItem);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeFromCart = async (cartItemId: string | number) => {
    try {
      await cartService.removeFromCart(cartItemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const updateQuantity = async (cartItemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const existingItem = cartItems.find(item => item.id === cartItemId);
      if (!existingItem) return;
      
      const updatedItem = { ...existingItem, quantity: newQuantity };
      await cartService.updateCartItem(updatedItem);
      setCartItems(prevItems => 
        prevItems.map(item => item.id === cartItemId ? updatedItem : item)
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const clearLastAddedItem = () => {
    setLastAddedItem(null);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, lastAddedItem, clearLastAddedItem }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
