// src/components/FAQ/common/Breadcrumb.jsx
// Breadcrumb component per Section 4 (A8)
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Breadcrumb({ onSelectMoment }) {
  const navigate = useNavigate();

  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <button
        type="button"
        className="crumb-link"
        onClick={() => navigate("/")}
      >
        Home
      </button>
      <i className="crumb-slash" aria-hidden="true">/</i>
      <button
        type="button"
        className="crumb-link"
        onClick={() => {
          if (onSelectMoment) onSelectMoment("before");
        }}
      >
        Support
      </button>
      <i className="crumb-slash" aria-hidden="true">/</i>
      <span className="crumb-current" aria-current="page">
        Help & FAQs
      </span>
    </nav>
  );
}
