/**
 * House of Kaira: System Buttons and Links (C4)
 * Section 4 C4 of System Pages Specification v1.0
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-hero.css";

export function SystemDarkButton({ children, to, href, onClick, className = "" }) {
  if (to) {
    return (
      <Link to={to} className={`sys-btn-dark ${className}`.trim()} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={`sys-btn-dark ${className}`.trim()} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={`sys-btn-dark ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
}

export function SystemOutlineButton({ children, to, href, onClick, className = "" }) {
  if (to) {
    return (
      <Link to={to} className={`sys-btn-outline ${className}`.trim()} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={`sys-btn-outline ${className}`.trim()} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={`sys-btn-outline ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
}

export function SystemGoldButton({ children, href, onClick, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`sys-btn-gold ${className}`.trim()}
      onClick={onClick}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.531 1.77.813 2.796.814 3.183 0 5.77-2.586 5.771-5.766.001-3.181-2.585-5.8-5.771-5.8zm3.376 8.21c-.144.405-.837.774-1.17.824-.312.045-.694.079-2.127-.514-1.834-.759-3.003-2.617-3.094-2.738-.09-.121-.745-.989-.745-1.887 0-.898.469-1.339.636-1.523.167-.184.364-.23.485-.23.122 0 .243.002.349.007.112.006.262-.042.41.314.152.364.517 1.26.562 1.352.045.092.076.199.015.321-.06.121-.091.198-.182.304-.09.106-.191.237-.273.318-.091.091-.186.19-.08.372.106.182.472.778 1.013 1.259.697.621 1.285.814 1.468.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.061.5 1.243.591.182.091.303.136.349.213.045.076.045.438-.099.843z" />
      </svg>
      <span>{children}</span>
    </a>
  );
}

export function SystemQueryLink({ query, label, to, onClick }) {
  const content = label || `“${query}”`;
  if (to) {
    return (
      <Link to={to} className="sys-query-link" onClick={onClick}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href={`/search?q=${encodeURIComponent(query)}`}
      className="sys-query-link"
      onClick={onClick}
    >
      {content}
    </a>
  );
}

export function SystemQuietLinksRow({ showBack = false, links = [] }) {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const allLinks = showBack
    ? [{ label: "Go back", isBack: true, key: "link_back" }, ...links]
    : links;

  return (
    <nav className="sys-quiet-links-row" aria-label="Quick links">
      {allLinks.map((link, index) => {
        const isBack = link.isBack;
        return (
          <React.Fragment key={link.label || link.key || index}>
            {index > 0 && <span className="sys-quiet-link-dot" aria-hidden="true" />}
            {isBack ? (
              <button
                type="button"
                onClick={handleBack}
                className="sys-quiet-link sys-back-link"
              >
                {link.label}
              </button>
            ) : link.to ? (
              <Link to={link.to} className="sys-quiet-link">
                {link.label}
              </Link>
            ) : (
              <a href={link.href} className="sys-quiet-link">
                {link.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
