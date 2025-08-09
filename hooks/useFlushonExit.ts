import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * 페이지를 벗어날 때 flush 함수를 호출하는 훅
 * - 뒤로가기 버튼
 * - iOS 스와이프 제스처
 */
export default function useFlushOnExit(
  shouldFlush: boolean,
  flushFn: () => void,
  condition: number = 0, // 예: localCount
) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!shouldFlush) return;

      const onBeforeRemove = () => {
        if (condition > 0) {
          flushFn();
        }
      };

      const unsubscribe = navigation.addListener(
        'beforeRemove',
        onBeforeRemove,
      );

      return () => {
        unsubscribe();
      };
    }, [shouldFlush, flushFn, condition]),
  );
}
