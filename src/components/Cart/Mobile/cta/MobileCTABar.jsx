import { useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import "../../../../styles/cart/mobile/cta/mobile-cta-bar.css";

const MobileCTABar = ({ grandTotal, onCheckout, isCartEmpty = false }) => {
  const ctaRef = useRef(null);

  useEffect(() => {
    const footer = document.querySelector(".hok-footer, footer");
    const ctaBar = ctaRef.current;
    let timeoutId = null;

    if (!footer || !ctaBar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldDock = entry.isIntersecting;

        if (shouldDock) {
          ctaBar.classList.add("docked");
          document.body.classList.add("cart-mobile-cta-docked");
        } else {
          ctaBar.classList.remove("docked");
          document.body.classList.remove("cart-mobile-cta-docked");
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(footer);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);


  return (
    <div id="cart-mobile-cta-bar" className="cart-mobile-cta-bar" ref={ctaRef}>
      <div className="cart-mobile-cta-inner">

        {/* Summary Line - Spec 9.3 */}
        <div className="cart-mobile-cta-summary-line">
          <span className="cart-mobile-cta-label">Total at checkout</span>
          <span className="cart-mobile-cta-amount">
            <sup>₹</sup>{grandTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* CTA Button - Spec 9.3 */}
        <button
          className="cart-mobile-cta-button"
          onClick={onCheckout}
          disabled={isCartEmpty}
        >
          <span className="cart-mobile-cta-shimmer" />
          <span>Proceed to Checkout</span>
        </button>

        {/* Secure Note - Spec 9.3 */}
        <div className="cart-mobile-cta-secure-note">
          <Lock size={10} strokeWidth={1.5} />
          <span>SSL encrypted · Secured by Razorpay</span>
        </div>

      </div>
    </div>
  );
};

export default MobileCTABar;