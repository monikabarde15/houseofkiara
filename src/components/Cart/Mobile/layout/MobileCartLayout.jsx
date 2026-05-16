import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { products, makeProductDetail } from "../../../ProductList";
import { calculateTotals } from "../../../../utils/cart/calculateTotals";
import "../../../../styles/cart/mobile/layout/mobile-cart-layout.css";

// Import existing components (reused with media queries)
import CartHeader from "../../layout/CartHeader";
import ModeSeparator from "../../ui/ModeSeparator";
import CartItem from "../../items/CartItem";
import PromoCode from "../../ui/PromoCode";
import PolicyStrip from "../../ui/PolicyStrip";
import RemoveDialog from "../../ui/RemoveDialog";

// Import mobile-specific components
import MobileOrderSummary from "../summary/MobileOrderSummary";
import MobileCTABar from "../cta/MobileCTABar";

const MobileCartLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const incomingItem = location.state?.newItem;

  // Default cart data (same as desktop)
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
  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const activeItems = cartItemsState.filter(item => item.active !== false);
  const totals = calculateTotals(activeItems, activePromo);
  const { grandTotal } = totals;
  const hasRentalItem = activeItems.some(item => item.type === "rental");



  // Remove handlers
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
    // Same as remove for now
    handleConfirmRemove();
  };

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

  const visibleItems = cartItemsState.filter(item => item.active !== false);

  return (
    <div className="mobile-cart-layout" id="mobile-cart-page">
      
      {/* Header - Reused with media queries */}
      <CartHeader cartItems={cartItemsState} />

      {/* Page Content */}
      <div className="mobile-cart-content">
        
        {/* Page Title - Spec Page 8 */}
        <div className="mobile-cart-title" data-rise="1">
          <h1 className="mobile-cart-title-h1">
            Your <em>Cart</em>
          </h1>
          <div className="mobile-cart-piece-count">
            {visibleItems.length} {visibleItems.length === 1 ? "piece" : "pieces"}
          </div>
        </div>

        {/* Cart Items Column - Spec Page 9 */}
        <div className="mobile-cart-items">
          {["rental", "preloved", "new"].flatMap((type, i) => {
            const items = visibleItems.filter(item => item.type === type);
            if (!items.length) return [];

            return [
              <ModeSeparator 
                key={`sep-${type}`} 
                type={type} 
                variant="m" 
                dataRise={i + 2} 
              />,
              ...items.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onRemove={handleOpenRemove} 
                />
              ))
            ];
          })}
        </div>

        {/* Promo Code Zone - Spec Pages 14-15 */}
        <div data-rise="5">
          <PromoCode onApply={setActivePromo} />
        </div>

        {/* Order Summary - Mobile Component */}
        <MobileOrderSummary 
          cartItems={activeItems}
          activePromo={activePromo}
          totals={totals}
          onCheckout={handleCheckout}
        />

        {/* Policy Strip - Spec Page 20 */}
        {hasRentalItem && (
          <div className="mobile-cart-policy">
            <PolicyStrip />
          </div>
        )}

        {/* Remove Dialog - Reused with media queries */}
        <RemoveDialog
          open={!!removeTarget}
          item={removeTarget}
          onClose={handleCloseRemove}
          onConfirm={handleConfirmRemove}
          onWishlist={handleWishlist}
        />

        {/* CTA Bar - Mobile Component with Docking */}
        <MobileCTABar 
          grandTotal={grandTotal}
          onCheckout={handleCheckout}
          isCartEmpty={activeItems.length === 0}
        />

      </div>
    </div>
  );
};

export default MobileCartLayout;