/* ========================================
   Promotions Module - Confirm Modal
   Reusable confirm dialog
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 8.3
   ======================================== */

import React from 'react';
import './styles/ConfirmModal.css';
import { Button } from '../components/UI';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal__overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal__title">{title}</h3>
        <div className="confirm-modal__body">{message}</div>
        <div className="confirm-modal__actions">
          <Button variant="secondary" size="small" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button 
            variant={isDestructive ? 'secondary' : 'primary'} 
            size="small" 
            onClick={onConfirm}
            style={isDestructive ? { borderColor: 'var(--promo-terra)', color: 'var(--promo-terra)' } : {}}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};