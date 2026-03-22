import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (product: WishlistItem) => void;
  hasItem: (id: number) => boolean;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => ({
          items: [...state.items, product],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      hasItem: (id) => get().items.some((item) => item.id === id),

      totalItems: () => get().items.length,
    }),
    { name: 'jhora-wishlist-storage' }
  )
);