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
import { formatMonthDayHour, formatRelativeTime } from '@/utils/format-date';
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
  // console.log(
  //   item.notificationType,
  //   item.notificationType === 'LEENK_STARTING_SOON' ? item.content : '',
  // );

  const renderContent = () => {
    switch (item.notificationType) {
      case 'FEED_FIRST_REACTION': {
        const reactions = item.content.feedFirstReactionDetails || [];
        const firstReaction = reactions[0];
        return (
          <>
            <TitleText>{firstReaction?.body ?? '피드 공감'}</TitleText>
            <SubText>{firstReaction?.name ?? '유저 이름'}</SubText>
            {reactions.length > 1 && (
              <MoreTextWrapper onPress={onMorePress}>
                <MoreText>{reactions.length - 1}개 더보기</MoreText>
              </MoreTextWrapper>
            )}
          </>
        );
      }

      case 'FEED_REACTION_COUNT': {
        const reactions = item.content.feedReactionCountDetails || [];
        if (reactions.length === 0) {
          return <TitleText>공감 없음</TitleText>;
        }
        const firstReaction = reactions[0];
        return (
          <>
            <TitleText>{firstReaction?.body ?? '피드 공감 수'}</TitleText>
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
            <SubText>
              &#91;{item.content.authorName ?? '유저 이름'}&#93;
            </SubText>
          </>
        );

      case 'FEED_TAG': {
        return (
          <>
            <TitleText>{item.content.body ?? '피드 태그'}</TitleText>
            <SubText>
              &#91;{item.content.authorName ?? '유저 이름'}&#93;
            </SubText>
          </>
        );
      }

      case 'NEW_LEENK_PARTICIPANT': {
        const participants = item.content.newLeenkParticipantDetails || [];
        const newParticipants = participants[0];
        return (
          <>
            <TitleText>
              &#91;{item.content.leenkTitle ?? '모임 이름'}&#93;
              {item.content.body ?? '에 새로운 참여자가 들어왔어.'}
            </TitleText>
            <SubText>
              &#91;{newParticipants?.participantName ?? '참여자 이름'}&#93;
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
            <SubText>
              &#91;{item.content.leenkTitle ?? '링크 제목'} &#93;
            </SubText>
          </>
        );

      case 'LEENK_JOIN_COMPLETED':
        return (
          <>
            <TitleText>
              &#91;{item.content.leenkTitle ?? '모임 이름'}&#93;
              {item.content.body ?? '에 참여했어.'}
            </TitleText>
          </>
        );
      case 'LEENK_CLOSED':
        return (
          <>
            <TitleText>
              &#91;{item.content.leenkTitle ?? '모임 이름'}&#93;
              {item.content.body ?? '의 모집이 종료됐어\n모임원들을 확인해 봐!'}
            </TitleText>
          </>
        );
      case 'LEENK_STARTING_SOON':
        return (
          <>
            <TitleText>
              &#91;{item.content.leenkTitle ?? '모임 이름'}&#93;
              {item.content.body ?? '시작 30분 전이야'}
            </TitleText>
            <LeftSection style={{ marginTop: height * 6 }}>
              <LocateIcon />
              <TimeText>{item.content.placeName}</TimeText>
            </LeftSection>
            <LeftSection style={{ marginTop: height * 8 }}>
              <ClockIcon />

              <TimeText>
                {item.content.startTime
                  ? formatMonthDayHour(item.content.startTime)
                  : ''}
              </TimeText>
            </LeftSection>
          </>
        );

      case 'KICKED_FROM_LEENK':
        return (
          <>
            <TitleText>{item.content.body ?? '모임에서 내보내졌어.'}</TitleText>
            <SubText>
              &#91;{item.content.leenkTitle ?? '링크 제목'}&#93;
            </SubText>
          </>
        );
      case 'LEENK_FINISHED':
        return (
          <>
            <TitleText>
              {item.content.body ?? '모임이 끝났어. 후기 쓰러 가볼까?'}
            </TitleText>
            <SubText>
              &#91;{item.content.leenkTitle ?? '링크 제목'}&#93;
            </SubText>
          </>
        );

      case 'LEENK_STARTED_HOST_REMINDER':
        return (
          <>
            <TitleText>
              {item.content.body ?? '모임이 시작됐어! 모집을 종료할까?'}
            </TitleText>
            <SubText>
              &#91;{item.content.leenkTitle ?? '링크 제목'}&#93;
            </SubText>
          </>
        );
      case 'LEENK_LEFT':
        return (
          <>
            <TitleText>
              &#91;{item.content.leftUserName ?? '링크 제목'}&#93;
              {item.content.body ?? '이 모임에서 나갔어'}
            </TitleText>
          </>
        );

      default:
        return (
          <>
            <TitleText>{item.content.title ?? '알림'}</TitleText>
            <SubText>{item.content.body}</SubText>
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
  margin-bottom: ${6 * height}px;
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
  margin-left: ${28 * width}px;
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
  margin-top: ${2 * height}px;
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
  margin-left: ${width * 4}px;
`;
