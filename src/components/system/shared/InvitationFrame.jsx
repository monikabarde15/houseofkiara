/**
 * House of Kaira: Invitation Frame Component (C1)
 * Section 4 C1 of System Pages Specification v1.0
 */

import React from "react";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-frame.css";

export default function InvitationFrame({
  children,
  className = "",
  style = {},
  maxWidth
}) {
  const customStyle = maxWidth ? { ...style, maxWidth: `${maxWidth}px` } : style;

  return (
    <div className={`sys-invitation-frame ${className}`.trim()} style={customStyle}>
      <div className="sys-frame-keyline" aria-hidden="true" />
      <div className="sys-frame-diamond" aria-hidden="true" />
      {children}
    </div>
  );
}
