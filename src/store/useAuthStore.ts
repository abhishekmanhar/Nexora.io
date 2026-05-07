import { create } from 'zustand';
import { User } from 'firebase/auth';

export type Role = 'guest' | 'candidate' | 'recruiter' | 'admin';

interface AuthState {
  user: User | null;
  role: Role;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  setAuthReady: (ready: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'guest',
  isAuthReady: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setAuthReady: (isAuthReady) => set({ isAuthReady }),
}));
