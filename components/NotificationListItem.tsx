import styled from 'styled-components/native';
import colors from '@/theme/color';
import { ClockIcon, FeedIcon, LeenkIcon, LocateIcon } from '@/assets';
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
}: {
  item: Notification;
  onPress: () => void;
  onMorePress?: () => void;
}) {
  console.log('알림', item.notificationType);
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
      case 'NEW_FEED':
        return (
          <>
            <TitleText>{item.content.body ?? '새로운 피드'}</TitleText>
            <SubText>{item.content.authorName ?? '내용 없음'}</SubText>
          </>
        );

      case 'FEED_TAG': {
        return (
          <>
            <TitleText>{item.content.body ?? '내용 없음'}</TitleText>
          </>
        );
      }

      case 'NEW_LEENK_PARTICIPANT': {
        const participants = item.content.newLeenkParticipantDetails || [];
        const newParticipants = participants[0];
        return (
          <>
            <TitleText>
              {item.content.leenkTitle ?? '모임 이름'}
              {item.content.body ?? '에 새로운 참여자가 들어왔어.'}
            </TitleText>
            <SubText>
              {newParticipants?.participantName ?? '참여자 이름'}
            </SubText>
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
            <TitleText>
              {item.content.body ?? '새로운 모임을 확인해 봐.'}
            </TitleText>
            <SubText>{item.content.leenkTitle ?? '링크 제목'}</SubText>
          </>
        );

      case 'LEENK_JOIN_COMPLETED':
        return (
          <>
            <TitleText>
              {item.content.leenkTitle ?? '모임 이름'}
              {item.content.body ?? '에 참여했어.'}
            </TitleText>
          </>
        );
      case 'LEENK_CLOSED':
        return (
          <>
            <TitleText>
              {item.content.leenkTitle ?? '모임 이름'}
              {item.content.body ?? '의 모집이 종료됐어\n모임원들을 확인해 봐!'}
            </TitleText>
          </>
        );
      case 'LEENK_STARTING_SOON':
        return (
          <>
            <TitleText>
              {item.content.leenkTitle ?? '모임 이름'}
              {item.content.body ?? '시작 30분 전이야'}
            </TitleText>
            <LeftSection>
              <LocateIcon /> <TimeText>장소</TimeText>
            </LeftSection>
            <LeftSection>
              <ClockIcon /> <TimeText>시간</TimeText>
            </LeftSection>
          </>
        );

      case 'KICKED_FROM_LEENK':
        return (
          <>
            <TitleText>{item.content.body ?? '모임에서 내보내졌어.'}</TitleText>
            <SubText>{item.content.leenkTitle ?? '링크 제목'}</SubText>
          </>
        );
      case 'LEENK_FINISHED':
        return (
          <>
            <TitleText>
              {item.content.body ?? '모임이 끝났어. 후기 쓰러 가볼까?'}
            </TitleText>
            <SubText>{item.content.leenkTitle ?? '링크 제목'}</SubText>
          </>
        );

      case 'LEENK_STARTED_HOST_REMINDER':
        return (
          <>
            {' '}
            <TitleText>
              {item.content.body ?? '모임이 시작됐어! 모집을 종료할까?'}
            </TitleText>
            <SubText>{item.content.leenkTitle ?? '링크 제목'}</SubText>
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
    <ItemContainer onPress={onPress}>
      {({ pressed }) => (
        <StyledItemContent pressed={pressed}>
          <Row>
            <LeftSection>
              {item.path === 'leenks' ? (
                <>
                  <LeenkIcon width={16} stroke={colors.primary} />
                  <TypeText>링크</TypeText>
                </>
              ) : (
                <>
                  <FeedIcon width={16} stroke={colors.primary} />
                  <TypeText>피드</TypeText>
                </>
              )}
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
  font-family: ${fonts.Bold};
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
