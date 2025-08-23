import { width, height } from '@/theme/globalStyles';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { CustomButton } from '@/components';
import { CONTAINER_PADDING } from '@/constants';
import { router } from 'expo-router';

interface Props {
  isAuthor: boolean;
  isParticipating: boolean;
  insetBottom: number;
  leenkStatus: 'RECRUITING' | 'CLOSED' | 'FINISHED' | string;
  onLeave: () => void;
  onFinish: () => void;
  onClose: () => void;
  onJoin: () => void;
  onParticipants: () => void;
}

export default function LeenkBottomButtonSection({
  isAuthor,
  isParticipating,
  insetBottom,
  leenkStatus,
  onLeave,
  onFinish,
  onClose,
  onJoin,
  onParticipants,
}: Props) {
  const renderButtons = () => {
    // 1. 작성자일 경우
    if (isAuthor) {
      if (leenkStatus === 'RECRUITING') {
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
      if (leenkStatus === 'CLOSED') {
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
            >
              링크 종료할래
            </CustomButton>
          </>
        );
      }
      if (leenkStatus === 'FINISHED') {
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
      if (leenkStatus === 'RECRUITING') {
        // 2-1 RECRUITING
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
      }
      if (leenkStatus === 'CLOSED') {
        // 2-2 CLOSED
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
      if (leenkStatus === 'FINISHED') {
        // 2-3 FINISHED
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

    // 예외 상황(알 수 없는 상태) 대비: 참가 버튼만 노출
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
