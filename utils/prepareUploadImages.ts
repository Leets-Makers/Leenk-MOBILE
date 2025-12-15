import * as MediaLibrary from 'expo-media-library';
import { SelectedImage } from '@/stores/feedWriteStore';

export interface UploadImage {
  uri: string;
  filename?: string;
  mimeType?: string;
}

export async function prepareUploadImages(
  images: SelectedImage[],
): Promise<UploadImage[]> {
  return Promise.all(
    images.map(async (img) => {
      if (!img.assetId) {
        // fallback: assetId is undefined
        return {
          uri: img.uri,
          filename: img.filename,
        };
      }
      const info = await MediaLibrary.getAssetInfoAsync(img.assetId);

      return {
        uri: info.localUri ?? img.uri,
        filename: img.filename,
      };
    }),
  );
}
