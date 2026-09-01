import { ArrowDown, Clock3, MessageCircle, Check } from "lucide-react";
import "../../../../styles/confirmation/mobile/hero/mobile-confirmation-hero.css";

const MobileConfirmationHero = ({
    onOpenOrderStatus,
    orderReference = "HOK-2024-04891",
    orderDate = "14 Oct 2024, 3:42 PM",
    customerName = "Priya Sharma",
    customerEmail = "priya@example.com",
}) => {
    return (
        <section className="mobile-confirmation-hero">

            {/* Check Ring */}
            <div className="mobile-confirmation-hero-check-ring">
                <Check className="mobile-confirmation-hero-check-icon" />
            </div>

            {/* Eyebrow */}
            <div className="mobile-confirmation-hero-eyebrow">
                Order confirmed
            </div>

            {/* H1 Heading */}
            <h1 className="mobile-confirmation-hero-heading">
                Your <em>Edit</em> is <br />
                on its way.
            </h1>

            {/* Gold Rule */}
            <div className="mobile-confirmation-hero-gold-rule" />

            {/* Sub-copy */}
            <p className="mobile-confirmation-hero-subcopy">
                Thank you, <strong>{customerName}</strong>. Confirmation sent to{" "}
                <strong>{customerEmail}</strong>. Scroll below for each piece's
                dispatch timeline.
            </p>

            {/* Order Reference Pill */}
            <div className="mobile-confirmation-hero-order-pill">
                <span className="mobile-confirmation-hero-order-pill-label">
                    Order ref
                </span>
                <span className="mobile-confirmation-hero-order-pill-separator" />
                <span className="mobile-confirmation-hero-order-pill-value">
                    {orderReference}
                </span>
                <span className="mobile-confirmation-hero-order-pill-separator" />
                <span className="mobile-confirmation-hero-order-pill-date">
                    {orderDate}
                </span>
            </div>

            {/* CTA Stack - Mobile specific layout */}
            <div className="mobile-confirmation-hero-cta-stack">
                {/* Primary Button - Full width */}
                <button
                    type="button"
                    className="mobile-confirmation-hero-btn mobile-confirmation-hero-btn-primary"
                    onClick={onOpenOrderStatus}
                >
                    <span className="mobile-confirmation-hero-btn-shimmer" />
                    <Clock3 className="mobile-confirmation-hero-btn-icon-order" />
                    <span>View order status</span>
                </button>

                {/* Ghost Row - Two buttons side by side */}
                <div className="mobile-confirmation-hero-cta-ghost-row">
                    <a
                        href="https://wa.me/9876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mobile-confirmation-hero-btn mobile-confirmation-hero-btn-ghost"
                    >
                        <MessageCircle className="mobile-confirmation-hero-btn-icon" />
                        <span>WhatsApp</span>
                    </a>

                    <a
                        href="/invoice/order-id"
                        className="mobile-confirmation-hero-btn mobile-confirmation-hero-btn-ghost"
                    >
                        <ArrowDown className="mobile-confirmation-hero-btn-icon" />
                        <span>Invoice</span>
                    </a>
                </div>
            </div>

        </section>
    );
};

export default MobileConfirmationHero;