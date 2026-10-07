/**
 * House of Kaira - Deposit Policy Intro Paragraph (D6)
 * Section 5 (D6) & 7.3 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';

const DepositIntro = () => {
  return (
    <p className="dp-intro">
      Every piece at House of Kaira carries a story, often one its owner holds dear. Your refundable security deposit keeps that story safe for the next person who wears it. It remains yours throughout: when your piece returns on time and as it left us, <strong>every rupee is returned to you.</strong>
    </p>
  );
};

export default React.memo(DepositIntro);
