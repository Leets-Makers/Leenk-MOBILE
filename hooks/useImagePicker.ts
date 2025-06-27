import { useEffect, useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';

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

  // const requestPermission = useCallback(async () => {
  //   const { status } = await MediaLibrary.requestPermissionsAsync();
  //   setHasPermission(status === 'granted');
  // }, []);

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  };

  const fetchPhotos = useCallback(async () => {
    const perm = await MediaLibrary.getPermissionsAsync();
    console.log('📸 fetchPhotos 내부 권한 상태:', perm.status);

    // if (!hasPermission) return;
    if (perm.status !== 'granted') return;

    const { assets, endCursor, hasNextPage } =
      await MediaLibrary.getAssetsAsync({
        // sortBy: [['creationTime', false]],
        first: 50,
        after: pageInfo?.endCursor ?? undefined,
        mediaType: MediaLibrary.MediaType.photo,
      });

    setPhotos((prev) => [...prev, ...assets]);
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
