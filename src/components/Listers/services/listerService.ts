// src/components/Listers/services/listerService.ts

import { 
  Lister, 
  Submission, 
  PayoutTransaction, 
  ActivityEntry,
  CommunicationEntry,
  RecallRequest,
  ListerFilters
} from '../types/lister.types';

// Mock data imports
import { mockListers, mockSubmissions, mockPayouts, mockActivities, mockCommunications, mockRecalls, mockProducts } from '../data/mockListers';

export const listerService = {
  // Lister CRUD
  getListers: async (filters?: ListerFilters): Promise<{ data: Lister[]; total: number }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let data = [...mockListers];
    
    // Apply filters
    if (filters?.status) {
      data = data.filter(l => l.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(l => 
        l.name.toLowerCase().includes(search) || 
        (l.email && l.email.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
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
    
    return {
      data,
      total: data.length,
    };
  },

  getListerById: async (id: string): Promise<Lister> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lister = mockListers.find(l => l.id === id);
    if (!lister) {
      throw new Error('Lister not found');
    }
    return lister;
  },

  createLister: async (listerData: Partial<Lister>): Promise<Lister> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLister: Lister = {
      id: `lister-${Date.now()}`,
      slug: listerData.slug || listerData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      name: listerData.name || '',
      initials: listerData.initials || '',
      phone: listerData.phone || '',
      email: listerData.email || null,
      city: listerData.city || '',
      address: listerData.address || { line1: '', line2: null, city: '', state: '', pin: '' },
      insta: listerData.insta || null,
      referral: listerData.referral || '',
      source: 'Manual (Admin)',
      joined: new Date().toISOString(),
      status: 'Verified',
      statusReason: null,
      pickup: listerData.pickup || { line1: '', line2: null, city: '', state: '', pin: '' },
      pickupPrefs: listerData.pickupPrefs || null,
      bank: listerData.bank || { holder: '', accct: '', ifsc: '', branch: '', upi: '', verified: false },
      gstReg: listerData.gstReg || false,
      gstin: listerData.gstin || null,
      pan: listerData.pan || null,
      panVerified: false,
      terms: {
        version: 'LST-2026-01',
        acceptedAt: new Date().toISOString(),
        channel: 'WhatsApp (manual onboarding)',
      },
      notes: listerData.notes || null,
    };
    return newLister;
  },

  updateLister: async (id: string, updates: Partial<Lister>): Promise<Lister> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const lister = mockListers.find(l => l.id === id);
    if (!lister) {
      throw new Error('Lister not found');
    }
    return { ...lister, ...updates };
  },

  // Submissions
  getSubmissions: async (listerId: string): Promise<Submission[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSubmissions.filter(s => s.subid.startsWith('SUB-2026-'));
  },

  createSubmission: async (listerId: string, submission: Submission): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return submission;
  },

  approveSubmission: async (listerId: string, subid: string, by: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === subid);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      decision: {
        what: 'Approved',
        on: new Date().toISOString(),
        by,
        reason: null,
      },
      moreInfo: null,
    };
  },

  rejectSubmission: async (listerId: string, subid: string, by: string, reason: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === subid);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      decision: {
        what: 'Rejected',
        on: new Date().toISOString(),
        by,
        reason,
      },
      moreInfo: null,
    };
  },

  withdrawSubmission: async (listerId: string, subid: string, reason: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === subid);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      decision: {
        what: 'Withdrawn',
        on: new Date().toISOString(),
        by: 'Lister',
        reason,
      },
      moreInfo: null,
    };
  },

  requestMoreInfo: async (listerId: string, subid: string, message: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const submission = mockSubmissions.find(s => s.subid === subid);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      moreInfo: {
        on: new Date().toISOString(),
      },
    };
  },

  getListings: async (listerId: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.filter(p => p.listerId === listerId);
  },

  getAllProducts: async (): Promise<any[]> => {
    return mockProducts;
  },

  getRecalls: async (listerId: string): Promise<RecallRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockRecalls;
  },

  createRecall: async (listerId: string, pieceId: string, reason: string): Promise<RecallRequest> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: `recall-${Date.now()}`,
      pieceId,
      pieceName: 'Sample Piece',
      status: 'Requested',
      requestedDate: new Date().toISOString(),
      reason,
      scheduledDate: null,
      returnedDate: null,
      declinedDate: null,
      declinedReason: null,
    };
  },

  approveRecall: async (listerId: string, recallId: string, pickupDate: string): Promise<RecallRequest> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const recall = mockRecalls.find(r => r.id === recallId);
    if (!recall) {
      throw new Error('Recall not found');
    }
    return {
      ...recall,
      status: 'Scheduled',
      scheduledDate: pickupDate,
    };
  },

  declineRecall: async (listerId: string, recallId: string, reason: string): Promise<RecallRequest> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const recall = mockRecalls.find(r => r.id === recallId);
    if (!recall) {
      throw new Error('Recall not found');
    }
    return {
      ...recall,
      status: 'Declined',
      declinedDate: new Date().toISOString(),
      declinedReason: reason,
    };
  },

  markRecallReturned: async (listerId: string, recallId: string): Promise<RecallRequest> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const recall = mockRecalls.find(r => r.id === recallId);
    if (!recall) {
      throw new Error('Recall not found');
    }
    return {
      ...recall,
      status: 'Returned',
      returnedDate: new Date().toISOString(),
    };
  },

  // Payouts
  getPayouts: async (listerId: string): Promise<PayoutTransaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPayouts;
  },

  // Communications
  getCommunications: async (listerId: string): Promise<CommunicationEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCommunications;
  },

  logCommunication: async (listerId: string, channel: string, text: string): Promise<CommunicationEntry> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      id: `comm-${Date.now()}`,
      channel: channel as any,
      text,
      timestamp: new Date().toISOString(),
    };
  },

  // Activities
  getActivities: async (listerId: string): Promise<ActivityEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockActivities;
  },

  logActivity: async (listerId: string, color: 'sage' | 'gold' | 'terra' | 'muted', text: string): Promise<ActivityEntry> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      c: color,
      e: text,
      t: new Date().toISOString(),
    };
  },

  // Bank verification
  verifyBank: async (listerId: string): Promise<Lister> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lister = mockListers.find(l => l.id === listerId);
    if (!lister) {
      throw new Error('Lister not found');
    }
    return {
      ...lister,
      bank: {
        ...lister.bank,
        verified: true,
      },
    };
  },

  unverifyBank: async (listerId: string): Promise<Lister> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lister = mockListers.find(l => l.id === listerId);
    if (!lister) {
      throw new Error('Lister not found');
    }
    return {
      ...lister,
      bank: {
        ...lister.bank,
        verified: false,
      },
    };
  },

  verifyPAN: async (listerId: string): Promise<Lister> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lister = mockListers.find(l => l.id === listerId);
    if (!lister) {
      throw new Error('Lister not found');
    }
    return {
      ...lister,
      panVerified: true,
    };
  },
};