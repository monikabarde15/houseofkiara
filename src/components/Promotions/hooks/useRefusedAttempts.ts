// useRefusedAttempts Hook
/* ========================================
   Promotions Module - useRefusedAttempts Hook
   Refusal log fetching
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 22
   ======================================== */

import { useState, useEffect, useCallback } from 'react';
import { RefusedAttempt } from '../types/promotions.types';

interface UseRefusedAttemptsReturn {
  attempts: RefusedAttempt[];
  loading: boolean;
  error: string | null;
  getAttemptsForCode: (code: string) => RefusedAttempt[];
  getUnknownCodes: () => { code: string; count: number; lastAttempt: string }[];
  refresh: () => void;
}

export const useRefusedAttempts = (): UseRefusedAttemptsReturn => {
  const [attempts, setAttempts] = useState<RefusedAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // In production: await promotionService.getRefusedAttempts()
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data
      const mockAttempts: RefusedAttempt[] = [
        {
          timestamp: '2026-03-23T10:30:00',
          code: 'KAIRA10',
          customer: 'cust_001',
          check: 11,
          messageKey: 'minimum',
          bagValue: 2500,
        },
        {
          timestamp: '2026-03-23T11:15:00',
          code: 'KAIRA20',
          customer: null,
          check: 1,
          messageKey: 'exists',
          bagValue: 5000,
        },
        {
          timestamp: '2026-03-20T22:35:00',
          code: 'BRIDAL500',
          customer: 'Riya Mehta',
          check: 11,
          messageKey: 'minimum',
          bagValue: 4200,
        },
      ];
      
      setAttempts(mockAttempts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch refused attempts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const getAttemptsForCode = useCallback((code: string): RefusedAttempt[] => {
    return attempts.filter(a => a.code === code);
  }, [attempts]);

  const getUnknownCodes = useCallback(() => {
    const unknownMap = new Map<string, { count: number; lastAttempt: string }>();
    
    // In production: these are codes that don't exist in the registry
    const unknownCodes = attempts.filter(a => a.code === 'KAIRA20');
    
    for (const attempt of unknownCodes) {
      const existing = unknownMap.get(attempt.code);
      if (existing) {
        existing.count++;
        if (attempt.timestamp > existing.lastAttempt) {
          existing.lastAttempt = attempt.timestamp;
        }
      } else {
        unknownMap.set(attempt.code, {
          count: 1,
          lastAttempt: attempt.timestamp,
        });
      }
    }
    
    return Array.from(unknownMap.entries()).map(([code, data]) => ({
      code,
      count: data.count,
      lastAttempt: data.lastAttempt,
    }));
  }, [attempts]);

  const refresh = useCallback(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  return {
    attempts,
    loading,
    error,
    getAttemptsForCode,
    getUnknownCodes,
    refresh,
  };
};