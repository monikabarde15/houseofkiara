import React from 'react';
import { GanttOrderRow } from '../../types';
import '../../css/gantt/GanttRow.css';

interface GanttRowProps {
  row: GanttOrderRow;
  daysInMonth: number;
}

const SEGMENT_CONTENT: Record<string, string> = {
  dispatch: 'D',
  return: 'R',
  deposit: '₹',
  rental: '',
};

const GanttRow: React.FC<GanttRowProps> = ({ row, daysInMonth }) => {
  const segmentByDay = new Map(row.segments.map((s) => [s.day, s.type]));

  return (
    <div className="gantt-row">
      <div className="gantt-row__label">
        <div className="gantt-row__order-id">{row.orderId}</div>
        <div className="gantt-row__meta">{row.customer} · {row.product}</div>
      </div>
      <div className="gantt-row__timeline" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const type = segmentByDay.get(day);
          return (
            <div key={day} className={`gantt-cell${type ? ` gantt-cell--${type}` : ''}`}>
              {type ? SEGMENT_CONTENT[type] : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttRow;