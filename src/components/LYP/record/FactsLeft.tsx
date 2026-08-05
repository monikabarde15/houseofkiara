// src/components/LYP/record/FactsLeft.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { formatMeasurements, getFirstName, inr } from '../utils/formatter';
import { PriceVerification } from './PriceVerification';
import { AuthenticationStrip } from './AuthenticationStrip';
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
      {/* THEIR DETAILS - Two column grid */}
      <div className="facts-group">
        <div className="facts-group-header">THEIR DETAILS</div>
        <div className="facts-grid">
          <div className="facts-field">
            <div className="facts-field-label">FULL NAME</div>
            <div className="facts-field-value qlnk">{getFirstName(submission.listerID)} →</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">CITY</div>
            <div className="facts-field-value">{submission.city || '—'}</div>
            <div className="facts-field-hint">Outside current pickup cities — flag before approving.</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">EMAIL</div>
            <div className="facts-field-value">{submission.email || '—'}</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">MOBILE NUMBER</div>
            <div className="facts-field-value">{submission.phone || '—'}</div>
            <div className="facts-field-hint">WhatsApp preferred — the 48-hour call happens here.</div>
          </div>
        </div>
      </div>

      {/* ABOUT THE PIECE - Two column grid */}
      <div className="facts-group">
        <div className="facts-group-header">ABOUT THE PIECE</div>
        <div className="facts-grid">
          <div className="facts-field">
            <div className="facts-field-label">PIECE TYPE</div>
            <div className="facts-field-value">{submission.category || '—'}</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">DESIGNER / BRAND</div>
            <div className="facts-field-value">{submission.designer || '— not shared'}</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">SIZE</div>
            <div className="facts-field-value">{submission.size || '—'}</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">COLOUR FAMILY</div>
            <div className="facts-field-value">{submission.colour || '—'}</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">TIMES WORN</div>
            <div className="facts-field-value">{submission.timesWorn || '—'}</div>
          </div>
          <div className="facts-field">
            <div className="facts-field-label">YEAR OF PURCHASE</div>
            <div className="facts-field-value">{submission.yearOfPurchase || '—'}</div>
          </div>
          <div className="facts-field facts-field-full">
            <div className="facts-field-label">CONDITION — SELF-GRADED</div>
            <div className="facts-field-value">{submission.selfGrade || '— not asked on this channel'}</div>
            {submission.selfGrade && (
              <div className="facts-field-hint">Their pick from the form's options — ours is set in the worksheet.</div>
            )}
          </div>
          {hasMeasurements && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">MEASUREMENTS — AS TOLD (IN)</div>
              <div className="facts-field-value">{formatMeasurements(measurements)}</div>
              {measurements.notes && (
                <div className="facts-field-hint">{measurements.notes}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* APPROXIMATE ORIGINAL PRICE - Full width */}
      <div className="facts-group">
        <div className="facts-group-header">APPROXIMATE ORIGINAL PRICE — AS CLAIMED</div>
        <div className="facts-grid">
          <div className="facts-field facts-field-full">
            <div className="facts-field-value price-value">{submission.originalPrice ? inr(parseFloat(submission.originalPrice.replace(/[^0-9.]/g, ''))) : '—'}</div>
            <PriceVerification submission={submission} onUpdate={onUpdate} />
            <div className="facts-field-hint">The claim stands until verified — the verified figure becomes the storefront strike-through.</div>
          </div>
        </div>
      </div>

      {/* PREFERRED OUTCOME - Full width */}
      <div className="facts-group">
        <div className="facts-group-header">PREFERRED OUTCOME</div>
        <div className="facts-grid">
          <div className="facts-field facts-field-full">
            <div className="facts-field-label">WHAT THEY'D LIKE TO DO</div>
            <div className="facts-field-value">{submission.intent}</div>
          </div>
          {hasExpectation ? (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">PRICE EXPECTATION (IF SHARED)</div>
              <div className="facts-field-value">
                {submission.expectation?.rent && `Rent · ${submission.expectation.rent}`}
                {submission.expectation?.rent && submission.expectation?.sell && ' '}
                {submission.expectation?.sell && `Outright · ${submission.expectation.sell}`}
              </div>
              <div className="facts-field-hint">What the lister volunteered — a starting point for the conversation, not a listed price.</div>
            </div>
          ) : (
            <div className="facts-field facts-field-full">
              <div className="facts-field-value facts-no-expectation">
                Not shared — the website form stays price-free by design. The pricing conversation is ours, inside the 48-hour call.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IN THEIR WORDS - Full width */}
      <div className="facts-group">
        <div className="facts-group-header">IN THEIR WORDS</div>
        <div className="facts-grid">
          {submission.story && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">THEIR PIECE'S STORY</div>
              <div className="facts-field-value story-text">{submission.story}</div>
              <div className="facts-field-hint">Storefront gold — reuse it in the listing copy.</div>
            </div>
          )}
          {submission.notes && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">SPECIAL NOTES FOR OUR TEAM</div>
              <div className="facts-field-value">{submission.notes}</div>
            </div>
          )}
          {submission.conditionClaim && (
            <div className="facts-field facts-field-full">
              <div className="facts-field-label">CONDITION — ADDITIONAL NOTES</div>
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

      {/* AUTHENTICATION STRIP - §6.5 */}
      <AuthenticationStrip submission={submission} />
    </div>
  );
};