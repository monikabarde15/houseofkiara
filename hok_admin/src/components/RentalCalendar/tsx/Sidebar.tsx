import React from 'react';
import { Calendar } from 'lucide-react';
import { DispatchCard } from '../types';
import '../css/Sidebar.css';

interface SidebarProps {
  monthLabel: string;
  dispatches: DispatchCard[];
  onSelectDispatch?: (dispatch: DispatchCard) => void;
}

const DispatchListItem: React.FC<{ dispatch: DispatchCard; onClick?: () => void }> = ({
  dispatch,
  onClick,
}) => (
  <button
    type="button"
    className={`dispatch-card${dispatch.isToday ? ' dispatch-card--today' : ''}`}
    onClick={onClick}
  >
    <div className="dispatch-card__date">
      {dispatch.isToday && <span className="dispatch-card__star">★</span>}
      {dispatch.dateLabel}
    </div>
    <div className="dispatch-card__title">{dispatch.title}</div>
    <div className="dispatch-card__subtitle">{dispatch.subtitle}</div>
    <div className="dispatch-card__order-id">{dispatch.orderId}</div>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ monthLabel, dispatches, onSelectDispatch }) => (
  <aside className="rental-sidebar">
    <div className="rental-sidebar__month">
      <Calendar className="w-[14px] h-[14px] mr-2 text-[#4A72B2] inline-block -mt-0.5" strokeWidth={2.5} />
      {monthLabel}
    </div>
    <div className="rental-sidebar__section-title">
      <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#C24A2E] mr-2 align-middle -mt-0.5"></span>
      DISPATCHES
    </div>

    <div className="rental-sidebar__list">
      {dispatches.map((dispatch) => (
        <DispatchListItem
          key={dispatch.id}
          dispatch={dispatch}
          onClick={() => onSelectDispatch?.(dispatch)}
        />
      ))}
    </div>
  </aside>
);

export default Sidebar;