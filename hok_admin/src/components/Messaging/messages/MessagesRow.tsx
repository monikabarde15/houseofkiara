// messages/MessagesRow.tsx (UPDATED)
import React from 'react';
import { Pill } from '../components/Pill';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { Message } from '../types/messaging.types';
import './styles/MessagesRow.css';

interface MessagesRowProps {
  message: Message;
  onRowClick: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove?: (id: string) => void;
}

const STATUS_PILL_MAP = {
  'Live': 'green' as const,
  'Paused': 'amber' as const,
  'Not written': 'grey' as const,
  'Delivered': 'blue' as const,
  'Bounced': 'terracotta' as const,
};

const CHANNEL_LABELS = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  website: 'Website',
};

export const MessagesRow: React.FC<MessagesRowProps> = ({ 
  message, 
  onRowClick, 
  onCopy,
  onRemove 
}) => {
  const handleRowClick = () => {
    onRowClick(message.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRowClick(message.id);
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(message.id);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(message.id);
    }
  };

  return (
    <tr className="msg-row" onClick={handleRowClick}>
      <td>
        <div className="msg-row-message-container">
          <div className="msg-row-message-name-line">
            <span className="msg-row-message-name">{message.name}</span>
            {message.wordingCount > 1 && (
              <span className="msg-row-wording-count"> · {message.wordingCount} wordings</span>
            )}
            {message.isYours && (
              <Pill status="blue" className="msg-row-yours-pill">Yours</Pill>
            )}
          </div>
          <div className="msg-row-trigger">{message.trigger}</div>
          {message.subject && (
            <div className="msg-row-subject">{message.subject}</div>
          )}
        </div>
      </td>
      <td>
        <div className="msg-row-audience">{message.audience}</div>
        <Pill type="class" status={message.class === 'Required' ? 'green' : 'amber'}>
          {message.class}
        </Pill>
      </td>
      <td className="msg-row-channels">
        <Chip variant="channel" active={message.channels.includes('email')}>
          Email
        </Chip>
        <Chip variant="channel" active={message.channels.includes('whatsapp')}>
          WhatsApp
        </Chip>
        <Chip variant="channel" active={message.channels.includes('website')}>
          Website
        </Chip>
      </td>
      <td>
        <Pill status={STATUS_PILL_MAP[message.status]}>
          {message.status}
        </Pill>
      </td>
      <td>
        <div className="msg-row-date">{message.lastEdited}</div>
        <div className="msg-row-editor">{message.editor}</div>
      </td>
      <td className="msg-row-actions">
        <Button variant="secondary" size="small" onClick={handleEditClick}>
          {message.status === 'Not written' ? 'Write' : 'Edit'}
        </Button>
        <Button variant="secondary" size="small" onClick={(e) => { e.stopPropagation(); alert(`Manual sending for "${message.name}" triggered.`); }}>
          Send
        </Button>
        <Button variant="secondary" size="small" onClick={handleCopyClick}>
          Copy
        </Button>
        {onRemove && message.isYours && (
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleRemoveClick}
            className="msg-row-remove-btn"
          >
            Remove
          </Button>
        )}
      </td>
    </tr>
  );
};