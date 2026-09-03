import React from 'react';
import { GanttOrderRow } from '../../types';
import GanttRow from './GanttRow';
import '../../css/gantt/GanttView.css';

interface GanttViewProps {
  month: Date;
  rows?: GanttOrderRow[];
}

const GanttView: React.FC<GanttViewProps> = ({ month, rows = [] }) => {
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="gantt-view">
      <div className="gantt-view__header">
        <div className="gantt-view__header-label">ORDER</div>
        <div className="gantt-view__header-days" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
          {dayNumbers.map((d) => (
            <div key={d} className="gantt-view__day-number">{d}</div>
          ))}
        </div>
      </div>
      <div className="gantt-view__body">
        {rows.map((row) => (
          <GanttRow key={row.id} row={row} daysInMonth={daysInMonth} />
        ))}
      </div>
    </div>
  );
};

export default GanttView;