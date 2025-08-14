import { create } from 'zustand';
import { UserInfo } from '@/hooks/useUserInfo';

interface UserStoreState {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  resetUserInfo: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  resetUserInfo: () => set({ userInfo: null }),
}));
