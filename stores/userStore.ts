import { create } from 'zustand';

export interface UserInfo {
  id: number;
  cardinal: number;
  name: string;
  position: 'FE' | 'BE' | 'D' | 'PM';
  profileImage: string;
  kakaoTalkId: string;
  introduction: string;
  mbti: string;
}

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
