// send/SendReadBackCard.tsx
import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SendCardItem } from './SendCardItem';
import './styles/SendReadBackCard.css';

interface Person {
  id: string;
  name: string;
  contact: string;
}

interface SendReadBackCardProps {
  people: Person[];
  onSend: () => void;
  sending?: boolean;
  children?: React.ReactNode;
}

export const SendReadBackCard: React.FC<SendReadBackCardProps> = ({
  people,
  onSend,
  sending = false,
  children,
}) => {
  const isEmpty = people.length === 0;

  return (
    <Card
      header="3 - Read it back"
      headerSubtitle="One per person, exactly as it will arrive"
    >
      <div className="msg-send-readback-body">
        {isEmpty ? (
          <div className="msg-send-readback-empty">
            Choose the people on the left and their messages will appear here,
            each one filled in with their own details.
          </div>
        ) : (
          <div className="msg-send-readback-list">
            {children || people.map((person) => (
              <SendCardItem
                key={person.id}
                name={person.name}
                contact={person.contact}
                status="ready"
                body={`Dear ${person.name},\n\nThank you for choosing House of Kaira.`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="msg-send-readback-footer">
        <div className="msg-send-readback-footer-note">
          {isEmpty ? '' : `${people.length} people on WhatsApp - all on "Default"`}
        </div>
        <Button
          variant="primary"
          size="small"
          onClick={onSend}
          disabled={isEmpty || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </Card>
  );
};