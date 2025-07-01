import { create } from 'zustand';
import { FeedConnectedUser } from '@/types/feed';

interface ConnectedUserStore {
  users: FeedConnectedUser[];
  setUsers: (users: FeedConnectedUser[]) => void;
  reset: () => void;
}

export const useConnectedUserStore = create<ConnectedUserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  reset: () => set({ users: [] }),
}));
