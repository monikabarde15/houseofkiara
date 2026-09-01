import React from 'react';
import ReactDOM from 'react-dom';
import { CalendarEvent, EVENT_STYLES } from '../types';
import '../css/EventDetailCard.css';

interface EventDetailCardProps {
  event: CalendarEvent;
  anchor: DOMRect;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CARD_WIDTH = 340;
const CARD_EST_HEIGHT = 420;

function formatFullDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, anchor, onMouseEnter, onMouseLeave }) => {
  const { detail } = event;
  if (!detail) return null;

  const { label: typeLabel, color } = EVENT_STYLES[event.type];

  const spaceBelow = window.innerHeight - anchor.bottom;
  const showBelow = spaceBelow > CARD_EST_HEIGHT;
  const top = showBelow ? anchor.bottom + 6 : anchor.top - 6;
  const left = Math.min(anchor.left, window.innerWidth - CARD_WIDTH - 12);

  return ReactDOM.createPortal(
    <div
      className="event-detail-card"
      style={{
        top,
        left,
        width: CARD_WIDTH,
        transform: showBelow ? 'translateY(0)' : 'translateY(-100%)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="event-detail-card__badge" style={{ backgroundColor: color }}>
        {detail.dispatchOverdue ? `▶ ${typeLabel.toUpperCase()} — OVERDUE` : typeLabel.toUpperCase()}
      </div>
      <div className="event-detail-card__date">{formatFullDate(event.date)}</div>

      <div className="event-detail-card__section">
        <div className="event-detail-card__label">CUSTOMER</div>
        <div className="event-detail-card__name">{detail.customerName}</div>
        <div className="event-detail-card__muted">
          {detail.customerLocation} · {detail.customerPhone}
        </div>
        {event.orderId && <div className="event-detail-card__muted">{event.orderId}</div>}
        <div className="event-detail-card__row">
          <span>Order placed</span>
          <span>{detail.orderPlaced}</span>
        </div>
      </div>

      <div className="event-detail-card__section">
        <div className="event-detail-card__label">PRODUCT</div>
        <div className="event-detail-card__name">{detail.productName}</div>
        <div className="event-detail-card__muted">{detail.productSubtitle}</div>

        <div className="event-detail-card__row">
          <span>Rental period</span>
          <span>{detail.rentalPeriodLabel}</span>
        </div>
        <div className="event-detail-card__row">
          <span>Dispatch by</span>
          <span className={detail.dispatchOverdue ? 'event-detail-card__value--danger' : ''}>
            {detail.dispatchByLabel}
          </span>
        </div>
        <div className="event-detail-card__row">
          <span>Carrier</span>
          <span>{detail.carrierLabel}</span>
        </div>
        <div className="event-detail-card__row">
          <span>Rental amount</span>
          <span className="event-detail-card__value--gold">{detail.rentalAmountLabel}</span>
        </div>
        <div className="event-detail-card__row">
          <span>Security deposit</span>
          <span className="event-detail-card__value--gold">{detail.securityDepositLabel}</span>
        </div>
        <div className="event-detail-card__row">
          <span>Deposit status</span>
          <span className="event-detail-card__value--gold">{detail.depositStatusLabel}</span>
        </div>
      </div>

      {detail.overdueMessage && (
        <div className="event-detail-card__warning">⚠ {detail.overdueMessage}</div>
      )}

      <div className="event-detail-card__footer">Click event to open full order →</div>
    </div>,
    document.body
  );
};

export default EventDetailCard;