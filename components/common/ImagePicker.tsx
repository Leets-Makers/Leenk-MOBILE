// components/ImagePicker/ImagePicker.tsx
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import ThumbnailItem from '@/components/common/ThumbnailItem';
import useImagePicker from '@/hooks/useImagePicker';
import {
  CONTAINER_PADDING,
  NUM_COLUMNS,
} from '@/constants/dimension.constants';

interface ImagePickerProps {
  maxSelect: number;
  aspectRatio: number;
  onChange: (selected: MediaLibrary.Asset[]) => void;
}

export default function ImagePicker({
  maxSelect,
  aspectRatio,
  onChange,
}: ImagePickerProps) {
  const {
    photos,
    selected,
    toggleSelect,
    getSelectionNumber,
    hasPermission,
    fetchPhotos,
  } = useImagePicker({ maxSelect, onChange });

  useEffect(() => {
    fetchPhotos();
  }, []);

  if (hasPermission === false) return null;

  return (
    <FlatList
      data={photos}
      numColumns={NUM_COLUMNS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: CONTAINER_PADDING,
      }}
      columnWrapperStyle={{
        justifyContent: 'space-between',
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
        />
      )}
    />
  );
}
