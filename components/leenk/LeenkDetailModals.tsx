import React, { useMemo } from 'react';
import ReportModal from '@/components/Modal/ReportModal';
import PopupModal from '@/components/Modal/PopupModal';

type ModalType =
  | 'menu'
  | 'deleteConfirm'
  | 'leenkLeave'
  | 'leenkClose'
  | 'leenkEarlyClose'
  | 'leenkReport'
  | undefined;

interface Props {
  modalType: ModalType;
  title: string;
  onClose: () => void;

  // actions
  onConfirmDelete: () => Promise<void> | void;
  onConfirmLeave: () => Promise<void> | void;
  onConfirmClose: () => void;
}

function LeenkDetailModals({
  modalType,
  title,
  onClose,
  onConfirmDelete,
  onConfirmLeave,
  onConfirmClose,
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
    case 'leenkEarlyClose':
      return (
        <PopupModal
          isOpen
          onRightBtn={onConfirmClose}
          onLeftBtn={onClose}
          mainText={`링크 시간이 아직 남았어! \n일찍 끝낼거야?`}
          isCancel
          leftBtnText="취소"
          rightBtnText="삭제할래"
        />
      );
    case 'leenkReport':
      return <ReportModal type="leenk" />;
    default:
      return null;
  }
}

export default React.memo(LeenkDetailModals);
