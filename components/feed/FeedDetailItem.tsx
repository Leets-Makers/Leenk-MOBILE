// 상세 피드에서 수직 스크롤을 위해 분리한 컴포넌트
// TODO: 상세 피드에서 위아래 스크롤 시 이전/다음 피드로 넘어가도록 해야함

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
} from '@/components';
import colors from '@/theme/color';
import { formatDate } from '@/utils/format-date';
import { Text, View } from 'react-native';
import { StyledText } from '@/app/(post)/feed/write';
import { CONTAINER_PADDING } from '@/constants';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import { router } from 'expo-router';
import { deleteFeed } from '@/api/feed/feed.api';
import { FeedDetail } from '@/types/feed';
import { useUserStore } from '@/stores/userStore';
import styled from 'styled-components/native';
import { useCallback } from 'react';
import FeedReportModal from '../Modal/FeedReportModal';

interface Props {
  feed: FeedDetail;
}

export default function FeedDetailItem({ feed }: Props) {
  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();
  const { userInfo } = useUserStore();

  const isAuthor = feed.author.userId === userInfo?.id;

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
        router.replace('/(page)/feed'); // 삭제 후 목록으로 이동
      }, 1500);
    } catch (err: any) {
      console.error('피드 삭제 오류:', err);
      showToast('삭제 실패!', 'error');
    } finally {
      closeModal();
    }
  }, [feed.feedId, closeModal, showToast]);

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
          marginBottom: 52 * width,
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
            paddingBottom: 48 * height,
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
      {/* {modalType === 'feedReport' && (
        <FeedReportModal
          isOpen={modalType === 'feedReport'}
          onClose={closeModal}
          onSubmit={(reason) => {
            console.log(`신고 사유: ${reason}`);
            closeModal();
            showToast('신고 완료!', 'success');
          }}
        />
      )} */}
    </View>
  );
}

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${10 * height}px;
`;
