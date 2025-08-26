import { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 키보드 상단에 딱 붙는 translateY 스타일을 돌려줌.
 * gap: 키보드와의 간격(px)
 */
export default function useKeyboardStickyReanimated(gap = 0) {
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard(); // QuickType 포함 높이/상태 제공

  // position: 'absolute', bottom: 0 로 두고 이 스타일만 붙이면 됨
  const animatedStyle = useAnimatedStyle(() => {
    const h = keyboard.height.value; // 키보드 전체 높이 (QuickType 포함)
    // 안전영역만큼은 남기고, gap 만큼만 추가 여백
    const offset = Math.max(0, h - insets.bottom - gap);
    return { transform: [{ translateY: -offset }] };
  });

  return animatedStyle;
}
