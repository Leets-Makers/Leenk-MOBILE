import { create } from 'zustand';

type WriteMenuStore = {
  isVisible: boolean;
  open: () => void;
  close: () => void;
};

export const useWriteMenuStore = create<WriteMenuStore>((set) => ({
  isVisible: false,
  open: () => set({ isVisible: true }),
  close: () => set({ isVisible: false }),
}));
