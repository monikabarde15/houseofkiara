/**
 * House of Kaira - Deposit Policy Shared Verdict Tag (D8)
 * Section 5 (D8) of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';

const DepositVerdictTag = ({ label, text, type = 'neutral' }) => {
  const displayLabel = label || text;
  if (!displayLabel) return null;

  let colorClass = 'v-mid';
  if (type === 'positive' || type === 'yes' || type === 'sage') {
    colorClass = 'v-yes';
  } else if (type === 'caution' || type === 'no' || type === 'terracotta') {
    colorClass = 'v-no';
  }

  return (
    <span className={`vd ${colorClass}`}>
      {label}
    </span>
  );
};

export default React.memo(DepositVerdictTag);
