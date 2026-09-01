import React, { useMemo, useRef, useState } from 'react';
import { CalendarEvent } from '../types';
import EventPill from './EventPill';
import EventDetailCard from './EventDetailCard';
import DayEventsPopover from './DayEventspopover';
import '../css/CalendarGrid.css';

interface CalendarGridProps {
  /** First-of-month reference date, e.g. new Date(2026, 2, 1) */
  month: Date;
  events: CalendarEvent[];
  todayISO: string;
  maxPillsPerCell?: number;
  onEventClick?: (event: CalendarEvent) => void;
}

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Builds full Mon–Sun weeks covering the given month, including the leading/trailing days. */
function buildMonthWeeks(month: Date): Date[][] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstOfMonth = new Date(year, monthIndex, 1);
  // getDay(): 0 = Sun ... 6 = Sat. Convert to Mon-first offset.
  const leadingOffset = (firstOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(year, monthIndex, 1 - leadingOffset);

  const lastOfMonth = new Date(year, monthIndex + 1, 0);
  const trailingOffset = (7 - ((lastOfMonth.getDay() + 6) % 7) - 1 + 7) % 7;
  const gridEnd = new Date(year, monthIndex, lastOfMonth.getDate() + trailingOffset);

  const weeks: Date[][] = [];
  let cursor = new Date(gridStart);
  while (cursor <= gridEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  month,
  events,
  todayISO,
  maxPillsPerCell = 3,
  onEventClick,
}) => {
  const weeks = useMemo(() => buildMonthWeeks(month), [month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    });
    return map;
  }, [events]);

  const currentMonthIndex = month.getMonth();

  // --- Hover card state (individual event pills) ---
  const [hoverState, setHoverState] = useState<{ event: CalendarEvent; anchor: DOMRect } | null>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const cancelHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
  };

  const handleHoverStart = (event: CalendarEvent, anchor: DOMRect) => {
    cancelHide();
    if (showTimer.current) window.clearTimeout(showTimer.current);
    showTimer.current = window.setTimeout(() => setHoverState({ event, anchor }), 250);
  };

  const handleHoverEnd = () => {
    if (showTimer.current) window.clearTimeout(showTimer.current);
    hideTimer.current = window.setTimeout(() => setHoverState(null), 150);
  };

  // --- "+N more" day popover state ---
  const [expandedDay, setExpandedDay] = useState<{
    iso: string;
    dateLabel: string;
    events: CalendarEvent[];
    anchor: DOMRect;
  } | null>(null);

  const openDayPopover = (
    e: React.MouseEvent<HTMLButtonElement>,
    date: Date,
    iso: string,
    dayEvents: CalendarEvent[],
  ) => {
    setExpandedDay({
      iso,
      dateLabel: FULL_DATE_FORMATTER.format(date),
      events: dayEvents,
      anchor: e.currentTarget.getBoundingClientRect(),
    });
  };

  return (
    <div className="calendar-grid">
      <div className="calendar-grid__scroll">
        <div className="calendar-grid__header">
          {DAY_LABELS.map((label) => (
            <div className="calendar-grid__header-cell" key={label}>
              {label}
            </div>
          ))}
        </div>

        {weeks.map((week) => (
          <div className="calendar-grid__row" key={toISODate(week[0])}>
            {week.map((date) => {
              const iso = toISODate(date);
              const dayEvents = eventsByDate.get(iso) ?? [];
              const visible = dayEvents.slice(0, maxPillsPerCell);
              const overflowCount = dayEvents.length - visible.length;
              const isToday = iso === todayISO;
              const isOutsideMonth = date.getMonth() !== currentMonthIndex;

              return (
                <div
                  className={[
                    'calendar-grid__cell',
                    isOutsideMonth ? 'calendar-grid__cell--outside' : '',
                    isToday ? 'calendar-grid__cell--today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={iso}
                >
                  <div className="calendar-grid__date">
                    <span className={isToday ? 'calendar-grid__date-badge' : undefined}>
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 1 && (
                      <span className="calendar-grid__date-count">{dayEvents.length}</span>
                    )}
                  </div>

                  <div className="calendar-grid__events">
                    {visible.map((event) => (
                      <EventPill
                        key={event.id}
                        event={event}
                        onClick={onEventClick}
                        onHoverStart={handleHoverStart}
                        onHoverEnd={handleHoverEnd}
                      />
                    ))}
                    {overflowCount > 0 && (
                      <button
                        type="button"
                        className="calendar-grid__more"
                        onClick={(e) => openDayPopover(e, date, iso, dayEvents)}
                      >
                        +{overflowCount} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {hoverState && (
        <EventDetailCard
          event={hoverState.event}
          anchor={hoverState.anchor}
          onMouseEnter={cancelHide}
          onMouseLeave={handleHoverEnd}
        />
      )}

      {expandedDay && (
        <DayEventsPopover
          dateLabel={expandedDay.dateLabel}
          events={expandedDay.events}
          anchor={expandedDay.anchor}
          onClose={() => setExpandedDay(null)}
          onEventClick={onEventClick}
          onEventHoverStart={handleHoverStart}
          onEventHoverEnd={handleHoverEnd}
        />
      )}
    </div>
  );
};

export default CalendarGrid;