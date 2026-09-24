import React from 'react';
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
      {dispatch.dateLabel} · DISPATCH
    </div>
    <div className="dispatch-card__title">{dispatch.title}</div>
    <div className="dispatch-card__subtitle">{dispatch.subtitle}</div>
    <div className="dispatch-card__order-id">{dispatch.orderId}</div>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ monthLabel, dispatches, onSelectDispatch }) => (
  <aside className="rental-sidebar">
    <div className="rental-sidebar__month">{monthLabel}</div>
    <div className="rental-sidebar__section-title">DISPATCHES</div>

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