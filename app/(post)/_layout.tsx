// (post)/_layout.tsx
import { Stack } from 'expo-router';

export default function PostLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true, // 화면 어디서든 스와이프 가능
        gestureDirection: 'horizontal',
      }}
    />
  );
}
