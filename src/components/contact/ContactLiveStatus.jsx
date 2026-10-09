import React, { useEffect, useState } from "react";
import { computeSupportStatus } from "../../utils/contact/contactStatus";

export default function ContactLiveStatus() {
  const [status, setStatus] = useState(() => computeSupportStatus());

  useEffect(() => {
    // Recheck every 60 seconds
    const interval = setInterval(() => {
      const next = computeSupportStatus();
      setStatus((prev) => {
        // Only trigger state update if properties changed
        if (
          prev.isOpen === next.isOpen &&
          prev.title === next.title &&
          prev.line === next.line
        ) {
          return prev;
        }
        return next;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`status ${status.isOpen ? "is-open" : "is-closed"}`}
      role="status"
      aria-live="polite"
    >
      <span className="st-dot" aria-hidden="true" />
      <div className="st-text">
        <span className="st-title">{status.title}</span>
        <span className="st-sub">{status.line}</span>
      </div>
    </div>
  );
}
