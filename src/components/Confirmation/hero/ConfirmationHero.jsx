import {ArrowDown,Clock3,MessageCircle,Check, } from "lucide-react";

import "../../../styles/confirmation/hero/confirmation-hero.css";

const ConfirmationHero = () => {
    return (
        <section className="confirmation-hero">

            <div className="confirmation-hero-check-ring">
                <Check className="confirmation-hero-check-icon" />
            </div>

            <div className="confirmation-hero-eyebrow">
                Order confirmed
            </div>

            <h1 className="confirmation-hero-heading">
                Your <em>Edit</em> is <br />
                on its way.
            </h1>

            <div className="confirmation-hero-gold-rule" />

            <p className="confirmation-hero-subcopy">
                Thank you, <strong>Priya Sharma</strong>. We've sent your
                confirmation to <strong>priya@example.com</strong>. Each
                piece has its own fulfilment timeline — scroll below for
                the full breakdown.
            </p>

            <div className="confirmation-hero-order-pill">

                <span className="confirmation-hero-order-pill-label">
                    Order reference
                </span>

                <span className="confirmation-hero-order-pill-separator" />

                <span className="confirmation-hero-order-pill-value">
                    HOK-2024-04891
                </span>

                <span className="confirmation-hero-order-pill-separator" />

                <span className="confirmation-hero-order-pill-label">
                    Placed
                </span>

                <span className="confirmation-hero-order-pill-separator" />

                <span className="confirmation-hero-order-pill-date">
                    14 Oct 2024, 3:42 PM
                </span>

            </div>

            <div className="confirmation-hero-cta-row">

                <button
                    type="button"
                    className="confirmation-hero-btn confirmation-hero-btn-primary"
                >
                    <span className="confirmation-hero-btn-shimmer" />

                    <Clock3 className="confirmation-hero-btn-icon" />

                    <span>View order status</span>
                </button>

                <a
                    href="/"
                    className="confirmation-hero-btn confirmation-hero-btn-ghost"
                >
                    <MessageCircle className="confirmation-hero-btn-icon" />

                    <span>WhatsApp us</span>
                </a>

                <a
                    href="/invoice/order-id"
                    className="confirmation-hero-btn confirmation-hero-btn-ghost"
                >
                    <ArrowDown className="confirmation-hero-btn-icon" />

                    <span>Download invoice</span>
                </a>

            </div>

        </section>
    );
};

export default ConfirmationHero;