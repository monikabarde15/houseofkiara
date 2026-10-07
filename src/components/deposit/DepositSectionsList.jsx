/**
 * House of Kaira - Deposit Policy 9 Sections List (D10, D11)
 * Section 5 (D10, D11) & Section 6.3 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import DepositSectionHeader from './DepositSectionHeader.jsx';
import DepositQuestionRow from './DepositQuestionRow.jsx';

const DepositSectionsList = ({
  sections,
  openQuestionIds,
  onToggleQuestion,
  onJump,
  onShowToast
}) => {
  if (!sections || !sections.length) return null;

  return (
    <div className="dp-sections">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="sec"
          data-section-id={section.id}
          aria-labelledby={`sec-hd-${section.id}`}
        >
          <DepositSectionHeader
            number={section.number}
            title={section.title}
            italicWord={section.italicWord}
            description={section.description}
          />

          <ul className="sec-list">
            {section.questions.map((question) => (
              <DepositQuestionRow
                key={question.id}
                question={question}
                isOpen={openQuestionIds.has(question.id)}
                onToggle={() => onToggleQuestion(question.id)}
                onJump={onJump}
                onShowToast={onShowToast}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default React.memo(DepositSectionsList);
