'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ONLINE_DISCOUNT = 0.05;

export interface CartItem {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  price: number; // after discount
  date: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity' | 'price'>) => void;
  removeItem: (id: string, date: string) => void;
  updateQuantity: (id: string, date: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  originalTotal: () => number;
  savings: () => number;
  itemCount: () => number;
  hasDrink: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const discountedPrice = parseFloat(
          (newItem.originalPrice * (1 - ONLINE_DISCOUNT)).toFixed(2)
        );
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === newItem.id && i.date === newItem.date
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id && i.date === newItem.date
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...newItem, price: discountedPrice, quantity: 1 }],
          };
        });
      },

      removeItem: (id, date) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.date === date)),
        }));
      },

      updateQuantity: (id, date, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, date);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.date === date ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      originalTotal: () => {
        return get().items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
      },

      savings: () => {
        return get().items.reduce(
          (sum, i) => sum + (i.originalPrice - i.price) * i.quantity,
          0
        );
      },

      itemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      hasDrink: () => {
        const drinkKeywords = ['smoothie', 'sok', 'napój', 'drink', 'juice'];
        return get().items.some((i) => {
          const nameLower = i.name.toLowerCase();
          const catLower = i.category.toLowerCase();
          return (
            catLower.includes('napoje') ||
            catLower.includes('desery') ||
            drinkKeywords.some((kw) => nameLower.includes(kw))
          );
        });
      },
    }),
    {
      name: 'gn-cart',
    }
  )
);

export function parsePrice(priceStr: string): number {
  const cleaned = priceStr
    .replace(/\s*zł/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
}
