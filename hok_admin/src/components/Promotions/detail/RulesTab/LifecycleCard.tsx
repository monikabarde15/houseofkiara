/* ========================================
   Promotions Module - Lifecycle Card
   Pause, Resume, Delete
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.12
   ======================================== */

import React from "react";
import { Lock } from "lucide-react";
import "./styles/LifecycleCard.css";
import { Card, Button } from "../../components/UI";
import { PromoCode } from "../../types/promotions.types";

interface LifecycleCardProps {
  code: PromoCode;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
  redemptions: number;
  locked?: boolean;
}

export const LifecycleCard: React.FC<LifecycleCardProps> = ({
  code,
  onPause,
  onResume,
  onDelete,
  redemptions,
  locked = false,
}) => {
  const isPaused = code.status === "Paused";
  const isActive = code.status === "Active";
  const canDelete = redemptions === 0;

  return (
    <Card
      header={<span className="card__title">Lifecycle — retire & delete</span>}
      className="lifecycle-card"
    >
      <div className="lifecycle-card__body">
        Pausing stops new redemptions instantly and is always reversible.
        Deleting is only allowed when no order has ever carried the code — used
        codes are history, and history keeps them.
      </div>

      <div className="lifecycle-card__actions">
        {isPaused ? (
          <Button
            variant="primary"
            size="small"
            onClick={onResume}
            className={locked ? "opacity-50" : ""}
          >
            {locked && <Lock className="inline-block w-3 h-3 mr-1" />}
            Resume code
          </Button>
        ) : isActive ? (
          <Button
            variant="secondary"
            size="small"
            onClick={onPause}
            className={locked ? "opacity-50" : ""}
          >
            {locked && <Lock className="inline-block w-3 h-3 mr-1" />}
            Pause code
          </Button>
        ) : null}

        {canDelete ? (
          <Button
            variant="secondary"
            size="small"
            className={`lifecycle-card__delete-btn ${locked ? "opacity-50" : ""}`}
            onClick={onDelete}
          >
            {locked && <Lock className="inline-block w-3 h-3 mr-1" />}
            Delete Code
          </Button>
        ) : null}
      </div>

      {!canDelete && (
        <div className="lifecycle-card__hint warning">
          {redemptions} order{redemptions > 1 ? "s" : ""} carry this code — it
          can be paused, but not deleted.
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
