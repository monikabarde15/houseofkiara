/**
 * House of Kaira: Shipping & Delivery Policy Breadcrumb (D1)
 * Section 4.1 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { Link } from "react-router-dom";
import { SHIPPING_BREADCRUMB } from "../../data/shipping/shippingRegistry";

export default function ShippingBreadcrumb() {
  return (
    <nav className="crumbs enter e1" aria-label="Breadcrumb">
      <Link to={SHIPPING_BREADCRUMB.homePath} style={{ textDecoration: "none" }}>
        <button type="button">{SHIPPING_BREADCRUMB.homeLabel}</button>
      </Link>
      <i aria-hidden="true">/</i>
      <Link to={SHIPPING_BREADCRUMB.supportPath} style={{ textDecoration: "none" }}>
        <button type="button">{SHIPPING_BREADCRUMB.supportLabel}</button>
      </Link>
      <i aria-hidden="true">/</i>
      <span aria-current="page">{SHIPPING_BREADCRUMB.currentLabel}</span>
    </nav>
  );
}
