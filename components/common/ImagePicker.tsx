// components/ImagePicker/ImagePicker.tsx
import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import ThumbnailItem from '@/components/common/ThumbnailItem';
import useImagePicker from '@/hooks/useImagePicker';
import { NUM_COLUMNS } from '@/constants/dimension.constants';
import { useImageStore } from '@/stores/feedImageStore';

interface ImagePickerProps {
  maxSelect: number;
  aspectRatio: number;
  mode?: 'profile' | 'feed'; // 프로필 이미지 선택인지 피드 이미지 선택인지 구분
}

export default function ImagePicker({
  maxSelect,
  aspectRatio,
  mode = 'profile',
}: ImagePickerProps) {
  const {
    photos,
    selected,
    toggleSelect,
    getSelectionNumber,
    hasPermission,
    fetchPhotos,
    hasNextPage,
  } = useImagePicker({ maxSelect });

  // 사진 불러오기
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Zustand에 URI 저장
  useEffect(() => {
    const saveUris = async () => {
      const uris: string[] = [];

      for (const asset of selected) {
        const info = await MediaLibrary.getAssetInfoAsync(asset.id);
        if (info.localUri) uris.push(info.localUri);
      }

      useImageStore.getState().setSelectedImages(uris);
    };

    saveUris();
  }, [selected]);

  if (hasPermission === false) return null;

  return (
    <View style={{ maxHeight: 600 }}>
      <FlatList
        data={photos}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
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
            aspectRatio={
              aspectRatio === 1
                ? '1:1'
                : aspectRatio === 9 / 16
                  ? '9:16'
                  : undefined
            }
            mode={mode}
          />
        )}
      />
    </View>
  );
}
