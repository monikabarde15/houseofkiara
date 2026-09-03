// src/components/LYP/services/submissionService.ts

import { Submission, SubmissionFilters, PaginatedResponse } from '../types/submission.types';
import { apiRequest } from '../../../services/apiClient';

export const submissionService = {
  getSubmissions: async (filters?: SubmissionFilters): Promise<PaginatedResponse<Submission>> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.intent) queryParams.append('intent', filters.intent);
      if (filters?.channel) queryParams.append('channel', filters.channel);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await apiRequest(`/submissions${qs}`);
      const rawData = response.data || [];

      // Normalize fields if necessary
      const data: Submission[] = rawData.map((s: any) => ({
        subid: s.subid || s._id,
        listerID: s.listerId || s.listerID || '',
        channel: s.channel || 'Website',
        submittedAt: s.submittedAt || s.submitted || s.createdAt || new Date().toISOString(),
        piece: s.piece || '',
        designer: s.designer || '',
        category: s.category || '',
        colour: s.colour || '',
        size: s.size || 'Free Size',
        measurements: s.measurements || null,
        timesWorn: s.timesWorn || '',
        yearOfPurchase: s.yearOfPurchase || '',
        originalPrice: s.originalPrice || '',
        intent: s.intent || 'Open to both',
        expectation: s.expectation || { rent: s.askRent, sell: s.askSell },
        selfGrade: s.selfGrade || s.conditionClaim || '',
        conditionClaim: s.conditionClaim || '',
        story: s.story || '',
        notes: s.notes || '',
        city: s.city || '',
        photos: s.photos || (s.media ? s.media.filter((m: any) => m.kind === 'image').length : 0),
        videos: s.videos || (s.media ? s.media.filter((m: any) => m.kind === 'video').length : 0),
        media: s.media || [],
        terms: s.terms || { version: 'LST-2026-01', acceptedAt: s.submitted || new Date().toISOString() },
        moreInfo: s.moreInfo || null,
        replyAt: s.replyAt || null,
        decision: s.decision || null,
        assessment: s.assessment || null,
        history: s.history || [],
      }));

      return {
        data,
        total: response.total !== undefined ? response.total : data.length,
        page: 1,
        limit: data.length,
      };
    } catch (err) {
      console.warn('Backend submissions API error or empty:', err);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 0,
      };
    }
  },

  getSubmissionById: async (id: string): Promise<Submission> => {
    const response = await apiRequest(`/submissions/${encodeURIComponent(id)}`);
    return response;
  },

  getAllSubmissionIds: async (): Promise<string[]> => {
    const response = await apiRequest('/submissions');
    const items = response.data || [];
    return items.map((s: any) => s.subid || s._id);
  },

  getAllSKUs: async (): Promise<string[]> => {
    const response = await apiRequest('/submissions');
    const items = response.data || [];
    return items
      .filter((s: any) => s.assessment?.sku || s.sku)
      .map((s: any) => s.assessment?.sku || s.sku);
  },

  createSubmission: async (submission: Partial<Submission>): Promise<Submission> => {
    return await apiRequest('/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  },

  approveSubmission: async (submissionId: string, by: string): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}/decision`, {
      method: 'PUT',
      body: JSON.stringify({
        decision: {
          what: 'Approved',
          on: new Date().toISOString(),
          by,
          reason: null,
        },
      }),
    });
  },

  rejectSubmission: async (submissionId: string, by: string, reasonCode: string, reason?: string): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}/decision`, {
      method: 'PUT',
      body: JSON.stringify({
        decision: {
          what: 'Rejected',
          on: new Date().toISOString(),
          by,
          reasonCode,
          reason: reason || null,
        },
      }),
    });
  },

  withdrawSubmission: async (submissionId: string, reason: string): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}/decision`, {
      method: 'PUT',
      body: JSON.stringify({
        decision: {
          what: 'Withdrawn',
          on: new Date().toISOString(),
          by: 'Lister',
          reason,
        },
      }),
    });
  },

  expireSubmission: async (submissionId: string): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}/decision`, {
      method: 'PUT',
      body: JSON.stringify({
        decision: {
          what: 'Expired',
          on: new Date().toISOString(),
          by: 'System',
          reason: '48-hour response window exceeded',
        },
      }),
    });
  },

  requestMoreInfo: async (submissionId: string, message: string): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}/more-info`, {
      method: 'PUT',
      body: JSON.stringify({
        moreInfo: {
          on: new Date().toISOString(),
          lastNudge: null,
        },
      }),
    });
  },

  nudgeLister: async (submissionId: string): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}/more-info`, {
      method: 'PUT',
      body: JSON.stringify({
        moreInfo: {
          on: new Date().toISOString(),
          lastNudge: new Date().toISOString(),
        },
      }),
    });
  },

  updateAssessment: async (submissionId: string, assessment: any): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}`, {
      method: 'PUT',
      body: JSON.stringify({ assessment }),
    });
  },

  updateSubmission: async (submissionId: string, updates: Partial<Submission>): Promise<Submission> => {
    return await apiRequest(`/submissions/${encodeURIComponent(submissionId)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};