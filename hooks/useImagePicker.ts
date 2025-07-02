import { useEffect, useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export default function useImagePicker({
  maxSelect = 3,
  onChange,
}: {
  maxSelect: number;
  onChange?: (selected: string[]) => void;
}) {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [selected, setSelected] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [pageInfo, setPageInfo] = useState<{
    endCursor: string | null;
    hasNextPage: boolean;
  }>({ endCursor: null, hasNextPage: false });

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    console.log('권한요청: ', granted);
    return granted;
  };

  const fetchPhotos = useCallback(async () => {
    const perm = await MediaLibrary.getPermissionsAsync();

    console.log('📸 fetchPhotos 내부 권한 상태:', perm.status);

    if (perm.status !== 'granted') return;

    const { assets, endCursor, hasNextPage } =
      await MediaLibrary.getAssetsAsync({
        first: 50,
        after: pageInfo?.endCursor ?? undefined,
        mediaType: MediaLibrary.MediaType.photo,
      });
    console.log('📸 getAssetsAsync 호출 직후 asset 수:', assets.length);
    const assetsWithLocalUri: MediaLibrary.Asset[] = [];
    console.log('🚨 전체 asset 로그:', JSON.stringify(assets, null, 2));

    for (const asset of assets) {
      let uri = asset.uri;

      if (Platform.OS === 'ios') {
        const info = await MediaLibrary.getAssetInfoAsync(asset.id);
        uri = info.localUri ?? asset.uri;
      }

      assetsWithLocalUri.push({
        ...asset,
        uri,
      });
    }
    console.log('assets with local uri : ', assetsWithLocalUri);

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

  const toggleSelect = async (photo: MediaLibrary.Asset) => {
    const isSelected = selected.find((item) => item.id === photo.id);
    let updated;
    if (isSelected) {
      updated = selected.filter((item) => item.id !== photo.id);
    } else if (selected.length < maxSelect) {
      updated = [...selected, photo];
    } else {
      return;
    }

    setSelected(updated);
    if (onChange) {
      // Asset[] → localUri[] 변환
      const uris: string[] = [];

      for (const asset of updated) {
        const info = await MediaLibrary.getAssetInfoAsync(asset.id);
        if (info.localUri) {
          uris.push(info.localUri);
        }
      }

      onChange(uris);
    }
  };

  const getSelectionNumber = (photoId: string) => {
    const index = selected.findIndex((item) => item.id === photoId);
    return index >= 0 ? index + 1 : null;
  };

  return {
    photos,
    selected,
    hasPermission,
    requestPermission,
    toggleSelect,
    getSelectionNumber,
    fetchPhotos,
    hasNextPage: pageInfo?.hasNextPage,
  };
}
