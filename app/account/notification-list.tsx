import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { Header } from '@/components';
import {
  getNotifications,
  markNotificationAsRead,
} from '@/api/users/notification.api';
import { RefreshControl } from 'react-native-gesture-handler';
import { Notification } from '@/types/notification';
import NotificationListItem from '@/components/NotificationListItem';
import { width } from '@/theme/globalStyles';
import { useProfileStore } from '@/stores/profileStore';

export default function NotificationListPage() {
  const [data, setData] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userId, setUserId } = useProfileStore();

  const fetchNotifications = useCallback(async () => {
    try {
      const notifications = await getNotifications(0, 20);
      setData(notifications.notificationResponses);
      setUserId(notifications.notificationResponses.userId);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handlePress = async (notificationId: string) => {
    try {
      await markNotificationAsRead(userId, notificationId);
      setData((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <Container>
      <Header />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationListItem
            item={item}
            onPress={() => handlePress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[1]};
  padding-horizontal: ${20 * width}px;
`;
