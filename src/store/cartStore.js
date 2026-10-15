import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchCart: async () => {
        try {
          const authModule = await import("./authStore");
          const { token, isAuthenticated } = authModule.default.getState();
          if (!isAuthenticated || !token) return;

          set({ loading: true });
          const res = await fetch("/api/customer/auth/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            if (data.data.length > 0) {
              set({ items: data.data });
            } else if (get().items.length > 0) {
              syncCartWithBackend(get().items);
            }
          }
        } catch (err) {
          console.error("fetchCart error:", err);
        } finally {
          set({ loading: false });
        }
      },

      addToCart: (product, details = {}) => {
        let added = false;
        set((state) => {
          const productId = String(
            product._id || product.productId || product.id || Date.now()
          );
          const type = details.type || "rental";

          // Check if item already exists in cart with the same type
          const existingItemIndex = state.items.findIndex(
            (item) => String(item.id) === productId && item.type === type
          );

          if (existingItemIndex !== -1) {
            added = true;
            const updatedItems = [...state.items];
            const existing = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existing,
              booking: {
                ...existing.booking,
                size:
                  details.size !== undefined
                    ? details.size
                    : existing.booking?.size,
                color:
                  details.color !== undefined
                    ? details.color
                    : existing.booking?.color,
                deliveryDate:
                  details.deliveryDate ||
                  details.rentalDates?.start ||
                  existing.booking?.deliveryDate,
                eventDate:
                  details.eventDate || existing.booking?.eventDate,
                returnDate:
                  details.returnDate ||
                  details.rentalDates?.end ||
                  existing.booking?.returnDate,
                rentalWindowDays:
                  details.rentalWindowDays ||
                  existing.booking?.rentalWindowDays,
              },
              price:
                details.price !== undefined ? details.price : existing.price,
              quantity: (existing.quantity || 1) + (details.quantity || 1),
            };
            return { items: updatedItems };
          }

          added = true;
          const newItem = {
            id: productId,
            type: type,
            source: details.source || "web",
            product: product,
            booking: {
              size: details.size || "M",
              color: details.color || "",
              deliveryDate:
                details.deliveryDate || details.rentalDates?.start || null,
              eventDate: details.eventDate || null,
              returnDate:
                details.returnDate || details.rentalDates?.end || null,
              rentalWindowDays: details.rentalWindowDays || 4,
            },
            quantity: details.quantity || 1,
            price:
              details.price !== undefined
                ? details.price
                : product.rentalPrice ||
                  product.listingPrice ||
                  product.price ||
                  0,
            active: true,
          };

          return { items: [...state.items, newItem] };
        });

        if (added) {
          // If in wishlist, remove it
          import("./wishlistStore").then((m) => {
            const wishlistStore = m.default.getState();
            const pid = product._id || product.productId || product.id;
            if (wishlistStore.items.some((id) => String(id) === String(pid))) {
              wishlistStore.toggleWishlist(pid);
            }
          });
          syncCartWithBackend(get().items);
          try {
            localStorage.setItem("cart", JSON.stringify(get().items));
          } catch (e) {}
        }

        return added;
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => String(item.id) !== String(itemId)),
        }));
        syncCartWithBackend(get().items);
        try {
          localStorage.setItem("cart", JSON.stringify(get().items));
        } catch (e) {}
      },

      clearCart: () => {
        set({ items: [] });
        syncCartWithBackend([]);
        try {
          localStorage.removeItem("cart");
          localStorage.removeItem("checkoutData");
        } catch (e) {}
      },
    }),
    {
      name: "hok-cart",
    }
  )
);

const syncCartWithBackend = (items) => {
  import("./authStore").then((m) => {
    const { token, isAuthenticated } = m.default.getState();
    if (isAuthenticated && token) {
      fetch("/api/customer/auth/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart: items }),
      }).catch(console.error);
    }
  });
};

export default useCartStore;
