import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, details) => {
        let added = false;
        set((state) => {
          const productId = product._id || product.id;

          // Check if item already exists in cart with the same rental/buy type
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === productId && item.type === details.type,
          );

          if (existingItemIndex !== -1) {
            added = true;
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              booking: {
                ...updatedItems[existingItemIndex].booking,
                size:
                  details.size !== undefined && details.size !== null
                    ? details.size
                    : updatedItems[existingItemIndex].booking.size,
                color:
                  details.color !== undefined && details.color !== null
                    ? details.color
                    : updatedItems[existingItemIndex].booking.color,
                measurements:
                  details.measurements !== undefined && details.measurements !== null
                    ? details.measurements
                    : updatedItems[existingItemIndex].booking.measurements,
                rentalDates:
                  details.rentalDates !== undefined &&
                  details.rentalDates !== null
                    ? details.rentalDates
                    : updatedItems[existingItemIndex].booking.rentalDates,
                deliveryDate:
                  details.rentalDates?.start !== undefined
                    ? details.rentalDates.start
                    : updatedItems[existingItemIndex].booking.deliveryDate,
                returnDate:
                  details.rentalDates?.end !== undefined
                    ? details.rentalDates.end
                    : updatedItems[existingItemIndex].booking.returnDate,
              },
              price:
                details.price !== undefined
                  ? details.price
                  : updatedItems[existingItemIndex].price,
            };
            return { items: updatedItems };
          }

          added = true;
          const newItem = {
            id: productId,
            type: details.type,
            source: details.source,
            product: product,
            booking: {
              size: details.size,
              color: details.color,
              measurements: details.measurements,
              rentalDates: details.rentalDates || null,
              deliveryDate: details.rentalDates?.start || null,
              returnDate: details.rentalDates?.end || null,
            },
            quantity: 1,
            price: details.price,
          };

          return { items: [...state.items, newItem] };
        });

        // After successfully adding to cart, check if it's in the wishlist and remove it
        if (added) {
          import("./wishlistStore").then((m) => {
            const wishlistStore = m.default.getState();
            const productId = product._id || product.id;
            if (wishlistStore.items.includes(productId)) {
              wishlistStore.toggleWishlist(productId);
            }
          });
          syncCartWithBackend(get().items);
        }

        return added;
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
        syncCartWithBackend(get().items);
      },

      clearCart: () => {
        set({ items: [] });
        syncCartWithBackend([]);
      },
    }),
    {
      name: "hok-cart",
    },
  ),
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
