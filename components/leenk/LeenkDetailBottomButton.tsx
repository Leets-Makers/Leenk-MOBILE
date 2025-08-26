import { width, height } from '@/theme/globalStyles';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { CustomButton } from '@/components';
import { CONTAINER_PADDING } from '@/constants';
import { router } from 'expo-router';
import { LeenkDetail } from '@/types/leenk';

interface Props {
  isAuthor: boolean;
  insetBottom: number;
  leenkDetail: LeenkDetail;
  onLeave: () => void;
  onFinish: () => void;
  onClose: () => void;
  onJoin: () => void;
  onParticipants: () => void;
}

import dayjs from 'dayjs';
import { useMemo } from 'react';

export default function LeenkBottomButtonSection({
  isAuthor,
  leenkDetail,
  insetBottom,
  onLeave,
  onFinish,
  onClose,
  onJoin,
  onParticipants,
}: Props) {
  // 링크 시작 시간 계산
  const isBeforeStart = useMemo(() => {
    return leenkDetail?.startTime
      ? dayjs().isBefore(dayjs(leenkDetail.startTime))
      : false;
  }, [leenkDetail?.startTime]);

  // 정원 계산
  const isFull = useMemo(() => {
    return leenkDetail.currentParticipants >= leenkDetail.maxParticipants;
  }, [leenkDetail.currentParticipants, leenkDetail.maxParticipants]);

  const renderButtons = () => {
    // 1. 작성자일 경우
    if (isAuthor) {
      if (leenkDetail.status === 'RECRUITING') {
        // 1-1 RECRUITING
        return (
          <>
            <CustomButton
              variant="secondary"
              textColor="text[2]"
              onPress={onParticipants}
              rounded="md"
              size="lg"
            >
              모임원 관리
            </CustomButton>
            <CustomButton
              variant="primary"
              onPress={onClose}
              rounded="md"
              size="lg"
              style={{ flex: 1, marginLeft: 10 * width }}
            >
              모집 종료할래
            </CustomButton>
          </>
        );
      }

      if (leenkDetail.status === 'CLOSED') {
        // 1-2 CLOSED
        return (
          <>
            <CustomButton
              variant="secondary"
              textColor="text[2]"
              onPress={onParticipants}
              rounded="md"
              size="lg"
            >
              모임원 관리
            </CustomButton>
            <CustomButton
              variant="primary"
              onPress={onFinish}
              rounded="md"
              size="lg"
              style={{ flex: 1, marginLeft: 10 * width }}
              disabled={isBeforeStart}
            >
              링크 종료할래
            </CustomButton>
          </>
        );
      }

      if (leenkDetail.status === 'FINISHED') {
        // 1-3 FINISHED
        return (
          <CustomButton
            variant="primary"
            onPress={() => {
              router.push('/(post)/feed');
            }}
            rounded="md"
            size="lg"
            fullWidth
          >
            후기 쓰러가자
          </CustomButton>
        );
      }
    }

    // 2. 참여자(작성자 아님)일 경우
    if (!isAuthor) {
      if (!leenkDetail.isParticipated) {
        const isJoinDisabled =
          isFull ||
          leenkDetail.status === 'CLOSED' ||
          leenkDetail.status === 'FINISHED';

        return (
          <CustomButton
            variant="primary"
            onPress={onJoin}
            rounded="md"
            size="lg"
            fullWidth
            disabled={isJoinDisabled}
          >
            참여할래
          </CustomButton>
        );
      }

      if (leenkDetail.status === 'RECRUITING') {
        return (
          <>
            <CustomButton
              variant="secondary"
              textColor="text[2]"
              onPress={onParticipants}
              rounded="md"
              size="lg"
            >
              모임원 보기
            </CustomButton>
            <CustomButton
              variant="primary"
              onPress={onLeave}
              rounded="md"
              size="lg"
              style={{ flex: 1, marginLeft: 10 * width }}
            >
              링크 나갈래
            </CustomButton>
          </>
        );
      }

      if (leenkDetail.status === 'CLOSED') {
        return (
          <>
            <CustomButton
              variant="secondary"
              textColor="text[2]"
              onPress={onParticipants}
              rounded="md"
              size="lg"
            >
              모임원 보기
            </CustomButton>
            <CustomButton
              variant="primary"
              onPress={onLeave}
              rounded="md"
              size="lg"
              style={{ flex: 1, marginLeft: 10 * width }}
            >
              링크 나갈래
            </CustomButton>
          </>
        );
      }

      if (leenkDetail.status === 'FINISHED') {
        return (
          <CustomButton
            variant="primary"
            onPress={() => {
              router.push('/feed');
            }}
            rounded="md"
            size="lg"
            fullWidth
          >
            후기 쓰러가자
          </CustomButton>
        );
      }
    }

    // Fallback
    return (
      <CustomButton
        variant="primary"
        onPress={onJoin}
        rounded="md"
        size="lg"
        fullWidth
      >
        참여할래
      </CustomButton>
    );
  };

  return (
    <ButtonContainer $insetBottom={insetBottom}>
      {renderButtons()}
    </ButtonContainer>
  );
}

const ButtonContainer = styled.View<{ $insetBottom: number }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: ${height * 10}px ${width * CONTAINER_PADDING}px;
  padding-bottom: ${({ $insetBottom }) => $insetBottom + 10 * height}px;
  flex-direction: row;
  background-color: ${colors.white};
`;
