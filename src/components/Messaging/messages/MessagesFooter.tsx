// messages/MessagesFooter.tsx
import React from 'react';
import './styles/MessagesFooter.css';

interface MessagesFooterProps {
  count: number;
  total: number;
}

export const MessagesFooter: React.FC<MessagesFooterProps> = ({ count, total }) => {
  return (
    <div className="msg-footer">
      <span className="msg-footer-count">{count} of {total} messages</span>
      <span className="msg-footer-hint">Click any row to change what it says.</span>
    </div>
  );
};