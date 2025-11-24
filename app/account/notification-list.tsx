import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { Header, Loading } from '@/components';
import {
  getNotifications,
  markNotificationAsRead,
} from '@/api/users/notification.api';
import { RefreshControl } from 'react-native-gesture-handler';
import { ModalData, Notification } from '@/types/notification';
import NotificationListItem from '@/components/NotificationListItem';
import { height, width } from '@/theme/globalStyles';
import NotificationModal from '@/components/Modal/NotificationModal';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import { FEED_PADDING } from '@/constants';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationListPage() {
  const [data, setData] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // ⬅️ 추가: 초기 로딩
  const { userInfo } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<ModalData[]>([]);

  const { showToast } = useToastStore();

  const openDetailModal = (details: ModalData[]) => {
    setSelectedDetails(details);
    setModalVisible(true);
  };

  // ⬇silent=false면 오버레이 로딩 표시, true면 당겨서 새로고침만 표시
  const fetchNotifications = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = opts?.silent ?? false;
      if (!silent) setLoading(true);
      try {
        const notifications = await getNotifications(0, 30);

        setData([...notifications.notificationResponses]);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        showToast('알림을 불러오는데 실패했습니다.', 'error');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications({ silent: true });
    setRefreshing(false);
  };

  const handlePress = async (notification: Notification) => {
    try {
      if (userInfo)
        await markNotificationAsRead(userInfo.userId, notification.id);

      setData((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );

      const { path, notificationType, content } = notification;

      //  생일 경로 처리
      if (path === 'birthday') {
        if (notificationType === 'BIRTHDAY_LETTER') {
          return router.push('/extra/birthday/letters');
        }
        return router.push('/extra');
      }

      if (content.leenkId || content.feedId) {
        if (path === 'leenks') {
          router.push(`/leenk/${content.leenkId}`);
        } else {
          router.push(`/feed/${content.feedId}`);
        }
      }
    } catch (error) {
      if (__DEV__) console.error('Failed to mark notification as read:', error);
      showToast('알림을 불러오는데 실패했습니다.', 'error');
    }
  };

  return (
    <Container>
      <Header style={{ paddingHorizontal: FEED_PADDING * width }} />
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        {loading && !refreshing ? (
          <Loading />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator
            contentContainerStyle={{
              paddingHorizontal: FEED_PADDING * width,
              marginTop: 8 * height,
            }}
            renderItem={({ item }) => (
              <NotificationListItem
                item={item}
                onPress={() => handlePress(item)}
                onMorePress={() => {
                  const detailData =
                    item.notificationType === 'FEED_REACTION_COUNT'
                      ? item.content.feedReactionCountDetails
                      : item.notificationType === 'FEED_FIRST_REACTION'
                        ? item.content.feedFirstReactionDetails
                        : item.notificationType === 'NEW_LEENK_PARTICIPANT'
                          ? item.content.newLeenkParticipantDetails
                          : [];
                  openDetailModal(detailData ?? []);
                }}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            initialNumToRender={data.length}
            removeClippedSubviews={false}
          />
        )}
      </SafeAreaView>

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
`;
