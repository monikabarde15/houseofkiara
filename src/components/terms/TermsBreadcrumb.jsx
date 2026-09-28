import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Terms & Conditions Breadcrumb
 * Section 5.1 of Build Specification v3.0
 */
const TermsBreadcrumb = () => {
  return (
    <nav aria-label="Breadcrumb" className="terms-breadcrumb">
      <div className="terms-breadcrumb-inner">
        <Link to="/" className="terms-breadcrumb-link">
          Home
        </Link>
        <span className="terms-breadcrumb-slash" aria-hidden="true">
          /
        </span>
        <span className="terms-breadcrumb-link terms-breadcrumb-static">
          Policies
        </span>
        <span className="terms-breadcrumb-slash" aria-hidden="true">
          /
        </span>
        <span className="terms-breadcrumb-current" aria-current="page">
          Terms &amp; Conditions
        </span>
      </div>
    </nav>
  );
};

export default React.memo(TermsBreadcrumb);
