/**
 * Toast Notification for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 12.8 & A10
 */

import React, { useEffect } from "react";

export default function RefundToast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 2200);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible || !message) return null;

  return (
    <div className="refund-toast" role="status" aria-live="polite">
      <span>{message}</span>
    </div>
  );
}
