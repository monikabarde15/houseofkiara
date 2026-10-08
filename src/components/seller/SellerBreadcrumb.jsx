/**
 * House of Kaira - Seller Guidelines Breadcrumb Component (Component C1)
 * Section 5.1 of Build Specification 1.0
 */

import React from "react";
import { Link } from "react-router-dom";

export default function SellerBreadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.label || index}>
            {index > 0 && (
              <span className="crumb-sep" aria-hidden="true">
                /
              </span>
            )}
            {isLast || !item.href ? (
              <span className="crumb-current" aria-current="page">
                {item.label}
              </span>
            ) : item.href.startsWith("/") ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
