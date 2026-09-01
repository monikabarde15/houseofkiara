import { useEffect } from "react";
import { X, MessageCircle, } from "lucide-react";
import "../../../styles/confirmation/modal/order-status-modal.css";
import StatusPipeline from "./StatusPipeline";
import OrderStatusDetailRows from "./OrderStatusDetailRows";
const OrderStatusModal = ({
    isOpen, onCloseOrderStatus,
}) => {

    // Close Function
    const closeOrderStatus = () => {

        document.body.style.overflow = "";

        onCloseOrderStatus();

    };

    // Overlay Click Handler
    const handleOverlayClick = (event) => {

        if (
            event.target === event.currentTarget
        ) {
            closeOrderStatus();
        }

    };
    // Escape Listener
    useEffect(() => {

        const handleEscapeKey = (event) => {

            if (event.key === "Escape") {
                closeOrderStatus();
            }

        };

        if (isOpen) {

            document.body.style.overflow = "hidden";

            document.addEventListener(
                "keydown",
                handleEscapeKey
            );

        }

        else {

            document.body.style.overflow = "";

        }

        return () => {

            document.body.style.overflow = "";

            document.removeEventListener(
                "keydown",
                handleEscapeKey
            );

        };

    }, [isOpen]);


    return (
        <div
            className={`hok-order-status-overlay ${isOpen ? "open" : ""
                }`}
            onClick={handleOverlayClick}
        >

            <div
                className={`hok-order-status-modal ${isOpen ? "open" : ""
                    }`}
            >

                {/* 8.3 MODAL HEADER */}

                <div className="hok-order-status-header">

                    <div className="hok-order-status-header-content">

                        <div className="hok-order-status-eyebrow">
                            Order status
                        </div>

                        <h2 className="hok-order-status-title">
                            Your <em>Edit</em>
                        </h2>

                        <div className="hok-order-status-reference">
                            Reference · <strong>HOK-2024-04891</strong> ·
                            Placed 14 Oct 2024, 3:42 PM
                        </div>

                    </div>

                    <button
                        type="button"
                        className="hok-order-status-close"
                        onClick={closeOrderStatus}
                    >
                        <X />
                    </button>

                </div>

                {/* 8.4 MODAL BODY */}
                <div className="hok-order-status-body">

                    {/* 8.4.1 CONTEXT NOTE */}
                    <div className="hok-order-status-note">

                        <p className="hok-order-status-note-text">
                            Your order was just placed.
                            <strong>
                                {" "}Tracking numbers will appear here
                                once each piece is dispatched.
                            </strong>
                            {" "}— you'll also receive them on WhatsApp
                            and email. Right now, you can see the
                            current status of each piece in your order
                            below.
                        </p>

                    </div>

                    {/* 8.4.2 PIECE LIST*/}
                    <div className="hok-order-status-pieces">

                        {/* PIECE 01 */}
                        <div className="hok-order-status-piece">

                            {/* 8.4.3 PIECE HEADER */}
                            <div className="hok-order-status-piece-header">

                                <span className="hok-order-status-piece-dot hok-order-status-piece-dot-rental" />

                                <h3 className="hok-order-status-piece-name">
                                    Ivory Embroidered Bridal Lehenga
                                </h3>

                                <span className="hok-order-status-piece-mode hok-order-status-piece-mode-rental">
                                    Rental
                                </span>

                            </div>
                            <StatusPipeline
                                stages={[
                                    {
                                        label: "Confirmed",
                                        state: "done",
                                    },
                                    {
                                        label: "Deposit Pending",
                                        state: "current",
                                    },
                                    {
                                        label: "Dispatched",
                                        state: "inactive",
                                    },
                                    {
                                        label: "Delivered",
                                        state: "inactive",
                                    },
                                    {
                                        label: "Returned",
                                        state: "inactive",
                                    },
                                ]}
                            />
                            <OrderStatusDetailRows type="rental" />

                        </div>

                        {/* PIECE 02 */}
                        <div className="hok-order-status-piece">

                            <div className="hok-order-status-piece-header">

                                <span className="hok-order-status-piece-dot hok-order-status-piece-dot-preloved" />

                                <h3 className="hok-order-status-piece-name">
                                    Ivory Tissue Organza Saree
                                </h3>

                                <span className="hok-order-status-piece-mode hok-order-status-piece-mode-preloved">
                                    Preloved
                                </span>

                            </div>
                            <StatusPipeline
                                stages={[
                                    {
                                        label: "Confirmed",
                                        state: "done",
                                    },
                                    {
                                        label: "Preparing",
                                        state: "current",
                                    },
                                    {
                                        label: "Dispatched",
                                        state: "inactive",
                                    },
                                    {
                                        label: "Delivered",
                                        state: "inactive",
                                    },
                                ]}
                            />
                            <OrderStatusDetailRows type="preloved" />

                        </div>

                        {/* PIECE 03 */}
                        <div className="hok-order-status-piece hok-order-status-piece-last">

                            <div className="hok-order-status-piece-header">

                                <span className="hok-order-status-piece-dot hok-order-status-piece-dot-new" />

                                <h3 className="hok-order-status-piece-name">
                                    Manyavar Silk Sherwani Set
                                </h3>

                                <span className="hok-order-status-piece-mode hok-order-status-piece-mode-new">
                                    New
                                </span>

                            </div>

                            <StatusPipeline
                                stages={[
                                    {
                                        label: "Confirmed",
                                        state: "done",
                                    },
                                    {
                                        label: "Processing",
                                        state: "current",
                                    },
                                    {
                                        label: "Dispatched",
                                        state: "inactive",
                                    },
                                    {
                                        label: "Delivered",
                                        state: "inactive",
                                    },
                                ]}
                            />

                            <OrderStatusDetailRows type="new" />

                        </div>

                    </div>

                </div>

                {/* 8.5 MODAL FOOTER */}

                <div className="hok-order-status-footer">

                    {/* =========================================================
                WHATSAPP BUTTON
            ========================================================= */}

                    <a
                        href="https://wa.me/HOK_NUMBER"
                        target="_blank"
                        rel="noreferrer"
                        className="
                    hok-order-status-footer-button
                    hok-order-status-footer-button-secondary
                "
                    >

                        <MessageCircle size={11} />

                        WhatsApp us

                    </a>

                    {/* =========================================================
                DONE BUTTON
            ========================================================= */}

                    <button
                        type="button"
                        onClick={onCloseOrderStatus}
                        className="
                    hok-order-status-footer-button
                    hok-order-status-footer-button-primary
                "
                    >

                        <span className="hok-order-status-footer-button-shimmer" />

                        <span className="hok-order-status-footer-button-label">
                            Done
                        </span>

                    </button>

                </div>
            </div>

        </div>
    );
};

export default OrderStatusModal;