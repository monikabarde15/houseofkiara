// src/components/LYP/hooks/useSubmissions.ts

import { useState, useEffect, useCallback } from 'react';
import { Submission, SubmissionFilters } from '../types/submission.types';
import { submissionService } from '../services/submissionService';
import { getSubmissionStatus, getLiveClockHours } from '../utils/derived';

export const useSubmissions = (filters?: SubmissionFilters) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await submissionService.getSubmissions(filters);
      setSubmissions(result.data);
      setTotalCount(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshSubmissions = useCallback(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getSortedSubmissions = useCallback(() => {
    const sorted = [...submissions];
    sorted.sort((a, b) => {
      // Undecided first
      const aDecided = !!a.decision;
      const bDecided = !!b.decision;
      
      if (aDecided && !bDecided) return 1;
      if (!aDecided && bDecided) return -1;
      
      if (!aDecided && !bDecided) {
        // Oldest live clock first
        const aClock = getLiveClockHours(a);
        const bClock = getLiveClockHours(b);
        return bClock - aClock;
      }
      
      // Decided: newest verdicts first
      const aDate = new Date(a.decision?.on || 0).getTime();
      const bDate = new Date(b.decision?.on || 0).getTime();
      return bDate - aDate;
    });
    return sorted;
  }, [submissions]);

  const getSubmissionById = useCallback((id: string) => {
    return submissions.find(s => s.subid === id) || null;
  }, [submissions]);

  return {
    submissions,
    loading,
    error,
    totalCount,
    refreshSubmissions,
    getSortedSubmissions,
    getSubmissionById,
  };
};
