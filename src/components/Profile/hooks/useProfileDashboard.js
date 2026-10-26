import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../../store/authStore';
import useWishlistStore from '../../../store/wishlistStore';

export const useProfileDashboard = () => {
  const { token, isAuthenticated } = useAuthStore();
  const wishlistIds = useWishlistStore((state) => state.items);
  const [data, setData] = useState({
    rentals: [],
    purchases: [],
    savedPieces: [],
    listedPieces: [],
    submissions: [],
    addresses: [],
    counts: {
      rentals: 0,
      purchases: 0,
      savedPieces: 0,
      listedPieces: 0,
      submissions: 0,
      addresses: 0,
      activeRentals: 0,
    },
    activeRentalAlert: null,
    loading: true,
    error: null,
  });

  const fetchDashboard = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setData((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      const res = await fetch('/api/customer/profile/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok && result.success && result.data) {
        setData({
          rentals: result.data.rentals || [],
          purchases: result.data.purchases || [],
          savedPieces: result.data.savedPieces || [],
          listedPieces: result.data.listedPieces || [],
          submissions: result.data.submissions || [],
          addresses: result.data.addresses || [],
          counts: result.data.counts || {
            rentals: (result.data.rentals || []).length,
            purchases: (result.data.purchases || []).length,
            savedPieces: (result.data.savedPieces || []).length,
            listedPieces: (result.data.listedPieces || []).length,
            submissions: (result.data.submissions || []).length,
            addresses: (result.data.addresses || []).length,
            activeRentals: 0,
          },
          activeRentalAlert: result.data.activeRentalAlert || null,
          loading: false,
          error: null,
        });
      } else {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: result.message || 'Failed to fetch dashboard data',
        }));
      }
    } catch (err) {
      console.error('Failed to load profile dashboard:', err);
      setData((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard, wishlistIds]);

  return { ...data, refetch: fetchDashboard };
};

export default useProfileDashboard;
