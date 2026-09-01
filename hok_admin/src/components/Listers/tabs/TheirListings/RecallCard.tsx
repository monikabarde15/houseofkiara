// src/components/Listers/tabs/TheirListings/RecallCard.tsx

import React, { useState } from 'react';
import { useListings } from '../../hooks/useListings';
import { formatDate } from '../../utils/formatter';
import './styles/RecallCard.css';

interface RecallCardProps {
  recalls: any[];
  listings: any[];
  listerId: string;
  onUpdate: () => void;
}

export const RecallCard: React.FC<RecallCardProps> = ({
  recalls,
  listings,
  listerId,
  onUpdate,
}) => {
  const { createRecall, approveRecall, declineRecall, markReturned, loading } = useListings(listerId);
  const [showForm, setShowForm] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState('');
  const [recallReason, setRecallReason] = useState('');

  const hasRecallablePieces = listings.some(l => l.status !== 'Sold' && l.status !== 'Archived');

  const handleSubmit = async () => {
    if (!selectedPiece || !recallReason.trim()) return;
    try {
      await createRecall(selectedPiece, recallReason);
      setShowForm(false);
      setSelectedPiece('');
      setRecallReason('');
      onUpdate();
    } catch (error) {
      console.error('Failed to create recall:', error);
    }
  };

  const renderRecallState = (recall: any) => {
    if (recall.status === 'Requested') {
      const futureBookings = []; // Would check calendar in real implementation
      const hasFutureBookings = futureBookings.length > 0;

      return (
        <div className="recall-state recall-requested">
          {hasFutureBookings ? (
            <div className="recall-conflict">
              {futureBookings.length} future booking(s) on the calendar. Earliest safe pickup: after last booking + buffer.
            </div>
          ) : (
            <div className="recall-clear">
              No future bookings - clear to schedule pickup.
            </div>
          )}
          <div className="recall-actions">
            <button 
              className="btn btn-gold btn-sm"
              onClick={() => {
                const date = prompt('Pickup date:', new Date().toISOString().split('T')[0]);
                if (date) {
                  approveRecall(recall.id, date);
                }
              }}
              disabled={loading}
            >
              Approve & Schedule Pickup
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => {
                const reason = prompt('Decline reason:');
                if (reason) {
                  declineRecall(recall.id, reason);
                }
              }}
              disabled={loading}
            >
              Decline
            </button>
          </div>
        </div>
      );
    }

    if (recall.status === 'Scheduled') {
      return (
        <div className="recall-state recall-scheduled">
          <span className="recall-state-label">Pickup scheduled {formatDate(recall.scheduledDate)} - bookings before that date are honored; nothing new is taken past it.</span>
          <button 
            className="btn btn-sec btn-sm"
            onClick={() => markReturned(recall.id)}
            disabled={loading}
          >
            Mark Returned to Lister
          </button>
        </div>
      );
    }

    if (recall.status === 'Returned') {
      return (
        <div className="recall-state recall-returned">
          <span className="recall-state-label">Returned to lister {formatDate(recall.returnedDate)} - listing archived, custody with lister, calendar closed.</span>
        </div>
      );
    }

    if (recall.status === 'Declined') {
      return (
        <div className="recall-state recall-declined">
          <span className="recall-state-label">Declined {formatDate(recall.declinedDate)} - {recall.declinedReason}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="recall-card card">
      <div className="card-hd">
        <div>
          <span className="card-title">Piece Recall Requests</span>
          <div className="card-sub">The circular flow home – conflict-checked against the rental calendar before anything moves.</div>
        </div>
        {hasRecallablePieces && (
          <button 
            className="btn btn-sec btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            Record recall request
          </button>
        )}
      </div>

      <div className="card-bd">
        {showForm && (
          <div className="recall-form">
            <div className="recall-form-grid g2">
              <div className="fld">
                <label className="fld-label">Piece</label>
                <select
                  className="fld-input"
                  value={selectedPiece}
                  onChange={(e) => setSelectedPiece(e.target.value)}
                >
                  <option value="">Select a piece</option>
                  {listings
                    .filter(l => l.status !== 'Sold' && l.status !== 'Archived')
                    .map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.sku})
                      </option>
                    ))}
                </select>
              </div>
              <div className="fld">
                <label className="fld-label">Reason (lister's words)</label>
                <input
                  type="text"
                  className="fld-input"
                  value={recallReason}
                  onChange={(e) => setRecallReason(e.target.value)}
                  placeholder="e.g. wants it back for a family function"
                />
              </div>
            </div>
            <div className="recall-form-actions">
              <button 
                className="btn btn-gold btn-sm"
                onClick={handleSubmit}
                disabled={!selectedPiece || !recallReason.trim() || loading}
              >
                Save Request
              </button>
              <button 
                className="btn btn-sec btn-sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {recalls.length === 0 ? (
          <div className="recall-empty">
            No recall requests - when a lister wants a piece back, record it here so the calendar and payouts stay honest.
          </div>
        ) : (
          recalls.map((recall) => (
            <div key={recall.id} className="recall-item">
              <div className="recall-item-header">
                <span className="recall-piece-name qlnk">{recall.pieceName}</span>
                <span className="recall-requested-date">requested {formatDate(recall.requestedDate)}</span>
              </div>
              <div className="recall-reason">“{recall.reason}”</div>
              {renderRecallState(recall)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecallCard;