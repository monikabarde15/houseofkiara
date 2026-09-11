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
          token: token, 
          isAuthenticated: true,
          isCheckingAuth: false,
        });
        toast.success('Successfully logged in!');
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
          const response = await fetch('/api/customer/auth/me', {
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
