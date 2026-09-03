import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AgendaEntry } from '../../types';
import AgendaFilterBar from './AgendaFilterBar';
import AgendaTable from './AgendaTable';
import '../../css/agenda/AgendaView.css';

interface AgendaViewProps {
  entries?: AgendaEntry[];
}

const AgendaView: React.FC<AgendaViewProps> = ({ entries: propEntries }) => {
  const [entries, setEntries] = useState<AgendaEntry[]>(propEntries || []);

  // Sync entries if props change
  React.useEffect(() => {
    if (propEntries) setEntries(propEntries);
  }, [propEntries]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState('All Action Types');
  const [upcomingFilter, setUpcomingFilter] = useState('All Upcoming');

  const filteredEntries = React.useMemo(() => {
    return entries.filter(entry => {
      // 1. Filter by Action Type
      if (actionType !== 'All Action Types') {
        const typeMap: Record<string, string> = {
          'Prep Dispatch': 'prep-dispatch',
          'Dispatched': 'dispatched',
          'Rental Starts': 'rental-starts',
          'Return Due': 'return-due',
          'Cleaning': 'cleaning'
        };
        if (entry.type !== typeMap[actionType] && entry.type !== actionType) return false;
      }

      // 2. Filter by Upcoming Date
      if (upcomingFilter !== 'All Upcoming') {
        const entryDate = new Date(entry.isoDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (upcomingFilter === 'Today') {
          if (entryDate.getTime() !== today.getTime()) return false;
        } else if (upcomingFilter === 'This Week') {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          if (entryDate < today || entryDate > nextWeek) return false;
        } else if (upcomingFilter === 'This Month') {
          if (entryDate.getMonth() !== today.getMonth() || entryDate.getFullYear() !== today.getFullYear()) return false;
        } else if (upcomingFilter === 'Overdue') {
          if (entryDate >= today || entry.done) return false;
        }
      }

      return true;
    });
  }, [entries, actionType, upcomingFilter]);

  const handleToggleRow = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleMarkDone = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, done: true } : e)));
    toast.success('Action marked as completed');
  };

  const handleSaveNote = (id: string, note: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, savedNote: note } : e)));
    toast.success('Note saved successfully');
  };

  const handleNotifyCustomer = (id: string) => {
    // wire up to real notify action later
    console.log('Notify customer for', id);
    toast.success('Customer notified successfully');
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
        entries={filteredEntries}
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