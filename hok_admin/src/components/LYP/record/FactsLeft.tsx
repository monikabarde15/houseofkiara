// src/components/LYP/record/FactsLeft.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { formatMeasurements, getFirstName, inr } from '../utils/formatter';
import { PriceVerification } from './PriceVerification';
import './styles/FactsLeft.css';

interface FactsLeftProps {
  submission: Submission;
  onUpdate: () => void;
}

export const FactsLeft: React.FC<FactsLeftProps> = ({ submission, onUpdate }) => {
  const measurements = submission.measurements;
  const hasMeasurements = measurements && Object.keys(measurements).some(k => measurements[k as keyof typeof measurements]);
  const hasExpectation = submission.expectation?.rent || submission.expectation?.sell;

  return (
    <div className="facts-left">

      {/* ── THEIR DETAILS ── */}
      <div className="facts-group">
        <div className="facts-group-header">Their Details</div>
        <div className="facts-grid">

          {/* Full Name — gold link, not a box */}
          <div className="facts-field">
            <div className="facts-field-label">Full Name</div>
            <span className="facts-name-link">
              {getFirstName(submission.listerID)} →
            </span>
          </div>

          {/* City — box */}
          <div className="facts-field">
            <div className="facts-field-label">City</div>
            <div className="facts-field-value">{submission.city || '—'}</div>
          </div>

          {/* Email — box */}
          <div className="facts-field">
            <div className="facts-field-label">Email</div>
            <div className="facts-field-value">{submission.email || '—'}</div>
          </div>

          {/* Mobile — box + hint */}
          <div className="facts-field">
            <div className="facts-field-label">Mobile Number</div>
            <div className="facts-field-value">{submission.phone || '—'}</div>
            <div className="facts-field-hint">WhatsApp preferred — the 48-hour call happens here.</div>
          </div>

        </div>
      </div>

      {/* ── ABOUT THE PIECE ── */}
      <div className="facts-group">
        <div className="facts-group-header">About the Piece</div>
        <div className="facts-grid">

          <div className="facts-field">
            <div className="facts-field-label">Piece Type</div>
            <div className="facts-field-value">{submission.category || '—'}</div>
          </div>

          <div className="facts-field">
            <div className="facts-field-label">Designer / Brand</div>
            <div className="facts-field-value">{submission.designer || '— not shared'}</div>
          </div>

          <div className="facts-field">
            <div className="facts-field-label">Size</div>
            <div className="facts-field-value">{submission.size || '—'}</div>
          </div>

          <div className="facts-field">
            <div className="facts-field-label">Colour Family</div>
            <div className="facts-field-value">{submission.colour || '—'}</div>
          </div>

          <div className="facts-field">
            <div className="facts-field-label">Times Worn</div>
            <div className="facts-field-value">{submission.timesWorn || '—'}</div>
          </div>

          <div className="facts-field">
            <div className="facts-field-label">Year of Purchase</div>
            <div className="facts-field-value">{submission.yearOfPurchase || '—'}</div>
          </div>

          {/* Condition — full width */}
          <div className="facts-field facts-field-full">
            <div className="facts-field-label">Condition — Self-Graded</div>
            <div className="facts-field-value">
              {submission.selfGrade ? submission.selfGrade : '— not asked on this channel'}
            </div>
            {submission.selfGrade && (
              <div className="facts-field-hint">Their pick from the form's options — ours is set in the worksheet.</div>
            )}
          </div>

          {/* Measurements — full width, only if present */}
          {hasMeasurements && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">Measurements — As Told (in)</div>
              <div className="facts-field-value">{formatMeasurements(measurements)}</div>
              {measurements.notes && (
                <div className="facts-field-hint">{measurements.notes}</div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── APPROXIMATE ORIGINAL PRICE ── */}
      <div className="facts-group">
        <div className="facts-field-label" style={{ marginBottom: 4 }}>
          Approximate Original Price — As Claimed
        </div>
        <div className="facts-field-value price-value">
          {submission.originalPrice
            ? inr(parseFloat(submission.originalPrice.replace(/[^0-9.]/g, '')))
            : '—'}
        </div>
        <PriceVerification submission={submission} onUpdate={onUpdate} />
        <div className="facts-field-hint">
          The claim stands until verified — the verified figure becomes the storefront strike-through.
        </div>
      </div>

      {/* ── PREFERRED OUTCOME ── */}
      <div className="facts-group">
        <div className="facts-group-header">Preferred Outcome</div>
        <div className="facts-grid">

          <div className="facts-field facts-field-full">
            <div className="facts-field-label">What They'd Like to Do</div>
            <div className="facts-field-value">{submission.intent || '—'}</div>
          </div>

          {hasExpectation ? (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">Price Expectation (if shared)</div>
              <div className="facts-field-value">
                {submission.expectation?.rent && `Rent · ${submission.expectation.rent}`}
                {submission.expectation?.rent && submission.expectation?.sell && '  '}
                {submission.expectation?.sell && `Outright · ${submission.expectation.sell}`}
              </div>
              <div className="facts-field-hint">
                What the lister volunteered — a starting point for the conversation, not a listed price.
              </div>
            </div>
          ) : (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">Price Expectation (if shared)</div>
              <div className="facts-field-value facts-no-expectation">
                Not shared — the website form stays price-free by design. The pricing conversation is ours, inside the 48-hour call.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── IN THEIR WORDS ── */}
      <div className="facts-group">
        <div className="facts-group-header">In Their Words</div>
        <div className="facts-grid">

          {submission.story && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">Their Piece's Story</div>
              <div className="facts-field-value story-text">{submission.story}</div>
              <div className="facts-field-hint">Storefront gold — reuse it in the listing copy.</div>
            </div>
          )}

          {submission.notes && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">Special Notes for Our Team</div>
              <div className="facts-field-value">{submission.notes}</div>
            </div>
          )}

          {submission.conditionClaim && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">Condition — Additional Notes</div>
              <div className="facts-field-value">{submission.conditionClaim}</div>
              <div className="facts-field-hint">Verbatim from {submission.channel}.</div>
            </div>
          )}

          {!submission.story && !submission.notes && !submission.conditionClaim && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-value facts-no-words">Nothing extra shared.</div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};