import {
  Shield,
  Phone,
  RefreshCcw,
} from "lucide-react";

import "../../../styles/confirmation/sidebar/confirmation-trust-list.css";

const ConfirmationTrustList = () => {
  return (
    <div
      className="confirmation-trust-list"
      data-rise="4"
    >

      {/* ITEM 1 */}
      <div className="confirmation-trust-list-item">

        <div className="confirmation-trust-list-icon">
          <Shield
            size={14}
            strokeWidth={1.3}
          />
        </div>

        <p className="confirmation-trust-list-text">
          Quality inspection on every piece before
          dispatch
        </p>

      </div>

      {/* ITEM 2 */}
      <div className="confirmation-trust-list-item">

        <div className="confirmation-trust-list-icon">
          <RefreshCcw
            size={14}
            strokeWidth={1.3}
          />
        </div>

        <p className="confirmation-trust-list-text">
          Deposit refunded within 3–5 business days
        </p>

      </div>

      {/* ITEM 3 */}
      <div className="confirmation-trust-list-item">

        <div className="confirmation-trust-list-icon">
          <Phone
            size={14}
            strokeWidth={1.3}
          />
        </div>

        <p className="confirmation-trust-list-text">
          WhatsApp support throughout your order
        </p>

      </div>

    </div>
  );
};

export default ConfirmationTrustList;