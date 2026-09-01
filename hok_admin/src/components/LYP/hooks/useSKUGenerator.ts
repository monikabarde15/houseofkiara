// src/components/LYP/hooks/useSKUGenerator.ts

import { useState, useCallback } from 'react';
import { generateSKU } from '../utils/generators';
import { submissionService } from '../services/submissionService';

export const useSKUGenerator = (designer?: string) => {
  const [generatedSKU, setGeneratedSKU] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (designerName: string, fallback?: string) => {
    if (!designerName && !fallback) {
      setError('Designer name is required to generate SKU');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all existing SKUs from catalogue and queue
      const existingSKUs = await submissionService.getAllSKUs();
      const sku = generateSKU(designerName, existingSKUs, fallback);
      setGeneratedSKU(sku);
      return sku;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate SKU');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkCollision = useCallback(async (sku: string): Promise<boolean> => {
    try {
      const existingSKUs = await submissionService.getAllSKUs();
      return existingSKUs.includes(sku);
    } catch (error) {
      console.error('Failed to check SKU collision:', error);
      return false;
    }
  }, []);

  const validateSKU = useCallback((sku: string): boolean => {
    const pattern = /^HOK-[A-Z]{1,3}-\d{3}$/;
    return pattern.test(sku);
  }, []);

  return {
    generatedSKU,
    loading,
    error,
    generate,
    checkCollision,
    validateSKU,
  };
};