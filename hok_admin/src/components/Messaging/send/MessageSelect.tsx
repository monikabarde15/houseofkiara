// send/MessageSelect.tsx
import React from 'react';
import './styles/MessageSelect.css';

interface MessageOption {
  id: string;
  name: string;
  group: string;
  isOptional?: boolean;
  hasWording: boolean;
}

interface MessageSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: MessageOption[];
  hint?: string;
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

export const MessageSelect: React.FC<MessageSelectProps> = ({
  value,
  onChange,
  options,
  hint,
}) => {
  // Group options by group
  const grouped: Record<string, MessageOption[]> = {};
  options.forEach((opt) => {
    if (!grouped[opt.group]) {
      grouped[opt.group] = [];
    }
    grouped[opt.group].push(opt);
  });

  const sortedGroups = GROUP_ORDER.filter((g) => grouped[g]);

  return (
    <div className="msg-message-select">
      <select
        className="msg-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {sortedGroups.map((group) => (
          <optgroup key={group} label={group}>
            {grouped[group].map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}{opt.isOptional ? ' (optional)' : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {hint && <div className="msg-message-select-hint">{hint}</div>}
    </div>
  );
};