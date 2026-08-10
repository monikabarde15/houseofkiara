/* ========================================
   Promotions Module - Lifecycle Card
   Pause, Resume, Delete
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.12
   ======================================== */

import React from 'react';
import './styles/LifecycleCard.css';
import { Card, Button } from '../../components/UI';
import { PromoCode } from '../../types/promotions.types';

interface LifecycleCardProps {
  code: PromoCode;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
  redemptions: number;
}

export const LifecycleCard: React.FC<LifecycleCardProps> = ({
  code,
  onPause,
  onResume,
  onDelete,
  redemptions,
}) => {
  const isPaused = code.status === 'Paused';
  const isActive = code.status === 'Active';
  const canDelete = redemptions === 0;

  return (
    <Card 
      header={<span className="card__title">Lifecycle — retire & delete</span>}
      className="lifecycle-card"
    >
      <div className="lifecycle-card__body">
        Pausing stops new redemptions instantly and is always reversible. Deleting is only allowed when no order has ever carried the code — used codes are history, and history keeps them.
      </div>

      <div className="lifecycle-card__actions">
        {isPaused ? (
          <Button variant="primary" size="small" onClick={onResume}>
            Resume code
          </Button>
        ) : isActive ? (
          <Button variant="secondary" size="small" onClick={onPause}>
            Pause code
          </Button>
        ) : null}

        {canDelete ? (
          <Button variant="secondary" size="small" className="lifecycle-card__delete-btn" onClick={onDelete}>
            Delete Code
          </Button>
        ) : null}
      </div>

      {!canDelete && (
        <div className="lifecycle-card__hint warning">
          {redemptions} order{redemptions > 1 ? 's' : ''} carry this code — it can be paused, but not deleted.
        </div>
      )}

      {canDelete && redemptions === 0 && (
        <div className="lifecycle-card__hint">
          No order has used this code — deleting it is allowed.
        </div>
      )}
    </Card>
  );
};