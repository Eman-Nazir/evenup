import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false, // becomes true after first /auth/me check on app load
  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isInitialized: true }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, isInitialized: true }),
}));