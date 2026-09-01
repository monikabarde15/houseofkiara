import React, { useState } from 'react';
import { AgendaEntry } from '../../types';
import { agendaMockData } from './agendaMockData';
import AgendaFilterBar from './AgendaFilterBar';
import AgendaTable from './AgendaTable';
import '../../css/agenda/AgendaView.css';

const AgendaView: React.FC = () => {
  const [entries, setEntries] = useState<AgendaEntry[]>(agendaMockData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState('All Action Types');
  const [upcomingFilter, setUpcomingFilter] = useState('All Upcoming');

  const handleToggleRow = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleMarkDone = (id: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, done: true } : e)));

  const handleSaveNote = (id: string, note: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, savedNote: note } : e)));

  const handleNotifyCustomer = (id: string) => {
    // wire up to real notify action later
    console.log('Notify customer for', id);
  };

  return (
    <div className="agenda-view">
      <AgendaFilterBar
        actionType={actionType}
        onActionTypeChange={setActionType}
        upcomingFilter={upcomingFilter}
        onUpcomingFilterChange={setUpcomingFilter}
      />
      <AgendaTable
        entries={entries}
        expandedId={expandedId}
        onToggleRow={handleToggleRow}
        onMarkDone={handleMarkDone}
        onSaveNote={handleSaveNote}
        onNotifyCustomer={handleNotifyCustomer}
      />
    </div>
  );
};

export default AgendaView;