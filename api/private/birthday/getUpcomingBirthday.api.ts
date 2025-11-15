import api from '@/api/api';
import { UpcomingBirthdayData } from '@/types/birthday';

// 🎉 7일 이내 생일인 사람들 조회
export const getUpcomingBirthdayUsers =
  async (): Promise<UpcomingBirthdayData> => {
    const res = await api.get('/birthday/users/upcoming');

    console.log('곧 생일인 사람들: ', res.data.data);
    return res.data.data;
  };
