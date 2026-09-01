// src/components/LYP/record/StorefrontPreview.tsx

import React from 'react';
import { Measurements } from '../types/submission.types';
import './styles/StorefrontPreview.css';

interface StorefrontPreviewProps {
  measurements: Measurements | null;
  sizeLabel: string;
}

export const StorefrontPreview: React.FC<StorefrontPreviewProps> = ({ 
  measurements, 
  sizeLabel 
}) => {
  const isCustom = sizeLabel === 'Custom / Free Size';
  const hasValues = measurements && Object.keys(measurements).some(
    k => k !== 'notes' && measurements[k as keyof Measurements]
  );
  const hasFitNote = measurements?.notes;

  if (!isCustom) {
    return null;
  }

  if (!hasValues && !hasFitNote) {
    return (
      <div className="storefront-preview-invite">
        The size story writes itself here as you tape.
      </div>
    );
  }

  // Build the values string
  const valueParts: string[] = [];
  const keys: (keyof Measurements)[] = ['bust', 'waist', 'hips', 'shoulder', 'length', 'sleeve'];
  for (const key of keys) {
    if (measurements?.[key]) {
      valueParts.push(`${(key as string).charAt(0).toUpperCase()} ${measurements[key]}"`);
    }
  }
  const valuesString = valueParts.join(' · ');

  return (
    <div className="storefront-preview">
      <div className="storefront-preview-eyebrow">STOREFRONT PREVIEW — THE CUSTOMER READS</div>
      <div className="storefront-preview-card">
        <div className="storefront-preview-size">SIZE — CUSTOM FITTED</div>
        <div className="storefront-preview-values">{valuesString}</div>
        {measurements?.notes && (
          <div className="storefront-preview-fitnote">{measurements.notes}</div>
        )}
      </div>
    </div>
  );
};