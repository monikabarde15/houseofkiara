/* ========================================
   Promotions Module - Copy Code Modal
   Frozen terms copy dialog
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 8.3
   ======================================== */

import React from 'react';
import './styles/CopyCodeModal.css';
import { Button } from '../components/UI';

interface CopyCodeModalProps {
  isOpen: boolean;
  code: string;
  redemptions: number;
  changes: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const CopyCodeModal: React.FC<CopyCodeModalProps> = ({
  isOpen,
  code,
  redemptions,
  changes,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const changesList = changes.map(c => `• ${c}`).join('\n');

  return (
    <div className="copy-modal__overlay" onClick={onCancel}>
      <div className="copy-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="copy-modal__title">Create Copy Instead</h3>
        <div className="copy-modal__body">
          {code} has already been used on {redemptions} order{redemptions > 1 ? 's' : ''}, so its terms are frozen — rewriting them would leave those orders with a discount nothing explains.
          
          You changed:
          <div className="copy-modal__changes">
            {changesList}
          </div>
          
          House of Kaira can create an identical code carrying these changes, leaving {code} exactly as it was for the audit trail. You would then retire {code} so only one is live.
        </div>
        <div className="copy-modal__actions">
          <Button variant="secondary" size="small" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="small" onClick={onConfirm}>
            Create the new code
          </Button>
        </div>
      </div>
    </div>
  );
};