// src/lib/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  vendor_slug?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // src/lib/cartStore.ts

      addItem: (product) => {
        // Clean the price: remove ₦, commas, and any non-numeric characters
        let rawPrice = product.price;

        if (typeof rawPrice === 'string') {
          // Remove ₦ symbol, commas, and spaces
          rawPrice = rawPrice.replace(/[^0-9.]/g, '');
        }

        const price = typeof rawPrice === 'string' 
          ? parseFloat(rawPrice) 
          : Number(rawPrice);

        const safePrice = isNaN(price) || price <= 0 ? 0 : price;

        console.log('Adding to cart - Original:', product.price, 'Cleaned & Converted:', safePrice);

        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: safePrice,
              image: product.image || '/placeholder.jpg',
              quantity: 1,
              vendor_slug: product.vendor_slug || product.vendor?.slug,
            }],
          };
        });
      },

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () => get().items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        return sum + price * item.quantity;
      }, 0),
    }),
    { name: 'jhora-cart-storage' }
  )
);