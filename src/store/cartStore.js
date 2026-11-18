import { create } from "zustand";
import { persist } from "zustand/middleware";

// Track the latest local mutation timestamp so an older in-flight GET /cart
// response can NEVER overwrite an item that was just added locally.
let lastLocalMutationTs = 0;
let pendingSyncPromise = null;

const buildCartItemId = (productId, type, size, startDate, endDate) => {
  const cleanSize = String(size || "").trim().toUpperCase();
  if (type === "rental") {
    return `${productId}__rental__${cleanSize}__${startDate || ""}_${endDate || ""}`;
  }
  return `${productId}__${type}__${cleanSize}`;
};

const normalizeCartItem = (item) => {
  if (!item) return item;
  let type = item.type;
  if (type === "rent" || type === "rental") type = "rental";
  if (type === "buy-new" || type === "buy") type = "new";

  const booking = { ...(item.booking || {}) };
  const startDate =
    booking.deliveryDate || booking.startDate || item.startDate || "";
  const endDate =
    booking.returnDate || booking.endDate || item.endDate || "";

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
  // Backfill product fields in case backend stripped top-level fields earlier
  if (!product.title && (item.title || item.name)) {
    product.title = item.title || item.name;
  }
  if (!product.name && (item.name || item.title)) {
    product.name = item.name || item.title;
  }
  if (!product.designer && item.designer) {
    product.designer = item.designer;
  }
  if (!product.image && item.image) {
    product.image = item.image;
  }

  if (type === "rental") {
    const rentalBase =
      Number(product.rentalPrice) ||
      (days === 4 && price ? Number(price) : 0);
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
        product.listingPrice ||
        product.price ||
        0;
    }
  } else if (type === "new") {
    if (!price || price === 0) {
      price =
        product.listingPrice ||
        product.buyPrice ||
        product.modes?.buy?.pricing?.price ||
        product.modes?.buyNew?.pricing?.price ||
        product.price ||
        product.retailPrice ||
        0;
    }
  }

  const productId = String(
    item.productId ||
      product._id ||
      product.productId ||
      product.id ||
      item.id ||
      "",
  );
  const cartItemId =
    item.cartItemId ||
    (String(item.id || "").includes("__")
      ? String(item.id)
      : buildCartItemId(
          productId,
          type,
          booking.size,
          booking.deliveryDate,
          booking.returnDate,
        ));

  return {
    ...item,
    id: cartItemId,
    cartItemId,
    productId,
    type,
    booking,
    product,
    price: Number(price || item.price || 0),
    quantity: Number(item.quantity || 1),
    active: item.active !== false,
  };
};

