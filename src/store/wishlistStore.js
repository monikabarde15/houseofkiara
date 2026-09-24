import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './authStore';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      unseenCount: 0,
      loading: false,

      clearUnseenCount: () => set({ unseenCount: 0 }),

      fetchWishlist: async () => {
        const { token, isAuthenticated } = useAuthStore.getState();
        get().cleanUpOldIds();
        if (!isAuthenticated) return;

        set({ loading: true });
        try {
          const response = await fetch('/api/customer/auth/wishlist', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success) {
            set({ items: Array.from(new Set(data.data)) });
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        } finally {
          set({ loading: false });
        }
      },

      cleanUpOldIds: () => {
        const currentItems = get().items;
        // Keep only valid MongoDB ObjectIds (24-char hex strings) to remove old timestamp bugs
        const cleanedItems = currentItems.filter(id => typeof id === 'string' && id.length === 24);
        set({ items: Array.from(new Set(cleanedItems)) });
      },

      toggleWishlist: async (productId) => {
        const { token, isAuthenticated } = useAuthStore.getState();
        get().cleanUpOldIds();

        // Optimistic local update works for BOTH logged-in and guest users
        let currentItems = get().items;
        const isWishlisted = currentItems.includes(productId);
        let currentUnseen = get().unseenCount || 0;
        
        set({ 
          items: Array.from(new Set(isWishlisted 
            ? currentItems.filter(id => id !== productId)
            : [...currentItems, productId])),
          unseenCount: isWishlisted ? Math.max(0, currentUnseen - 1) : currentUnseen + 1
        });

        // If not authenticated, we just keep the local state (it will be persisted)
        if (!isAuthenticated) {
          return;
        }

        // If authenticated, also sync with backend
        try {
          const response = await fetch(`/api/customer/auth/wishlist/${productId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          
          if (!data.success) {
            // Revert optimistic update on failure by refetching
            get().fetchWishlist();
          }
        } catch (error) {
          console.error('Error toggling wishlist:', error);
          // Fallback: refetch from backend if there was a sync issue
          get().fetchWishlist();
        }
      }
    }),
    {
      name: 'hok-wishlist',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.cleanUpOldIds();
        }
      }
    }
  )
);

export default useWishlistStore;
