import React from 'react';
import { AgendaEntry } from '../../types';
import AgendaRow from './AgendaRow';
import '../../css/agenda/AgendaTable.css';

interface AgendaTableProps {
  entries: AgendaEntry[];
  expandedId: string | null;
  onToggleRow: (id: string) => void;
  onMarkDone: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onNotifyCustomer: (id: string) => void;
}

const AgendaTable: React.FC<AgendaTableProps> = ({
  entries, expandedId, onToggleRow, onMarkDone, onSaveNote, onNotifyCustomer,
}) => (
  <div className="agenda-table">
    <div className="agenda-table__header">
  <div />
  <div>DATE</div>
  <div>TYPE</div>
  <div>ORDER</div>
  <div>CUSTOMER</div>
  <div />
  <div>PRODUCT</div>
  <div>NOTE</div>
  <div />
</div>
    <div className="agenda-table__body">
      {entries.map((entry) => (
        <AgendaRow
          key={entry.id}
          entry={entry}
          isExpanded={expandedId === entry.id}
          onToggle={onToggleRow}
          onMarkDone={onMarkDone}
          onSaveNote={onSaveNote}
          onNotifyCustomer={onNotifyCustomer}
        />
      ))}
    </div>
  </div>
);

export default AgendaTable;