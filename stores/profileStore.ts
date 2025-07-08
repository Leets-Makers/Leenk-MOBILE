import { create } from 'zustand';

type ProfileState = {
  step: 'id' | 'introduction' | 'mbti' | 'photo';
  kakaoTalkId: string;
  introduction: string;
  mbti: string;
  profileImage: string;
  position: string;
  name: string;
  cardinal: number;
  setStep: (step: ProfileState['step']) => void;
  setkakaoTalkId: (id: string) => void;
  setintroduction: (text: string) => void;
  setMbti: (mbti: string) => void;
  setProfileImage: (uri: string) => void;
  setPosition: (position: string) => void;
  setName: (name: string) => void;
  setCardinal: (cardinal: number) => void;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  step: 'id',
  kakaoTalkId: '',
  introduction: '',
  mbti: '',
  profileImage: '',
  position: '',
  name: '',
  cardinal: 0,
  setStep: (step) => set({ step }),
  setkakaoTalkId: (kakaoTalkId) => set({ kakaoTalkId }),
  setintroduction: (introduction) => set({ introduction }),
  setMbti: (mbti) => set({ mbti }),
  setProfileImage: (uri) => set({ profileImage: uri }),
  setPosition: (position) => set({ position }),
  setName: (name) => set({ name }),
  setCardinal: (cardinal) => set({ cardinal }),
  reset: () =>
    set({
      step: 'id',
      kakaoTalkId: '',
      introduction: '',
      mbti: '',
      profileImage: '',
      position: '',
      name: '',
      cardinal: 0,
    }),
}));
