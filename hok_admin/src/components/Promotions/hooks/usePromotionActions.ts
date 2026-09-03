// usePromotionActions Hook
/* ========================================
   Promotions Module - usePromotionActions Hook
   Create, update, pause, resume, delete
   Based on HOK_Promotions_Logic_Spec_v150.pdf Sections 14, 17.6
   ======================================== */

import { useState, useCallback } from 'react';
import { PromoCode } from '../types/promotions.types';
import { validatePromoCode } from '../utils/validators';
import { promotionService } from '../services/promotionService';

interface UsePromotionActionsReturn {
  creating: boolean;
  updating: boolean;
  error: string | null;
  createCode: (data: Partial<PromoCode>) => Promise<PromoCode | null>;
  updateCode: (codeId: string, data: Partial<PromoCode>) => Promise<PromoCode | null>;
  pauseCode: (codeId: string) => Promise<boolean>;
  resumeCode: (codeId: string) => Promise<boolean>;
  deleteCode: (codeId: string) => Promise<boolean>;
  copyCode: (codeId: string, changes: Partial<PromoCode>) => Promise<PromoCode | null>;
}

export const usePromotionActions = (): UsePromotionActionsReturn => {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCode = useCallback(async (data: Partial<PromoCode>): Promise<PromoCode | null> => {
    setCreating(true);
    setError(null);
    try {
      // Validate
      const errors = validatePromoCode(
        data.code || '',
        data.reason || '',
        data.type || 'percent',
        data.value || null,
        data.maxDiscount || null,
        data.minOrder || null,
        data.modes || [],
        data.scope ? true : false,
        data.scope?.categories || [],
        data.scope?.designerIds || [],
        data.scope?.skus || [],
        data.validFrom || null,
        data.validUntil || null,
        data.usesTotalCap || null,
        data.usesPerCustomer || null,
        data.audience || 'public',
        data.customerIds || [],
        [], // existing codes - will be checked in service
      );

      if (errors.length > 0) {
        setError(errors[0].message);
        setCreating(false);
        return null;
      }

      const newCode = await promotionService.createPromotion(data);
      setCreating(false);
      return newCode;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create code');
      setCreating(false);
      return null;
    }
  }, []);

  const updateCode = useCallback(async (codeId: string, data: Partial<PromoCode>): Promise<PromoCode | null> => {
    setUpdating(true);
    setError(null);
    try {
      const updatedCode = await promotionService.updatePromotion(codeId, data);
      setUpdating(false);
      return updatedCode;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update code');
      setUpdating(false);
      return null;
    }
  }, []);

  const pauseCode = useCallback(async (codeId: string): Promise<boolean> => {
    setError(null);
    try {
      await promotionService.toggleStatus(codeId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause code');
      return false;
    }
  }, []);

  const resumeCode = useCallback(async (codeId: string): Promise<boolean> => {
    setError(null);
    try {
      await promotionService.toggleStatus(codeId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume code');
      return false;
    }
  }, []);

  const deleteCode = useCallback(async (codeId: string): Promise<boolean> => {
    setError(null);
    try {
      await promotionService.deletePromotion(codeId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete code');
      return false;
    }
  }, []);

  const copyCode = useCallback(async (codeId: string, changes: Partial<PromoCode>): Promise<PromoCode | null> => {
    setError(null);
    try {
      // In production: await promotionService.copyPromotion(codeId, changes)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCode: PromoCode = {
        code: `${codeId}-V2`,
        type: changes.type || 'percent',
        value: changes.value || 0,
        maxDiscount: changes.maxDiscount || null,
        minOrder: changes.minOrder || null,
        modes: changes.modes || ['Rental'],
        scope: changes.scope || { categories: [], designerIds: [], skus: [] },
        stacksWith: [],
        audience: changes.audience || 'public',
        customerIds: changes.customerIds || [],
        firstOrderOnly: changes.firstOrderOnly || false,
        usesTotalCap: changes.usesTotalCap || null,
        usesPerCustomer: changes.usesPerCustomer || null,
        validFrom: changes.validFrom || null,
        validUntil: changes.validUntil || null,
        status: 'Active',
        visibility: changes.visibility || 'share',
        publicDesc: changes.publicDesc || '',
        reason: changes.reason || '',
        notes: changes.notes || '',
        createdBy: 'Soumya',
        createdOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        history: [
          { e: `Created as an edited copy of ${codeId}`, t: `${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - Soumya` }
        ],
        attnSnooze: {},
        supersedes: codeId,
      };

      return newCode;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy code');
      return null;
    }
  }, []);

  return {
    creating,
    updating,
    error,
    createCode,
    updateCode,
    pauseCode,
    resumeCode,
    deleteCode,
    copyCode,
  };
};