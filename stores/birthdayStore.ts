import { create } from 'zustand';
import {
  BirthdayUser,
  UpcomingBirthdayUser,
  BirthdayLetter,
} from '@/types/birthday';
import { getBirthdayUsers } from '@/api/private/birthday/birthday.get.api';
import { getUpcomingBirthdayUsers } from '@/api/private/birthday/birthday.get.api';
import { getBirthdayLetters } from '@/api/private/birthday/birthday.get.api';

interface BirthdayStore {
  //  생일 관련 데이터
  birthdayUsers: BirthdayUser[];
  myBirthdayLettersCounts: number;
  hasNewLetters: boolean;
  upcomingBirthdayUsers: UpcomingBirthdayUser[];

  //  생일 편지 데이터
  birthdayLetters: BirthdayLetter[];

  loading: boolean;
  error: string | null;

  // setters
  setBirthdayUsers: (users: BirthdayUser[]) => void;
  setUpcomingBirthdayUsers: (users: UpcomingBirthdayUser[]) => void;
  setBirthdayLetters: (letters: BirthdayLetter[]) => void;
  setHasNewLetters: (value: boolean) => void;
  setMyBirthdayLettersCounts: (value: number) => void;
  setLoading: (value: boolean) => void;
  setError: (msg: string | null) => void;

  // fetchers
  fetchBirthdayUsers: () => Promise<void>;
  fetchUpcomingBirthdayUsers: () => Promise<void>;
  fetchBirthdayLetters: () => Promise<void>;

  // selectors
  hasTodayBirthday: () => boolean;
  hasUpcomingBirthdays: () => boolean;
}

export const useBirthdayStore = create<BirthdayStore>((set, get) => ({
  birthdayUsers: [],
  myBirthdayLettersCounts: 0,
  hasNewLetters: false,

  upcomingBirthdayUsers: [],

  birthdayLetters: [],

  loading: false,
  error: null,

  // setters
  setBirthdayUsers: (users) => set({ birthdayUsers: users }),
  setUpcomingBirthdayUsers: (users) => set({ upcomingBirthdayUsers: users }),
  setBirthdayLetters: (letters) => set({ birthdayLetters: letters }),
  setHasNewLetters: (value: boolean) => set({ hasNewLetters: value }),
  setMyBirthdayLettersCounts: (value: number) =>
    set({ myBirthdayLettersCounts: value }),
  setLoading: (value) => set({ loading: value }),
  setError: (msg) => set({ error: msg }),

  // 생일자 조회
  fetchBirthdayUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getBirthdayUsers();
      set({
        birthdayUsers: res.users,
        myBirthdayLettersCounts: res.myBirthdayLettersCounts,
        hasNewLetters: res.hasNewLetters,
      });
    } catch (err) {
      set({ error: '생일 사용자 조회 실패' });
    } finally {
      set({ loading: false });
    }
  },

  // 다가오는 생일자 조회
  fetchUpcomingBirthdayUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getUpcomingBirthdayUsers();
      set({ upcomingBirthdayUsers: res.users });
    } catch (err) {
      set({ error: '다가오는 생일 조회 실패' });
    } finally {
      set({ loading: false });
    }
  },

  //  내가 받은 생일 편지 조회
  fetchBirthdayLetters: async () => {
    set({ loading: true, error: null });
    try {
      const letters = await getBirthdayLetters();
      set({ birthdayLetters: letters });
    } catch (err) {
      set({ error: '생일 편지 조회 실패' });
    } finally {
      set({ loading: false });
    }
  },

  // selectors
  hasTodayBirthday: () =>
    get().birthdayUsers.some((u) => u.isUserBirthdayToday),

  hasUpcomingBirthdays: () => get().upcomingBirthdayUsers.length > 0,
}));
