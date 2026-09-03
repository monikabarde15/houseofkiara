import { create } from 'zustand';
import useAuthStore from './authStore';

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    const { token, isAuthenticated } = useAuthStore.getState();
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
        set({ items: data.data });
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    const { token, isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      // Could show a toast telling them to login
      return;
    }

    try {
      // Optimistic update
      const currentItems = get().items;
      const isWishlisted = currentItems.includes(productId);
      
      set({ 
        items: isWishlisted 
          ? currentItems.filter(id => id !== productId)
          : [...currentItems, productId]
      });

      const response = await fetch(`/api/customer/auth/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        set({ items: data.data });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Fallback: refetch
      get().fetchWishlist();
    }
  }
}));

export default useWishlistStore;
