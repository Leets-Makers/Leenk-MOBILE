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
import { Text, View } from 'react-native';
import { StyledText } from '@/app/(post)/feed/write';
import { CONTAINER_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import { router, useLocalSearchParams } from 'expo-router';
import { deleteFeed, getFeedDetail } from '@/api/feed/feed.api';
import { FeedDetail } from '@/types/feed';
import { useEffect, useState } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useUserStore } from '@/stores/userStore';
import FeedReportModal from '@/components/Modal/FeedReportModal';

export default function FeedDetailPage() {
  const { id } = useLocalSearchParams();
  const [feed, setFeed] = useState<FeedDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();

  const { userInfo } = useUserStore();

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

      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => openModal('menu')}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 20,
          paddingHorizontal: CONTAINER_PADDING * width,
        }}
      />

      {/* 본문 */}
      <View
        style={{
          paddingHorizontal: CONTAINER_PADDING * width,
          marginBottom: 24 * width,
          minHeight: 220 * height,
        }}
      >
        {/* 작성자 정보 + 배지 */}
        <RowWrapper>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <View style={{ marginRight: 8 * width }}>
              <ProfileImageWithFallback
                uri={feed.author.profileImage}
                size={36}
              />
            </View>
            <StyledText>{feed.author.name}</StyledText>

            {feed.linkedUserCount > 1 && (
              <Badge
                variant="gray"
                label={`${feed.author.name} 외 ${feed.linkedUserCount - 1}명`}
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

        {/* 게시물 내용 */}
        <View
          style={{
            paddingHorizontal: 18 * width,
            paddingBottom: 40 * height,
          }}
        >
          <Text
            style={{
              color: colors.gray[400],
              fontSize: fontSize.md,
              fontFamily: fonts.Bold,
              marginBottom: 8,
              minHeight: 126 * height,
              maxHeight: 126 * height,
            }}
          >
            {feed.description}
          </Text>

          {/* 작성 날짜 */}

          <Text
            style={{
              color: colors.text[3],
              fontSize: fontSize.md,
              fontFamily: fonts.Light,
              lineHeight: lineHeight.s,
            }}
          >
            {formatDate(feed.createdAt)}
          </Text>
        </View>
      </View>
      {/* 유저리스트 모달 */}
      <UserListModal
        visible={modalType === 'feedLinked'}
        title="함께 연결된 Leets"
        list={feed.linkedUser}
        onClose={closeModal}
      />
      {/* 삭제 메뉴 모달 */}
      <MenuModal
        visible={modalType === 'menu'}
        isWrite={false}
        onClose={closeModal}
        onPressFirst={() => {}} // 추후 수정하기 옵션 추가 시 사용
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
      {modalType === 'feedReport' && (
        <FeedReportModal
          isOpen={modalType === 'feedReport'}
          onClose={closeModal}
          onSubmit={(reason) => {
            console.log(`신고 사유: ${reason}`);
            closeModal();
            showToast('신고 완료!', 'success');
          }}
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
