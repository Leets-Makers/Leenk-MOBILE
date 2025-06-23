import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import * as MediaLibrary from 'expo-media-library';
import { TouchableOpacity } from 'react-native';
import { IMAGE_SIZE, ITEM_MARGIN } from '@/constants/dimension.constants';
import colors from '@/theme/color';
import { BackArrowIcon } from '@/assets';

interface ThumbnailItemProps {
  asset: MediaLibrary.Asset;
  selected: MediaLibrary.Asset[];
  onToggle: (photo: MediaLibrary.Asset) => void;
  getSelectionNumber: (id: string) => number | null;
  aspectRatio?: '1:1' | '9:16';
}

export default function ThumbnailItem({
  asset,
  selected,
  onToggle,
  getSelectionNumber,
  aspectRatio = '1:1',
}: ThumbnailItemProps) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const info = await MediaLibrary.getAssetInfoAsync(asset.id);
      setUri(info.localUri ?? asset.uri);
    };
    load();
  }, [asset]);

  const number = getSelectionNumber(asset.id);
  const isSelected = selected.some((item) => item.id === asset.id);

  // const height = aspectRatio === '1:1' ? IMAGE_SIZE : (IMAGE_SIZE * 4) / 3;

  const aspectHeight =
    aspectRatio === '1:1'
      ? IMAGE_SIZE
      : aspectRatio === '9:16'
        ? (IMAGE_SIZE * 16) / 9
        : IMAGE_SIZE;

  const height = aspectHeight;

  if (!uri) return null;

  return (
    <TouchableOpacity onPress={() => onToggle(asset)}>
      <ImageWrapper>
        <StyledImage source={{ uri }} $height={height} />
        {isSelected && (
          <Badge>
            <BadgeText>
              {selected.length === 1 ? <BackArrowIcon /> : number}
            </BadgeText>
          </Badge>
        )}
      </ImageWrapper>
    </TouchableOpacity>
  );
}

const ImageWrapper = styled.View`
  position: relative;
`;

const StyledImage = styled.Image<{ $height: number }>`
  width: ${IMAGE_SIZE}px;
  height: ${({ $height }) => $height}px;
  margin-bottom: ${ITEM_MARGIN}px;
`;

const Badge = styled.View`
  position: absolute;
  top: 6px;
  right: 6px;
  background-color: ${colors.primary};
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 12px;
`;
