import React from 'react';
import './FooterRegion.css';

interface PaymentMethodChipsProps {
  paymentMethods: { [key: string]: boolean };
  onChange: (updated: { [key: string]: boolean }) => void;
}

const PAYMENT_METHODS_DEF = [
  { id: 'upi', label: 'UPI' },
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'rupay', label: 'RuPay' },
  { id: 'netbanking', label: 'Net Banking' },
  { id: 'paytm', label: 'Paytm' },
  { id: 'amex', label: 'Amex' },
  { id: 'nocost_emi', label: 'No-cost EMI' }
];

export const PaymentMethodChips: React.FC<PaymentMethodChipsProps> = ({
  paymentMethods,
  onChange
}) => {
  const handleToggle = (id: string) => {
    const current = !!paymentMethods[id];
    onChange({ ...paymentMethods, [id]: !current });
  };

  return (
    <div className="hok-payment-chips-container" id="footer-payment-methods">
      <div className="hok-payment-chips-label">Payment methods shown</div>
      <div className="hok-payment-chips-row">
        {PAYMENT_METHODS_DEF.map((method) => {
          const isActive = !!paymentMethods[method.id];
          const hint = isActive
            ? 'Advertised in the footer. Click to stop showing it.'
            : 'Not advertised. Click to show it — only if checkout accepts it.';

          return (
            <button
              key={method.id}
              type="button"
              className={`hok-payment-pill-btn ${isActive ? 'is-active' : 'is-muted'}`}
              onClick={() => handleToggle(method.id)}
              data-hint={hint}
            >
              {method.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
