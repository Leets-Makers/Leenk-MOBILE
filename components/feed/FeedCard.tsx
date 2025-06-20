import { FeedItem } from '@/types/feed';
import { width, height, radius } from '@/theme/globalStyles';
import styled from 'styled-components/native';
import { Badge, Textarea } from '@/components';

interface FeedCardProps {
  item: FeedItem;
}

export default function ({ item }: FeedCardProps) {
  return (
    <CardContainer>
      <Thumbnail source={{ uri: item.thumbNail }} resizeMode="cover">
        <OverlayTopLeft>
          <ProfileImage source={{ uri: item.author.profileImage }} />
        </OverlayTopLeft>

        <OverlayBottomRight>
          <Badge variant="white" label={item.totalReactionCount} />
        </OverlayBottomRight>
      </Thumbnail>
    </CardContainer>
  );
}

export const CardContainer = styled.View`
  width: 48%;
  border-radius: ${radius.md * width}px;
  overflow: hidden;
  margin-bottom: ${10 * height}px;
`;

export const Thumbnail = styled.ImageBackground`
  width: 100%;
  height: ${290 * height};
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
  bottom: ${10 * height}px;
  right: ${30 * width}px;
`;
