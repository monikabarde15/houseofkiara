// src/components/LYP/hooks/useIntake.ts

import { useState, useCallback } from 'react';
import { Submission, Media, Measurements, Channel, Intent } from '../types/submission.types';
import { submissionService } from '../services/submissionService';
import { generateSubId, generateSKU } from '../utils/generators';

interface IntakeData {
  listerId: string;
  channel: Channel;
  piece: string;
  category: string;
  designer: string;
  colour: string;
  size: string;
  measurements: Measurements | null;
  timesWorn: string;
  yearOfPurchase: string;
  originalPrice: string;
  intent: Intent;
  expectation: { rent: string | null; sell: string | null };
  selfGrade: string;
  conditionClaim: string;
  notes: string;
  media: Media[];
}

export const useIntake = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubmission = useCallback(async (data: IntakeData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate SUB-ID
      const existingIds = await submissionService.getAllSubmissionIds();
      const subid = generateSubId(existingIds);

      // Generate SKU
      let sku = null;
      if (data.designer) {
        const existingSKUs = await submissionService.getAllSKUs();
        sku = generateSKU(data.designer, existingSKUs);
      }

      const photos = data.media.filter(m => m.kind === 'image').length;
      const videos = data.media.filter(m => m.kind === 'video').length;

      const submission: Partial<Submission> = {
        subid,
        listerId: data.listerId || 'LST-GENERAL',
        listerID: data.listerId || 'LST-GENERAL',
        channel: data.channel,
        submittedAt: new Date().toISOString(),
        piece: data.piece,
        designer: data.designer,
        category: data.category as any,
        colour: data.colour as any,
        size: data.size as any,
        measurements: data.measurements,
        timesWorn: data.timesWorn as any,
        yearOfPurchase: data.yearOfPurchase,
        originalPrice: data.originalPrice,
        intent: data.intent,
        expectation: data.expectation,
        selfGrade: data.selfGrade,
        conditionClaim: data.conditionClaim,
        story: '',
        notes: data.notes,
        city: '', // Will be filled from lister profile
        photos,
        videos,
        media: data.media,
        terms: null,
        moreInfo: null,
        replyAt: null,
        decision: null,
        assessment: {
          sku: sku || '',
          name: data.piece,
          mode: data.intent === 'Rent it' ? 'Rental' : 
                data.intent === 'Sell it' ? 'Preloved' : 'Rental/Preloved',
          grade: 'Good',
          sizeLabel: data.size as any,
          measurements: data.measurements,
          priceStd: 0,
          priceExt: 0,
          perDay: 0,
          minDays: 4,
          deposit: 0,
          resalePrice: 0,
          minOffer: 0,
          retailPrice: 0,
          retailVerifiedVia: null,
          payoutPctRental: 40,
          payoutPctResale: 75,
        },
        history: [
          {
            c: 'muted',
            e: `Submission recorded via ${data.channel} — by Soumya`,
            t: new Date().toISOString(),
          }
        ],
      };

      const created = await submissionService.createSubmission(submission as Submission);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createSubmission,
    loading,
    error,
  };
};