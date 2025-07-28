import { useEffect, useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { Header } from '@/components';
import { RefreshControl } from 'react-native-gesture-handler';
import { ModalData, Notification } from '@/types/notification';
import NotificationListItem from '@/components/NotificationListItem';
import { width } from '@/theme/globalStyles';
import NotificationModal from '@/components/Modal/NotificationModal';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';

// ✅ Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'mock-1',
    isRead: false,
    createdAt: '2024-07-27T12:00:00',
    notificationType: 'FEED_FIRST_REACTION',
    content: {
      feedFirstReactions: [
        { body: '내가 쓴 피드에 좋아요를 받았어', name: '이한별' },
        { body: '내가 쓴 피드에 좋아요를 받았어', name: '김도연' },
      ],
    },
  },
  {
    id: 'mock-2',
    isRead: false,
    createdAt: '2024-07-27T13:00:00',
    notificationType: 'FEED_REACTION_COUNT',
    content: {
      feedReactionCounts: [
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
        { body: '[모임 이름]에 새로운 참여자가 들어왔어' },
      ],
    },
  },
];

export default function NotificationListPage() {
  const [data, setData] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<ModalData[]>([]);
  const { showToast } = useToastStore();

  const openDetailModal = (details: ModalData[]) => {
    setSelectedDetails(details);
    setModalVisible(true);
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setData(MOCK_NOTIFICATIONS); // ✅ mock 연결
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
      // ❌ API 제거
      setData((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
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
