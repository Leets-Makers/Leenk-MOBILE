import { create } from 'zustand';
import { LeenkParticipantItem } from '@/types/leenk';

interface ParticipantStore {
  selectedUsers: LeenkParticipantItem[];
  isSelectionMode: boolean;

  // actions
  toggleUser: (user: LeenkParticipantItem) => void;
  removeUserById: (userId: number) => void;
  resetSelection: () => void;
  startSelection: () => void;
  stopSelection: () => void;

  // selectors
  isSelected: (userId: number) => boolean;
}

export const useParticipantStore = create<ParticipantStore>((set, get) => ({
  selectedUsers: [],
  isSelectionMode: false,

  toggleUser: (user) =>
    set((state) => {
      const uid = user.participant.userId;
      const exists = state.selectedUsers.some(
        (u) => u.participant.userId === uid,
      );
      return {
        selectedUsers: exists
          ? state.selectedUsers.filter((u) => u.participant.userId !== uid)
          : [...state.selectedUsers, user],
      };
    }),

  removeUserById: (userId) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.filter(
        (u) => u.participant.userId !== userId,
      ),
    })),

  resetSelection: () => set({ selectedUsers: [], isSelectionMode: false }),
  startSelection: () => set({ isSelectionMode: true }),
  stopSelection: () => set({ isSelectionMode: false }),

  isSelected: (userId) =>
    get().selectedUsers.some((u) => u.participant.userId === userId),
}));
