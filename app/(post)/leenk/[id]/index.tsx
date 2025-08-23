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

import { Platform, StyleSheet } from 'react-native';
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
import {
  closeLeenk,
  finishLeenk,
  participantLeenk,
} from '@/api/leenk/leenk.post.api';
import LeenkDetailModals from '@/components/leenk/LeenkDetailModals';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
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
  const [leenkStatus, setLeenkStatus] = useState('');
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
      if (active) {
        setLeenkDetail(data);
        setLeenkStatus(data.status);
        console.log('링크의 상태:', data.status);
      }
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

  // 링크 신고 함수
  const handleReport = useCallback(() => {
    closeModal();
    openModal('leenkReport');
  }, [closeModal, openModal]);

  // 링크 모집 종료 함수
  const handleLeenkClose = async (leenkId: number) => {
    try {
      await closeLeenk(leenkId);
      closeModal();
      showToast('링크 모집을 종료했어요.');
    } catch (err) {
      console.error('링크 모집 종료 실패:', err);
      showToast('링크 모집 종료에 실패했어요.');
    }
  };
  // 링크 모임 종료 함수
  const handleLeenkFinish = async (leenkId: number) => {
    try {
      await finishLeenk(leenkId);
      closeModal();
      showToast('링크 모임을 종료했어요.');
      // 종료 후 바텀시트 띄우기
      openModal('bottomSheet');
    } catch (err) {
      console.error('링크 모임 종료 실패:', err);
      showToast('링크 모임 종료에 실패했어요.');
    }
  };

  // 참여자 페이지 이동
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

  // 링크 삭제하기 버튼(작성자)
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

  // 삭제하기 모달(작성자)
  const handleDelete = useCallback(() => {
    closeModal();
    openModal('deleteConfirm');
  }, [closeModal, openModal]);

  // 수정하기 페이지 이동(작성자)
  const handleEdit = useCallback(() => {
    closeModal();
    router.push({
      pathname: '/(post)/leenk',
      params: { mode: 'edit', leenkId: String(leenkDetail?.id ?? '') },
    });
  }, [closeModal, router, leenkDetail?.id]);

  // 링크 떠나기(참여자)
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

  // 링크 참여하기(참여자)
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

  // 공유하기(작성자,침여자)
  const handleShare = async () => {
    try {
      if (!leenkId) {
        showToast('공유할 링크를 만들 수 없어요.', 'error');
        return;
      }

      // 커스텀 스킴 딥링크 생성 (app.json의 scheme와 동일해야 함: 예 "leenk")
      //    path는 expo-router 라우트와 일치: /leenk/[id]
      const deepLink = Linking.createURL(`/leenk/${leenkId}`, {
        scheme: 'leenk',
      });
      // 예: "leenk://leenk/123"

      // iOS는 url 필드를 더 잘 인식
      if (Platform.OS === 'ios') {
        await Share.share({ url: deepLink, message: leenkDetail?.title });
      } else {
        await Share.share({ message: `${leenkDetail?.title}\n${deepLink}` });
      }
    } catch {
      // 실패 시 클립보드 복사 폴백
      const fallback = Linking.createURL(`/leenk/${leenkId}`, {
        scheme: 'leenk',
      });
      await Clipboard.setStringAsync(fallback);
      showToast('링크를 클립보드에 복사했어요', 'success');
    }
  };

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
        onFinish={() => openModal('leenkFinish')}
        onClose={() => openModal('leenkClose')}
        onJoin={handleJoinLeenk}
        onParticipants={handleParticipants}
        leenkStatus={leenkStatus}
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
        onConfirmClose={() => handleLeenkClose(leenkDetail.id)}
        onConfirmFinish={() => handleLeenkFinish(leenkDetail.id)}
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
