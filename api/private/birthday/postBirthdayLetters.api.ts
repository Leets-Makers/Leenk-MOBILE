import api from '@/api/api';
import { BirthdayLetterPayload } from '@/types/birthday';

// 🎉 생일 축하 편지 전송
export const postBirthdayLetter = async (
  receiverId: number,
  payload: BirthdayLetterPayload,
) => {
  const res = await api.post(`/birthday/letters/${receiverId}`, payload);
  return res.data;
};
