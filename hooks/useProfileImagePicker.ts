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
  const [loading, setLoading] = useState(false); // 공통 로딩
  const [initialized, setInitialized] = useState(false); // 첫 로딩 완료 여부

  // 권한 요청
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  };

  // 사진 로딩
  const fetchPhotos = useCallback(
    async (opts?: { reset?: boolean }) => {
      if (loading) return; // 중복 호출 가드
      setLoading(true);
      try {
        const perm =
          hasPermission === null
            ? await MediaLibrary.getPermissionsAsync()
            : { status: hasPermission ? 'granted' : ('denied' as const) };

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
    [hasPermission, pageInfo.endCursor, loading, initialized],
  );

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

  const initialLoading = !initialized && loading; // 첫 로딩 스피너 용
  const pagingLoading = initialized && loading; // 페이징 스피너 용

  return {
    photos,
    selected,
    hasPermission,
    requestPermission,
    toggleSelect,
    fetchPhotos,
    initialLoading,
    pagingLoading,
    hasNextPage: pageInfo?.hasNextPage,
  };
}
