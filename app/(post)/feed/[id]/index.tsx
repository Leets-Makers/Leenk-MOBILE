import { Header, BackgroundImageSlider, Badge } from '@/components';
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
import { KebabIcon } from '@/assets';
import HeartButton from '@/components/feed/HeartButton';
import styled from 'styled-components/native';

export default function FeedDetailPage() {
  const feed = generateMockFeedDetail();
  return (
    <View style={{ flex: 1 }}>
      <BackgroundImageSlider mediaUrls={feed.media.map((m) => m.mediaUrl)} />

      <Header
        isBack
        isBackWhite
        RightSection={<KebabIcon color={colors.white} width={18} height={18} />}
        onRightPress={() => console.log('pressed')}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 20,
          paddingHorizontal: 16 * width,
        }}
      />

      {/* 본문 */}
      <View
        style={{
          paddingHorizontal: 16 * width,
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
            <Image
              source={{ uri: feed.author.profileImage }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 8,
              }}
            />
            <StyledText>{feed.author.name}</StyledText>

            {feed.linkedUserCount > 1 && (
              <Badge
                variant="gray"
                label={`${feed.author.name} 외 ${feed.linkedUserCount - 1}명`}
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
            marginTop: 12 * height,
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
    </View>
  );
}

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${18 * height}px;
`;
