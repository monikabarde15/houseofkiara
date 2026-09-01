// sendlog/SendLogToolbar.tsx
import React from 'react';
import { Toolbar, SearchField, FilterSelect } from '../components/Toolbar';
import { Button } from '../components/Button';
import './styles/SendLogToolbar.css';

interface SendLogToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  channel: string;
  onChannelChange: (value: string) => void;
  outcome: string;
  onOutcomeChange: (value: string) => void;
  onLogHandSent: () => void;
  onExport: () => void;
  loading?: boolean;
}

const CHANNEL_OPTIONS = ['All channels', 'Email', 'WhatsApp', 'Instagram', 'In Person', 'Website'];
const OUTCOME_OPTIONS = ['All outcomes', 'Delivered', 'Opened', 'Bounced', 'Held', 'Not sent'];

export const SendLogToolbar: React.FC<SendLogToolbarProps> = ({
  search,
  onSearchChange,
  channel,
  onChannelChange,
  outcome,
  onOutcomeChange,
  onLogHandSent,
  onExport,
  loading = false,
}) => {
  return (
    <Toolbar className="msg-sendlog-toolbar">
      <SearchField
       placeholder="Search a name, message or order…"
        value={search}
        onChange={onSearchChange}
        className="msg-sendlog-toolbar-search"
      />
      <FilterSelect
        options={CHANNEL_OPTIONS}
        value={channel}
        onChange={onChannelChange}
      />
      <FilterSelect
        options={OUTCOME_OPTIONS}
        value={outcome}
        onChange={onOutcomeChange}
      />
      <Button
        variant="secondary"
        size="small"
        onClick={onLogHandSent}
        disabled={loading}
      >
        + Log a message sent by hand
      </Button>
      <Button variant="secondary" size="small" onClick={onExport}>
        Export CSV
      </Button>
    </Toolbar>
  );
};