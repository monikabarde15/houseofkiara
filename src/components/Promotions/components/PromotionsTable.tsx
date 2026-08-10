/* ========================================
   Promotions Module - Table
   Main table with rows
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.9
   ======================================== */

import React, { useState } from 'react';
import './styles/PromotionsTable.css';
import { PromoCode, DerivedPromoState } from '../types/promotions.types';
import { PromotionsTableRow } from './PromotionsTableRow';
import { PromotionsTableToolbar } from './PromotionsTableToolbar';
import { PromotionsTableFooter } from './PromotionsTableFooter';
import { getAttentionFlags } from '../utils/derived';

interface PromotionsTableProps {
  codes: PromoCode[];
  loading: boolean;
  getRedemptions: (code: PromoCode) => number;
  getDerivedState: (code: PromoCode) => DerivedPromoState;
  onRowClick: (codeId: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onExport: () => void;
  snapshotFilter: string | null;
  onSnapshotClear: () => void;
}

export const PromotionsTable: React.FC<PromotionsTableProps> = ({
  codes,
  loading,
  getRedemptions,
  getDerivedState,
  onRowClick,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
  snapshotFilter,
  onSnapshotClear,
}) => {
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedCodes(new Set(codes.map(c => c.code)));
    } else {
      setSelectedCodes(new Set());
    }
  };

  const handleSelect = (code: string, selected: boolean) => {
    const newSelected = new Set(selectedCodes);
    if (selected) {
      newSelected.add(code);
    } else {
      newSelected.delete(code);
    }
    setSelectedCodes(newSelected);
    setSelectAll(newSelected.size === codes.length && codes.length > 0);
  };

  const handleBulkPause = () => {
    // Bulk pause logic
    console.log('Pausing:', Array.from(selectedCodes));
  };

  const handleBulkResume = () => {
    // Bulk resume logic
    console.log('Resuming:', Array.from(selectedCodes));
  };

  const handleBulkClear = () => {
    setSelectedCodes(new Set());
    setSelectAll(false);
  };

  const showBulkBar = selectedCodes.size > 0;
  const allSelected = codes.length > 0 && selectedCodes.size === codes.length;

  if (loading) {
    return <div className="table-loading">Loading codes...</div>;
  }

  if (codes.length === 0) {
    return (
      <div className="table-empty">
        {search ? (
          <>No code matches "{search}". <button className="table-empty__link" onClick={() => onSearchChange('')}>Clear the search →</button></>
        ) : statusFilter !== 'All Statuses' ? (
          <>No promo codes match this filter.</>
        ) : snapshotFilter ? (
          <>No codes have been redeemed yet. <button className="table-empty__link" onClick={onSnapshotClear}>Show all →</button></>
        ) : (
          <>No promo codes yet. <button className="table-empty__link">Create the first one →</button></>
        )}
      </div>
    );
  }

  return (
    <div className="table-container">
      <PromotionsTableToolbar
        search={search}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        onExport={onExport}
        selectedCount={selectedCodes.size}
        onBulkPause={handleBulkPause}
        onBulkResume={handleBulkResume}
        onBulkClear={handleBulkClear}
        showBulkBar={showBulkBar}
      />

      {snapshotFilter && (
        <div className="table-snapshot-summary">
          <span className="table-snapshot-summary__text">
            <strong>Showing codes that have been redeemed</strong> — most-used first — {codes.length} of {codes.length} codes
          </span>
          <button className="table-snapshot-summary__clear" onClick={onSnapshotClear}>
            Show all ×
          </button>
        </div>
      )}

      <div className="table-scroll">
        <table className="table">
          <thead className="table__head">
            <tr>
              <th className="table__th table__th--checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="table__th table__th--sortable">Code & Offer</th>
              <th className="table__th">Audience</th>
              <th className="table__th table__th--sortable">Used</th>
              <th className="table__th table__th--sortable">Window</th>
              <th className="table__th table__th--sortable">Status</th>
              <th className="table__th">Attention</th>
              <th className="table__th table__th--action">Action</th>
            </tr>
          </thead>
          <tbody className="table__body">
            {codes.map(code => {
              const redemptions = getRedemptions(code);
              const state = getDerivedState(code);
              const flags = getAttentionFlags(code, redemptions, 100, code.createdOn);
              
              return (
                <PromotionsTableRow
                  key={code.code}
                  code={code}
                  derivedState={state}
                  redemptions={redemptions}
                  flags={flags}
                  selected={selectedCodes.has(code.code)}
                  onSelect={handleSelect}
                  onClick={onRowClick}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <PromotionsTableFooter
        count={codes.length}
        filterText={statusFilter !== 'All Statuses' ? ` - ${statusFilter}` : ''}
      />
    </div>
  );
};