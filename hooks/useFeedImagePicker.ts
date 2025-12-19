// useFeedImagePicker.ts
import { useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { SelectedImage, useFeedWriteStore } from '@/stores/feedWriteStore';

type PageInfo = { endCursor: string | null; hasNextPage: boolean };

export default function useFeedImagePicker({
  maxSelect = 3,
  onChange,
}: {
  maxSelect: number;
  onChange?: (selected: string[]) => void;
}) {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    endCursor: null,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false); // 첫 로딩 구분용

  const selected = useFeedWriteStore((s) => s.selectedImages);
  const setSelected = useFeedWriteStore((s) => s.setSelectedImages);

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  };

  const fetchPhotos = useCallback(
    async (opts?: { reset?: boolean }) => {
      if (loading) return;

      setLoading(true);
      try {
        const perm =
          hasPermission === null
            ? await MediaLibrary.getPermissionsAsync()
            : { status: hasPermission ? 'granted' : 'denied' };
        if (perm.status !== 'granted') {
          setHasPermission(false);
          return;
        }
        if (hasPermission === null) setHasPermission(true);

        const after = opts?.reset
          ? undefined
          : (pageInfo.endCursor ?? undefined);

        const { assets, endCursor, hasNextPage } =
          await MediaLibrary.getAssetsAsync({
            first: 50,
            after,
            mediaType: MediaLibrary.MediaType.photo,
          });

        let normalized = assets;

        setPhotos((prev) => {
          const base = opts?.reset ? [] : prev;
          const seen = new Set(base.map((p) => p.id));
          return [...base, ...normalized.filter((a) => !seen.has(a.id))];
        });

        setPageInfo({ endCursor, hasNextPage });
        if (!initialized) setInitialized(true);
      } finally {
        setLoading(false);
      }
    },
    [hasPermission, loading, pageInfo.endCursor, initialized],
  );

  const refresh = useCallback(
    () => fetchPhotos({ reset: true }),
    [fetchPhotos],
  );

  const toggleSelect = (photo: MediaLibrary.Asset) => {
    const isSelected = selected.some((i) => i.assetId === photo.id);

    let next: SelectedImage[];

    if (isSelected) {
      next = selected.filter((i) => i.assetId !== photo.id);
    } else if (selected.length < maxSelect) {
      next = [
        ...selected,
        {
          assetId: photo.id,
          uri: photo.uri, // ph:// 그대로
          filename: photo.filename,
        },
      ];
    } else {
      return;
    }

    setSelected(next);
    onChange?.(next.map((n) => n.uri));
  };

  const getSelectionNumber = (photoId: string) => {
    const idx = selected.findIndex((i) => i.assetId === photoId);
    return idx >= 0 ? idx + 1 : null;
  };

  // 화면에서 쓰기 편하도록 파생 상태 제공
  const initialLoading = !initialized && loading; // 첫 로딩
  const pagingLoading = initialized && loading; // 추가 로딩

  return {
    photos,
    selected,
    hasPermission,
    requestPermission,
    fetchPhotos,
    refresh,
    hasNextPage: pageInfo.hasNextPage,
    loading,
    initialLoading,
    pagingLoading,
    toggleSelect,
    getSelectionNumber,
  };
}
