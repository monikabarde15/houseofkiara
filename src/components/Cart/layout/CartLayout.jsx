// src\components\Cart\layout\CartLayout.jsx
import React from "react";
import "../../../styles/cart/layout/cart-layout.css";
import "../../../styles/cart/ui/mode-separator.mobile.css";
import "../../../styles/cart/ui/mode-separator.desktop.css";
import { products, makeProductDetail } from "../../ProductList";
import { calculateTotals } from "../../../utils/cart/calculateTotals";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const incomingItem = location.state?.newItem;

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const [autoDialogHandled, setAutoDialogHandled] = useState(false);

  const removeItemType =
    location.state?.removeItemType;

  const openRemoveDialog =
    location.state?.openRemoveDialog;


  // RESET WHEN NORMAL CART VISIT
  useEffect(() => {

    if (!openRemoveDialog) {
      setAutoDialogHandled(false);
    }

  }, [openRemoveDialog]);

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


  // MAIN LOGIC
  const cartItems = incomingItem
    ? [
      incomingItem,
      ...defaultItems.filter(item => item.type !== incomingItem.type)
    ]
    : defaultItems;

  const [cartItemsState, setCartItemsState] = useState(cartItems);
  const activeItems = cartItemsState.filter(item => item.active !== false);

  const totals = calculateTotals(activeItems, activePromo);
  const { grandTotal } = totals;

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
      {
        threshold: 0.01,
      }
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



  // AUTO OPEN DIALOG
  useEffect(() => {

    /*
      stop if:
      - no checkout trigger
      - no item type
      - already handled
    */
    if (
      !openRemoveDialog ||
      !removeItemType ||
      autoDialogHandled
    ) return;

    const targetItem =
      cartItemsState.find(
        item =>
          item.type === removeItemType &&
          item.active !== false
      );

    if (!targetItem) return;

    requestAnimationFrame(() => {

      setRemoveTarget(targetItem);

      /*
        prevent reopening
      */
      setAutoDialogHandled(true);

      /*
        clear nav state
      */
      window.history.replaceState({}, "");

    });

  }, [
    openRemoveDialog,
    removeItemType,
    cartItemsState,
    autoDialogHandled,
  ]);


  // To handle checkout from the cartpage
  const handleCheckout = () => {
    //  backup (dev only safety)
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

          {isMobile ? (

            // 📱 MOBILE RENDER
            ["rental", "preloved", "new"].flatMap((type, i) => {
              const items = visibleItems.filter(item => item.type === type);
              if (!items.length) return [];

              return [
                <ModeSeparator key={`sep-${type}`} type={type} variant="m" dataRise={i + 2} />,
                ...items.map(item => (
                  <CartItem key={item.id} item={item} onRemove={handleOpenRemove} />
                ))
              ];
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

          {/* SECTION DIVIDER (IMPORTANT) */}
          {/* <div className="items-end-sep"></div> */}

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

      <div className="policy-wrapper">
        <PolicyStrip />
      </div>

      {/* CTA BUTTOM STICKY */}
      {/* MOBILE CTA BAR */}
      <div id="cta-bar" className="cta-outer">
        <div className="cta-inner">

          <div className="cta-summary">
            <span className="cta-label">Total at checkout</span>
            <span className="cta-amount">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>

          <button className="cta-btn-mobile"
            onClick={handleCheckout}>
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