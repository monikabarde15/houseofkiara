import React from 'react';
import { EVENT_STYLES, EventType } from '../types';
import '../css/CalendarLegend.css';

// Two visual rows, matching the reference design's grouping.
const ROW_1: EventType[] = [
  'prep-dispatch',
  'dispatched',
  'rental-starts',
  'return-due',
  'cleaning',
  'back-in-rotation',
  'deposit-due',
  'payout-due',
  'offer-response-due',
];

const ROW_2: EventType[] = ['delivery-followup', 'internal-task'];

const LegendRow: React.FC<{ types: EventType[] }> = ({ types }) => (
  <div className="calendar-legend__row">
    {types.map((type) => {
      const { label, color } = EVENT_STYLES[type];
      return (
        <span className="calendar-legend__item" key={type}>
          <span className="calendar-legend__swatch" style={{ backgroundColor: color }} />
          {label}
        </span>
      );
    })}
  </div>
);

const CalendarLegend: React.FC = () => (
  <div className="calendar-legend">
    <LegendRow types={ROW_1} />
    <LegendRow types={ROW_2} />
  </div>
);

export default CalendarLegend;