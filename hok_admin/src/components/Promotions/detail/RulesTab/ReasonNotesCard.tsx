/* ========================================
   Promotions Module - Reason Notes Card
   Internal reason, public description, notes
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.4
   ======================================== */

import React, { useState } from 'react';
import './styles/ReasonNotesCard.css';
import { Card, Button, Link, FormField } from '../../components/UI';
import { PromoCode } from '../../types/promotions.types';

interface ReasonNotesCardProps {
  code: PromoCode;
  onSave: (data: Partial<PromoCode>) => void;
}

export const ReasonNotesCard: React.FC<ReasonNotesCardProps> = ({ code, onSave }) => {
  const [reason, setReason] = useState(code.reason);
  const [publicDesc, setPublicDesc] = useState(code.publicDesc);
  const [notes, setNotes] = useState(code.notes);

  const handleSave = () => {
    onSave({ reason, publicDesc, notes });
  };

  return (
    <Card
      header={<span className="card__title">Reason & Notes</span>}
      footer={
        <div className="reason-notes__footer-content">
          <span className="reason-notes__created-by">
            Created by {code.createdBy} · {code.createdOn}
          </span>
          <Button variant="primary" size="small" onClick={handleSave}>
            Save
          </Button>
        </div>
      }
    >
      <FormField label="Reason / Occasion · internal *">
        <input
          type="text"
          className="form-field__input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="form-field__hint">
          The audit answer to "why did we give money away?" — never seen by a shopper.
        </div>
      </FormField>

      <FormField label="Public Description · the shopper reads this">
        <input
          type="text"
          className="form-field__input"
          value={publicDesc}
          onChange={(e) => setPublicDesc(e.target.value)}
          maxLength={60}
        />
        <div className="form-field__hint">
          The line shown beside the code in the cart's offers drawer. Leave it blank and the cart falls back to the plain offer.
        </div>
      </FormField>

      <FormField label="Internal Notes">
        <textarea
          className="form-field__input form-field__input--textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Anything ops should know — where it was announced, who asked for it..."
        />
      </FormField>
    </Card>
  );
};