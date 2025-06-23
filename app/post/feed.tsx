// pages/post/feed.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ImagePicker from '@/components/common/ImagePicker';
import type * as MediaLibrary from 'expo-media-library';

export default function PostFeedPage() {
  const [selectedImages, setSelectedImages] = useState<MediaLibrary.Asset[]>(
    [],
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 16 }}>
        피드 글쓰기
      </Text>
      <ImagePicker
        maxSelect={3}
        aspectRatio={4 / 3}
        onChange={setSelectedImages}
      />
    </View>
  );
}
