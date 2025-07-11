import api from '@/api/api';
import { ApiResponse } from '@/api/api-type';

export const deleteUser = async () => {
  try {
    const response = await api.delete('/users/me');
    console.log('deleteUser: ', response.data);
  } catch (error: any) {
    console.error('deleteUser 오류:', error.message);
    throw error;
  }
};

// 유저 차단
export const blockUser = async (userId: number) => {
  const res = await api.post<ApiResponse<string>>(`users/${userId}/block`);
  console.log('유저 차단 : ', res.data);
  return res.data.data;
};
