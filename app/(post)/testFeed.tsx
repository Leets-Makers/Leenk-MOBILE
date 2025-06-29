// screens/TestImagePickerScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ImagePicker } from '@/components';
import { AspectRatio } from '@/types/aspect-ratio';

export default function TestImagePickerScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 60 }}>
      <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
        ✅ 이미지 피커 테스트
      </Text>
      <ImagePicker maxSelect={3} aspectRatio={AspectRatio.SQUARE} />
    </View>
  );
}
