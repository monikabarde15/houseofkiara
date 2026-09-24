import React from 'react';
import { AgendaEntry } from '../../types';
import AgendaRowDetail from './AgendaRowDetail';
import '../../css/agenda/AgendaRow.css';

const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    className={`agenda-chevron${expanded ? ' agenda-chevron--expanded' : ''}`}
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TYPE_CONFIG: Record<string, { label: string; icon: string; className: string }> = {
  'prep-dispatch': { label: 'Prep Dispatch', icon: '▶', className: 'badge-prep' },
  'dispatched':    { label: 'Dispatched',    icon: '▶', className: 'badge-dispatched' },
  'rental-starts': { label: 'Rental Starts', icon: '●', className: 'badge-rental-starts' },
  'return-due':    { label: 'Return Due',    icon: '↩', className: 'badge-return-due' },
  'cleaning':      { label: 'Cleaning',      icon: '↻', className: 'badge-cleaning' },
};

interface AgendaRowProps {
  entry: AgendaEntry;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onMarkDone: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onNotifyCustomer: (id: string) => void;
}

const AgendaRow: React.FC<AgendaRowProps> = ({
  entry, isExpanded, onToggle, onMarkDone, onSaveNote, onNotifyCustomer,
}) => {
  const cfg = TYPE_CONFIG[entry.type];

  return (
    <>
      <div
        className={`agenda-row ${entry.done ? 'agenda-row--done' : ''} ${isExpanded ? 'agenda-row--expanded' : ''}`}
        onClick={() => onToggle(entry.id)}
      >
        <div className="agenda-row__icon">{entry.done ? '✦' : '👗'}</div>
        <div className="agenda-row__date">{entry.date}</div>
        <div className="agenda-row__type">
          <span className={`agenda-badge ${cfg.className}`}>
            <span className="agenda-badge__icon">{cfg.icon}</span>{cfg.label}
          </span>
        </div>
        <div className="agenda-row__order">{entry.orderId}</div>
        <div className="agenda-row__customer">{entry.customer}</div>
        <div className="agenda-row__chat">
          <button
            className="agenda-chat-btn"
            onClick={(e) => { e.stopPropagation(); onNotifyCustomer(entry.id); }}
          >
            <WhatsAppIcon />
          </button>
        </div>
        <div className="agenda-row__product">{entry.product}</div>
        <div className="agenda-row__note">{entry.note}</div>
        <div className="agenda-row__menu">
          <button
            className="agenda-menu-btn"
            onClick={(e) => { e.stopPropagation(); onToggle(entry.id); }}
            aria-label="Toggle details"
          >
            <ChevronIcon expanded={isExpanded} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <AgendaRowDetail
          entry={entry}
          onMarkDone={onMarkDone}
          onSaveNote={onSaveNote}
          onNotifyCustomer={onNotifyCustomer}
        />
      )}
    </>
  );
};

export default AgendaRow;