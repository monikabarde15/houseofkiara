import React from 'react';
import '../../css/agenda/AgendaFilterBar.css';

const ACTION_TYPES = ['All Action Types', 'Prep Dispatch', 'Dispatched', 'Rental Starts', 'Return Due', 'Cleaning'];
const UPCOMING_OPTIONS = ['All Upcoming', 'Today', 'This Week', 'This Month', 'Overdue'];

interface AgendaFilterBarProps {
  actionType: string;
  onActionTypeChange: (value: string) => void;
  upcomingFilter: string;
  onUpcomingFilterChange: (value: string) => void;
}

const AgendaFilterBar: React.FC<AgendaFilterBarProps> = ({
  actionType, onActionTypeChange, upcomingFilter, onUpcomingFilterChange,
}) => (
  <div className="agenda-filter-bar">
    <select
      className="agenda-filter-select"
      value={actionType}
      onChange={(e) => onActionTypeChange(e.target.value)}
    >
      {ACTION_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <select
      className="agenda-filter-select"
      value={upcomingFilter}
      onChange={(e) => onUpcomingFilterChange(e.target.value)}
    >
      {UPCOMING_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default AgendaFilterBar;