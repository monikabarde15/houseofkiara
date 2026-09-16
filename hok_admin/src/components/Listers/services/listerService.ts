import { 
  Lister, 
  Submission, 
  PayoutTransaction, 
  ActivityEntry,
  CommunicationEntry,
  RecallRequest,
  ListerFilters
} from '../types/lister.types';

import { listerApi } from '../../../services/listerApi';
import { apiRequest } from '../../../services/apiClient';

export const listerService = {
  // Lister CRUD
  getListers: async (filters?: ListerFilters): Promise<{ data: Lister[]; total: number }> => {
    const apiListers = await listerApi.getListers({
      search: filters?.search,
      status: filters?.status,
    });
    
    let data = [...(apiListers || [])];

    if (filters?.sortBy) {
      data.sort((a, b) => {
        let aVal: any = a[filters.sortBy as keyof Lister];
        let bVal: any = b[filters.sortBy as keyof Lister];
        
        if (filters.sortBy === 'name') {
          aVal = a.name;
          bVal = b.name;
        }
        
        if (filters.sortBy === 'joined') {
          aVal = a.joined;
          bVal = b.joined;
        }
        
        if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return { data, total: data.length };
  },

  getListerById: async (id: string): Promise<Lister> => {
    return await listerApi.getListerById(id);
  },

  createLister: async (listerData: Partial<Lister>): Promise<Lister> => {
    return await listerApi.createLister(listerData);
  },

  updateLister: async (id: string, updates: Partial<Lister>): Promise<Lister> => {
    return await listerApi.updateLister(id, updates);
  },

  deleteLister: async (id: string): Promise<void> => {
    if (!id) return;
    await listerApi.deleteLister(id);
  },

  // Submissions
  getSubmissions: async (listerId?: string): Promise<Submission[]> => {
    return await listerApi.getSubmissions(listerId);
  },

  createSubmission: async (listerId: string, submission: Submission): Promise<Submission> => {
    return await listerApi.createListerSubmission({ ...submission, listerId });
  },

  approveSubmission: async (listerId: string, subid: string, by: string): Promise<Submission> => {
    return await listerApi.updateSubmissionDecision(subid, {
      what: 'Approved',
      on: new Date().toISOString(),
      by,
      reason: null,
    });
  },

  rejectSubmission: async (listerId: string, subid: string, by: string, reason: string): Promise<Submission> => {
    return await listerApi.updateSubmissionDecision(subid, {
      what: 'Rejected',
      on: new Date().toISOString(),
      by,
      reason,
    });
  },

  withdrawSubmission: async (listerId: string, subid: string, reason: string): Promise<Submission> => {
    return await listerApi.updateSubmissionDecision(subid, {
      what: 'Withdrawn',
      on: new Date().toISOString(),
      by: 'Lister',
      reason,
    });
  },

  requestMoreInfo: async (listerId: string, subid: string, message: string): Promise<Submission> => {
    return await listerApi.requestSubmissionMoreInfo(subid, {
      on: new Date().toISOString(),
    });
  },

  getListings: async (listerId: string): Promise<any[]> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/listings`)).data || [];
  },

  getAllProducts: async (): Promise<any[]> => {
    return (await apiRequest('/products')).data || [];
  },

  getRecalls: async (listerId: string): Promise<RecallRequest[]> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/recalls`)).data || [];
  },

  createRecall: async (listerId: string, pieceId: string, reason: string): Promise<RecallRequest> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/recalls`, { method: 'POST', body: JSON.stringify({ pieceId, reason }) })).data;
  },

  updateRecall: async (listerId: string, recallId: string, updates: Partial<RecallRequest>): Promise<RecallRequest> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/recalls/${encodeURIComponent(recallId)}`, { method: 'PATCH', body: JSON.stringify(updates) })).data;
  },

  cancelRecall: async (listerId: string, recallId: string): Promise<void> => {
    await apiRequest(`/listers/${encodeURIComponent(listerId)}/recalls/${encodeURIComponent(recallId)}`, { method: 'PATCH', body: JSON.stringify({ status: 'Declined', declinedReason: 'Cancelled' }) });
  },

  schedulePickup: async (listerId: string, recallId: string, pickupDate: string): Promise<RecallRequest> => {
    return listerService.updateRecall(listerId, recallId, { status: 'Scheduled', scheduledDate: pickupDate });
  },

  declineRecall: async (listerId: string, recallId: string, reason: string): Promise<RecallRequest> => {
    return listerService.updateRecall(listerId, recallId, { status: 'Declined', declinedReason: reason });
  },

  markRecallReturned: async (listerId: string, recallId: string): Promise<RecallRequest> => {
    return listerService.updateRecall(listerId, recallId, { status: 'Returned' });
  },

  getPayouts: async (listerId: string): Promise<PayoutTransaction[]> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/payouts`)).data || [];
  },

  getCommunications: async (listerId: string): Promise<CommunicationEntry[]> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/communications`)).data || [];
  },

  logCommunication: async (listerId: string, channel: string, text: string): Promise<CommunicationEntry> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/communications`, { method: 'POST', body: JSON.stringify({ channel, text }) })).data;
  },

  getActivities: async (listerId: string): Promise<ActivityEntry[]> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/activities`)).data || [];
  },

  logActivity: async (listerId: string, color: 'sage' | 'gold' | 'terra' | 'muted', text: string): Promise<ActivityEntry> => {
    return (await apiRequest(`/listers/${encodeURIComponent(listerId)}/activities`, { method: 'POST', body: JSON.stringify({ color, text }) })).data;
  },

  verifyBank: async (listerId: string): Promise<Lister> => {
    return await listerApi.updateBankDetails(listerId, { verified: true });
  },

  unverifyBank: async (listerId: string): Promise<Lister> => {
    return await listerApi.updateBankDetails(listerId, { verified: false });
  },

  verifyPAN: async (listerId: string): Promise<Lister> => {
    return await listerApi.updateLister(listerId, { panVerified: true });
  },
  approveRecall: async (listerId: string, recallId: string, pickupDate: string): Promise<RecallRequest> => {
    return listerService.schedulePickup(listerId, recallId, pickupDate);
  },
};
