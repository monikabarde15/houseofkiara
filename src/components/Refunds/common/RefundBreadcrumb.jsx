/**
 * Breadcrumb Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 04.1
 */

import React from "react";
import { Link } from "react-router-dom";

export default function RefundBreadcrumb() {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link to="/" className="crumbs-btn">
        Home
      </Link>
      <i className="crumbs-slash">/</i>
      <Link to="/faqs" className="crumbs-btn">
        Support
      </Link>
      <i className="crumbs-slash">/</i>
      <span className="crumbs-cur" aria-current="page">
        Refund & Cancellation Policy
      </span>
    </nav>
  );
}
