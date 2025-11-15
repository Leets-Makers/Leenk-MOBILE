import { create } from 'zustand';

type ProfileState = {
  step: 'id' | 'introduction' | 'birthday' | 'mbti' | 'photo';
  userId: number;
  kakaoTalkId: string;
  introduction: string;
  mbti: string;
  birthday: string;
  isUserBirthdayToday: boolean;
  profileImage: string;
  position: string;
  name: string;
  cardinal: number;
  setStep: (step: ProfileState['step']) => void;
  setUserId: (userId: number) => void;
  setkakaoTalkId: (kakaoTalkId: string) => void;
  setintroduction: (text: string) => void;
  setMbti: (mbti: string) => void;
  setBirthday: (birthday: string) => void;
  setIsUserBirthdayToday: (isUSerBirthdayToday: boolean) => void;
  setProfileImage: (uri: string) => void;
  setPosition: (position: string) => void;
  setName: (name: string) => void;
  setCardinal: (cardinal: number) => void;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  step: 'id',
  userId: 0,
  kakaoTalkId: '',
  introduction: '',
  mbti: '',
  birthday: '',
  isUserBirthdayToday: false,
  profileImage: '',
  position: '',
  name: '',
  cardinal: 0,
  setStep: (step) => set({ step }),
  setUserId: (userId) => set({ userId }),
  setkakaoTalkId: (kakaoTalkId) => set({ kakaoTalkId }),
  setintroduction: (introduction) => set({ introduction }),
  setMbti: (mbti) => set({ mbti }),
  setBirthday: (birthday) => set({ birthday }),
  setIsUserBirthdayToday: (isUserBirthdayToday) => set({ isUserBirthdayToday }),
  setProfileImage: (uri) => set({ profileImage: uri }),
  setPosition: (position) => set({ position }),
  setName: (name) => set({ name }),
  setCardinal: (cardinal) => set({ cardinal }),
  reset: () =>
    set({
      step: 'id',
      userId: 0,
      kakaoTalkId: '',
      introduction: '',
      mbti: '',
      birthday: '',
      isUserBirthdayToday: false,
      profileImage: '',
      position: '',
      name: '',
      cardinal: 0,
    }),
}));
