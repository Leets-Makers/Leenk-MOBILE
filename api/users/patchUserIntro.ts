import api from '@/api/api';

export const updateUserInfo = async ({ info }: { info: string }) => {
  try {
    const response = await api.patch('/users/me/introduction', info);
    console.log('updateUserInfo: ', response.data);
  } catch (error: any) {
    console.error('updateUserInfo 오류:', error.message);
    throw error;
  }
  return;
};
