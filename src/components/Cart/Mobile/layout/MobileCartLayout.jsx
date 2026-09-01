import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { products, makeProductDetail } from "../../../ProductList";
import { calculateTotals } from "../../../../utils/cart/calculateTotals";
import "../../../../styles/cart/mobile/layout/mobile-cart-layout.css";

// Header component
import CartHeader from "../../layout/CartHeader";

// Section 5 - Cart Items Column components
import ModeSeparator from "../../ui/ModeSeparator";
import CartItemDesktop from "../../items/CartItemDesktop";
import MobileCartItem from "../items/MobileCartItem";
import PromoCode from "../../ui/PromoCode";
import PolicyStrip from "../../ui/PolicyStrip";
import MobileCTABar from "../cta/MobileCTABar";
import RemoveDialog from "../../ui/RemoveDialog";
import OrderSummary from "../../summary/OrderSummary";

const MobileCartLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingItem = location.state?.newItem;

  const defaultItems = [
    {
      id: 1,
      type: "rental",
      product: makeProductDetail(products[0]),
      booking: {
        size: "M",
        deliveryDate: "2026-04-20",
        eventDate: "2026-04-23",
        returnDate: "2026-04-25"
      }
    },
    { id: 2, type: "new", product: makeProductDetail(products[0]) },
    { id: 3, type: "preloved", product: makeProductDetail(products[0]) }
  ];

  const cartItems = incomingItem
    ? [incomingItem, ...defaultItems.filter(item => item.type !== incomingItem.type)]
    : defaultItems;

  const [cartItemsState, setCartItemsState] = useState(cartItems);
  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const activeItems = cartItemsState.filter(item => item.active !== false);
  const totals = calculateTotals(activeItems, activePromo);
  const hasRentalItem = activeItems.some(item => item.type === "rental");
  const visibleItems = cartItemsState.filter(item => item.active !== false);
  const { grandTotal = 0 } = totals || {};
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
        item.id === removeTarget.id ? { ...item, active: false } : item
      )
    );
    setRemoveTarget(null);
  };

  const handleWishlist = () => {
    if (!removeTarget) return;
    handleConfirmRemove();
  };

  const handleCheckout = () => {
    localStorage.setItem("checkoutData", JSON.stringify({ items: activeItems, activePromo }));
    navigate("/checkout", { state: { items: activeItems, activePromo } });
  };

  return (
    <div className="mobile-cart-layout">
      
      <div className="mobile-cart-content">
      <CartHeader cartItems={cartItemsState} />
        
        {/* Cart Items - Section 5 */}
        <div className="mobile-cart-items">
          {["rental", "preloved", "new"].flatMap((type, i) => {
            const items = visibleItems.filter(item => item.type === type);
            if (!items.length) return [];
            return [
              <ModeSeparator key={`sep-${type}`} type={type} dataRise={i + 2} />,
              ...items.map(item => (
                <MobileCartItem
                  key={item.id} 
                  item={item} 
                  onRemove={handleOpenRemove} 
                />
              ))

              
            ];
          })}
        </div>

        {/* Promo Code - Section 6 */}
        <div data-rise="5">
          <PromoCode onApply={setActivePromo} />
        </div>

        <OrderSummary
          cartItems={activeItems}
          activePromo={activePromo}
          onCheckout={handleCheckout}
        />

        {/* Policy Strip - Section 8 */}
        {hasRentalItem && (
          <div className="mobile-cart-policy">
            <PolicyStrip />
          </div>
        )}

         {/* Remove Dialog - Section 11 */}
        <RemoveDialog
          open={!!removeTarget}
          item={removeTarget}
          onClose={handleCloseRemove}
          onConfirm={handleConfirmRemove}
          onWishlist={handleWishlist}
        />

  
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