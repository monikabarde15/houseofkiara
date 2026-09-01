// editor/AttachmentStrip.tsx
import React, { useState } from 'react';
import './styles/AttachmentStrip.css';

interface AttachmentStripProps {
  documents: string[];
  onDocumentClick?: (doc: string) => void;
  onDocumentToggle?: (doc: string, included: boolean) => void;
  showCrosses?: boolean;
}

export const AttachmentStrip: React.FC<AttachmentStripProps> = ({
  documents,
  onDocumentClick,
  onDocumentToggle,
  showCrosses = false,
}) => {
  const [crossedOff, setCrossedOff] = useState<Set<string>>(new Set());

  if (!documents || documents.length === 0) {
    return null;
  }

  const handleToggle = (doc: string) => {
    const newCrossed = new Set(crossedOff);
    if (newCrossed.has(doc)) {
      newCrossed.delete(doc);
    } else {
      newCrossed.add(doc);
    }
    setCrossedOff(newCrossed);
    if (onDocumentToggle) {
      onDocumentToggle(doc, !newCrossed.has(doc));
    }
  };

  return (
    <div className="msg-attachment-strip">
      <svg className="msg-attachment-strip-icon" viewBox="0 0 12 12" fill="none" stroke="#8B6A1E" strokeWidth="2">
        <path d="M1 6.5L5 10.5L11 2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {documents.map((doc) => {
        const isCrossed = crossedOff.has(doc);
        return (
          <div
            key={doc}
            className={`msg-attachment-doc ${isCrossed ? 'msg-attachment-doc--crossed' : ''}`}
            onClick={() => onDocumentClick?.(doc)}
            title={doc}
          >
            {doc}
            {showCrosses && (
              <button
                className="msg-attachment-cross"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(doc);
                }}
                title={isCrossed ? 'Put it back' : 'Do not send this one'}
              >
                {isCrossed ? '○' : '×'}
              </button>
            )}
          </div>
        );
      })}
      <span className="msg-attachment-strip-tag">click to see it</span>
    </div>
  );
};