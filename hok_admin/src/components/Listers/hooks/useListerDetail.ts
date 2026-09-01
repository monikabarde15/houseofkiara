// src/components/Listers/hooks/useListerDetail.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  Lister, 
  Submission, 
  PayoutTransaction, 
  ActivityEntry,
  CommunicationEntry,
  RecallRequest,
  ListerLedger,
  AttentionFlag
} from '../types/lister.types';
import { listerService } from '../services/listerService';
import { calculateLedger, calculateAttentionFlags } from '../utils/derived';

interface ListerDetailData {
  lister: Lister | null;
  submissions: Submission[];
  listings: any[];
  payouts: PayoutTransaction[];
  communications: CommunicationEntry[];
  activities: ActivityEntry[];
  recalls: RecallRequest[];
  ledger: ListerLedger;
  attentionFlags: AttentionFlag[];
  loading: boolean;
  error: string | null;
}

export const useListerDetail = (listerId: string, isCreateMode: boolean = false) => {
  const [data, setData] = useState<ListerDetailData>({
    lister: null,
    submissions: [],
    listings: [],
    payouts: [],
    communications: [],
    activities: [],
    recalls: [],
    ledger: {
      paid: 0,
      pending: 0,
      sales: 0,
      rentals: 0,
      tv: 0,
      paidCount: 0,
      avgPct: null,
    },
    attentionFlags: [],
    loading: true,
    error: null,
  });

  const fetchListerDetail = useCallback(async () => {
    if (isCreateMode) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [
        lister,
        submissions,
        listings,
        payouts,
        communications,
        activities,
        recalls,
      ] = await Promise.all([
        listerService.getListerById(listerId),
        listerService.getSubmissions(listerId),
        listerService.getListings(listerId),
        listerService.getPayouts(listerId),
        listerService.getCommunications(listerId),
        listerService.getActivities(listerId),
        listerService.getRecalls(listerId),
      ]);

      const ledger = calculateLedger(payouts);
      const attentionFlags = calculateAttentionFlags(lister, submissions, recalls, payouts);

      setData({
        lister,
        submissions,
        listings,
        payouts,
        communications,
        activities,
        recalls,
        ledger,
        attentionFlags,
        loading: false,
        error: null,
      });
    } catch (err) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch lister details',
      }));
    }
  }, [listerId, isCreateMode]);

  const refreshLister = useCallback(() => {
    fetchListerDetail();
  }, [fetchListerDetail]);

  useEffect(() => {
    fetchListerDetail();
  }, [fetchListerDetail]);

  return {
    ...data,
    refreshLister,
  };
};

export default useListerDetail;