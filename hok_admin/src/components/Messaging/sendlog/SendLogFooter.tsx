// sendlog/SendLogFooter.tsx
import React from 'react';
import './styles/SendLogFooter.css';

interface SendLogFooterProps {
  count: number;
  total: number;
}

export const SendLogFooter: React.FC<SendLogFooterProps> = ({ count, total }) => {
  return (
    <div className="msg-sendlog-footer">
      <span className="msg-sendlog-footer-count">{count} of {total} sends</span>
      <span className="msg-sendlog-footer-hint">
        Every send also appears on that person's own record, so the customer and lister pages stay the one place to read a relationship.
      </span>
    </div>
  );
};