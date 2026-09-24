// send/PeopleRow.tsx
import React from 'react';
import { Pill } from '../components/Pill';
import './styles/PeopleRow.css';

interface Person {
  id: string;
  name: string;
  contact: string;
  summary: string;
  available: boolean;
  unavailableReason?: string;
}

interface PeopleRowProps {
  person: Person;
  selected: boolean;
  onToggle: () => void;
}

export const PeopleRow: React.FC<PeopleRowProps> = ({
  person,
  selected,
  onToggle,
}) => {
  const isUnavailable = !person.available;

  return (
    <div
      className={`msg-people-row ${selected ? 'msg-people-row--selected' : ''} ${isUnavailable ? 'msg-people-row--unavailable' : ''}`}
      onClick={isUnavailable ? undefined : onToggle}
    >
      <input
        type="checkbox"
        className="msg-people-checkbox"
        checked={selected}
        onChange={onToggle}
        disabled={isUnavailable}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="msg-people-info">
        <div className="msg-people-name">{person.name}</div>
        <div className="msg-people-summary">{person.summary}</div>
      </div>
      {isUnavailable && person.unavailableReason && (
        <Pill status="grey" className="msg-people-unavailable-reason">
          {person.unavailableReason}
        </Pill>
      )}
    </div>
  );
};