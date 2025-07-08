import api from '@/api/api';

export const getUsersInfo = async () => {
  const res = await api.get(`/users/me`);

  return res.data.data;
};

export const getOtherUserInfo = async (userId: number) => {
  const res = await api.get(`/users/${userId}`);
  console.log('다른 사람 프로필 조회 응답 : ', res.data.data);
  return res.data.data;
};
