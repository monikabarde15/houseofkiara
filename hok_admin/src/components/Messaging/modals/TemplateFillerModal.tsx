// modals/TemplateFillerModal.tsx
import React from 'react';
import { Button } from '../components/Button';
import './styles/TemplateFillerModal.css';

interface TemplateFillerModalProps {
  isOpen: boolean;
  documentName: string;
  words: Array<{ word: string; description: string }>;
  carriedBy: Array<{ message: string; canSupply: boolean; missingWords?: string[] }>;
  onClose: () => void;
}

export const TemplateFillerModal: React.FC<TemplateFillerModalProps> = ({
  isOpen,
  documentName,
  words,
  carriedBy,
  onClose,
}) => {
  if (!isOpen) return null;

  const allCanSupply = carriedBy.every(c => c.canSupply);

  return (
    <div className="msg-template-modal-overlay" onClick={onClose}>
      <div className="msg-template-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="msg-template-modal-header">
          <div className="msg-template-modal-title">{documentName}</div>
          <div className="msg-template-modal-subtitle">Filled in for each recipient</div>
        </div>

        <div className="msg-template-modal-body">
          <div className="msg-template-modal-explanation">
            The uploaded file is a template rather than a finished document. It merges the following words:
          </div>

          <div className="msg-template-modal-words">
            {words.map((w, i) => (
              <div key={i} className="msg-template-modal-word">
                <span className="msg-template-modal-word-name">{`{{${w.word}}}`}</span>
                <span className="msg-template-modal-word-desc">{w.description}</span>
              </div>
            ))}
          </div>

          <div className="msg-template-modal-messages">
            <div className="msg-template-modal-messages-label">Carried by:</div>
            {carriedBy.map((c, i) => (
              <div key={i} className="msg-template-modal-message">
                <span>{c.message}</span>
                {c.canSupply ? (
                  <span className="msg-template-modal-supply-ok">✓ Can supply all words</span>
                ) : (
                  <span className="msg-template-modal-supply-missing">
                    ✗ Cannot supply: {c.missingWords?.join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {!allCanSupply && (
            <div className="msg-template-modal-warning">
              <strong>Warning:</strong> Some messages cannot supply all words for this template.
              They will be held back until the words can be filled.
            </div>
          )}
        </div>

        <div className="msg-template-modal-close">
          <Button variant="secondary" size="small" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};