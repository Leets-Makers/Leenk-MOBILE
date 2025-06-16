import { create } from 'zustand';

type ToastType = 'success' | 'error';

type ToastState = {
  visible: boolean;
  message: string;
  type: ToastType;
  showToast: (msg: string, type?: ToastType) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'success',
  showToast: (msg, type = 'success') =>
    set({ visible: true, message: msg, type }),
  hideToast: () => set({ visible: false }),
}));
