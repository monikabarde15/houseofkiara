import React, { useEffect, useState } from "react";
import { computeSupportStatus } from "../../utils/contact/contactStatus";

export default function ContactLiveStatus({ getVal, contactSettings }) {
  const [status, setStatus] = useState(() => computeSupportStatus());

  useEffect(() => {
    // Recheck every 60 seconds
    const interval = setInterval(() => {
      const next = computeSupportStatus();
      setStatus((prev) => {
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

  const displayTitle = getVal && status.isOpen
    ? getVal("contact_open_heading", status.title)
    : getVal && !status.isOpen
    ? getVal("contact_closed_prefix", status.title)
    : status.title;

  const displayLine =
    status.isOpen && contactSettings?.supportHours
      ? `${contactSettings.supportHours.replace(/\.$/, "")}.`
      : status.line;

  return (
    <div
      className={`status ${status.isOpen ? "is-open" : "is-closed"}`}
      role="status"
      aria-live="polite"
    >
      <span className="st-dot" aria-hidden="true" />
      <div className="st-text">
        <span className="st-title">{displayTitle}</span>
        <span className="st-sub">{displayLine}</span>
      </div>
    </div>
  );
}
