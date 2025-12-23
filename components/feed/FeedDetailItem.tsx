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
import FeedReportModal from '@/components/Modal/TextInputModal';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { CONTAINER_PADDING, FEED_PADDING } from '@/constants';
import { Media } from '@/types/feed';
import { StyledText } from './write/AuthorContent';
import { useFeedWriteStore } from '@/stores/feedWriteStore';

interface Props {
  feed: FeedDetail;
}

export default function FeedDetailItem({ feed }: Props) {
  console.log('[FeedDetailItem] 피드 ID:', feed.feedId);

  const { modalType, openModal, closeModal, payload } = useModalStore();
  const isOpen = modalType === 'feedLinked' && payload?.feedId === feed.feedId;
  const isMenuOpen = modalType === 'menu' && payload?.feedId === feed.feedId;

  const { showToast } = useToastStore();
  const { userInfo } = useUserStore();

  // 미디어(이미지) 배열 목록
  const media: Media[] = useMemo(() => {
    if (!Array.isArray(feed?.media)) return [];

    return feed.media.filter(
      (item): item is Media =>
        typeof item.mediaUrl === 'string' && item.mediaUrl.length > 0,
    );
  }, [feed?.media]);

  // 작성자 관련
  const authorId = feed?.author?.userId ?? 0;
  const authorName = feed?.author?.name ?? '사용자';
  const authorProfile = feed?.author?.thumbnail ?? undefined;
  const isAuthor = authorId === userInfo?.userId;
  const isAuthorBirthdayToday = feed?.author?.isUserBirthdayToday;
  const linkedCount = feed?.linkedUserCount ?? 0;

  // 함께한 유저 목록
  const linkedUser = useMemo(() => {
    if (!feed?.linkedUser || !Array.isArray(feed.linkedUser)) return [];
    const result = [...feed.linkedUser];

    return result;
  }, [feed?.feedId, feed?.linkedUser]);

  const linkedLabel = useMemo(() => {
    const nonAuthor = linkedUser.filter((u) => !u.isAuthor);
    const first = nonAuthor[0]?.name ?? '사용자';
    const others = Math.max(linkedCount - 1, 0);
    return others > 0 ? `${first} 외 ${others}명` : first;
  }, [linkedUser, linkedCount]);

  // 피드 작성 날짜
  const createdAtText = useMemo(() => {
    if (!feed?.createdAt) return '';

    const date = new Date(feed.createdAt);
    if (Number.isNaN(date.getTime())) return '';

    return formatDate(feed.createdAt);
  }, [feed?.createdAt]);

  // 피드 수정 로직
  const handleEdit = () => {
    if (!feed) return;

    closeModal();

    const store = useFeedWriteStore.getState();
    store.reset(); // 이전 편집 상태  초기화
    store.startEditFromDetail(feed); // 현재 상세의 데이터를 프리필

    router.push({
      pathname: '/(post)/feed/write',
      params: { mode: 'edit', feedId: String(feed?.feedId) },
    });
  };

  // 피드 삭제/신고 로직
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
      {media.length > 0 && (
        <BackgroundImageSlider
          mediaUrls={media}
          gradient={{ top: 120 * height, bottom: 520 * height }}
        />
      )}

      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => openModal('menu', null, { feedId: feed.feedId })}
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
                <ProfileImageWithFallback
                  uri={authorProfile}
                  size={36}
                  isUserBirthdayToday={isAuthorBirthdayToday}
                />
                <StyledText>{authorName}</StyledText>
              </TouchableOpacity>
            </Link>

            {linkedCount > 1 && (
              <Badge
                variant="gray"
                label={linkedLabel}
                onPress={() =>
                  openModal('feedLinked', null, { feedId: feed.feedId })
                }
              />
            )}
          </View>

          <HeartButton
            feedId={Number(feed.feedId)}
            totalReactionCount={feed.totalReactionCount ?? 0}
            authorId={authorId}
            currentUserId={userInfo?.userId}
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
        visible={isOpen}
        title="함께 연결된 Leets"
        list={linkedUser}
        onClose={closeModal}
      />

      <MenuModal
        visible={isMenuOpen}
        isWrite={false}
        onClose={closeModal}
        isOneOption={!isAuthor}
        firstOptionText={isAuthor ? '수정하기' : '신고하기'}
        secondOptionText={isAuthor ? '삭제하기' : undefined}
        onPressFirst={isAuthor ? handleEdit : handleReport}
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

      <FeedReportModal feedId={feed.feedId} type="feed" />
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
