import "../../../styles/checkout/overlay/order-confirmed-overlay.css";
import { Check } from "lucide-react";
const OrderConfirmedOverlay = ({
    isOpen,
}) => {

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

            </div>

        </div>

    );

};

export default OrderConfirmedOverlay;