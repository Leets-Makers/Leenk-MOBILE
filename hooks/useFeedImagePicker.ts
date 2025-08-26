// useFeedImagePicker.ts
import { useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
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
            first: 24,
            after,
            mediaType: MediaLibrary.MediaType.photo,
          });

        let normalized = assets;
        if (Platform.OS === 'ios') {
          const infos = await Promise.all(
            assets.map((a) =>
              MediaLibrary.getAssetInfoAsync(a.id).catch(() => null),
            ),
          );
          normalized = assets.map((a, i) => ({
            ...a,
            uri: infos[i]?.localUri ?? a.uri,
          }));
        }

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
    const isSelected = selected.some((i) => i.uri === photo.uri);
    let next: SelectedImage[];
    if (isSelected) next = selected.filter((i) => i.uri !== photo.uri);
    else if (selected.length < maxSelect)
      next = [...selected, { uri: photo.uri, filename: photo.filename }];
    else return;

    setSelected(next);
    onChange?.(next.map((n) => n.uri));
  };

  const getSelectionNumber = (photoId: string) => {
    const uri = photos.find((p) => p.id === photoId)?.uri;
    const idx = selected.findIndex((i) => i.uri === uri);
    return idx >= 0 ? idx + 1 : null;
  };

  // 화면에서 쓰기 편하도록 파생 상태 제공
  const initialLoading = !initialized && loading; // 첫 로딩
  const pagingLoading = initialized && loading; // 추가 로딩

  return {
    photos,
    selected: photos.filter((p) => selected.some((i) => i.uri === p.uri)),
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
