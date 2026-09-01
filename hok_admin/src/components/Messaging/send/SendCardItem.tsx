// send/SendCardItem.tsx (UPDATED)
import React from 'react';
import { Pill } from '../components/Pill';
import { AttachmentStrip } from '../editor/AttachmentStrip';
import './styles/SendCardItem.css';

interface SendCardItemProps {
  name: string;
  reference?: string;
  contact: string;
  status: 'ready' | 'standin' | 'held';
  wordingName?: string;
  subject?: string;
  body: string;
  attachments?: string[];
  pieces?: Array<{ id: string; name: string; designer: string; available: boolean }>;
  selectedPiece?: string;
  onPieceChange?: (pieceId: string) => void;
  onAttachmentToggle?: (doc: string, included: boolean) => void;
}

const STATUS_MAP = {
  'ready': { label: 'ready', status: 'green' as const },
  'standin': { label: 'using a stand-in', status: 'amber' as const },
  'held': { label: 'will be held back', status: 'terracotta' as const },
};

export const SendCardItem: React.FC<SendCardItemProps> = ({
  name,
  reference,
  contact,
  status,
  wordingName,
  subject,
  body,
  attachments = [],
  pieces = [],
  selectedPiece,
  onPieceChange,
  onAttachmentToggle,
}) => {
  const statusInfo = STATUS_MAP[status];

  return (
    <div className="msg-send-card-item">
      <div className="msg-send-card-header">
        <div className="msg-send-card-header-left">
          <div className="msg-send-card-name">
            {name}
            {reference && <span className="msg-send-card-ref"> · {reference}</span>}
          </div>
          <div className="msg-send-card-contact">{contact}</div>
        </div>
        <Pill status={statusInfo.status}>{statusInfo.label}</Pill>
      </div>

      {wordingName && (
        <div className="msg-send-card-wording">
          Wording <span className="msg-send-card-wording-name">{wordingName}</span>
        </div>
      )}

      {pieces.length > 0 && (
        <div className="msg-send-card-pieces">
          <span className="msg-send-card-pieces-label">About</span>
          <select
            className="msg-send-card-pieces-select"
            value={selectedPiece || pieces[0]?.id || ''}
            onChange={(e) => onPieceChange?.(e.target.value)}
          >
            {pieces.map((piece) => (
              <option key={piece.id} value={piece.id}>
                {piece.name} · {piece.designer}
                {!piece.available && ' (not available)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {subject && (
        <div className="msg-send-card-subject">{subject}</div>
      )}

      <div className="msg-send-card-body">
        {body}
      </div>

      {/* 
        UPDATED: Attachment strip only renders if there are attachments.
        Empty strip is not drawn - this is correct per the addendum.
        A Buy New dispatch carries no document of ours, and the first overdue notice carries none.
      */}
      {attachments.length > 0 && (
        <AttachmentStrip
          documents={attachments}
          showCrosses
          onDocumentToggle={onAttachmentToggle}
        />
      )}
    </div>
  );
};