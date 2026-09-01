// src/components/LYP/components/LYPTableFooter.tsx

import React from 'react';
import './styles/LYPTableFooter.css';

interface LYPTableFooterProps {
  shownCount: number;
  totalCount: number;
  isFiltered: boolean;
  onShowAll: () => void;
}

export const LYPTableFooter: React.FC<LYPTableFooterProps> = ({
  shownCount,
  totalCount,
  isFiltered,
  onShowAll,
}) => {
  if (!isFiltered && shownCount === totalCount) {
    return null;
  }

  return (
    <div className="lyp-table-footer">
      <span>
        Showing {shownCount} of {totalCount} submissions
        {isFiltered && (
          <span className="qlnk" onClick={onShowAll}>
            {' '}· Show all
          </span>
        )}
      </span>
    </div>
  );
};