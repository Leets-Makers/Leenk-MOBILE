import { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { NotificationType } from '@/types/notification';
import { FeedIcon } from '@/assets';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { Header } from '@/components';

// mock 데이터
export interface NotificationDetail {
  id: string;
  userName: string;
  timeAgo: string;
}

export interface Notification {
  id: string;
  userId: number;
  notificationType: NotificationType;
  isRead: boolean;
  content: {
    title: string;
    body: string;
  };
  updateDate: string;
  details?: NotificationDetail[];
}

const mockNotifications: Notification[] = [
  {
    id: 'main-1',
    userId: 101,
    notificationType: 'FEED_REACTION_COUNT',
    isRead: false,
    content: {
      title: '내가 쓴 피드에 좋아요를 100개 받았어',
      body: '',
    },
    updateDate: '2025-07-09T10:00:00.000Z',
    details: [
      { id: 'detail-1', userName: '이한별', timeAgo: '방금' },
      { id: 'detail-2', userName: '이강혁', timeAgo: '1분 전' },
      { id: 'detail-3', userName: '김도연', timeAgo: '4분 전' },
    ],
  },
  {
    id: 'main-2',
    userId: 101,
    notificationType: 'NEW_FEED',
    isRead: false,
    content: {
      title: '새로운 게시글이 올라왔어',
      body: '이한별',
    },
    updateDate: '2025-07-08T16:10:00.000Z',
  },
  {
    id: 'main-3',
    userId: 101,
    notificationType: 'FEED_TAG',
    isRead: false,
    content: {
      title: '[유저 이름]이 나를 게시글에 언급했어',
      body: '',
    },
    updateDate: '2025-07-09T09:00:00.000Z',
  },
];

export default function NotificationListPage() {
  const [data, setData] = useState<Notification[]>(mockNotifications);

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
          <NotificationItem item={item} onPress={() => handlePress(item.id)} />
        )}
      />
    </Container>
  );
}

function NotificationItem({
  item,
  onPress,
}: {
  item: Notification;
  onPress: () => void;
}) {
  const renderContent = () => {
    switch (item.notificationType) {
      case 'FEED_REACTION_COUNT':
      case 'FEED_FIRST_REACTION':
        return (
          <>
            <TitleText>{item.content.title}</TitleText>
            {item.details && (
              <MoreText>{item.details.length}개 더보기</MoreText>
            )}
          </>
        );
      case 'NEW_FEED':
        return (
          <>
            <TitleText>{item.content.title}</TitleText>
            <SubText>{item.content.body}</SubText>
          </>
        );
      case 'FEED_TAG':
        return <TitleText>{item.content.title}</TitleText>;
      default:
        return <TitleText>{item.content.title}</TitleText>;
    }
  };

  return (
    <ItemContainer isRead={item.isRead} onPress={onPress}>
      <Row>
        <LeftSection>
          <FeedIcon width={16} stroke={colors.primary} />
          <TypeText>피드</TypeText>
        </LeftSection>
        <TimeText>3시간 전</TimeText>
      </Row>
      <ContentContainer>{renderContent()}</ContentContainer>
    </ItemContainer>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[1]};
  padding-horizontal: ${20 * width}px;
`;

const ItemContainer = styled.TouchableOpacity<{ isRead: boolean }>`
  background-color: ${(props) => (props.isRead ? colors.bg[3] : colors.white)};

  margin-bottom: ${40 * height}px;
  padding: ${4 * height}px;
  border-radius: ${radius.xs}px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${6 * height};
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TypeText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm};
  color: ${colors.text[3]};
  margin-left: ${12 * width}px;
  line-height: ${lineHeight.s};
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-left: ${28 * width};
`;

const TitleText = styled.Text`
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  line-height: ${lineHeight.m};
  font-size: ${fontSize.md};
`;

const SubText = styled.Text`
  font-family: ${fonts.Bold};
  color: ${colors.black};
  font-size: ${fontSize.md};
  line-height: ${lineHeight.m};
  margin-top: ${2 * height};
`;

const MoreText = styled.Text`
  color: ${colors.primary};
  margin-top: ${10 * height};
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm};
`;

const TimeText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm};
  color: ${colors.text[3]};
  line-height: ${lineHeight.s};
`;
