import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import useCartStore from "../../../../store/cartStore";
import useWishlistStore from "../../../../store/wishlistStore";
import { calculateTotals } from "../../../../utils/cart/calculateTotals";
import "../../../../styles/cart/mobile/layout/mobile-cart-layout.css";

// Header component
import CartHeader from "../../layout/CartHeader";

// Section 5 - Cart Items Column components
import ModeSeparator from "../../ui/ModeSeparator";
import MobileCartItem from "../items/MobileCartItem";
import PromoCode from "../../ui/PromoCode";
import PolicyStrip from "../../ui/PolicyStrip";
import MobileCTABar from "../cta/MobileCTABar";
import RemoveDialog from "../../ui/RemoveDialog";
import OrderSummary from "../../summary/OrderSummary";

const MobileCartLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const storeItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

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

  const activeItems = (storeItems || []).filter(item => item.active !== false);
  const totals = calculateTotals(activeItems, activePromo);
  const hasRentalItem = activeItems.some(item => item.type === "rental");
  const visibleItems = activeItems;
  const { grandTotal = 0 } = totals || {};

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

  const handleCheckout = () => {
    localStorage.setItem("checkoutData", JSON.stringify({ items: activeItems, activePromo }));
    navigate("/checkout", { state: { items: activeItems, activePromo } });
  };

  return (
    <div className="mobile-cart-layout">
      <div className="mobile-cart-content">
        <CartHeader cartItems={activeItems} />

        {activeItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 20px 120px 20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "1px solid #E8D5B0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                color: "#B85C38",
                background: "#FAF7F2",
              }}
            >
              <ShoppingBag size={24} strokeWidth={1.3} />
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8A7E72",
                marginBottom: "8px",
              }}
            >
              Your bag is empty
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "30px",
                fontWeight: "400",
                color: "#1A1714",
                marginBottom: "12px",
              }}
            >
              Nothing in your <em style={{ fontStyle: "italic", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>cart</em> yet
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#8A7E72",
                lineHeight: "1.6",
                marginBottom: "28px",
              }}
            >
              Explore our collection of designer lehengas, sarees, and gowns to rent or buy.
            </p>
            <button
              onClick={() => navigate("/products")}
              style={{
                background: "#1A1714",
                color: "#FAF7F2",
                padding: "12px 32px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
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
          </>
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