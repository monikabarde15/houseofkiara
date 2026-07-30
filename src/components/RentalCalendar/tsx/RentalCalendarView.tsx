import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarLegend from './CalendarLegend';
import Sidebar from './Sidebar';
import { CalendarEvent, CalendarViewMode, DispatchCard } from '../types';
import { mockDispatches, mockEvents } from '../mockdata';
import '../css/RentalCalendarView.css';
import AgendaView from './agenda/AgendaView';
import GanttView from './gantt/GanttView';

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

interface RentalCalendarViewProps {
  /** Swap these for real API data once wired up. */
  events?: CalendarEvent[];
  dispatches?: DispatchCard[];
  onSaveChanges?: () => void;
  onViewLiveSite?: () => void;
}

const RentalCalendarView: React.FC<RentalCalendarViewProps> = ({
  events = mockEvents,
  dispatches = mockDispatches,
  onSaveChanges,
  onViewLiveSite,
}) => {
  const [month, setMonth] = useState(() => new Date(2026, 2, 1)); // March 2026
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [demoDate, setDemoDate] = useState('23/03/2026');

  const todayISO = '2026-03-23';
  const monthLabel = MONTH_FORMATTER.format(month);
  const sidebarMonthLabel = monthLabel.split(' ')[1] + ' ' + monthLabel.split(' ')[0].slice(0, 3).toUpperCase();

  const goToMonth = (delta: number) => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div className="rental-calendar-page">
      {/* <div className="rental-calendar-page__topbar">
        <h2 className="rental-calendar-page__topbar-title">Rental Calendar</h2>
        <div className="rental-calendar-page__topbar-actions">
          <button type="button" className="rental-calendar-page__btn-outline" onClick={onViewLiveSite}>
            View Live Site
          </button>
          <button type="button" className="rental-calendar-page__btn-primary" onClick={onSaveChanges}>
            Save Changes
          </button>
        </div>
      </div> */}

      <div className="rental-calendar-page__intro">
        <div className="rental-calendar-page__eyebrow">OPERATIONS</div>
        <h1 className="rental-calendar-page__heading">Rental Calendar</h1>
        <p className="rental-calendar-page__description">
          Complete operational view — every dispatch, rental window, return, and deposit event.
          Click any event to open the order. Use the sidebar for today&apos;s actions.
        </p>
      </div>

      <div className="rental-calendar-page__panel">
        <div className="rental-calendar-page__main">
          <CalendarHeader
            monthLabel={monthLabel}
            viewMode={viewMode}
            demoDate={demoDate}
            onPrevMonth={() => goToMonth(-1)}
            onNextMonth={() => goToMonth(1)}
            onViewModeChange={setViewMode}
            onDemoDateChange={setDemoDate}
            onAddTask={() => {}}
            onExport={() => {}}
          />

          {viewMode === 'month' && (
            <>
              <CalendarGrid month={month} events={events} todayISO={todayISO} />
              <CalendarLegend />
            </>
          )}

          {viewMode === 'agenda' && <AgendaView />}

          {viewMode === 'gantt' && <GanttView month={month} />}
        </div>

        <Sidebar monthLabel={sidebarMonthLabel} dispatches={dispatches} />
      </div>
    </div>
  );
};

export default RentalCalendarView;