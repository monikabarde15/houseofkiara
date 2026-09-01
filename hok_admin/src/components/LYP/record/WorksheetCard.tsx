// src/components/LYP/record/WorksheetCard.tsx

import React, { useState } from 'react';
import { Submission, Assessment, Mode, Grade, Size } from '../types/submission.types';
import { WorksheetGrid } from './WorksheetGrid';
import { TapeBlock } from './TapeBlock';
import { StorefrontPreview } from './StorefrontPreview';
import { inr } from '../utils/formatter';
import { GRADES, MODES } from '../utils/constants';
import './styles/WorksheetCard.css';

interface WorksheetCardProps {
  submission: Submission;
  onUpdate: () => void;
}

export const WorksheetCard: React.FC<WorksheetCardProps> = ({ submission, onUpdate }) => {
  const [assessment, setAssessment] = useState<Assessment>(submission.assessment);

  const handleAssessmentChange = (updates: Partial<Assessment>) => {
    setAssessment(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    // In production, this would save to the server
    onUpdate();
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