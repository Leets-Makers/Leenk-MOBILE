import React, { useEffect } from 'react';
import { FlatList, Platform, View } from 'react-native';
import { ThumbnailItem } from '@/components';
import useFeedImagePicker from '@/hooks/useFeedImagePicker';
import { NUM_COLUMNS } from '@/constants';
import { AspectRatio } from '@/types/aspect-ratio';
import { width } from '@/theme/globalStyles';
import useProfileImagePicker from '@/hooks/useProfileImagePicker';

interface ImagePickerProps {
  maxSelect: number;
  aspectRatio: AspectRatio; // 1:1(SQUARE) or 9:16(PORTRAIT)
  mode?: 'profile' | 'feed'; // 프로필 이미지 선택인지 피드 이미지 선택인지 구분
  onSelect?: (uris: string[]) => void; // 선택된 사진이 1장일 경우 외부로 사진 바로 전달
}

export default function ImagePicker({
  maxSelect,
  aspectRatio = AspectRatio.SQUARE,
  mode = 'profile',
  onSelect,
}: ImagePickerProps) {
  const picker =
    mode === 'profile'
      ? useProfileImagePicker({ maxSelect, onChange: onSelect })
      : useFeedImagePicker({ maxSelect, onChange: onSelect });

  const {
    photos,
    selected,
    hasPermission,
    requestPermission,
    fetchPhotos,
    hasNextPage,
    toggleSelect,
  } = picker;

  const getSelectionNumber =
    mode === 'feed' && 'getSelectionNumber' in picker
      ? picker.getSelectionNumber
      : undefined;

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
        initialNumToRender={20}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={({ item }) => (
          <ThumbnailItem
            asset={item}
            aspectRatio={aspectRatio}
            mode={mode}
            maxSelect={maxSelect}
            isSelected={
              mode === 'profile'
                ? !!(
                    selected &&
                    !Array.isArray(selected) &&
                    selected.id === item.id
                  )
                : Array.isArray(selected) &&
                  selected.some((s) => s.uri === item.uri)
            }
            selectionNumber={
              mode === 'feed' ? (getSelectionNumber?.(item.id) ?? null) : null
            }
            onToggle={() => toggleSelect(item)}
          />
        )}
      />
    </View>
  );
}
