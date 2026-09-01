// editor/WordGroupChips.tsx
import React, { useState } from 'react';
import './styles/WordGroupChips.css';

const WORD_GROUPS = [
  'global', 'customer', 'order', 'item', 'rental', 'deposit', 'shipping',
  'customfit', 'lister', 'payout', 'offer', 'auth', 'receivable', 
  'internal', 'designer', 'promo'
];

interface WordGroupChipsProps {
  onChange?: (selected: string[]) => void;
}

export const WordGroupChips: React.FC<WordGroupChipsProps> = ({ onChange }) => {
  const [selected, setSelected] = useState<string[]>(['global', 'customer']);

  const toggleGroup = (group: string) => {
    const newSelected = selected.includes(group)
      ? selected.filter(g => g !== group)
      : [...selected, group];
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <div className="msg-wordgroup-chips">
      <div className="msg-wordgroup-chips-label">Word-groups this message may use</div>
      <div className="msg-wordgroup-chips-box">
        {WORD_GROUPS.map((group) => (
          <div
            key={group}
            className={`msg-wordgroup-chip ${selected.includes(group) ? 'msg-wordgroup-chip--selected' : ''}`}
            onClick={() => toggleGroup(group)}
          >
            <input
              type="checkbox"
              checked={selected.includes(group)}
              onChange={() => {}}
              onClick={(e) => e.stopPropagation()}
            />
            {group}
          </div>
        ))}
      </div>
      <div className="msg-wordgroup-chips-hint">
        Tick a group and its words become available below. Untick one and any word from it has to come out of the wording first.
      </div>
    </div>
  );
};