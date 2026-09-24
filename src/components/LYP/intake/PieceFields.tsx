// src/components/LYP/intake/PieceFields.tsx

import React from 'react';
import { Channel, Intent } from '../types/submission.types';
import { 
  CHANNELS, 
  INTENTS, 
  CATEGORIES, 
  COLOURS, 
  SIZES, 
  TIMES_WORN, 
  SELF_GRADE_OPTIONS 
} from '../utils/constants';
import './styles/PieceFields.css';

interface PieceFieldsProps {
  channel: Channel;
  onChannelChange: (channel: Channel) => void;
  piece: string;
  onPieceChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  designer: string;
  onDesignerChange: (value: string) => void;
  colour: string;
  onColourChange: (value: string) => void;
  size: string;
  onSizeChange: (value: string) => void;
  timesWorn: string;
  onTimesWornChange: (value: string) => void;
  yearOfPurchase: string;
  onYearOfPurchaseChange: (value: string) => void;
  originalPrice: string;
  onOriginalPriceChange: (value: string) => void;
  intent: Intent;
  onIntentChange: (value: Intent) => void;
  expectationRent: string;
  onExpectationRentChange: (value: string) => void;
  expectationSell: string;
  onExpectationSellChange: (value: string) => void;
  selfGrade: string;
  onSelfGradeChange: (value: string) => void;
  conditionClaim: string;
  onConditionClaimChange: (value: string) => void;
  specialNotes: string;
  onSpecialNotesChange: (value: string) => void;
  errors: Record<string, string>;
}

