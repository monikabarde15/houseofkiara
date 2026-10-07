/**
 * House of Kaira - Deposit Policy Section Header (D10)
 * Section 5 (D10) of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';

const renderTitleWithItalic = (title, italicWord) => {
  if (!italicWord) return title;
  const regex = new RegExp(`(${italicWord})`, 'i');
  const parts = title.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === italicWord.toLowerCase() ? <em key={index}>{part}</em> : part
  );
};

const DepositSectionHeader = ({ number, title, italicWord, description }) => {
  return (
    <div className="sec-hd">
      <span className="sec-n">{number}</span>
      <h2>{renderTitleWithItalic(title, italicWord)}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};

export default React.memo(DepositSectionHeader);
