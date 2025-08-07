import { create } from 'zustand';

type ModalType =
  | 'menu'
  | 'deleteConfirm'
  | 'feedUpload'
  | 'feedReaction'
  | 'feedLinked'
  | 'popup'
  | 'bottomSheet'
  | 'feedReport'
  | 'leenkKick'
  | 'leenkClose'
  | 'leenkEarlyClose'
  | 'leenkLeave'
  | null;

interface ModalStore {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  modalType: ModalType;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalType: null,
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
}));
