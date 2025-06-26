import { create } from 'zustand';

type ProfileState = {
  step: 'id' | 'intro' | 'mbti' | 'photo';
  kakaoId: string;
  intro: string;
  mbti: string;
  profileImage: string;
  setStep: (step: ProfileState['step']) => void;
  setKakaoId: (id: string) => void;
  setIntro: (text: string) => void;
  setMbti: (mbti: string) => void;
  setProfileImage: (uri: string) => void;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  step: 'id',
  kakaoId: '',
  intro: '',
  mbti: '',
  profileImage: '',
  setStep: (step) => set({ step }),
  setKakaoId: (kakaoId) => set({ kakaoId }),
  setIntro: (intro) => set({ intro }),
  setMbti: (mbti) => set({ mbti }),
  setProfileImage: (uri) => set({ profileImage: uri }),
  reset: () =>
    set({
      step: 'id',
      kakaoId: '',
      intro: '',
      mbti: '',
      profileImage: '',
    }),
}));
