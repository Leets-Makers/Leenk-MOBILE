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

interface ModalPayload {
  feedId?: number;
  userId?: number;
}

interface ModalStore {
  openModal: (
    type: ModalType,
    receiverId?: number | null,
    payload?: ModalPayload,
  ) => void;
  closeModal: () => void;
  modalType: ModalType;
  payload?: ModalPayload | null;
  receiverId: number | null;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalType: null,
  payload: undefined,
  receiverId: null,
  openModal: (type, receiverId = null, payload?: ModalPayload) =>
    set({
      modalType: type,
      receiverId,
      payload,
    }),
  closeModal: () =>
    set({
      modalType: null,
      receiverId: null,
      payload: null,
    }),
}));
