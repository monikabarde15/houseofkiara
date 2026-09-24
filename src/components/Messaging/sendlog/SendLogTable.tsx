// sendlog/SendLogTable.tsx
import React from 'react';
import { Table, TableRow, TableCell } from '../components/Table';
import { SendLogRow } from './SendLogRow';
import './styles/SendLogTable.css';

export interface SendLogEntry {
  id: string;
  when: string;
  message: string;
  wording: string;
  who: string;
  whoType?: 'customer' | 'lister'; // present only when WHO should link to that record
  contact: string;
  channel: string;
  outcome: 'Delivered' | 'Opened' | 'Bounced' | 'Held' | 'Not sent' | 'Opened in WhatsApp';
  about: string;
  sentBy: string;
}
interface SendLogTableProps {
  logs: SendLogEntry[];
  onMessageClick: (id: string) => void;
  onPersonClick: (name: string) => void;
  onAboutClick: (about: string) => void;
  isLoading?: boolean;
}

const COLUMNS = [
  { key: 'when', header: 'WHEN' },
  { key: 'message', header: 'MESSAGE' },
  { key: 'who', header: 'WHO' },
  { key: 'channel', header: 'CHANNEL' },
  { key: 'outcome', header: 'OUTCOME' },
  { key: 'about', header: 'ABOUT' },
  { key: 'sentBy', header: 'SENT BY' },
];

export const SendLogTable: React.FC<SendLogTableProps> = ({
  logs,
  onMessageClick,
  onPersonClick,
  onAboutClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="msg-sendlog-loading">
        Loading sends...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="msg-sendlog-empty">
        Nothing matches these filters.
      </div>
    );
  }

  return (
    <div className="msg-sendlog-table-wrapper">
      <table className="msg-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <SendLogRow
              key={log.id}
              log={log}
              onMessageClick={onMessageClick}
              onPersonClick={onPersonClick}
              onAboutClick={onAboutClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};