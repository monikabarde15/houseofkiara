// src/components/Listers/hooks/useSubmissions.ts

import { useState, useCallback, useEffect } from 'react';
import { Submission } from '../types/lister.types';
import { listerService } from '../services/listerService';
import { generateSubId, generateSKU } from '../utils/generators';

export const useSubmissions = (listerId: string) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listerService.getSubmissions(listerId);
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getSubmissionForLister = useCallback((id: string) => {
    return submissions.find(s => s.listerId === id || s.subid === id) || null;
  }, [submissions]);

  const getLatestSubmission = useCallback(() => {
    if (submissions.length === 0) return null;
    return submissions[0];
  }, [submissions]);

  const getUndecidedSubmission = useCallback(() => {
    return submissions.find(s => !s.decision) || null;
  }, [submissions]);

  const createSubmission = useCallback(async (submissionData: Partial<Submission>) => {
    setLoading(true);
    setError(null);
    try {
      // Generate SUB-ID
      const existingIds = submissions.map(s => s.subid);
      const subid = generateSubId(existingIds);

      // Generate SKU if designer provided
      let sku = null;
      if (submissionData.designer) {
        const existingSKUs = submissions
          .filter(s => s.sku)
          .map(s => s.sku as string);
        sku = generateSKU(submissionData.designer, existingSKUs);
      }

      const newSubmission: Submission = {
        subid,
        listerId: listerId || submissionData.listerId || '',
        queueRow: null,
        piece: submissionData.piece || '',
        designer: submissionData.designer || '',
        category: submissionData.category || '',
        submitted: new Date().toISOString(),
        channel: submissionData.channel || 'WhatsApp',
        intent: submissionData.intent || 'Rent + Sell',
        askRent: submissionData.askRent || null,
        askSell: submissionData.askSell || null,
        conditionClaim: submissionData.conditionClaim || '',
        timesWorn: submissionData.timesWorn || '',
        originalPrice: submissionData.originalPrice || '',
        colour: submissionData.colour || '',
        size: submissionData.size || '',
        photos: submissionData.media?.filter(m => m.kind === 'image').length || 0,
        videos: submissionData.media?.filter(m => m.kind === 'video').length || 0,
        media: submissionData.media || [],
        notes: submissionData.notes || null,
        sku,
        decision: null,
        moreInfo: null,
      };

      const created = await listerService.createSubmission(listerId, newSubmission);
      setSubmissions(prev => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId, submissions]);

  const approveSubmission = useCallback(async (subid: string, by: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listerService.approveSubmission(listerId, subid, by);
      setSubmissions(prev => prev.map(s => 
        s.subid === subid ? updated : s
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const rejectSubmission = useCallback(async (subid: string, by: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listerService.rejectSubmission(listerId, subid, by, reason);
      setSubmissions(prev => prev.map(s => 
        s.subid === subid ? updated : s
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const withdrawSubmission = useCallback(async (subid: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listerService.withdrawSubmission(listerId, subid, reason);
      setSubmissions(prev => prev.map(s => 
        s.subid === subid ? updated : s
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const requestMoreInfo = useCallback(async (subid: string, message: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listerService.requestMoreInfo(listerId, subid, message);
      setSubmissions(prev => prev.map(s => 
        s.subid === subid ? updated : s
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request more info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  return {
    submissions,
    loading,
    error,
    fetchSubmissions,
    getSubmissionForLister,
    getLatestSubmission,
    getUndecidedSubmission,
    createSubmission,
    approveSubmission,
    rejectSubmission,
    withdrawSubmission,
    requestMoreInfo,
  };
};

export default useSubmissions;