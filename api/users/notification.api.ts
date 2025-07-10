import api from '@/api/api';

export const getNotifications = async (page: number, size: number) => {
  const res = await api.get('/notifications', {
    params: { page, size },
  });
  return res.data.data;
};

export const markNotificationAsRead = async (
  userId: number,
  notificationId: string,
) => {
  await api.patch(`/notifications/${notificationId}`, null, {
    params: { userId },
  });
};

export const getNotificationCount = async (userId: number) => {
  const res = await api.get('/notifications/count', { params: { userId } });
  return res.data.data.count;
};
