import { create } from 'zustand';
import {
  setJustSignedUp as persistSet,
  getJustSignedUp,
  clearJustSignedUp as persistClear,
} from '@/utils/authFlagStorage';

interface AuthFlagState {
  justSignedUp: boolean;
  hydrate: () => Promise<void>;
  setJustSignedUp: () => Promise<void>;
  clearJustSignedUp: () => Promise<void>;
}

export const useAuthFlagStore = create<AuthFlagState>((set) => ({
  justSignedUp: false,

  hydrate: async () => {
    const value = await getJustSignedUp();
    set({ justSignedUp: value });
  },

  setJustSignedUp: async () => {
    await persistSet(true);
    set({ justSignedUp: true });
  },

  clearJustSignedUp: async () => {
    await persistClear();
    set({ justSignedUp: false });
  },
}));
