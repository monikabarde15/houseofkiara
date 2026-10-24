import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizeCartItem = (item) => {
  if (!item) return item;
  let type = item.type;
  if (type === "rent" || type === "rental") type = "rental";

  const booking = { ...(item.booking || {}) };
  const startDate = booking.deliveryDate || booking.startDate || item.startDate;
  const endDate = booking.returnDate || booking.endDate || item.endDate;

  let days = booking.rentalWindowDays;
  if (!days && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 0) days = diff;
  }
  if (!days && type === "rental") days = 4;
  if (days) booking.rentalWindowDays = days;
  if (!booking.deliveryDate && startDate) booking.deliveryDate = startDate;
  if (!booking.returnDate && endDate) booking.returnDate = endDate;

  let price = item.price;
  const product = { ...(item.product || {}) };

  if (type === "rental") {
    const rentalBase = Number(product.rentalPrice) || (days === 4 && price ? Number(price) : 0);
    const perDay =
      (rentalBase > 0 ? Math.round(rentalBase / 4) : 0) ||
      product.modes?.rent?.pricing?.pricePerDay ||
      product.rent?.pricing?.pricePerDay ||
      product.perDayRate ||
      (price && days ? Math.round(Number(price) / days) : 0);

    if (days === 4 && rentalBase > 0) {
      price = rentalBase;
    } else if (perDay > 0) {
      price = (days || 4) * perDay;
    } else if (product.rentalPrice) {
      price = Number(product.rentalPrice);
    }
  } else if (type === "preloved") {
    if (!price || price === 0) {
      price =
        product.prelovedPrice ||
        product.preloved?.pricing?.price ||
        product.modes?.preloved?.pricing?.price ||
        product.price ||
        0;
    }
  } else if (type === "new" || type === "buy-new") {
    if (!price || price === 0) {
      price =
        product.listingPrice ||
        product.buyPrice ||
        product.retailPrice ||
        product.modes?.buyNew?.pricing?.price ||
        0;
    }
  }

  return {
    ...item,
    type,
    booking,
    product,
    price: price || item.price || 0,
  };
};

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
              const normalized = data.data.map(normalizeCartItem);
              set({ items: normalized });
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
          const rawType = details.type || product.type || "rental";
          const type = (rawType === "rent" || rawType === "rental") ? "rental" : rawType;

          // Compute rental days if rental
          let days = details.rentalWindowDays;
          const startDate = details.deliveryDate || details.startDate || details.rentalDates?.start;
          const endDate = details.returnDate || details.endDate || details.rentalDates?.end;
          if (!days && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            if (diff > 0) days = diff;
          }
          if (!days) days = 4;

          const rentalBase = Number(product.rentalPrice) || (days === 4 && details.price ? Number(details.price) : 0);
          const perDay =
            (rentalBase > 0 ? Math.round(rentalBase / 4) : 0) ||
            product.modes?.rent?.pricing?.pricePerDay ||
            product.rent?.pricing?.pricePerDay ||
            product.perDayRate ||
            0;

          let resolvedPrice = details.price;
          if (type === "rental") {
            if (days === 4 && rentalBase > 0) {
              resolvedPrice = rentalBase;
            } else if (perDay > 0 && days > 0) {
              resolvedPrice = days * perDay;
            } else if (!resolvedPrice || resolvedPrice === 0) {
              resolvedPrice = rentalBase || product.listingPrice || product.price || 0;
            }
          } else if (type === "preloved") {
            if (!resolvedPrice || resolvedPrice === 0) {
              resolvedPrice = product.prelovedPrice || product.preloved?.pricing?.price || product.price || 0;
            }
          } else if (type === "new" || type === "buy-new") {
            if (!resolvedPrice || resolvedPrice === 0) {
              resolvedPrice = product.price || product.buyPrice || product.retailPrice || 0;
            }
          }

          // Check if item already exists in cart with the same type
          const existingItemIndex = state.items.findIndex(
            (item) => String(item.id) === productId && (item.type === type || (type === "rental" && item.type === "rent"))
          );

          if (existingItemIndex !== -1) {
            added = true;
            const updatedItems = [...state.items];
            const existing = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existing,
              type: type,
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
                rentalWindowDays: days,
              },
              price: resolvedPrice !== undefined && resolvedPrice > 0 ? resolvedPrice : existing.price,
              quantity: (existing.quantity || 1) + (details.quantity || 1),
            };
            return { items: updatedItems.map(normalizeCartItem) };
          }

          added = true;
          const resolvedImg =
            details.image ||
            product.image ||
            (Array.isArray(product.images) && product.images[0]) ||
            "";

          const newItem = {
            id: productId,
            productId: productId,
            type: type,
            source: details.source || "web",
            product: {
              ...product,
              image: resolvedImg || product.image,
            },
            title: product.title || product.name || "",
            name: product.name || product.title || "",
            designer: product.designer || "",
            image: resolvedImg,
            booking: {
              size: details.size || (Array.isArray(product.sizes) && product.sizes[0]) || "M",
              color: details.color || "",
              deliveryDate:
                details.deliveryDate || details.rentalDates?.start || null,
              eventDate: details.eventDate || null,
              returnDate:
                details.returnDate || details.rentalDates?.end || null,
              rentalWindowDays: days,
            },
            quantity: details.quantity || 1,
            price: resolvedPrice,
            active: true,
          };

          return { items: [...state.items.map(normalizeCartItem), newItem] };
        });

        if (added) {
          // If in wishlist, remove it
          import("./wishlistStore").then((m) => {
            const wishlistStore = m.default.getState();
            const pid =
              product._id || product.productId || product.id || product.sku;
            wishlistStore.removeFromWishlist(pid, product);
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
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          state.items = state.items.map(normalizeCartItem);
        }
      },
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
