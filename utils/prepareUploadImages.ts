import * as MediaLibrary from 'expo-media-library';
import { SelectedImage } from '@/stores/feedWriteStore';

export interface UploadImage {
  uri: string; // 반드시 file://
  filename: string;
  mimeType?: string;
}

export async function prepareUploadImages(
  images: SelectedImage[],
): Promise<UploadImage[]> {
  return Promise.all(
    images.map(async (img) => {
      if (!img.assetId) {
        throw new Error('assetId is required for upload');
      }

      const info = await MediaLibrary.getAssetInfoAsync(img.assetId);

      if (!info.localUri) {
        throw new Error('Failed to resolve localUri for upload');
      }

      return {
        uri: info.localUri,
        filename: img.filename ?? 'image.jpg',
      };
    }),
  );
}
