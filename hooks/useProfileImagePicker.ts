import { useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

interface ProfileImageProps {
  maxSelect: number;
  onChange?: (selected: string[]) => void;
}

export default function useProfileImagePicker({
  maxSelect = 1,
  onChange,
}: ProfileImageProps) {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [selected, setSelected] = useState<MediaLibrary.Asset | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [pageInfo, setPageInfo] = useState<{
    endCursor: string | null;
    hasNextPage: boolean;
  }>({ endCursor: null, hasNextPage: false });

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
          return asset;
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
  }, [pageInfo?.endCursor]);

  // 선택 상태 변경 (단일 선택)
  const toggleSelect = (photo: MediaLibrary.Asset) => {
    setSelected((prev) => {
      const newSelected = prev?.id === photo.id ? null : photo;
      //  선택 후 onChange 호출
      if (onChange) {
        onChange(newSelected ? [newSelected.uri] : []);
      }
      return newSelected;
    });
  };

  return {
    photos,
    selected,
    hasPermission,
    requestPermission,
    toggleSelect,
    fetchPhotos,
    hasNextPage: pageInfo?.hasNextPage,
  };
}
