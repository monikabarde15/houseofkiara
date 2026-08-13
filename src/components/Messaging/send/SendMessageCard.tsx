// send/SendMessageCard.tsx
import React from 'react';
import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { MessageSelect } from './MessageSelect';
import { Chip } from '../components/Chip';
import './styles/SendMessageCard.css';

interface MessageOption {
  id: string;
  name: string;
  group: string;
  isOptional?: boolean;
  hasWording: boolean;
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
}) => {
  return (
    <Card header="1 - What to send">
      <FormField label="Message">
        <MessageSelect
          value={messageId}
          onChange={onMessageChange}
          options={messages}
          hint={messageHint}
        />
      </FormField>

      <FormField label="Attach a promotion">
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
        <div className="msg-send-promotion-hint">
          Reads live codes from Promotions. Anyone a code does not cover, because it is private or first-order only, is set aside automatically rather than being sent something that fails at checkout.
        </div>
      </FormField>

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