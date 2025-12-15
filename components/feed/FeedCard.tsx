import { useRouter } from 'expo-router';
import { FeedItem } from '@/types/feed';
import { width, height, radius } from '@/theme/globalStyles';
import styled from 'styled-components/native';
import { Badge, ProfileImageWithFallback } from '@/components';
import { getNumberWithComma } from '@/utils';

interface FeedCardProps {
  item: FeedItem;
}

export default function FeedCard({ item }: FeedCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/feed/${item.feedId}`);
  };

  return (
    <CardContainer onPress={handlePress}>
      <Thumbnail source={{ uri: item.thumbNail }} resizeMode="cover">
        <OverlayTopLeft>
          <ProfileImageWithFallback
            uri={item.author.thumbnail}
            isUserBirthdayToday={item.author.isUserBirthdayToday}
          />
        </OverlayTopLeft>

        <OverlayBottomRight>
          <Badge
            variant="white"
            label={getNumberWithComma(item.totalReactionCount)}
          />
        </OverlayBottomRight>
      </Thumbnail>
    </CardContainer>
  );
}

export const CardContainer = styled.Pressable`
  width: 48%;
  border-radius: ${radius.md * width}px;
  overflow: hidden;
  margin-bottom: ${10 * height}px;
`;

export const Thumbnail = styled.ImageBackground`
  width: 100%;
  height: ${290 * height}px;
  position: relative;
`;

export const ProfileImage = styled.Image`
  width: ${36 * width}px;
  height: ${36 * width}px;
  border-radius: ${radius.full * width}px;
  margin-right: ${8 * width}px;
`;

export const OverlayTopLeft = styled.View`
  position: absolute;
  top: ${12 * height}px;
  left: ${12 * width}px;
`;

export const OverlayBottomRight = styled.View`
  position: absolute;
  bottom: ${15 * height}px;
  right: ${15 * width}px;
`;
