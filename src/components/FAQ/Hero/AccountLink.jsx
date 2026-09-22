// src/components/FAQ/Hero/AccountLink.jsx
// Account moment link (B12) per Section B12
import React from "react";

export default function AccountLink({ onSelectMoment }) {
  return (
    <div className="ch-else enter e4">
      <span>Looking for something else?</span>
      <button
        type="button"
        className="ch-else-btn"
        onClick={() => onSelectMoment("account")}
      >
        Your account, data and how to reach us
      </button>
    </div>
  );
}
