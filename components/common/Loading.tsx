import LottieAnimation from 'lottie-react-native';
import loadingAnimation from '@/assets/lotties/Loading.json';

export default function Loading() {
  return (
    <LottieAnimation
      source={loadingAnimation}
      autoPlay
      loop
      style={{ width: 54, height: 20 }}
    />
  );
}
