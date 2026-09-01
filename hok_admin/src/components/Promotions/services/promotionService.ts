// Promotion Service
/* ========================================
   Promotions Module - Promotion Service
   All API calls for promo codes
   Based on HOK_Promotions_Logic_Spec_v150.pdf
   ======================================== */

import { PromoCode, PromoCodeFilter, PromoCodeSort } from '../types/promotions.types';
import { mockPromoCodes } from '../data/mockPromotions';

export const promotionService = {
  // Get all promo codes with optional filters
  async getPromoCodes(filter?: PromoCodeFilter, sort?: PromoCodeSort): Promise<PromoCode[]> {
    // In production: API call to /api/promotions
    await new Promise(resolve => setTimeout(resolve, 500));
    let codes = [...mockPromoCodes];
    
    if (filter?.search) {
      const search = filter.search.toLowerCase();
      codes = codes.filter(code =>
        code.code.toLowerCase().includes(search) ||
        code.publicDesc.toLowerCase().includes(search) ||
        code.reason.toLowerCase().includes(search)
      );
    }
    
    return codes;
  },

  // Get single promo code
  async getPromotion(codeId: string): Promise<PromoCode | null> {
    // In production: API call to /api/promotions/:codeId
    await new Promise(resolve => setTimeout(resolve, 300));
    const code = mockPromoCodes.find(c => c.code === codeId);
    return code || null;
  },

  // Create promo code
  async createPromotion(data: Partial<PromoCode>): Promise<PromoCode> {
    // In production: POST to /api/promotions
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCode: PromoCode = {
      code: data.code!.toUpperCase(),
      type: data.type!,
      value: data.value!,
      maxDiscount: data.maxDiscount || null,
      minOrder: data.minOrder || null,
      modes: data.modes!,
      scope: data.scope || { categories: [], designerIds: [], skus: [] },
      stacksWith: data.stacksWith || [],
      audience: data.audience || 'public',
      customerIds: data.customerIds || [],
      firstOrderOnly: data.firstOrderOnly || false,
      usesTotalCap: data.usesTotalCap || null,
      usesPerCustomer: data.usesPerCustomer || null,
      validFrom: data.validFrom || null,
      validUntil: data.validUntil || null,
      status: 'Active',
      visibility: data.visibility || 'share',
      publicDesc: data.publicDesc || '',
      reason: data.reason!,
      notes: data.notes || '',
      createdBy: 'Soumya',
      createdOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      history: [{ e: 'Code created', t: `${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - Soumya` }],
      attnSnooze: {},
    };
    return newCode;
  },

  // Update promo code
  async updatePromotion(codeId: string, data: Partial<PromoCode>): Promise<PromoCode> {
    // In production: PUT to /api/promotions/:codeId
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockPromoCodes.find(c => c.code === codeId);
    if (!existing) throw new Error('Code not found');
    return { ...existing, ...data };
  },

  // Pause promo code
  async pausePromotion(codeId: string): Promise<void> {
    // In production: POST to /api/promotions/:codeId/pause
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  // Resume promo code
  async resumePromotion(codeId: string): Promise<void> {
    // In production: POST to /api/promotions/:codeId/resume
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  // Delete promo code
  async deletePromotion(codeId: string): Promise<void> {
    // In production: DELETE to /api/promotions/:codeId
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  // Copy promo code (frozen terms)
  async copyPromotion(codeId: string, changes: Partial<PromoCode>): Promise<PromoCode> {
    // In production: POST to /api/promotions/:codeId/copy
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockPromoCodes.find(c => c.code === codeId);
    if (!existing) throw new Error('Code not found');
    
    const newCode: PromoCode = {
      ...existing,
      ...changes,
      code: `${codeId}-V2`,
      status: 'Active',
      createdOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      history: [
        { e: `Created as an edited copy of ${codeId}`, t: `${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - Soumya` }
      ],
      supersedes: codeId,
    };
    return newCode;
  },

  // Get refused attempts
  async getRefusedAttempts(): Promise<any[]> {
    // In production: GET to /api/promotions/refused-attempts
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },

  // Get redemption count for a code
  async getRedemptions(codeId: string): Promise<number> {
    // In production: GET to /api/promotions/:codeId/redemptions
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.floor(Math.random() * 100);
  },
};