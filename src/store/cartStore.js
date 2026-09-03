import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, details) => {
        set((state) => {
          const newItem = {
            id: product.id || product._id,
            title: product.name || product.title,
            designer: product.designer,
            price: details.price,
            type: details.type, // rental, preloved, buy
            size: details.size,
            image: product.images?.[0] || product.image?.[0],
            quantity: 1,
            rentalDates: details.rentalDates || null
          };
          
          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId)
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'hok-cart',
    }
  )
);

export default useCartStore;