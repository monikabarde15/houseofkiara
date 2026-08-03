// src/components/Listers/components/ListersHeader.tsx

import React from 'react';
import './styles/ListersHeader.css';

interface ListersHeaderProps {
  onAddLister: () => void;
}

export const ListersHeader: React.FC<ListersHeaderProps> = ({ onAddLister }) => {
  return (
    <div className="listers-header">
      <div className="listers-header-left">
        <div className="listers-header-eyebrow">Catalogue</div>
        <h1 className="listers-header-title">Listers</h1>
        <p className="listers-header-sub">
          Everyone who has submitted pieces to rent or sell. Includes walk-ins, WhatsApp sign-ups, and direct team sign-ups – not just website form submissions.
        </p>
      </div>
      <div className="listers-header-right">
        <button className="btn btn-gold btn-sm" onClick={onAddLister}>
          + Add Lister Manually
        </button>
      </div>
    </div>
  );
};

export default ListersHeader;