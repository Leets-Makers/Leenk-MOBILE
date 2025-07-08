import { useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { notificationStore } from '@/stores/notificationStore';

import colors from '@/theme/color';
import { width } from '@/theme/globalStyles';
import { getNotifications } from '@/api/users/notification.api';

export default function NotificationsPage() {
  const {
    notifications,
    page,
    hasNext,
    appendNotifications,
    resetNotifications,
  } = notificationStore();

  const fetchAndSetNotifications = async (pageNumber: number) => {
    try {
      const res = await getNotifications(pageNumber, 10);
      const { notificationResponses, pageable } = res;
      appendNotifications(notificationResponses, pageable.hasNext, pageNumber);
    } catch (e) {
      console.error('알림 조회 실패', e);
    }
  };

  useEffect(() => {
    resetNotifications();
    fetchAndSetNotifications(0);
  }, []);

  const loadMore = () => {
    if (hasNext) {
      fetchAndSetNotifications(page + 1);
    }
  };

  return (
    <Container>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.8}
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </Container>
  );
}

// Item 렌더링 로직은 기존과 동일

function NotificationItem({ item }: { item: any }) {
  return (
    <ItemContainer isRead={item.isRead}>
      <TypeText>{item.linkType}</TypeText>
      <ContentText>{item.content}</ContentText>
      <TimeText>{formatTime(item.createdAt)}</TimeText>
    </ItemContainer>
  );
}

const formatTime = (time: string) => {
  // TODO: 서버 시간 포맷 맞춰서 표시
  return '1시간 전';
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;

const ItemContainer = styled.View<{ isRead: boolean }>`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[200]};
  background-color: ${(props) =>
    props.isRead ? colors.white : colors.gray[50]};
`;

const TypeText = styled.Text`
  color: ${colors.primary};
  margin-bottom: 4px;
`;

const ContentText = styled.Text`
  color: ${colors.primary};
  margin-bottom: 6px;
`;

const TimeText = styled.Text`
  color: ${colors.gray[500]};
  font-size: 12px;
`;
