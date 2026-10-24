import "../../../styles/checkout/overlay/order-confirmed-overlay.css";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

const OrderConfirmedOverlay = ({
    isOpen,
    cartItems = [],
    activePromo,
    totals = {},
    orderInfo,
    onClose,
}) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const groupedItems = {
        rental: [],
        preloved: [],
        new: [],
    };

    const itemsGrouped = totals?.itemsGrouped || {};
    const rentalItem = itemsGrouped.rental?.[0];

    (cartItems || []).forEach((item) => {
        if (groupedItems[item.type]) {
            groupedItems[item.type].push(item);
        }
    });

    const customerName =
        orderInfo?.customerName ||
        (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.name) ||
        "there";

    const customerEmail =
        orderInfo?.customerEmail ||
        user?.email ||
        "your registered email";

    const orderRef =
        orderInfo?.orderId ||
        orderInfo?.orderNumber ||
        "HOK-2024-04891";

    const isRentalOrder =
        orderInfo?.mode === "Rental" ||
        groupedItems.rental.length > 0 ||
        (cartItems || []).some((item) => item.type === "rental");

    const handleTrackOrder = () => {
        if (onClose) onClose();
        navigate("/profile", {
            state: {
                tab: isRentalOrder ? "rentals" : "purchases",
                orderId: orderRef,
            },
        });
    };

    const handleContinueShopping = () => {
        if (onClose) onClose();
        navigate("/category");
    };

    return (
        <div
            id="confirmed-overlay"
            className={`
        confirmed-overlay
        ${isOpen ? "open" : ""}
      `}
        >
            <div className="confirmed-inner">
                <div className="confirmed-mark">
                    <Check
                        size={20}
                        strokeWidth={1.4}
                        className="confirmed-mark__icon"
                    />
                </div>

                <div className="confirmed-eyebrow">
                    Order confirmed
                </div>

                <h1 className="confirmed-heading">
                    Your <em>Edit</em> is placed.
                </h1>

                <p className="confirmed-body">
                    Thank you, {customerName}.
                    {" "}Your confirmation has been sent to{" "}
                    <strong>{customerEmail}</strong>.
                    {" "}Each piece will be dispatched per
                    its own timeline — you'll receive updates
                    on WhatsApp and email at every step.
                </p>

                <div className="confirmed-reference">
                    Order reference ·{" "}
                    <strong>
                        {orderRef}
                    </strong>
                </div>

                <div className="confirmed-breakdown">
                    {/* ITEMS */}
                    {Object.entries(itemsGrouped)
                        .flatMap(([type, items]) =>
                            (items || []).map((item) => {
                                const modeMap = {
                                    rental: {
                                        label: "Rental",
                                        className:
                                            "confirmed-breakdown__badge--rental",
                                    },
                                    preloved: {
                                        label: "Preloved",
                                        className:
                                            "confirmed-breakdown__badge--preloved",
                                    },
                                    new: {
                                        label: "New",
                                        className:
                                            "confirmed-breakdown__badge--new",
                                    },
                                };

                                const mode =
                                    modeMap[type] || {
                                        label: type.charAt(0).toUpperCase() + type.slice(1),
                                        className: "confirmed-breakdown__badge--new",
                                    };

                                return (
                                    <div
                                        key={item.id}
                                        className="confirmed-breakdown__row"
                                    >
                                        <div className="confirmed-breakdown__left">
                                            <span>
                                                {item.name}
                                            </span>
                                            <span
                                                className={`
                confirmed-breakdown__badge
                ${mode.className}
              `}
                                            >
                                                {mode.label}
                                            </span>
                                        </div>

                                        <div className="confirmed-breakdown__value">
                                            ₹{(item.basePrice || 0).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                    {/* PROMO */}
                    {activePromo &&
                        totals?.discount > 0 && (
                            <div className="confirmed-breakdown__row">
                                <div className="confirmed-breakdown__promo">
                                    Promo {activePromo.code}
                                    {" "}
                                    ({activePromo.label})
                                </div>

                                <div className="confirmed-breakdown__promo">
                                    - ₹
                                    {totals.discount.toLocaleString()}
                                </div>
                            </div>
                        )}

                    {/* TOTAL */}
                    <div
                        className="
      confirmed-breakdown__row
      confirmed-breakdown__row--total
    "
                    >
                        <div className="confirmed-breakdown__total-label">
                            Total paid today
                        </div>

                        <div className="confirmed-breakdown__total-value">
                            ₹{(totals?.grandTotal || 0).toLocaleString()}
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="confirmed-actions">
                        {/* PRIMARY */}
                        <button
                            type="button"
                            className="confirmed-btn confirmed-btn--primary"
                            onClick={handleTrackOrder}
                        >
                            <span className="confirmed-btn__shimmer"></span>
                            Track my order
                        </button>

                        {/* GHOST */}
                        <button
                            type="button"
                            className="confirmed-btn confirmed-btn--ghost"
                            onClick={handleContinueShopping}
                        >
                            Continue shopping
                        </button>
                    </div>

                    {/* WHATSAPP NOTE */}
                    {rentalItem && (
                        <div className="confirmed-whatsapp-note">
                            For your{" "}
                            <strong>
                                {rentalItem.productName}
                            </strong>
                            {" "}rental, our ops team will
                            reach out on WhatsApp within
                            24 hours to arrange the{" "}
                            <strong>
                                ₹15,000 security deposit
                            </strong>
                            {" "}before dispatch. The deposit
                            is not due today.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmedOverlay;