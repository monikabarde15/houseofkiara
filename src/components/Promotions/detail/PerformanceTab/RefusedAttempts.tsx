/* ========================================
   Promotions Module - Refused Attempts
   Refusal log with check numbers
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.5
   ======================================== */

import React from 'react';
import './styles/RefusedAttempts.css';
import { Card, Link } from '../../components/UI';
import { RefusedAttempt, PromoCode } from '../../types/promotions.types';
import { formatMoney } from '../../utils/formatter';
import { DEFAULT_SHOPPER_MESSAGES } from '../../utils/constants';

interface RefusedAttemptsProps {
  attempts: RefusedAttempt[];
  code: PromoCode;
  redemptions: number;
}

const formatTimestamp = (dateStr: string) => {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

const formatRefusalMessage = (message: string, attempt: RefusedAttempt, code: PromoCode) => {
  let text = message;
  // Replace {x} with minOrder - bagValue
  if (text.includes('{x}')) {
    const minOrder = code.minOrder || 5000;
    const diff = Math.max(0, minOrder - attempt.bagValue);
    text = text.replace(/{x}/g, diff.toLocaleString('en-IN'));
  }
  // Replace {code}
  text = text.replace(/{code}/g, attempt.code);
  return text;
};

export const RefusedAttempts: React.FC<RefusedAttemptsProps> = ({ attempts, code, redemptions }) => {
  const hasAttempts = attempts.length > 0;

  // Check if one check dominates
  const checkCounts: Record<number, number> = {};
  attempts.forEach(a => {
    checkCounts[a.check] = (checkCounts[a.check] || 0) + 1;
  });

  let dominantCheck: number | null = null;
  let dominantCount = 0;
  Object.entries(checkCounts).forEach(([check, count]) => {
    if (count > dominantCount) {
      dominantCount = count;
      dominantCheck = Number(check);
    }
  });

  const hasDominant = dominantCheck !== null && dominantCount > 1 && dominantCount === attempts.length;

  return (
    <Card
      header={
        <>
          <span className="card__title">Refused Attempts</span>
          <span className="status-badge neutral">{hasAttempts ? attempts.length : 0}</span>
        </>
      }
    >
      <div className="refused-attempts__intro">
        Every time a shopper entered this code and was turned away, with the check that stopped them and the words they read. Successful attempts aren't here — they became orders. Seeded for design; checkout doesn't log these yet.
      </div>

      {hasDominant && (
        <div className="refused-attempts__callout">
          {dominantCount} of {attempts.length} refusals happened at the same check ({dominantCheck})
          {attempts.length > 0 && redemptions === 0 && ', and the code has never been redeemed'}
          . When one check does all the turning away, the rule is usually tighter than the announcement implied.
        </div>
      )}

      {!hasAttempts ? (
        <div className="refused-attempts__empty">
          No refusals recorded — everyone who tried this code could use it.
        </div>
      ) : (
        <table className="refused-attempts__table">
          <thead>
            <tr>
              <th className="refused-attempts__th">When</th>
              <th className="refused-attempts__th">Who</th>
              <th className="refused-attempts__th">Check</th>
              <th className="refused-attempts__th">What they read</th>
              <th className="refused-attempts__th">Bag</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, index) => {
              const messageKey = attempt.messageKey as keyof typeof DEFAULT_SHOPPER_MESSAGES;
              const rawMessage = DEFAULT_SHOPPER_MESSAGES[messageKey] || attempt.messageKey;
              const formattedMessage = formatRefusalMessage(rawMessage, attempt, code);
              
              return (
                <tr key={index}>
                  <td className="refused-attempts__td">{formatTimestamp(attempt.timestamp)}</td>
                  <td className="refused-attempts__td">
                    {attempt.customer ? (
                      <Link onClick={() => console.log('Go to customer:', attempt.customer)}>{attempt.customer}</Link>
                    ) : (
                      <span className="note">Not signed in</span>
                    )}
                  </td>
                  <td className="refused-attempts__td">
                    <span className="refused-attempts__check">{attempt.check}</span>
                  </td>
                  <td className="refused-attempts__td">
                    <span className="refused-attempts__message">“{formattedMessage}”</span>
                  </td>
                  <td className="refused-attempts__td">{formatMoney(attempt.bagValue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
};