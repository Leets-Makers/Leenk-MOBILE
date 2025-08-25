import { create } from 'zustand';
import { LeenkParticipantItem } from '@/types/leenk';

interface ParticipantStore {
  // states
  selectedUsers: LeenkParticipantItem[];
  isSelectionMode: boolean;
  participants: LeenkParticipantItem[];

  // actions
  toggleUser: (user: LeenkParticipantItem) => void;
  removeUserById: (userId: number) => void;
  resetSelection: () => void;
  startSelection: () => void;
  stopSelection: () => void;

  setParticipants: (list: LeenkParticipantItem[]) => void;
  removeParticipantsByIds: (ids: number[]) => void;

  // selectors
  isSelected: (userId: number) => boolean;
}

export const useParticipantStore = create<ParticipantStore>((set, get) => ({
  selectedUsers: [],
  isSelectionMode: false,
  participants: [],

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

  setParticipants: (list) => set({ participants: list }),
  removeParticipantsByIds: (ids) =>
    set((state) => ({
      participants: state.participants.filter(
        (p) => !ids.includes(p.participant.userId),
      ),
      selectedUsers: state.selectedUsers.filter(
        (u) => !ids.includes(u.participant.userId),
      ),
    })),

  isSelected: (userId) =>
    get().selectedUsers.some((u) => u.participant.userId === userId),
}));
