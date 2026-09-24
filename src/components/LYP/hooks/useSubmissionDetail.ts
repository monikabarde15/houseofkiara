// src/components/LYP/hooks/useSubmissionDetail.ts

import { useState, useEffect, useCallback } from 'react';
import { Submission } from '../types/submission.types';
import { submissionService } from '../services/submissionService';
import { useSubmissions } from './useSubmissions';

export const useSubmissionDetail = (submissionId: string) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [allIds, setAllIds] = useState<string[]>([]);

  const { submissions, refreshSubmissions } = useSubmissions();

  const fetchSubmission = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await submissionService.getSubmissionById(submissionId);
      setSubmission(data);
      
      // Get all IDs for navigation
      const ids = submissions.map(s => s.subid);
      setAllIds(ids);
      const index = ids.indexOf(submissionId);
      setCurrentIndex(index >= 0 ? index + 1 : 1);
      setTotalCount(ids.length || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submission');
    } finally {
      setLoading(false);
    }
  }, [submissionId, submissions]);

  const refreshSubmission = useCallback(() => {
    fetchSubmission();
    refreshSubmissions();
  }, [fetchSubmission, refreshSubmissions]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const goPrev = useCallback(() => {
    if (currentIndex <= 1) return;
    const prevId = allIds[currentIndex - 2];
    if (prevId) {
      window.location.href = `/lyp/${prevId}`;
    }
  }, [currentIndex, allIds]);

  const goNext = useCallback(() => {
    if (currentIndex >= totalCount) return;
    const nextId = allIds[currentIndex];
    if (nextId) {
      window.location.href = `/lyp/${nextId}`;
    }
  }, [currentIndex, totalCount, allIds]);

  const hasPrev = currentIndex > 1;
  const hasNext = currentIndex < totalCount;

  return {
    submission,
    loading,
    error,
    refreshSubmission,
    goPrev,
    goNext,
    hasPrev,
    hasNext,
    currentIndex,
    totalCount,
  };
};