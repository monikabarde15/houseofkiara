// components/MessagingHeader.tsx
import React from 'react';
import './styles/MessagingHeader.css';

export const MessagingHeader: React.FC = () => {
  return (
    <header className="msg-header">
      <div className="msg-header-eyebrow">Growth</div>
      <h1 className="msg-header-title">Messaging</h1>
      <p className="msg-header-subtitle">
        Every message House of Kaira sends, in one place. Each message keeps its email wording, 
        its WhatsApp wording and its on/off switches together, so the two can never drift apart. 
        Pick a message, change the words, save.
      </p>
    </header>
  );
};