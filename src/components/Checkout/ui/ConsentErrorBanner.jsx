// src\components\Checkout\ui\ConsentErrorBanner.jsx
import "../../../styles/checkout/ui/consent-error-banner.css";
import { useNavigate } from "react-router-dom";
const ConsentErrorBanner = ({
    consentErrors = [],
    consentMeta = [],
}) => {

    if (consentErrors.length === 0) {
        return null;
    }

    const navigate = useNavigate();

    // CREATE HANDLER

    const handleRemoveItem = (type) => {

        navigate("/cart", {
            state: {
                removeItemType: type,
                openRemoveDialog: true,
            },
        });

    };

    return (

        <div className="checkout-consent-error-banner visible">

            <div className="checkout-ceb-title">
                Please accept the following to continue.
            </div>

            {consentErrors.map((errorId) => {

                const consent = consentMeta.find(
                    (item) => item.id === errorId
                );

                if (!consent) return null;

                return (

                    <div
                        key={consent.id}
                        className="checkout-ceb-item"
                    >

                        <span className="checkout-ceb-dot"></span>

                        <div>

                            {/* CONSENT 1 */}
                            {consent.id === 1 && (
                                <>
                                    Accept Terms & Policies

                                    <span className="checkout-ceb-sub">
                                        → Please accept the House of Kaira Terms of Service, Rental Agreement, and
                                        Policies.
                                    </span>
                                </>
                            )}

                            {/* CONSENT 2 */}
                            {consent.id === 2 && (
                                <>
                                    You must acknowledge the final sale condition of the {consent.itemName}.

                                    <span className="checkout-ceb-sub">

                                        → Either accept this condition or remove{" "}

                                        <button
                                            type="button"
                                            className="checkout-ceb-link"
                                            onClick={() =>
                                                handleRemoveItem("preloved")
                                            }
                                        >
                                            {consent.itemName}
                                        </button>

                                        {" "}from your order.

                                    </span>
                                </>
                            )}

                            {/* CONSENT 3 */}
                            {consent.id === 3 && (
                                <>
                                    You must confirm awareness of the ₹15,000 security deposit for your rental.

                                    <span className="checkout-ceb-sub">

                                        → Either accept this condition or remove{" "}

                                        <button
                                            type="button"
                                            className="checkout-ceb-link"
                                            onClick={() =>
                                                handleRemoveItem("rental")
                                            }
                                        >
                                            {consent.itemName}
                                        </button>

                                        {" "}from your order.

                                    </span>
                                </>
                            )}

                            {/* CONSENT 4 */}
                            {consent.id === 4 && (
                                <>
                                    You must acknowledge the{" "}
                                    {consent.returnDate}
                                    {" "}return deadline for the{" "}
                                    {consent.itemName}.

                                    <span className="checkout-ceb-sub">

                                        → Either accept this condition or remove{" "}

                                        <button
                                            type="button"
                                            className="checkout-ceb-link"
                                            onClick={() =>
                                                handleRemoveItem("rental")
                                            }
                                        >
                                            {consent.itemName}
                                        </button>

                                        {" "}from your order.

                                    </span>
                                </>
                            )}

                        </div>

                    </div>
                );

            })}

        </div>

    );
};

export default ConsentErrorBanner;