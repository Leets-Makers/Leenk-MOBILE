import { useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { ThumbnailItem, Loading } from '@/components';
import useFeedImagePicker from '@/hooks/useFeedImagePicker';
import useProfileImagePicker from '@/hooks/useProfileImagePicker';
import { CONTAINER_PADDING, NUM_COLUMNS } from '@/constants';
import { AspectRatio } from '@/types/aspect-ratio';
import { height, width } from '@/theme/globalStyles';
import { SelectedImage } from '@/stores/feedWriteStore';

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
  /* mode별 picker 분리  */
  const profilePicker =
    mode === 'profile'
      ? useProfileImagePicker({ maxSelect, onChange: onSelect })
      : null;

  const feedPicker =
    mode === 'feed'
      ? useFeedImagePicker({ maxSelect, onChange: onSelect })
      : null;

  /* 공통 사용 값 */
  const photos = profilePicker?.photos ?? feedPicker?.photos ?? [];
  const hasPermission =
    profilePicker?.hasPermission ?? feedPicker?.hasPermission ?? false;
  const requestPermission =
    profilePicker?.requestPermission ?? feedPicker?.requestPermission;
  const fetchPhotos = profilePicker?.fetchPhotos ?? feedPicker?.fetchPhotos;
  const hasNextPage =
    profilePicker?.hasNextPage ?? feedPicker?.hasNextPage ?? false;
  const toggleSelect = profilePicker?.toggleSelect ?? feedPicker?.toggleSelect;

  const initialLoading =
    profilePicker?.initialLoading ?? feedPicker?.initialLoading ?? false;
  const pagingLoading =
    profilePicker?.pagingLoading ?? feedPicker?.pagingLoading ?? false;

  /* feed 전용 */
  const getSelectionNumber =
    mode === 'feed' ? feedPicker?.getSelectionNumber : undefined;
  const selectedFeed = feedPicker?.selected ?? [];

  const prevSelectedRef = useRef<string | null>(null);

  /* profile 선택값 부모로 전달 */
  useEffect(() => {
    if (mode !== 'profile') return;
    if (!onSelectProfile) return;
    if (!profilePicker) return;

    const selected = profilePicker.selected;
    const currentId = selected?.assetId ?? null;

    if (prevSelectedRef.current === currentId) return;

    prevSelectedRef.current = currentId;

    if (selected) {
      onSelectProfile({
        assetId: selected.assetId ?? '',
        uri: selected.uri ?? '',
        filename: selected.filename ?? '',
      });
    } else {
      onSelectProfile(null);
    }
  }, [mode, profilePicker?.selected]);

  /*  권한 요청 + 초기 로딩 */
  useEffect(() => {
    (async () => {
      try {
        const granted = await requestPermission?.();
        if (granted) {
          await fetchPhotos?.();
        }
      } catch (error) {
        console.error('이미지 권한 요청 또는 사진 가져오기 실패:', error);
      }
    })();
  }, []);

  if (hasPermission === false) return null;
  if (initialLoading) return <Loading />;

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
            isSelected={
              mode === 'profile'
                ? profilePicker?.selected?.uri === item.uri
                : selectedFeed.some((s) => s.uri === item.uri)
            }
            selectionNumber={
              mode === 'feed' ? (getSelectionNumber?.(item.id) ?? null) : null
            }
            onToggle={() => toggleSelect?.(item)}
          />
        )}
      />
    </View>
  );
}
