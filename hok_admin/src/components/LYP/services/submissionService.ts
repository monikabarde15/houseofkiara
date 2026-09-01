// src/components/LYP/services/submissionService.ts

import { Submission, SubmissionFilters, PaginatedResponse } from '../types/submission.types';
import { mockSubmissions } from '../data/mockSubmissions';

export const submissionService = {
  getSubmissions: async (filters?: SubmissionFilters): Promise<PaginatedResponse<Submission>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let data = [...mockSubmissions];
    
    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(s => 
        s.subid.toLowerCase().includes(search) ||
        s.piece.toLowerCase().includes(search) ||
        s.designer.toLowerCase().includes(search) ||
        s.category.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status) {
      // Status is derived, so we need to compute it
      // For mock, we'll filter by decision presence
      if (filters.status === 'Approved') {
        data = data.filter(s => s.decision?.what === 'Approved');
      } else if (filters.status === 'Rejected') {
        data = data.filter(s => s.decision?.what === 'Rejected');
      } else if (filters.status === 'Withdrawn') {
        data = data.filter(s => s.decision?.what === 'Withdrawn');
      } else if (filters.status === 'Expired') {
        data = data.filter(s => s.decision?.what === 'Expired');
      } else if (filters.status === 'Awaiting Reply') {
        data = data.filter(s => s.moreInfo && !s.decision);
      } else if (filters.status === 'In Review') {
        data = data.filter(s => s.replyAt && !s.moreInfo && !s.decision);
      } else if (filters.status === 'New') {
        data = data.filter(s => !s.replyAt && !s.moreInfo && !s.decision);
      }
    }
    
    if (filters?.intent) {
      data = data.filter(s => s.intent === filters.intent);
    }
    
    if (filters?.channel) {
      data = data.filter(s => s.channel === filters.channel);
    }
    
    if (filters?.dateFrom) {
      data = data.filter(s => s.submittedAt >= filters.dateFrom!);
    }
    
    if (filters?.dateTo) {
      data = data.filter(s => s.submittedAt <= filters.dateTo!);
    }
    
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
    };
  },

  getSubmissionById: async (id: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const submission = mockSubmissions.find(s => s.subid === id);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return submission;
  },

  getAllSubmissionIds: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockSubmissions.map(s => s.subid);
  },

  getAllSKUs: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockSubmissions
      .filter(s => s.assessment?.sku)
      .map(s => s.assessment!.sku);
  },

  createSubmission: async (submission: Submission): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In production, this would POST to the server
    return submission;
  },

  approveSubmission: async (submissionId: string, by: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      decision: {
        what: 'Approved',
        on: new Date().toISOString(),
        by,
        reason: undefined,
      },
      moreInfo: null,
    };
  },

  rejectSubmission: async (submissionId: string, reasonCode: string, optionalNote?: string, by?: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      decision: {
        what: 'Rejected',
        on: new Date().toISOString(),
        by: by || 'Soumya',
        reasonCode,
        reason: optionalNote,
      },
      moreInfo: null,
    };
  },

  withdrawSubmission: async (submissionId: string, reason: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
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

  expireSubmission: async (submissionId: string, reason: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      decision: {
        what: 'Expired',
        on: new Date().toISOString(),
        by: 'Soumya',
        reason,
      },
      moreInfo: null,
    };
  },

  requestMoreInfo: async (submissionId: string, message: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      moreInfo: {
        on: new Date().toISOString(),
        lastNudge: null,
      },
    };
  },

  replyReceived: async (submissionId: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      replyAt: new Date().toISOString(),
      moreInfo: null,
    };
  },

  sendNudge: async (submissionId: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      moreInfo: {
        ...submission.moreInfo!,
        lastNudge: new Date().toISOString(),
      },
    };
  },

  updateAssessment: async (submissionId: string, assessment: any): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      assessment: {
        ...submission.assessment,
        ...assessment,
      },
    };
  },

  addMedia: async (submissionId: string, media: any[]): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const submission = mockSubmissions.find(s => s.subid === submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      ...submission,
      media: [...submission.media, ...media],
      photos: submission.photos + media.filter(m => m.kind === 'image').length,
      videos: submission.videos + media.filter(m => m.kind === 'video').length,
    };
  },
};