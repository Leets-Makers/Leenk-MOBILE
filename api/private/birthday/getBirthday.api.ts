import api from '@/api/api';
import { BirthdayData } from '@/types/birthday';

// 🎉 생일인 사람들 조회
export const getBirthdayUsers = async (): Promise<BirthdayData> => {
  const res = await api.get('/birthday/users');

  console.log('생일인 사람들: ', res.data.data);
  return res.data.data;
};
