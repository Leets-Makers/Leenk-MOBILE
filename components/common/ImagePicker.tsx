import { useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { ThumbnailItem, Loading } from '@/components';
import useFeedImagePicker from '@/hooks/useFeedImagePicker';
import useProfileImagePicker from '@/hooks/useProfileImagePicker';
import { CONTAINER_PADDING, NUM_COLUMNS } from '@/constants';
import { AspectRatio } from '@/types/aspect-ratio';
import { height, width } from '@/theme/globalStyles';
import { SelectedImage } from '@/stores/feedWriteStore';
import { useToastStore } from '@/stores/toastStore';
import useImagePicker from '@/hooks/useImagePicker';

interface ImagePickerProps {
  maxSelect: number;
  aspectRatio: AspectRatio; // 1:1(SQUARE) or 9:16(PORTRAIT)
  mode?: 'profile' | 'feed'; // 프로필 이미지 선택인지 피드 이미지 선택인지 구분
  onSelect?: (uris: string[]) => void; // 선택된 사진이 1장일 경우 외부로 사진 바로 전달
  onSelectProfile?: (image: SelectedImage | null) => void;
}

export default function ImagePicker({
  maxSelect,
  aspectRatio = AspectRatio.SQUARE,
  mode = 'profile',
  onSelect,
  onSelectProfile,
}: ImagePickerProps) {
  const { showToast } = useToastStore();

  const {
    photos,
    hasPermission,
    requestPermission,
    fetchPhotos,
    hasNextPage,
    initialLoading,
    pagingLoading,
    toggleSelect,
    isSelected,
    getSelectionNumber,
    selectedProfile,
  } = useImagePicker({
    mode,
    maxSelect,
    onChange: onSelect,
  });

  /* profile 선택값 부모로 전달 */
  useEffect(() => {
    if (mode === 'profile' && onSelectProfile) {
      onSelectProfile(selectedProfile ?? null);
    }
  }, [mode, selectedProfile, onSelectProfile]);

  /* 권한 요청 + 초기 로딩 */
  useEffect(() => {
    (async () => {
      try {
        const granted = await requestPermission();
        if (granted) {
          await fetchPhotos();
        }
      } catch (error) {
        console.error('이미지 권한 요청 또는 사진 가져오기 실패:', error);
        showToast(
          '사진을 불러올 수 없어. 설정에서 사진 접근 권한을 확인해줘!',
          'error',
        );
      }
    })();
  }, [requestPermission, fetchPhotos]);

  if (initialLoading) return <Loading />;
  if (hasPermission === false) return null;

  return (
    <View style={{ flex: 1, maxHeight: 600 }}>
      <FlatList
        data={photos}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 4 * width,
        }}
        contentContainerStyle={{
          paddingBottom: 100 * height,
          paddingHorizontal: CONTAINER_PADDING * width,
        }}
        showsVerticalScrollIndicator
        style={{ flexGrow: 1 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !pagingLoading) {
            fetchPhotos?.();
          }
        }}
        initialNumToRender={12}
        windowSize={5}
        removeClippedSubviews
        ListFooterComponent={pagingLoading ? <Loading /> : null}
        renderItem={({ item }) => (
          <ThumbnailItem
            asset={item}
            aspectRatio={aspectRatio}
            mode={mode}
            maxSelect={maxSelect}
            isSelected={isSelected(item)}
            selectionNumber={
              getSelectionNumber ? getSelectionNumber(item.id) : null
            }
            onToggle={() => toggleSelect?.(item)}
          />
        )}
      />
    </View>
  );
}
