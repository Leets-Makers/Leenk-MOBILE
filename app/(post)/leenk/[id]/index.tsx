import { CheckerIcon, ReviewIcon } from '@/assets';
import {
  BottomSheetModal,
  CustomButton,
  Header,
  Loading,
  MenuModal,
} from '@/components';
import GradientOverlay from '@/components/feed/GradientOverlay';
import { CONTAINER_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import styled from 'styled-components/native';

import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share } from 'react-native';
import { SubText, TitleText } from '@/components/OnBoarding';
import { useCallback, useMemo, useState } from 'react';
import LeenkContentSection from '@/components/leenk/LeenkDetailContent';
import LeenkBottomButtonSection from '@/components/leenk/LeenkDetailBottomButton';

import { getLeenkDetail } from '@/api/leenk/leenk.get.api';
import { LeenkDetail } from '@/types/leenk';
import { useUserStore } from '@/stores/userStore';
import { deleteLeenk, leaveLeenk } from '@/api/leenk/leenk.del.api';
import { participantLeenk } from '@/api/leenk/leenk.post.api';
import LeenkDetailModals from '@/components/leenk/LeenkDetailModals';

export default function LeenkDetailPage() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const leenkId = useMemo(() => Number(Array.isArray(id) ? id[0] : id), [id]);

  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userInfo } = useUserStore();

  const [leenkDetail, setLeenkDetail] = useState<LeenkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLeenkEnd, setIsLeenkEnd] = useState(false);

  const isAuthor = useMemo(
    () => (leenkDetail ? leenkDetail.author.userId === userInfo?.id : false),
    [leenkDetail, userInfo?.id],
  );
  const isBusy = loading || deleting || joining || leaving;

  const fetchDetail = useCallback(async () => {
    if (!Number.isFinite(leenkId)) {
      showToast('잘못된 링크야.', 'error');
      router.back();
      return;
    }

    let active = true;
    setLoading(true);
    try {
      const data = await getLeenkDetail(leenkId);
      if (active) setLeenkDetail(data);
    } catch (e) {
      if (active) {
        showToast('상세 정보를 불러오지 못했어.', 'error');
        router.back();
      }
    } finally {
      if (active) setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [leenkId, router, showToast]);

  useFocusEffect(
    useCallback(() => {
      let cleanup: (() => void) | undefined;
      (async () => {
        cleanup = await fetchDetail();
      })();
      return () => {
        cleanup?.();
      };
    }, [fetchDetail]),
  );

  const handleDelete = useCallback(() => {
    closeModal();
    openModal('deleteConfirm');
  }, [closeModal, openModal]);

  const handleEdit = useCallback(() => {
    closeModal();
    router.push({
      pathname: '/(post)/leenk',
      params: { mode: 'edit', leenkId: String(leenkDetail?.id ?? '') },
    });
  }, [closeModal, router, leenkDetail?.id]);

  const handleReport = useCallback(() => {
    closeModal();
    openModal('leenkReport');
  }, [closeModal, openModal]);

  const handleLeenkCloseModal = useCallback(
    () => openModal('leenkClose'),
    [openModal],
  );
  const handleLeenkClose = useCallback(
    () => openModal('bottomSheet'),
    [openModal],
  );

  const handleParticipants = useCallback(() => {
    if (!leenkDetail) return;
    router.push({
      pathname: '/leenk/participants-list',
      params: {
        leenkId: String(leenkDetail.id),
        isAuthor: String(isAuthor),
        maxParticipants: String(leenkDetail.maxParticipants),
      },
    });
  }, [leenkDetail, isAuthor, router]);

  const handleConfirmDelete = useCallback(async () => {
    if (!leenkDetail || deleting) return;
    try {
      setDeleting(true);
      await deleteLeenk(leenkDetail.id);
      showToast('삭제 완료!', 'success');
      closeModal();
      router.replace('/leenk');
    } catch (err) {
      console.error('링크 삭제 오류:', err);
      showToast('삭제에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    } finally {
      setDeleting(false);
    }
  }, [leenkDetail, deleting, closeModal, router, showToast]);

  const handleLeave = useCallback(async () => {
    if (!leenkDetail || leaving || !isParticipating) {
      closeModal();
      return;
    }
    try {
      setLeaving(true);
      await leaveLeenk(leenkDetail.id);

      // Optimistic local update
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
    } catch {
      showToast('나가기에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    } finally {
      setLeaving(false);
      closeModal();
    }
  }, [leenkDetail, leaving, isParticipating, closeModal, showToast]);

  const handleJoinLeenk = useCallback(async () => {
    if (!leenkDetail || joining || isParticipating) return;
    try {
      setJoining(true);
      await participantLeenk(leenkDetail.id);

      // Optimistic local update
      setIsParticipating(true);
      setLeenkDetail((prev) =>
        prev
          ? { ...prev, currentParticipants: prev.currentParticipants + 1 }
          : prev,
      );
      showToast('참여했어!', 'success');
    } catch {
      showToast('참여에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    } finally {
      setJoining(false);
    }
  }, [leenkDetail, joining, isParticipating, showToast]);

  const handleShare = useCallback(async () => {
    try {
      if (leenkDetail?.title) {
        await Share.share({ message: leenkDetail.title });
      }
    } catch {
      showToast('공유에 실패했어', 'error');
    }
  }, [leenkDetail?.title, showToast]);

  if (isBusy || !leenkDetail) {
    return <Loading />;
  }

  return (
    <Container>
      <GradientOverlay type="top" heightValue={120 * height} />

      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => openModal('menu')}
        style={styles.header}
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

      <LeenkDetailModals
        modalType={modalType as any}
        title={leenkDetail.title}
        onClose={closeModal}
        onConfirmDelete={handleConfirmDelete}
        onConfirmLeave={handleLeave}
        onConfirmClose={handleLeenkClose}
      />

      {modalType === 'bottomSheet' && (
        <BottomSheetModal visible>
          <TitleText>{'링크가 마무리 됐어 :)'}</TitleText>
          <SubText>수고했어! 후기 남기러 가볼까?</SubText>
          <ReviewIcon style={styles.reviewIcon} height={200} width={200} />
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

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
    paddingHorizontal: width * CONTAINER_PADDING,
  },
  reviewIcon: {
    alignSelf: 'center',
    marginTop: 16 * height,
    marginBottom: 40 * height,
  },
});

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
