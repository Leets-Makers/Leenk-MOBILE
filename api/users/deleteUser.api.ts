import api from '@/api/api';

export const deleteUser = async () => {
  try {
    const response = await api.delete('/users');
    console.log('deleteUser: ', response.data);
  } catch (error: any) {
    console.error('deleteUser 오류:', error.message);
    throw error;
  }
};
