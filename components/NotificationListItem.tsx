import styled from 'styled-components/native';
import colors from '@/theme/color';
import { FeedIcon } from '@/assets';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { Notification } from '@/types/notification';
import { formatRelativeTime } from '@/utils/format-date';
import { getSubjectJosa } from '@/utils/KoreanEndingCheck';

export default function NotificationListItem({
  item,
  onPress,
}: {
  item: Notification;
  onPress: () => void;
}) {
  const renderContent = () => {
    switch (item.notificationType) {
      case 'FEED_FIRST_REACTION': {
        const reactions = item.content.feedFirstReactions || [];
        const firstReaction = reactions[0];
        return (
          <>
            <TitleText>{firstReaction?.body ?? '알 수 없는 제목'}</TitleText>
            <SubText>{firstReaction?.name ?? '알 수 없는 내용'}</SubText>
            {reactions.length > 1 && (
              <MoreTextWrapper>
                <MoreText>{reactions.length - 1}개 더보기</MoreText>
              </MoreTextWrapper>
            )}
          </>
        );
      }

      case 'FEED_REACTION_COUNT':
        const reactions = item.content.feedReactionCounts || [];
        const firstReaction = reactions[0];
        return (
          <>
            <TitleText>{firstReaction?.title ?? '알 수 없는 제목'}</TitleText>
            <SubText>{firstReaction?.body ?? '알 수 없는 내용'}</SubText>
            {reactions.length > 1 && (
              <MoreTextWrapper>
                <MoreText>{reactions.length - 1}개 더보기</MoreText>
              </MoreTextWrapper>
            )}
          </>
        );

      case 'NEW_FEED':
        return (
          <>
            <TitleText>{item.content.body ?? '새로운 피드'}</TitleText>
            <SubText>{item.content.authorName ?? '내용 없음'}</SubText>
          </>
        );

      case 'FEED_TAG':
        const name = item.content.authorName ?? '내용 없음';
        const josa = getSubjectJosa(name);
        return (
          <>
            <TitleText>{`${name}${josa} 나를 게시글에 언급했어`}</TitleText>

            <SubText>{item.content.authorName ?? '내용 없음'}</SubText>
          </>
        );

      default:
        return (
          <>
            <TitleText>{item.content.title ?? '알림'}</TitleText>
            {item.content.body && <SubText>{item.content.body}</SubText>}
          </>
        );
    }
  };

  return (
    <ItemContainer isRead={item.isRead} onPress={onPress}>
      <Row>
        <LeftSection>
          <FeedIcon width={16} stroke={colors.primary} />
          <TypeText>피드</TypeText>
        </LeftSection>
        <TimeText>{formatRelativeTime(item.updateDate)}</TimeText>
      </Row>
      <ContentContainer>{renderContent()}</ContentContainer>
    </ItemContainer>
  );
}

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

const MoreTextWrapper = styled.Pressable``;

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
