// src/components/pricing/PricingBreadcrumb.jsx
// Breadcrumb navigation for Pricing & Fees specification (D1, Page 9)

import React from "react";
import { Link } from "react-router-dom";

export default function PricingBreadcrumb() {
  return (
    <nav className="crumbs enter e1" aria-label="Breadcrumb">
      <Link to="/" style={{ textDecoration: "none" }}>
        <button type="button">Home</button>
      </Link>
      <i aria-hidden="true">/</i>
      <Link to="/faqs" style={{ textDecoration: "none" }}>
        <button type="button">Support</button>
      </Link>
      <i aria-hidden="true">/</i>
      <span aria-current="page">Pricing & Fees</span>
    </nav>
  );
}
