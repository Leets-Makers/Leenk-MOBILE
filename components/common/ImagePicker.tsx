import React, { useEffect } from 'react';
import { FlatList, Platform, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { ThumbnailItem } from '@/components';
import useImagePicker from '@/hooks/useImagePicker';
import { NUM_COLUMNS } from '@/constants';
import { useImageStore } from '@/stores/feedImageStore';
import { AspectRatio } from '@/types/aspect-ratio';

interface ImagePickerProps {
  maxSelect: number;
  aspectRatio: AspectRatio; // 1:1(SQUARE) or 9:16(PORTRAIT)
  mode?: 'profile' | 'feed'; // 프로필 이미지 선택인지 피드 이미지 선택인지 구분
}

export default function ImagePicker({
  maxSelect,
  aspectRatio = AspectRatio.SQUARE,
  mode = 'profile',
}: ImagePickerProps) {
  const {
    photos,
    selected,
    toggleSelect,
    getSelectionNumber,
    requestPermission,
    hasPermission,
    fetchPhotos,
    hasNextPage,
  } = useImagePicker({ maxSelect });

  useEffect(() => {
    (async () => {
      const granted = await requestPermission();
      if (granted) {
        fetchPhotos();
      }
    })();
  }, []);

  // Zustand에 URI 저장
  useEffect(() => {
    console.log(
      '[🔁 useEffect triggered] selected:',
      selected.map((s) => s.filename),
    );

    const saveUris = async () => {
      const uris: string[] = [];

      for (const asset of selected) {
        try {
          let uri = asset.uri;

          if (Platform.OS === 'ios') {
            const info = await MediaLibrary.getAssetInfoAsync(asset.id);
            console.log('📷 [iOS] asset info:', info);
            uri = info.localUri ?? asset.uri;
          }

          if (uri) {
            console.log('✅ uri pushed:', uri);
            uris.push(uri);
          } else {
            console.log('❌ uri not found for', asset.filename);
          }
        } catch (error) {
          console.log('🚨 getAssetInfoAsync 오류 발생:', error);
        }
      }

      console.log('🔥 최종 uris:', uris);

      useImageStore.getState().setSelectedImages(uris);

      const stateUris = useImageStore.getState().selectedImages;
      console.log('[🧠 store selectedImages]:', stateUris);
    };

    saveUris();
  }, [selected]);

  if (hasPermission === false) return null;

  return (
    <View style={{ flex: 1, maxHeight: 600 }}>
      <FlatList
        data={photos}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ flexGrow: 1 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage) fetchPhotos();
        }}
        renderItem={({ item }) => (
          <ThumbnailItem
            asset={item}
            selected={selected}
            onToggle={toggleSelect}
            getSelectionNumber={getSelectionNumber}
            aspectRatio={aspectRatio}
            mode={mode}
          />
        )}
      />
    </View>
  );
}
