import styled from 'styled-components/native';
import colors from '@/theme/color';
import { ClockIcon, FeedIcon, LocateIcon } from '@/assets';
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
import { Pressable } from 'react-native';

export default function NotificationListItem({
  item,
  onPress,
  onMorePress,
  type,
}: {
  item: Notification;
  onPress: () => void;
  onMorePress?: () => void;
  type: string;
}) {
  const renderContent = () => {
    switch (item.notificationType) {
      case 'FEED_FIRST_REACTION': {
        const reactions = item.content.feedFirstReactions || [];
        const firstReaction = reactions[0];
        return (
          <>
            <TitleText>{firstReaction?.body ?? '알 수 없는 내용'}</TitleText>
            <SubText>{firstReaction?.name ?? '알 수 없는 이름'}</SubText>
            {reactions.length > 1 && (
              <MoreTextWrapper onPress={onMorePress}>
                <MoreText>{reactions.length - 1}개 더보기</MoreText>
              </MoreTextWrapper>
            )}
          </>
        );
      }

      case 'FEED_REACTION_COUNT': {
        const reactions = item.content.feedReactionCounts || [];
        if (reactions.length === 0) {
          return <TitleText>공감 없음</TitleText>;
        }
        const firstReaction = reactions[0];
        return (
          <>
            <TitleText>{firstReaction?.body ?? '알 수 없는 내용'}</TitleText>
            {reactions.length > 1 && (
              <MoreTextWrapper onPress={onMorePress}>
                <MoreText>{reactions.length - 1}개 더보기</MoreText>
              </MoreTextWrapper>
            )}
          </>
        );
      }
      case 'LEENK_NEW_PARTICIPANTS': {
        const participants = item.content.leenkParticipants || [];
        const newParticipants = participants[0];
        return (
          <>
            <TitleText>
              {newParticipants?.title ?? '모임 이름'}에 새로운 참여자가 들어왔어
            </TitleText>
            <TitleText>{newParticipants?.name ?? '참여자 이름'}</TitleText>
            {participants.length > 1 && (
              <MoreTextWrapper onPress={onMorePress}>
                <MoreText>{participants.length - 1}개 더보기</MoreText>
              </MoreTextWrapper>
            )}
          </>
        );
      }
      case 'NEW_LEENK':
        return (
          <>
            <TitleText>{item.content.body ?? '새로운 피드'}</TitleText>
            <SubText>{item.content.authorName ?? '내용 없음'}</SubText>
          </>
        );

      case 'NEW_LEENK_JOIN':
        return (
          <>
            <TitleText>
              {item.content.title ?? '모임 이름'} 에 참여했어
            </TitleText>
          </>
        );
      case 'LEENK_CLOSE':
        return (
          <>
            <TitleText>
              {item.content.title ?? '모임 이름'} 의 모집이 종료됐어
            </TitleText>
            <TitleText>모임원들을 확인해 봐!</TitleText>
          </>
        );
      case 'LEENK_DETAIL':
        return (
          <>
            <TitleText>
              {item.content.title ?? '모임 이름'} 시작 n분 전이야
            </TitleText>
            <LeftSection>
              <LocateIcon /> <TimeText>장소</TimeText>
            </LeftSection>
            <LeftSection>
              <ClockIcon /> <TimeText>시간</TimeText>
            </LeftSection>
          </>
        );

      case 'NEW_FEED':
        return (
          <>
            <TitleText>{item.content.body ?? '새로운 피드'}</TitleText>
            <SubText>{item.content.authorName ?? '내용 없음'}</SubText>
          </>
        );

      case 'FEED_TAG': {
        const name = item.content.authorName ?? '내용 없음';
        const josa = getSubjectJosa(name);
        return (
          <>
            <TitleText>{`${name}${josa} 나를 게시글에 언급했어`}</TitleText>
            <SubText>{item.content.authorName ?? '내용 없음'}</SubText>
          </>
        );
      }

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
    <ItemContainer onPress={onPress}>
      {({ pressed }) => (
        <StyledItemContent pressed={pressed}>
          <Row>
            <LeftSection>
              <FeedIcon width={16} stroke={colors.primary} />
              <TypeText>{type === 'feed' ? '피드' : '링크'}</TypeText>
            </LeftSection>
            <TimeText>{formatRelativeTime(item.updateDate)}</TimeText>
          </Row>
          <ContentContainer>{renderContent()}</ContentContainer>
        </StyledItemContent>
      )}
    </ItemContainer>
  );
}

const ItemContainer = styled(Pressable)`
  margin-bottom: ${40 * height}px;
  padding: ${4 * height}px;
  border-radius: ${radius.xs}px;
`;

const StyledItemContent = styled.View<{ pressed: boolean }>`
  background-color: ${(props) => (props.pressed ? colors.bg[3] : colors.white)};
  border-radius: ${radius.xs}px;
`;

export const Row = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${6 * height};
`;

export const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TypeText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm};
  color: ${colors.text[3]};
  margin-left: ${12 * width}px;
  line-height: ${lineHeight.s};
`;

export const ContentContainer = styled.View`
  flex: 1;
  margin-left: ${28 * width};
`;

export const TitleText = styled.Text`
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  line-height: ${lineHeight.m};
  font-size: ${fontSize.md};
`;

export const SubText = styled.Text`
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

export const TimeText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm};
  color: ${colors.text[3]};
  line-height: ${lineHeight.s};
`;
