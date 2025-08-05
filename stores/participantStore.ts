import { create } from 'zustand';
import { LeenkDataType } from '@/constants/mockUserData';

interface ParticipantStore {
  selectedUsers: LeenkDataType[];
  toggleUser: (user: LeenkDataType) => void;
  clear: () => void;
}

export const useParticipantStore = create<ParticipantStore>((set, get) => ({
  selectedUsers: [],
  toggleUser: (user) => {
    const { selectedUsers } = get();
    const exists = selectedUsers.find((u) => u.id === user.id);
    if (exists) {
      set({
        selectedUsers: selectedUsers.filter((u) => u.id !== user.id),
      });
    } else {
      set({ selectedUsers: [...selectedUsers, user] });
    }
  },
  clear: () => set({ selectedUsers: [] }),
}));
