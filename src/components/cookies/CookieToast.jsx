/**
 * House of Kaira - Cookie Policy Floating Toast Notification
 * Section 3.6 & 5.12 of Build Specification v1.0
 */

import React from 'react';

const CookieToast = ({ message, isVisible }) => {
  return (
    <div
      className={`cookie-toast ${isVisible ? 'cookie-toast-visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="cookie-toast-text">{message}</span>
    </div>
  );
};

export default React.memo(CookieToast);
