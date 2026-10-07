/**
 * House of Kaira - Care Policy Breadcrumbs (Component C1)
 * Section 5.1 of Build Specification 2.0
 */

import React from "react";
import { Link } from "react-router-dom";

export default function CareBreadcrumb() {
  return (
    <nav className="crumbs enter" aria-label="Breadcrumb">
      <Link to="/" style={{ textDecoration: "none" }}>
        <button type="button">Home</button>
      </Link>
      <i aria-hidden="true">/</i>
      <Link to="/faqs" style={{ textDecoration: "none" }}>
        <button type="button">Support</button>
      </Link>
      <i aria-hidden="true">/</i>
      <span aria-current="page">Care, Cleaning &amp; Damage Policy</span>
    </nav>
  );
}
