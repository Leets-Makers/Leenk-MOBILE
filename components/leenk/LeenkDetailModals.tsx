import React, { useMemo } from 'react';
import ReportModal from '@/components/Modal/TextInputModal';
import PopupModal from '@/components/Modal/PopupModal';
import BottomSheetModal from '../Modal/BottomSheetModal';
import CustomButton from '../common/Button/CustomButton';
import { router } from 'expo-router';
import { height } from '@/theme/globalStyles';
import { SubText, TitleText } from '@/components/OnBoarding';
import { ReviewIcon } from '@/assets';

type ModalType =
  | 'menu'
  | 'deleteConfirm'
  | 'leenkLeave'
  | 'leenkClose'
  | 'leenkFinish'
  | 'leenkReport'
  | 'bottomSheet'
  | undefined;

interface Props {
  modalType: ModalType;
  title: string;
  leenkId: number;
  onClose: () => void;

  // actions
  onConfirmDelete: () => Promise<void> | void;
  onConfirmLeave: () => Promise<void> | void;
  onConfirmClose: () => Promise<void> | void;
  onConfirmFinish: () => Promise<void> | void;
}

function LeenkDetailModals({
  modalType,
  title,
  leenkId,
  onClose,
  onConfirmDelete,
  onConfirmLeave,
  onConfirmClose,
  onConfirmFinish,
}: Props) {
  const leaveSubText = useMemo(
    () =>
      title.length > 10
        ? `${title.slice(0, 10)}...에서 나가지게 돼.`
        : `${title}에서 나가지게 돼.`,
    [title],
  );

  switch (modalType) {
    case 'deleteConfirm':
      return (
        <PopupModal
          isOpen
          onRightBtn={onConfirmDelete}
          onLeftBtn={onClose}
          isWarning
          mainText="모집글을 삭제할거야?"
          subText="삭제하면 복구할 수 없어."
          isCancel
          leftBtnText="취소"
          rightBtnText="삭제할래"
        />
      );
    case 'leenkLeave':
      return (
        <PopupModal
          isOpen
          onRightBtn={onConfirmLeave}
          onLeftBtn={onClose}
          isWarning
          mainText="정말 떠날거야?"
          subText={leaveSubText}
          isCancel
          leftBtnText="취소"
          rightBtnText="나갈래"
        />
      );
    case 'leenkClose':
      return (
        <PopupModal
          isOpen
          onRightBtn={onConfirmClose}
          onLeftBtn={onClose}
          isWarning
          mainText={`아직 모임 시간이 아니야! \n모집을 종료할까?`}
          subText="종료하면 다시 모집할 수 없어."
          isCancel
          leftBtnText="취소"
          rightBtnText="종료할래"
        />
      );
    case 'leenkFinish':
      return (
        <PopupModal
          isOpen
          onRightBtn={onConfirmFinish}
          onLeftBtn={onClose}
          mainText={`링크를 끝낼거야?`}
          isCancel
          leftBtnText="취소"
          rightBtnText="종료할래"
        />
      );
    case 'leenkReport':
      return <ReportModal type="leenk" leenkId={leenkId} />;

    case 'bottomSheet':
      return (
        <BottomSheetModal visible>
          <TitleText>{'링크가 마무리 됐어 :)'}</TitleText>
          <SubText>수고했어! 후기 남기러 가볼까?</SubText>
          <ReviewIcon
            style={{
              alignSelf: 'center',
              marginTop: 16 * height,
              marginBottom: 40 * height,
            }}
            height={200}
            width={200}
          />
          <CustomButton
            fullWidth
            onPress={() => {
              onClose();
              router.push('/(post)/feed');
            }}
          >
            후기 쓰러갈래
          </CustomButton>
          <CustomButton
            variant="text"
            textColor="text[2]"
            fullWidth
            onPress={() => {
              onClose();
            }}
          >
            나중에 할래
          </CustomButton>
        </BottomSheetModal>
      );
    default:
      return null;
  }
}

export default React.memo(LeenkDetailModals);
