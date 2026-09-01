// useTestBag Hook
/* ========================================
   Promotions Module - useTestBag Hook
   Try It Against a Bag state & evaluation
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 17.7
   ======================================== */

import { useState, useCallback, useMemo } from 'react';
import { TestBagItem, ShopperArchetype, TestBagResult, PromoCode } from '../types/promotions.types';

interface UseTestBagReturn {
  items: TestBagItem[];
  archetype: ShopperArchetype;
  result: TestBagResult | null;
  loading: boolean;
  addItem: (item: TestBagItem) => void;
  removeItem: (index: number) => void;
  clearBag: () => void;
  setArchetype: (type: ShopperArchetype) => void;
  evaluate: (code: PromoCode) => void;
}

export const useTestBag = (): UseTestBagReturn => {
  const [items, setItems] = useState<TestBagItem[]>([]);
  const [archetype, setArchetype] = useState<ShopperArchetype>('first-time');
  const [result, setResult] = useState<TestBagResult | null>(null);
  const [loading, setLoading] = useState(false);

  const addItem = useCallback((item: TestBagItem) => {
    setItems(prev => [...prev, item]);
    setResult(null);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setResult(null);
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
    setResult(null);
  }, []);

  const evaluate = useCallback(async (code: PromoCode) => {
    if (items.length === 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    try {
      // In production: call server-side evaluation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock evaluation logic
      const qualifyingLines = items.map(item => ({
        name: item.name,
        qualifies: code.modes.includes(item.mode) && !item.isAcceptedOffer,
        share: item.price,
      }));

      const qualifies = qualifyingLines.some(line => line.qualifies);
      const totalMerchandise = items.reduce((sum, item) => sum + item.price, 0);
      const qualifyingMerchandise = qualifyingLines
        .filter(line => line.qualifies)
        .reduce((sum, line) => sum + line.share, 0);

      let discount = 0;
      let refusedCheck: number | undefined;
      let sentence: string | undefined;

      // Run checks (simplified mock)
      if (!qualifies) {
        refusedCheck = 8; // Mode not covered
        sentence = 'This code applies to Rental orders.';
      } else if (code.minOrder && qualifyingMerchandise < code.minOrder) {
        refusedCheck = 11; // Under minimum
        sentence = `Add ${code.minOrder - qualifyingMerchandise} more in qualifying pieces to use this code.`;
      } else {
        // Calculate discount
        if (code.type === 'percent') {
          discount = Math.round(qualifyingMerchandise * code.value / 100);
          if (code.maxDiscount && discount > code.maxDiscount) {
            discount = code.maxDiscount;
          }
        } else if (code.type === 'flat') {
          discount = Math.min(code.value, qualifyingMerchandise);
        }
      }

      const gst = discount * 0.18; // Simplified GST
      const deliveryFree = code.type === 'freedel' || totalMerchandise >= 2999;

      setResult({
        qualifies: !refusedCheck,
        refusedCheck,
        sentence,
        qualifyingLines,
        discount,
        gst,
        deliveryFree,
        orderTotal: totalMerchandise - discount + gst,
      });
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setLoading(false);
    }
  }, [items]);

  return {
    items,
    archetype,
    result,
    loading,
    addItem,
    removeItem,
    clearBag,
    setArchetype,
    evaluate,
  };
};