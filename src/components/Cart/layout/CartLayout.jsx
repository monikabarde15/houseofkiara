// src\components\Cart\layout\CartLayout.jsx
import React from "react";
import "../../../styles/cart/layout/cart-layout.css";
import "../../../styles/cart/ui/mode-separator.mobile.css";
import "../../../styles/cart/ui/mode-separator.desktop.css";
import { products, makeProductDetail } from "../../ProductList";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import {
  CartItem,
  OrderSummary,
  PromoCode,
  ModeSeparator,
  RemoveDialog,
  CartHeader,
  PolicyStrip
} from "../index";

const CartLayout = () => {

  const location = useLocation();

  const incomingItem = location.state?.newItem;

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  // DEFAULT DATA (KEEP IT)
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


  // 🔥 MAIN LOGIC
  const cartItems = incomingItem
    ? [
      incomingItem,
      ...defaultItems.filter(item => item.type !== incomingItem.type)
    ]
    : defaultItems;

  const [cartItemsState, setCartItemsState] = useState(cartItems);
  const activeItems = cartItemsState.filter(item => item.active !== false);


  // Remove cart item
  const handleRemoveItem = (id) => {
    setCartItemsState(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, active: false }
          : item
      )
    );
  };

  // FOR OPEN DIALOG 
  const handleOpenRemove = (item) => {
    setRemoveTarget(item);
  };

  // FOR CLOSE DIALOG 
  const handleCloseRemove = () => {
    setRemoveTarget(null);
  };

  // CONFIRM REMOVE

  const handleConfirmRemove = () => {
    if (!removeTarget) return;

    // Step 1: mark as removing (for animation)
    setCartItemsState(prev =>
      prev.map(item =>
        item.id === removeTarget.id
          ? { ...item, removing: true }
          : item
      )
    );

    // Step 2: actually remove after 300ms
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

  // WISHLIST ACTION
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

  // visibleItems
  const visibleItems = cartItemsState.filter(item => item.active !== false);

  useEffect(() => {
    const footer = document.querySelector(".policy-wrapper");
    const cta = document.getElementById("cta-bar");

    if (!footer || !cta) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight) {
          cta.classList.add("docked");
          document.body.classList.add("cta-docked");
        } else {
          cta.classList.remove("docked");
          document.body.classList.remove("cta-docked");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);


  // FOR DECTECTING MOBILE

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 430);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (

    <div className="cart-container cart-page-body">
      <CartHeader cartItems={cartItemsState} />
      <div className="cart-layout">

        {/* LEFT SIDE */}
        <div className="cart-left" data-rise="1">

          {isMobile ? (

            // 📱 MOBILE RENDER
            ["rental", "preloved", "new"].map((type) => {
              const items = visibleItems.filter(item => item.type === type);
              if (!items.length) return null;

              return (
                <div key={type}>

                  <ModeSeparator type={type} variant="m" />

                  {items.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={handleOpenRemove}
                    />
                  ))}

                </div>
              );
            })

          ) : (

            // 🖥️ DESKTOP RENDER (your existing logic)
            visibleItems.map((item, index) => {
              const prevItem = visibleItems[index - 1];
              const isNewSection =
                index === 0 || prevItem?.type !== item.type;

              return (
                <React.Fragment key={item.id}>
                  {isNewSection && (
                    <ModeSeparator type={item.type} variant="d" />
                  )}

                  <CartItem
                    item={item}
                    onRemove={handleOpenRemove}
                  />
                </React.Fragment>
              );
            })

          )}

          <div data-rise="3">
            <PromoCode onApply={setActivePromo} />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="cart-right" data-rise="2">
          <OrderSummary
            cartItems={activeItems}
            activePromo={activePromo}
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

      <div className="policy-wrapper">
        <PolicyStrip />
      </div>

      {/* CTA BUTTOM STICKY */}
      {/* MOBILE CTA BAR */}
      <div id="cta-bar" className="cta-outer">
        <div className="cta-inner">

          <div className="cta-summary">
            <span className="cta-label">Total at checkout</span>
            <span className="cta-amount">₹41,600</span>
          </div>

          <button className="cta-btn-mobile">
            PROCEED TO CHECKOUT
          </button>

          <div className="cta-secure">
            <Lock className="cta-secure-icon" />
            SSL encrypted · Secured by Razorpay
          </div>

        </div>
      </div>

    </div>


  );
};

export default CartLayout;