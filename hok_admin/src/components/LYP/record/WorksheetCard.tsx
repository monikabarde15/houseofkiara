// src/components/LYP/record/WorksheetCard.tsx

import React, { useState } from 'react';
import { Submission, Assessment, Mode, Grade, Size } from '../types/submission.types';
import { WorksheetGrid } from './WorksheetGrid';
import { TapeBlock } from './TapeBlock';
import { StorefrontPreview } from './StorefrontPreview';
import { inr } from '../utils/formatter';
import { GRADES, MODES } from '../utils/constants';
import { submissionService } from '../services/submissionService';
import toast from 'react-hot-toast';
import './styles/WorksheetCard.css';

interface WorksheetCardProps {
  submission: Submission;
  onUpdate: () => void;
}

export const WorksheetCard: React.FC<WorksheetCardProps> = ({ submission, onUpdate }) => {
  const getDefaultAssessment = (): Assessment => {
    const existing = submission.assessment;
    
    // Parse values from string if needed, stripping commas
    const askRent = parseFloat(String((submission as any).askRent || submission.expectation?.rent || 0).replace(/,/g, '')) || 0;
    const askSell = parseFloat(String((submission as any).askSell || submission.expectation?.sell || 0).replace(/,/g, '')) || 0;
    const originalPrice = parseFloat(String(submission.originalPrice || 0).replace(/,/g, '')) || 0;

    const priceStd = (existing && existing.priceStd > 0) ? existing.priceStd : askRent;
    const resalePrice = (existing && existing.resalePrice > 0) ? existing.resalePrice : askSell;
    const retailPrice = (existing && existing.retailPrice > 0) ? existing.retailPrice : originalPrice;

    return {
      sku: existing?.sku || '',
      name: existing?.name || submission.piece || '',
      mode: existing?.mode || 'Rental/Preloved',
      grade: existing?.grade || 'Pristine',
      sizeLabel: existing?.sizeLabel || (submission.size as Size) || 'M',
      measurements: existing?.measurements || null,
      priceStd,
      priceExt: (existing && existing.priceExt > 0) ? existing.priceExt : Math.round(priceStd * 1.5),
      perDay: (existing && existing.perDay > 0) ? existing.perDay : Math.round(priceStd / 4),
      minDays: existing?.minDays || 4,
      deposit: (existing && existing.deposit > 0) ? existing.deposit : Math.round(retailPrice * 0.2),
      resalePrice,
      minOffer: (existing && existing.minOffer > 0) ? existing.minOffer : Math.round(resalePrice * 0.8),
      retailPrice,
      retailVerifiedVia: existing?.retailVerifiedVia || null,
      payoutPctRental: existing?.payoutPctRental || 40,
      payoutPctResale: existing?.payoutPctResale || 75,
    };
  };

  const [assessment, setAssessment] = useState<Assessment>(getDefaultAssessment());

  const handleAssessmentChange = async (updates: Partial<Assessment>) => {
    const updated = { ...assessment, ...updates };
    setAssessment(updated);
    try {
      await submissionService.updateSubmission(submission.subid, { assessment: updated });
      onUpdate();
    } catch (err: any) {
      toast.error('Failed to update assessment pricing');
    }
  };

  const isCustomSize = assessment.sizeLabel === 'Custom / Free Size';
  const mode = assessment.mode;
  const grade = assessment.grade;
  const isFair = grade === 'Fair';

  // Calculate meaning lines
  const hasRental = mode === 'Rental' || mode === 'Rental/Preloved';
  const hasPreloved = mode === 'Preloved' || mode === 'Rental/Preloved';
  const hasRentalPrice = assessment.priceStd > 0 || assessment.priceExt > 0;
  const hasPrelovedPrice = assessment.resalePrice > 0;

  return (
    <div className="worksheet-card card">
      <div className="worksheet-header">
        <span className="worksheet-title">Assessment & Pricing Worksheet</span>
        <span className="worksheet-note">Approving turns exactly this into the Draft product</span>
      </div>

      <div className="card-bd">
        <WorksheetGrid 
          assessment={assessment}
          submission={submission}
          onChange={handleAssessmentChange}
        />

        {/* Tape Block - hidden until Custom size */}
        {isCustomSize && (
          <TapeBlock 
            measurements={assessment.measurements}
            onChange={(measurements) => handleAssessmentChange({ measurements })}
          />
        )}

        {/* Storefront Preview */}
        {isCustomSize && (
          <StorefrontPreview 
            measurements={assessment.measurements}
            sizeLabel={assessment.sizeLabel}
          />
        )}

        {/* Meaning Line */}
        <div className="worksheet-meaning">
          {hasRental && (
            <div className="meaning-line">
              {hasRentalPrice ? (
                <>
                  Per standard rental: lister earns <strong>{inr(assessment.priceStd * (assessment.payoutPctRental / 100))}</strong> · HOK <strong>{inr(assessment.priceStd * (60 / 100))}</strong> · customer pays <strong>{inr(assessment.priceStd)}</strong> + 18% GST · deposit <strong>{inr(assessment.deposit)}</strong> on WhatsApp/UPI
                </>
              ) : (
                <span className="meaning-line-empty">
                  No rental pricing yet — you can still approve; the Draft holds publish until pricing is done.
                </span>
              )}
            </div>
          )}

          {hasPreloved && (
            <div className="meaning-line">
              {hasPrelovedPrice ? (
                <>
                  On the preloved sale: lister earns <strong>{inr(assessment.resalePrice * (assessment.payoutPctResale / 100))}</strong> · HOK <strong>{inr(assessment.resalePrice * (25 / 100))}</strong> · customer pays <strong>{inr(assessment.resalePrice)}</strong> + 5% GST
                  {assessment.minOffer > 0 && ` · offers floor ${inr(assessment.minOffer)}`}
                </>
              ) : (
                <span className="meaning-line-empty">
                  No preloved price yet — set it before publish.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};