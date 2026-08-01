import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CalendarEvent } from '../types';
import EventPill from './EventPill';
import '../css/DayEventsPopover.css';

interface DayEventsPopoverProps {
  dateLabel: string; // e.g. "25 March 2026"
  events: CalendarEvent[];
  anchor: DOMRect;
  onClose: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventHoverStart?: (event: CalendarEvent, anchor: DOMRect) => void;
  onEventHoverEnd?: () => void;
}

const POPOVER_WIDTH = 260;
const POPOVER_EST_HEIGHT = 360;

const DayEventsPopover: React.FC<DayEventsPopoverProps> = ({
  dateLabel,
  events,
  anchor,
  onClose,
  onEventClick,
  onEventHoverStart,
  onEventHoverEnd,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const spaceBelow = window.innerHeight - anchor.bottom;
  const showBelow = spaceBelow > POPOVER_EST_HEIGHT;
  const top = showBelow ? anchor.bottom + 6 : anchor.top - 6;
  const left = Math.min(anchor.left, window.innerWidth - POPOVER_WIDTH - 12);

  return ReactDOM.createPortal(
    <div
      ref={rootRef}
      className="day-events-popover"
      style={{
        top,
        left,
        width: POPOVER_WIDTH,
        transform: showBelow ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div className="day-events-popover__header">
        <span className="day-events-popover__date">{dateLabel}</span>
        <span className="day-events-popover__count">{events.length} events</span>
      </div>
      <div className="day-events-popover__list">
        {events.map((event) => (
          <EventPill
            key={event.id}
            event={event}
            onClick={onEventClick}
            onHoverStart={onEventHoverStart}
            onHoverEnd={onEventHoverEnd}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default DayEventsPopover;