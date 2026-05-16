import { useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import "../../../../styles/cart/mobile/cta/mobile-cta-bar.css";

const MobileCTABar = ({ grandTotal, onCheckout, isCartEmpty = false }) => {
  const ctaRef = useRef(null);

  // Docking logic - IntersectionObserver watching footer (Spec 9.2)
  useEffect(() => {
    const footer = document.querySelector(".hok-footer, footer");
    const ctaBar = ctaRef.current;
    const page = document.querySelector(".mobile-cart-content");

    if (!footer || !ctaBar || !page) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldDock = entry.isIntersecting;

        if (shouldDock) {
          ctaBar.classList.add("docked");
          document.body.classList.add("cta-docked");
        } else {
          ctaBar.classList.remove("docked");
          document.body.classList.remove("cta-docked");
        }
      },
      {
        threshold: 0.01, // 1% of footer visible (Spec 9.2)
      }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="cta-bar" className="mobile-cta-bar" ref={ctaRef}>
      <div className="cta-inner">
        
        {/* Summary Line - Spec 9.3 */}
        <div className="cta-summary-line">
          <span className="cta-label">Total at checkout</span>
          <span className="cta-amount">
            <sup>₹</sup>{grandTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* CTA Button - Spec 9.3 */}
        <button 
          className="cta-button" 
          onClick={onCheckout}
          disabled={isCartEmpty}
        >
          <span className="cta-shimmer" />
          <span>Proceed to Checkout</span>
        </button>

        {/* Secure Note - Spec 9.3 */}
        <div className="cta-secure-note">
          <Lock size={10} strokeWidth={1.5} />
          <span>SSL encrypted · Secured by Razorpay</span>
        </div>

      </div>
    </div>
  );
};

export default MobileCTABar;