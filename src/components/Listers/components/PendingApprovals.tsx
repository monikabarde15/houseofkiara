// src/components/Listers/components/PendingApprovals.tsx

import React, { useState, useEffect } from 'react';
import  useListers  from '../hooks/useListers';
import  {ApplicantCard}  from './ApplicantCard';
import { Lister } from '../types/lister.types';
import './styles/PendingApprovals.css';

interface PendingApprovalsProps {
  limit?: number;
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({ limit = 5 }) => {
  const { listers, loading } = useListers({ status: 'Pending Review' });
  const [showAll, setShowAll] = useState(false);

  const pendingListers = listers.filter(l => l.status === 'Pending Review');
  const displayListers = showAll ? pendingListers : pendingListers.slice(0, limit);
  const count = pendingListers.length;

  if (loading) {
    return (
      <div className="pending-approvals-card card">
        <div className="pending-approvals-loading">Loading applications...</div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="pending-approvals-card card">
        <div className="pending-approvals-empty">
          No lister applications waiting – the List Your Piece queue is clear.
        </div>
      </div>
    );
  }

  return (
    <div className="pending-approvals-card card">
      <div className="card-hd">
        <div className="pending-approvals-header-left">
          <span className="card-title">Pending Approvals</span>
        </div>
        <div className="pending-approvals-header-right">
          <span className="s-pend pending-approvals-badge">
            {count} awaiting
          </span>
        </div>
      </div>
      <div className="card-bd">
        {displayListers.map((lister, index) => (
          <ApplicantCard key={lister.id} lister={lister} />
        ))}
        {count > limit && !showAll && (
          <button 
            className="pending-approvals-show-more"
            onClick={() => setShowAll(true)}
          >
            Show all {count} applications
          </button>
        )}
        {showAll && count > limit && (
          <button 
            className="pending-approvals-show-less"
            onClick={() => setShowAll(false)}
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;