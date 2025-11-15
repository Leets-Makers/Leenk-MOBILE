import api from '@/api/api';
import { BirthdayLetter } from '@/types/birthday';

// 🎉 내가 받은 생일 축하 편지 조회
export const getBirthdayLetters = async (): Promise<BirthdayLetter[]> => {
  const res = await api.get('/birthday/letters/me');
  return res.data.data;
};
