import { Platform } from 'react-native';
import LottieAnimationNative from 'lottie-react-native';
import LottieAnimationWeb from 'lottie-react';
import loadingAnimation from '@/assets/lotties/Loading.json';

export default function Loading() {
  if (Platform.OS === 'web') {
    return (
      <LottieAnimationWeb
        animationData={loadingAnimation}
        loop
        autoplay
        style={{ width: 54, height: 20 }}
      />
    );
  }

  return (
    <LottieAnimationNative
      source={loadingAnimation}
      autoPlay
      loop
      style={{ width: 54, height: 20 }}
    />
  );
}
