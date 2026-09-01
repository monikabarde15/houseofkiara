// src/components/LYP/components/StatCards.tsx

import React from 'react';
import { SubmissionStats } from '../types/submission.types';
import { inr, pluralize } from '../utils/formatter';
import './styles/StatCards.css';

interface StatCardsProps {
  stats: SubmissionStats;
  activeView: string | undefined;
  onViewChange: (view: 'review' | 'reply' | 'apprmonth' | 'slowfirst', label: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ 
  stats, 
  activeView, 
  onViewChange 
}) => {
  const currentMonth = new Date().toLocaleString('en', { month: 'short', year: 'numeric' });

  const cards = [
    {
      key: 'review',
      label: 'AWAITING REVIEW',
      value: stats.awaitingReview,
      sub: stats.awaitingReview > 0 
        ? `oldest ${stats.oldestHours}h of 48` 
        : 'the desk is clear',
      color: 'terra',
      view: 'review' as const,
      subClass: stats.oldestHours > 48 ? 'sc-sub-warning' : '',
    },
    {
      key: 'reply',
      label: 'AWAITING LISTER REPLY',
      value: stats.awaitingReply,
      sub: stats.awaitingReply > 0 
        ? `longest wait ${stats.longestWaitDays}d — nudge, then close as Expired` 
        : 'nothing pending on listers',
      color: 'gold',
      view: 'reply' as const,
    },
    {
      key: 'apprmonth',
      label: 'APPROVED THIS MONTH',
      value: stats.approvedThisMonth,
      sub: `decided · ${currentMonth}`,
      color: 'sage',
      view: 'apprmonth' as const,
    },
    {
      key: 'slowfirst',
      label: 'MEDIAN FIRST RESPONSE',
      value: stats.medianFirstResponse !== null ? `${Math.round(stats.medianFirstResponse)}h` : '—',
      sub: 'vs the 48-hour promise',
      color: stats.medianFirstResponse !== null && stats.medianFirstResponse > 48 ? 'terra' : 'sage',
      view: 'slowfirst' as const,
    },
  ];

  const isActive = (view: string) => activeView === view;

  return (
    <div className="sg">
      {cards.map((card) => (
        <div 
          key={card.key}
          className={`sc ${isActive(card.view) ? 'sc-on' : ''}`}
          onClick={() => onViewChange(card.view, card.label)}
          title="See exactly these records below"
        >
          <div className="sc-lbl">{card.label}</div>
          <div className={`sc-val sc-val-${card.color}`}>
            {card.value}
          </div>
          <div className={`sc-sub ${card.subClass || ''}`}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
};