// src/components/LYP/components/LYPHeader.tsx

import React from 'react';
import './styles/LYPHeader.css';

interface LYPHeaderProps {
  onRecordSubmission: () => void;
  showIntake: boolean;
}

export const LYPHeader: React.FC<LYPHeaderProps> = ({ 
  onRecordSubmission, 
  showIntake 
}) => {
  return (
    <div className="lyp-header">
      <div className="lyp-header-left">
        <div className="mod-ey">Catalogue</div>
        <h1 className="mod-ttl">List Your Piece — Submissions</h1>
        <p className="mod-sub">
          The front door of supply. Every piece offered to House of Kaira - website form, WhatsApp, Instagram, In Person - reviewed against the 48-hour promise, priced in the open, and turned into a Draft the moment it earns a yes.
        </p>
      </div>
      {/* <div className="lyp-header-right">
        <button 
          className={`btn ${showIntake ? 'btn-gold' : 'btn-gold'} btn-sm`}
          onClick={onRecordSubmission}
        >
          {showIntake ? '− Close' : '+ Record submissiosssn'}
        </button>
      </div> */}
    </div>
  );
};