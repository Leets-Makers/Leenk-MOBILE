// components/leenk/LeenkBottomButtonSection.tsx

import { width, height } from '@/theme/globalStyles';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { CustomButton } from '@/components';
import { useRouter } from 'expo-router';
import { CONTAINER_PADDING } from '@/constants';

interface Props {
  isAuthor: boolean;
  isParticipating: boolean;
  isLeenkEnd: boolean;
  insetBottom: number;
  onLeave: () => void;
  onEalryClose: () => void;
  onClose: () => void;
  onJoin: () => void;
  onParticipants: () => void;
}

export default function LeenkBottomButtonSection({
  isAuthor,
  isParticipating,
  isLeenkEnd,
  insetBottom,
  onLeave,
  onEalryClose,
  onClose,
  onJoin,
  onParticipants,
}: Props) {
  const router = useRouter();

  return (
    <ButtonContainer $insetBottom={insetBottom}>
      {isLeenkEnd && (isAuthor || isParticipating) ? (
        <CustomButton
          variant="primary"
          onPress={() => router.push('/(post)/feed')}
          rounded="md"
          size="lg"
          fullWidth
        >
          후기 쓰러갈래
        </CustomButton>
      ) : isAuthor ? (
        <>
          <CustomButton
            variant="secondary"
            textColor="text[2]"
            onPress={() => router.push('/leenk/participants-list')}
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
      ) : isParticipating ? (
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
      ) : (
        <CustomButton
          variant="primary"
          onPress={onJoin}
          rounded="md"
          size="lg"
          fullWidth
        >
          참여할래
        </CustomButton>
      )}
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
