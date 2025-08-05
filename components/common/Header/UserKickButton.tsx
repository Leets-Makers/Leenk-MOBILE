import { useState } from 'react';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';
import { useParticipantStore } from '@/stores/participantStore';
import PopupModal from '@/components/Modal/PopupModal';

interface Props {
  handleKick?: () => void;
}

export default function UserKickButton({ handleKick }: Props) {
  const { selectedUsers, isSelectionMode, resetSelection } =
    useParticipantStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isZero = selectedUsers.length === 0;

  const handlePress = () => {
    if (!isZero) {
      setIsModalOpen(true);
    }

    handleKick?.();
  };

  const handleKickAPI = () => {
    resetSelection();
    setIsModalOpen(false);
  };

  const handleExit = () => {
    setIsModalOpen(false);
    resetSelection();
  };

  return (
    <>
      <Container onPress={handlePress}>
        {(isSelectionMode || selectedUsers.length > 0) && (
          <CountBadge $isZero={isZero}>
            <CountText>{selectedUsers.length}</CountText>
          </CountBadge>
        )}
        <ButtonText>내보내기</ButtonText>
      </Container>

      <PopupModal
        isOpen={isModalOpen}
        onRightBtn={handleKickAPI}
        onLeftBtn={handleExit}
        mainText="선택한 사람을 내보낼거야?"
        subText="내보내면 복구할 수 없어."
        leftBtnText="취소"
        isWarning
        rightBtnText="내보낼래"
      />
    </>
  );
}

const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: ${8 * height}px ${12 * width}px;
  background-color: ${colors.divider[2]};
  border-radius: 100px;
`;

const ButtonText = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.text[1]};
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.s}px;
`;

const CountBadge = styled.View<{ $isZero: boolean }>`
  width: ${20 * width}px;
  height: ${20 * height}px;
  border-radius: ${10 * height}px;
  background-color: ${({ $isZero }) =>
    $isZero ? colors.gray[400] : colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: ${6 * width}px;
`;

const CountText = styled.Text`
  color: white;
  font-size: ${fontSize.sm}px;
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.s}px;
`;
