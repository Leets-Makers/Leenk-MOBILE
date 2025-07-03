import colors from '@/theme/color';
import styled from 'styled-components/native';
import { useState } from 'react';
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
} from '@/components';

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

// 내일 할일
// 모달이 너무많음 -> 모달 전역상태 관리 하도록 수정 , 삭제하기 클릭 시 나오는 모달 추가 , 토스트 추가
// 유저리스트모달 : 블러뷰 - 안드로이드 적용 안됨, 내부 스크롤 안됨
// 버튼 정렬 : 그냥 커스텀 버튼 쓰지말자
// 함께하는 사람 추가 페이지: 이름 검색 , 내부 패딩 및 스크롤 길이 조정 (버튼 잘림), 멤버 체크 시 위로 정렬되도록
// 피드 글 작성: textarea, connectedUser 함께 전역상태관리 , 업로드 할래 클릭 시 로딩 팝업 모달
// 피드 api 연결
