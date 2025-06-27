import { create } from 'zustand';

type ProfileState = {
  step: 'id' | 'introduction' | 'mbti' | 'photo';
  kakaoTalkId: string;
  introduction: string;
  mbti: string;
  profileImage: string;
  setStep: (step: ProfileState['step']) => void;
  setkakaoTalkId: (id: string) => void;
  setintroduction: (text: string) => void;
  setMbti: (mbti: string) => void;
  setProfileImage: (uri: string) => void;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  step: 'id',
  kakaoTalkId: '',
  introduction: '',
  mbti: '',
  profileImage: '',
  setStep: (step) => set({ step }),
  setkakaoTalkId: (kakaoTalkId) => set({ kakaoTalkId }),
  setintroduction: (introduction) => set({ introduction }),
  setMbti: (mbti) => set({ mbti }),
  setProfileImage: (uri) => set({ profileImage: uri }),
  reset: () =>
    set({
      step: 'id',
      kakaoTalkId: '',
      introduction: '',
      mbti: '',
      profileImage: '',
    }),
}));
