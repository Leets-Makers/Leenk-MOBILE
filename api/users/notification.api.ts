import api from '@/api/api';

export const getNotifications = async (page: number, size: number) => {
  const res = await api.get('/notifications', {
    params: { page, size },
  });
  return res.data.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  await api.patch(`/notifications/${notificationId}`, {});
};

export const getNotificationCount = async () => {
  const res = await api.get('/notifications/count');
  return res.data.data.count;
};
