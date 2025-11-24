import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import {
  Header,
  BackgroundImageSlider,
  Badge,
  UserListModal,
  ProfileImageWithFallback,
  HeartButton,
  MenuModal,
  PopupModal,
  Loading,
} from '@/components';
import colors from '@/theme/color';
import styled from 'styled-components/native';
import { formatDate } from '@/utils/format-date';
import { Text, TouchableOpacity, View } from 'react-native';
import { StyledText } from '@/components/feed/write/AuthorContent';
import { CONTAINER_PADDING, FEED_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { deleteFeed, getFeedDetail } from '@/api/feed/feed.api';
import { FeedDetail } from '@/types/feed';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import FeedReportModal from '@/components/Modal/TextInputModal';
import { useDetailFirstLaunch } from '@/hooks/useFirstLaunch';
import OnBoardingModal from '@/components/Modal/OnBoardingModal';
import { useFeedWriteStore } from '@/stores/feedWriteStore';
import { getLinkedUserBadgeLabel } from '@/utils/getLinkedUserBadgeLabel';

export default function FeedDetailPage() {
  const { id } = useLocalSearchParams();
  const [feed, setFeed] = useState<FeedDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();

  const { userInfo } = useUserStore();

  const firstLaunch = useDetailFirstLaunch();
  const [showOnBoarding, setShowOnBoarding] = useState(false);

  const isAuthor = feed?.author.userId === userInfo?.userId;

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

  const handleDelete = () => {
    closeModal();
    openModal('deleteConfirm');
  };

  const handleReport = () => {
    closeModal();
    openModal('feedReport');
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFeed(Number(id));
      showToast('삭제 완료!', 'success');

      setTimeout(() => {
        router.replace('/(page)/feed');
      }, 1500);
    } catch (err: any) {
      console.error('피드 삭제 오류:', err);
      showToast('삭제 실패!', 'error');
    } finally {
      closeModal();
    }
  };

  const label = getLinkedUserBadgeLabel(feed?.linkedUser ?? [], {
    id: (u) => u.userId,
    name: (u) => u.name,
    isAuthor: (u) => !!u.isAuthor, // 응답에 isAuthor 존재
    totalCountOverride: feed?.linkedUserCount, // 서버 total이 따로 있을 때 반영
  });

  useEffect(() => {
    if (firstLaunch === true) {
      setShowOnBoarding(true);
    }
  }, [firstLaunch]);

  useEffect(() => {
    if (!id) return;

    const fetchFeedDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getFeedDetail(Number(id));
        setFeed(res);
      } catch (err: any) {
        console.error('피드 상세 조회 오류:', err);
        showToast('피드 조회에 실패했어!', 'error');
        setTimeout(() => {
          router.replace('/(page)/feed');
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedDetail();
  }, [id, showToast]);

  if (isLoading) return <Loading />;

  if (!feed) return null;

  return (
    <View pointerEvents="box-none" style={{ flex: 1 }}>
      <BackgroundImageSlider
        mediaUrls={feed.media}
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
          zIndex: 9999,
          paddingHorizontal: CONTAINER_PADDING * width,
        }}
      />

      {/* 본문 */}
      <View
        style={{
          paddingHorizontal: FEED_PADDING * width,
          minHeight: 220 * height,
          zIndex: 9999,
        }}
      >
        <RowWrapper>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Link href={`/users/${feed.author.userId}`} asChild>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <ProfileImageWithFallback
                  uri={feed.author.profileImage}
                  size={36}
                  isUserBirthdayToday={feed.author.isUserBirthdayToday}
                />
                <StyledText>{feed.author.name}</StyledText>
              </TouchableOpacity>
            </Link>

            {feed.linkedUserCount > 1 && label && (
              <Badge
                variant="gray"
                label={label}
                onPress={() => openModal('feedLinked')}
              />
            )}
          </View>
          <HeartButton
            feedId={Number(feed.feedId)}
            totalReactionCount={feed.totalReactionCount}
            authorId={feed.author.userId}
            currentUserId={userInfo?.userId}
            flushOnExit
          />
        </RowWrapper>

        <View
          style={{
            paddingHorizontal: 15 * width,
            paddingBottom: 76 * height,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.md,
              fontFamily: fonts.Bold,
              paddingBottom: 8 * height,
              minHeight: 90 * height,
              maxHeight: 134 * height,
            }}
          >
            {feed.description}
          </Text>

          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.md,
              fontFamily: fonts.Light,
              lineHeight: lineHeight.s,
            }}
          >
            {formatDate(feed.createdAt)}
          </Text>
        </View>
      </View>

      <UserListModal
        visible={modalType === 'feedLinked'}
        title="함께 연결된 Leets"
        list={feed.linkedUser}
        onClose={closeModal}
      />

      <MenuModal
        visible={modalType === 'menu'}
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
          isOpen={modalType === 'deleteConfirm'}
          onRightBtn={handleConfirmDelete}
          onLeftBtn={closeModal}
          isWarning
          mainText="피드를 삭제할거야?"
          subText="삭제하면 복구할 수 없어."
          isCancel={true}
          leftBtnText="취소"
          rightBtnText="삭제할래"
        />
      )}

      <FeedReportModal type="feed" feedId={feed.feedId} />

      {/* 온보딩 */}
      {showOnBoarding && (
        <OnBoardingModal
          visible={showOnBoarding}
          onClose={() => setShowOnBoarding(false)}
        />
      )}
    </View>
  );
}

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${10 * height}px;
`;
