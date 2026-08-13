// editor/AttachmentList.tsx
import React, { useState } from 'react';
import { Chip } from '../components/Chip';
import './styles/AttachmentList.css';

interface Document {
  id: string;
  name: string;
  tag?: 'required-by-law' | 'added-by-you';
  reason?: string;
  isTaxDocument?: boolean;
}

interface AttachmentListProps {
  documents: Document[];
  onToggleCrossOff?: (id: string, crossed: boolean) => void;
  onDocumentClick?: (id: string) => void;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  documents,
  onToggleCrossOff,
  onDocumentClick,
}) => {
  const [crossedOff, setCrossedOff] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    if (documents.find(d => d.id === id)?.isTaxDocument) {
      // Show alert - tax document cannot be crossed off
      return;
    }

    const newCrossed = new Set(crossedOff);
    if (newCrossed.has(id)) {
      newCrossed.delete(id);
    } else {
      newCrossed.add(id);
    }
    setCrossedOff(newCrossed);
    onToggleCrossOff?.(id, !newCrossed.has(id));
  };

  if (documents.length === 0) {
    return (
      <div className="msg-attachment-list-empty">
        Nothing. This message goes out on its own.
      </div>
    );
  }

  return (
    <div className="msg-attachment-list">
      {documents.map((doc) => {
        const isCrossed = crossedOff.has(doc.id);
        const isTax = doc.isTaxDocument;

        return (
          <div
            key={doc.id}
            className={`msg-attachment-list-row ${isCrossed ? 'msg-attachment-list-row--crossed' : ''}`}
          >
            <Chip
              variant="document"
              crossed={isCrossed}
              onClick={() => onDocumentClick?.(doc.id)}
            >
              {doc.name}
            </Chip>

            {doc.tag && (
              <span className={`msg-attachment-list-tag msg-attachment-list-tag--${doc.tag}`}>
                {doc.tag === 'required-by-law' ? 'required by law' : 'added by you'}
              </span>
            )}

            {doc.reason && (
              <span className="msg-attachment-list-reason">{doc.reason}</span>
            )}

            <button
              className={`msg-attachment-list-remove ${isTax ? 'msg-attachment-list-remove--locked' : ''}`}
              onClick={() => !isTax && handleToggle(doc.id)}
              disabled={isTax}
              title={isTax ? 'A tax document cannot be turned off' : undefined}
            >
              {isCrossed ? '○' : '×'}
            </button>
          </div>
        );
      })}
    </div>
  );
};