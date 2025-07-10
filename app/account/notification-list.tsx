import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { Header } from '@/components';
import { getNotifications } from '@/api/users/notification.api';
import { RefreshControl } from 'react-native-gesture-handler';
import { Notification } from '@/types/notification';
import NotificationListItem from '@/components/NotificationListItem';
import { width } from '@/theme/globalStyles';

export default function NotificationListPage() {
  const [data, setData] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const notifications = await getNotifications(0, 20);
      setData(notifications.notificationResponses);
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

  const handlePress = (id: string) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
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
