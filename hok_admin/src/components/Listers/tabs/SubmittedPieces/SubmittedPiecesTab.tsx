// src/components/Listers/tabs/SubmittedPieces/SubmittedPiecesTab.tsx

import React, { useState } from 'react';
import { Submission } from '../../types/lister.types';
import { SubmissionForm } from './SubmissionForm';
import { SubmissionCard } from './SubmissionCard';
import './styles/SubmittedPiecesTab.css';

interface SubmittedPiecesTabProps {
  submissions: Submission[];
  listerId: string;
  onUpdate: () => void;
  isCreateMode?: boolean;
}

export const SubmittedPiecesTab: React.FC<SubmittedPiecesTabProps> = ({
  submissions,
  listerId,
  onUpdate,
  isCreateMode = false,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const handleFormSuccess = () => {
    setShowForm(false);
    onUpdate();
  };

  return (
    <div className="submitted-pieces-tab">
      <div className="submitted-pieces-header">
        <p className="submitted-pieces-intro">
          Every piece this lister has put forward — the List Your Piece form, WhatsApp, Instagram, or a walk-in — with the story they told, what they asked, and where each piece stands now. Click a SUB-ID to open the full record in the Approvals queue.
        </p>
        <button 
          className="btn btn-sec btn-sm"
          onClick={() => setShowForm(!showForm)}
        >
          + Record submission (WhatsApp / walk-in)
        </button>
      </div>

      {showForm && (
        <SubmissionForm 
          listerId={listerId} 
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="submitted-pieces-list">
        {isCreateMode ? (
          <div className="empty-state-inline" style={{ marginTop: '16px', fontSize: '11px', color: '#8A7E72' }}>
            Submissions appear once the lister exists.
          </div>
        ) : submissions.length === 0 ? (
          <div className="empty-state-boxed">
            No submissions yet from this lister.
            <br />
            When a piece comes in over WhatsApp or a walk-in, record it above — it lands in the Approvals queue with a full record.
          </div>
        ) : (
          <>
            {submissions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((submission) => (
              <SubmissionCard 
                key={submission.subid} 
                submission={submission}
                listerId={listerId}
                onUpdate={onUpdate}
              />
            ))}
            {submissions.length > PAGE_SIZE && (
              <div className="pagination-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                <button 
                  className="btn btn-sec btn-sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span style={{ fontSize: '12px', color: '#8A7E72' }}>
                  Page {currentPage} of {Math.ceil(submissions.length / PAGE_SIZE)}
                </span>
                <button 
                  className="btn btn-sec btn-sm" 
                  disabled={currentPage === Math.ceil(submissions.length / PAGE_SIZE)}
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(submissions.length / PAGE_SIZE), p + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubmittedPiecesTab;