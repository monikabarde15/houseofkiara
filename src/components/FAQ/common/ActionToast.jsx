// src/components/FAQ/common/ActionToast.jsx
// Action Toast component per Section A10 & 10.8
import React from "react";

export default function ActionToast({ toast }) {
  if (!toast || !toast.message) return null;

  return (
    <div
      className={`toast ${toast.visible ? "show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}
