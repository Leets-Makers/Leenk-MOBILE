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
import { ModalData, Notification } from '@/types/notification';
import NotificationListItem from '@/components/NotificationListItem';
import { width } from '@/theme/globalStyles';
import NotificationModal from '@/components/Modal/NotificationModal';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';

export default function NotificationListPage() {
  const [data, setData] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<ModalData[]>([]);

  const { showToast } = useToastStore();

  // 알림 상세 모달 열기
  const openDetailModal = (details: ModalData[]) => {
    setSelectedDetails(details);
    setModalVisible(true);
  };

  // 알림 목록 불러오기
  const fetchNotifications = useCallback(async () => {
    try {
      const notifications = await getNotifications(0, 20);
      setData([...notifications.notificationResponses]);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 새로고침 핸들러
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // 알림 읽음 처리
  const handlePress = async (notificationId: string) => {
    try {
      if (userInfo) await markNotificationAsRead(userInfo?.id, notificationId);
      setData((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      if (__DEV__) console.error('Failed to mark notification as read:', error);
      showToast('알림을 불러오는데 실패했습니다.', 'error');
    }
  };

  return (
    <Container>
      <Header />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NotificationListItem
            item={item}
            onPress={() => handlePress(item.id)}
            onMorePress={() => {
              const detailData =
                item.notificationType === 'FEED_REACTION_COUNT'
                  ? item.content.feedReactionCounts
                  : item.notificationType === 'FEED_FIRST_REACTION'
                    ? item.content.feedFirstReactions
                    : [];

              openDetailModal(detailData ?? []);
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        initialNumToRender={data.length}
        removeClippedSubviews={false}
      />

      <NotificationModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedDetails}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[1]};
  padding-horizontal: ${20 * width}px;
`;
