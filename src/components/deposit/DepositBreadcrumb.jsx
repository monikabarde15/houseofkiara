/**
 * House of Kaira - Deposit Policy Breadcrumb
 * Section 5 (D1) of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';

const DepositBreadcrumb = () => {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href="/" title="Go to House of Kaira Homepage">
        Home
      </a>
      <i aria-hidden="true">/</i>
      <a href="/faqs" title="Go to Support Hub & FAQs">
        Support
      </a>
      <i aria-hidden="true">/</i>
      <span aria-current="page">Deposit Policy</span>
    </nav>
  );
};

export default React.memo(DepositBreadcrumb);
