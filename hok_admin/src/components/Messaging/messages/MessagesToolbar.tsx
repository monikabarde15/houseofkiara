// messages/MessagesToolbar.tsx
import React from 'react';
import { Toolbar, SearchField, FilterSelect } from '../components/Toolbar';
import { Button } from '../components/Button';
import './styles/MessagesToolbar.css';

interface MessagesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  audience: string;
  onAudienceChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onExport: () => void;
  onNewMessage: () => void;
  loading?: boolean;
}

const AUDIENCE_OPTIONS = ['Everyone', 'Customer', 'Lister', 'You'];
const TYPE_OPTIONS = ['Required and optional', 'Required', 'Marketing'];
const STATUS_OPTIONS = ['Any status', 'Live', 'Paused', 'Not written'];

export const MessagesToolbar: React.FC<MessagesToolbarProps> = ({
  search,
  onSearchChange,
  audience,
  onAudienceChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  onExport,
  onNewMessage,
  loading = false,
}) => {
  return (
    <Toolbar className="msg-messages-toolbar">
      <SearchField
        placeholder="Search a message, or something it says..."
        value={search}
        onChange={onSearchChange}
        className="msg-messages-toolbar-search"
      />
      <FilterSelect
        options={AUDIENCE_OPTIONS}
        value={audience}
        onChange={onAudienceChange}
      />
      <FilterSelect
        options={TYPE_OPTIONS}
        value={type}
        onChange={onTypeChange}
      />
      <FilterSelect
        options={STATUS_OPTIONS}
        value={status}
        onChange={onStatusChange}
      />
      <Button variant="secondary" size="small" onClick={onExport}>
        Export CSV
      </Button>
      <Button
        variant="primary"
        size="small"
        onClick={onNewMessage}
        disabled={loading}
      >
        + New Message
      </Button>
    </Toolbar>
  );
};