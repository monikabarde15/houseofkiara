// src\components\Cart\layout\CartLayout.jsx
import React, { useState, useEffect } from "react";
import "../../../styles/cart/layout/cart-layout.css";
import { calculateTotals } from "../../../utils/cart/calculateTotals";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import useCartStore from "../../../store/cartStore";
import useWishlistStore from "../../../store/wishlistStore";
import {
  CartItemDesktop,
  OrderSummary,
  PromoCode,
  ModeSeparator,
  RemoveDialog,
  CartHeader,
  PolicyStrip
} from "../index";

const CartLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const storeItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [autoDialogHandled, setAutoDialogHandled] = useState(false);

  // Sync cart from backend when mounting
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle incoming item from PDP navigation state
  useEffect(() => {
    const incomingItem = location.state?.newItem;
    if (incomingItem && incomingItem.product) {
      addToCart(incomingItem.product, {
        type: incomingItem.type || "rental",
        price: incomingItem.price,
        size: incomingItem.booking?.size,
        color: incomingItem.booking?.color,
        deliveryDate: incomingItem.booking?.deliveryDate,
        eventDate: incomingItem.booking?.eventDate,
        returnDate: incomingItem.booking?.returnDate,
        rentalWindowDays: incomingItem.booking?.rentalWindowDays,
      });
      window.history.replaceState({}, "");
    }
  }, [location.state, addToCart]);

  const removeItemType = location.state?.removeItemType;
  const openRemoveDialog = location.state?.openRemoveDialog;

  // RESET WHEN NORMAL CART VISIT
  useEffect(() => {
    if (!openRemoveDialog) {
      setAutoDialogHandled(false);
    }
  }, [openRemoveDialog]);

  const activeItems = (storeItems || []).filter(item => item.active !== false);
  const visibleItems = activeItems;

  const hasRentalItem = activeItems.some(item => item.type === "rental");
  const totals = calculateTotals(activeItems, activePromo);
  const { grandTotal } = totals;

  const handleOpenRemove = (item) => {
    setRemoveTarget(item);
  };

  const handleCloseRemove = () => {
    setRemoveTarget(null);
  };

  const handleConfirmRemove = () => {
    if (!removeTarget) return;
    removeFromCart(removeTarget.id);
    setRemoveTarget(null);
  };

  const handleWishlist = () => {
    if (!removeTarget) return;
    const pid = removeTarget.product?._id || removeTarget.product?.productId || removeTarget.product?.id || removeTarget.id;
    if (pid) {
      useWishlistStore.getState().toggleWishlist(pid);
    }
    removeFromCart(removeTarget.id);
    setRemoveTarget(null);
  };

  // For sticky behaviour of the button
  useEffect(() => {
    const footer = document.querySelector(".hok-footer");
    const ctaBar = document.getElementById("cta-bar");

    if (!footer || !ctaBar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldDock = entry.isIntersecting;
        ctaBar.classList.toggle("docked", shouldDock);
        document.body.classList.toggle("cta-docked", shouldDock);
      },
      { threshold: 0.01 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // AUTO OPEN DIALOG
  useEffect(() => {
    if (!openRemoveDialog || !removeItemType || autoDialogHandled) return;

    const targetItem = activeItems.find(
      item => item.type === removeItemType
    );

    if (!targetItem) return;

    requestAnimationFrame(() => {
      setRemoveTarget(targetItem);
      setAutoDialogHandled(true);
      window.history.replaceState({}, "");
    });
  }, [openRemoveDialog, removeItemType, activeItems, autoDialogHandled]);

  const handleCheckout = () => {
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        items: activeItems,
        activePromo
      })
    );

    navigate("/checkout", {
      state: {
        items: activeItems,
        activePromo
      }
    });
  };

  return (
    <div className="cart-container cart-page-body">
      <CartHeader cartItems={activeItems} />

      {activeItems.length === 0 ? (
        <div
          className="cart-empty-view"
          style={{
            textAlign: "center",
            padding: "96px 24px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              border: "1px solid #E8D5B0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              color: "#B85C38",
              background: "#FAF7F2",
            }}
          >
            <ShoppingBag size={28} strokeWidth={1.3} />
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8A7E72",
              marginBottom: "12px",
            }}
          >
            Your bag is currently empty
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "38px",
              fontWeight: "400",
              color: "#1A1714",
              marginBottom: "14px",
            }}
          >
            Nothing in your <em style={{ fontStyle: "italic", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>cart</em> yet
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "#8A7E72",
              lineHeight: "1.7",
              marginBottom: "36px",
            }}
          >
            Explore our curated collection of designer lehengas, sarees, gowns, and occasion wear to rent or purchase.
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              background: "#1A1714",
              color: "#FAF7F2",
              padding: "14px 40px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#B85C38")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1A1714")}
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* LEFT SIDE */}
          <div className="cart-left" data-rise="1">
            {/* DESKTOP RENDER */}
            {visibleItems.map((item, index) => {
              const prevItem = visibleItems[index - 1];
              const isNewSection = index === 0 || prevItem?.type !== item.type;

              return (
                <React.Fragment key={item.id}>
                  {isNewSection && (
                    <ModeSeparator type={item.type} />
                  )}
                  <CartItemDesktop
                    item={item}
                    onRemove={handleOpenRemove}
                  />
                </React.Fragment>
              );
            })}

            <div data-rise="5">
              <PromoCode onApply={setActivePromo} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="cart-right" data-rise="2">
            <OrderSummary
              cartItems={activeItems}
              activePromo={activePromo}
              onCheckout={handleCheckout}
            />
          </div>

          <RemoveDialog
            open={!!removeTarget}
            item={removeTarget}
            onClose={handleCloseRemove}
            onConfirm={handleConfirmRemove}
            onWishlist={handleWishlist}
          />
        </div>
      )}

      {hasRentalItem && (
        <div className="policy-wrapper">
          <PolicyStrip />
        </div>
      )}
    </div>
  );
};

export default CartLayout;