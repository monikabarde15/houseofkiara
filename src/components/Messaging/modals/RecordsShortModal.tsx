// modals/RecordsShortModal.tsx
import React from 'react';
import { Button } from '../components/Button';
import './styles/RecordsShortModal.css';

interface RecordsShortModalProps {
  isOpen: boolean;
  word: string;
  description: string;
  section: string;
  usedBy: string[];
  recordsShort: Array<{ id: string; name: string; status: string }>;
  totalShort: number;
  onClose: () => void;
}

export const RecordsShortModal: React.FC<RecordsShortModalProps> = ({
  isOpen,
  word,
  description,
  section,
  usedBy,
  recordsShort,
  totalShort,
  onClose,
}) => {
  if (!isOpen) return null;

  const displayRecords = recordsShort.slice(0, 14);
  const hasMore = recordsShort.length > 14;

  return (
    <div className="msg-records-modal-overlay" onClick={onClose}>
      <div className="msg-records-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="msg-records-modal-header">
          <div className="msg-records-modal-word">{`{{${word}}}`}</div>
          <div className="msg-records-modal-desc">{description}</div>
          <div className="msg-records-modal-section">
            Kept in <span className="msg-records-modal-link">{section}</span>
          </div>
        </div>

        <div className="msg-records-modal-body">
          <div className="msg-records-modal-used-by">
            <div className="msg-records-modal-label">Used by:</div>
            {usedBy.map((msg, i) => (
              <span key={i} className="msg-records-modal-message">{msg}</span>
            ))}
          </div>

          <div className="msg-records-modal-count">
            {totalShort} record{totalShort > 1 ? 's' : ''} cannot fill this word
          </div>

          <div className="msg-records-modal-caution">
            <strong>Caution:</strong> a needed word is often empty simply because that stage has not happened yet,
            and a tracking number empty on a piece that has not shipped is correct rather than missing
          </div>

          <div className="msg-records-modal-list">
            {displayRecords.map((record) => (
              <div key={record.id} className="msg-records-modal-record">
                <span className="msg-records-modal-record-name">{record.name}</span>
                <span className="msg-records-modal-record-status">{record.status}</span>
              </div>
            ))}
            {hasMore && (
              <div className="msg-records-modal-more">
                and {recordsShort.length - 14} more
              </div>
            )}
            {recordsShort.length === 0 && (
              <div className="msg-records-modal-none">
                No records are short of this word.
              </div>
            )}
          </div>
        </div>

        <div className="msg-records-modal-close">
          <Button variant="secondary" size="small" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};