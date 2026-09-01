// src\components\Cart\layout\CartLayout.jsx
import React from "react";
import "../../../styles/cart/layout/cart-layout.css";
// import "../../../styles/cart/ui/mode-separator.css";
import { products, makeProductDetail } from "../../ProductList";
import { calculateTotals } from "../../../utils/cart/calculateTotals";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const incomingItem = location.state?.newItem;

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const [autoDialogHandled, setAutoDialogHandled] = useState(false);

  const removeItemType = location.state?.removeItemType;
  const openRemoveDialog = location.state?.openRemoveDialog;

  // RESET WHEN NORMAL CART VISIT
  useEffect(() => {
    if (!openRemoveDialog) {
      setAutoDialogHandled(false);
    }
  }, [openRemoveDialog]);

  // DEFAULT DATA
  const defaultItems = [
    {
      id: 1,
      type: "rental",
      product: makeProductDetail(products[0]),
      booking: {
        size: "M",
        window: "standard",
        deliveryDate: "2026-04-20",
        eventDate: "2026-04-23",
        returnDate: "2026-04-25"
      }
    },
    {
      id: 2,
      type: "new",
      product: makeProductDetail(products[0])
    },
    {
      id: 3,
      type: "preloved",
      product: makeProductDetail(products[0])
    }
  ];

  const cartItems = incomingItem
    ? [incomingItem, ...defaultItems.filter(item => item.type !== incomingItem.type)]
    : defaultItems;

  const [cartItemsState, setCartItemsState] = useState(cartItems);
  const activeItems = cartItemsState.filter(item => item.active !== false);
  const visibleItems = cartItemsState.filter(item => item.active !== false);

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

    setCartItemsState(prev =>
      prev.map(item =>
        item.id === removeTarget.id
          ? { ...item, removing: true }
          : item
      )
    );

    setTimeout(() => {
      setCartItemsState(prev =>
        prev.map(item =>
          item.id === removeTarget.id
            ? { ...item, active: false }
            : item
        )
      );
    }, 300);

    setRemoveTarget(null);
  };

  const handleWishlist = () => {
    if (!removeTarget) return;
    console.log("Wishlist:", removeTarget);
    setCartItemsState(prev =>
      prev.map(item =>
        item.id === removeTarget.id
          ? { ...item, active: false }
          : item
      )
    );
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

    const targetItem = cartItemsState.find(
      item => item.type === removeItemType && item.active !== false
    );

    if (!targetItem) return;

    requestAnimationFrame(() => {
      setRemoveTarget(targetItem);
      setAutoDialogHandled(true);
      window.history.replaceState({}, "");
    });
  }, [openRemoveDialog, removeItemType, cartItemsState, autoDialogHandled]);

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
      <CartHeader cartItems={cartItemsState} />
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

      {hasRentalItem && (
        <div className="policy-wrapper">
          <PolicyStrip />
        </div>
      )}


    </div>
  );
};

export default CartLayout;