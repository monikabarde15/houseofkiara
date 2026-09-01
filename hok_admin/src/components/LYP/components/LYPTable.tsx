// src/components/LYP/components/LYPTable.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { LYPTableRow } from './LYPTableRow';
import './styles/LYPTable.css';

interface LYPTableProps {
  submissions: Submission[];
  loading: boolean;
  onRowClick: (submission: Submission) => void;
}

export const LYPTable: React.FC<LYPTableProps> = ({
  submissions,
  loading,
  onRowClick,
}) => {
  if (loading) {
    return (
      <div className="lyp-table-loading">
        Loading submissions...
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="lyp-table-empty">
        <div className="empty-state-boxed">
          No submissions match these filters. <span className="qlnk">Clear filters</span>
        </div>
      </div>
    );
  }

  return (
    <div className="twrap">
      <table className="dt">
        <thead>
          <tr>
            <th>Submission</th>
            <th>Piece</th>
            <th>Lister</th>
            <th>Intent</th>
            <th>Channel</th>
            <th>Status</th>
            <th className="lyp-table-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <LYPTableRow 
              key={submission.subid}
              submission={submission}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};