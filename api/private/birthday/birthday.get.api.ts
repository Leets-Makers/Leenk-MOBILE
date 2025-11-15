import api from '@/api/api';
import {
  BirthdayData,
  BirthdayLetter,
  UpcomingBirthdayData,
} from '@/types/birthday';

// 🎉 생일인 사람들 조회
export const getBirthdayUsers = async (): Promise<BirthdayData> => {
  const res = await api.get('/birthday/users');

  console.log('생일인 사람들: ', res.data.data);
  return res.data.data;
};

// 🎉 내가 받은 생일 축하 편지 조회
export const getBirthdayLetters = async (): Promise<BirthdayLetter[]> => {
  const res = await api.get('/birthday/letters/me');
  return res.data.data;
};

// 🎉 7일 이내 생일인 사람들 조회
export const getUpcomingBirthdayUsers =
  async (): Promise<UpcomingBirthdayData> => {
    const res = await api.get('/birthday/users/upcoming');

    console.log('곧 생일인 사람들: ', res.data.data);
    return res.data.data;
  };
