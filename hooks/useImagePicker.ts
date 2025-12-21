import * as MediaLibrary from 'expo-media-library';
import useFeedImagePicker from './useFeedImagePicker';
import useProfileImagePicker from './useProfileImagePicker';
import { SelectedImage } from '@/stores/feedWriteStore';

type Mode = 'profile' | 'feed';

export default function useImagePicker({
  mode,
  maxSelect,
  onChange,
}: {
  mode: Mode;
  maxSelect: number;
  onChange?: (uris: string[]) => void;
}) {
  const feedPicker = useFeedImagePicker({
    maxSelect,
    onChange,
  });

  const profilePicker = useProfileImagePicker({
    maxSelect: 1,
    onChange,
  });

  const picker = mode === 'profile' ? profilePicker : feedPicker;

  /** 공통 값 */
  const {
    photos,
    hasPermission,
    requestPermission,
    fetchPhotos,
    hasNextPage,
    initialLoading,
    pagingLoading,
    toggleSelect,
  } = picker;

  /** 선택 여부  */
  const isSelected = (asset: MediaLibrary.Asset) => {
    if (mode === 'profile') {
      return profilePicker.selected?.assetId === asset.id;
    }
    return feedPicker.selected.some((s) => s.assetId === asset.id);
  };

  /** feed 전용 */
  const getSelectionNumber =
    mode === 'feed' ? feedPicker.getSelectionNumber : undefined;

  /** profile 전용 */
  const selectedProfile: SelectedImage | null =
    mode === 'profile'
      ? profilePicker.selected
        ? {
            assetId: profilePicker.selected.assetId,
            uri: profilePicker.selected.uri,
            filename: profilePicker.selected.filename,
          }
        : null
      : null;

  return {
    photos,
    hasPermission,
    requestPermission,
    fetchPhotos,
    hasNextPage,
    initialLoading,
    pagingLoading,
    toggleSelect,
    isSelected,
    getSelectionNumber,
    selectedProfile,
  };
}
