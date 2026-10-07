/**
 * House of Kaira - Deposit Question Row Component (D10, D11)
 * Section 5 (D10, D11), 6.3 & 6.8 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import DepositVerdictTag from './DepositVerdictTag.jsx';
import DepositAnswerContent from './DepositAnswerContent.jsx';

const DepositQuestionRow = ({
  question,
  isOpen,
  onToggle,
  onJump,
  onShowToast
}) => {
  return (
    <li
      className={`cq ${isOpen ? 'on' : ''}`}
      id={question.id}
      data-question-id={question.id}
    >
      <button
        type="button"
        className="cq-b"
        aria-expanded={isOpen}
        aria-controls={`ans-${question.id}`}
        id={`btn-${question.id}`}
        onClick={onToggle}
      >
        <span className="cq-t">{question.question}</span>

        {question.tag && (
          <DepositVerdictTag label={question.tag} type={question.tagType} />
        )}

        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <DepositAnswerContent
        questionId={question.id}
        questionText={question.question}
        content={question.content}
        onJump={onJump}
        onShowToast={onShowToast}
      />
    </li>
  );
};

export default React.memo(DepositQuestionRow);
