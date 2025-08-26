import { create } from 'zustand';

type Store = {
  leenkImage: string | null;
  setLeenkImage: (uri: string | null) => void;
  resetLeenkImage: () => void;
};

export const useLeenkImageStore = create<Store>((set) => ({
  leenkImage: null,
  setLeenkImage: (uri) => set({ leenkImage: uri }),
  resetLeenkImage: () => set({ leenkImage: null }),
}));
