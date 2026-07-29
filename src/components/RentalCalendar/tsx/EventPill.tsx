import React from 'react';
import { CalendarEvent, EVENT_STYLES } from '../types';
import '../css/EventPill.css';

interface EventPillProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}

const EventPill: React.FC<EventPillProps> = ({ event, onClick }) => {
  const { color } = EVENT_STYLES[event.type];

  return (
    <button
      type="button"
      className="event-pill"
      style={{ backgroundColor: color }}
      title={event.title}
      onClick={() => onClick?.(event)}
    >
      <span className="event-pill__label">{event.title}</span>
    </button>
  );
};

export default EventPill;