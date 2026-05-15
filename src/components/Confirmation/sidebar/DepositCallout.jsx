// src\components\Confirmation\sidebar\DepositCallout.jsx
import "../../../styles/confirmation/sidebar/deposit-callout.css";

const DepositCallout = () => {
  return (
    <div
      className="confirmation-deposit-callout"
      data-rise="2"
    >

      <div className="confirmation-deposit-callout-title">
        * Security deposit — not yet charged
      </div>

      <p className="confirmation-deposit-callout-text">
        The <b>₹15,000 security deposit</b> for the
        lehenga rental is arranged separately by our
        ops team on WhatsApp — not taken today.
        Fully refundable within 3–5 business days
        of a clean return.
      </p>

    </div>
  );
};

export default DepositCallout;