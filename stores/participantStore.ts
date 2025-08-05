import { LeenkDataType } from '@/constants/mockUserData';
import { create } from 'zustand';

interface ParticipantStore {
  selectedUsers: LeenkDataType[];
  isSelectionMode: boolean;
  toggleUser: (user: LeenkDataType) => void;
  toggleSelectionMode: () => void;
  resetSelection: () => void;
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
  toggleSelectionMode: () =>
    set((state) => ({ isSelectionMode: !state.isSelectionMode })),
  resetSelection: () => set({ selectedUsers: [], isSelectionMode: false }),
}));
