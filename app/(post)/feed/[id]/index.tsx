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
import {
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StyledText } from '@/app/(post)/feed/write';
import { CONTAINER_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { deleteFeed, getFeedDetail } from '@/api/feed/feed.api';
import { FeedDetail } from '@/types/feed';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import FeedReportModal from '@/components/Modal/FeedReportModal';
import { useDetailFirstLaunch } from '@/hooks/useFirstLaunch';
import OnBoardingModal from '@/components/Modal/OnBoardingModal';
import GradientOverlay from '@/components/feed/GradientOverlay';

export default function FeedDetailPage() {
  const { id } = useLocalSearchParams();
  const [feed, setFeed] = useState<FeedDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();

  const { userInfo } = useUserStore();

  const firstLaunch = useDetailFirstLaunch();
  const [showOnBoarding, setShowOnBoarding] = useState(false);

  const isAuthor = feed?.author.userId === userInfo?.id;

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

  const getLinkedUserBadgeLabel = (
    linkedUser: FeedDetail['linkedUser'],
    totalCount: number,
  ) => {
    const nonAuthorUsers = linkedUser.filter((u) => !u.isAuthor);
    const firstName = nonAuthorUsers[0]?.name ?? '사용자';
    const othersCount = totalCount - 1;

    return `${firstName} 외 ${othersCount}명`;
  };

  useEffect(() => {
    console.log('firstLaunch', firstLaunch);

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
        console.log('res: ', res.linkedUser);
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
    <View style={{ flex: 1 }}>
      <BackgroundImageSlider mediaUrls={feed.media} />
      <GradientOverlay type="top" heightValue={120 * height} />
      <GradientOverlay type="bottom" heightValue={520 * height} />
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
          paddingHorizontal: CONTAINER_PADDING * width,
          marginBottom: 24 * width,
          minHeight: 220 * height,
          zIndex: 9999,
        }}
      >
        <RowWrapper>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Link href={`/users/${feed.author.userId}`} asChild>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <ProfileImageWithFallback
                  uri={feed.author.profileImage}
                  size={36}
                />
                <StyledText>{feed.author.name}</StyledText>
              </TouchableOpacity>
            </Link>

            {feed.linkedUserCount > 1 && (
              <Badge
                variant="gray"
                label={getLinkedUserBadgeLabel(
                  feed.linkedUser,
                  feed.linkedUserCount,
                )}
                onPress={() => openModal('feedLinked')}
              />
            )}
          </View>
          <HeartButton
            feedId={Number(feed.feedId)}
            totalReactionCount={feed.totalReactionCount}
            authorId={feed.author.userId}
            currentUserId={userInfo?.id}
          />
        </RowWrapper>

        <View
          style={{
            paddingHorizontal: 18 * width,
            paddingBottom: 40 * height,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.md,
              fontFamily: fonts.Bold,
              marginBottom: 8,
              minHeight: 126 * height,
              maxHeight: 126 * height,
            }}
          >
            {feed.description}
          </Text>

          <Text
            style={{
              color: colors.text[4],
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
        onPressFirst={() => {}}
        secondOptionText={isAuthor ? '삭제하기' : '신고하기'}
        onPressSecond={isAuthor ? handleDelete : handleReport}
      />

      {modalType === 'deleteConfirm' && (
        <PopupModal
          isOpen={modalType === 'deleteConfirm'}
          onConfirm={handleConfirmDelete}
          onClose={closeModal}
          isWarning
          mainText="피드를 삭제할거야?"
          subText="삭제하면 복구할 수 없어."
          isCancel={true}
          leftBtnText="취소"
          rightBtnText="삭제할래"
        />
      )}

      <FeedReportModal feedId={feed.feedId} />

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
