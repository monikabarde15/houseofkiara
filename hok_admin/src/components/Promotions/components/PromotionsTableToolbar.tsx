/* ========================================
   Promotions Module - Table Toolbar
   Search, status filter, Export CSV, bulk bar
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.9
   ======================================== */

import React, { useState } from 'react';
import './styles/PromotionsTableToolbar.css';
import { Button } from './UI';
import { Search } from 'lucide-react';


interface PromotionsTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onExport: () => void;
  selectedCount: number;
  onBulkPause: () => void;
  onBulkResume: () => void;
  onBulkClear: () => void;
  showBulkBar: boolean;
}

const statusOptions = [
  'All Statuses',
  'Active',
  'Scheduled',
  'Paused',
  'Fully redeemed',
  'Expired',
];

export const PromotionsTableToolbar: React.FC<PromotionsTableToolbarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
  selectedCount,
  onBulkPause,
  onBulkResume,
  onBulkClear,
  showBulkBar,
}) => {
  return (
    <div className="table-toolbar">
      <div className="table-toolbar__top">
        <div className="table-toolbar__search">
          <span className="table-toolbar__search-icon"><Search /></span>
          <input
            type="text"
            className="table-toolbar__search-input"
            placeholder="Search codes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className="table-toolbar__filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <Button variant="secondary" size="small" onClick={onExport}>
          Export CSV
        </Button>
      </div>

      {showBulkBar && (
        <div className="table-toolbar__bulk">
          <span className="table-toolbar__bulk-count">{selectedCount} selected</span>
          <Button variant="secondary" size="small" onClick={onBulkPause}>
            Pause
          </Button>
          <Button variant="secondary" size="small" onClick={onBulkResume}>
            Resume
          </Button>
          <button className="table-toolbar__bulk-clear" onClick={onBulkClear}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
};