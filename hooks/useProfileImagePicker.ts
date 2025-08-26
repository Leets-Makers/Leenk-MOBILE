import { useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

type PageInfo = { endCursor: string | null; hasNextPage: boolean };

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

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    endCursor: null,
    hasNextPage: false,
  });

  // 공통 로딩 상태
  const [loading, setLoading] = useState(false);
  // 첫 로딩 완료 여부
  const [initialized, setInitialized] = useState(false);

  /** iOS 'limited' 도 허용으로 간주해서 boolean 리턴 */
  const isGranted = (
    perm:
      | MediaLibrary.PermissionResponse
      | (MediaLibrary.PermissionResponse & {
          accessPrivileges?: 'all' | 'limited' | 'none';
        }),
  ) =>
    perm.status === 'granted' ||
    (Platform.OS === 'ios' && perm.accessPrivileges !== 'none');

  /** 권한 요청 */
  const requestPermission = async (): Promise<boolean> => {
    const perm =
      (await MediaLibrary.requestPermissionsAsync()) as MediaLibrary.PermissionResponse & {
        accessPrivileges?: 'all' | 'limited' | 'none';
      };
    const granted = isGranted(perm);
    setHasPermission(granted);
    return granted;
  };

  /** 사진 로딩 (초기/추가 공용) */
  const fetchPhotos = useCallback(
    async (opts?: { reset?: boolean }) => {
      if (loading) return; // 중복 호출 가드
      setLoading(true);
      try {
        // 항상 최신 권한 재조회 (설정에서 바꾼 뒤 복귀 케이스 대응)
        const perm =
          (await MediaLibrary.getPermissionsAsync()) as MediaLibrary.PermissionResponse & {
            accessPrivileges?: 'all' | 'limited' | 'none';
          };
        const granted = isGranted(perm);
        setHasPermission(granted);
        if (!granted) return;

        const after = opts?.reset
          ? undefined
          : (pageInfo.endCursor ?? undefined);

        const { assets, endCursor, hasNextPage } =
          await MediaLibrary.getAssetsAsync({
            first: 50,
            after,
            mediaType: MediaLibrary.MediaType.photo,
          });

        // iOS에서 localUri 확보
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
          const next = normalized.filter((a) => !seen.has(a.id));
          return [...base, ...next];
        });

        setPageInfo({ endCursor, hasNextPage });
        if (!initialized) setInitialized(true);
      } finally {
        setLoading(false);
      }
    },
    [pageInfo.endCursor, loading, initialized],
  );

  /** 리스트를 처음부터 다시 불러오기 */
  const refresh = useCallback(
    () => fetchPhotos({ reset: true }),
    [fetchPhotos],
  );

  /** 단일 선택 토글 */
  const toggleSelect = (photo: MediaLibrary.Asset) => {
    setSelected((prev) => {
      const next = prev?.id === photo.id ? null : photo;
      onChange?.(next ? [next.uri] : []);
      return next;
    });
  };

  // 화면에서 쓰기 편한 파생 상태
  const initialLoading = !initialized && loading; // 첫 로딩 스피너
  const pagingLoading = initialized && loading; // 더보기 스피너

  return {
    photos,
    selected,
    hasPermission,
    requestPermission,
    fetchPhotos,
    refresh,
    initialLoading,
    pagingLoading,
    hasNextPage: pageInfo.hasNextPage,
    toggleSelect,
  };
}
