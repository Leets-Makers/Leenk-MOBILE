import {
  Header,
  BackgroundImageSlider,
  Badge,
  UserListModal,
} from '@/components';
import colors from '@/theme/color';
import { formatDate } from '@/utils/format-date';
import { Text, View, Image } from 'react-native';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { generateMockFeedDetail } from '@/__mocks__/mockFeed';
import { StyledText } from '@/app/(post)/feed/write';
import HeartButton from '@/components/feed/HeartButton';
import styled from 'styled-components/native';
import { useState } from 'react';
import MenuModal from '@/components/Modal/MenuModal';
import { CONTAINER_PADDING } from '@/constants';
import ProfileImageWithFallback from '@/components/feed/ProfileImageWithFallback';

export default function FeedDetailPage() {
  const feed = generateMockFeedDetail();
  const [isModalVisible, setModalVisible] = useState(false); // 유저리스트 모달
  const [isMenuVisible, setMenuVisible] = useState(false); // 케밥 메뉴 모달

  const handleDelete = () => {
    // TODO: 삭제 로직 추가
    console.log('🗑 삭제하기 클릭됨');
    setMenuVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundImageSlider mediaUrls={feed.media.map((m) => m.mediaUrl)} />

      <Header
        isBackWhite
        RightSection="KEBAB"
        kebabPress={() => setMenuVisible(true)}
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
                onPress={() => setModalVisible(true)}
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
        visible={isModalVisible}
        title="함께 연결된 Leets"
        list={feed.linkedUser}
        onClose={() => setModalVisible(false)}
      />
      {/* 삭제 메뉴 모달 */}
      <MenuModal
        visible={isMenuVisible}
        isWrite={false}
        onClose={() => setMenuVisible(false)}
        onPressFirst={() => {}} // 추후 수정하기 옵션 추가 시 사용
        onPressSecond={handleDelete}
      />
    </View>
  );
}

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${10 * height}px;
`;
