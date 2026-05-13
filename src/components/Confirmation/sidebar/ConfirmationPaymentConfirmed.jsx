import {
  Check,
} from "lucide-react";

import "../../../styles/confirmation/sidebar/confirmation-payment-confirmed.css";

const ConfirmationPaymentConfirmed = ({
  amount = "₹46,730",
  paymentMethod = "Razorpay",
  paymentDate = "14 Oct 2024",
}) => {
  return (
    <div className="paid-confirm-block">

      <div className="pcb-check">
        <Check
          size={14}
          strokeWidth={1.8}
        />
      </div>

      <div className="pcb-content">

        <div className="pcb-label">
          Payment confirmed
        </div>

        <div className="pcb-amount-row">

          <span className="pcb-amount">
            {amount}
          </span>

          <span className="pcb-amount-suffix">
            charged · {paymentMethod} · {paymentDate}
          </span>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationPaymentConfirmed;