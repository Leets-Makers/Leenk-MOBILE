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
import { kickLeenkParticipants } from '@/api/leenk/leenk.del.api';
import { useToastStore } from '@/stores/toastStore';
import Loading from '../Loading';

interface Props {
  leenkId: number;
  handleKick?: () => void;
  disabled?: boolean;
}

export default function UserKickButton({
  leenkId,
  handleKick,
  disabled,
}: Props) {
  const {
    selectedUsers,
    isSelectionMode,
    resetSelection,
    removeParticipantsByIds,
  } = useParticipantStore();
  const { showToast } = useToastStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isZero = selectedUsers.length === 0;

  const handlePress = () => {
    if (!isZero) {
      setIsModalOpen(true);
    }
    handleKick?.();
  };

  const handleKickAPI = async () => {
    try {
      setLoading(true);

      // resetSelection 전에 userIds 확보
      const kickedIds = selectedUsers.map((u) => u.participant.userId);

      // 여러 명 병렬 처리(부분 성공 허용)
      const results = await Promise.allSettled(
        kickedIds.map((id) => kickLeenkParticipants(leenkId, id)),
      );
      const successIds: number[] = [];
      const failed = results.filter((r, idx) => {
        const ok = r.status === 'fulfilled';
        if (ok) successIds.push(kickedIds[idx]);
        return r.status === 'rejected';
      });

      if (successIds.length) {
        removeParticipantsByIds(successIds);
      }

      if (failed.length) {
        showToast(`일부 내보내기 실패(${failed.length}명)`, 'error');
      } else {
        showToast('참여자를 내보냈어.', 'success');
      }
    } catch (e) {
      console.error('참여자 내보내기 실패:', e);
      showToast('내보내기에 실패했어.', 'error');
    } finally {
      resetSelection();
      setIsModalOpen(false);
      setLoading(false);
    }
  };
  const handleExit = () => {
    setIsModalOpen(false);
    resetSelection();
  };

  if (loading) return <Loading />;

  return (
    <>
      <Container onPress={handlePress} disabled={disabled}>
        {(isSelectionMode || selectedUsers.length > 0) && (
          <CountBadge $isZero={isZero}>
            <CountText>{selectedUsers.length}</CountText>
          </CountBadge>
        )}
        <ButtonText disabled={disabled}>내보내기</ButtonText>
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
  background-color: ${({ disabled }) =>
    disabled ? colors.gray[100] : colors.divider[2]};
  border-radius: 100px;
`;

const ButtonText = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${({ disabled }) => (disabled ? colors.gray[400] : colors.text[1])};
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
