// send/AboutSelect.tsx
import React from 'react';
import { FormField } from '../components/FormField';
import './styles/AboutSelect.css';

interface AboutOption {
  id: string;
  label: string;
  group: string;
}

interface AboutSelectProps {
  visible: boolean;
  options: AboutOption[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  hint?: string;
  fromPromotion?: boolean;
  promotionCode?: string;
}

export const AboutSelect: React.FC<AboutSelectProps> = ({
  visible,
  options,
  selectedId,
  onChange,
  hint,
  fromPromotion = false,
  promotionCode = '',
}) => {
  if (!visible) {
    return null;
  }

  const groups = [...new Set(options.map(o => o.group))];
  const defaultHint = fromPromotion
    ? `Set from the promotion, because ${promotionCode} only applies to this. Change it if you mean something else.`
    : selectedId
    ? 'Only people with a matching saved piece can be picked, and each message names her piece from it. Change it on any card below if she has more than one.'
    : 'Narrow it to one designer, one category or one exact piece, and each message names the piece she saved from it. Leave it open and each message names whatever she saved first.';

  return (
    <FormField
      label="What it is about"
      hint={hint || defaultHint}
    >
      <select
        className="msg-select"
        value={selectedId || ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Anything she has saved</option>
        {groups.map((group) => (
          <optgroup key={group} label={group}>
            {options.filter(o => o.group === group).map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </FormField>
  );
};