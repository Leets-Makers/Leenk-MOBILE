import { CheckerIcon, ReviewIcon } from '@/assets';
import {
  BottomSheetModal,
  CustomButton,
  Header,
  Loading,
  MenuModal,
  PopupModal,
} from '@/components';
import GradientOverlay from '@/components/feed/GradientOverlay';
import { CONTAINER_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styled from 'styled-components/native';

import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share } from 'react-native';
import { SubText, TitleText } from '@/components/OnBoarding';
import { useEffect, useMemo, useState } from 'react';
import LeenkContentSection from '@/components/leenk/LeenkDetailContent';
import LeenkBottomButtonSection from '@/components/leenk/LeenkDetailBottomButton';
import ReportModal from '@/components/Modal/ReportModal';

import { getLeenkDetail } from '@/api/leenk/leenk.get.api';
import { LeenkDetail } from '@/types/leenk';
import { useUserStore } from '@/stores/userStore';
import { deleteLeenk, leaveLeenk } from '@/api/leenk/leenk.del.api';
import { participantLeenk } from '@/api/leenk/leenk.post.api';

export default function LeenkDetailPage() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const leenkId = useMemo(() => Number(Array.isArray(id) ? id[0] : id), [id]);

  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isParticipating, setIsParticipating] = useState(false);
  const [isLeenkEnd, setIsLeenkEnd] = useState(false);

  const [leenkDetail, setLeenkDetail] = useState<LeenkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const { userInfo } = useUserStore();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (!Number.isFinite(leenkId)) {
          throw new Error('Invalid leenk id');
        }
        const data = await getLeenkDetail(leenkId);
        if (mounted) setLeenkDetail(data);
      } catch (e) {
        showToast('상세 정보를 불러오지 못했어.', 'error');
        router.back();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [leenkId]);

  const isAuthor = leenkDetail?.author.userId === userInfo?.id;

  if (loading || !leenkDetail || deleting || joining || leaving) {
    return <Loading />;
  }

  const handleDelete = () => {
    closeModal();
    openModal('deleteConfirm');
  };

  const handleEdit = () => {
    //TODO:수정하기 로직 추가
    closeModal();
  };

  const handleReport = () => {
    closeModal();
    openModal('leenkReport');
  };

  const handleLeenkCloseModal = () => openModal('leenkClose');

  const handleLeenkClose = () => {
    openModal('bottomSheet');
  };

  const handleParticipants = () => {
    if (!leenkDetail) return;

    router.push({
      pathname: '/leenk/participants-list',
      params: {
        leenkId: String(leenkDetail.id),
        isAuthor: String(isAuthor),
        maxParticipants: String(leenkDetail.maxParticipants),
      },
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (!leenkDetail) return;
      setDeleting(true);

      await deleteLeenk(leenkDetail.id);

      showToast('삭제 완료!', 'success');
      closeModal();

      router.replace('/feed');
    } catch (err: any) {
      console.error('링크 삭제 오류:', err);
      showToast('삭제에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleLeave = async () => {
    if (!leenkDetail || leaving || !isParticipating) {
      closeModal();
      return;
    }
    try {
      setLeaving(true);
      await leaveLeenk(leenkDetail.id);

      setIsParticipating(false);
      setLeenkDetail((prev) =>
        prev
          ? {
              ...prev,
              currentParticipants: Math.max(prev.currentParticipants - 1, 0),
            }
          : prev,
      );
      showToast('모임에서 나갔어.', 'success');
    } catch (e) {
      showToast('나가기에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    } finally {
      setLeaving(false);
      closeModal();
    }
  };

  const handleJoinLeenk = async () => {
    if (!leenkDetail || joining || isParticipating) return;
    try {
      setJoining(true);
      await participantLeenk(leenkDetail.id);

      setIsParticipating(true);
      setLeenkDetail((prev) =>
        prev
          ? { ...prev, currentParticipants: prev.currentParticipants + 1 }
          : prev,
      );
      showToast('참여했어!', 'success');
    } catch (e) {
      showToast('참여에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    } finally {
      setJoining(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: leenkDetail.title });
    } catch (error) {
      showToast('공유에 실패했어요', 'error');
    }
  };

  const renderPopupModal = () => {
    switch (modalType) {
      case 'deleteConfirm':
        return (
          <PopupModal
            isOpen
            onRightBtn={handleConfirmDelete}
            onLeftBtn={closeModal}
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
            onRightBtn={handleLeave}
            onLeftBtn={closeModal}
            isWarning
            mainText="정말 떠날거야?"
            subText={
              leenkDetail.title.length > 10
                ? `${leenkDetail.title.slice(0, 10)}...에서 나가지게 돼.`
                : `${leenkDetail.title}에서 나가지게 돼.`
            }
            isCancel
            leftBtnText="취소"
            rightBtnText="나갈래"
          />
        );
      case 'leenkClose':
        return (
          <PopupModal
            isOpen
            onRightBtn={handleLeenkClose}
            onLeftBtn={closeModal}
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
            onRightBtn={handleLeenkClose}
            onLeftBtn={closeModal}
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
  };

  return (
    <Container>
      <GradientOverlay type="top" heightValue={120 * height} />
      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => openModal('menu')}
        style={{
          position: 'absolute',
          width: '100%',
          zIndex: 9999,
          paddingHorizontal: width * CONTAINER_PADDING,
        }}
      />

      <ImageContainer>
        {leenkDetail.mediaUrl ? (
          <Image
            source={{ uri: leenkDetail.mediaUrl }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
        ) : (
          <CheckerWrapper>
            <CheckerIcon width="100%" height="100%" />
          </CheckerWrapper>
        )}
      </ImageContainer>

      <LeenkContentSection
        data={leenkDetail}
        insetBottom={insets.bottom}
        onShare={handleShare}
        onParticipants={handleParticipants}
      />

      <LeenkBottomButtonSection
        isAuthor={isAuthor}
        isParticipating={isParticipating}
        insetBottom={insets.bottom}
        onLeave={() => openModal('leenkLeave')}
        onEalryClose={() => openModal('leenkEarlyClose')}
        onClose={handleLeenkCloseModal}
        onJoin={handleJoinLeenk}
        onParticipants={handleParticipants}
        isLeenkEnd={isLeenkEnd}
      />

      <MenuModal
        visible={modalType === 'menu'}
        isWrite={false}
        onClose={closeModal}
        onPressFirst={isAuthor ? handleEdit : handleReport}
        onPressSecond={isAuthor ? handleDelete : undefined}
        firstOptionText={isAuthor ? '수정하기' : '신고하기'}
        secondOptionText={isAuthor ? '삭제하기' : undefined}
        isOneOption={!isAuthor}
      />

      {renderPopupModal()}

      {modalType === 'bottomSheet' && (
        <BottomSheetModal visible={true}>
          <TitleText>{'링크가 마무리 됐어 :)'}</TitleText>
          <SubText>수고했어! 후기 남기러 가볼까?</SubText>
          <ReviewIcon
            height={200}
            width={200}
            style={{
              alignSelf: 'center',
              marginTop: 16 * height,
              marginBottom: 40 * height,
            }}
          />
          <CustomButton
            fullWidth
            onPress={() => {
              closeModal();
              router.push('/feed');
            }}
          >
            후기 쓰러갈래
          </CustomButton>
          <CustomButton
            variant="text"
            textColor="text[2]"
            fullWidth
            onPress={() => {
              closeModal();
              setIsLeenkEnd(true);
            }}
          >
            나중에 할래
          </CustomButton>
        </BottomSheetModal>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const ImageContainer = styled.View`
  ${StyleSheet.absoluteFillObject};
  width: 100%;
  height: ${height * 375}px;
  position: relative;
`;
const CheckerWrapper = styled.View`
  ${StyleSheet.absoluteFillObject};
  justify-content: center;
  align-items: center;
  background-color: ${colors.bg[2]};
`;
