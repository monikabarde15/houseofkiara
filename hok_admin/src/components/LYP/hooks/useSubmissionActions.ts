// src/components/LYP/hooks/useSubmissionActions.ts

import { useState, useCallback } from 'react';
import { Submission } from '../types/submission.types';
import { submissionService } from '../services/submissionService';

export const useSubmissionActions = (submissionId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (by: string = 'Soumya') => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.approveSubmission(submissionId, by);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  const reject = useCallback(async (reasonCode: string, optionalNote?: string, by: string = 'Soumya') => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.rejectSubmission(submissionId, reasonCode, optionalNote, by);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  const withdraw = useCallback(async (reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.withdrawSubmission(submissionId, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  const expire = useCallback(async (reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.expireSubmission(submissionId, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to expire submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  const requestMoreInfo = useCallback(async (message: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.requestMoreInfo(submissionId, message);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request more info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  const replyReceived = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.replyReceived(submissionId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process reply');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  const sendNudge = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.sendNudge(submissionId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send nudge');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  return {
    approve,
    reject,
    withdraw,
    expire,
    requestMoreInfo,
    replyReceived,
    sendNudge,
    loading,
    error,
  };
};