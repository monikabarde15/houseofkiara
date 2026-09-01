// usePromotionActions Hook
/* ========================================
   Promotions Module - usePromotionActions Hook
   Create, update, pause, resume, delete
   Based on HOK_Promotions_Logic_Spec_v150.pdf Sections 14, 17.6
   ======================================== */

import { useState, useCallback } from 'react';
import { PromoCode } from '../types/promotions.types';
import { validatePromoCode } from '../utils/validators';

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

      // In production: await promotionService.createPromotion(data)
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
        createdBy: 'Soumya', // In production: get from auth
        createdOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        history: [{ e: 'Code created', t: `${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - Soumya` }],
        attnSnooze: {},
      };

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
      // In production: await promotionService.updatePromotion(codeId, data)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock update
      const updatedCode: PromoCode = {
        code: codeId,
        type: data.type || 'percent',
        value: data.value || 0,
        maxDiscount: data.maxDiscount || null,
        minOrder: data.minOrder || null,
        modes: data.modes || ['Rental'],
        scope: data.scope || { categories: [], designerIds: [], skus: [] },
        stacksWith: data.stacksWith || [],
        audience: data.audience || 'public',
        customerIds: data.customerIds || [],
        firstOrderOnly: data.firstOrderOnly || false,
        usesTotalCap: data.usesTotalCap || null,
        usesPerCustomer: data.usesPerCustomer || null,
        validFrom: data.validFrom || null,
        validUntil: data.validUntil || null,
        status: data.status || 'Active',
        visibility: data.visibility || 'share',
        publicDesc: data.publicDesc || '',
        reason: data.reason || '',
        notes: data.notes || '',
        createdBy: 'Soumya',
        createdOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        history: [{ e: 'Code updated', t: `${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - Soumya` }],
        attnSnooze: {},
      };

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
      // In production: await promotionService.pausePromotion(codeId)
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause code');
      return false;
    }
  }, []);

  const resumeCode = useCallback(async (codeId: string): Promise<boolean> => {
    setError(null);
    try {
      // In production: await promotionService.resumePromotion(codeId)
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume code');
      return false;
    }
  }, []);

  const deleteCode = useCallback(async (codeId: string): Promise<boolean> => {
    setError(null);
    try {
      // In production: await promotionService.deletePromotion(codeId)
      await new Promise(resolve => setTimeout(resolve, 300));
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