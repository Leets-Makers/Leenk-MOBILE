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
  | 'leenkFinish'
  | 'leenkLeave'
  | 'leenkReport'
  | 'birthdayLetter'
  | 'birthdayLetterFinish'
  | null;

interface ModalStore {
  openModal: (type: ModalType, receiverId?: number | null) => void;
  closeModal: () => void;
  modalType: ModalType;
  receiverId: number | null;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalType: null,
  receiverId: null,
  openModal: (type, receiverId = null) =>
    set({
      modalType: type,
      receiverId,
    }),
  closeModal: () =>
    set({
      modalType: null,
      receiverId: null,
    }),
}));
