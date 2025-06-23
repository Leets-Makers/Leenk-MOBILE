// pages/post/feed.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ImagePicker from '@/components/common/ImagePicker';
import type * as MediaLibrary from 'expo-media-library';
import { Header } from '@/components';
import { BackArrowIcon } from '@/assets';
import { fontSize, fonts, width } from '@/theme/globalStyles';
import colors from '@/theme/color';

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
      <Header
        LeftSection={<BackArrowIcon />}
        TitleSection={
          <Text style={{ fontFamily: fonts.ExtraBold, fontSize: fontSize.lg }}>
            게시물 사진 선택
          </Text>
        }
      />
      <Text
        style={{
          fontFamily: fonts.Regular,
          fontSize: fontSize.sm,
          color: colors.primary,
        }}
      >
        최대 3장까지 선택 가능해.
      </Text>
      <ImagePicker
        maxSelect={3}
        aspectRatio={9 / 16}
        onChange={setSelectedImages}
      />
    </View>
  );
}
