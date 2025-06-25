import React from 'react';
import { Dimensions, ImageBackground, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useImageStore } from '@/stores/feedImageStore';

const { width, height } = Dimensions.get('window');

export default function BackgroundImageSlider() {
  const selectedImages = useImageStore((state) => state.selectedImages);

  if (selectedImages.length === 0) return null;

  return (
    <Carousel
      loop
      width={width}
      height={height}
      data={selectedImages}
      renderItem={({ item }) => (
        <ImageBackground
          source={{ uri: item }}
          style={styles.background}
          resizeMode="cover"
        />
      )}
      autoPlay={false}
      scrollAnimationDuration={500}
      pagingEnabled
    />
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
});
