// Zustand store для корзины
import { create } from 'zustand';
import type { Cart, CartItem } from '@/types/api';

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItemsCount: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  addItem: (item) => {
    const currentCart = get().cart;
    if (!currentCart) {
      set({
        cart: {
          user_id: 0,
          items: [item],
          total_amount: item.price * item.quantity,
        },
      });
      return;
    }
    const existingItemIndex = currentCart.items.findIndex(
      (i) => i.id === item.id || (i.product_id === item.product_id && i.variant_id === item.variant_id)
    );
    if (existingItemIndex >= 0) {
      const updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity,
      };
      set({
        cart: {
          ...currentCart,
          items: updatedItems,
          total_amount: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        },
      });
    } else {
      const updatedItems = [...currentCart.items, item];
      set({
        cart: {
          ...currentCart,
          items: updatedItems,
          total_amount: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        },
      });
    }
  },
  updateItem: (itemId, quantity) => {
    const currentCart = get().cart;
    if (!currentCart) return;
    const updatedItems = currentCart.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    ).filter((item) => item.quantity > 0);
    set({
      cart: {
        ...currentCart,
        items: updatedItems,
        total_amount: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      },
    });
  },
  removeItem: (itemId) => {
    const currentCart = get().cart;
    if (!currentCart) return;
    const updatedItems = currentCart.items.filter((item) => item.id !== itemId);
    set({
      cart: {
        ...currentCart,
        items: updatedItems,
        total_amount: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      },
    });
  },
  clearCart: () => set({ cart: null }),
  getItemsCount: () => {
    const cart = get().cart;
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  },
  getTotalAmount: () => {
    const cart = get().cart;
    return cart?.total_amount ?? 0;
  },
}));

