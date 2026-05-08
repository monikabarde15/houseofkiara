import React from "react";
import "../../../styles/checkout/notices/new-purchase-section.css"
const NewPurchaseNotice = () => {
    return (
        <div className="checkout-notice checkout-notice--new">

            <p className="checkout-notice__text">
                <strong className="checkout-notice__highlight">
                    Dispatch timeline:
                </strong>{" "}
                Ships within 3–5 business days of order confirmation
                from Manyavar's fulfilment centre. Eligible for a
                7-day return from the date of delivery. Price is GST-inclusive at{" "}
                <strong className="checkout-notice__highlight">
                    18%
                </strong>{" "}
                (GST 2.0 rate, effective 22 Sep 2025 —
                garments priced above ₹2,500). Tracking details
                shared on WhatsApp and email.
            </p>

        </div>
    );
};

export default NewPurchaseNotice;