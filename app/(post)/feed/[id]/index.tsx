import colors from '@/theme/color';
import styled from 'styled-components/native';
import { formatDate } from '@/utils/format-date';
import { Text, View } from 'react-native';
import { generateMockFeedDetail } from '@/__mocks__/mockFeed';
import { StyledText } from '@/app/(post)/feed/write';
import { CONTAINER_PADDING } from '@/constants';
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
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';

export default function FeedDetailPage() {
  const feed = generateMockFeedDetail();
  const { modalType, openModal, closeModal } = useModalStore();
  const { showToast } = useToastStore();

  const handleDelete = () => {
    // TODO: 삭제 로직 추가
    closeModal();
    openModal('deleteConfirm');
  };

  const handleConfirmDelete = () => {
    closeModal();

    // TODO: 삭제 API 호출

    showToast('삭제 완료!', 'success');
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundImageSlider mediaUrls={feed.media.map((m) => m.mediaUrl)} />

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
                onPress={() => openModal('userList')}
              />
            )}
          </View>
          <HeartButton />
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
        visible={modalType === 'userList'}
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
        onPressSecond={handleDelete}
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
    </View>
  );
}

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${10 * height}px;
`;
