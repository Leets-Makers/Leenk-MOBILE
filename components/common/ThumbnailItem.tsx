import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import * as MediaLibrary from 'expo-media-library';
import { TouchableOpacity } from 'react-native';
import { IMAGE_SIZE, ITEM_MARGIN } from '@/constants/dimension.constants';
import colors from '@/theme/color';
import { ToastCheckIcon } from '@/assets';
import { width, height, radius, fontSize } from '@/theme/globalStyles';

interface ThumbnailItemProps {
  asset: MediaLibrary.Asset;
  selected: MediaLibrary.Asset[];
  onToggle: (photo: MediaLibrary.Asset) => void;
  getSelectionNumber: (id: string) => number | null;
  aspectRatio?: '1:1' | '9:16';
  mode?: 'profile' | 'feed'; // 프로필 선택인지 피드 이미지 선택 페이지인지 구분
}

export default function ThumbnailItem({
  asset,
  selected,
  onToggle,
  getSelectionNumber,
  aspectRatio = '1:1',
  mode = 'profile',
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
          <CheckBadge>
            <BadgeText>
              {mode === 'profile' ? <ToastCheckIcon /> : number}
            </BadgeText>
          </CheckBadge>
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
  margin-right: ${ITEM_MARGIN * width}px;
  margin-bottom: ${ITEM_MARGIN * height}px;
`;

const CheckBadge = styled.View`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: ${colors.primary};
  width: ${22 * width}px;
  height: ${22 * height}px;
  border-radius: ${radius.full}px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: ${colors.white};
  font-size: ${fontSize.sm};
`;
