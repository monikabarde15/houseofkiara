import { useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import StatusPipeline from "../../modal/StatusPipeline";
import OrderStatusDetailRows from "../../modal/OrderStatusDetailRows";
import "../../../../styles/confirmation/mobile/modal/mobile-order-status-modal.css";

const MobileOrderStatusModal = ({
    isOpen,
    onCloseOrderStatus,
    orderReference = "HOK-2024-04891",
    orderDate = "14 Oct 2024, 3:42 PM",
}) => {
    // Close Function
    const closeOrderStatus = () => {
        document.body.style.overflow = "";
        onCloseOrderStatus();
    };

    // Overlay Click Handler
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeOrderStatus();
        }
    };

    // Escape Listener (click anywhere other than dialog box , to exit ho jaega)
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                closeOrderStatus();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleEscapeKey);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpen]);

    return (
        <div
            className={`mobile-os-overlay ${isOpen ? "open" : ""}`}
            onClick={handleOverlayClick}
        >
            <div className={`mobile-os-sheet ${isOpen ? "open" : ""}`}>
                {/* Sheet Header */}
                <div className="mobile-os-header">
                    <div className="mobile-os-header-content">
                        <div className="mobile-os-eyebrow">Order status</div>
                        <h2 className="mobile-os-title">
                            Your <em>Edit</em>
                        </h2>
                        <div className="mobile-os-ref">
                            Ref · <strong>{orderReference}</strong> · {orderDate}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="mobile-os-close"
                        onClick={closeOrderStatus}
                    >
                        <X size={11} strokeWidth={1.8} />
                    </button>
                </div>

                {/* Sheet Body */}
                <div className="mobile-os-body">
                    {/* Context Note */}
                    <div className="mobile-os-status-note">
                        <p className="mobile-os-status-note-text">
                            Your order was just placed.
                            <strong>
                                {" "}Tracking numbers will appear here once each piece is dispatched.
                            </strong>
                            {" "}— you'll receive them on WhatsApp and email too.
                        </p>
                    </div>

                    {/* Piece List */}
                    <div className="mobile-os-pieces">
                        {/* PIECE 01 - Rental */}
                        <div className="mobile-os-piece">
                            <div className="mobile-os-piece-header">
                                <span className="mobile-os-piece-dot mobile-os-piece-dot-rental" />
                                <h3 className="mobile-os-piece-name">
                                    Ivory Embroidered Bridal Lehenga
                                </h3>
                                <span className="mobile-os-piece-mode mobile-os-piece-mode-rental">
                                    Rental
                                </span>
                            </div>
                            <StatusPipeline
                                stages={[
                                    { label: "Confirmed", state: "done" },
                                    { label: "Deposit Pending", state: "current" },
                                    { label: "Dispatched", state: "inactive" },
                                    { label: "Delivered", state: "inactive" },
                                    { label: "Returned", state: "inactive" },
                                ]}
                            />
                            <OrderStatusDetailRows type="rental" />
                        </div>

                        {/* PIECE 02 - Preloved */}
                        <div className="mobile-os-piece">
                            <div className="mobile-os-piece-header">
                                <span className="mobile-os-piece-dot mobile-os-piece-dot-preloved" />
                                <h3 className="mobile-os-piece-name">
                                    Ivory Tissue Organza Saree
                                </h3>
                                <span className="mobile-os-piece-mode mobile-os-piece-mode-preloved">
                                    Preloved
                                </span>
                            </div>
                            <StatusPipeline
                                stages={[
                                    { label: "Confirmed", state: "done" },
                                    { label: "Preparing", state: "current" },
                                    { label: "Dispatched", state: "inactive" },
                                    { label: "Delivered", state: "inactive" },
                                ]}
                            />
                            <OrderStatusDetailRows type="preloved" />
                        </div>

                        {/* PIECE 03 - New */}
                        <div className="mobile-os-piece mobile-os-piece-last">
                            <div className="mobile-os-piece-header">
                                <span className="mobile-os-piece-dot mobile-os-piece-dot-new" />
                                <h3 className="mobile-os-piece-name">
                                    Manyavar Silk Sherwani Set
                                </h3>
                                <span className="mobile-os-piece-mode mobile-os-piece-mode-new">
                                    New
                                </span>
                            </div>
                            <StatusPipeline
                                stages={[
                                    { label: "Confirmed", state: "done" },
                                    { label: "Processing", state: "current" },
                                    { label: "Dispatched", state: "inactive" },
                                    { label: "Delivered", state: "inactive" },
                                ]}
                            />
                            <OrderStatusDetailRows type="new" />
                        </div>
                    </div>
                </div>

                {/* Sheet Footer */}
                <div className="mobile-os-footer">
                    <a
                        href="https://wa.me/HOK_NUMBER"
                        target="_blank"
                        rel="noreferrer"
                        className="mobile-os-footer-btn mobile-os-footer-btn-secondary"
                    >
                        <MessageCircle size={11} strokeWidth={1.5} />
                        <span>WhatsApp us</span>
                    </a>
                    <button
                        type="button"
                        onClick={closeOrderStatus}
                        className="mobile-os-footer-btn mobile-os-footer-btn-primary"
                    >
                        <span className="mobile-os-footer-btn-shimmer" />
                        <span>Done</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileOrderStatusModal;