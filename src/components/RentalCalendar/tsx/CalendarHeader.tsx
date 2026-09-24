import React from 'react';
import { CalendarViewMode } from '../types';
import '../css/CalendarHeader.css';

interface CalendarHeaderProps {
  monthLabel: string;
  viewMode: CalendarViewMode;
  demoDate: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onDemoDateChange: (date: string) => void;
  onAddTask: () => void;
  onExport: () => void;
}

const VIEW_MODES: { key: CalendarViewMode; label: string }[] = [
  { key: 'month', label: 'Month' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'gantt', label: 'Gantt' },
];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthLabel,
  viewMode,
  demoDate,
  onPrevMonth,
  onNextMonth,
  onViewModeChange,
  onDemoDateChange,
  onAddTask,
  onExport,
}) => {
  return (
    <div className="calendar-header">
      <div className="calendar-header__nav">
        <button type="button" className="calendar-header__arrow" onClick={onPrevMonth} aria-label="Previous month">
          ←
        </button>
        <span className="calendar-header__month">{monthLabel}</span>
        <button type="button" className="calendar-header__arrow" onClick={onNextMonth} aria-label="Next month">
          →
        </button>

        <div className="calendar-header__view-toggle" role="tablist" aria-label="Calendar view">
          {VIEW_MODES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={viewMode === key}
              className={`calendar-header__view-btn${viewMode === key ? ' calendar-header__view-btn--active' : ''}`}
              onClick={() => onViewModeChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-header__actions">
        <label className="calendar-header__demo-date">
          Demo date:
          <input
            type="text"
            value={demoDate}
            onChange={(e) => onDemoDateChange(e.target.value)}
          />
        </label>
        <span className="calendar-header__hint">→ move to see colours change</span>

        <button type="button" className="calendar-header__btn" onClick={onAddTask}>
          + Add Task
        </button>
        <button type="button" className="calendar-header__btn" onClick={onExport}>
          Export
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;