import React, { useEffect } from 'react';
import { FlatList, Platform, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { ThumbnailItem } from '@/components';
import useImagePicker from '@/hooks/useImagePicker';
import { NUM_COLUMNS } from '@/constants';
import { useImageStore } from '@/stores/feedImageStore';
import { AspectRatio } from '@/types/aspect-ratio';
import { width } from '@/theme/globalStyles';

interface ImagePickerProps {
  maxSelect: number;
  aspectRatio: AspectRatio; // 1:1(SQUARE) or 9:16(PORTRAIT)
  mode?: 'profile' | 'feed'; // 프로필 이미지 선택인지 피드 이미지 선택인지 구분
}

export default function ImagePicker({
  maxSelect,
  aspectRatio = AspectRatio.SQUARE,
  mode = 'profile',
}: ImagePickerProps) {
  const {
    photos,
    selected,
    toggleSelect,
    getSelectionNumber,
    requestPermission,
    hasPermission,
    fetchPhotos,
    hasNextPage,
  } = useImagePicker({ maxSelect });

  // 권한 요청 및 초기 사진 로딩
  useEffect(() => {
    (async () => {
      try {
        const granted = await requestPermission();
        if (granted) {
          await fetchPhotos();
        }
      } catch (error) {
        console.error('이미지 권한 요청 또는 사진 가져오기 실패:', error);
      }
    })();
  }, []);

  if (hasPermission === false) return null;

  return (
    <View style={{ flex: 1, maxHeight: 600 }}>
      <FlatList
        data={photos}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 4 * width,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ flexGrow: 1 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage) fetchPhotos();
        }}
        renderItem={({ item }) => (
          <ThumbnailItem
            asset={item}
            selected={selected}
            onToggle={toggleSelect}
            getSelectionNumber={getSelectionNumber}
            aspectRatio={aspectRatio}
            mode={mode}
          />
        )}
      />
    </View>
  );
}
