// send/SendMessageCard.tsx
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { MessageSelect } from './MessageSelect';
import { Chip } from '../components/Chip';
import './styles/SendMessageCard.css';
import { AboutSelect } from './AboutSelect';

// One selectable message (e.g. "Welcome Email", "Verify Email")
interface MessageOption {
  id: string;
  name: string;
  group: string;       // used to sort into optgroups AND to detect customer messages
  isOptional?: boolean;
  hasWording: boolean;
}

// One option for the "What it is about" dropdown (a designer, category, or exact piece)
interface AboutOption {
  id: string;
  label: string;
  group: string;
}

interface SendMessageCardProps {
  messageId: string;
  onMessageChange: (id: string) => void;
  messages: MessageOption[];
  promotionId: string | null;
  onPromotionChange: (id: string | null) => void;
  promotions: Array<{ id: string; code: string; description: string; endDate: string; limited?: string }>;
  channel: 'whatsapp' | 'email';
  onChannelChange: (channel: 'whatsapp' | 'email') => void;
  messageHint?: string;
  aboutOptions?: AboutOption[]; // designers/categories/pieces to populate "What it is about"
}

export const SendMessageCard: React.FC<SendMessageCardProps> = ({
  messageId,
  onMessageChange,
  messages,
  promotionId,
  onPromotionChange,
  promotions,
  channel,
  onChannelChange,
  messageHint = 'Carried over from the message you were on. Change it above if you meant something else.',
  aboutOptions = [],
}) => {
  // Tracks which designer/category/piece is selected in "What it is about"
  const [aboutId, setAboutId] = useState<string | null>(null);

  // Find the currently selected message object (so we know its group)
  const selectedMessage = messages.find((m) => m.id === messageId);

  // "What it is about" only shows when the selected message is addressed to a customer
  const isCustomerMessage = !!selectedMessage?.group?.startsWith('Customer');

  return (
    <Card header="1 · What to send">
      {/* MESSAGE field — grouped select, shows carry-over hint */}
      <FormField label="Message">
        <MessageSelect
          value={messageId}
          onChange={onMessageChange}
          options={messages}
          hint={messageHint}
        />
      </FormField>

      {/* ATTACH A PROMOTION field — plain select + static hint via FormField's own hint prop */}
      <FormField
        label="Attach a promotion"
        hint="Reads live codes from Promotions. Anyone a code does not cover, because it is private or first-order only, is set aside automatically rather than being sent something that fails at checkout."
      >
        <select
          className="msg-select"
          value={promotionId || ''}
          onChange={(e) => onPromotionChange(e.target.value || null)}
        >
          <option value="">No promotion</option>
          {promotions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} · {p.description} · until {p.endDate}
              {p.limited && ` · ${p.limited}`}
            </option>
          ))}
        </select>
      </FormField>

      {/* WHAT IT IS ABOUT field — only rendered when the message is addressed to a customer */}
      <AboutSelect
        visible={isCustomerMessage}
        options={aboutOptions}
        selectedId={aboutId}
        onChange={setAboutId}
      />

      {/* SEND ON field — WhatsApp / Email toggle chips */}
      <FormField label="Send on">
        <div className="msg-send-chips">
          <span
            className={`msg-chip msg-chip--wordgroup ${channel === 'whatsapp' ? 'msg-chip--selected' : ''}`}
            onClick={() => onChannelChange('whatsapp')}
          >
            WhatsApp
          </span>
          <span
            className={`msg-chip msg-chip--wordgroup ${channel === 'email' ? 'msg-chip--selected' : ''}`}
            onClick={() => onChannelChange('email')}
          >
            Email
          </span>
        </div>
      </FormField>
    </Card>
  );
};