/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositWorkedExample (Spec § 8.13 Part 05, Screen 51)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';

interface ScenarioTab {
  id: string;
  label: string;
  lines: Array<{ label: string; amount: string; isNegative?: boolean; isZero?: boolean }>;
  totalLabel: string;
  totalAmount: string;
  isBalanceDue?: boolean;
  notes: React.ReactNode[];
}

interface DepositWorkedExampleProps {
  onSelectFigure?: (figureKey: string) => void;
}

export const DepositWorkedExample: React.FC<DepositWorkedExampleProps> = ({
  onSelectFigure
}) => {
  const [activeTabId, setActiveTabId] = useState<string>('returned-on-time');

  const tabs: ScenarioTab[] = [
    {
      id: 'returned-on-time',
      label: 'Returned on time',
      lines: [
        { label: 'Deposit in safekeeping', amount: '₹25,000' },
        { label: 'Late return', amount: 'Nothing', isZero: true },
        { label: 'Restoration', amount: 'Nothing', isZero: true }
      ],
      totalLabel: 'Returned to you',
      totalAmount: '₹25,000',
      isBalanceDue: false,
      notes: [
        <span>
          Returned within{' '}
          <button
            type="button"
            onClick={() => onSelectFigure?.('deposit_refund_window')}
            className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold cursor-pointer hover:bg-[#fef08a]"
          >
            3 to 5 business days
          </button>{' '}
          of inspection, to the account it came from.
        </span>,
        'Gentle signs of wear, and our professional care after every rental, are never charged to you.'
      ]
    },
    {
      id: 'one-day-late',
      label: 'One day late',
      lines: [
        { label: 'Deposit in safekeeping', amount: '₹25,000' },
        { label: 'Late return: 1 extra day at the daily rate', amount: '(₹2,500)', isNegative: true },
        { label: 'GST on the extra day at 18%', amount: '(₹450)', isNegative: true }
      ],
      totalLabel: 'Returned to you',
      totalAmount: '₹22,050',
      isBalanceDue: false,
      notes: [
        'You receive a GST invoice for the ₹2,950 charged for the extra day.',
        'Had the extra day been agreed before your Return Date, it would have cost exactly the same, so it is always worth asking.'
      ]
    },
    {
      id: 'stain-to-restore',
      label: 'A stain to restore',
      lines: [
        { label: 'Deposit in safekeeping', amount: '₹25,000' },
        { label: 'Specialist stain care and hand finishing', amount: '(₹3,200)', isNegative: true },
        { label: 'GST on restoration', amount: 'None', isZero: true }
      ],
      totalLabel: 'Returned to you',
      totalAmount: '₹21,800',
      isBalanceDue: false,
      notes: [
        <span>
          The ₹21,800 not in question is returned within{' '}
          <button
            type="button"
            onClick={() => onSelectFigure?.('deposit_refund_window')}
            className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold cursor-pointer hover:bg-[#fef08a]"
          >
            3 to 5 business days
          </button>{' '}
          of inspection. The ₹3,200 is settled only after you have had 2 business days to reply.
        </span>,
        'No GST applies, because this amount restores the piece rather than paying for anything you receive.'
      ]
    },
    {
      id: 'lost-or-not-returned',
      label: 'Lost or not returned',
      lines: [
        { label: 'Replacement Value of the bridal lehenga', amount: '₹1,80,000' },
        { label: 'Your deposit, applied towards it', amount: '(₹25,000)', isNegative: true },
        { label: 'GST on the balance', amount: 'None', isZero: true }
      ],
      totalLabel: 'Balance to be settled',
      totalAmount: '₹1,55,000',
      isBalanceDue: true,
      notes: [
        'Settled within 7 days of our written statement, once we have talked it through with you.',
        'The Replacement Value is shown in your booking summary before you pay, so it is never a surprise.'
      ]
    }
  ];

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="pt-2 pb-2">
      <div className="border-t border-dashed border-[#dcd7ce] pt-8 mb-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal">
          Your deposit, in <span className="italic text-[#935b1e]">practice</span>
        </h2>
        <p className="text-sm sm:text-[15px] text-[#57534e] mt-2.5 leading-relaxed">
          One piece, and four ways a rental can end. Here, a{' '}
          <span className="bg-[#f3eee7] text-[#44403c] border border-[#ded8cf] px-1.5 py-0.5 rounded font-mono text-xs">
            bridal lehenga
          </span>{' '}
          is rented for{' '}
          <span className="bg-[#f3eee7] text-[#44403c] border border-[#ded8cf] px-1.5 py-0.5 rounded font-mono text-xs">
            4 days
          </span>
          , with a daily rate of{' '}
          <span className="bg-[#f3eee7] text-[#44403c] border border-[#ded8cf] px-1.5 py-0.5 rounded font-mono text-xs">
            ₹2,500
          </span>
          , a deposit of{' '}
          <span className="bg-[#f3eee7] text-[#44403c] border border-[#ded8cf] px-1.5 py-0.5 rounded font-mono text-xs">
            ₹25,000
          </span>{' '}
          and a Replacement Value of{' '}
          <span className="bg-[#f3eee7] text-[#44403c] border border-[#ded8cf] px-1.5 py-0.5 rounded font-mono text-xs">
            ₹1,80,000
          </span>
          .
        </p>
      </div>

      {/* 4 Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'bg-white border border-[#ded8cf] text-[#44403c] hover:bg-[#faf8f5]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Statement Card */}
      <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#f1eee8] pb-3 mb-4">
          <span className="font-serif text-lg text-[#1c1917] font-medium">
            Deposit statement
          </span>
          <span className="text-xs font-mono text-[#a8a29e] tracking-wider uppercase">
            Example
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {currentTab.lines.map((line, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm py-1">
              <span className="text-[#57534e]">{line.label}</span>
              <span
                className={`font-medium ${
                  line.isZero
                    ? 'text-[#a8a29e] font-sans'
                    : line.isNegative
                    ? 'text-[#dc2626] font-mono'
                    : 'text-[#1c1917] font-mono'
                }`}
              >
                {line.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-baseline justify-between border-t border-[#f1eee8] pt-4 mb-6">
          <span className="font-medium text-base text-[#1c1917]">
            {currentTab.totalLabel}
          </span>
          <span
            className={`font-serif text-2xl font-bold ${
              currentTab.isBalanceDue ? 'text-[#b91c1c]' : 'text-[#2e7d32]'
            }`}
          >
            {currentTab.totalAmount}
          </span>
        </div>

        <div className="space-y-2.5 pt-2">
          {currentTab.notes.map((note, nIdx) => (
            <div
              key={nIdx}
              className="border-l-2 border-[#b8860b] pl-3 py-0.5 text-xs text-[#57534e] leading-relaxed"
            >
              {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepositWorkedExample;
