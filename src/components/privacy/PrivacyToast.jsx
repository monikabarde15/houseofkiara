/**
 * House of Kaira - Privacy Policy Toast Notification
 * Implementation of Section 5.14 of Build Specification v2.0
 */

import React from 'react';

const PrivacyToast = ({ message, isVisible }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`privacy-toast ${isVisible ? 'privacy-toast-visible' : ''}`}
    >
      <span className="privacy-toast-text">{message}</span>
    </div>
  );
};

export default React.memo(PrivacyToast);
