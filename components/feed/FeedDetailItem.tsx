import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import {
  Header,
  BackgroundImageSlider,
  Badge,
  UserListModal,
  ProfileImageWithFallback,
  HeartButton,
  MenuModal,
  PopupModal,
} from '@/components';

import { deleteFeed } from '@/api/feed/feed.api';
import { FeedDetail } from '@/types/feed';
import { formatDate } from '@/utils/format-date';
import colors from '@/theme/color';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import FeedReportModal from '@/components/Modal/FeedReportModal';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { CONTAINER_PADDING, FEED_PADDING } from '@/constants';
import { StyledText } from '@/app/(post)/feed/write';
import { Media } from '@/types/feed';

interface Props {
  feed: FeedDetail;
}

export default function FeedDetailItem({ feed }: Props) {
  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();
  const { userInfo } = useUserStore();

  // ─────────────────────────────────────────────
  // 1) media 안전 폴백 + BackgroundImageSlider 타입 맞추기
  //    - 컴포넌트가 Media[] (ex: {url, type}) 를 기대하는 경우를 맞춰줌
  // ─────────────────────────────────────────────

  const media: Media[] = useMemo(() => {
    // 서버/목록/상세에 따라 키가 다를 수 있음 → 가능한 모든 후보에서 수집
    const raw =
      (feed as any)?.media ??
      (feed as any)?.mediaUrls ??
      (feed as any)?.images ??
      (feed as any)?.files ??
      [];

    // 문자열 배열이면 { url } 객체로 매핑
    if (typeof raw[0] === 'string') {
      return (raw as string[]).filter(Boolean).map<Media>((url, idx) => ({
        mediaUrl: url,
        position: idx,
        mediaId: `${feed?.feedId ?? 'tmp'}_${idx}`,
        type: 'IMAGE',
        mediaType: 'IMAGE', // mediaType 필드 추가 (필수)
      }));
    }

    return [];
  }, [feed]);

  // ─────────────────────────────────────────────
  // 2) 작성자 정보 안전 폴백
  // ─────────────────────────────────────────────
  const authorId = feed?.author?.userId ?? 0;
  const authorName = feed?.author?.name ?? '사용자';
  const authorProfile = feed?.author?.profileImage ?? undefined;
  const isAuthor = authorId === userInfo?.id;

  // ─────────────────────────────────────────────
  // 3) 연결 배지 라벨 (널가드)
  // ─────────────────────────────────────────────
  const linkedCount = feed?.linkedUserCount ?? 0;
  const linkedUser = Array.isArray(feed?.linkedUser) ? feed.linkedUser : [];
  const linkedLabel = useMemo(() => {
    const nonAuthor = linkedUser.filter((u) => !u.isAuthor);
    const first = nonAuthor[0]?.name ?? '사용자';
    const others = Math.max(linkedCount - 1, 0);
    return others > 0 ? `${first} 외 ${others}명` : first;
  }, [linkedUser, linkedCount]);

  // ─────────────────────────────────────────────
  // 4) 날짜 표시 안전 처리
  //    - NaN년 NaN월 NaN일 방지: createdAt 존재/파싱 가능할 때만 formatDate
  // ─────────────────────────────────────────────
  const createdAtText = useMemo(() => {
    const raw =
      (feed as any)?.createdAt ??
      (feed as any)?.created_at ??
      (feed as any)?.createdDate ??
      null;

    if (!raw) return ''; // 값이 없으면 빈 문자열

    // formatDate가 문자열/Date 모두 받는다면 그대로 전달,
    // 아니라면 new Date로 검증 후 전달
    const d = new Date(raw);
    if (isNaN(d.getTime())) return '';
    return formatDate(raw);
  }, [feed]);

  // ─────────────────────────────────────────────
  // 5) 메뉴/삭제/신고 로직
  // ─────────────────────────────────────────────
  const handleDelete = useCallback(() => {
    closeModal();
    openModal('deleteConfirm');
  }, [closeModal, openModal]);

  const handleReport = useCallback(() => {
    closeModal();
    openModal('feedReport');
  }, [closeModal, openModal]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteFeed(feed.feedId);
      showToast('삭제 완료!', 'success');
      setTimeout(() => {
        router.replace('/(page)/feed');
      }, 1200);
    } catch {
      showToast('삭제 실패!', 'error');
    } finally {
      closeModal();
    }
  }, [feed.feedId, closeModal, showToast]);

  return (
    <Wrapper>
      <BackgroundImageSlider
        mediaUrls={media}
        gradient={{ top: 120 * height, bottom: 520 * height }}
      />

      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => openModal('menu')}
        style={{
          position: 'absolute',
          top: 35,
          width: '100%',
          zIndex: 20,
          paddingHorizontal: CONTAINER_PADDING * width,
        }}
      />

      {/* 본문 */}
      <Body>
        <TopRow>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Link href={`/users/${authorId}`} asChild>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <ProfileImageWithFallback uri={authorProfile} size={36} />
                <StyledText>{authorName}</StyledText>
              </TouchableOpacity>
            </Link>

            {linkedCount > 1 && (
              <Badge
                variant="gray"
                label={linkedLabel}
                onPress={() => openModal('feedLinked')}
              />
            )}
          </View>

          <HeartButton
            feedId={Number(feed.feedId)}
            totalReactionCount={feed.totalReactionCount ?? 0}
            authorId={authorId}
            currentUserId={userInfo?.id}
            flushOnExit
          />
        </TopRow>

        <View
          style={{ paddingHorizontal: 15 * width, paddingBottom: 76 * height }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.md,
              fontFamily: fonts.Bold,
              paddingBottom: 8 * height,
              minHeight: 90 * height,
              maxHeight: 126 * height,
            }}
            numberOfLines={5}
          >
            {feed?.description ?? ''}
          </Text>

          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.md,
              fontFamily: fonts.Light,
              lineHeight: lineHeight.s,
            }}
          >
            {createdAtText}
          </Text>
        </View>
      </Body>

      {/* 모달들 */}
      <UserListModal
        visible={modalType === 'feedLinked'}
        title="함께 연결된 Leets"
        list={linkedUser}
        onClose={closeModal}
      />

      <MenuModal
        visible={modalType === 'menu'}
        isWrite={false}
        onClose={closeModal}
        isOneOption={!isAuthor}
        firstOptionText={isAuthor ? '수정하기' : '신고하기'}
        secondOptionText={isAuthor ? '삭제하기' : undefined}
        onPressFirst={isAuthor ? () => {} : handleReport}
        onPressSecond={isAuthor ? handleDelete : undefined}
      />

      {modalType === 'deleteConfirm' && (
        <PopupModal
          isOpen
          onRightBtn={handleConfirmDelete}
          onLeftBtn={closeModal}
          isWarning
          mainText="피드를 삭제할거야?"
          subText="삭제하면 복구할 수 없어."
          isCancel
          leftBtnText="취소"
          rightBtnText="삭제할래"
        />
      )}

      <FeedReportModal feedId={feed.feedId} />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
`;

const Body = styled.View`
  padding: 0 ${FEED_PADDING * width}px;
  min-height: ${220 * height}px;
  z-index: 10;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${10 * height}px;
`;
