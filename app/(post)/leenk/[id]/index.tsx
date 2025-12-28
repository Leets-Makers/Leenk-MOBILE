import { CheckerIcon } from '@/assets';
import { Header, Loading, MenuModal } from '@/components';
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

import { useCallback, useEffect, useMemo, useState } from 'react';
import LeenkContentSection from '@/components/leenk/LeenkDetailContent';
import LeenkBottomButtonSection from '@/components/leenk/LeenkDetailBottomButton';

import { getLeenkDetail } from '@/api/leenk/leenk.get.api';
import { LeenkDetail, LeenkStatus } from '@/types/leenk';
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
import { useDetailFirstLaunch } from '@/hooks/useFirstLaunch';
import OnBoardingModal from '@/components/Modal/OnBoardingModal';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';

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

  const [pendingAction, setPendingAction] = useState<null | 'close' | 'finish'>(
    null,
  );

  const firstLaunch = useDetailFirstLaunch();
  const [showOnBoarding, setShowOnBoarding] = useState(false);

  const isInitialLoading = loading && !leenkDetail;
  const isBlockingAction = deleting;

  const showInitialLoading = useDelayedLoading(isInitialLoading);

  useEffect(() => {
    if (firstLaunch === true) {
      setShowOnBoarding(true);
    }
  }, [firstLaunch]);

  // 부분 패치 헬퍼
  const patchDetail = useCallback((patch: Partial<LeenkDetail>) => {
    setLeenkDetail((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const isAuthor = useMemo(
    () =>
      leenkDetail ? leenkDetail.author.userId === userInfo?.userId : false,
    [leenkDetail, userInfo?.userId],
  );

  const fetchDetail = useCallback(
    async (signal?: { canceled: boolean }) => {
      setLoading(true);
      try {
        if (!Number.isFinite(leenkId)) {
          if (!signal?.canceled) {
            showToast('잘못된 링크 주소야.', 'error');
            router.back();
          }
          return;
        }
        const data = await getLeenkDetail(leenkId);

        if (!signal?.canceled) {
          setLeenkDetail(data);
        }
      } catch (e) {
        if (!signal?.canceled) {
          showToast('상세 정보를 불러오지 못했어.', 'error');
          router.back();
        }
      } finally {
        if (!signal?.canceled) setLoading(false);
      }
    },
    [leenkId, router, showToast],
  );

  const refetchDetail = useCallback(async () => {
    const fresh = await getLeenkDetail(leenkId);
    setLeenkDetail(fresh);
  }, [leenkId]);

  useFocusEffect(
    useCallback(() => {
      const signal = { canceled: false };
      fetchDetail(signal);
      return () => {
        signal.canceled = true;
      };
    }, [fetchDetail]),
  );

  // 링크 신고 함수
  const handleReport = useCallback(() => {
    closeModal();
    openModal('leenkReport');
  }, [closeModal, openModal]);

  // 링크 모집 종료 함수(작성자)
  const handleLeenkClose = async (leenkId: number) => {
    if (!leenkDetail || pendingAction) return;
    setPendingAction('close');

    // 스냅샷 저장
    const snapshot = leenkDetail;

    // 낙관적 업데이트: 상태만 최소 변경
    patchDetail({ status: 'CLOSED' as LeenkStatus });

    try {
      await closeLeenk(leenkId);
      closeModal();
      showToast('링크 모집을 종료했어!');
    } catch (err) {
      // 실패 롤백
      setLeenkDetail(snapshot);
      console.error('링크 모집 종료 실패:', err);
      showToast('링크 모집 종료에 실패했어!', 'error');
    } finally {
      setPendingAction(null);
    }
  };

  // 링크 모임 종료 함수(작성자)
  const handleLeenkFinish = async (leenkId: number) => {
    if (!leenkDetail || pendingAction) return;
    setPendingAction('finish');

    const snapshot = leenkDetail;

    // 낙관적 업데이트
    patchDetail({ status: 'FINISHED' as LeenkStatus });

    try {
      await finishLeenk(leenkId);
      closeModal();
      showToast('링크 모임을 종료했어!');

      // 성공 후 바텀시트 오픈 (성공 시점에만!)
      openModal('bottomSheet');
    } catch (err) {
      setLeenkDetail(snapshot);
      console.error('링크 모임 종료 실패:', err);
      showToast('링크 모임 종료에 실패했어!', 'error');
    } finally {
      setPendingAction(null);
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

  const applyParticipatePatch = (delta: 1 | -1, flag: boolean) => {
    setLeenkDetail((prev) =>
      prev
        ? {
            ...prev,
            isParticipated: flag,
            currentParticipants: Math.max(prev.currentParticipants + delta, 0),
          }
        : prev,
    );
  };

  // 링크 떠나기(참여자)
  const handleLeave = async () => {
    if (!leenkDetail) return;
    applyParticipatePatch(-1, false);
    try {
      await leaveLeenk(leenkDetail.id);
      showToast('링크를 떠났어!');
      closeModal();
      await refetchDetail();
    } catch {
      applyParticipatePatch(+1, true);
      showToast('나가기에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    }
  };

  // 링크 참여하기(참여자)
  const handleJoin = async () => {
    if (!leenkDetail) return;
    applyParticipatePatch(+1, true);
    try {
      await participantLeenk(leenkDetail.id);
      showToast('링크에 참여했어!');
      closeModal();
      await refetchDetail();
    } catch {
      applyParticipatePatch(-1, false);
      showToast('참여에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    }
  };

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

  if (showInitialLoading) {
    return <Loading />;
  }

  if (deleting || !leenkDetail) {
    return <Loading />;
  }

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
          top: 35,
          zIndex: 9999,
          paddingHorizontal: width * CONTAINER_PADDING,
        }}
      />

      <LeenkContentSection
        data={leenkDetail}
        insetBottom={insets.bottom}
        onShare={handleShare}
        onParticipants={handleParticipants}
      />
      <LeenkBottomButtonSection
        isAuthor={isAuthor}
        leenkDetail={leenkDetail}
        insetBottom={insets.bottom}
        onLeave={() => openModal('leenkLeave')}
        onFinish={() => openModal('leenkFinish')}
        onClose={() => openModal('leenkClose')}
        onJoin={handleJoin}
        onParticipants={handleParticipants}
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
        leenkId={leenkDetail.id}
        modalType={modalType as any}
        title={leenkDetail.title}
        onClose={closeModal}
        onConfirmDelete={handleConfirmDelete}
        onConfirmLeave={handleLeave}
        onConfirmClose={() => handleLeenkClose(leenkDetail.id)}
        onConfirmFinish={() => handleLeenkFinish(leenkDetail.id)}
      />
      {/* 온보딩 */}
      {showOnBoarding && (
        <OnBoardingModal
          isLeenk
          visible={showOnBoarding}
          onClose={() => setShowOnBoarding(false)}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;