const syncCartWithBackend = (items) => {
  pendingSyncPromise = import("./authStore")
    .then((m) => {
      const { token, isAuthenticated } = m.default.getState();
      if (isAuthenticated && token) {
        return fetch("/api/customer/auth/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: items }),
        });
      }
      return null;
    })
    .catch((err) => {
      console.error("syncCartWithBackend error:", err);
    });
  return pendingSyncPromise;
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

          // Wait for any in-flight PUT /cart save to complete first!
          if (pendingSyncPromise) {
            await pendingSyncPromise.catch(() => {});
          }

          const fetchStartedAt = Date.now();
          set({ loading: true });
          const res = await fetch("/api/customer/auth/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();

          // Ignore stale response if the user added/removed an item while fetching
          if (lastLocalMutationTs > fetchStartedAt) {
            return;
          }

          if (data.success && Array.isArray(data.data)) {
            const remoteNormalized = data.data
              .filter(Boolean)
              .map(normalizeCartItem);
            const localItems = (get().items || []).map(normalizeCartItem);

            if (remoteNormalized.length > 0 || localItems.length > 0) {
              // Merge local + remote by unique cartItemId so local items are NEVER lost
              const mergedMap = new Map();
              remoteNormalized.forEach((it) => mergedMap.set(it.id, it));
              localItems.forEach((it) => mergedMap.set(it.id, it));
              const merged = Array.from(mergedMap.values());

              set({ items: merged });
              if (merged.length !== remoteNormalized.length) {
                syncCartWithBackend(merged);
              }
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
        lastLocalMutationTs = Date.now();

        set((state) => {
          const productId = String(
            product._id || product.productId || product.id || Date.now(),
          );
          const rawType = details.type || product.type || "rental";
          const type =
            rawType === "rent" || rawType === "rental"
              ? "rental"
              : rawType === "buy-new" || rawType === "buy"
                ? "new"
                : rawType;

          // Compute rental days if rental
          let days = details.rentalWindowDays;
          const startDate =
            details.deliveryDate ||
            details.startDate ||
            details.rentalDates?.start ||
            "";
          const endDate =
            details.returnDate ||
            details.endDate ||
            details.rentalDates?.end ||
            "";
          if (!days && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            if (diff > 0) days = diff;
          }
          if (!days) days = 4;

          const rentalBase =
            Number(product.rentalPrice) ||
            (days === 4 && details.price ? Number(details.price) : 0);
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
              resolvedPrice =
                rentalBase || product.listingPrice || product.price || 0;
            }
          } else if (type === "preloved") {
            if (!resolvedPrice || resolvedPrice === 0) {
              resolvedPrice =
                product.prelovedPrice ||
                product.preloved?.pricing?.price ||
                product.modes?.preloved?.pricing?.price ||
                product.listingPrice ||
                product.price ||
                0;
            }
          } else if (type === "new") {
            if (!resolvedPrice || resolvedPrice === 0) {
              resolvedPrice =
                product.listingPrice ||
                product.buyPrice ||
                product.modes?.buy?.pricing?.price ||
                product.modes?.buyNew?.pricing?.price ||
                product.price ||
                product.retailPrice ||
                0;
            }
          }

          const resolvedSize =
            details.size ||
            (Array.isArray(product.sizes) && product.sizes[0]) ||
            "M";

          const normalizedExisting = (state.items || []).map(normalizeCartItem);
          const cartItemId = buildCartItemId(
            productId,
            type,
            resolvedSize,
            startDate,
            endDate,
          );

          // Check if exact same variant (product + mode + size + dates) exists
          const existingItemIndex = normalizedExisting.findIndex(
            (item) => String(item.id) === cartItemId,
          );

          if (existingItemIndex !== -1) {
            added = true;
            const updatedItems = [...normalizedExisting];
            const existing = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = normalizeCartItem({
              ...existing,
              type,
              booking: {
                ...existing.booking,
                size: resolvedSize,
                color:
                  details.color !== undefined
                    ? details.color
                    : existing.booking?.color,
                deliveryDate: startDate || existing.booking?.deliveryDate,
                eventDate: details.eventDate || existing.booking?.eventDate,
                returnDate: endDate || existing.booking?.returnDate,
                rentalWindowDays: days,
              },
              price:
                resolvedPrice !== undefined && resolvedPrice > 0
                  ? resolvedPrice
                  : existing.price,
              quantity:
                type === "new"
                  ? (existing.quantity || 1) + (details.quantity || 1)
                  : existing.quantity || 1,
            });
            return { items: updatedItems };
          }

          added = true;
          const resolvedImg =
            details.image ||
            (typeof product.image === "string" && product.image) ||
            (Array.isArray(product.images) && product.images[0]) ||
            "";

          const newItem = normalizeCartItem({
            id: cartItemId,
            cartItemId,
            productId,
            type,
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
              size: resolvedSize,
              color: details.color || "",
              deliveryDate: startDate || null,
              eventDate: details.eventDate || null,
              returnDate: endDate || null,
              rentalWindowDays: days,
            },
            quantity: details.quantity || 1,
            price: resolvedPrice,
            active: true,
          });

          return { items: [...normalizedExisting, newItem] };
        });

        if (added) {
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

      updateQuantity: (itemId, nextQty) => {
        const qty = Math.max(1, Number(nextQty) || 1);
        lastLocalMutationTs = Date.now();
        set((state) => ({
          items: (state.items || []).map((it) =>
            String(it.id) === String(itemId) ? { ...it, quantity: qty } : it,
          ),
        }));
        syncCartWithBackend(get().items);
        try {
          localStorage.setItem("cart", JSON.stringify(get().items));
        } catch (e) {}
      },

      removeFromCart: (itemId) => {
        lastLocalMutationTs = Date.now();
        set((state) => ({
          items: (state.items || []).filter(
            (item) =>
              String(item.id) !== String(itemId) &&
              String(item.cartItemId) !== String(itemId),
          ),
        }));
        syncCartWithBackend(get().items);
        try {
          localStorage.setItem("cart", JSON.stringify(get().items));
        } catch (e) {}
      },

      clearCart: () => {
        lastLocalMutationTs = Date.now();
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
    },
  ),
);

export default useCartStore;
