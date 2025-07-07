import { useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { SelectedImage, useFeedWriteStore } from '@/stores/feedWriteStore';

export default function useImagePicker({
  maxSelect = 3,
  onChange,
}: {
  maxSelect: number;
  onChange?: (selected: string[]) => void;
}) {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [pageInfo, setPageInfo] = useState<{
    endCursor: string | null;
    hasNextPage: boolean;
  }>({ endCursor: null, hasNextPage: false });

  const selectedUris = useFeedWriteStore((state) => state.selectedImages);
  const setSelectedImages = useFeedWriteStore(
    (state) => state.setSelectedImages,
  );

  // 권한 요청
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  };

  // 사진 로딩
  const fetchPhotos = useCallback(async () => {
    const perm = await MediaLibrary.getPermissionsAsync();

    if (perm.status !== 'granted') return;

    const { assets, endCursor, hasNextPage } =
      await MediaLibrary.getAssetsAsync({
        first: 50,
        after: pageInfo?.endCursor ?? undefined,
        mediaType: MediaLibrary.MediaType.photo,
      });
    let assetsWithLocalUri: MediaLibrary.Asset[] = [];
    console.log('🚨 전체 asset 로그:', JSON.stringify(assets, null, 2));

    if (Platform.OS === 'ios') {
      const assetInfoPromises = assets.map(async (asset) => {
        try {
          const info = await MediaLibrary.getAssetInfoAsync(asset.id);
          return {
            ...asset,
            uri: info.localUri ?? asset.uri,
          };
        } catch (e) {
          console.warn('asset info error', e);
          return asset; // fallback
        }
      });
      assetsWithLocalUri = await Promise.all(assetInfoPromises);
    } else {
      assetsWithLocalUri = assets;
    }

    setPhotos((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newAssets = assetsWithLocalUri.filter(
        (asset) => !existingIds.has(asset.id),
      );
      return [...prev, ...newAssets];
    });

    setPageInfo({ endCursor, hasNextPage });
    console.log('📸 가져온 사진 개수:', assets.length);
  }, [pageInfo]);

  // 선택 상태 변경
  const toggleSelect = (photo: MediaLibrary.Asset) => {
    const isSelected = selectedUris.some((item) => item.uri === photo.uri);
    let updatedUris: SelectedImage[];

    if (isSelected) {
      updatedUris = selectedUris.filter((item) => item.uri !== photo.uri);
    } else if (selectedUris.length < maxSelect) {
      updatedUris = [
        ...selectedUris,
        { uri: photo.uri, filename: photo.filename },
      ];
    } else {
      return;
    }

    setSelectedImages(updatedUris);
  };

  const getSelectionNumber = (photoId: string) => {
    const photoUri = photos.find((photo) => photo.id === photoId)?.uri;
    const index = selectedUris.findIndex((item) => item.uri === photoUri);
    return index >= 0 ? index + 1 : null;
  };

  return {
    photos,
    selected: photos.filter((photo) =>
      selectedUris.some((item) => item.uri === photo.uri),
    ),
    hasPermission,
    requestPermission,
    toggleSelect,
    getSelectionNumber,
    fetchPhotos,
    hasNextPage: pageInfo?.hasNextPage,
  };
}
