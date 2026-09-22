// src/components/Listers/hooks/useListers.ts

import { useState, useEffect, useCallback } from 'react';
import { Lister, ListerFilters } from '../types/lister.types';
import { listerService } from '../services/listerService';

export const useListers = (filters?: ListerFilters) => {
  const [listers, setListers] = useState<Lister[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allPayouts, setAllPayouts] = useState<any[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const search = filters?.search;
  const status = filters?.status;
  const sortBy = filters?.sortBy;
  const sortOrder = filters?.sortOrder;

  const fetchListers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listerService.getListers({ search, status, sortBy, sortOrder });
      setListers(result.data);
      setTotalCount(result.total);

      // Fetch aggregated data for the table
      const [productsRes, payoutsRes, submissionsRes] = await Promise.all([
        listerService.getAllProducts(),
        import('../../../services/payoutApi').then(api => api.getPayouts()),
        import('../../../services/listerApi').then(api => api.getSubmissions())
      ]);
      setAllProducts(productsRes || []);
      setAllPayouts(payoutsRes.data || []);
      setAllSubmissions(submissionsRes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listers');
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, sortOrder]);

  const refreshListers = useCallback(() => {
    fetchListers();
  }, [fetchListers]);

  useEffect(() => {
    fetchListers();
  }, [fetchListers]);

  const deleteLister = useCallback(async (id: string) => {
    await listerService.deleteLister(id);
    await fetchListers();
  }, [fetchListers]);

  const createLister = useCallback(async (data: Partial<Lister>) => {
    const created = await listerService.createLister(data);
    await fetchListers();
    return created;
  }, [fetchListers]);

  return {
    listers,
    loading,
    error,
    totalCount,
    refreshListers,
    deleteLister,
    createLister,
    allProducts,
    allPayouts,
    allSubmissions,
  };
};

export default useListers;