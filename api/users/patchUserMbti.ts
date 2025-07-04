import api from '@/api/api';

export const updateUserMbti = async ({ mbti }: { mbti: string }) => {
  try {
    const response = await api.patch('/users/me/mbti', mbti);
    console.log('updateUserMbti: ', response.data);
  } catch (error: any) {
    console.error('updateUserMbti 오류:', error.message);
    throw error;
  }
  return;
};
