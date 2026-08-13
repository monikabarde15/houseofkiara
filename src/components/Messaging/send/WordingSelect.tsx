// send/WordingSelect.tsx
import React from 'react';
import { FormField } from '../components/FormField';
import './styles/WordingSelect.css';

interface Wording {
  id: string;
  name: string;
}

interface WordingSelectProps {
  wordings: Wording[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  hasRule?: boolean;
  hint?: string;
}

export const WordingSelect: React.FC<WordingSelectProps> = ({
  wordings,
  selectedId,
  onChange,
  hasRule = false,
  hint,
}) => {
  // Hide the field if there's only one wording
  if (wordings.length <= 1) {
    return null;
  }

  const options = hasRule
    ? [{ id: 'auto', label: 'Work it out for each one' }, ...wordings.map(w => ({ id: w.id, label: w.name }))]
    : wordings.map(w => ({ id: w.id, label: w.name }));

  const defaultHint = hasRule
    ? `This message has ${wordings.length} wordings. Left on the first option, each order gets the right one on its own.`
    : `This message has ${wordings.length} wordings and no rule for choosing between them, so pick the one you mean.`;

  return (
    <FormField
      label="Which wording"
      hint={hint || defaultHint}
    >
      <select
        className="msg-select"
        value={selectedId || (hasRule ? 'auto' : wordings[0]?.id || '')}
        onChange={(e) => onChange(e.target.value === 'auto' ? null : e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};