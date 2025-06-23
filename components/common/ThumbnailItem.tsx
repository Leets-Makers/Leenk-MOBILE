import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import * as MediaLibrary from 'expo-media-library';
import { TouchableOpacity } from 'react-native';
import { imageSize } from '@/constants/dimension.constants';
import colors from '@/theme/color';
import { BackArrowIcon } from '@/assets';

interface ThumbnailItemProps {
  asset: MediaLibrary.Asset;
  selected: MediaLibrary.Asset[];
  onToggle: (photo: MediaLibrary.Asset) => void;
  getSelectionNumber: (id: string) => number | null;
  aspectRatio?: '1:1' | '4:3';
}

export default function ThumbnailItem({
  asset,
  selected,
  onToggle,
  getSelectionNumber,
  aspectRatio = '4:3',
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

  const height = aspectRatio === '1:1' ? imageSize : (imageSize * 4) / 3;

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
  width: ${imageSize}px;
  height: ${({ $height }) => $height}px;
  margin: 1px;
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
