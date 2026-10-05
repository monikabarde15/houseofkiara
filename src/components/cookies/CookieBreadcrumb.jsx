/**
 * House of Kaira - Cookie Policy Breadcrumb Navigation
 * Section 5.1 of Build Specification v1.0
 */

import React from 'react';

const CookieBreadcrumb = () => {
  return (
    <nav className="cookie-breadcrumb-container" aria-label="Breadcrumb navigation">
      <ol className="cookie-breadcrumb-list">
        <li className="cookie-breadcrumb-item">
          <a href="/" className="cookie-breadcrumb-link">
            Home
          </a>
        </li>
        <li className="cookie-breadcrumb-slash" aria-hidden="true">/</li>
        <li className="cookie-breadcrumb-item">
          <span className="cookie-breadcrumb-muted">
            Policies
          </span>
        </li>
        <li className="cookie-breadcrumb-slash" aria-hidden="true">/</li>
        <li className="cookie-breadcrumb-item" aria-current="page">
          <span className="cookie-breadcrumb-current">
            Cookie Policy
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default React.memo(CookieBreadcrumb);
