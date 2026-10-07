/**
 * House of Kaira - Deposit Policy Dedicated Print Document
 * Section 6.10 & P01 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React, { useMemo } from 'react';
import { DEPOSIT_SETTINGS } from '../../data/deposit/depositSettings.js';
import { DEPOSIT_SECTIONS } from '../../data/deposit/depositRegistry.js';
import { calculateWorkedExamples } from '../../utils/deposit/depositCalculations.js';

const DepositPrintDocument = () => {
  const exampleData = useMemo(() => calculateWorkedExamples(), []);

  return (
    <div className="dp-print-doc" aria-hidden="true">
      {/* 1. Header */}
      <div className="dp-print-header">
        <h1 className="dp-print-title">Deposit Policy</h1>
        <p className="dp-print-meta">
          House of Kaira · Last reviewed {DEPOSIT_SETTINGS.last_reviewed_date} · Circular Luxury Fashion
        </p>
        <p className="dp-print-intro">
          Every piece in our collection travels with a security deposit: an amount held in safekeeping so that the piece is protected for the next person who wears it. When your piece returns on time and as it left us, every rupee is returned to you. This policy sets out, in plain language, how your deposit is paid, held and returned, and what can and cannot be deducted.
        </p>
      </div>

      {/* 2. Your deposit, in practice (Worked Examples) */}
      <h2 className="dp-print-examples-heading">Your deposit, in practice</h2>
      <div className="dp-print-examples-grid">
        {exampleData.tabs.map((tab) => (
          <div key={tab.id} className="dp-print-example-card">
            <h3 className="dp-print-example-title">{tab.label}</h3>
            <table className="dp-print-example-table">
              <tbody>
                {tab.lines.map((line, idx) => (
                  <tr key={idx}>
                    <td>{line.label}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{line.amount}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td>{tab.totalLabel}</td>
                  <td style={{ textAlign: 'right' }}>{tab.totalAmount}</td>
                </tr>
              </tbody>
            </table>
            {tab.notes && tab.notes.length > 0 && (
              <div className="dp-print-example-notes">
                {tab.notes.map((note, nIdx) => (
                  <p key={nIdx} style={{ margin: '2pt 0' }}>{note}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. Nine Policy Sections */}
      <div className="dp-print-sections-list">
        {DEPOSIT_SECTIONS.map((section) => (
          <div key={section.id} className="dp-print-section">
            <div className="dp-print-section-hd">
              <span className="dp-print-sec-n">{section.number}</span>
              <h2 className="dp-print-sec-title">{section.title}</h2>
              {section.description && (
                <p className="dp-print-sec-desc">{section.description}</p>
              )}
            </div>

            <div className="dp-print-questions-list">
              {section.questions.map((q) => (
                <div key={q.id} className="dp-print-q-block">
                  <h3 className="dp-print-q-title">
                    {q.question}
                    {q.tag && <span className="dp-print-q-tag">{q.tag}</span>}
                  </h3>
                  <div className="dp-print-ans">
                    {q.content.map((block, bIdx) => {
                      if (block.type === 'p') {
                        return <p key={bIdx}>{block.text}</p>;
                      }
                      if (block.type === 'ul') {
                        return (
                          <ul key={bIdx}>
                            {block.items.map((item, iIdx) => (
                              <li key={iIdx}>{item}</li>
                            ))}
                          </ul>
                        );
                      }
                      if (block.type === 'note') {
                        return (
                          <div key={bIdx} className="note">
                            {block.text}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DepositPrintDocument);
