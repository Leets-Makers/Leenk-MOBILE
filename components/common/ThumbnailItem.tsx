import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import * as MediaLibrary from 'expo-media-library';
import { Image, Platform, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
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
  mode?: 'profile' | 'feed';
}

export default function ThumbnailItem({
  asset,
  selected,
  onToggle,
  getSelectionNumber,
  aspectRatio = '1:1',
  mode = 'profile',
}: ThumbnailItemProps) {
  const number = getSelectionNumber(asset.id);
  const isSelected = selected.some((item) => item.id === asset.id);
  const [uri, setUri] = useState<string | null>(null);

  const imageHeight =
    aspectRatio === '9:16' ? (IMAGE_SIZE * 16) / 9 : IMAGE_SIZE;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const realUri = asset.uri; // 바로 asset.uri 사용

      if (!cancelled) {
        console.log('🖼️ 최종 썸네일 uri:', realUri);
        setUri(realUri);
      }
    };

    load();

    console.log('📸 썸네일 렌더링됨:', asset.filename);

    return () => {
      cancelled = true;
    };
  }, [asset]);

  useEffect(() => {
    console.log('📸 ThumbnailItem mounted:', asset.filename);
  }, []);

  return (
    <TouchableOpacity onPress={() => onToggle(asset)}>
      <ImageWrapper $height={imageHeight}>
        {uri && (
          <Image
            source={{ uri }}
            resizeMode="cover"
            style={{
              width: IMAGE_SIZE,
              height: imageHeight,
            }}
          />
        )}

        {isSelected && <Overlay />}
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

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
`;

const ImageWrapper = styled.View<{ $height: number }>`
  position: relative;
  overflow: hidden;
  width: ${IMAGE_SIZE}px;
  height: ${({ $height }) => $height}px;
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
  z-index: 20;
`;

const BadgeText = styled.Text`
  color: ${colors.white};
  font-size: ${fontSize.sm};
`;
