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

export const getNotificationsSetting = async () => {
  const res = await api.get('/user-setting/notifications');
  return res.data;
};

export const patchNotificationsSetting = async (
  body: Partial<{
    newLeenkNotify: boolean;
    leenkStatusNotify: boolean;
    newFeedNotify: boolean;
    newReactionNotify: boolean;
  }>,
) => {
  const res = await api.patch('/user-setting/notifications', body);
  return res.data;
};

export const patchNotificationsToken = async (fcmToken: string) => {
  const res = await api.patch('/users/me/fcm-token', { fcmToken: fcmToken });
  return res.data;
};
