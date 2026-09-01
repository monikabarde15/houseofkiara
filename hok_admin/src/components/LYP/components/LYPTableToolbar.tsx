// src/components/LYP/components/LYPTableToolbar.tsx

import React from 'react';
import { SubmissionFilters, Intent, Channel } from '../types/submission.types';
import { CHANNELS, INTENTS } from '../utils/constants';
import './styles/LYPTableToolbar.css';

interface LYPTableToolbarProps {
  filters: SubmissionFilters;
  onFilterChange: (filters: Partial<SubmissionFilters>) => void;
  viewLabel: string;
  onClearView: () => void;
  onExport: () => void;
  onRecordSubmission: () => void;
}

const STATUS_OPTIONS = [
  'All Statuses',
  'New',
  'In Review',
  'Awaiting Reply',
  'Approved',
  'Rejected',
  'Withdrawn',
  'Expired'
];

export const LYPTableToolbar: React.FC<LYPTableToolbarProps> = ({
  filters,
  onFilterChange,
  viewLabel,
  onClearView,
  onExport,
  onRecordSubmission,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value === 'All Statuses' ? '' : e.target.value });
  };

  const handleIntentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ intent: e.target.value as Intent || undefined });
  };

  const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ channel: e.target.value as Channel || undefined });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ dateFrom: e.target.value });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ dateTo: e.target.value });
  };

  return (
    <div className="tbar">
      <div className="tsrch">
        <svg viewBox="0 0 24 24" width="11" height="11">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <input
          type="text"
          placeholder="Search SUB-ID, lister, piece, designer, phone..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
      </div>

      <select className="tf" value={filters.status || 'All Statuses'} onChange={handleStatusChange}>
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select className="tf" value={filters.intent || ''} onChange={handleIntentChange}>
        <option value="">All Intent</option>
        {INTENTS.map(i => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>

      <select className="tf" value={filters.channel || ''} onChange={handleChannelChange}>
        <option value="">All Channels</option>
        {CHANNELS.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <input 
        type="date" 
        className="tf" 
        value={filters.dateFrom || ''} 
        onChange={handleDateFromChange}
        title="Submitted from"
      />
      <input 
        type="date" 
        className="tf" 
        value={filters.dateTo || ''} 
        onChange={handleDateToChange}
        title="Submitted to"
      />

      {viewLabel && (
        <span className="view-chip" onClick={onClearView} title="Back to the full list">
          Viewing: <strong>{viewLabel}</strong> · Show all ×
        </span>
      )}

      <div style={{ flex: 1 }} />

      <button className="btn btn-sec btn-sm" onClick={onExport}>
        Export CSV
      </button>
      <button className="btn btn-gold btn-sm" onClick={onRecordSubmission}>
        + Record submission
      </button>
    </div>
  );
};