import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import { HeartIcon } from '@/assets';

interface Props {
  onComplete: () => void;
  color?: string;
}

const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-14px);
`;

export default function FloatingHeart({ onComplete, color }: Props) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(Math.random() * 10 - 5);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value + 10 },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.6, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    // 위로 올라가기
    translateY.value = withTiming(-550, {
      duration: 1500,
      easing: Easing.out(Easing.linear),
    });

    // 좌우 흔들림 반복
    translateX.value = withRepeat(
      withSequence(
        withTiming(translateX.value + 10, { duration: 300 }),
        withTiming(translateX.value - 10, { duration: 300 }),
      ),
      5, // 5번 반복
      true, // 되돌아오기
    );

    // 사라짐
    opacity.value = withTiming(0, { duration: 1000 }, (finished) => {
      if (finished) runOnJS(onComplete)();
    });
  }, []);

  return (
    <AnimatedContainer style={animatedStyle}>
      <HeartIcon width={28} height={28} color={color} />
    </AnimatedContainer>
  );
}
