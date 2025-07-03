import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import * as MediaLibrary from 'expo-media-library';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { IMAGE_SIZE, ITEM_MARGIN } from '@/constants/dimension.constants';
import colors from '@/theme/color';
import { ToastCheckIcon } from '@/assets';
import { width, height, radius, fontSize } from '@/theme/globalStyles';
import { useFeedWriteStore } from '@/stores/\bfeedWriteStore';

interface ThumbnailItemProps {
  asset: MediaLibrary.Asset;
  aspectRatio?: '1:1' | '9:16';
  mode?: 'profile' | 'feed'; // 프로필 선택인지 피드 이미지 선택 페이지인지 구분
}

export default function ThumbnailItem({
  asset,
  aspectRatio = '1:1',
  mode = 'profile',
}: ThumbnailItemProps) {
  const [uri, setUri] = useState<string | null>(null);

  const selectedImages = useFeedWriteStore((state) => state.selectedImages);
  const setSelectedImages = useFeedWriteStore(
    (state) => state.setSelectedImages,
  );

  const isSelected = selectedImages.includes(asset.uri);
  const imageHeight =
    aspectRatio === '9:16' ? (IMAGE_SIZE * 16) / 9 : IMAGE_SIZE;

  const getSelectionNumber = (photoUri: string) => {
    const index = selectedImages.findIndex((uri) => uri === photoUri);
    return index >= 0 ? index + 1 : null;
  };

  const handleToggle = () => {
    const updated = isSelected
      ? selectedImages.filter((uri) => uri !== asset.uri)
      : selectedImages.length < 3
        ? [...selectedImages, asset.uri]
        : selectedImages;

    setSelectedImages(updated);
  };
  useEffect(() => {
    setUri(asset.uri);
    console.log('📸 썸네일 렌더링됨:', asset.filename);
  }, [asset]);

  return (
    <TouchableOpacity onPress={handleToggle}>
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
              {mode === 'profile' ? (
                <ToastCheckIcon />
              ) : (
                getSelectionNumber(asset.uri)
              )}
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
