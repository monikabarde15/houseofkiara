import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCartStore from "../../../../store/cartStore";
import { makeProductDetail } from "../../../ProductList";
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

  const { items: storeItems, removeFromCart } = useCartStore();

  const [cartItemsState, setCartItemsState] = useState(storeItems);
  const [activePromo, setActivePromo] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  useEffect(() => {
    setCartItemsState(storeItems);
  }, [storeItems]);

  const activeItems = cartItemsState.filter((item) => item.active !== false);
  const totals = calculateTotals(activeItems, activePromo);
  const hasRentalItem = activeItems.some((item) => item.type === "rental");
  const visibleItems = cartItemsState.filter((item) => item.active !== false);
  const { grandTotal = 0 } = totals || {};
  const handleOpenRemove = (item) => {
    setRemoveTarget(item);
  };

  const handleCloseRemove = () => {
    setRemoveTarget(null);
  };

  const handleConfirmRemove = () => {
    if (!removeTarget) return;

    setCartItemsState((prev) =>
      prev.map((item) =>
        item.id === removeTarget.id ? { ...item, removing: true } : item,
      ),
    );

    setTimeout(() => {
      removeFromCart(removeTarget.id);
    }, 300);

    setRemoveTarget(null);
  };

  const handleWishlist = () => {
    if (!removeTarget) return;
    const { toggleWishlist } = import("../../../../store/wishlistStore").then(
      (m) => m.default.getState().toggleWishlist(removeTarget.id),
    );
    handleConfirmRemove();
  };

  const handleCheckout = () => {
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({ items: activeItems, activePromo }),
    );

    const storeState = import("../../../../store/authStore").then((m) => {
      const { isAuthenticated } = m.default.getState();
      if (!isAuthenticated) {
        import("react-hot-toast").then((toast) => {
          toast.default("Please login to proceed to checkout", { icon: "🔒" });
        });
        navigate("/auth");
        return;
      }
      navigate("/checkout", { state: { items: activeItems, activePromo } });
    });
  };

  return (
    <div className="mobile-cart-layout">
      <div className="mobile-cart-content">
        <CartHeader cartItems={cartItemsState} />

        {/* Cart Items - Section 5 */}
        <div className="mobile-cart-items">
          {["rental", "preloved", "new"].flatMap((type, i) => {
            const items = visibleItems.filter((item) => item.type === type);
            if (!items.length) return [];
            return [
              <ModeSeparator
                key={`sep-${type}`}
                type={type}
                dataRise={i + 2}
              />,
              ...items.map((item) => (
                <MobileCartItem
                  key={item.id}
                  item={item}
                  onRemove={handleOpenRemove}
                />
              )),
            ];
          })}
        </div>

        {/* Promo Code - Section 6 */}
        {activeItems.length > 0 ? (
          <>
            {activeItems.some(
              (item) =>
                item.product?.promoCode ||
                item.product?.promo_code ||
                item.product?.coupon ||
                item.product?.hasPromo,
            ) && (
              <div data-rise="5">
                <PromoCode onApply={setActivePromo} />
              </div>
            )}

            <OrderSummary
              cartItems={activeItems}
              activePromo={activePromo}
              onCheckout={handleCheckout}
            />
          </>
        ) : (
          <div
            className="empty-cart-message"
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "var(--text-light)",
            }}
          >
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate("/products")}
              style={{
                marginTop: "16px",
                padding: "12px 24px",
                background: "var(--primary-dark)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}

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
