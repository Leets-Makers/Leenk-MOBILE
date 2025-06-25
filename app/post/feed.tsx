// pages/post/feed.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from '@/components/common/ImagePicker';
import type * as MediaLibrary from 'expo-media-library';
import { CustomButton, Header } from '@/components';
import { BackArrowIcon } from '@/assets';
import { fontSize, fonts, height, width, radius } from '@/theme/globalStyles';
import colors from '@/theme/color';

const SIDE_PADDING = 16;

export default function PostFeedPage() {
  const [selectedImages, setSelectedImages] = useState<MediaLibrary.Asset[]>(
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: SIDE_PADDING * width,
        }}
      >
        <Header
          LeftSection={<BackArrowIcon />}
          TitleSection={
            <Text
              style={{ fontFamily: fonts.ExtraBold, fontSize: fontSize.lg }}
            >
              게시물 사진 선택
            </Text>
          }
        />
        <Text
          style={{
            fontFamily: fonts.Regular,
            fontSize: fontSize.sm,
            color: colors.primary,
            paddingBottom: 16 * height,
          }}
        >
          최대 3장까지 선택 가능해
        </Text>
        <View style={{ flex: 1 }}>
          <ImagePicker
            maxSelect={3}
            aspectRatio={9 / 16}
            onChange={setSelectedImages}
            mode="feed"
          />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: SIDE_PADDING * width,
          paddingBottom: 32 * height,
          paddingTop: 16 * height,
        }}
      >
        <CustomButton
          variant="primary"
          size="lg"
          disabled={selectedImages.length === 0}
          onPress={() => {
            if (selectedImages.length > 0) {
              console.log('pressed');
            }
          }}
        >
          <ButtonContent>
            {selectedImages.length > 0 && (
              <CircleBadge>
                <ButtonText>{selectedImages.length}</ButtonText>
              </CircleBadge>
            )}
          </ButtonContent>
          <Text>다음</Text>
        </CustomButton>
      </View>
    </View>
  );
}

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CircleBadge = styled.View`
  background-color: ${colors.primaryDark};
  border-radius: ${radius.full}px;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const ButtonText = styled.Text<{ disabled?: boolean }>`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm}px;
  color: ${({ disabled }) => (disabled ? colors.gray[100] : colors.white)};
`;
