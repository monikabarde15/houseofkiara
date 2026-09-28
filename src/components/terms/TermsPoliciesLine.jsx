import React from 'react';
import { Link } from 'react-router-dom';
import { RELATED_POLICIES } from '../../data/terms/termsRegistry.js';
import { TERMS_SETTINGS } from '../../data/terms/termsSettings.js';
import { scrollToClause } from '../../utils/terms/termsFormatter.jsx';

/**
 * Terms & Conditions "Our Policies" Footer Links Line
 * Section 5.10 of Build Specification v3.0
 */
const TermsPoliciesLine = ({ onPrint }) => {
  const handlePrintClick = (e) => {
    e.preventDefault();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handlePolicyClick = (path, e) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      scrollToClause(path);
    }
  };

  return (
    <section className="terms-policies-section" aria-labelledby="terms-policies-label">
      <div className="terms-policies-top-divider" aria-hidden="true" />
      
      <div className="terms-policies-row">
        <span id="terms-policies-label" className="terms-policies-heading">
          Our policies
        </span>

        <nav className="terms-policies-nav" aria-label="Related policy pages">
          {RELATED_POLICIES.map((policy, idx) => {
            const isInternalAnchor = policy.path.startsWith('#');
            return isInternalAnchor ? (
              <a
                key={`policy-${idx}`}
                href={policy.path}
                className="terms-policy-link"
                onClick={(e) => handlePolicyClick(policy.path, e)}
              >
                {policy.name}
              </a>
            ) : (
              <Link
                key={`policy-${idx}`}
                to={policy.path}
                className="terms-policy-link"
              >
                {policy.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="terms-policies-meta-block">
        <p className="terms-policies-meta-text">
          These Terms are our agreement with you, and the policies above form part of it; Help &amp; FAQs explains them in simpler words. {TERMS_SETTINGS.terms_version}, last updated {TERMS_SETTINGS.terms_updated}. Earlier versions are kept, and we send them on request.{' '}
          <button
            type="button"
            className="terms-policies-print-btn"
            onClick={handlePrintClick}
          >
            Print or save as PDF
          </button>
        </p>
      </div>
    </section>
  );
};

export default React.memo(TermsPoliciesLine);
