import React from 'react';
import { CheckIcon } from './TermsIcons';

/**
 * Terms & Conditions Toast Notification
 * Section 5.12 of Build Specification v3.0
 */
const TermsToast = ({ message, isVisible }) => {
  if (!message && !isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`terms-toast ${isVisible ? 'terms-toast-visible' : ''}`}
    >
      <div className="terms-toast-content">
        <CheckIcon size={14} className="terms-toast-icon" color="var(--hok-gold)" />
        <span className="terms-toast-text">{message}</span>
      </div>
    </div>
  );
};

export default React.memo(TermsToast);
