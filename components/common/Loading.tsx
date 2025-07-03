import LottieAnimation from 'lottie-react-native';

export default function Loading() {
  return (
    <LottieAnimation
      source={require('@/assets/lotties/Loading.json')}
      autoPlay
      loop
      style={{ width: 100, height: 100 }}
    />
  );
}
