import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";

export default function ContactBreadcrumb() {
  const { homeLabel, homePath, currentLabel } = CONTACT_CONTENT.breadcrumb;

  return (
    <nav className="crumb inline" aria-label="Breadcrumb">
      <Link to={homePath}>{homeLabel}</Link>
      <span className="sep" aria-hidden="true">
        /
      </span>
      <span className="current" aria-current="page">
        {currentLabel}
      </span>
    </nav>
  );
}
