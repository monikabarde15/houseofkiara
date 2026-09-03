// messages/MessagesTable.tsx
import React from 'react';
import { MessagesRow } from './MessagesRow';
import { GroupHeading } from './GroupHeading';
import './styles/MessagesTable.css';
import { Message } from '../types/messaging.types';

interface MessagesTableProps {
  messages: Message[];
  onRowClick: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove?: (id: string) => void;
}

const GROUP_ORDER = [
  'Customer - Account',
  'Customer - Orders',
  'Customer - Returns',
  'Customer - Deposits',
  'Customer - Receivables',
  'Customer - Offers',
  'Customer - Keeping in touch',
  'Quick notes',
  'Lister',
  'Designer partners',
  'Your own desk',
];

// Map messages to their exact groups
const getGroupForMessage = (msg: Message): string => {
  const cleanId = String(msg.id || '').replace('msg_', '');
  const idNum = parseInt(cleanId, 10);
  
  if (!isNaN(idNum)) {
    if (idNum >= 1 && idNum <= 8) return 'Customer - Account';
    if (idNum >= 9 && idNum <= 16) return 'Customer - Orders';
    if (idNum >= 17 && idNum <= 23) return 'Customer - Returns';
    if (idNum >= 24 && idNum <= 29) return 'Customer - Deposits';
    if (idNum >= 30 && idNum <= 32) return 'Customer - Receivables';
    if (idNum >= 33 && idNum <= 39) return 'Customer - Offers';
    if (idNum >= 40 && idNum <= 46) return 'Customer - Keeping in touch';
    if (idNum >= 47 && idNum <= 50) return 'Quick notes';
    if (idNum >= 51 && idNum <= 66) return 'Lister';
    if (idNum >= 67 && idNum <= 68) return 'Designer partners';
    if (idNum >= 69 && idNum <= 75) return 'Your own desk';
  }

  // Audience fallback
  if (msg.audience === 'You') return 'Your own desk';
  if (msg.audience === 'Lister') return 'Lister';
  if (msg.audience === 'Designer') return 'Designer partners';
  if (msg.isYours) return 'Quick notes';
  
  const name = msg.name || '';
  if (name.includes('Welcome') || name.includes('Email') || name.includes('OTP') || name.includes('Password')) return 'Customer - Account';
  if (name.includes('Order') || name.includes('Dispatched') || name.includes('Delivered')) return 'Customer - Orders';
  if (name.includes('Return')) return 'Customer - Returns';
  if (name.includes('Deposit')) return 'Customer - Deposits';
  if (name.includes('Offer') || name.includes('Enquiry')) return 'Customer - Offers';
  return 'Customer - Keeping in touch';
};

export const MessagesTable: React.FC<MessagesTableProps> = ({ 
  messages, 
  onRowClick,
  onCopy,
  onRemove
}) => {
  // Group messages
  const groupedMessages: Record<string, Message[]> = {};
  messages.forEach((msg) => {
    const group = getGroupForMessage(msg);
    if (!groupedMessages[group]) {
      groupedMessages[group] = [];
    }
    groupedMessages[group].push(msg);
  });

  const sortedGroups = GROUP_ORDER.filter((g) => groupedMessages[g]);

  if (messages.length === 0) {
    return (
      <div className="msg-table-empty">
        Nothing matches. Clear the filters, or make a new message.
      </div>
    );
  }

  return (
    <div className="msg-table-wrapper">
      <table className="msg-table">
        <thead>
          <tr>
            <th>MESSAGE</th>
            <th>GOES TO</th>
            <th>SENT ON</th>
            <th>STATUS</th>
            <th>LAST EDITED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedGroups.map((group) => (
            <React.Fragment key={group}>
              <GroupHeading label={group} />
              {groupedMessages[group].map((msg) => (
                <MessagesRow
                  key={msg.id}
                  message={msg}
                  onRowClick={onRowClick}
                  onCopy={onCopy}
                  onRemove={onRemove}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};