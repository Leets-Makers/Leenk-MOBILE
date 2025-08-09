import { LeenkDataType } from '@/constants/mockUserData';
import { create } from 'zustand';

interface ParticipantStore {
  selectedUsers: LeenkDataType[];
  isSelectionMode: boolean;
  toggleUser: (user: LeenkDataType) => void;
  resetSelection: () => void;
  startSelection: () => void;
}

export const useParticipantStore = create<ParticipantStore>((set) => ({
  selectedUsers: [],
  isSelectionMode: false,
  toggleUser: (user) =>
    set((state) => {
      const exists = state.selectedUsers.some((u) => u.id === user.id);
      return {
        selectedUsers: exists
          ? state.selectedUsers.filter((u) => u.id !== user.id)
          : [...state.selectedUsers, user],
      };
    }),
  resetSelection: () => set({ selectedUsers: [], isSelectionMode: false }),
  startSelection: () => set({ isSelectionMode: true }),
}));