export const PieceFields: React.FC<PieceFieldsProps> = ({
  channel,
  onChannelChange,
  piece,
  onPieceChange,
  category,
  onCategoryChange,
  designer,
  onDesignerChange,
  colour,
  onColourChange,
  size,
  onSizeChange,
  timesWorn,
  onTimesWornChange,
  yearOfPurchase,
  onYearOfPurchaseChange,
  originalPrice,
  onOriginalPriceChange,
  intent,
  onIntentChange,
  expectationRent,
  onExpectationRentChange,
  expectationSell,
  onExpectationSellChange,
  selfGrade,
  onSelfGradeChange,
  conditionClaim,
  onConditionClaimChange,
  specialNotes,
  onSpecialNotesChange,
  errors,
}) => {
  return (
    <div className="piece-fields">
      <div className="piece-fields-grid g2">
        {/* Piece Name */}
        <div className="fld">
          <label className="fld-label">Piece *</label>
          <input
            type="text"
            className={`fld-input ${errors.piece ? 'fld-error' : ''}`}
            value={piece}
            onChange={(e) => onPieceChange(e.target.value)}
            placeholder="e.g. Emerald Silk Anarkali"
          />
          {errors.piece && <div className="fld-error-text">{errors.piece}</div>}
          <div className="fhint">Working name for the desk — the storefront title is set at approval.</div>
        </div>

        {/* Piece Type */}
        <div className="fld">
          <label className="fld-label">Piece Type *</label>
          <select
            className="fld-input"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Select type</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="fhint">Same list as the website form — one vocabulary everywhere.</div>
        </div>

        {/* Designer / Brand */}
        <div className="fld">
          <label className="fld-label">Designer / Brand</label>
          <input
            type="text"
            className="fld-input"
            value={designer}
            onChange={(e) => onDesignerChange(e.target.value)}
            placeholder="As told — recognition is instant"
            autoComplete="off"
          />
          <div className="fhint">
            {designer ? (
              <span className="designer-status tchip ok">
                ✓ Maps to <strong>{designer}</strong>
              </span>
            ) : (
              <span className="designer-status tchip warn">
                New label — recorded as told; files under Unmapped Labels until promoted from Designers
              </span>
            )}
          </div>
        </div>

        {/* Colour Family */}
        <div className="fld">
          <label className="fld-label">Colour Family</label>
          <select
            className="fld-input"
            value={colour}
            onChange={(e) => onColourChange(e.target.value)}
          >
            <option value="">Select colour</option>
            {COLOURS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="fld">
          <label className="fld-label">Size</label>
          <select
            className="fld-input"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            <option value="">Select size</option>
            {SIZES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Times Worn */}
        <div className="fld">
          <label className="fld-label">Times Worn</label>
          <select
            className="fld-input"
            value={timesWorn}
            onChange={(e) => onTimesWornChange(e.target.value)}
          >
            <option value="">Select</option>
            {TIMES_WORN.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Original Purchase Price */}
        <div className="fld">
          <label className="fld-label">Original Purchase Price — as claimed</label>
          <input
            type="text"
            className="fld-input"
            value={originalPrice}
            onChange={(e) => onOriginalPriceChange(e.target.value)}
            placeholder="₹"
          />
        </div>

        {/* Year of Purchase */}
        <div className="fld">
          <label className="fld-label">Year of Purchase</label>
          <input
            type="text"
            className="fld-input"
            value={yearOfPurchase}
            onChange={(e) => onYearOfPurchaseChange(e.target.value)}
            placeholder="e.g. 2023"
            maxLength={4}
          />
        </div>

        {/* Preferred Outcome */}
        <div className="fld">
          <label className="fld-label">Preferred Outcome</label>
          <select
            className="fld-input"
            value={intent}
            onChange={(e) => onIntentChange(e.target.value as Intent)}
          >
            {INTENTS.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Expectation — Rent */}
        <div className="fld">
          <label className="fld-label">Expectation — rent (if shared)</label>
          <input
            type="text"
            className="fld-input"
            value={expectationRent}
            onChange={(e) => onExpectationRentChange(e.target.value)}
            placeholder="Only what they volunteered"
          />
        </div>

        {/* Expectation — Outright */}
        <div className="fld">
          <label className="fld-label">Expectation — outright (if shared)</label>
          <input
            type="text"
            className="fld-input"
            value={expectationSell}
            onChange={(e) => onExpectationSellChange(e.target.value)}
            placeholder="Blank = not shared"
          />
        </div>

        {/* Condition — self-assessed */}
        <div className="fld">
          <label className="fld-label">Condition — self-assessed</label>
          <select
            className="fld-input"
            value={selfGrade}
            onChange={(e) => onSelfGradeChange(e.target.value)}
          >
            <option value="">— not asked / not shared</option>
            {SELF_GRADE_OPTIONS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div className="fhint">The form's own options — one vocabulary, both directions.</div>
        </div>

        {/* Our first read — grade */}
        <div className="fld">
          <label className="fld-label">Our first read — grade</label>
          <select
            className="fld-input"
            value="Good"
            onChange={() => {}}
          >
            {SELF_GRADE_OPTIONS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div className="fhint">Fair → rental-only. The formal grade lands at authentication.</div>
        </div>

        {/* Channel */}
        <div className="fld">
          <label className="fld-label">Channel *</label>
          <select
            className="fld-input"
            value={channel}
            onChange={(e) => onChannelChange(e.target.value as Channel)}
          >
            {CHANNELS.filter(c => c !== 'Website').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Condition — additional notes */}
      <div className="fld fld-full">
        <label className="fld-label">Condition — additional notes</label>
        <input
          type="text"
          className="fld-input"
          value={conditionClaim}
          onChange={(e) => onConditionClaimChange(e.target.value)}
          placeholder="Their words, as given"
        />
      </div>

      {/* Special notes */}
      <div className="fld fld-full">
        <label className="fld-label">Special notes</label>
        <input
          type="text"
          className="fld-input"
          value={specialNotes}
          onChange={(e) => onSpecialNotesChange(e.target.value)}
          placeholder="Pickup constraints, rent-only, matching pieces..."
        />
      </div>
    </div>
  );
};