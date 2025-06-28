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

  //  [1] 권한 요청 함수 (다시 포함시킴)
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  };

  //  [2] 최초 진입 시 권한 요청 + 사진 가져오기
  useEffect(() => {
    const init = async () => {
      const granted = await requestPermission();
      if (granted) {
        await fetchPhotos();
      }
    };
    init();
  }, []);

  // [3] 권한이 있을 때만 사진 fetch
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
