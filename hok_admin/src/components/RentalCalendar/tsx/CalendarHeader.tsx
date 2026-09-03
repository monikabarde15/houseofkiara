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

      <div className="calendar-header__actions flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-stone-500">Demo date:</span>
          <div className="relative">
            <input
              type="date"
              value={demoDate.includes('/') ? demoDate.split('/').reverse().join('-') : demoDate}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                if (parts.length === 3) {
                  onDemoDateChange(`${parts[2]}/${parts[1]}/${parts[0]}`);
                } else {
                  onDemoDateChange(e.target.value);
                }
              }}
              className="pl-3 pr-2 py-1.5 border border-stone-200 rounded text-xs text-stone-700 focus:outline-none focus:border-[#C7A55C] w-[130px] font-medium"
            />
          </div>
        </div>
        
        <span className="text-[10px] italic text-stone-400 whitespace-nowrap hidden lg:inline-block">→ move to see colours change</span>

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