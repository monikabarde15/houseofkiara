import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isCheckingAuth: true,

      login: (userData, token) => {
        set({ 
          user: userData, 
          token: token || get().token, 
          isAuthenticated: true,
          isCheckingAuth: false,
        });
        toast.success('Successfully logged in!');
      },
      
      setUser: (userData) => {
        set((state) => ({
          user: typeof userData === 'function' ? userData(state.user) : { ...state.user, ...userData },
        }));
      },

      updateProfile: async (profileUpdates) => {
        const { token, user } = get();
        if (!token) return { success: false, message: 'Not authenticated' };

        try {
          const response = await fetch('/api/customer/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileUpdates),
          });

          const result = await response.json();
          if (response.ok && result.success) {
            set({
              user: { ...user, ...result.data },
            });
            return { success: true, data: result.data };
          } else {
            return { success: false, message: result.message || 'Failed to update profile' };
          }
        } catch (error) {
          return { success: false, message: error.message || 'Network error while updating profile' };
        }
      },

      logout: (showToast = true) => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isCheckingAuth: false,
        });
        if (showToast) {
          toast.success('Successfully logged out!');
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false, isCheckingAuth: false });
          return null;
        }

        try {
          const response = await fetch('/api/customer/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json().catch(() => ({}));

          if (response.ok && result.success) {
            set({
              user: result.data,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
            return result.data;
          } else if (response.status === 401 || response.status === 403) {
            // Explicit authentication failure / expired token / suspended account
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isCheckingAuth: false,
            });
            return null;
          } else {
            // Temporary server or 500 error: retain cached session
            set({ isCheckingAuth: false });
            return get().user;
          }
        } catch (networkErr) {
          // Network offline / fetch failure: retain cached session
          set({ isCheckingAuth: false });
          return get().user;
        }
      },
    }),
    {
      name: 'hok-customer-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
