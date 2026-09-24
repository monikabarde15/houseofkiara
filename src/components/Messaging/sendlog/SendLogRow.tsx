// sendlog/SendLogRow.tsx
import React from 'react';
import { Pill } from '../components/Pill';
import { TableRow, TableCell } from '../components/Table';
import { SendLogEntry } from './SendLogTable';
import './styles/SendLogRow.css';

interface SendLogRowProps {
  log: SendLogEntry;
  onMessageClick: (id: string) => void;
  onPersonClick: (name: string) => void;
  onAboutClick: (about: string) => void;
}
const OUTCOME_PILL_MAP = {
  'Delivered': 'blue' as const,
  'Opened': 'green' as const,
  'Bounced': 'terracotta' as const,
  'Held': 'amber' as const,
  'Not sent': 'grey' as const,
  'Opened in WhatsApp': 'grey' as const,
};
export const SendLogRow: React.FC<SendLogRowProps> = ({
  log,
  onMessageClick,
  onPersonClick,
  onAboutClick,
}) => {
  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMessageClick(log.id);
  };

  const handlePersonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPersonClick(log.who);
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAboutClick(log.about);
  };

  return (
    <TableRow className="msg-sendlog-row">
      <TableCell>{log.when}</TableCell>
      <TableCell>
        <span
          className="msg-sendlog-message-name"
          onClick={handleMessageClick}
        >
          {log.message}
        </span>
        {log.wording !== 'Default' && (
          <div className="msg-sendlog-wording">{log.wording}</div>
        )}
      </TableCell>
     <TableCell>
        {/* Only customer/lister sends get the clickable Gold link — anything else is plain text */}
        {log.whoType ? (
          <span className="msg-sendlog-who msg-sendlog-who--link" onClick={handlePersonClick}>
            {log.who}
          </span>
        ) : (
          <span className="msg-sendlog-who">{log.who}</span>
        )}
        <div className="msg-sendlog-contact">{log.contact}</div>
      </TableCell>
      
      <TableCell>{log.channel}</TableCell>
      <TableCell>
        <Pill status={OUTCOME_PILL_MAP[log.outcome]}>
          {log.outcome}
        </Pill>
      </TableCell>
      <TableCell>
        <span
          className="msg-sendlog-about"
          onClick={handleAboutClick}
        >
          {log.about}
        </span>
      </TableCell>
      <TableCell>{log.sentBy}</TableCell>
    </TableRow>
  );
};