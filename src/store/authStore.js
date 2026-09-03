import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set({ 
          user: userData, 
          token: token, 
          isAuthenticated: true 
        });
        toast.success('Successfully logged in!');
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        toast.success('Successfully logged out!');
      },
    }),
    {
      name: 'hok-customer-auth', 
    }
  )
);

export default useAuthStore;
