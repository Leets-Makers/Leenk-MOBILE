import api from '@/api/api';

// 🎉 생일 편지 읽음 처리
export const postMarkBirthdayLetters = async () => {
  const res = await api.post('/birthday/letters/me/mark');
  return res.data;
};
