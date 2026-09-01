import React, { useRef } from 'react';
import { CalendarEvent, EVENT_STYLES } from '../types';
import '../css/EventPill.css';

interface EventPillProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  onHoverStart?: (event: CalendarEvent, anchor: DOMRect) => void;
  onHoverEnd?: () => void;
}

const EventPill: React.FC<EventPillProps> = ({ event, onClick, onHoverStart, onHoverEnd }) => {
  const { color } = EVENT_STYLES[event.type];
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      className="event-pill"
      style={{ backgroundColor: color }}
      title={event.title}
      onClick={() => onClick?.(event)}
      onMouseEnter={() => ref.current && onHoverStart?.(event, ref.current.getBoundingClientRect())}
      onMouseLeave={() => onHoverEnd?.()}
    >
      <span className="event-pill__label">{event.title}</span>
    </button>
  );
};

export default EventPill;