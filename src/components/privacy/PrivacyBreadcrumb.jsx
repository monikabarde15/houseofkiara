/**
 * House of Kaira - Privacy Policy Breadcrumb Navigation
 * Section 5.1 of Build Specification v2.0
 */

import React from 'react';

const PrivacyBreadcrumb = () => {
  return (
    <nav className="privacy-breadcrumb-container" aria-label="Breadcrumb">
      <ol className="privacy-breadcrumb-list">
        <li className="privacy-breadcrumb-item">
          <a href="/" className="privacy-breadcrumb-link">
            Home
          </a>
        </li>
        <li className="privacy-breadcrumb-slash" aria-hidden="true">
          /
        </li>
        <li className="privacy-breadcrumb-item">
          <span className="privacy-breadcrumb-muted">
            Policies
          </span>
        </li>
        <li className="privacy-breadcrumb-slash" aria-hidden="true">
          /
        </li>
        <li className="privacy-breadcrumb-item">
          <span className="privacy-breadcrumb-current" aria-current="page">
            Privacy Policy
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default React.memo(PrivacyBreadcrumb);
