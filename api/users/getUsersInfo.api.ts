import api from '@/api/api';

export const getUsersInfo = async () => {
  const res = await api.get(`/users/me`);

  return res.data.data;
};

export const getOtherUserInfo = async (userId: number) => {
  const res = await api.get(`/users/${userId}`);
  return res.data.data;
};
