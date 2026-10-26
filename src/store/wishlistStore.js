import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "./authStore";

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
          const response = await fetch("/api/customer/auth/wishlist", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            set({ items: Array.from(new Set(data.data)) });
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          set({ loading: false });
        }
      },

      cleanUpOldIds: () => {
        const currentItems = get().items;
        const cleanedItems = currentItems.filter((id) => id !== null && id !== undefined && id !== "");
        set({ items: Array.from(new Set(cleanedItems)) });
      },

      removeFromWishlist: async (productId, productData) => {
        const { token, isAuthenticated } = useAuthStore.getState();
        const rawId = String(productId || "");
        const aliases = new Set();
        if (rawId) aliases.add(rawId);

        if (productData) {
          const orig = productData.originalData || productData || {};
          const candidates = [
            productData.sku,
            productData.productId,
            productData._id,
            productData.id,
            orig.sku,
            orig.productId,
            orig._id,
            orig.id,
          ].filter(Boolean);

          candidates.forEach((c) => {
            aliases.add(String(c));
          });
        }

        const aliasList = Array.from(aliases);
        const currentItems = get().items;
        const newItems = currentItems.filter((id) => !aliasList.includes(String(id)));

        set({
          items: newItems,
          unseenCount: Math.max(0, (get().unseenCount || 0) - 1),
        });

        if (!isAuthenticated) return;

        const orig = productData?.originalData || productData || {};
        const backendId = productData?.sku || orig.sku || productData?.productId || orig.productId || rawId;

        try {
          const response = await fetch(`/api/customer/auth/wishlist/remove/${encodeURIComponent(backendId)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            set({ items: Array.from(new Set(data.data)) });
          }
        } catch (e) {
          console.error("removeFromWishlist error:", e);
        }
      },

      toggleWishlist: async (productId, productData) => {
        const { token, isAuthenticated } = useAuthStore.getState();
        get().cleanUpOldIds();

        const rawId = String(productId || "");
        const aliases = new Set();
        if (rawId) aliases.add(rawId);

        if (productData) {
          const orig = productData.originalData || productData || {};
          const candidates = [
            productData.sku,
            productData.productId,
            productData._id,
            productData.id,
            orig.sku,
            orig.productId,
            orig._id,
            orig.id,
          ].filter(Boolean);

          candidates.forEach((c) => {
            aliases.add(String(c));
          });
        }

        const aliasList = Array.from(aliases);
        let currentItems = get().items;
        const isWishlisted = currentItems.some((id) => aliasList.includes(String(id)));
        let currentUnseen = get().unseenCount || 0;

        set({
          items: Array.from(
            new Set(
              isWishlisted
                ? currentItems.filter((id) => !aliasList.includes(String(id)))
                : [...currentItems, rawId],
            ),
          ),
          unseenCount: isWishlisted
            ? Math.max(0, currentUnseen - 1)
            : currentUnseen + 1,
        });

        // If not authenticated, we just keep the local state (it will be persisted)
        if (!isAuthenticated) {
          return;
        }

        // If authenticated, also sync with backend
        try {
          const response = await fetch(
            `/api/customer/auth/wishlist/${encodeURIComponent(rawId)}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            set({ items: Array.from(new Set(data.data)) });
          } else if (!data.success) {
            get().fetchWishlist();
          }
        } catch (error) {
          console.error("Error toggling wishlist:", error);
          get().fetchWishlist();
        }
      },
    }),
    {
      name: "hok-wishlist",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.cleanUpOldIds();
        }
      },
    },
  ),
);

export default useWishlistStore;
