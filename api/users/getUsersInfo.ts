import api from '@/api/api';

export const getUsersInfo = async () => {
  const res = await api.get(`/users/me`);

  return res.data.data;
};
