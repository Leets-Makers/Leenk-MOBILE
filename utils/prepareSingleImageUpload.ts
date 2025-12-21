// leenk 단일 이미지

// utils/prepareSingleImageUpload.ts
import * as MediaLibrary from 'expo-media-library';

export async function prepareSingleImageUpload(uri: string): Promise<string> {
  // 이미 file:// 이거나 https:// 이면 그대로 사용
  if (!uri.startsWith('ph://')) {
    return uri;
  }

  // 권한 최신 상태 보장
  await MediaLibrary.getPermissionsAsync();

  const assetId = uri.replace('ph://', '');
  const asset = await MediaLibrary.getAssetInfoAsync(assetId);

  if (!asset.localUri) {
    throw new Error('사진을 불러올 수 없어. 권한을 확인해줘.');
  }

  return asset.localUri; // file://
}
