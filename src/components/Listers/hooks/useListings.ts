// src/components/Listers/hooks/useListings.ts

import { useState, useCallback } from 'react';
import { RecallRequest } from '../types/lister.types';
import { listerService } from '../services/listerService';
import { calculateUtilization } from '../utils/derived';

export const useListings = (listerId: string) => {
  const [listings, setListings] = useState<any[]>([]);
  const [recalls, setRecalls] = useState<RecallRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listingsData, recallsData] = await Promise.all([
        listerService.getListings(listerId),
        listerService.getRecalls(listerId),
      ]);
      setListings(listingsData);
      setRecalls(recallsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const utilization = calculateUtilization(listings);

  const createRecall = useCallback(async (pieceId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const recall = await listerService.createRecall(listerId, pieceId, reason);
      setRecalls(prev => [recall, ...prev]);
      return recall;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recall');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const approveRecall = useCallback(async (recallId: string, pickupDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listerService.approveRecall(listerId, recallId, pickupDate);
      setRecalls(prev => prev.map(r => 
        r.id === recallId ? updated : r
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve recall');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const declineRecall = useCallback(async (recallId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listerService.declineRecall(listerId, recallId, reason);
      setRecalls(prev => prev.map(r => 
        r.id === recallId ? updated : r
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline recall');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const markReturned = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listerService.markRecallReturned(listerId, recallId);
      setRecalls(prev => prev.map(r => 
        r.id === recallId ? updated : r
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark returned');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  return {
    listings,
    recalls,
    loading,
    error,
    utilization,
    fetchListings,
    createRecall,
    approveRecall,
    declineRecall,
    markReturned,
  };
};

export default useListings;