// send/PeopleList.tsx
import React, { useState } from 'react';
import { PeopleRow } from './PeopleRow';
import './styles/PeopleList.css';

interface Person {
  id: string;
  name: string;
  contact: string;
  summary: string;
  available: boolean;
  unavailableReason?: string;
}

interface PeopleListProps {
  people: Person[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  searchPlaceholder?: string;
}

export const PeopleList: React.FC<PeopleListProps> = ({
  people,
  selectedIds,
  onToggle,
  searchPlaceholder = 'Search...',
}) => {
  const [search, setSearch] = useState('');

  const filtered = people.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.contact || '').toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="msg-people-list">
        <div className="msg-people-search">
          <input
            type="text"
            className="msg-people-search-input"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="msg-people-empty">
          Nothing here matches. Try another list, or a different message.
        </div>
      </div>
    );
  }

  return (
    <div className="msg-people-list">
      <div className="msg-people-search">
        <input
          type="text"
          className="msg-people-search-input"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="msg-people-list-container">
        {filtered.map((person) => (
          <PeopleRow
            key={person.id}
            person={person}
            selected={selectedIds.includes(person.id)}
            onToggle={() => onToggle(person.id)}
          />
        ))}
      </div>
    </div>
  );
};