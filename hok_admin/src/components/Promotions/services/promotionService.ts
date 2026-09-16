// Promotion Service
/* ========================================
   Promotions Module - Promotion Service
   Real API calls to backend at /api/promotions
   ======================================== */

import { PromoCode } from '../types/promotions.types';

import { API_BASE_URL } from '../../../services/apiClient';
const BASE = `${API_BASE_URL}/promotions`;

export const promotionService = {
  // GET all promo codes
  async getPromoCodes(): Promise<PromoCode[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch promo codes');
    const json = await res.json();
    return json.data || [];
  },

  // GET single promo code by code string
  async getPromotion(code: string): Promise<PromoCode | null> {
    const res = await fetch(`${BASE}/${code}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch promo code');
    const json = await res.json();
    return json.data || null;
  },

  // POST create new promo code
  async createPromotion(data: Partial<PromoCode>): Promise<PromoCode> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create promo code');
    }
    const json = await res.json();
    return json.data;
  },

  // PUT update promo code
  async updatePromotion(code: string, data: Partial<PromoCode>): Promise<PromoCode> {
    const res = await fetch(`${BASE}/${code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update promo code');
    }
    const json = await res.json();
    return json.data;
  },

  // PATCH toggle Active/Paused
  async toggleStatus(code: string, by = 'Admin'): Promise<PromoCode> {
    const res = await fetch(`${BASE}/${code}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ by }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to toggle promo code status');
    }
    const json = await res.json();
    return json.data;
  },

  // DELETE promo code
  async deletePromotion(code: string): Promise<void> {
    const res = await fetch(`${BASE}/${code}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete promo code');
    }
  },
};
