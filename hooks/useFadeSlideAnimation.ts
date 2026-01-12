/* 
UserListModal, TextInputModal에 적용되는 모달 뒷배경 그림자 애니메이션 훅
*/

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { height } from '@/theme/globalStyles';

type AnimationPreset = 'default' | 'soft';

const SPRING_PRESETS = {
  default: {
    damping: 20,
    stiffness: 220,
    mass: 0.6,
  },
  soft: {
    damping: 38,
    stiffness: 130,
    mass: 1.8,
  },
};

interface Options {
  visible: boolean;
  initialOffset?: number;
  preset?: AnimationPreset;
}

export function useFadeSlideAnimation({
  visible,
  initialOffset = 500 * height,
  preset = 'default',
}: Options) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(initialOffset)).current;

  const springConfig = SPRING_PRESETS[preset];

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(initialOffset);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),

        Animated.spring(slideAnim, {
          toValue: 0,
          ...springConfig,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: initialOffset,
          stiffness: 140,
          damping: 28,
          mass: 1.0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim, initialOffset]);

  return {
    backdropStyle: { opacity: fadeAnim },
    sheetStyle: {
      transform: [{ translateY: slideAnim }],
    },
  };
}
